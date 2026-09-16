## Context

A API já possui domínio de conteúdo (`Video`, `Trail`, `TrailItem`) e um padrão de vínculo polimórfico `contentType + contentId` usado em `TrailItem` e `TrailItemProgress`. Também há precedente de eventos anônimos em `AnalyticsEvent`, mas ali o `anonymousId` é usado para correlacionar eventos; para feedback foi decidido **não** capturar nenhum identificador de correlação para respostas anônimas. A criação de formulários/perguntas não terá endpoint nesta fase — será feita via script de seed, então o design foca apenas em leitura de formulários e escrita de respostas.

## Goals / Non-Goals

**Goals:**

- Modelar formulário → perguntas → respostas de forma que suporte os tipos de pergunta: `STARS` (1-5), `SCALE_0_10`, `LIKE_DISLIKE`, `TEXT`, `MULTIPLE_CHOICE` (seleção múltipla) e `SINGLE_CHOICE` (seleção de uma opção).
- Permitir vínculo opcional do formulário a uma `Trail` ou `Video` (reutilizando o enum `ContentType`, estendido com `TRAIL`).
- Permitir respostas de usuários logados (`userId` opcional, resolvido via `sessionUser`) e anônimos (sem nenhum identificador).
- Validar, no envio, que toda pergunta `isRequired=true` do formulário recebeu uma resposta compatível com seu tipo.
- Permitir múltiplos envios (sem unique constraint por usuário/formulário).

**Non-Goals:**

- Endpoints de criação/edição/exclusão de formulário ou pergunta (feito via seed/script).
- Agregações/estatísticas de respostas (dashboards) — fica para uma fase futura.
- Edição ou exclusão de respostas já enviadas.

## Decisions

- **Modelagem em 4 tabelas**: `FeedbackForm`, `FeedbackQuestion`, `FeedbackResponse` (um envio) e `FeedbackAnswer` (uma resposta por pergunta dentro do envio). Alternativa descartada: armazenar respostas como um único `Json` por envio — rejeitada porque dificulta validação de obrigatoriedade por pergunta e consultas futuras por pergunta específica.
- **Tipo de pergunta como enum `QuestionType`** (`STARS`, `SCALE_0_10`, `LIKE_DISLIKE`, `TEXT`, `MULTIPLE_CHOICE`, `SINGLE_CHOICE`) em vez de string livre, para permitir validação de payload de resposta específica por tipo no schema Zod (discriminated union).
- **Opções de múltipla escolha e única escolha** armazenadas como `FeedbackQuestionOption` (tabela própria com `id`, `questionId`, `label`, `position`) em vez de array `String[]` na própria pergunta, para permitir referenciar a opção escolhida por `id` estável na resposta (`FeedbackAnswer.selectedOptionIds: String[]`).
- **Vínculo opcional via `contentType + contentId` reaproveitando `ContentType`**, estendendo o enum existente com `TRAIL` (hoje só tem `VIDEO`). Alternativa descartada: duas FKs opcionais (`trailId?`, `videoId?`) — rejeitada por duplicar o padrão polimórfico já estabelecido em `TrailItem`/`TrailItemProgress` e exigir mais colunas nulas.
- **Resposta anônima sem identificador**: `FeedbackResponse.userId` é opcional e não há nenhum campo de correlação (ex: `anonymousId`) para reforçar a decisão explícita do usuário de anonimato total; não é possível agrupar respostas anônimas do mesmo visitante.
- **Sem unicidade `(userId, formId)`**: ao contrário de `TrailProgress`, não há `@@unique` — múltiplos envios são permitidos e cada envio gera uma nova linha em `FeedbackResponse`.
- **Validação de obrigatoriedade na camada de service**: o schema Zod valida o formato de cada resposta por tipo; a regra "toda pergunta `isRequired` precisa ter resposta" é validada no service (carrega perguntas do formulário e confere cobertura) antes de persistir, retornando 400 com lista de perguntas faltantes e podendo ser utilizado na api e no client.
- **Endpoints públicos, sem exigência de sessão**: seguindo o padrão de leitura pública de `Trail`/`Video`, os endpoints de listagem/consulta de formulário e envio de resposta não exigem autenticação; quando existir `request.sessionUser`, o `userId` é preenchido automaticamente.
- **Formulário só visível se publicado**: reaproveita o padrão `isPublished` + `isActive` + `deletedAt` de `Trail` para controlar visibilidade pública do formulário.

## Risks / Trade-offs

- [Sem identificador anônimo] → impossibilita detectar/mitigar respostas duplicadas ou spam de um mesmo visitante anônimo; aceito conforme decisão explícita do usuário; pode ser revisitado no futuro com rate limiting por IP se necessário.
- [Extensão do enum `ContentType` com `TRAIL`] → é uma mudança de schema compartilhado com o domínio de trilhas; mitigação: enum é aditivo (não remove `VIDEO`), sem impacto em `TrailItem` existente.
- [Validação de obrigatoriedade fora do Zod] → duplica um pouco de lógica entre schema (formato) e service (cobertura); mitigação: manter a checagem de cobertura isolada em uma função pura testável no service.
- [Ausência de endpoint de criação] → qualquer novo formulário depende de deploy/execução de script; aceito pois está fora do escopo desta fase.
