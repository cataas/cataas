# [3.0.0](https://github.com/cataas/cataas/compare/v2.4.1...v3.0.0) (2026-11-10)


### Bug Fixes

* add Prisma musl binary target for Docker ([253a96b](https://github.com/cataas/cataas/commit/253a96bbecf677fd9dced25dd452d453929e018e))
* Analytic URL ([1238709](https://github.com/cataas/cataas/commit/1238709d1823499d925688d0faf2596e0d3d8a51))
* bound GIF page count to the actual frame count ([22a9539](https://github.com/cataas/cataas/commit/22a9539ad2cd30b7e3e7068e87ce5aec7ae5fcdb))
* Disable analytics ([68fd025](https://github.com/cataas/cataas/commit/68fd025be9ec15645de31d50497f9b0a0f851b79))
* generate prisma client and run migrations in prod image ([ff7bc00](https://github.com/cataas/cataas/commit/ff7bc00db9417cc1d72600b5bfaff0d224a94f3b))
* html and json query ([44de286](https://github.com/cataas/cataas/commit/44de286a30a7280034cc3ad714d4f5198ac4b020))
* keep text on animated gifs after resize ([699bd9a](https://github.com/cataas/cataas/commit/699bd9afaa9090112c83c38c0061e66f8bcf6468))
* limit memory usage under heavy traffic ([c14d3c2](https://github.com/cataas/cataas/commit/c14d3c23e2c6c59fbda092acc434d7c0bcfa8b84))
* make tags case-insensitive ([58bce74](https://github.com/cataas/cataas/commit/58bce74954bb35b788e0c31d72641b1b68702eb9))
* purge admin image cache asynchronously to avoid blocking the server ([986eda2](https://github.com/cataas/cataas/commit/986eda28344445b9fe7f38e3a986e671c6b29960))
* size text overlay from resized image ([7276792](https://github.com/cataas/cataas/commit/72767920792212d41cee8c09af2bf5d2a22caef5))
* store image cache per cat for instant purge ([d414257](https://github.com/cataas/cataas/commit/d414257d98ac8f1bc6eb93acc642e0ef773e2dd8))
* Tag query ([9e3104c](https://github.com/cataas/cataas/commit/9e3104c4b0c74afce2c8009048a4693ba0c06ca3))
* Typo into title ([f13133c](https://github.com/cataas/cataas/commit/f13133c63d3455506bee7c7c349970b43a8ef9ce))


### Features

* add /avatar/{seed} stable cat avatars ([f42c1bb](https://github.com/cataas/cataas/commit/f42c1bb4dec787b4af41a8bc8c53050366922858))
* add /placeholder/{size} with cat or solid color background ([49cfc70](https://github.com/cataas/cataas/commit/49cfc70eb4361d2d6d7930427200ba7722a432cf))
* add CLI section on homepage ([90a5112](https://github.com/cataas/cataas/commit/90a511239cb3d33b7dafbb82b7c6d6affd279e1b))
* add moderation admin ([ebba215](https://github.com/cataas/cataas/commit/ebba215cc4baa7f8c04885f1d25770f47a306252))
* add rotate buttons to admin and keep image ratio ([c241257](https://github.com/cataas/cataas/commit/c241257d711b2781de717a02c481533607cbf046))
* add tag field to demo and show 100% cat stat ([64f2adf](https://github.com/cataas/cataas/commit/64f2adf0f4362c4b89fdea38d96ce030c1a931cc))
* add Umami analytics and click events on support/docs links ([1f01aa4](https://github.com/cataas/cataas/commit/1f01aa4556f3e67984495166b1b3c53363fe327e))
* bound image cache with TTL and size cap ([7aed229](https://github.com/cataas/cataas/commit/7aed229260d1256d1a6ede1b12ce6002dd75e495))
* hide header links on mobile except support button ([d626174](https://github.com/cataas/cataas/commit/d6261748ab43161e043a52c05b869343be8a5a96))
* new interface ([b0122d4](https://github.com/cataas/cataas/commit/b0122d4c13f3bca90ab17295bdb0f85e3887cbd8))
* release v3 ([9e2778a](https://github.com/cataas/cataas/commit/9e2778aa4fb840abd9d474a9b9a5ffd01dc7719d))
* V3 ([0280329](https://github.com/cataas/cataas/commit/0280329f843f84b05c2c1abef0b2a1f9b7b48efe))


### BREAKING CHANGES

* v3 major release (new front end, admin moderation, validated uploads, MIT license for the code).

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>

## [2.4.1](https://github.com/cataas/cataas/compare/v2.4.0...v2.4.1) (2025-01-30)


### Bug Fixes

* Disable error route ([922f363](https://github.com/cataas/cataas/commit/922f3638cd2c5d3bcfff22bbf3581c0486de6616))

# [2.4.0](https://github.com/cataas/cataas/compare/v2.3.4...v2.4.0) (2025-01-30)


### Features

* Add Sentry ([7369ba9](https://github.com/cataas/cataas/commit/7369ba924c0563389a3b959af0cdd97e24436236))

## [2.3.4](https://github.com/cataas/cataas/compare/v2.3.3...v2.3.4) (2024-10-22)


### Bug Fixes

* Disable analytics ([5e38983](https://github.com/cataas/cataas/commit/5e38983d43d2c272089562082d20d4c6c145650e))

## [2.3.3](https://github.com/cataas/cataas/compare/v2.3.2...v2.3.3) (2024-09-23)


### Bug Fixes

* Disable analytics ([4a3dd72](https://github.com/cataas/cataas/commit/4a3dd72e0d453d7f16f12ea46351d3d899fee76c))

## [2.3.2](https://github.com/cataas/cataas/compare/v2.3.1...v2.3.2) (2024-05-06)


### Bug Fixes

* URL generated for HTML display ([559cd13](https://github.com/cataas/cataas/commit/559cd1355f442b545ebe30353339d8c616fb9888))

## [2.3.1](https://github.com/cataas/cataas/compare/v2.3.0...v2.3.1) (2024-04-25)


### Bug Fixes

* API tags and server URL ([49aa6b7](https://github.com/cataas/cataas/commit/49aa6b768cd11118dc3bb2ae2b297aafc06a5bfa))

# [2.3.0](https://github.com/cataas/cataas/compare/v2.2.0...v2.3.0) (2024-04-17)


### Features

* Add CPU concurrency limit ([08bd547](https://github.com/cataas/cataas/commit/08bd5475ebe370669ced5edaac68f5bba0e019f2))

# [2.2.0](https://github.com/cataas/cataas/compare/v2.1.3...v2.2.0) (2024-04-17)


### Features

* Add Worker to edit image ([9d5fb38](https://github.com/cataas/cataas/commit/9d5fb38e85b3fa44585de13d86dc429c0aae82ca))

## [2.1.3](https://github.com/cataas/cataas/compare/v2.1.2...v2.1.3) (2024-03-28)


### Bug Fixes

* Cat search ([e64c0b5](https://github.com/cataas/cataas/commit/e64c0b5b948718c7cc4e985bd674e7e90cb15caa))

## [2.1.2](https://github.com/cataas/cataas/compare/v2.1.1...v2.1.2) (2024-03-28)


### Bug Fixes

* Search cat with tags ([a125edb](https://github.com/cataas/cataas/commit/a125edb528312b4b50c4e1a4aef60cd82e452516))

## [2.1.1](https://github.com/cataas/cataas/compare/v2.1.0...v2.1.1) (2024-03-28)


### Bug Fixes

* Fix mongodb client ([7552f1f](https://github.com/cataas/cataas/commit/7552f1f7037c9aecbe63ba8f422be55707630ccf))

# [2.1.0](https://github.com/cataas/cataas/compare/v2.0.6...v2.1.0) (2024-03-28)


### Features

* Release 2.1 ([84e4e0b](https://github.com/cataas/cataas/commit/84e4e0b3ec48799cad9a010296aee4f4252eff66))

## [2.0.6](https://github.com/cataas/cataas/compare/v2.0.5...v2.0.6) (2024-03-27)


### Bug Fixes

* Send JSON for Accept application/json ([965caa2](https://github.com/cataas/cataas/commit/965caa2c3172bffbf3a30f761a251a0d9879476b))

## [2.0.5](https://github.com/cataas/cataas/compare/v2.0.4...v2.0.5) (2024-03-27)


### Bug Fixes

* Divers ([5487087](https://github.com/cataas/cataas/commit/5487087472fe10ff5a752dae15a0a78085266f39))

## [2.0.4](https://github.com/cataas/cataas/compare/v2.0.3...v2.0.4) (2023-10-30)


### Bug Fixes

* Add error log ([c680c0b](https://github.com/cataas/cataas/commit/c680c0bc164eb2fa78d66bf755e6ded01c32c626))

## [2.0.3](https://github.com/cataas/cataas/compare/v2.0.2...v2.0.3) (2023-10-30)


### Bug Fixes

* Delete cat image ([5c1ed55](https://github.com/cataas/cataas/commit/5c1ed55c76a54b6f49c1bc90dbfbe585aea65c48))

## [2.0.2](https://github.com/cataas/cataas/compare/v2.0.1...v2.0.2) (2023-10-24)


### Bug Fixes

* Analytics ([7e33232](https://github.com/cataas/cataas/commit/7e33232eeb950e48bc38c539811063b58a2efb46))

## [2.0.1](https://github.com/cataas/cataas/compare/v2.0.0...v2.0.1) (2023-10-24)


### Bug Fixes

* Analytics request ([8db69a4](https://github.com/cataas/cataas/commit/8db69a44aa2252120845f9474c46b245f552c422))

# [2.0.0](https://github.com/cataas/cataas/compare/v1.0.5...v2.0.0) (2023-10-23)


### Bug Fixes

* Analytics send ([24e51c7](https://github.com/cataas/cataas/commit/24e51c7d5beb17a2c119972305a9937812a2bdb4))
* Disable analytics ([53c1043](https://github.com/cataas/cataas/commit/53c10438ec2997c795b2d11b263da8981eb89c1d))
* Disable analytics ([a41fc81](https://github.com/cataas/cataas/commit/a41fc81ca3106eda7bc03515b4ed5da9017f5836))


### Features

* Release 2.0.0 ([cb75c70](https://github.com/cataas/cataas/commit/cb75c70107d9664a4cbd855e3b805804fc5da55e))


### BREAKING CHANGES

* New image editor

## [1.0.6](https://github.com/cataas/cataas/compare/v1.0.5...v1.0.6) (2023-10-23)


### Bug Fixes

* Analytics send ([24e51c7](https://github.com/cataas/cataas/commit/24e51c7d5beb17a2c119972305a9937812a2bdb4))
* Disable analytics ([53c1043](https://github.com/cataas/cataas/commit/53c10438ec2997c795b2d11b263da8981eb89c1d))
* Disable analytics ([a41fc81](https://github.com/cataas/cataas/commit/a41fc81ca3106eda7bc03515b4ed5da9017f5836))

## [1.0.6](https://github.com/cataas/cataas/compare/v1.0.5...v1.0.6) (2023-10-20)


### Bug Fixes

* Disable analytics ([53c1043](https://github.com/cataas/cataas/commit/53c10438ec2997c795b2d11b263da8981eb89c1d))
* Disable analytics ([a41fc81](https://github.com/cataas/cataas/commit/a41fc81ca3106eda7bc03515b4ed5da9017f5836))

## [1.0.6](https://github.com/cataas/cataas/compare/v1.0.5...v1.0.6) (2023-10-20)


### Bug Fixes

* Disable analytics ([a41fc81](https://github.com/cataas/cataas/commit/a41fc81ca3106eda7bc03515b4ed5da9017f5836))

## [1.0.5](https://github.com/cataas/cataas/compare/v1.0.4...v1.0.5) (2023-10-20)


### Bug Fixes

* Use node-fetch instead of fetch ([6f43e38](https://github.com/cataas/cataas/commit/6f43e38446c39dd736e138539df3a1518f5fcdf9))

## [1.0.4](https://github.com/cataas/cataas/compare/v1.0.3...v1.0.4) (2023-10-19)


### Bug Fixes

* Catch error for analytics ([9e5dec2](https://github.com/cataas/cataas/commit/9e5dec2c9f9c23838aab2e9ef485cc6b9b9b3817))

## [1.0.3](https://github.com/cataas/cataas/compare/v1.0.2...v1.0.3) (2023-10-19)


### Bug Fixes

* hue and lightness default values ([8fd2356](https://github.com/cataas/cataas/commit/8fd23567e3a344ee3aca9a49b72a6547bd7ecabd))

## [1.0.2](https://github.com/cataas/cataas/compare/v1.0.1...v1.0.2) (2023-10-17)


### Bug Fixes

* Admin edit cat ([e5b834e](https://github.com/cataas/cataas/commit/e5b834e3b326d4dd6581b90e79c7969c104abfdd))

## [1.0.1](https://github.com/cataas/cataas/compare/v1.0.0...v1.0.1) (2023-10-16)


### Bug Fixes

* Analytics Token ([de3a4f2](https://github.com/cataas/cataas/commit/de3a4f2d64b5020fbe6b864ed1a3b81a3be8d444))

# 1.0.0 (2023-10-16)


### Bug Fixes

* Dockerfile for production ([c3b003f](https://github.com/cataas/cataas/commit/c3b003f00b7b9a170ddfd3db22dda01005802776))

# [1.4.0](https://github.com/boutdecode/site-template/compare/v1.3.0...v1.4.0) (2023-09-21)


### Features

* First CRUD iterator with delete ([b737d7c](https://github.com/boutdecode/site-template/commit/b737d7c7b9bfa995c4acacb13e321f7137aba32e))

# [1.3.0](https://github.com/boutdecode/site-template/compare/v1.2.0...v1.3.0) (2023-09-20)


### Features

* Add dashboard and connection ([c1c827d](https://github.com/boutdecode/site-template/commit/c1c827d759f7fb8db1ee8ee94c3b5c0d914a6500))

# [1.2.0](https://github.com/boutdecode/site-template/compare/v1.1.0...v1.2.0) (2023-09-19)


### Features

* Add CMS module ([96bb2f0](https://github.com/boutdecode/site-template/commit/96bb2f09c9392f3d8fe6b1997e3ed5919e473c32))
