# AGENTS.md

## Présentation
CATAAS (« Cat as a service ») : API REST publique qui sert des images de chats (aléatoire, par tag ou par id), avec redimensionnement, filtres et texte via query string. Projet ESM (`"type": "module"`), framework `@boutdecode/yion`, Prisma/PostgreSQL, sharp, pug, Sentry. Front : pug + SCSS maison (tokens en variables CSS, sans Bootstrap), JS vanilla.

Point d'entrée : `server.js` → `bootstrap()` avec les plugins `sentry` et `store` (PrismaClient injecté dans les handlers) et les modules `website`, `cataas` et `admin`.

## Commandes
- `npm start` : lance le serveur (`node server.js`)
- `npm run dev` / `npm run watch` / `npm run build` : front (vite) → `public/build/`
- `npm test` : `node --test` (aucun test pour l'instant)
- `npm run lint` : ESLint
- `npm run db:diff` : `prisma migrate dev`

Docker : `./configure --env=dev --with-docker`, puis `make install` et `make start`.
Sans Docker : `cp .env.dist .env`, `npx prisma generate`, `npx prisma migrate deploy`, créer `data/images/` et `data/cache/images/` (rien ne les crée), `npm run build`, `npm start`.

Variables d'environnement : voir `.env.dist` (`DATABASE_URL`, `HOST`, `NODE_PORT`, `CORS`, `LOCALE`…) ; `SENTRY_DSN` et `SENTRY_SAMPLE_RATE` sont lues par `plugins/sentry.js` mais absentes de `.env.dist`. Ne jamais copier ni committer les secrets de `.env`.

## Structure
- `modules/cataas/operators/` : routes (`cat/*` images, `api/*` JSON, `upload.js`)
- `modules/admin/` : modération (`operators/` list, image, actions ; `service/admin.js` garde d'accès + opérations)
- `modules/cataas/service/` : `handleCatRequest.js`, `operations.js` (`findCat`, `editImage`, `createCat`…), `imageEditor.js` (sharp)
- `modules/cataas/definitions/schemas.js` : schémas Zod
- `modules/website/` : pages, middleware de cache (ETag/304), assets
- `plugins/`, `prisma/` (schéma + migrations), `templates/` (pug, textes via `t('clé')`), `translations/` (fr, en : mêmes clés dans les deux fichiers)
- `assets/front/` : seul bundle front actif (`main.js`, `demo.js` = démo interactive branchée sur `/cat*`, `assets/sass/` = tokens/base/layout/components/home/admin)
- `infrastructure/` : gabarits Docker/autoconf copiés à la racine par `./configure`
- `data/` (gitignoré) : `images/` originaux, `cache/images/<catId>/` rendus (un dossier par chat)

## Architecture
Chaque opérateur exporte `context` (`api`/`app`), `route {method, pattern}`, `input`/`output` (Zod), `openapi` et `handler({ req, res, store, view, config })`.

Flux de `handleCatRequest.js` : `findCat` → réponse JSON (`json` ou `Accept: application/json`), HTML avec balises Open Graph (`html`), ou image : clé de cache `getCacheKey(text, query)` (hash sha256, ou `original`) → fichier `data/cache/images/<catId>/<clé>`, sinon lecture de `data/images/`, `editImage`, écriture en cache, envoi.

Modèle `Cat` : `id` (uuid), `tags`, `file`, `mimetype`, `size`, `validated` (défaut `false`). Les uploads ne sont servis qu'une fois `validated: true`. Modération via `/admin` (Basic Auth `ADMIN_USER`/`ADMIN_PASSWORD`, route absente (404) si non définis) : lister (en attente/validées/toutes), valider, éditer les tags, supprimer/refuser (ligne + original + rendus en cache). Chaque opérateur admin appelle `guard()` ; les actions sont des POST protégés contre le CSRF (`Sec-Fetch-Site`/`Origin`).

## Conventions
- Standard JS : sans point-virgule, quotes simples, indentation 2 espaces, LF (`.editorconfig`)
- Imports ESM avec extension `.js` explicite ; modules natifs avec préfixe `node:`
- Fonctions de service curryfiées : `findCat(store)(params)`
- Fichiers en camelCase ; `operationId` OpenAPI de la forme `cat:random:tag`
- Commits conventionnels (`feat:`, `fix:`, `chore:`) : semantic-release publie depuis `main`

## Pièges
- `findCat({ id, tag })` : la route `/cat/{tag}` peut recevoir un tag, une liste de tags séparés par des virgules ou un UUID.
- `z.coerce.boolean()` (`html`, `json`) transforme la chaîne `"false"` en `true`.
- Le cache disque n'est purgé que par chat (suppression/rotation admin : `rm` du dossier) et reste non borné sinon ; les anciens fichiers plats `id-*` sont orphelins (`find data/cache/images -maxdepth 1 -type f -name 'id-*' -delete`) ; l'ETag vaut `Date.now()` au démarrage (chaque redémarrage invalide les caches clients).
- Le texte des légendes est injecté non échappé dans un SVG, et `cat.id`/`getUrl` sont injectés non échappés dans le HTML : attention à toute modification.
- `sharp` est épinglé en 0.32.6.
- `Dockerfile`, `Makefile`, `docker-compose.yaml` à la racine sont générés et gitignorés : modifier les gabarits dans `infrastructure/`.
- Code legacy non chargé (CommonJS/nedb) : `modules/security`, `src/shared`, `assets/admin`. À ignorer sauf demande explicite.
- Deux configs ESLint coexistent (`.eslintrc.js` et `eslint.config.js`) ; la seconde prime avec ESLint 8.57.
