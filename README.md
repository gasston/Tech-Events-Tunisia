# Tech Events Tunisia

Annuaire des événements tech en Tunisie. Monorepo pnpm : Next.js 14 (web) + Fastify (api) + PostgreSQL + Drizzle.

## Stack

- **web** — Next.js 14 App Router, TypeScript, Tailwind, Leaflet. Proxy `/api/*` et `/uploads/*` vers l'API via rewrites (un seul domaine, zéro CORS en prod).
- **api** — Fastify, Drizzle ORM, postgres.js, JWT cookie httpOnly, upload image disque.
- **shared** — types + schémas Zod partagés.

## Dev local

```bash
pnpm install
cp .env.example .env          # ajuste DATABASE_URL vers ton Postgres
pnpm db:migrate               # crée les tables
pnpm db:seed                  # admin + 8 événements démo
pnpm dev                      # web:3000  api:3001
```

Besoin d'un Postgres rapide :
```bash
docker run -d --name tet-pg -p 5432:5432 \
  -e POSTGRES_DB=tet_db -e POSTGRES_USER=tet -e POSTGRES_PASSWORD=tet_secret \
  postgres:16-alpine
```

## Docker (prod)

```bash
cp .env.example .env          # mets de vrais secrets (JWT_SECRET, ADMIN_*)
docker compose up -d --build
```

Lance `postgres`, `api` (migrations auto au démarrage via `start.sh`), `web`. Volumes persistants : `postgres_data`, `uploads_data`.

- web → http://localhost:3000
- api → http://localhost:3001/health

## Déploiement Dokploy

1. Nouveau projet → Compose, pointe sur ce repo.
2. Renseigne les variables d'env (`JWT_SECRET`, `SESSION_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `APP_URL=https://events.tondomaine.tn`, `POSTGRES_*`).
3. Domaine sur le service **web**, port `3000`. Traefik/HTTPS géré par Dokploy — le web proxie `/api/*` vers `api:3001` en interne, **un seul domaine suffit**.
4. Healthcheck : `GET /health` sur l'api (vérifie aussi Postgres).

Cookies admin : `secure` activé automatiquement quand `NODE_ENV=production` (donc HTTPS requis, fourni par Dokploy).

## Admin

`/admin` — login avec `ADMIN_EMAIL` / `ADMIN_PASSWORD` du seed. Modération (pending/published/rejected), édition, création directe.

## API

| Méthode | Route | Auth |
|---|---|---|
| GET | `/health` | — |
| GET | `/api/events` | — |
| GET | `/api/events/:slug` | — |
| POST | `/api/events` | — (soumission → pending) |
| POST | `/api/events/:id/view` | — |
| POST | `/api/auth/login` · `/logout` | — |
| GET/POST/PUT/DELETE | `/api/admin/*` | cookie JWT |
| POST | `/api/upload` | cookie JWT |

## Stockage images

Disque local (`UPLOADS_DIR`, volume Docker). L'upload renvoie une URL `/uploads/<file>`. Pour migrer vers S3/R2/MinIO : remplacer `apps/api/src/routes/upload.ts` (écriture + URL), rien d'autre à toucher.
