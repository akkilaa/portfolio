# 04 — Architecture

High-level view of how the system is composed, how requests flow, and how it's deployed.

---

## 1. System context

```
                      ┌──────────────────┐
                      │   End users      │
                      │ (recruiters,     │
                      │  engineers, me)  │
                      └────────┬─────────┘
                               │ HTTPS
                               ▼
   ┌──────────────────────────────────────────────────┐
   │             akkila.dev                           │    
   │              Next.js (Self-Hosted)               │
   │  ┌──────────────┐  ┌─────────────────────────┐   │
   │  │ Public pages │  │ Admin pages (auth-gated)│   │
   │  └──────────────┘  └─────────────────────────┘   │
   └──────────┬───────────────────────┬───────────────┘
              │ fetch (SSR + client)  │
              ▼                       ▼
        ┌─────────────────────────────────────┐
        │     api.akkila.dev                  │
        │     Express + TypeScript            │
        │     (Self-Hosted)                   │
        └────┬─────────────┬──────────────────┘
             │             │
             ▼             ▼
       ┌─────────┐   ┌─────────────┐
       │ Postgres│   │ Self-Hosted │
       │         │   │ images      │
       └─────────┘   └─────────────┘
                            ▲
                            │
                     ┌──────┴──────┐
                     │   Resend    │  (email)
                     │   hCaptcha  │  (bot)
                     │  GlitchTip  │  (errors)
                     └─────────────┘
```

---

## 2. Components

### apps/web — Next.js
- Renders public pages (mostly SSG with ISR, some SSR for dynamic content).
- Renders the admin SPA-feel area under `/admin/*`.
- Reads from the API for everything dynamic. Static project/post data may be cached at build with on-demand revalidation triggered by the API after writes probably ISR with hydration.

### apps/api — Express
- REST endpoints under `/api/v1/*` (see `06-API_SPEC.md`).
- Owns Postgres via Prisma.
- Owns side effects: sending email, uploading to self-hosted with adapter for R2 tomorrow, validating captcha.
- Stateless — horizontally scalable if ever needed.

### packages/db — Prisma client + schema + migrations
- Imported by `apps/api` only. The web app does not talk to the DB directly.

### packages/shared — Zod schemas + shared TS types
- Imported by both `apps/web` and `apps/api` for request/response shapes.

### packages/ui (optional)
- Place for components shared between public and admin if duplication grows. Otherwise live in `apps/web`.

---

## 3. Request lifecycle

### A) Public visitor reads a blog post (SSG with ISR)

1. Visitor requests `/blog/my-post`.
2. Self-hosted serves a pre-rendered HTML page from the edge cache (checking CloudFlared solution for this). No API call.
3. If the page was last revalidated > N minutes ago, Next regenerates it in the background (ISR).
4. Background regeneration calls `GET /api/v1/posts/my-post`, which queries Postgres, returns JSON.
5. Next persists the new HTML; subsequent users get fresh content.

### B) Admin publishes a new post (write path)

1. Admin clicks "Publish" in `/admin/posts/123`.
2. Browser sends `POST /api/v1/admin/posts/123/publish` with the JWT cookie.
3. API verifies cookie → checks role → updates Postgres → returns 200.
4. API issues a webhook to self-hosted: `POST /api/revalidate?path=/blog/my-post&secret=...`.
5. Self-hosted re-renders just that page. Public visitors see the post within seconds.

### C) Visitor submits the contact form

1. Browser submits to `POST /api/v1/contact` with form fields + captcha token.
2. API validates body with the Zod schema, verifies captcha, checks rate limit.
3. Inserts into `contact_submissions`.
4. Sends email to admin via Resend (fire-and-forget; failure is logged but doesn't fail the request).
5. Returns 200 + a benign success message.

---

## 4. Authentication & authorization

- Passwords hashed with **bcrypt cost ≥ 12**.
- Login issues a **JWT (RS256 or HS256 with strong secret)** placed in an `HttpOnly`, `Secure`, `SameSite=Lax` cookie.
- Cookie scoped to the API domain; the web app forwards it on same-site requests.
- Token TTL: 7 days. No refresh token (single user, low risk).
- Middleware on `/api/v1/admin/*` extracts the cookie, verifies signature + expiry + `role === "admin"`.
- Logout deletes the cookie server-side (`Set-Cookie: ... Max-Age=0`).

CSRF: form-encoded admin requests use a double-submit token; JSON requests rely on `SameSite=Lax` + a custom header (`X-Requested-With: fetch`) check.

---

## 5. Data flow & ownership

| Concern | Owner | Notes |
|---|---|---|
| Schema migrations | `packages/db` | `pnpm db:migrate` runs on deploy via Railway pre-deploy. |
| Image uploads | `apps/api` → R2 | API generates a pre-signed PUT URL; client uploads directly to R2. |
| Email | `apps/api` → Resend | Templated via React Email. |
| Captcha verification | `apps/api` → hCaptcha | Server-to-server only; never trust the client. |
| Cache invalidation | `apps/api` → Next.js revalidate | Triggered after every admin write. |

---

## 6. Failure modes & graceful degradation

| Dependency down | Effect | Mitigation |
|---|---|---|
| API down | Public pages keep serving from ISR cache. Contact form fails with retry UI. | Cache long; show last-good content. |
| Postgres down | All writes fail; reads from API fail; cached pages still serve. | Next.js ISR cache mitigates for public reads. |
| Resend down | Contact submission persists; email retry is best-effort. | Persist first, send second; queue-and-retry. |
| R2 down | Image uploads fail; existing images keep serving. | Show clear error in admin upload UI. |

---

## 7. Environments

| Env | Purpose | Web URL | API URL |
|---|---|---|---|
| local | Dev on laptop | `http://localhost:3000` | `http://localhost:4000` |
| staging | `main` branch | `https://staging.akkila.dev` | `https://staging.api.akkila.dev` |
| production | tagged release | `https://akkila.dev` | `https://api.akkila.dev` |

Secrets per env via `.env` files or host environment variables. **Never** committed.

---

## 8. Observability

- **Logs** — `pino` JSON logs on both apps. Aggregated locally or shipped to a log file per env.
- **Errors** — [GlitchTip](https://glitchtip.com) (free, open-source Sentry-compatible) on web and api. Source maps uploaded in CI.
- **User analytics** — Microsoft Clarity for session recording, heatmaps, and Web Vitals.
- **Uptime** — UptimeRobot (free tier) hits `GET /api/v1/health` every 5 min.

---

## 9. Security baseline

- HTTPS everywhere. HSTS preload after stable.
- `helmet` on API for security headers.
- CORS allowlist: only the web origin per env.
- Rate limit `POST /api/v1/contact` and `POST /api/v1/auth/login`.
- Dependabot + `npm audit` in CI.
- Input validated with Zod on every endpoint — including admin.
- Output never echoes raw user input into HTML without escaping (React handles this; templates use `dompurify` if needed).

---

## 10. Why two apps and not just Next?

If a peer asks "why didn't you just use Next API routes?": this section is the answer.

- **Primary reason: fullstack showcase.** This project is a portfolio — having a standalone Express API demonstrates that I can architect and build a proper backend service, not just wire up serverless functions inside a framework.
- Stronger separation: the public site is statically cached aggressively; the API is the only thing that touches the DB and side effects.
- Background jobs and longer-running work (image processing, scheduled tasks) live naturally on a real Node server.
- Trade-off accepted: more infra, more env vars, CORS, two deploys.

If those reasons stop holding, write an ADR for the consolidation.
