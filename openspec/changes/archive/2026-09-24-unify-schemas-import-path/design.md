# Design

## Context

`packages/schemas` é consumido de duas formas no `web`: como dependência de workspace `@acervo/schemas` (`apps/web/package.json` → `"file:../packages/schemas"`, listada em `next.config.ts` → `transpilePackages`) e via path alias de tsconfig `"@/packages/*": ["../packages/*"]`, que resolve para o mesmo diretório físico. Os dois caminhos exportam exatamente os mesmos módulos (`packages/schemas/index.ts` e arquivos individuais como `trail.api.schema.ts`), então não há divergência de tipos hoje — só duplicidade de forma de importar. Ver proposal.md - Why.

Arquivos em `apps/web/src` que hoje usam `@/packages/schemas*`:
- `src/app/(admin)/metricas/page.tsx`
- `src/app/(admin)/metricas/components/metricas-details.tsx`
- `src/app/(admin)/metricas/components/types.ts`
- `src/app/trilhas/page.tsx`
- `src/app/trilhas/[trailId]/page.tsx`
- `src/app/trilhas/[trailId]/components/trilha-detail.tsx` (já mistura com `@acervo/schemas` no mesmo arquivo)
- `src/app/trilhas/[trailId]/components/video-frame.tsx`
- `src/app/trilhas/[trailId]/feedback/page.tsx`
- `src/app/trilhas/components/cta-button.tsx`
- `src/app/trilhas/components/trilha-content.tsx`
- `src/app/trilhas/components/trilhas-card.tsx`

## Goals / Non-Goals

**Goals:**
- Único caminho de import para schemas compartilhados em todo `apps/web/src`: `@acervo/schemas`.
- Remover o path alias `@/packages/*` do `apps/web/tsconfig.json` para que não volte a ser usado por engano.
- Preservar exatamente os mesmos tipos/valores importados (apenas trocar a origem do import).

**Non-Goals:**
- Não mexer no conteúdo/exports de `packages/schemas` (nenhum schema, tipo ou arquivo é renomeado).
- Não introduzir subpath exports customizados em `@acervo/schemas` (ex.: `@acervo/schemas/trail.api.schema`) — imports de submódulo viram imports nomeados do barrel `@acervo/schemas`, que já reexporta tudo via `packages/schemas/index.ts`.
- Não tocar em `apps/api`, que já usa exclusivamente `@acervo/schemas` (fora de escopo, sem `@/packages` lá).

## Decisions

- **Substituir por imports do barrel `@acervo/schemas`, não por subpaths.** Alternativa considerada: manter imports diretos de arquivo (ex. `@acervo/schemas/trail.api.schema`). Rejeitada porque o pacote não declara `exports` para subpaths (só o entrypoint principal do `index.ts`); usar o barrel é o padrão já seguido pelos arquivos que importam corretamente hoje (`cards.tsx`, `charts.tsx`, `renderAPIForm.tsx`).
- **Remover o alias `@/packages/*` do tsconfig em vez de apenas deixar de usá-lo.** Deixar o alias vivo permitiria a regressão voltar silenciosamente. Como nenhum outro arquivo do workspace depende dele (confirmado por busca), a remoção é segura.
- **Migração mecânica arquivo a arquivo, sem lote via find/replace cego.** Cada arquivo precisa ter os imports mesclados manualmente quando já existir um import de `@acervo/schemas` no mesmo arquivo (ex. `trilha-detail.tsx`), para não gerar duas declarações de import do mesmo módulo.

## Risks / Trade-offs

- [Import duplicado/id colidente ao mesclar `@/packages/schemas` com `@acervo/schemas` já existentes no mesmo arquivo] → Revisar cada arquivo afetado individualmente e consolidar em uma única declaração `import { ... } from "@acervo/schemas"`.
- [Remoção do alias quebrar algum uso não capturado pela busca textual] → Rodar `tsc --noEmit` (ou `next build`) em `apps/web` após a migração e antes de remover o alias do tsconfig, para validar que nenhuma referência restante depende dele.
- [Regressão visual/funcional indireta] → Mudança é só de import path, sem alteração de lógica; risco residual é baixo, mitigado pelo type-check.

## Migration Plan

1. Atualizar os 10 arquivos listados no Context para importar de `@acervo/schemas`.
2. Rodar type-check (`tsc --noEmit` ou `next build`) em `apps/web`.
3. Remover `"@/packages/*": ["../packages/*"]` de `apps/web/tsconfig.json`.
4. Rodar type-check novamente para confirmar que nada mais depende do alias removido.

Rollback: reverter o commit; não há mudança de dado/estado persistido, apenas código-fonte e config.
