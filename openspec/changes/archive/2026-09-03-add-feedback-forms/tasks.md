## 1. Prisma Schema & Migration

- [x] 1.1 Adicionar `TRAIL` ao enum `ContentType` existente em `schema.prisma`
- [x] 1.2 Criar enum `QuestionType` (`STARS`, `SCALE_0_10`, `LIKE_DISLIKE`, `TEXT`, `MULTIPLE_CHOICE`, `SINGLE_CHOICE`)
- [x] 1.3 Criar modelo `FeedbackForm` (id, title, description?, contentType?, contentId?, isPublished, isActive, createdAt, updatedAt, deletedAt) com índices por visibilidade pública e por vínculo (`contentType`, `contentId`)
- [x] 1.4 Criar modelo `FeedbackQuestion` (id, formId, questionType, label, isRequired, position, createdAt, updatedAt, deletedAt) com relação a `FeedbackForm` e índice por `(formId, position)`
- [x] 1.5 Criar modelo `FeedbackQuestionOption` (id, questionId, label, position, createdAt, updatedAt, deletedAt) para opções de perguntas `MULTIPLE_CHOICE` ou `SINGLE_CHOICE`
- [x] 1.6 Criar modelo `FeedbackResponse` (id, formId, userId?, createdAt, updatedAt, deletedAt) com `userId` opcional e relação `onDelete: SetNull`/`Cascade` conforme padrão existente
- [x] 1.7 Criar modelo `FeedbackAnswer` (id, responseId, questionId, value: Json ou campos tipados, selectedOptionIds: String[]?, createdAt, updatedAt, deletedAt) com relação a `FeedbackResponse` e `FeedbackQuestion`
- [x] 1.8 Gerar migration Prisma para os novos modelos/enum e aplicar localmente

## 2. Contratos compartilhados (`apps/packages/schemas`)

- [x] 2.1 Criar `feedback-form.schema.ts` e `feedback-response.schema.ts` com Zod schemas correspondentes aos modelos Prisma, incluindo validação de tipos de pergunta e obrigatoriedade
- [x] 2.2 Criar `feedback-form.api.schema.ts` com schemas de `FeedbackForm`, `FeedbackQuestion` (discriminated union por `questionType`, incluindo opções para `MULTIPLE_CHOICE` e `SINGLE_CHOICE`), query de listagem e params
- [x] 2.3 Criar `feedback-response.api.schema.ts` com schema de envio de resposta (`createFeedbackResponseBodySchema`, discriminated union por tipo de pergunta) e schema de resposta persistida
- [x] 2.4 Exportar os novos schemas em `apps/packages/schemas/index.ts`

## 3. Domínio `feedback` na API

- [x] 3.1 Criar `src/features/feedback/feedback-form.route.ts` com `GET /api/feedback-forms` e `GET /api/feedback-forms/:formId`
- [x] 3.2 Criar `src/features/feedback/feedback-form.service.ts` com consultas respeitando `isPublished=true`, `isActive=true`, `deletedAt=null` e filtro por `contentType`/`contentId`
- [x] 3.3 Criar `src/features/feedback/feedback-response.route.ts` com `POST /api/feedback-forms/:formId/responses`
- [x] 3.4 Criar `src/features/feedback/feedback-response.service.ts` com: carregar formulário+perguntas, validar cobertura de perguntas obrigatórias, validar valor por tipo de pergunta, resolver `userId` a partir de `request.sessionUser` (quando existir) e persistir `FeedbackResponse` + `FeedbackAnswer[]` em transação
- [x] 3.5 Registrar as novas rotas em `src/features/index.ts`

## 4. Seed de dados

- [x] 4.1 Criar script de seed para formulários de feedback (ex: `apps/api/prisma/seed-feedback.ts`) com ao menos um formulário global e um formulário vinculado a uma trilha existente, cobrindo os 5 tipos de pergunta
- [x] 4.2 Registrar o novo seed no entrypoint `apps/api/prisma/seed.ts`

## 5. Sincronização de specs

- [x] 5.1 Rodar `openspec sync-specs` (ou equivalente) para promover os deltas de `feedback-form-management` e `feedback-response-management` para `openspec/specs/` após validação da implementação
