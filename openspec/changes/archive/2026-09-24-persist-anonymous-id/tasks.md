# Tasks

## 1. Robustecer `getAnonymousId`

- [x] 1.1 Em `apps/web/src/lib/analytics.ts`, envolver a leitura/escrita de `localStorage` em `getAnonymousId()` com `try/catch`; em caso de exceção, gerar e retornar um `crypto.randomUUID()` em memória (sem persistir) e verificar que a função nunca lança erro mesmo simulando `localStorage` indisponível (ex.: mock lançando exceção em teste manual/console).
- [x] 1.2 Confirmar que `getAnonymousId()` continua sendo exportado e retorna o mesmo valor entre chamadas sucessivas na mesma sessão quando `localStorage` está disponível (teste manual: chamar duas vezes no console do browser e comparar).

## 2. Corrigir geração local em `TrilhaDetail`

- [x] 2.1 Em `apps/web/src/app/trilhas/[trailId]/components/trilha-detail.tsx`, remover `const anonymousId = useMemo<string>(() => crypto.randomUUID(), [])` e importar/usar `getAnonymousId()` de `@/lib/analytics` no lugar, verificando que o componente compila sem erros de tipo (`npx tsc --noEmit` ou build do Next).
- [x] 2.2 Verificar visualmente (DevTools > Application > Local Storage) que o valor de `pipoca-agil:anonymous-id` usado pelos eventos de vídeo (`video_play`, `video_paused`, `video_complete`) em uma trilha é o mesmo antes e depois de um reload da página.

## 3. Validação end-to-end

- [x] 3.1 Rodar o app localmente (`apps/web`), abrir uma trilha com vídeo, disparar um evento (play/pause) e confirmar no painel de rede que o `anonymousId` enviado ao endpoint `/api/analytics/events` é idêntico ao presente em `localStorage["pipoca-agil:anonymous-id"]`.
- [x] 3.2 Recarregar a página da trilha e repetir a interação de vídeo, confirmando que o `anonymousId` enviado permanece igual ao da etapa 3.1 (nenhum novo UUID é gerado).
- [x] 3.3 Rodar `npx next build` em `apps/web` e confirmar que o build passa sem erros novos introduzidos por esta mudança.
