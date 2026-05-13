# RouteWeather Web

**Repository:** [github.com/Leoamaaral/RouteWeather-Front](https://github.com/Leoamaaral/RouteWeather-Front)  

Next.js UI for **RouteWeather**. The browser talks to the **Laravel API** ([github.com/Leoamaaral/RouteWeather-Backend](https://github.com/Leoamaaral/RouteWeather-Backend)). In this monorepo the API lives under [`../api`](https://github.com/Leoamaaral/RouteWeather-Backend); see [`../api/README.md`](https://github.com/Leoamaaral/api/blob/master/README.md) for setup, env vars, and full API docs.

## How the web app calls the API

The frontend does **not** set the path `/api` alone in env. You configure the **API origin** (scheme + host + port, no trailing slash). The client then requests the versioned route:

| Piece | Value |
|--------|--------|
| Env var | `NEXT_PUBLIC_API_URL` (e.g. `http://127.0.0.1:8000`) |
| Request URL | `{NEXT_PUBLIC_API_URL}/api/v1/route-weather/plan` |

Implementation: [`src/lib/api.ts`](src/lib/api.ts) — `POST` with JSON body (`origin`, `destination`, optional `departure_at`, `sample_interval_km`, `use_traffic`).

Default if env is missing: `http://localhost:8000` (same as [`api/.env.example`](https://github.com/Leoamaaral/RouteWeather-Backend/blob/master/.env.example) `APP_URL`).

## Requirements

- **Node.js 20+** (see `package.json` `engines`)
- **Running API** — from `../api`: `php artisan serve` (or your deployed API URL)
- **CORS** — in the API `.env`, set `CORS_ALLOWED_ORIGINS` to include your app origin, e.g. `http://localhost:3000` (comma-separated if you have several)

## Environment variables

Copy [`.env.example`](.env.example) to `.env.local` (or `.env`):

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_API_URL` | Laravel base URL the browser will call (must match where `php artisan serve` or your proxy listens) |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Browser-side Google Maps JS (map, autocomplete). **Separate** from the API’s server key `GOOGLE_MAPS_API_KEY` used for Directions on the backend |

If `NEXT_PUBLIC_API_URL` points to the wrong host/port, requests to `/api/v1/route-weather/plan` will fail (network error or CORS).

## Local development

1. Start the API (from repo root or `api/`):

   ```bash
   cd ../api && php artisan serve
   ```

2. In `web/`, install and run Next:

   ```bash
   npm install
   cp .env.example .env.local
   # edit .env.local: NEXT_PUBLIC_API_URL and NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Next.js dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run lint` | ESLint |

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js deployment](https://nextjs.org/docs/app/building-your-application/deploying)
