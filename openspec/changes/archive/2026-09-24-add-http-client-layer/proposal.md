# Proposal

## Why

O `apps/web` repete o mesmo padrão `fetch → try/catch → Result<T>` em pelo menos 6 lugares (`trilhas/page.tsx`, `trilhas/[trailId]/page.tsx`, `trilhas/[trailId]/feedback/page.tsx`, `(admin)/metricas/page.tsx` com 4 funções de fetch, `trilha-detail.tsx`, `renderAPIForm.tsx`), cada um resolvendo `baseUrl`, tratamento de erro e mensagens de log de forma levemente diferente. Não há política de cache/revalidate consistente (alguns usam `force-cache` fixo, outros condicionam a `NODE_ENV`, outros comentam a config), não há retry, e estados de loading/erro em componentes client (`trilha-detail.tsx`) são geridos manualmente com `useState` ad-hoc. Isso aumenta o custo de manutenção e o risco de divergência de comportamento entre chamadas equivalentes.

## What Changes

- Criar `apps/web/src/lib/api-client.ts` com um client HTTP único responsável por: montar a URL a partir de `NEXT_PUBLIC_API_URL`, executar o `fetch`, aplicar uma política de cache/revalidate padrão (parametrizável por chamada), fazer parse da resposta e devolver sempre um `Result<T>` tipado — sem exigir `try/catch` manual em cada call site.
- Adicionar suporte a retry configurável (poucas tentativas, com backoff simples) para chamadas GET, e um util para requests autenticadas/mutations (POST) reaproveitando o mesmo tratamento de erro.
- Substituir as funções `fetchData`/`fetchAnalyticsData`/`fetchVideosData`/`fetchFeedbackFormData`/`fetchFeedbackResponsesData` (server components) e o fetch client-side em `trilha-detail.tsx`/`renderAPIForm.tsx` para usar o novo `api-client.ts`.
- Padronizar o tratamento de estado de loading/erro no fetch client-side de `trilha-detail.tsx` (hoje `feedbackError`/`feedbackForm` manuais) reaproveitando o resultado tipado do client.
- Não introduzir React Query/SWR nesta mudança (fora de escopo — ver design.md Non-Goals).

## Capabilities

### New Capabilities
(nenhuma — mudança é de implementação interna do `web`, não introduz nem altera comportamento de domínio/API)

### Modified Capabilities
(nenhuma — nenhum requisito de spec existente muda; contratos de API em `apps/api` e o formato de `Result<T>` permanecem os mesmos, apenas centraliza como o `web` consome essas respostas)

## Impact

- Código afetado: novo arquivo `apps/web/src/lib/api-client.ts`; todos os `page.tsx`/componentes listados acima em `apps/web/src/app/**` que hoje fazem `fetch` direto.
- Sem mudança em `apps/api`, `packages/schemas` ou nos contratos `Result<T>`/`resultSchema`.
- Sem novas dependências externas (retry/cache implementados com `fetch`/`AbortController` nativos do Next.js).
