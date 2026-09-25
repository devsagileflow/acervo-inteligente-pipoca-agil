# Feedback Response Management

## Purpose

> TBD - define purpose once the capability is fully stabilized.
## Requirements
### Requirement: Envio de respostas a um formulário

A API SHALL expor um endpoint público para salvar as respostas de um usuário a um formulário de feedback publicado, aceitando envio tanto de usuários logados quanto anônimos.

#### Scenario: Envio por usuário logado

- **WHEN** um usuário autenticado (com `sessionUser`) envia `POST /api/feedback-forms/:formId/responses` com respostas válidas para todas as perguntas obrigatórias
- **THEN** a API persiste um `FeedbackResponse` com `userId` preenchido e as respectivas `FeedbackAnswer`, retornando 201

#### Scenario: Envio anônimo sem identificador

- **WHEN** um cliente sem sessão ativa envia `POST /api/feedback-forms/:formId/responses` com respostas válidas para todas as perguntas obrigatórias
- **THEN** a API persiste um `FeedbackResponse` com `userId=null` e nenhum identificador de correlação, retornando 201

#### Scenario: Múltiplos envios permitidos

- **WHEN** o mesmo usuário (logado ou anônimo) envia respostas para o mesmo formulário mais de uma vez
- **THEN** a API aceita cada envio e cria um novo `FeedbackResponse` independente, sem bloquear por duplicidade

#### Scenario: Formulário inexistente ou não publicado

- **WHEN** um cliente envia respostas para um `formId` inexistente, não publicado, inativo ou excluído
- **THEN** a API retorna 404 Not Found e não persiste nenhuma resposta

### Requirement: Validação de perguntas obrigatórias e tipos de resposta

A API SHALL validar, antes de persistir, que toda pergunta marcada como `isRequired=true` recebeu uma resposta e que o valor enviado é compatível com o tipo da pergunta (`STARS` 1-5, `SCALE_0_10` 0-10, `LIKE_DISLIKE` like/dislike, `TEXT` texto não vazio, `MULTIPLE_CHOICE` uma ou mais opções válidas do formulário, `SINGLE_CHOICE` uma opção válida do formulário).

#### Scenario: Pergunta obrigatória não respondida

- **WHEN** um envio de respostas não inclui resposta para uma pergunta com `isRequired=true`
- **THEN** a API rejeita o envio com 400 Bad Request, indicando quais perguntas obrigatórias estão faltando, e nenhuma resposta é persistida

#### Scenario: Valor incompatível com o tipo da pergunta

- **WHEN** um envio inclui, por exemplo, um valor de estrelas fora do intervalo 1-5, uma nota fora de 0-10, ou um `optionId` de múltipla escolha que não pertence à pergunta
- **THEN** a API rejeita o envio com 400 Bad Request e nenhuma resposta é persistida

#### Scenario: Pergunta opcional não respondida

- **WHEN** um envio de respostas não inclui resposta para uma pergunta com `isRequired=false`
- **THEN** a API aceita o envio normalmente, sem exigir resposta para aquela pergunta

