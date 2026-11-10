# AGENTS.md

## Overview
CATAAS ("Cat as a service"): a public REST API serving cat images (random, by tag or by id), with resizing, filters and text overlay via query string. ESM project (`"type": "module"`), `@boutdecode/yion` framework, Prisma/PostgreSQL, sharp, pug, Sentry. Front end: pug + custom SCSS (tokens as CSS variables, no Bootstrap), vanilla JS.

License: MIT for the code only (`LICENSE`); the content (cat images, uploads, media) is not covered.

Entry point: `server.js` → `bootstrap()` with the `sentry` and `store` plugins (PrismaClient injected into handlers) and the `website`, `cataas` and `admin` modules.

## Commands
- `npm start`: run the server (`node server.js`)
- `npm run dev` / `npm run watch` / `npm run build`: front end (vite) → `public/build/`
- `npm test`: `node --test` (no tests yet)
- `npm run lint`: ESLint
- `npm run db:diff`: `prisma migrate dev`

Docker: `./configure --env=dev --with-docker`, then `make install` and `make start`.
Without Docker: `cp .env.dist .env`, `npx prisma generate`, `npx prisma migrate deploy`, create `data/images/` and `data/cache/images/` (nothing creates them), `npm run build`, `npm start`.

Environment variables: see `.env.dist` (`DATABASE_URL`, `HOST`, `NODE_PORT`, `CORS`, `LOCALE`…); `CACHE_TTL_DAYS` (30), `CACHE_MAX_MB` (2048) and `CACHE_SWEEP_MINUTES` (360) tune cache cleanup; `SENTRY_DSN` and `SENTRY_SAMPLE_RATE` are read by `plugins/sentry.js` but missing from `.env.dist`. Never copy or commit the secrets from `.env`.

## Structure
- `modules/cataas/operators/`: routes (`cat/*` images, `api/*` JSON, `upload.js`)
- `modules/admin/`: moderation (`operators/` list, image, actions; `service/admin.js` access guard + operations)
- `modules/cataas/service/`: `handleCatRequest.js`, `operations.js` (`findCat`, `editImage`, `createCat`…), `imageEditor.js` (sharp)
- `modules/cataas/definitions/schemas.js`: Zod schemas
- `modules/website/`: pages, cache middleware (ETag/304), assets
- `plugins/`, `prisma/` (schema + migrations), `templates/` (pug, texts via `t('key')`), `translations/` (fr, en: same keys in both files)
- `assets/front/`: the only active front-end bundle (`main.js`, `demo.js` = interactive demo wired to `/cat*`, `assets/sass/` = tokens/base/layout/components/home/admin)
- `infrastructure/`: Docker/autoconf templates copied to the root by `./configure`
- `data/` (gitignored): `images/` originals, `cache/images/<catId>/` renders (one folder per cat)

## Architecture
Each operator exports `context` (`api`/`app`), `route {method, pattern}`, `input`/`output` (Zod), `openapi` and `handler({ req, res, store, view, config })`.

`handleCatRequest.js` flow: `findCat` → JSON response (`json` or `Accept: application/json`), HTML with Open Graph tags (`html`), or image: cache key `getCacheKey(text, query)` (sha256 hash, or `original`) → file `data/cache/images/<catId>/<key>`, otherwise read from `data/images/`, `editImage`, write to cache, send.

`Cat` model: `id` (uuid), `tags`, `file`, `mimetype`, `size`, `validated` (default `false`). Uploads are only served once `validated: true`. Moderation via `/admin` (Basic Auth `ADMIN_USER`/`ADMIN_PASSWORD`, route absent (404) if unset): list (pending/validated/all), validate, edit tags, delete/reject (row + original + cached renders). Every admin operator calls `guard()`; actions are POSTs protected against CSRF (`Sec-Fetch-Site`/`Origin`).

## Conventions
- Standard JS: no semicolons, single quotes, 2-space indentation, LF (`.editorconfig`)
- ESM imports with explicit `.js` extension; native modules with the `node:` prefix
- Curried service functions: `findCat(store)(params)`
- camelCase file names; OpenAPI `operationId` like `cat:random:tag`
- Conventional commits (`feat:`, `fix:`, `chore:`): semantic-release publishes from `main`

## Gotchas
- `findCat({ id, tag })`: the `/cat/{tag}` route can receive a tag, a comma-separated list of tags, or a UUID.
- `z.coerce.boolean()` (`html`, `json`) turns the string `"false"` into `true`.
- The disk cache is swept periodically (`cacheSweeper.js`: TTL on last use + size cap, plus per-cat purge on admin delete/rotate); the ETag is `Date.now()` at startup (every restart invalidates client caches).
- Caption text is injected unescaped into an SVG, and `cat.id`/`getUrl` are injected unescaped into the HTML: be careful when changing either.
- `sharp` is pinned to 0.32.6.
- `Dockerfile`, `Makefile`, `docker-compose.yaml` at the root are generated and gitignored: edit the templates in `infrastructure/`.
- Unloaded legacy code (CommonJS/nedb): `modules/security`, `src/shared`, `assets/admin`. Ignore unless explicitly asked.
- Two ESLint configs coexist (`.eslintrc.js` and `eslint.config.js`); the latter takes precedence with ESLint 8.57.
