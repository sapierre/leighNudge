# AGENTS.md

A dedicated guide for coding agents working on the Turbostarter monorepo. Use this file for setup, commands, and architecture/conventions when implementing changes.

## Quickstart

- Ensure versions: Node ≥ 22.17.0, pnpm 10.18.x
- Create `.env` at repo root (loaded automatically by `pnpm with-env`):

```bash
# minimal example — adjust per environment
DATABASE_URL="postgres://user:pass@localhost:5432/turbostarter"
PRODUCT_NAME="Turbostarter"
URL="http://localhost:3000"
DEFAULT_LOCALE="en"
```

- Install dependencies: `pnpm install`
- Start databases/services (Docker): `pnpm services:start`
- First-time DB setup: `pnpm with-env -F @turbostarter/db db:setup`
- Apply migrations: `pnpm with-env -F @turbostarter/db db:migrate`
- Start dev for all apps: `pnpm dev`
  - Or target a single app (e.g., web): `pnpm --filter web dev`

## Environment & Tooling

- Node: >= 22.17.0
- Package manager: pnpm 10.18.x
- Monorepo: Turborepo (`turbo.json`)
- Env loader: `dotenv-cli` via `with-env` script
- Global envs (turborepo): `DATABASE_URL`, `PRODUCT_NAME`, `URL`, `DEFAULT_LOCALE`
- Place a `.env` at the repo root; root scripts use `pnpm with-env` to load it.

## Dev commands

- Start monorepo dev (runs package dev tasks via Turborepo): `pnpm dev`
- Start a specific app:
  - Web: `pnpm --filter web dev`
  - Mobile (Expo): `pnpm --filter mobile dev`
  - Extension (Chrome): `pnpm --filter extension dev`
  - Extension (Firefox): `pnpm --filter extension dev:firefox`

## Build commands

- Build all packages/apps: `pnpm build`
- Build specific app:
  - Web: `pnpm --filter web build`
  - Mobile: No generic build script. Use platform builds:
    - iOS (local run): `pnpm --filter mobile ios`
    - Android (local run): `pnpm --filter mobile android`
    - For CI/release builds, use EAS or platform toolchains
  - Extension zips:
    - Chrome: `pnpm --filter extension build:chrome`
    - Firefox: `pnpm --filter extension build:firefox`

## Command cheat sheet

| Goal                             | Command                                                                          |
| -------------------------------- | -------------------------------------------------------------------------------- |
| Install dependencies             | `pnpm install`                                                                   |
| Start all dev tasks              | `pnpm dev`                                                                       |
| Start web only                   | `pnpm --filter web dev`                                                          |
| Start mobile (iOS/Android)       | `pnpm --filter mobile ios` / `pnpm --filter mobile android`                      |
| Start extension (Chrome/Firefox) | `pnpm --filter extension dev` / `pnpm --filter extension dev:firefox`            |
| Build everything                 | `pnpm build`                                                                     |
| Build web only                   | `pnpm --filter web build`                                                        |
| Build extension zips             | `pnpm --filter extension build:chrome` / `pnpm --filter extension build:firefox` |
| Lint (check/fix)                 | `pnpm lint` / `pnpm lint:fix`                                                    |
| Format (check/fix)               | `pnpm format` / `pnpm format:fix`                                                |
| Typecheck                        | `pnpm typecheck`                                                                 |
| Clean caches                     | `pnpm clean`                                                                     |
| Start/stop services (Docker)     | `pnpm services:start` / `pnpm services:stop`                                     |
| DB: generate/apply migrations    | `pnpm with-env -F @turbostarter/db db:generate` / `db:migrate`                   |
| DB: push/check/studio            | `pnpm with-env -F @turbostarter/db db:push` / `db:check` / `db:studio`           |

## Quality & Types

- Format (check): `pnpm format`
- Format (write): `pnpm format:fix`
- Lint (check): `pnpm lint`
- Lint (fix): `pnpm lint:fix`
- Typecheck: `pnpm typecheck`
- Commit messages: follow Conventional Commits (enforced via `commitlint.config.ts`)

## Database (Drizzle)

- Start services (Docker): `pnpm services:start`
- Stop services: `pnpm services:stop`
- Services status: `pnpm services:status`
- Services logs: `pnpm services:logs`
- First-time setup: `pnpm with-env -F @turbostarter/db db:setup`
- Generate migrations: `pnpm with-env -F @turbostarter/db db:generate`
- Apply migrations: `pnpm with-env -F @turbostarter/db db:migrate`
- Push schema (safe envs): `pnpm with-env -F @turbostarter/db db:push`
- Check schema drift: `pnpm with-env -F @turbostarter/db db:check`
- Studio: `pnpm with-env -F @turbostarter/db db:studio`

Note: All db commands will load `.env` via `with-env`.

## Common workflows

- Web only dev: `pnpm --filter web dev`
- Mobile local run:
  - iOS simulator: `pnpm --filter mobile ios`
  - Android emulator: `pnpm --filter mobile android`
- Extension dev:
  - Chrome: `pnpm --filter extension dev`
  - Firefox: `pnpm --filter extension dev:firefox`
- Extension release zips:
  - Chrome: `pnpm --filter extension build:chrome`
  - Firefox: `pnpm --filter extension build:firefox`
- Code quality loop:
  - `pnpm typecheck`
  - `pnpm lint` → `pnpm lint:fix`
  - `pnpm format` → `pnpm format:fix`
- Database iteration:
  1. Update schema in `packages/db/src/schema/*`
  2. Generate migration: `pnpm with-env -F @turbostarter/db db:generate`
  3. Apply migration: `pnpm with-env -F @turbostarter/db db:migrate`
  4. Verify in studio: `pnpm with-env -F @turbostarter/db db:studio`

