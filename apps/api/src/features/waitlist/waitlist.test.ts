import assert from "node:assert/strict";
import test from "node:test";

process.env.NODE_ENV = "test";
process.env.DEBUG = "false";
process.env.LOG = "false";
process.env.LOG_LEVEL = "silent";
process.env.APP_NAME = "pipoca-agil-test";
process.env.PORT = "3002";
process.env.HOST = "127.0.0.1";
process.env.BASE_URL = "http://127.0.0.1:3002";
process.env.MAX_REQUESTS_PER_MINUTE = "100";
process.env.ALLOWED_ORIGINS = "http://127.0.0.1:3000";
process.env.DATABASE_URL =
  "postgresql://user:pass@localhost:5432/pipoca_agil_test";
process.env.AUTH_SECRET = "super-secret-for-tests";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const appModule = require("../../app");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const prismaModule = require("../../lib/prisma");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const authModule = require("../../lib/auth");

const app = appModule.default;
const prisma = prismaModule.default as any;
const auth = authModule.auth as any;

const defaultWaitlistEntry = {
  id: "waitlist-1",
  name: "Ana Interessada",
  email: "ana@example.com",
  role: "PO",
  message: "Quero conhecer a plataforma",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const restoreFns: Array<() => void> = [];

const stub = <T extends object, K extends keyof T>(
  target: T,
  key: K,
  value: T[K],
) => {
  const original = target[key];
  target[key] = value;
  restoreFns.push(() => {
    target[key] = original;
  });
};

const resetStubs = () => {
  while (restoreFns.length > 0) {
    restoreFns.pop()?.();
  }
};

test.after(async () => {
  resetStubs();
  await app.close();
});

test.afterEach(() => {
  resetStubs();
});

test("POST /api/waitlist cria uma nova inscrição", async () => {
  stub(prisma.waitlist, "findUnique", async () => null);
  stub(prisma.waitlist, "create", async () => defaultWaitlistEntry);

  const response = await app.inject({
    method: "POST",
    url: "/api/waitlist",
    payload: {
      name: defaultWaitlistEntry.name,
      email: defaultWaitlistEntry.email,
      role: defaultWaitlistEntry.role,
      message: defaultWaitlistEntry.message,
    },
  });

  assert.equal(response.statusCode, 201);
  const body = response.json();
  assert.equal(body.success, true);
  assert.equal(body.data.email, defaultWaitlistEntry.email);
});

test("POST /api/waitlist é idempotente por email", async () => {
  stub(prisma.waitlist, "findUnique", async () => defaultWaitlistEntry);
  stub(prisma.waitlist, "create", async () => {
    throw new Error("não deveria criar um novo registro");
  });

  const response = await app.inject({
    method: "POST",
    url: "/api/waitlist",
    payload: {
      name: defaultWaitlistEntry.name,
      email: defaultWaitlistEntry.email,
    },
  });

  assert.equal(response.statusCode, 200);
  const body = response.json();
  assert.equal(body.data.id, defaultWaitlistEntry.id);
});

test("GET /api/waitlist exige sessão autenticada", async () => {
  stub(auth.api, "getSession", async () => null as never);

  const response = await app.inject({
    method: "GET",
    url: "/api/waitlist",
  });

  assert.equal(response.statusCode, 401);
});

test("GET /api/waitlist bloqueia usuário sem papel ADMIN", async () => {
  stub(
    auth.api,
    "getSession",
    async () => ({ user: { id: "user-1" } }) as never,
  );
  stub(prisma.user, "findUnique", async () => ({ role: ["USER"] }));

  const response = await app.inject({
    method: "GET",
    url: "/api/waitlist",
  });

  assert.equal(response.statusCode, 403);
});

test("GET /api/waitlist retorna a lista paginada para ADMIN", async () => {
  stub(
    auth.api,
    "getSession",
    async () => ({ user: { id: "admin-1" } }) as never,
  );
  stub(prisma.user, "findUnique", async () => ({ role: ["ADMIN"] }));
  stub(prisma.waitlist, "findMany", async () => [defaultWaitlistEntry]);
  stub(prisma.waitlist, "count", async () => 1);
  stub(prisma, "$transaction", async (actions: Array<Promise<unknown>>) =>
    Promise.all(actions),
  );

  const response = await app.inject({
    method: "GET",
    url: "/api/waitlist?page=1&pageSize=10",
  });

  assert.equal(response.statusCode, 200);
  const body = response.json();
  assert.equal(body.success, true);
  assert.equal(body.data.items.length, 1);
  assert.equal(body.data.items[0].email, defaultWaitlistEntry.email);
});
