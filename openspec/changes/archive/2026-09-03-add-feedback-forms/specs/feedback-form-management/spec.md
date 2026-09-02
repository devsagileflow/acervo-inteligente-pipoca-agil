## MODIFIED Requirements

### Requirement: Listagem pública de formulários de feedback

A API SHALL expor um endpoint público para listar formulários de feedback publicados (`isPublished=true`, `isActive=true`, `deletedAt=null`), com suporte a filtro opcional por vínculo (`contentType` + `contentId`).

#### Scenario: Listar formulários publicados

- **WHEN** um cliente (autenticado ou anônimo) chama `GET /api/feedback-forms`
- **THEN** a API retorna somente formulários publicados, ativos e não excluídos

#### Scenario: Filtrar formulários por vínculo com conteúdo

- **WHEN** um cliente chama `GET /api/feedback-forms?contentType=TRAIL&contentId=<id>`
- **THEN** a API retorna apenas formulários vinculados àquele `contentType` e `contentId`

#### Scenario: Formulário não publicado é ocultado

- **WHEN** um formulário existe com `isPublished=false` ou `isActive=false` ou `deletedAt` preenchido
- **THEN** esse formulário não aparece na listagem pública

### Requirement: Consulta de formulário com perguntas

A API SHALL expor um endpoint público para consultar um formulário publicado por `id`, retornando suas perguntas ordenadas, incluindo tipo de pergunta, obrigatoriedade e opções (quando aplicável).

#### Scenario: Consultar formulário existente e publicado

- **WHEN** um cliente chama `GET /api/feedback-forms/:formId` para um formulário publicado
- **THEN** a API retorna o formulário com suas perguntas ordenadas por posição, incluindo `type`, `isRequired` e, para perguntas do tipo `MULTIPLE_CHOICE`, a lista de opções ordenadas

#### Scenario: Formulário inexistente ou não publicado

- **WHEN** um cliente chama `GET /api/feedback-forms/:formId` para um `id` inexistente, não publicado, inativo ou excluído
- **THEN** a API retorna 404 Not Found
