# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## About this repo

Sniplink — a URL shortener + QR code generator built on Next.js 16 (App Router), Prisma/PostgreSQL, and Auth.js v5 (NextAuth beta). Originally scaffolded by v0.app; look for `[v0]`-prefixed `console.log` calls, that's the convention this codebase uses for logging swallowed/fallback errors (DB unreachable, persistence failures), not a debug leftover to remove.

**Read `AGENTS.md` (imported above) before writing code that touches Next.js APIs** — this project pins a Next.js version with breaking changes vs. training data, and the real docs live in `node_modules/next/dist/docs/` (not present until `pnpm install` has been run).

## Commands

This project uses **pnpm** (see `pnpm-lock.yaml`).

```
pnpm install         # also runs `prisma generate` via postinstall
pnpm dev              # next dev
pnpm build             # next build
pnpm start              # next start (production)
pnpm lint                # eslint .  (no eslint config file currently checked in — will error until one is added)
pnpm db:migrate           # prisma migrate dev — apply/create migrations locally
pnpm db:push                # prisma db push — sync schema without a migration
pnpm db:studio                # prisma studio — browse the DB
```

There is no test runner configured (no test script, no test files). Don't assume Jest/Vitest is available.

### Local setup

Requires a local PostgreSQL instance. Copy `.env.example` to `.env` and fill in:
- `DATABASE_URL` — e.g. `createdb sniplink` then point at it
- `AUTH_SECRET` — `openssl rand -base64 32`
- `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` — from Google Cloud Console, redirect URI `http://localhost:3000/api/auth/callback/google`

Google is the only auth provider configured (`auth.ts`).

## Architecture

**Redirect flow is a page, not an API route.** `app/[shortCode]/page.tsx` is a Server Component that looks up the code, logs a `Click` + increments `Link.clickCount` in one `prisma.$transaction`, then calls `redirect()`. Any change to redirect behavior (e.g. adding rate limiting, bot filtering) goes here, not in `app/api/`.

**Reserved short codes.** `lib/short-code.ts` exports `RESERVED_CODES` (`dashboard`, `login`, `api`, `_next`, `favicon.ico`) so real routes can't be shadowed by a short link. Both `shortenUrl` (lib/actions.ts) and the redirect page check against this set — when adding a new top-level route under `app/`, add its segment here too.

**Degrade-without-DB is a deliberate pattern, not error-handling laziness.** `shortenUrl`, the redirect page, and the dashboard query all wrap their Prisma calls in `try/catch` and fall back to a non-persisted/empty result instead of throwing, logging via `console.log("[v0] ...")`. This lets the app render in preview environments with no Postgres attached. Preserve this pattern in new server code that touches the DB — don't replace it with hard failures.

**Server Actions, not API routes, for mutations.** `lib/actions.ts` (`"use server"`) holds `shortenUrl` and `deleteLink`; both are called from client components via TanStack Query's `useMutation` (see `components/shorten-form.tsx`, `components/dashboard/links-table.tsx`) rather than `fetch`. Follow this pattern for new mutations instead of adding `app/api/*` routes.

**Auth wiring.** `auth.ts` is the single Auth.js config (Google provider, Prisma adapter, database-strategy sessions). `app/api/auth/[...nextauth]/route.ts` just re-exports `handlers`. The `session.user.id` field is added via the `session` callback and typed in `types/next-auth.d.ts` — any new session field needs both.

**Ownership checks happen in the action, not middleware.** `deleteLink` scopes its `deleteMany` `where` clause to `{ id, userId: session.user.id }` so cross-user deletes silently affect 0 rows. Follow the same scoping approach for future per-user mutations rather than checking ownership before calling Prisma.

**UI kit is `@base-ui/react`, not Radix**, despite the shadcn tooling (`components.json`, `shadcn` style `base-nova`). Components like `Button` and `DropdownMenuTrigger` take a `render={<element/>}` prop for polymorphism instead of Radix's `asChild` — see `components/ui/button.tsx` and its use in `components/dashboard/links-table.tsx`. Don't reach for `asChild`.

**Validation source of truth is `lib/validations.ts`** (`shortenSchema`, Zod v4) — used both by `react-hook-form`'s `zodResolver` on the client and by `shortenUrl` on the server via `safeParse`. Extend this schema rather than duplicating validation logic.

**QR codes are generated client-side** (`components/qr-code.tsx`, `qrcode` package) and surfaced via an `onReady(dataUrl)` callback so the parent can wire up a download button (see `links-table.tsx`'s `downloadQr`).

### Data model (`prisma/schema.prisma`)

- `Link` — `shortCode` (unique), `originalUrl`, optional `userId` (nullable → guest/anonymous links are allowed), denormalized `clickCount`.
- `Click` — one row per visit, `linkId` FK, used for `lastVisit` on the dashboard.
- `User`/`Account`/`Session`/`VerificationToken` — standard Auth.js Prisma adapter models.

## Config quirks worth knowing

- `next.config.mjs` sets `typescript.ignoreBuildErrors: true` and `images.unoptimized: true` — TS errors will not fail `next build`.
- Path alias `@/*` maps to the repo root (`tsconfig.json`), matching the `shadcn` aliases in `components.json`.
