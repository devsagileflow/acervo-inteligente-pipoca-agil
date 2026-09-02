## Why

A plataforma precisa coletar feedback e avaliações dos usuários (logados ou anônimos) sobre conteúdos e experiência geral, mas hoje não existe nenhuma forma de consultar formulários/questionários nem de persistir respostas na API.

## What Changes

- Adiciona modelo de dados para formulários de feedback, suas perguntas e as respostas enviadas.
- Adiciona endpoint público para consultar um formulário publicado, incluindo suas perguntas (com tipo de pergunta e opções, quando aplicável).
- Adiciona endpoint público para consultar a lista de formulários publicados, com filtro opcional por vínculo (`trail`/`video`).
- Adiciona endpoint público para salvar as respostas de um usuário (logado, via `sessionUser`, ou anônimo, sem nenhum identificador) para um formulário.
- Suporta múltiplos tipos de pergunta: avaliação por estrelas (1-5), nota (0-10), like/dislike, texto livre, múltipla escolha (seleção múltipla) e única escolha (seleção de uma opção).
- Suporta vínculo opcional do formulário com uma `Trail` ou `Video` existente (formulário também pode ser global, sem vínculo).
- Valida no envio das respostas que perguntas marcadas como obrigatórias foram respondidas.
- Permite múltiplos envios de respostas para o mesmo formulário pelo mesmo usuário/anônimo (sem restrição de unicidade).
- Não inclui endpoints de criação/edição de formulário e perguntas nesta fase: a criação será feita via script/seed, fora do escopo da API pública.

## Capabilities

### New Capabilities

- `feedback-form-management`: consulta pública de formulários de feedback publicados e de suas perguntas (incluindo tipo de pergunta e opções de resposta).
- `feedback-response-management`: envio e persistência de respostas de um usuário (logado ou anônimo) a um formulário de feedback, com validação de perguntas obrigatórias.

### Modified Capabilities

(nenhuma)

## Impact

- **Prisma schema**: novos modelos `FeedbackForm`, `FeedbackQuestion`, `FeedbackResponse`, `FeedbackAnswer` e novos enums (`QuestionType`, extensão de `ContentType` para incluir `TRAIL`), com migration correspondente.
- **`apps/packages/schemas`**: novos arquivos de contrato (`feedback-form.api.schema.ts`, `feedback-response.api.schema.ts`) compartilhados entre API e web.
- **`apps/api/src/features`**: novo domínio `feedback` com `feedback-form.route.ts`, `feedback-response.route.ts` e services correspondentes, registrado em `src/features/index.ts`.
- **Seed**: novo script de seed para popular formulários de exemplo (substituindo a necessidade de endpoint de criação).
- Nenhum impacto em autenticação: leitura e envio de respostas funcionam para usuários anônimos; `userId` é opcional e só é preenchido quando existir `sessionUser`.
