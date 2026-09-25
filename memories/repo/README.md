# Repo Memories Guide

Objetivo: manter conhecimento reutilizavel, curto e confiavel dentro do repositorio.

## Arquivos

- `memories/repo/pipoca-agil-overview.md`
  - Visao de produto, contexto de negocio, pilares, jornada e decisoes de escopo.
  - Atualize quando houver mudanca de direcionamento, prioridades ou definicao de MVP.

- `memories/repo/api-architecture-patterns.md`
  - Arquitetura da API, padroes operacionais, contratos, plugins e notas de implementacao.
  - Atualize quando houver mudanca estrutural na API, padrao de desenvolvimento ou convencoes de endpoint/schema.

- `memories/repo/web-architecture-patterns.md`
  - Arquitetura do `apps/web`, padroes de fetch/dados, inconsistencias conhecidas e notas de implementacao.
  - Atualize quando houver mudanca estrutural no web, padrao de desenvolvimento ou convencoes de rota/schema.

- `memories/repo/web-change-proposal-candidates.md`
  - Backlog de candidatos a change proposals identificados em exploracao do web/packages.
  - Atualize o status de cada item quando uma change correspondente for criada, arquivada ou descartada.

## Regras de Ouro

- Escreva curto e objetivo.
- Registre fatos verificados, nao suposicoes.
- Prefira bullets em vez de texto longo.
- Evite duplicidade entre arquivos; se necessario, deixe ponteiro para o arquivo certo.
- Quando um item ficar obsoleto, atualize ou remova.

## Checklist Rapido de Atualizacao

- Mudou estrategia de produto? -> atualizar overview.
- Mudou arquitetura/padroes da API? -> atualizar api-architecture-patterns.
- Mudou arquitetura/padroes do web? -> atualizar web-architecture-patterns.
- Criou/arquivou uma change a partir do backlog? -> atualizar status em web-change-proposal-candidates.
- Mudou mais de um escopo? -> atualizar cada arquivo correspondente.
