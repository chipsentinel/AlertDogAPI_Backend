# Backend Deployment Checklist

## Target
Deploy backend + MariaDB in cloud (Render/Railway/AWS/other) with public URL.

## Required Environment Variables
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `HOST` (optional, default `0.0.0.0`)
- `PORT` (platform assigned)
- `CORS_ORIGINS` (CSV of frontend public URLs)

## Database
1. Create MariaDB instance.
2. Run `db/init.sql` once on the new instance.
3. Verify tables exist: `usuario`, `perro`, `cita`.

## Backend Service
1. Install dependencies: `npm ci`.
2. Health check route: `GET /`.
3. Start command: `npm run start`.
4. Verify public API routes:
- `GET /usuarios`
- `GET /perros`
- `GET /citas`

## Post-Deploy Validation
1. Run local smoke against public URL using Postman collections.
2. Verify CORS from deployed frontend URL.
3. Verify create/update/delete operations persist in DB.

## Security Baseline
1. Do not expose DB publicly without network restrictions.
2. Store secrets in platform secret manager, never in repo.
3. Restrict `CORS_ORIGINS` to trusted frontend domains.
