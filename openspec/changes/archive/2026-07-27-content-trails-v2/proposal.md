## Why

A plataforma precisa evoluir de um acervo disperso para uma experiência estruturada de aprendizado orientada por trilhas. Este é o momento de definir uma base de domínio extensível que comece com vídeos do YouTube, mas não imponha refatoração estrutural relevante quando novos tipos de conteúdo forem adicionados.

## What Changes

- Introduzir CRUD completo de Vídeo (YouTube) com governança administrativa e visibilidade pública controlada por estado ativo.
- Introduzir CRUD completo de Trilha com publicação e composição por itens ordenados.
- Introduzir gerenciamento de itens da trilha com modelagem orientada a tipo de conteúdo, iniciando por vídeo.
- Introduzir rastreamento de progresso por usuário em trilhas (conteúdos visualizados, percentual e conclusão).
- Definir contratos de API para listagem paginada e filtros de vídeo por título.
- Aplicar soft delete para vídeos e trilhas, preservando histórico e compatibilidade futura.
- Definir restrições de autorização por papel (admin vs usuário autenticado/comum).
- Preparar arquitetura para expansão de content types sem quebra de compatibilidade de dados e APIs.

## Capabilities

### New Capabilities

- video-management: CRUD de vídeos do YouTube com validações, visibilidade e soft delete.
- trail-management: CRUD de trilhas publicáveis, incluindo manutenção de metadados e ciclo de vida.
- trail-item-management: composição ordenada de trilha por item polimórfico (contentType + contentId), iniciando com vídeo.
- trail-progress-tracking: registro de progresso do usuário por trilha e item visualizado com cálculo de percentual e conclusão.

### Modified Capabilities

- Nenhuma capacidade existente será alterada neste momento (repositório sem specs existentes).

## Impact

- Banco de dados:
  - Novas entidades principais: videos, trails, trail_items.
  - Nova entidade de progresso (ex.: trail_progress e/ou trail_item_progress) para suportar percentual e conclusão por usuário.
  - Novos índices para listagem por status/publicação, ordenação por posição e consultas por usuário/trilha.
- API:
  - Novos endpoints REST para vídeos, trilhas e itens de trilha.
  - Regras de autorização para operações administrativas.
  - Endpoints públicos para leitura de vídeos ativos e trilhas publicadas.
- Domínio e arquitetura:
  - Introdução de modelagem polimórfica de item de trilha visando extensibilidade para novos content types.
  - Aplicação de separação de responsabilidades (contrato HTTP, aplicação, domínio, infraestrutura).
- Segurança e governança:
  - Restrições de acesso por papel em comandos de escrita.
  - Regras de integridade para posição de item por trilha.
- Operação e manutenção:
  - Migrações Prisma e atualização de schemas compartilhados para manter contrato estável entre API e consumidores.

## Decision Log (Aligned)

- A leitura pública de vídeos ativos e trilhas publicadas será anônima.
- Em conflito de posição de item na trilha, será aplicado deslocamento automático de ordenação.
- A política de progresso após mudanças na trilha será híbrida (preserva histórico e adapta cálculo conforme regra de composição vigente).
- A conclusão da trilha será baseada apenas em itens marcados como required.
- A validação de URL de vídeo aceitará todos os formatos YouTube suportados pelo produto.
- Quando um vídeo for desativado/removido logicamente, o item da trilha permanece e a gestão fica sob responsabilidade administrativa.
- Endpoints públicos devem sempre ocultar entidades soft deleted.
- Percentual da trilha considera apenas itens ativos/publicados.
- Operações de atualização com PUT usarão semântica parcial (comportamento equivalente a PATCH).

## Open Questions (Remaining)

- Nenhuma pendência crítica em aberto.
