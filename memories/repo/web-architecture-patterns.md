# Web Architecture Patterns (Operational)

- Stack: Next.js 16 (App Router), React 19, Tailwind v4, shadcn/radix-ui, react-hook-form + zod, recharts.
- Rotas: `(marketing)` = landing "/"; `(admin)/metricas` = dashboard analytics/feedback; `trilhas/` (lista) e `trilhas/[trailId]` (detalhe + `feedback/` sub-rota).
- Sem `middleware.ts` e sem `layout.tsx` em `(admin)` — rota `/metricas` não tem guard de sessão/autorização no front (API pode ter, front não valida nada).
- Sem cliente HTTP compartilhado: cada `page.tsx` repete o padrão `fetch → try/catch → Result<T>` manualmente (ex.: `trilhas/page.tsx`, `trilhas/[trailId]/page.tsx`, `(admin)/metricas/page.tsx`, `feedback/page.tsx`).
- Sem React Query/SWR — estados de loading/erro são manuais e duplicados (ex.: `metricas/page.tsx` tem 4 blocos quase idênticos de erro).
- Imports de schemas inconsistentes: pacote workspace `@acervo/schemas` convive com alias de tsconfig `@/packages/schemas/*` (aponta pro mesmo diretório físico) — às vezes usados no mesmo arquivo (`trilha-detail.tsx`).
- Contrato `Result<T>`: tipo TS (`packages/schemas/index.ts`) declara `data` opcional; `resultSchema` (Zod) exige `data` obrigatório. Divergência não é pega porque o client só faz `as Result<T>` (sem `.parse`/`.safeParse`).
- Fluxo de feedback duplicado: `trilhas/[trailId]/feedback/page.tsx` (SSR, com cache) e modal dentro de `trilha-detail.tsx` (fetch client, sem cache) buscam o mesmo form (id hardcoded `"feedback-form-global-trail"`) com lógicas divergentes.
- Submissão de feedback (`renderAPIForm.tsx`) não expõe erro de rede/validação ao usuário — só `console.error`.
- "Feedback já respondido" persiste em `localStorage` por trilha, sem vínculo a usuário (não há autenticação de usuário implementada no front hoje, só `anonymousId` via localStorage para analytics).
- Player de vídeo (`video-frame.tsx`) reimplementa manualmente a iframe API do YouTube: tipagem `any` (com `eslint-disable` no topo do arquivo), `console.log` de debug esquecido, e encadeamento de `window.onYouTubeIframeAPIReady` sem cleanup do callback global.
- Componentes de UI fragmentados em 3 fontes: `components/ui` (shadcn puro — barrel `index.ts` só exporta 7 de 11 arquivos existentes: faltam `calendar`, `popover`, `select`, `skeleton`), `components/shadcn-studio` (kit externo, ex. `rating-07`), `components/pro-blocks` (kit externo de landing page).
- `packages/schemas` já expõe `trail-progress.api.schema.ts`, mas não há consumidor/UI no `web/` para progresso do usuário ainda.
- Analytics (`lib/analytics.ts`): eventos via `sendBeacon`/`fetch` para `/api/analytics/events`; tipos (`page_view`, `click`, `scroll_depth`, `video_play`, `video_complete`, `video_paused`) batem com `analyticsEventTypeSchema` do pacote compartilhado — sem tensão de contrato hoje.

## Working Notes

- Client HTTP compartilhado criado em `apps/web/src/lib/api-client.ts` (`apiGet`/`apiPost`) e `apps/web/src/lib/use-api-request.ts` (`useApiRequest`).
  - Normaliza erros de rede/HTTP para `Result<T>` com `error: { errors: [...] }`.
  - `apiGet` suporta `retry` linear apenas em falhas de rede (exceção do `fetch`), nunca em status HTTP.
  - `apiPost` não faz retry automático.
  - `useApiRequest` retorna `{ data, error, loading }` e aceita `enabled` para não executar o fetch até que seja verdadeiro.
- O `eslint-config-next` moderno ativa regras estritas do plugin `react-hooks`: `react-hooks/set-state-in-effect` (proíbe `setState` síncrono no corpo de um efeito), `react-hooks/refs` (proíbe acesso/escrita em refs durante render) e `react-hooks/use-memo` (exige array literal de dependências). Para estados de loading iniciais dentro de efeitos de data fetching, envolver as atualizações em `startTransition` suprime o erro `set-state-in-effect` sem desabilitar a regra.
- Ao tocar em schemas compartilhados, escolher um único caminho de import (`@acervo/schemas`) e migrar os usos do alias `@/packages/schemas/*`.
- Lista completa de problemas/refatorações candidatas a change proposals está em `memories/repo/web-change-proposal-candidates.md`.
