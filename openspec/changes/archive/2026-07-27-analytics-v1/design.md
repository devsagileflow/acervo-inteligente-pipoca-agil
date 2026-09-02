## Context

O produto precisa instrumentar comportamento de navegação e engajamento para medir qualidade, descoberta e eficácia de CTAs. Hoje a API já possui autenticação, logging, Prisma e roteamento em Fastify, mas não existe um modelo de analytics nem um ponto padronizado para registrar page views e eventos de interação.

A solução precisa funcionar para usuários autenticados e anônimos, operar com baixo atrito no frontend e permitir consultas simples de métricas como views totais, views únicas e cliques por CTA.

## Goals / Non-Goals

**Goals:**

- Registrar eventos unitários de analytics com contexto suficiente para análise.
- Capturar page views de forma confiável na navegação do site.
- Correlacionar eventos autenticados e anônimos.
- Manter o contrato de dados simples, validado e extensível.

**Non-Goals:**

- Não implementar pipeline de eventos em lote na V1.
- Não implementar consentimento LGPD completo nesta etapa.
- Não implementar dashboards avançados ou BI externo.
- Não implementar uma solução distribuída de alto volume para analytics.

## Decisions

1. **Persistir eventos em Postgres com Prisma**
   - Rationale: reduz complexidade operacional e reaproveita a infraestrutura existente.
   - Alternatives considered: fila de eventos ou data warehouse dedicado. Foram descartados na V1 por custo e complexidade.

2. **Usar endpoint unitário por evento**
   - Rationale: simplifica validação, debug e instrumentação inicial do frontend.
   - Alternatives considered: ingestão em lote. Seria mais eficiente em volume, mas aumenta complexidade inicial sem necessidade comprovada.

3. **Correlacionar anonimato com anonymousId no cliente e sessão no servidor quando existir**
   - Rationale: cobre navegação anônima sem depender de cookies acessíveis no frontend e mantém vínculo com usuário logado quando disponível.
   - Alternatives considered: depender apenas de userId. Isso excluiria acessos anônimos, que são importantes para métricas de descoberta.

4. **Capturar o mínimo necessário de contexto e derivar o restante no backend**
   - Rationale: o frontend envia pagePath, eventType e metadados do clique; o backend agrega ip, userAgent e sessão quando possível.
   - Alternatives considered: enviar tudo do frontend. Isso aumenta acoplamento e reduz confiabilidade dos dados.

5. **Separar as capacidades em duas specs: event-tracking e page-view-tracking**
   - Rationale: mantém requisitos claros, facilita testes e permite evolução independente sem misturar semânticas diferentes em um único documento.
   - Alternatives considered: uma spec única de analytics. Seria mais curta, mas menos precisa para implementação e validação.

## Risks / Trade-offs

- Persistir eventos brutos pode crescer rápido em volume -> mitigar com retenção definida, índices corretos e eventual agregação futura.
- Tráfego de analytics pode competir com rotas principais -> mitigar com rate limit dedicado e payload estritamente validado.
- Page views podem inflar com refresh/back navigation -> mitigar com deduplicação técnica posterior ou agregação por janela para relatórios.
- Capturar dados demais pode gerar ruído analítico -> mitigar com contrato mínimo e naming convention clara para ctaId e pagePath.
