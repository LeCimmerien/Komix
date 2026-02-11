# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Webkomix (Komix) is a web comic platform built with SvelteKit 5. The application code lives in the `komix/` subdirectory. All commands should be run from `komix/`.

## Commands

All commands run from the `komix/` directory:

```bash
# Development
npm run dev                    # Start dev server
npm run build                  # Production build
npm run preview                # Preview production build

# Code quality
npm run lint                   # Prettier check + ESLint
npm run format                 # Auto-format with Prettier
npm run check                  # TypeScript + Svelte type checking

# Testing
npm run test                   # Run all tests (unit + e2e)
npm run test:unit              # Unit/component tests (vitest, watch mode)
npm run test:unit -- --run     # Unit tests single run
npm run test:e2e               # Playwright e2e tests

# Database (requires Docker)
npm run db:start               # Start PostgreSQL via docker compose
npm run db:generate            # Generate Drizzle migrations
npm run db:push                # Push schema directly to database
npm run db:migrate             # Run migrations
npm run db:studio              # Open Drizzle Studio GUI
```

## Tech Stack

- **Svelte 5** (Runes API: `$state`, `$derived`, `$effect`) with **SvelteKit**
- **Tailwind CSS 4** + **DaisyUI 5** for styling
- **Drizzle ORM** with **PostgreSQL** (via `postgres` driver, Docker Compose)
- **Paraglide** for i18n (English + French, messages in `komix/messages/`)
- **Vitest** (unit/component tests with browser mode) + **Playwright** (e2e)
- **bcrypt** for password hashing

## Architecture

The server-side code follows a layered architecture under `src/lib/server/`:

```
Routes (form actions) → Services → Repositories → Database (Drizzle)
```

- **Services** (`lib/server/services/`): Business logic. `AuthenticationService` handles login, register, logout, session validation.
- **Repositories** (`lib/server/repositories/`): Data access via Drizzle. `UserRepository`, `SessionRepository`.
- **Database** (`lib/server/data/database/`): Drizzle instance (`index.ts`) and schema (`schema.ts`).

### Key Patterns

- **Result type** (`lib/utils/result.ts`): Functions return `Result<T, E>` instead of throwing exceptions. Use `success(value)` and `failure(error)` constructors, and check `.ok` before accessing `.value` or `.error`.
- **Branded types**: `HashedPassword` is a branded string type for type-safe password handling.
- **Session auth**: Cookie-based sessions validated in `hooks.server.ts`. The hook populates `event.locals.user` for all routes.
- **Auth store** (`lib/stores/auth.svelte.ts`): Client-side auth state using Svelte 5 `$state` rune, hydrated from server via layout data.
- **SvelteKit form actions**: Authentication forms use progressive enhancement with server-side actions.

## Code Style

- Tabs for indentation, single quotes, no trailing commas, 100 char line width (see `.prettierrc`)
- Prettier plugins: `prettier-plugin-svelte`, `prettier-plugin-tailwindcss` (auto-sorts Tailwind classes)

## Environment

- `DATABASE_URL` is required (see `komix/.env.example`)
- PostgreSQL runs via `komix/compose.yaml` (port 5432, user: root, db: local)
