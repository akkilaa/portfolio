# 03 — Tech Stack & Rationale

This doc records *what* technologies the project uses and *why*, plus what was considered and rejected. When you revisit a decision in 6 months, you should be able to read this doc and remember the reasoning without re-litigating it.

For significant or controversial decisions, also write an ADR (see `adr/`). This doc is the high-level summary.

---

## At a glance

| Layer | Choice |
|---|---|
| Frontend framework | **Next.js 15** (App Router) |
| UI language | **TypeScript** (strict) |
| Styling | **Tailwind CSS** + CSS variables for theming |
| UI primitives | **Radix UI** + **shadcn/ui** (copy-in components) |
| Icons | **Lucide** |
| Backend framework | **Express 5** + TypeScript |
| API style | REST (JSON), versioned `/api/v1/...` |
| Validation | **Zod** (shared schemas between web + api) |
| Database | **PostgreSQL 16** |
| ORM / migrations | **Prisma** |
| Auth | JWT in `HttpOnly` cookie, bcrypt password hash |
| File storage | **Cloudflare R2** (S3-compatible, free egress) |
| Email | **Resend** (transactional) |
| Bot protection | **hCaptcha** + honeypot + rate limit |
| Logging | **pino** + pretty in dev, JSON in prod |
| Error tracking | **GlitchTip** (free, open-source, Sentry-compatible) |
| Testing | **Vitest** (unit), **Supertest** (api), **Playwright** (E2E) |
| Linting | **ESLint** (`@typescript-eslint`, `eslint-plugin-react`) + **Prettier** |
| Package manager | **pnpm** workspaces |
| Build orchestration | **Turborepo** |
| CI | **GitHub Actions** |
| Hosting (web) | **Self-Hosted VPS** |
| Hosting (api) | **Self-Hosted VPS** |
| Hosting (db) | **Self-Hosted Postgres** (same VPS) |
| Domain / DNS | **Cloudflare** |
| Analytics | **Microsoft Clarity** (free) |

---

## Frontend

### Why Next.js (App Router)?
- **SSR/SSG out of the box** — public pages need server-rendered HTML for SEO; the App Router makes per-route choice trivial (`force-static`, `revalidate`, `dynamic`).
- **Image optimization** — built-in `next/image` handles AVIF/WebP and lazy loading; meaningful for Lighthouse.
- **One mental model for routing**, layouts, loading/error UIs, server components.
- **Self-hosted** via a standard Node server (`next start`) — full control, no platform lock-in.

**Rejected alternatives**
- *Astro:* great for content sites; less ideal for an admin dashboard with interactive forms. Mixing islands gets awkward.
- *Remix:* solid, but ecosystem and hosting story are smaller than Next.
- *SvelteKit:* I want React experience visible on the resume.
- *CRA / Vite SPA:* no SSR, worse SEO, no built-in metadata API.

### Why TypeScript strict?
Non-negotiable. The class of bugs strict typing catches (especially around API responses) is significant. `strict: true`, `noUncheckedIndexedAccess: true`, `exactOptionalPropertyTypes: true`.

### Why Tailwind + shadcn/ui?
- **Tailwind:** design tokens become utility classes; no naming bikeshed; tiny prod CSS.
- **shadcn/ui:** components are *copied into the repo*, not installed. You own them, customize them, no version churn. Built on Radix primitives (a11y solved).

**Rejected alternatives**
- *MUI / Chakra:* heavier, opinionated theming systems that fight Tailwind.
- *Hand-rolled CSS modules:* fine, but slower iteration.

---

## Backend

### Why Express (vs. Next API routes only)?
The PRD explicitly calls for a separate Node/Express backend. Reasons that hold up:
- **Separation of concerns:** the API can be deployed, scaled, and rate-limited independently of the marketing site.
- **Resume signal:** "fullstack" reads stronger when the API is genuinely a separate service.
- **Reusability:** if I later build a mobile app or a CLI, the API serves them too.
- **Background jobs / longer-running work:** easier to add to a real Node server than to a serverless Next API route.

Trade-offs accepted: extra deploy target, extra CORS config, more infra to monitor.

### Why Prisma?
- Generated, typed client — every query is type-checked against the schema.
- First-class migrations (`prisma migrate`).
- Excellent introspection / Studio UI for debugging during dev.

**Rejected:** Drizzle (great but younger, less docs); Knex/raw SQL (more boilerplate, no type generation).

### Why Zod?
Shared between `apps/web` and `apps/api` via `packages/shared`. Define a schema once, get:
- Runtime validation on the API side.
- Form validation on the client (`react-hook-form` + `@hookform/resolvers/zod`).
- Inferred TypeScript types (`z.infer<>`).

This eliminates a whole category of "frontend and backend disagree about the shape" bugs.

### Why JWT + cookie (vs. session in DB, vs. Auth0/Clerk)?
- **Single admin user.** The login surface is tiny.
- **Cookie, not localStorage**, because cookies sent automatically and protected from XSS via `HttpOnly`.
- **Don't reach for Auth0/Clerk** for a one-user system — too much config and a third-party dependency for negligible benefit.

If multi-user is ever added: re-evaluate (Lucia, Auth.js).

---

## Data layer

### PostgreSQL
The default. Relational, great with Prisma, free hosting tiers, full-text search built in (sufficient for blog search at this scale).

### Cloudflare R2 for media
S3 API, no egress fees. Cheaper than S3, simpler than self-hosting MinIO.

---

## DevEx & quality

| Concern | Tool | Why |
|---|---|---|
| Monorepo | pnpm workspaces + Turborepo | Fast, low-config; local task caching out of the box. |
| Lint | ESLint flat config | Standard. |
| Format | Prettier | Standard. |
| Pre-commit | lint-staged + husky | Catches issues before CI. |
| Commits | Conventional Commits + commitlint | Drives changelog generation. |
| Tests | Vitest, Supertest, Playwright | Fast, native ESM, modern. |
| Typecheck in CI | `tsc --noEmit` | Don't ship type errors. |

---

## Hosting

- **VPS** for web + API + DB: everything on one server (`next start` + Express + Postgres), managed with Docker Compose + Nginx reverse proxy.
- **Cloudflare** for DNS, CDN, and R2 media storage.

Total monthly cost target: **≤ $10** (VPS ~$5–6/mo, Cloudflare free tier).

---

## Versions (as of 2026-04-28)

Pin major versions in this doc so a future read knows what era the design assumed.

| Package | Version |
|---|---|
| node | 22 LTS |
| pnpm | 9 |
| next | 15.x |
| react | 19.x |
| express | 5.x |
| typescript | 5.6+ |
| prisma | 5.x |
| postgres | 16 |
| tailwindcss | 4.x |
| zod | 3.x |
| vitest | 2.x |
| playwright | 1.x |

---

## Things I am explicitly *not* using (yet)

- **GraphQL** — overkill for a single-client REST API.
- **tRPC** — would be nice, but the user's brief specifies a separate Express API; tRPC really wants both ends of the wire to be its client/server.
- **Redux / Zustand** — UI state is small enough for React state and URL params.
- **Server actions (Next)** — see Express decision above; consistency across pages.
- **Docker for dev** — local Postgres via `docker compose up db` is sufficient; no need to fully Dockerize the dev workflow.

If any of these are added later, write an ADR explaining the trigger.
