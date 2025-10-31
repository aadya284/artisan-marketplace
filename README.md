
<!-- Trigger fresh Vercel build: Sep 21, 2025 -->

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

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Environment variables

This project expects certain API keys and secrets to be provided via environment variables. For local development copy `.env.example` to `.env.local` and fill in the real values (do NOT commit `.env.local`). Example keys:

- `GOOGLE_MAPS_API_KEY` (server-side Google Maps key). Prefer server-side usage — put this in `.env.local` and do not expose it as `NEXT_PUBLIC_...` unless strictly required.
- `TRANSLATE_API_KEY` or `FIREBASE_ADMIN_SA_PATH` (for the backend translation endpoint).
- `GEMINI_API_KEY` (if using the LLM/chat endpoint).

If you accidentally committed an API key, rotate/revoke it immediately and replace it with an environment variable.
