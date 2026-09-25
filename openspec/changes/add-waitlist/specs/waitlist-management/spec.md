## ADDED Requirements

### Requirement: Inscrição pública na waitlist
O sistema SHALL permitir que qualquer visitante, sem autenticação, se inscreva na waitlist enviando ao menos nome e email. Papel/persona e mensagem são opcionais.

#### Scenario: Inscrição com dados válidos
- **WHEN** um visitante envia `POST /api/waitlist` com nome e email válidos
- **THEN** o sistema cria uma nova inscrição e retorna os dados cadastrados com código 201

#### Scenario: Inscrição com dados complementares opcionais
- **WHEN** um visitante envia `POST /api/waitlist` com nome, email, papel (`PO`, `SM`, `DEV` ou `OTHER`) e mensagem
- **THEN** o sistema persiste todos os campos enviados e retorna a inscrição criada

#### Scenario: Nome ou email ausentes
- **WHEN** um visitante envia `POST /api/waitlist` sem nome ou sem email
- **THEN** o sistema rejeita a requisição com erro de validação (400) e não cria nenhum registro

### Requirement: Idempotência por email
O sistema SHALL impedir múltiplas inscrições para o mesmo email, retornando a inscrição já existente em vez de criar um duplicado ou retornar erro.

#### Scenario: Reenvio com email já cadastrado
- **WHEN** um visitante envia `POST /api/waitlist` com um email que já existe na waitlist
- **THEN** o sistema NÃO cria um novo registro e retorna a inscrição existente com código 200

### Requirement: Listagem administrativa da waitlist
O sistema SHALL permitir que apenas usuários autenticados com papel ADMIN listem as inscrições da waitlist de forma paginada.

#### Scenario: Administrador lista inscrições
- **WHEN** um usuário autenticado com papel ADMIN faz `GET /api/waitlist`
- **THEN** o sistema retorna a lista paginada de inscrições (itens, página, tamanho de página, total e total de páginas)

#### Scenario: Usuário sem sessão tenta listar
- **WHEN** uma requisição sem sessão autenticada faz `GET /api/waitlist`
- **THEN** o sistema retorna erro 401 (Unauthorized) e não expõe nenhum dado da waitlist

#### Scenario: Usuário autenticado sem papel ADMIN tenta listar
- **WHEN** um usuário autenticado sem papel ADMIN faz `GET /api/waitlist`
- **THEN** o sistema retorna erro 403 (Forbidden) e não expõe nenhum dado da waitlist
