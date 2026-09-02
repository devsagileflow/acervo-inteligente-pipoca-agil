# API Architecture Patterns (Operational)

- Stack: Fastify v5, TypeScript, Zod (fastify-type-provider-zod), Prisma + PostgreSQL, better-auth.
- Entry points: `src/app.ts` compõe app e registra plugins+routes; `src/server.ts` inicia listen com `env.PORT` e `env.HOST`.
- Validation/serialization: `validatorCompiler` e `serializerCompiler` do provider Zod configurados globalmente.
- Route mounting: health fora de `/api`; domínios dentro de `/api` via `src/features/index.ts`.
- Domain layout: `features/<dominio>/<dominio>.route.ts` (HTTP/schema) e `*.service.ts` (regra/acesso dados).
- Shared contracts: schemas e tipos vêm de `apps/packages/schemas` (fonte de verdade de payload/response).
- Request session: plugin `session-user` injeta `request.sessionUser` em `preHandler` usando `auth.api.getSession`.
- Fastify typing: extensão de request declarada em `src/types/fastify.d.ts`.
- Error handling: handler central em `plugins/error.ts` normaliza Zod, HTTP errors e Prisma known errors.
- Infra plugins (ordem atual): error handler, rate limit, cors, session-user, swagger/scalar, querystring parser.
- Prisma pattern: `@prisma/adapter-pg` + singleton em dev (`globalForPrisma`) para evitar conexões duplicadas em hot reload.
- Env pattern: `dotenv.config()` apenas fallback local; validação final usa `process.env` via Zod.
- Auth baseline: better-auth com adapter Prisma, basePath `/api/auth`, OpenAPI plugin habilitado.
- Authorization baseline: checagens explícitas por rota (Unauthorized/Forbidden) + helper `can(user, action, resource)`.
- Response shape comum: `{ success, data?, message?, error?, code }` com `resultSchema(...)` nos endpoints.

## Analytics Snapshot

- Persistência de eventos em `AnalyticsEvent` (tabela `analytics_event`) com índices por dimensões de consulta.
- Endpoint de ingestão: `POST /api/analytics/events`.
- Endpoint agregação atual: `GET /api/analytics/click-summary`.
- Tensão atual de contrato: frontend tipa eventos extras além dos aceitos no schema compartilhado da API.

## Working Notes

- Em tarefas de API, priorizar consistência schema-first (packages/schemas) antes de alterar route/service.
- Para novos endpoints, seguir padrão: schema completo na rota + serviço isolado + erros padronizados.
- Em mudanças de auth/permissão, validar impacto em `session-user`, tipos Fastify e guards por rota.
