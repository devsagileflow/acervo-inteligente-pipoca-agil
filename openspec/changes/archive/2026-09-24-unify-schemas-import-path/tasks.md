# Tasks

## 1. Migrar imports em `(admin)/metricas`

- [x] 1.1 Atualizar `src/app/(admin)/metricas/components/types.ts` para importar `AnalyticsEvent` de `@acervo/schemas` e verificar que não há mais ocorrência de `@/packages/schemas` no arquivo
- [x] 1.2 Atualizar `src/app/(admin)/metricas/components/metricas-details.tsx` para importar `Video`, `FeedbackForm`, `FeedbackResponse` de `@acervo/schemas`
- [x] 1.3 Atualizar `src/app/(admin)/metricas/page.tsx` para importar `AnalyticsEvent`, `FeedbackForm`, `FeedbackResponse`, `ListVideosQuery`, `PaginatedVideos`, `Result` de `@acervo/schemas`
- [x] 1.4 Rodar `grep -r "@/packages/schemas" apps/web/src/app/\(admin\)` (ou busca equivalente) e verificar que não retorna nenhuma ocorrência

## 2. Migrar imports em `trilhas` (lista e detalhe)

- [x] 2.1 Atualizar `src/app/trilhas/page.tsx` para importar `PaginatedTrails`, `Result` de `@acervo/schemas`
- [x] 2.2 Atualizar `src/app/trilhas/components/cta-button.tsx` para importar `Trail` de `@acervo/schemas`
- [x] 2.3 Atualizar `src/app/trilhas/components/trilha-content.tsx` para importar `Trail` de `@acervo/schemas`
- [x] 2.4 Atualizar `src/app/trilhas/components/trilhas-card.tsx` para importar `Trail` de `@acervo/schemas`
- [x] 2.5 Atualizar `src/app/trilhas/[trailId]/page.tsx` para importar `Result`, `Trail` de `@acervo/schemas`
- [x] 2.6 Consolidar em `src/app/trilhas/[trailId]/components/trilha-detail.tsx` os imports de `Trail`, `TrailItem` (hoje via `@/packages/schemas/trail.api.schema`) e `FeedbackForm` (já via `@acervo/schemas`) em uma única declaração `import { ... } from "@acervo/schemas"`
- [x] 2.7 Atualizar `src/app/trilhas/[trailId]/components/video-frame.tsx` para importar `TrailItem` de `@acervo/schemas`
- [x] 2.8 Rodar busca por `@/packages/schemas` em `apps/web/src/app/trilhas` e verificar que não retorna nenhuma ocorrência

## 3. Migrar imports em `trilhas/[trailId]/feedback`

- [x] 3.1 Atualizar `src/app/trilhas/[trailId]/feedback/page.tsx` para importar `FeedbackForm`, `Result` de `@acervo/schemas`
- [x] 3.2 Rodar busca por `@/packages/schemas` em `apps/web/src/app/trilhas/[trailId]/feedback` e verificar que não retorna nenhuma ocorrência

## 4. Remover alias legado e validar

- [x] 4.1 Rodar busca por `@/packages` em todo `apps/web/src` e confirmar zero ocorrências restantes
- [x] 4.2 Rodar type-check (`npx tsc --noEmit` no diretório `apps/web`, ou `npm run build`) e verificar que passa sem erros com os imports já migrados
- [x] 4.3 Remover a entrada `"@/packages/*": ["../packages/*"]` de `apps/web/tsconfig.json`
- [x] 4.4 Rodar type-check novamente após remover o alias e verificar que continua passando sem erros
