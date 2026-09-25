# Web — Candidatos a Change Proposals

Backlog gerado a partir de exploracao do `apps/web` e `apps/packages/schemas` em 2026-09-24.
Contexto/fatos que sustentam esta lista: `memories/repo/web-architecture-patterns.md`.

Status de cada item: `proposto` (ainda nao virou change no openspec). Atualizar para `em-andamento` / `arquivado` conforme evoluir, ou remover a linha quando a change correspondente for criada em `openspec/changes/`.

## Risco / Seguranca

| Nome sugerido               | Problema                                                                           | Escopo provavel                                                       | Status   |
| --------------------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------------------------- | -------- |
| `guard-admin-metrics-route` | `/metricas` sem checagem de sessao/autorizacao no front — acessivel por URL direta | Layout/guard em `(admin)`, possivel capability `admin-access-control` | proposto |

## Consistencia de contrato / arquitetura de dados

| Nome sugerido               | Problema                                                                                     | Escopo provavel                                           | Status   |
| --------------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------- | -------- |
| `unify-schemas-import-path` | `@acervo/schemas` e `@/packages/schemas/*` coexistindo, as vezes no mesmo arquivo            | Remover alias do tsconfig, migrar imports, lint rule      | proposto |
| `fix-result-type-contract`  | `Result<T>` (TS) com `data` opcional vs `resultSchema` (Zod) com `data` obrigatorio          | `packages/schemas/index.ts` + validar respostas no client | proposto |
| `add-http-client-layer`     | Fetch + try/catch + `Result<T>` duplicado em ~6 lugares; sem cache/retry/loading padronizado | Novo `lib/api-client.ts` ou adocao de React Query/SWR     | proposto |

## Fluxo de feedback

| Nome sugerido                             | Problema                                                                              | Escopo provavel                                      | Status   |
| ----------------------------------------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------- | -------- |
| `consolidate-feedback-form-flow`          | Dois caminhos (pagina SSR + modal client) buscando o mesmo form com logica divergente | Unificar fetch/render em componente/hook unico       | proposto |
| `handle-feedback-submit-errors`           | Submissao falha silenciosamente (`console.error` so)                                  | `renderAPIForm.tsx` — estado de erro visivel + retry | proposto |
| `persist-feedback-completion-server-side` | "Ja respondeu" so em `localStorage`, sem vinculo a usuario                            | Depende de `add-user-authentication-frontend`        | proposto |

## UI / Player / Debito tecnico pontual

| Nome sugerido                  | Problema                                                                                                      | Escopo provavel                                                                        | Status   |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | -------- |
| `replace-manual-youtube-embed` | Implementacao manual da iframe API do YouTube, tipada `any`, com debug leftover e callback global sem cleanup | `video-frame.tsx` — trocar por lib mantida (ex. `react-youtube`) ou corrigir lifecycle | proposto |
| `complete-ui-barrel-exports`   | `components/ui/index.ts` so exporta 7 de 11 componentes existentes                                            | Completar barrel + auditar uso direto vs via indice                                    | proposto |
| `consolidate-ui-kit-sources`   | 3 fontes de componentes visuais (`ui/`, `shadcn-studio/`, `pro-blocks/`) sem criterio documentado             | Decisao de arquitetura (design.md) antes de mexer em codigo                            | proposto |

## Evolucao de produto

| Nome sugerido                      | Problema/Oportunidade                                                                                      | Depende de                                                                      | Status   |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | -------- |
| `add-user-authentication-frontend` | So existe `anonymousId` client-side; personalizacao/progresso/feedback por usuario dependem de sessao real | Habilita `guard-admin-metrics-route`, `persist-feedback-completion-server-side` | proposto |
| `add-trail-progress-ui`            | Schema `trail-progress.api.schema.ts` ja existe no pacote, mas sem UI/consumidor no web                    | `add-user-authentication-frontend`; confirmar se API ja implementa o endpoint   | proposto |
