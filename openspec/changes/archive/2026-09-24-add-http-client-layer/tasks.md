# Tasks

## 1. Core do api-client

- [x] 1.1 Criar `apps/web/src/lib/api-client.ts` com uma função interna `request<T>(path, init)` que resolve `baseUrl` via `NEXT_PUBLIC_API_URL`, executa o `fetch`, e normaliza qualquer falha (rede ou `!response.ok`) em `Result<T>` (`{ success: false, code, message, error: { errors: [...] } }`), logando via `console.error` com prefixo `[api-client]` — verificar com `tsc --noEmit` em `apps/web` (sem erros de tipo)
- [x] 1.2 Implementar `apiGet<T>(path, options?: { cache?, next?, retry? })` sobre `request`, com retry linear (0 por padrão) só reagindo a exceção do `fetch` (não a status HTTP) — verificar com um teste manual/unitário simulando uma falha de rede seguida de sucesso e confirmando que o retry é acionado o número de vezes esperado
- [x] 1.3 Implementar `apiPost<T>(path, body, options?)` sobre `request`, com header `Content-Type: application/json` e sem retry automático — verificar chamando contra um endpoint existente (ex. `/api/feedback-forms/:id/responses`) em dev e confirmando `Result<T>` retornado
- [x] 1.4 Criar `apps/web/src/lib/use-api-request.ts` com `useApiRequest<T>(fetcher, deps)` retornando `{ data, error, loading }` — verificar com um componente de teste simples ou uso real (task 3.1) exibindo `loading` durante a chamada e `data`/`error` após resolvida

## 2. Migração dos server components (GET)

- [x] 2.1 Migrar `src/app/trilhas/page.tsx` para usar `apiGet<PaginatedTrails>("/api/trails", { cache/next iguais aos atuais })`, removendo o `fetchData` manual — verificar rodando `next dev`/`next build` e conferindo que `/trilhas` renderiza a mesma lista de hoje
- [x] 2.2 Migrar `src/app/trilhas/[trailId]/page.tsx` para `apiGet<Trail>("/api/trails/:id", { cache: "force-cache", next: { revalidate: 86400 } })` — verificar acessando uma trilha existente em dev e comparando com o comportamento atual
- [x] 2.3 Migrar `src/app/trilhas/[trailId]/feedback/page.tsx` para `apiGet<FeedbackForm>(...)` preservando a política de cache condicional a `NODE_ENV` — verificar acessando `/trilhas/:id/feedback` em dev
- [x] 2.4 Migrar as 4 funções de fetch de `src/app/(admin)/metricas/page.tsx` (`fetchAnalyticsData`, `fetchVideosData`, `fetchFeedbackFormData`, `fetchFeedbackResponsesData`) para `apiGet<T>`, preservando as opções de cache (hoje comentadas/sem cache) — verificar acessando `/metricas` em dev e conferindo que os 4 blocos de dados continuam populando a página

## 3. Migração client-side (mutation + loading state)

- [x] 3.1 Migrar o fetch client-side de `src/app/trilhas/[trailId]/components/trilha-detail.tsx` (carregar `FeedbackForm` ao abrir o modal) para `apiGet` + `useApiRequest`, removendo os `useState` manuais `feedbackForm`/`feedbackError` — verificar abrindo o modal de feedback em dev e conferindo os estados de loading/erro/sucesso
- [x] 3.2 Migrar `onSubmit` de `src/app/trilhas/[trailId]/feedback/components/renderAPIForm.tsx` para `apiPost`, mantendo o comportamento de `isSubmitting` já fornecido pelo `react-hook-form` — verificar enviando um feedback em dev e confirmando que a resposta é persistida (checar via `/metricas` ou banco)

## 4. Validação final

- [x] 4.1 Rodar `tsc --noEmit`/`next build` em `apps/web` e confirmar ausência de erros — verificar build bem-sucedido
- [x] 4.2 Rodar lint (`eslint`) em `apps/web` e confirmar que nenhum `fetch` direto restante contorna `api-client.ts` nos arquivos migrados — verificar saída do lint sem novos warnings/erros nos arquivos alterados
