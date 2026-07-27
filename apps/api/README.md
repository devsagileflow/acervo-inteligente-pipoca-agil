# Pipoca Ágil API

API construída com Fastify, TypeScript, Prisma e Better Auth para autenticação, analytics e a base de conteúdo estruturado da plataforma.

## Setup

```bash
npm install
```

Configurar variáveis de ambiente (`.env`): basedo em `.env.example`

## Scripts

| Comando          | Descrição                       |
| ---------------- | ------------------------------- |
| `npm run dev`    | Inicia servidor em modo watch   |
| `npm run build`  | Compila TypeScript para `dist/` |
| `npm start`      | Produção (requer build prévio)  |
| `npm run lint`   | Verifica código com ESLint      |
| `npm run format` | Formata código com Prettier     |

## Estrutura

```
src/
├── app.ts                # Configuração Fastify
├── server.ts             # Entry point
├── config/
│   ├── env.ts            # Validação de variáveis (Zod)
│   ├── logger.ts         # Logger (Pino)
│   ├── permissions.ts    # Controle de acesso (ABAC)
│   └── index.ts
├── features/             # Rotas e lógica de negócio por domínio
│   ├── auth/
│   │   └── route.ts      # Endpoints de auth
│   ├── analytics/
│   ├── trail/
│   ├── user/
│   └── video/
│   └── index.ts
├── lib/
│   ├── auth.ts           # Configuração Better Auth
│   ├── prisma.ts         # Cliente Prisma
│   ├── session.ts        # Helpers de autorização a partir da sessão
│   └── index.ts
└── plugins/              # Plugins Fastify
    ├── cors.ts
    ├── error.ts
    ├── rate-limit.ts
    ├── swagger.ts
    └── index.ts
```

## Stack

| Ferramenta                    | Propósito                                           |
| ----------------------------- | --------------------------------------------------- |
| **Fastify**                   | Framework HTTP minimalista e rápido                 |
| **TypeScript**                | Type-safe development                               |
| **Prisma**                    | ORM type-safe com PostgreSQL                        |
| **Better Auth**               | Autenticação multi-provider (email/password, OAuth) |
| **Zod**                       | Validação de esquemas runtime                       |
| **fastify-type-provider-zod** | Integração Zod + Fastify type safety                |
| **Swagger/Scalar**            | Documentação automática de API                      |
| **Rate Limiting**             | Proteção contra abuso                               |
| **CORS**                      | Controle de origem                                  |
| **Pino**                      | Logger estruturado                                  |

## Domínios Atuais

- Auth: Better Auth com basePath `/api/auth`.
- Analytics: ingestão de eventos e sumário de cliques.
- Video Management: CRUD administrativo e leitura pública de vídeos ativos.
- Trail Management: CRUD administrativo e leitura pública de trilhas publicadas.
- Trail Item Management: composição ordenada de trilhas por `contentType` + `contentId`.
- Trail Progress Tracking: registro de visualização, percentual de conclusão e status final por usuário.

## Validação & Type Safety

Usar Zod para schemas com Fastify:

```typescript
import { z } from "zod";
import { FastifyInstance } from "fastify";

export default function routes(app: FastifyInstance) {
  app.post<{ Body: { name: string } }>(
    "/",
    {
      schema: {
        body: z.object({ name: z.string() }),
        response: { 200: z.object({ id: string, name: string }) },
      },
    },
    async (request, reply) => {
      // Type-safe request/reply
    },
  );
}
```

## Configuração de Ambiente

Variáveis gerenciadas em [src/config/env.ts](src/config/env.ts) com Zod.

Adicionar novas variáveis ao `envSchema` para validação automática na inicialização.

## Logging

Logger Pino configurado em [src/config/logger.ts](src/config/logger.ts)

- `LOG=true` habilita logs estruturados
- `LOG_LEVEL` controla verbosidade (debug, info, warn, error, fatal)
- Requests com ID único (`X-Request-ID`)

## Tratamento de Erros

Handler global em [src/plugins/error.ts](src/plugins/error.ts)

Usa `http-errors` para status codes semanticamente corretos.

## Rate Limiting

Configurado em [src/plugins/rate-limit.ts](src/plugins/rate-limit.ts)

Limite: `MAX_REQUESTS_PER_MINUTE` (padrão 100 req/min)

## Documentação de API

Swagger disponível em `/documentation`

Scalar UI em `/reference`

Mantém-se sincronizado automaticamente com schemas Zod das rotas.

## Endpoints de Conteúdo

Novos endpoints REST sob `/api`:

- `GET /videos`: leitura pública de vídeos ativos com paginação e filtro por título.
- `GET /videos/:videoId`: leitura pública de vídeo ativo por id.
- `POST /videos`, `PUT /videos/:videoId`, `DELETE /videos/:videoId`: administração de vídeos por usuários ADMIN.
- `GET /trails`: leitura pública de trilhas publicadas com paginação, filtro e opção de incluir itens.
- `GET /trails/:trailId`: leitura pública de trilha publicada por id com itens ordenados.
- `POST /trails`, `PUT /trails/:trailId`, `DELETE /trails/:trailId`: administração de trilhas por usuários ADMIN.
- `POST /trails/:trailId/items`, `PUT /trails/:trailId/items/:itemId`, `DELETE /trails/:trailId/items/:itemId`: administração de itens ordenados da trilha por usuários ADMIN.
- `GET /trails/:trailId/progress`, `POST /trails/:trailId/progress/view`: leitura e atualização do progresso do usuário autenticado.

### Regras principais

- Vídeos usam soft delete com `isActive=false` e `deletedAt` preenchido.
- Trilhas publicamente visíveis precisam estar `isPublished=true`, `isActive=true` e não removidas logicamente.
- Itens da trilha usam `contentType` + `contentId`, iniciando com `VIDEO`.
- Conflitos de `position` são resolvidos com deslocamento automático.
- Progresso calcula percentual apenas sobre itens atualmente ativos/publicados.
- Conclusão da trilha depende apenas dos itens com `isRequired=true`.

## Testes

```bash
npm test
```

A suíte atual cobre autorização administrativa, leitura pública de vídeos/trilhas e regras centrais de progress tracking.

## Notas de Implementação

- Os contratos HTTP compartilhados ficam em `apps/packages/schemas` e são a fonte de verdade para request/response.
- As rotas seguem o padrão `feature.route.ts` para HTTP/schema e `feature.service.ts` para regra de negócio/acesso a dados.
- A autorização administrativa das novas features consulta o papel real do usuário no banco a partir da sessão autenticada.
- O progresso foi modelado para aceitar expansão futura de tipos de conteúdo sem quebrar a estrutura persistida.

## Build & Deploy

```bash
# Build
npm run build

# Servir
npm start
```

Output compilado em `dist/`
