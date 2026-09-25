## Context

A API segue o padrão `features/<dominio>/<dominio>.route.ts` + `*.service.ts`, com contratos compartilhados em `apps/packages/schemas`, validação/serialização via Zod (fastify-type-provider-zod) e Prisma como ORM. Autorização administrativa já existe via `requireAdminSession`/`isAdminSession` (`apps/api/src/lib/session.ts`), usada em domínios como `video` e `trail`. O domínio de waitlist é público na escrita (qualquer visitante, sem login) e restrito na leitura (somente ADMIN).

## Goals / Non-Goals

**Goals:**
- Permitir que qualquer visitante se inscreva na waitlist informando nome e email (obrigatórios), com papel/persona e mensagem opcionais.
- Garantir que o mesmo email não gere múltiplas inscrições (idempotência por email).
- Permitir que a equipe de PO liste as inscrições de forma paginada, autenticada e restrita a usuários com papel ADMIN.
- Seguir os padrões arquiteturais já estabelecidos no repositório (schema-first, resposta `{ success, data, code }`, erros via `http-errors`).

**Non-Goals:**
- Não inclui envio de emails de confirmação/notificação para o inscrito.
- Não inclui migração de banco de dados nem execução contra o banco (o usuário fará isso manualmente).
- Não inclui tela/página de captação no frontend (fora do escopo desta mudança, que é apenas de API).
- Não inclui exportação (CSV/relatórios) para a PO, apenas listagem paginada via API.

## Decisions

- **Modelo de dados dedicado (`Waitlist`)**: em vez de reaproveitar `User`, criamos um model próprio pois o inscrito não é necessariamente um usuário autenticado do sistema (não possui senha/sessão). Mantém o domínio de auth desacoplado de captação de leads.
- **Campo `role` como enum opcional (`WaitlistRole`)**: valores fixos (`PO`, `SM`, `DEV`, `OTHER`) para permitir segmentação simples pela PO sem abrir campo livre. Alternativa considerada (string livre) foi descartada por dificultar agregações/relatórios.
- **Idempotência por email em vez de erro 409**: ao receber um email já cadastrado, o serviço retorna a inscrição existente (200) sem criar duplicata e sem lançar erro. Isso evita mensagens de erro confusas para o usuário final em uma página pública de captação, mantendo uma UX simples ("ok, você já está na lista").
- **Unicidade de email a nível de banco (`@@unique`)**: garante consistência mesmo sob concorrência, complementando a checagem idempotente no serviço.
- **Listagem protegida por `requireAdminSession`**: reaproveita o padrão já usado em `video.route.ts`/`trail.route.ts`, evitando criar um novo mecanismo de autorização.
- **Paginação seguindo `paginationQuerySchema`/`paginatedVideosSchema`**: reaproveita o padrão existente em `packages/schemas/content.schema.ts` para manter contratos consistentes entre domínios paginados.
- **Sem migração nesta mudança**: a alteração do `schema.prisma` é entregue, mas a execução de `prisma migrate dev` fica a cargo do usuário, conforme solicitado.

## Risks / Trade-offs

- [Spam/abuso no endpoint público] → Endpoint já é protegido pelo rate-limit global registrado em `plugins` (padrão do projeto); nenhuma medida adicional específica é criada nesta mudança.
- [Vazamento de dados de leads via listagem] → Mitigado exigindo `requireAdminSession` (papel ADMIN) na rota de listagem.
- [Divergência entre schema Prisma e schema Zod] → Mitigado seguindo o mesmo padrão dos demais domínios (schema Zod alinhado 1:1 aos campos do model Prisma).
