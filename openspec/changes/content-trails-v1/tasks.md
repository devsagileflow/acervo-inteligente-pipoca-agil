## 1. Alinhamento de Regras Críticas

- [x] 1.1 Confirmar política de acesso de leitura pública (anônimo vs autenticado) para vídeos ativos e trilhas publicadas
- [x] 1.2 Confirmar política de conflito de position em trail_items (erro, deslocamento ou reindexação)
- [x] 1.3 Confirmar política de recálculo de progresso quando composição da trilha for alterada
- [x] 1.4 Confirmar critério de conclusão da trilha (todos os itens vs apenas required)
- [x] 1.5 Confirmar formatos aceitos de URL YouTube (watch, short, embed, youtu.be)

## 2. Modelagem de Dados e Migrações

- [ ] 2.1 Criar modelos Prisma para videos, trails e trail_items com campos de auditoria e soft delete
- [ ] 2.2 Criar modelo(s) de progresso por usuário/trilha/item com índices para consultas eficientes
- [ ] 2.3 Definir enum de contentType iniciando com VIDEO e estrutura compatível com expansão futura
- [ ] 2.4 Gerar e revisar migração SQL garantindo integridade, índices e constraints essenciais

## 3. Contratos e Schemas Compartilhados

- [ ] 3.1 Criar schemas de request/response para CRUD de vídeos com validações de URL e duração
- [ ] 3.2 Criar schemas de request/response para CRUD de trilhas e operações de publicação
- [ ] 3.3 Criar schemas para gerenciamento de itens de trilha com contentType/contentId/position/isRequired
- [ ] 3.4 Criar schemas para operações de progresso de trilha e payloads de leitura

## 4. Implementação da API de Vídeos (Etapa 1)

- [ ] 4.1 Implementar service de vídeo com create, list paginado/filtrado, getById, update e soft delete
- [ ] 4.2 Implementar rotas REST de vídeo com validação Zod e respostas padronizadas
- [ ] 4.3 Aplicar autorização ADMIN em operações de escrita e leitura pública somente para vídeos ativos
- [ ] 4.4 Cobrir cenários de erro (validação, não encontrado, não autorizado)

## 5. Implementação da API de Trilhas e Itens (Etapa 2)

- [ ] 5.1 Implementar service de trilha com create, list, getById, update e soft delete
- [ ] 5.2 Implementar rotas REST de trilha com leitura pública de trilhas publicadas
- [ ] 5.3 Implementar service de itens da trilha com add, update e remove mantendo ordenação por position
- [ ] 5.4 Implementar rotas de itens da trilha com autorização ADMIN e validação de contentType suportado
- [ ] 5.5 Garantir que ordenação não imponha bloqueio de acesso ao próximo conteúdo

## 6. Implementação de Progresso da Trilha

- [ ] 6.1 Implementar persistência de visualização por item para usuário autenticado
- [ ] 6.2 Implementar cálculo de percentual de conclusão por trilha
- [ ] 6.3 Implementar marcação de conclusão de trilha conforme regra validada
- [ ] 6.4 Garantir compatibilidade do progresso com futura expansão de tipos de conteúdo

## 7. Qualidade, Segurança e Documentação

- [ ] 7.1 Criar testes de autorização para rotas administrativas de vídeos, trilhas e itens
- [ ] 7.2 Criar testes de integração para fluxos públicos de leitura (ativos/publicados)
- [ ] 7.3 Criar testes de progress tracking (visualização, percentual, conclusão)
- [ ] 7.4 Atualizar documentação da API e exemplos de uso para novos endpoints
- [ ] 7.5 Executar validação final do OpenSpec e ajustar pendências antes de apply
