# Spec

## Purpose

Define como o app `web` identifica um dispositivo anônimo de forma estável, garantindo que o mesmo identificador seja reutilizado em todos os eventos de analytics gerados por aquele dispositivo, mesmo após recarregar a página ou reabrir o navegador.

## Requirements

### Requirement: Identificador anônimo estável por dispositivo
O sistema SHALL gerar um identificador anônimo único por dispositivo na primeira visita e SHALL reutilizar esse mesmo identificador em todas as chamadas subsequentes de tracking, sem gerar um novo a cada carregamento de página.

#### Scenario: Primeira visita gera e persiste o identificador
- **WHEN** um usuário acessa o app pela primeira vez em um dispositivo sem identificador salvo
- **THEN** o sistema gera um novo identificador anônimo e o persiste no armazenamento do dispositivo

#### Scenario: Recarregar a página reutiliza o identificador existente
- **WHEN** um usuário recarrega qualquer página do app em um dispositivo que já possui um identificador salvo
- **THEN** o sistema reutiliza o identificador salvo em vez de gerar um novo

#### Scenario: Fechar e reabrir o navegador mantém o identificador
- **WHEN** um usuário fecha o navegador e retorna ao app posteriormente no mesmo dispositivo
- **THEN** os eventos de analytics enviados continuam usando o mesmo identificador anônimo gerado anteriormente

### Requirement: Identificador único compartilhado entre telas
O sistema SHALL usar a mesma fonte de identificador anônimo em todas as telas e componentes que emitem eventos de analytics, de forma que nenhum componente gere seu próprio identificador independente.

#### Scenario: Eventos de vídeo usam o identificador compartilhado
- **WHEN** um usuário interage com o player de vídeo em uma trilha (play, pausa ou conclusão)
- **THEN** os eventos `video_play`, `video_paused` e `video_complete` são enviados com o mesmo identificador anônimo persistido do dispositivo, e não com um identificador gerado apenas para aquela sessão de componente
