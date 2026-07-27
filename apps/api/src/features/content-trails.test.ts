import assert from "node:assert/strict";
import test from "node:test";

process.env.NODE_ENV = "test";
process.env.DEBUG = "false";
process.env.LOG = "false";
process.env.LOG_LEVEL = "silent";
process.env.APP_NAME = "pipoca-agil-test";
process.env.PORT = "3001";
process.env.HOST = "127.0.0.1";
process.env.BASE_URL = "http://127.0.0.1:3001";
process.env.MAX_REQUESTS_PER_MINUTE = "100";
process.env.ALLOWED_ORIGINS = "http://127.0.0.1:3000";
process.env.DATABASE_URL =
  "postgresql://user:pass@localhost:5432/pipoca_agil_test";
process.env.AUTH_SECRET = "super-secret-for-tests";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const appModule = require("../app");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const prismaModule = require("../lib/prisma");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const authModule = require("../lib/auth");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const trailServiceModule = require("./trail/trail.service");

const app = appModule.default;
const prisma = prismaModule.default as any;
const auth = authModule.auth as any;

const defaultVideo = {
  id: "video-1",
  title: "Video ativo",
  description: "Descricao",
  youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  durationInSeconds: 120,
  isActive: true,
  deletedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const defaultTrail = {
  id: "trail-1",
  title: "Trilha publicada",
  description: "Descricao",
  isPublished: true,
  isActive: true,
  deletedAt: null,
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

test("GET /api/videos expõe apenas vídeos ativos publicamente", async () => {
  stub(auth.api, "getSession", async () => null as never);
  stub(prisma.video, "findMany", async () => [defaultVideo]);
  stub(prisma.video, "count", async () => 1);
  stub(prisma, "$transaction", async (actions: Array<Promise<unknown>>) =>
    Promise.all(actions),
  );

  const response = await app.inject({
    method: "GET",
    url: "/api/videos?page=1&pageSize=10",
  });

  assert.equal(response.statusCode, 200);
  const body = response.json();
  assert.equal(body.success, true);
  assert.equal(body.data.items.length, 1);
  assert.equal(body.data.items[0].id, defaultVideo.id);
});

test("POST /api/videos exige sessão autenticada", async () => {
  stub(auth.api, "getSession", async () => null as never);

  const response = await app.inject({
    method: "POST",
    url: "/api/videos",
    payload: {
      title: "Novo video",
      youtubeUrl: defaultVideo.youtubeUrl,
      durationInSeconds: 90,
    },
  });

  assert.equal(response.statusCode, 401);
});

test("POST /api/videos bloqueia usuário sem papel ADMIN", async () => {
  stub(
    auth.api,
    "getSession",
    async () => ({ user: { id: "user-1" } }) as never,
  );
  stub(prisma.user, "findUnique", async () => ({ role: ["USER"] }));

  const response = await app.inject({
    method: "POST",
    url: "/api/videos",
    payload: {
      title: "Novo video",
      youtubeUrl: defaultVideo.youtubeUrl,
      durationInSeconds: 90,
    },
  });

  assert.equal(response.statusCode, 403);
});

test("GET /api/trails expõe apenas trilhas publicadas publicamente", async () => {
  stub(auth.api, "getSession", async () => null as never);
  stub(prisma.trail, "findMany", async () => [defaultTrail]);
  stub(prisma.trail, "count", async () => 1);
  stub(prisma, "$transaction", async (actions: Array<Promise<unknown>>) =>
    Promise.all(actions),
  );

  const response = await app.inject({
    method: "GET",
    url: "/api/trails?page=1&pageSize=10",
  });

  assert.equal(response.statusCode, 200);
  const body = response.json();
  assert.equal(body.success, true);
  assert.equal(body.data.items[0].id, defaultTrail.id);
});

test("POST /api/trails/:trailId/items bloqueia usuário sem papel ADMIN", async () => {
  stub(
    auth.api,
    "getSession",
    async () => ({ user: { id: "user-1" } }) as never,
  );
  stub(prisma.user, "findUnique", async () => ({ role: ["USER"] }));

  const response = await app.inject({
    method: "POST",
    url: "/api/trails/trail-1/items",
    payload: {
      contentType: "VIDEO",
      contentId: "video-1",
      position: 1,
      isRequired: true,
    },
  });

  assert.equal(response.statusCode, 403);
});

test("markTrailItemViewed registra visualização e conclui trilha quando todos os required foram vistos", async () => {
  stub(prisma.trail, "findFirst", async () => defaultTrail);
  stub(prisma.trailItem, "findFirst", async () => ({
    id: "item-1",
    trailId: defaultTrail.id,
    contentType: "VIDEO",
    contentId: defaultVideo.id,
    position: 1,
    isRequired: true,
    isActive: true,
    deletedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
  stub(prisma.video, "findFirst", async () => defaultVideo);
  stub(prisma.trailItemProgress, "upsert", async () => ({
    id: "progress-item-1",
    userId: "user-1",
    trailId: defaultTrail.id,
    trailItemId: "item-1",
    contentType: "VIDEO",
    contentId: defaultVideo.id,
    viewedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
  stub(prisma.trailItem, "findMany", async () => [
    {
      id: "item-1",
      trailId: defaultTrail.id,
      contentType: "VIDEO",
      contentId: defaultVideo.id,
      position: 1,
      isRequired: true,
      isActive: true,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  stub(prisma.video, "findMany", async () => [defaultVideo]);
  stub(prisma.trailItemProgress, "findMany", async () => [
    {
      id: "progress-item-1",
      userId: "user-1",
      trailId: defaultTrail.id,
      trailItemId: "item-1",
      contentType: "VIDEO",
      contentId: defaultVideo.id,
      viewedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  stub(prisma.trailProgress, "upsert", async (args: any) => ({
    id: "progress-1",
    userId: args.create.userId,
    trailId: args.create.trailId,
    completionPercentage: args.create.completionPercentage,
    isCompleted: args.create.isCompleted,
    completedAt: args.create.completedAt,
    lastViewedAt: args.create.lastViewedAt,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  const result = await trailServiceModule.markTrailItemViewed(
    "user-1",
    defaultTrail.id,
    {
      trailItemId: "item-1",
    },
  );

  assert.ok(result);
  assert.equal(result.progress.completionPercentage, 100);
  assert.equal(result.progress.isCompleted, true);
  assert.deepEqual(result.viewedItemIds, ["item-1"]);
});

test("getTrailProgress ignora itens opcionais pendentes ao concluir a trilha", async () => {
  stub(prisma.trail, "findFirst", async () => defaultTrail);
  stub(prisma.trailItem, "findMany", async () => [
    {
      id: "item-1",
      trailId: defaultTrail.id,
      contentType: "VIDEO",
      contentId: defaultVideo.id,
      position: 1,
      isRequired: true,
      isActive: true,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "item-2",
      trailId: defaultTrail.id,
      contentType: "VIDEO",
      contentId: "video-2",
      position: 2,
      isRequired: false,
      isActive: true,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  stub(prisma.video, "findMany", async () => [
    defaultVideo,
    {
      ...defaultVideo,
      id: "video-2",
      title: "Video opcional",
    },
  ]);
  stub(prisma.trailItemProgress, "findMany", async () => [
    {
      id: "progress-item-1",
      userId: "user-1",
      trailId: defaultTrail.id,
      trailItemId: "item-1",
      contentType: "VIDEO",
      contentId: defaultVideo.id,
      viewedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  stub(prisma.trailProgress, "upsert", async (args: any) => ({
    id: "progress-2",
    userId: args.create.userId,
    trailId: args.create.trailId,
    completionPercentage: args.create.completionPercentage,
    isCompleted: args.create.isCompleted,
    completedAt: args.create.completedAt,
    lastViewedAt: args.create.lastViewedAt,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  const result = await trailServiceModule.getTrailProgress(
    "user-1",
    defaultTrail.id,
  );

  assert.ok(result);
  assert.equal(result.progress.completionPercentage, 50);
  assert.equal(result.progress.isCompleted, true);
  assert.deepEqual(result.viewedItemIds, ["item-1"]);
});
