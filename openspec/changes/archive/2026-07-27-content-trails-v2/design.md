## Context

A API atual usa Fastify + TypeScript + Zod + Prisma com organização por feature (route/service), autorização por papel e contratos compartilhados. O novo módulo precisa introduzir gestão de vídeos e trilhas sem acoplar o domínio ao tipo de conteúdo inicial (YouTube), preservando evolução para outros tipos (imagem, documento, texto, áudio, etc.).

Há duas etapas de entrega: (1) CRUD de vídeo com governança administrativa e leitura pública de ativos; (2) CRUD de trilha com itens ordenados, inicialmente apenas vídeo, e preparação para conteúdo polimórfico. O sistema também deve registrar progresso de usuário em trilhas.

## Goals / Non-Goals

**Goals:**

- Entregar modelagem de domínio para vídeos, trilhas, itens de trilha e progresso de usuário.
- Garantir baixo acoplamento entre trilha e tipo de conteúdo usando referência polimórfica (contentType + contentId).
- Garantir autorização por papel para operações administrativas.
- Garantir leitura pública de vídeos ativos e trilhas publicadas.
- Permitir expansão de tipos de conteúdo sem refatoração estrutural significativa.
- Manter aderência aos padrões atuais da API (schema-first, route/service, erro padronizado).

**Non-Goals:**

- Upload, transcodificação ou hospedagem de mídia.
- Regras de bloqueio pedagógico (drip, prerequisite lock, liberação por etapa).
- Recomendação inteligente de trilhas.
- Suporte completo a outros tipos de conteúdo nesta entrega (apenas preparo arquitetural).

## Decisions

### 1) Modelo de conteúdo polimórfico no item de trilha

- Decisão: usar trail_items com contentType + contentId para referenciar o conteúdo concreto.
- Racional: desacopla trilha de entidade específica de vídeo e permite novos tipos com mínima mudança estrutural.
- Alternativas consideradas:
  - FK fixa para videos: simples no curto prazo, porém alto acoplamento e baixa extensibilidade.
  - Tabela separada por tipo de item: aumenta complexidade operacional e custo de evolução inicial.

Decisão complementar: em conflito de position dentro da mesma trilha, o sistema aplica deslocamento automático dos demais itens para manter ordenação consistente.

### 2) Separação de responsabilidades por camadas de aplicação

- Decisão: manter padrão atual route (contrato/HTTP) + service (regras de aplicação) + persistência via Prisma.
- Racional: mantém coesão, facilita testes e reduz impacto transversal em evolução futura.
- Alternativas consideradas:
  - Lógica concentrada na rota: acelera início, mas degrada manutenção.
  - Repositórios genéricos excessivos: abstração prematura sem ganho claro no escopo atual.

### 3) Estratégia de ciclo de vida com soft delete

- Decisão: vídeos e trilhas devem suportar soft delete por flags/metadata de remoção.
- Racional: preserva histórico e evita quebra de referência de trilhas/progresso.
- Alternativas consideradas:
  - Hard delete: simplifica storage, mas compromete rastreabilidade e integridade histórica.

Decisão complementar: endpoints públicos ocultam 100% dos registros soft deleted.

### 4) Contrato público de leitura desacoplado de administração

- Decisão: endpoints de leitura pública retornam apenas vídeos ativos e trilhas publicadas; endpoints de escrita exigem ADMIN.
- Racional: separa claramente consumo público e governança editorial.
- Alternativas consideradas:
  - Endpoints únicos com filtros de permissão implícitos: aumenta risco de regressão de segurança.

Decisão complementar: leitura pública será acessível de forma anônima.

### 5) Progresso de trilha por usuário com cálculo derivado

- Decisão: registrar visualização por item e derivar percentual/conclusão por trilha.
- Racional: modelo evolutivo para analytics e novos tipos de conteúdo sem recalcular regras por tipo.
- Alternativas consideradas:
  - Armazenar apenas percentual agregado: barato inicialmente, porém opaco para auditoria/reprocessamento.

Decisão complementar: estratégia híbrida para trilhas alteradas, preservando histórico de progresso e adaptando o cálculo conforme política vigente de composição.

### 6) Extensibilidade de contentType com compatibilidade

- Decisão: iniciar com valor VIDEO e manter contrato preparado para novos valores com validação centralizada.
- Racional: preserva compatibilidade e evita quebra de APIs quando novos tipos forem habilitados.
- Alternativas consideradas:
  - Tipo livre (string sem governança): flexível, porém propenso a inconsistência semântica.

Decisão complementar: validação de URL aceitará todos os formatos YouTube suportados pelo produto, com normalização centralizada.

### 7) Regra de conclusão baseada em itens obrigatórios

- Decisão: conclusão de trilha considera apenas itens com isRequired=true.
- Racional: permite trilhas com conteúdo complementar opcional sem penalizar conclusão de percurso principal.
- Alternativas consideradas:
  - Conclusão por 100% dos itens: simples, porém reduz flexibilidade pedagógica.

### 8) Tratamento de item com conteúdo inativo

- Decisão: ao desativar/remover logicamente um vídeo, o trail_item permanece e deve ser gerenciado por ADMIN.
- Racional: preserva integridade da trilha e evita perda de histórico/referência.
- Alternativas consideradas:
  - Remoção automática do item: reduz manutenção imediata, porém compromete rastreabilidade.

### 9) Semântica de atualização via PUT

- Decisão: operações PUT terão semântica parcial (atualiza apenas campos enviados).
- Racional: reduz risco de perda acidental de dados e facilita evolução compatível de payloads.
- Alternativas consideradas:
  - PUT total estrito: favorece substituição completa, porém aumenta risco operacional para clientes.

### 10) Regra de cálculo de percentual

- Decisão: percentual de progresso considera somente itens ativos/publicados na composição atual da trilha.
- Racional: garante consistência entre experiência pública e progresso percebido pelo usuário.
- Alternativas consideradas:
  - Considerar todos os itens, inclusive inativos/não publicados: gera distorção de progresso.

## Risks / Trade-offs

- [Ambiguidade de regras de ordenação em conflito de posição] -> Mitigação: definir contrato explícito (erro vs reordenação) antes do apply.
- [Mudança de composição da trilha afetar progresso já calculado] -> Mitigação: definir política de recálculo e versionamento lógico da trilha.
- [Referência polimórfica sem FK nativa por tipo] -> Mitigação: validação de existência por contentType/contentId na camada de aplicação.
- [Exposição indevida de conteúdo inativo/não publicado] -> Mitigação: separar consultas públicas e administrativas com filtros obrigatórios.
- [Crescimento de consultas de progresso] -> Mitigação: índices por userId/trailId/contentType/contentId e paginação em endpoints de leitura.

## Migration Plan

1. Criar migrações para videos, trails, trail_items e progresso de trilha.
2. Publicar endpoints administrativos e públicos com validação e autorização.
3. Popular dados iniciais com vídeos e trilhas de teste.
4. Validar consultas públicas e regras de visibilidade.
5. Ativar rastreamento de progresso em fluxo de consumo.
6. Monitorar erros de validação/autorização e desempenho de listagens.

Rollback:

- Reverter deploy da API para versão anterior.
- Manter dados novos sem exposição pública até decisão de migração reversa.
- Caso necessário, aplicar migração corretiva sem hard delete.

## Open Questions

- Nenhuma pendência crítica em aberto.
