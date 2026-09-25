## 1. Prisma Schema

- [x] 1.1 Adicionar enum `WaitlistRole` (`PO`, `SM`, `DEV`, `OTHER`) em `apps/api/prisma/schema.prisma`
- [x] 1.2 Adicionar model `Waitlist` (`id`, `name`, `email` único, `role` opcional, `message` opcional, `createdAt`, `updatedAt`) em `apps/api/prisma/schema.prisma`
- [x] 1.3 Não executar `prisma migrate dev`/`prisma db push` — migração e atualização do banco ficam a cargo do usuário

## 2. Schemas Compartilhados (packages/schemas)

- [x] 2.1 Criar `apps/packages/schemas/waitlist.schema.ts` com `waitlistRoleSchema` (enum) e `waitlistSchema` (entidade completa)
- [x] 2.2 Criar `apps/packages/schemas/waitlist.api.schema.ts` com `createWaitlistBodySchema` (name obrigatório, email obrigatório, role e message opcionais) e `listWaitlistQuerySchema` (reaproveitando `paginationQuerySchema`) e `paginatedWaitlistSchema`
- [x] 2.3 Exportar os novos schemas em `apps/packages/schemas/index.ts`

## 3. Serviço da API

- [x] 3.1 Criar `apps/api/src/features/waitlist/waitlist.service.ts` com `createWaitlistEntry` (idempotente por email: retorna existente se já cadastrado, senão cria)
- [x] 3.2 Implementar `listWaitlistEntries` no serviço com paginação (page, pageSize, total, totalPages), ordenado por `createdAt` desc

## 4. Rota da API

- [x] 4.1 Criar `apps/api/src/features/waitlist/waitlist.route.ts` com `POST /waitlist` público (sem autenticação), validando body com `createWaitlistBodySchema` e retornando 201 (nova inscrição) ou 200 (já existente)
- [x] 4.2 Adicionar `GET /waitlist` na mesma rota, protegido com `requireAdminSession`, validando querystring com `listWaitlistQuerySchema` e retornando `paginatedWaitlistSchema`
- [x] 4.3 Registrar `waitlistRoute` em `apps/api/src/features/index.ts`

## 5. Verificação

- [x] 5.1 Rodar lint/typecheck da API (`apps/api`) e do pacote de schemas para garantir que não há erros de tipo
- [x] 5.2 Validar manualmente (ou via teste rápido) os cenários do spec: criação, idempotência por email, listagem sem sessão (401), listagem sem papel ADMIN (403) e listagem como ADMIN (200)