## Troubleshooting

- Node/pnpm version mismatch
  - Ensure Node ≥ 22.17.0 and pnpm 10.18.x (`node -v`, `pnpm -v`)
- Services not available / connection refused
  - Make sure Docker is running; start services: `pnpm services:start`
  - Check logs: `pnpm services:logs`
- `DATABASE_URL` or env not loaded
  - Create `.env` at repo root; use `pnpm with-env` for DB commands
- Turbo or module resolution oddities after refactors
  - Clear caches: `pnpm clean`; then reinstall: `pnpm install`
- Migration drift or conflicts
  - Run: `pnpm with-env -F @turbostarter/db db:check`
  - Re-generate and apply: `generate` → `migrate`

## Agent workflow tips

- Prefer targeted commands with `pnpm --filter <app-or-package> <cmd>` to minimize work
- Use `pnpm with-env` whenever a command depends on environment variables
- Keep changes modular; share logic in `packages/*` to avoid duplication
- For web (`apps/web`): prefer React Server Components; avoid unnecessary client code
- For mobile: minimize `useEffect`; memoize where appropriate; use safe-area primitives
- For extension: use background for long tasks; content scripts for DOM; leverage messaging

## Project structure

- `apps/` applications
  - `web`: Next.js App Router web app
  - `mobile`: React Native (Expo) app
  - `extension`: WXT (Vite + React) browser extension
- `packages/` shared modules
  - `api`: Hono API logic
  - `auth`: Better Auth setup and helpers
  - `billing`: Billing provider integrations (Stripe, LemonSqueezy, etc.)
  - `cms`: Content Collections
  - `db`: Drizzle ORM schema and utils
  - `email`: Email templates and providers
  - `i18n`: Internationalization utilities
  - `shared`: Common utilities and helpers
  - `storage`: File storage integrations
  - `ui`: Shared UI components (`ui-web`, `ui-mobile`, shared styles/types)
- `tooling/` ESLint, Prettier, Tailwind, TS configs

## Code style and structure

- Write concise, technical TypeScript; prefer functional, declarative patterns; avoid classes
- Prefer iteration and modularization over duplication
- Use descriptive variable names with auxiliaries (e.g., `isLoading`, `hasError`)
- File layout: exported component first, then subcomponents, helpers, static content, types
- Use interfaces over types; avoid enums (prefer maps)
- Declarative JSX; avoid unnecessary curly braces in simple conditionals
- Error handling: guard clauses and early returns
- Validation: use Zod for forms and inputs
- Expected errors: model as return values in Server Actions; use error boundaries for unexpected errors

## Web app (`apps/web`)

- Stack: Next.js (App Router), React, Tailwind CSS, shared `@turbostarter/ui-web`
- Structure: `src/app/[locale]` with segments `(marketing)`, `auth`, `dashboard`
- API routes in `src/app/api` may proxy/use `packages/api`
- Guidance:
  - Favor React Server Components; minimize `use client`, `useEffect`, `setState`
  - Wrap client components in `Suspense` with fallbacks; use dynamic import for non-critical code
  - Use Tailwind; Shadcn/Radix for components; mobile-first responsive design
  - Optimize images (WebP, sizes, lazy loading); focus on Web Vitals (LCP, CLS, FID)
  - Use `nuqs` for URL search param state

## Mobile app (`apps/mobile`)

- Stack: React Native + Expo, Expo Router, shared `@turbostarter/ui-mobile`
- Structure: `src/app` with tabs, `auth`, `settings`; components in `src/components`
- Guidance:
  - Safe areas: use `SafeAreaProvider`, `SafeAreaView`, and scroll variants
  - Performance: reduce `useState`/`useEffect`; memoize (`React.memo`, `useMemo`, `useCallback`)
  - Use Expo SplashScreen; dynamic import where helpful; optimize images (`expo-image`, WebP)

## Browser extension (`apps/extension`)

- Stack: WXT (Vite + React), Tailwind, shared `@turbostarter/ui-web`
- Entrypoints: `src/app` provides `background`, `content`, `popup`, `options`, `sidepanel`, `newtab`, `devtools`
- Guidance:
  - Background script for long-running tasks; content scripts for DOM interactions
  - Use WXT messaging or `@webext-core/messaging` for communication
  - Store data via browser storage APIs; integrate `packages/api` and `packages/auth` as needed

## Packages overview (`packages/`)

- `analytics` (web/mobile/extension): platform analytics helpers
- `api`: server-side Hono modules (AI, auth, billing, storage)
- `auth`: Better Auth server/client, schemas, helpers
- `billing`: config + providers, checkout/subscriptions/webhooks
- `cms`: content collections and types
- `db`: Drizzle schema, migrations, server utils
- `email`: templates + providers (e.g., Resend)
- `i18n`: i18n setup, translations, helpers
- `shared`: utilities, hooks, constants
- `storage`: file storage providers and types
- `ui`: shared UI and styling primitives

## Next.js specifics

- Prefer RSC; keep `use client` minimal and scoped to Web API usage
- Avoid client-side data fetching for server-eligible work; keep state local and lean

## Contributing guidance for agents

- Adhere to the conventions above; match existing formatting; do not reformat unrelated code
- Add imports and types explicitly; avoid `any` and unsafe casts
- Handle edge cases early; return structured errors for expected failures
- Keep components small and modular; name variables descriptively
- When modifying multiple areas, prefer creating shared helpers in `packages/*` to avoid duplication

## Notes

- There is no repository-wide `test` script currently defined. Add tests and scripts when introducing testable modules.
- Use root scripts for monorepo operations; prefer `pnpm --filter <pkg> <cmd>` when targeting a specific package.
