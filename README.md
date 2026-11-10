# CATAAS

**Cat as a service**: a public REST API to spread peace and love (or not) thanks to cats.

Get a random cat picture, pick one by tag or id, then resize it, filter it and write on it, all through the query string.

## Quick examples

```
GET /cat                         # random cat
GET /cat/cute                    # random cat with the tag "cute"
GET /cat/cute,orange             # several tags, comma-separated
GET /cat/{id}                    # a specific cat
GET /cat/says/Hello?fontSize=60  # random cat with a caption
GET /cat?width=300&blur=2        # resized and blurred
GET /cat?json=true               # metadata as JSON instead of the image
GET /api/cats                    # list cats
GET /api/tags                    # list tags
GET /api/count                   # number of cats
```

Other endpoints: `/placeholder/{size}`, `/avatar/{seed}` and `POST /upload`. Uploaded pictures are only served once validated by a moderator.

## Stack

Node.js (ESM), [`@boutdecode/yion`](https://www.npmjs.com/package/@boutdecode/yion), Prisma + PostgreSQL, sharp, pug, vite, Sentry.

## Installation

### With Docker

```shell
./configure --env=dev --with-docker
make install
make start
```

### Without Docker

```shell
cp .env.dist .env            # then edit it
npx prisma generate
npx prisma migrate deploy
mkdir -p data/images data/cache/images
npm run build                # front assets
npm start
```

## Configuration

See `.env.dist` for the full list (`DATABASE_URL`, `HOST`, `NODE_PORT`, `CORS`, `LOCALE`, ...).

| Variable | Default | Purpose |
| --- | --- | --- |
| `CACHE_TTL_DAYS` | `30` | Delete cached renders unused for this many days |
| `CACHE_MAX_MB` | `2048` | Maximum size of the disk cache |
| `CACHE_SWEEP_MINUTES` | `360` | Interval between cache cleanups |
| `ADMIN_USER` / `ADMIN_PASSWORD` | – | Enable `/admin` (Basic Auth); the route returns 404 if unset |
| `SENTRY_DSN` / `SENTRY_SAMPLE_RATE` | – | Optional error reporting |

## Moderation

When `ADMIN_USER` and `ADMIN_PASSWORD` are set, `/admin` lets you list pending/validated cats, validate them, edit their tags, and delete or reject them (database row, original file and cached renders).

## Development

```shell
npm run dev      # front assets with vite
npm run lint     # ESLint
npm test         # node --test
```

Commits follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`); semantic-release publishes from `main`. See `AGENTS.md` for architecture notes.

## License

The source code is released under the [MIT License](LICENSE).

The content (cat images, user uploads and other media) is **not** covered by this license: all rights remain with their respective authors.
