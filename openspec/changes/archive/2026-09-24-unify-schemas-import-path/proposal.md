# Proposal

## Why

O `web` importa schemas compartilhados de duas formas equivalentes: o pacote de workspace `@acervo/schemas` e o alias de tsconfig `@/packages/schemas/*`, que aponta para o mesmo diretório físico (`packages/schemas`). O alias era necessário antes de `packages/schemas` virar um pacote npm real (`@acervo/schemas`), mas continuou em uso mesmo após a migração — inclusive misturado no mesmo arquivo (`trilha-detail.tsx`). Isso é apenas dívida de import path, sem impacto de comportamento, mas gera confusão sobre qual caminho é o "correto" e dificulta futuras mudanças no pacote de schemas (dois pontos de acoplamento para o mesmo módulo).

## What Changes

- Substituir todos os imports `@/packages/schemas` (e subcaminhos como `@/packages/schemas/trail.api.schema`, `@/packages/schemas/index`) por `@acervo/schemas` em `apps/web/src`.
- Remover a entrada `"@/packages/*": ["../packages/*"]` de `apps/web/tsconfig.json` para impedir que o alias volte a ser usado.
- Nenhuma mudança de comportamento, contrato de API ou tipo exportado — apenas o caminho de import.

## Capabilities

### New Capabilities
(nenhuma)

### Modified Capabilities
(nenhuma — mudança é puramente de organização de imports, sem alteração de requisitos/comportamento observável)

## Impact

- Código afetado: 10 arquivos em `apps/web/src/app/**` que hoje importam de `@/packages/schemas*` (lista completa em `design.md`).
- Configuração: `apps/web/tsconfig.json` (remoção do path alias `@/packages/*`).
- Sem mudança em `apps/web/package.json`, `next.config.ts` ou no pacote `packages/schemas` em si.
- Risco baixo: mudança mecânica de import path, validada por `tsc`/build do Next.js.
