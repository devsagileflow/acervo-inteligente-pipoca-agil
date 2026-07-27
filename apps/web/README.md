This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Admin Access Authentication

Some routes, such as `/metricas`, are restricted to administrators. Access is granted through a server-side token passed in the URL query string:

```
/metricas?hash=<ADMIN_ACCESS_TOKEN>
```

### Configuration

Set the `ADMIN_ACCESS_TOKEN` environment variable in your `.env` file:

```env
ADMIN_ACCESS_TOKEN=6f0d8a8d-de29-4455-b927-440b92da1e30
```

A missing, empty, or invalid token will result in a redirect to the home page (`/`).

### Generating a token

Use any UUID generator or a cryptographically secure random string. For example, with Node.js:

```bash
node -e "console.log(crypto.randomUUID())"
```

### Rotating a token

1. Generate a new token.
2. Update the `ADMIN_ACCESS_TOKEN` value in your local `.env` and in your deployment platform's environment variables.
3. Redeploy the application.
4. Share the new URL (`/metricas?hash=<new-token>`) with authorized users.

### Security notes

- The token is read server-side only and is never exposed in the client bundle.
- Keep the token URL internal and share it through a secure channel.
- Because the token travels in the URL, it may appear in server logs or browser history. Use HTTPS in production and rotate the token periodically.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
