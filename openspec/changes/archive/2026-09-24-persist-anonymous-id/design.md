# Design

## Context

`apps/web/src/lib/analytics.ts` já implementa `getAnonymousId()`: lê `localStorage["pipoca-agil:anonymous-id"]`, gera um `crypto.randomUUID()` na ausência e persiste. Essa função é usada internamente por `trackEvent` (via `payload.anonymousId ?? getAnonymousId()`) e já é exportada. O problema é um único ponto de chamada indevido: `TrilhaDetail` (`apps/web/src/app/trilhas/[trailId]/components/trilha-detail.tsx`) calcula seu próprio `anonymousId` com `useMemo(() => crypto.randomUUID(), [])` e o repassa como prop para `VideoFrame`, que o usa para os eventos `video_play`/`video_paused`/`video_complete`. Esse valor não é persistido nem reaproveitado, mudando a cada remontagem do componente (reload de página, navegação de volta, etc.).

## Goals / Non-Goals

**Goals:**
- Um único identificador anônimo por dispositivo, estável entre reloads e entre sessões do navegador.
- Todos os pontos do `web` que hoje geram ou consomem `anonymousId` passam a usar a mesma fonte (`getAnonymousId()`).
- Resiliência básica: se `localStorage` estiver indisponível (modo privado restritivo, quota excedida), o app não deve quebrar — degrada para um identificador só-de-sessão em vez de lançar erro.

**Non-Goals:**
- Não introduz autenticação de usuário nem vincula o identificador anônimo a uma conta.
- Não altera o schema/contrato da API de analytics (`AnalyticsEventPayload.anonymousId` já existe).
- Não implementa sincronização do identificador entre dispositivos diferentes do mesmo usuário.

## Decisions

- **Continuar usando `localStorage` como storage primário** (em vez de cookies): já é o mecanismo em uso por `getAnonymousId()`, não exige envio em toda requisição HTTP (evita overhead/observação em cookies), e é suficiente para o caso de uso (correlação client-side, sem necessidade de leitura no servidor/SSR). Cookies seriam necessários apenas se o backend precisasse ler o identificador no primeiro request (SSR), o que não é o caso hoje — os componentes que usam `anonymousId` (`TrilhaDetail`, `VideoFrame`) são client components.
- **Corrigir o ponto de chamada em vez de criar um novo mecanismo**: `TrilhaDetail` deve chamar `getAnonymousId()` (já exportado por `lib/analytics.ts`) em vez de `crypto.randomUUID()` local. Isso elimina a duplicidade sem introduzir uma nova abstração (hook, contexto, etc.) para um valor que já é acessível via import direto.
- **Fallback em memória quando `localStorage` não está disponível**: `getAnonymousId()` deve capturar exceções de leitura/escrita (`try/catch`) e, nesse caso, gerar um identificador válido apenas para o ciclo de vida da página atual (sem persistir), em vez de lançar erro e quebrar o tracking. Alternativa considerada — silenciosamente retornar `undefined` — foi descartada porque deixaria eventos sem `anonymousId`, prejudicando a correlação mesmo dentro de uma única sessão.
- **Sem migração de dados**: identificadores já gerados e persistidos por `getAnonymousId()` continuam válidos (mesma chave `pipoca-agil:anonymous-id`). Apenas os identificadores efêmeros gerados incorretamente por `TrilhaDetail` deixam de existir a partir do próximo carregamento após o deploy.

## Risks / Trade-offs

- [Usuário limpa `localStorage` manualmente ou usa navegação anônima] → Aceitável: um novo identificador é gerado, tratado como "novo dispositivo" para fins de analytics; comportamento já existente e aceito no design atual.
- [`localStorage` indisponível/bloqueado por política do navegador] → Mitigado pelo fallback em memória: tracking continua funcionando dentro da sessão atual, apenas sem persistência entre reloads (degradação graciosa, não quebra).
- [Componentes futuros reintroduzirem geração local de `anonymousId` por engano] → Mitigado documentando `getAnonymousId()` como única fonte no `spec.md` da capability `anonymous-identity`; não há enforcement automático (lint) neste change.
