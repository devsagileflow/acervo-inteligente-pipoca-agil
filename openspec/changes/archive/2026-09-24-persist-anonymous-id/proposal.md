# Proposal

## Why

O app `web` não exige login, então o `anonymousId` é a única forma de correlacionar ações de um mesmo dispositivo nos eventos de analytics. Hoje esse identificador é gerado de duas formas divergentes: `getAnonymousId()` (em `lib/analytics.ts`) persiste corretamente em `localStorage`, mas `TrilhaDetail` (`trilha-detail.tsx`) gera o seu próprio `crypto.randomUUID()` a cada render/reload e o repassa para `VideoFrame`, sem nunca salvá-lo. Resultado: os eventos de vídeo (`video_play`, `video_complete`, `video_paused`) recebem um `anonymousId` novo a cada recarregamento de página, quebrando a análise de engajamento por dispositivo.

## What Changes

- Extrair a geração/persistência do `anonymousId` de `lib/analytics.ts` para uma função reutilizável e estável, chamada por qualquer componente que precise do identificador (não apenas internamente pelo `trackEvent`).
- Corrigir `TrilhaDetail` para obter o `anonymousId` através dessa função compartilhada em vez de gerar um `crypto.randomUUID()` local descartável a cada montagem.
- Garantir que o identificador sobreviva a reload de página e a fechar/reabrir o navegador, usando armazenamento persistente no dispositivo (`localStorage`, com fallback ou espelhamento em cookie caso `localStorage` esteja indisponível).
- Nenhuma mudança de contrato na API de analytics (`/api/analytics/events`): o campo `anonymousId` já existe no payload e no schema compartilhado.

## Capabilities

### New Capabilities
- `anonymous-identity`: geração e persistência de um identificador anônimo único por dispositivo no `web`, reutilizado por todas as telas/eventos de analytics.

### Modified Capabilities
(nenhuma — `event-tracking` e `page-view-tracking` já descrevem apenas o comportamento do backend ao receber/persistir eventos; o contrato do payload não muda.)

## Impact

- `apps/web/src/lib/analytics.ts`: expõe `getAnonymousId` como API pública estável (já exportada) e é a única fonte de verdade para o identificador.
- `apps/web/src/app/trilhas/[trailId]/components/trilha-detail.tsx`: passa a chamar `getAnonymousId()` em vez de `crypto.randomUUID()`.
- Sem impacto em API/schemas (`packages/schemas`) ou banco de dados — mudança restrita ao `apps/web`.
