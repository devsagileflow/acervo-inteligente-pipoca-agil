## Why

A plataforma ainda não possui uma página pública para captar interesse antes do lançamento completo. É necessário um endpoint de API que receba inscrições de interessados (nome, email e dados complementares) para nutrir esses leads futuramente e dar à equipe de PO um sinal quantitativo de interesse real no produto.

## What Changes

- Novo modelo Prisma `Waitlist` para armazenar inscrições de interesse (nome, email, papel/persona opcional, mensagem opcional).
- Novo endpoint público `POST /api/waitlist` para qualquer visitante se inscrever na waitlist, sem necessidade de autenticação.
- Inscrição idempotente por email: se o email já existir, retorna a inscrição existente (200) em vez de erro ou duplicidade.
- Novo endpoint `GET /api/waitlist` protegido (somente ADMIN) para a equipe de PO listar/paginar os interessados cadastrados.
- Novos schemas compartilhados (`packages/schemas`) para request/response do domínio de waitlist.

## Capabilities

### New Capabilities
- `waitlist-management`: Cadastro público de interessados (nome, email, papel opcional, mensagem opcional) e listagem administrativa paginada dessas inscrições.

### Modified Capabilities
(nenhuma — não há alteração de requisitos em capacidades existentes)

## Impact

- **Prisma schema** (`apps/api/prisma/schema.prisma`): novo model `Waitlist` e enum `WaitlistRole`. Sem migração incluída nesta mudança (o usuário fará a migração e atualização do banco manualmente).
- **API** (`apps/api/src/features/waitlist/`): nova rota e serviço (`waitlist.route.ts`, `waitlist.service.ts`), registrados em `src/features/index.ts`.
- **Schemas compartilhados** (`apps/packages/schemas/`): novos arquivos `waitlist.schema.ts` e `waitlist.api.schema.ts`, exportados via `index.ts`.
- **Autorização**: reaproveita `requireAdminSession`/`isAdminSession` (`apps/api/src/lib/session.ts`) para proteger a listagem.
