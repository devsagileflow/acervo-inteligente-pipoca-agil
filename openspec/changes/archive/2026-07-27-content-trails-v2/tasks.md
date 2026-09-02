## 1. Alinhamento de Regras Críticas

- [x] 1.1 Confirmar política de acesso de leitura pública (anônimo vs autenticado) para vídeos ativos e trilhas publicadas
- [x] 1.2 Confirmar política de conflito de position em trail_items (erro, deslocamento ou reindexação)
- [x] 1.3 Confirmar política de recálculo de progresso quando composição da trilha for alterada
- [x] 1.4 Confirmar critério de conclusão da trilha (todos os itens vs apenas required)
- [x] 1.5 Confirmar formatos aceitos de URL YouTube (watch, short, embed, youtu.be)

## 2. Modelagem de Dados e Migrações

- [x] 2.1 Criar modelos Prisma para videos, trails e trail_items com campos de auditoria e soft delete
- [x] 2.2 Criar modelo(s) de progresso por usuário/trilha/item com índices para consultas eficientes
- [x] 2.3 Definir enum de contentType iniciando com VIDEO e estrutura compatível com expansão futura
- [x] 2.4 Gerar e revisar migração SQL garantindo integridade, índices e constraints essenciais

## 3. Contratos e Schemas Compartilhados

- [x] 3.1 Criar schemas de request/response para CRUD de vídeos com validações de URL e duração
- [x] 3.2 Criar schemas de request/response para CRUD de trilhas e operações de publicação
- [x] 3.3 Criar schemas para gerenciamento de itens de trilha com contentType/contentId/position/isRequired
- [x] 3.4 Criar schemas para operações de progresso de trilha e payloads de leitura

## 4. Implementação da API de Vídeos (Etapa 1)

- [x] 4.1 Implementar service de vídeo com create, list paginado/filtrado, getById, update e soft delete
- [x] 4.2 Implementar rotas REST de vídeo com validação Zod e respostas padronizadas
- [x] 4.3 Aplicar autorização ADMIN em operações de escrita e leitura pública somente para vídeos ativos
- [x] 4.4 Cobrir cenários de erro (validação, não encontrado, não autorizado)

## 5. Implementação da API de Trilhas e Itens (Etapa 2)

- [x] 5.1 Implementar service de trilha com create, list, getById, update e soft delete
- [x] 5.2 Implementar rotas REST de trilha com leitura pública de trilhas publicadas
- [x] 5.3 Implementar service de itens da trilha com add, update e remove mantendo ordenação por position
- [x] 5.4 Implementar rotas de itens da trilha com autorização ADMIN e validação de contentType suportado
- [x] 5.5 Garantir que ordenação não imponha bloqueio de acesso ao próximo conteúdo

## 6. Implementação de Progresso da Trilha

- [x] 6.1 Implementar persistência de visualização por item para usuário autenticado
- [x] 6.2 Implementar cálculo de percentual de conclusão por trilha
- [x] 6.3 Implementar marcação de conclusão de trilha conforme regra validada
- [x] 6.4 Garantir compatibilidade do progresso com futura expansão de tipos de conteúdo

## 7. Qualidade, Segurança e Documentação

- [x] 7.1 Criar testes de autorização para rotas administrativas de vídeos, trilhas e itens
- [x] 7.2 Criar testes de integração para fluxos públicos de leitura (ativos/publicados)
- [x] 7.3 Criar testes de progress tracking (visualização, percentual, conclusão)
- [x] 7.4 Atualizar documentação da API e exemplos de uso para novos endpoints
- [x] 7.5 Executar validação final do OpenSpec e ajustar pendências antes de apply
