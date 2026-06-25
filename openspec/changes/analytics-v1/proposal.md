## Why

Precisamos medir comportamento real do site para suportar decisões de produto e qualidade com dados, não só impressão subjetiva. Hoje não existe uma base estruturada para registrar page views e interações, então a análise de acesso, engajamento e funis fica limitada.

## What Changes

- Adicionar captura de eventos de interação do site, começando por cliques e outros eventos básicos de engajamento.
- Adicionar captura de page views para saber quantas vezes cada página foi exibida.
- Permitir correlação entre eventos anônimos e autenticados por meio de um identificador anônimo no cliente e vínculo com sessão quando disponível.
- Expor base para consultas futuras de métricas como views totais, views únicas e cliques por CTA.

## Capabilities

### New Capabilities

- `event-tracking`: captura e persistência de eventos de interação do site, como clique, scroll e ações de mídia.
- `page-view-tracking`: captura e persistência de exibições de página com contexto suficiente para métricas de acesso.

### Modified Capabilities

- None.

## Impact

- Novo endpoint de ingestão de eventos na API.
- Novo modelo de persistência para analytics no banco.
- Nova instrumentação no frontend para disparo de page views e cliques.
- Novos schemas compartilhados para validar payloads de analytics.
- Novas consultas para métricas e bases de relatório no futuro.
