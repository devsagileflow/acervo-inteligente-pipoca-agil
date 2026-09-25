# Design

## Context

Hoje cada `page.tsx`/componente client em `apps/web/src/app/**` declara sua própria função `fetch...Data` (ou faz `fetch` inline) repetindo: montar `baseUrl` a partir de `process.env.NEXT_PUBLIC_API_URL`, `try/catch`, checar `response.ok`, fazer `as Result<T>`/`.json()`, e devolver um objeto `Result` de erro com `success: false` construído à mão. Ver proposal.md - Why.

Arquivos que hoje fazem `fetch` direto e serão migrados para `lib/api-client.ts`:
- `src/app/trilhas/page.tsx` — `fetchData` (GET `/api/trails`, cache condicional a `NODE_ENV` + `revalidate: 24h`)
- `src/app/trilhas/[trailId]/page.tsx` — `fetchData(trailId)` (GET `/api/trails/:id`, `force-cache` fixo)
- `src/app/trilhas/[trailId]/feedback/page.tsx` — `fetchData` (GET `/api/feedback-forms/...`, cache condicional)
- `src/app/(admin)/metricas/page.tsx` — 4 funções (`fetchAnalyticsData`, `fetchVideosData`, `fetchFeedbackFormData`, `fetchFeedbackResponsesData`), sem cache padronizado (opções comentadas)
- `src/app/trilhas/[trailId]/components/trilha-detail.tsx` — fetch client-side (`useEffect`) do form de feedback, com `feedbackForm`/`feedbackError` geridos manualmente
- `src/app/trilhas/[trailId]/feedback/components/renderAPIForm.tsx` — `onSubmit` faz POST de resposta de feedback

Todos consomem/produzem o tipo `Result<T>` já definido em `packages/schemas/index.ts` (`success`, `data?`, `code?`, `message?`, `error?`). Esse contrato não muda nesta proposta.

## Goals / Non-Goals

**Goals:**
- Um único ponto (`apps/web/src/lib/api-client.ts`) que resolve `baseUrl`, executa o `fetch`, trata erro de rede/HTTP e devolve sempre `Result<T>` — sem `try/catch` repetido em cada call site.
- Suporte a retry configurável (opt-in) para requests idempotentes (GET), com poucas tentativas e backoff simples.
- Preservar, por chamada, a política de cache/revalidate que cada endpoint já usa hoje — não impor um default global que mude comportamento de páginas existentes silenciosamente.
- Reduzir estado de loading/erro ad-hoc em componentes client, oferecendo um hook fino (`useApiRequest`) que os componentes client podem usar em vez de `useState`/`useEffect` manuais.

**Non-Goals:**
- Não adotar React Query/SWR nesta mudança (fica registrado como alternativa possível para uma mudança futura, mas aumenta escopo/dependências e não é necessário para resolver a duplicação atual).
- Não validar a resposta em runtime contra `resultSchema` (Zod) — a divergência entre `Result<T>` (TS, `data` opcional) e `resultSchema` (Zod, `data` obrigatório) é tratada por outra mudança candidata (`fix-result-type-contract`, ver `memories/repo/web-change-proposal-candidates.md`).
- Não mudar contratos/rotas de `apps/api` nem o formato de `Result<T>`.
- Não migrar `lib/analytics.ts` (já usa `sendBeacon`/`fetch` fire-and-forget com semântica própria, fora do escopo de request/response `Result<T>`).

## Decisions

- **API pública em `lib/api-client.ts`: `apiGet<T>(path, options?)` e `apiPost<T>(path, body, options?)`, ambas retornando `Promise<Result<T>>`.**
  Alternativa considerada: uma única função genérica `apiRequest<T>(path, init)`. Rejeitada como API pública porque os call sites atuais são quase todos GET simples ou POST com JSON body — `apiGet`/`apiPost` deixam a intenção explícita nos call sites e cobrem os dois casos hoje existentes (mutations além de POST podem ser adicionadas depois, reaproveitando a função interna `request`).
- **`options` inclui `cache`/`next.revalidate` (repassados direto para o `fetch` do Next.js) e `retry?: number` (default `0` = sem retry).**
  Cada call site migrado mantém explicitamente a política de cache que já tinha (ex.: `trilhas/[trailId]/page.tsx` continua passando `cache: "force-cache", next: { revalidate: 86400 }`). Isso evita alterar comportamento de cache de produção como efeito colateral do refactor — mudanças de política de cache ficam para uma proposta futura, dedicada.
- **Retry só para GET, com backoff linear simples (`setTimeout` incremental) e `retry` máximo pequeno (ex. 1–2), sem lib externa.**
  Suficiente para absorver falhas transitórias de rede sem justificar uma dependência nova (ex. `p-retry`). POST/mutations não usam retry automático por padrão (evita reenviar submissões de formulário).
- **Erro sempre normalizado para o mesmo shape hoje usado manualmente:** `{ success: false, code, message, error: { errors: [...] } }`, logando via `console.error` com prefixo consistente (`[api-client] ...`) em vez de mensagens ad-hoc por call site.
- **`useApiRequest<T>(fetcher: () => Promise<Result<T>>, deps)` como hook opcional em `lib/use-api-request.ts`, usado só onde já existe fetch client-side (`trilha-detail.tsx`).**
  Retorna `{ data, error, loading }`. Não é usado nos server components (`page.tsx`), que continuam `await`-ando `apiGet`/`apiPost` diretamente — não há "loading" em RSC.
- **Não introduzir um client HTTP baseado em classe/instância singleton.** Funções simples exportadas do módulo são suficientes (sem estado compartilhado necessário) e mais fáceis de testar/tree-shake do que uma classe `ApiClient`.

## Risks / Trade-offs

- [Perder alguma nuance de cache específica de um endpoint durante a migração] → Migrar arquivo por arquivo comparando a chamada antiga com a nova (mesmos `cache`/`next.revalidate`), validado por `tsc --noEmit`/`next build` e checagem manual de comportamento em dev.
- [Retry automático em GET mascarar erros reais de endpoint (ex. 404 tratado como falha transitória)] → Retry só reage a falha de rede/exceção do `fetch` (não a `response.ok === false` com status 4xx), e nunca retry em POST.
- [Hook `useApiRequest` introduzir uma abstração nova só usada em 1 lugar hoje] → Escopo mínimo (um hook, sem generalização prematura); se não houver outro consumidor após a migração, pode ser inlinado de volta em `trilha-detail.tsx` numa revisão futura sem quebrar o restante do `api-client.ts`.

## Migration Plan

1. Criar `apps/web/src/lib/api-client.ts` (`request`, `apiGet`, `apiPost`) e `apps/web/src/lib/use-api-request.ts` (`useApiRequest`).
2. Migrar os 4 server components (`trilhas/page.tsx`, `trilhas/[trailId]/page.tsx`, `trilhas/[trailId]/feedback/page.tsx`, `(admin)/metricas/page.tsx`) trocando cada `fetch...Data` por `apiGet<T>(...)` com as mesmas opções de cache que já tinham.
3. Migrar `renderAPIForm.tsx` (`onSubmit`) para `apiPost`.
4. Migrar o fetch client-side de `trilha-detail.tsx` para `apiGet` + `useApiRequest`, substituindo `feedbackForm`/`feedbackError` manuais.
5. Rodar `tsc --noEmit`/`next build` em `apps/web` e checar manualmente as páginas migradas (trilhas, detalhe de trilha, feedback, métricas) em dev.

Rollback: reverter o commit; não há migração de dado/estado persistido, apenas código-fonte do `web`.
