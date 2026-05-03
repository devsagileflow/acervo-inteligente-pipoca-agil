# Fastify API Boilerplate

API construída com Fastify, TypeScript, Prisma e Better Auth.

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
├── features/             # Rotas e lógica de negócio
│   ├── auth/
│   │   └── route.ts      # Endpoints de auth
│   └── index.ts
├── lib/
│   ├── auth.ts           # Configuração Better Auth
│   ├── prisma.ts         # Cliente Prisma
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

## Build & Deploy

```bash
# Build
npm run build

# Servir
npm start
```

Output compilado em `dist/`
