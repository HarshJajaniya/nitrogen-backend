# Backend Deployment Guide

This project is ready to deploy on both Render and Vercel.

## Option 1: Render (recommended for long-running Express server)

1. Push code to GitHub.
2. In Render, click **New +** -> **Blueprint** (uses `render.yaml`) or **Web Service**.
3. If creating manually:
   - Build command: `npm install && npx prisma generate && npm run build`
   - Start command: `npm start`
4. Set environment variables:
   - `DATABASE_URL` = your production Postgres URL
   - `NODE_ENV` = `production`
5. Deploy and open:
   - Root health endpoint: `/`

## Option 2: Vercel (serverless)

Vercel routes all requests through `api/index.ts`, which wraps your Express app with `serverless-http`.

1. Push code to GitHub.
2. Import project in Vercel.
3. Framework preset: **Other**.
4. Set environment variables:
   - `DATABASE_URL` = your production Postgres URL
5. Deploy.

### Notes for Vercel

- Keep Prisma on a managed Postgres (Neon, Supabase, RDS, etc.).
- Because this is serverless, cold starts can occur.
- Your API base URL will be your Vercel domain, for example:
  - `https://your-app.vercel.app/`

## Routes

- `GET /` -> `API is running...`
- `GET/POST /projects`
- `GET/POST /tasks`
- `GET /search`
- `GET/POST /users`
- `GET/POST /teams`
