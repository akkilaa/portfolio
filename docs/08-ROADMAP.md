# 08 — Roadmap

Phased delivery plan. Each milestone is a **shippable** state — no half-built features. Estimates assume ~10 hours/week.

---

## M0 — Documentation (this week)

**Deliverable:** docs in `docs/` complete and reviewed against the PRD checklist.

- [ ] `00-PROCESS.md`
- [ ] `01-PRD.md` (signed off against own checklist)
- [ ] `02-USER_STORIES.md`
- [ ] `03-TECH_STACK.md`
- [ ] `04-ARCHITECTURE.md`
- [ ] `05-DATA_MODEL.md`
- [ ] `06-API_SPEC.md`
- [ ] `07-DESIGN_SYSTEM.md`
- [ ] First ADR(s) for any decisions that warrant them
- [ ] CONTRIBUTING.md and PR/issue templates

**Exit gate:** another engineer (or future-you) can read these and understand the project without questions.

---

## M1 — Design (week 2)

**Deliverable:** Figma file with all screens, both modes, both viewports.

- [ ] Sitemap finalized in `07-DESIGN_SYSTEM.md`
- [ ] User flows drawn (4 critical flows minimum)
- [ ] Wireframes for every page template (low-fi, greybox)
- [ ] Color palette locked, contrast checked
- [ ] Type scale & weights locked
- [ ] Hi-fi mockups: Landing, Projects index, Project detail, Blog index, Blog post, About, Contact, Admin login, Admin dashboard
- [ ] Mobile pass for every screen (360–414 width)
- [ ] Dark mode pass for every screen
- [ ] Component inventory complete
- [ ] A11y checklist applied (contrast, focus state design)

**Exit gate:** if you handed the Figma file to another engineer, they could implement it without asking layout questions.

---

## M2 — Foundations (week 3)

**Deliverable:** monorepo with two deployable skeleton apps and a CI pipeline. No features yet.

- [ ] Initialize repo with pnpm + Turborepo
- [ ] `apps/web` — Next.js scaffold, Tailwind configured with tokens, base layout, light/dark toggle
- [ ] `apps/api` — Express + TS scaffold, `/health` endpoint, pino logging, helmet, CORS
- [ ] `packages/db` — Prisma initialized, full schema from `05-DATA_MODEL.md`, first migration applied
- [ ] `packages/shared` — first Zod schemas (Project, Post)
- [ ] ESLint, Prettier, husky + lint-staged
- [ ] commitlint with Conventional Commits
- [ ] GitHub Actions: `lint`, `typecheck`, `test`, `build`
- [ ] Branch protection on `main`
- [ ] Vercel project for `apps/web`, Railway for `apps/api` + Postgres
- [ ] Env-var management documented
- [ ] Sentry connected on both apps
- [ ] PR template + at least 1 issue template
- [ ] Initial deploy to staging

**Exit gate:** a new branch → opens a PR → CI green → preview deploy URL → merging deploys to staging. End-to-end pipeline proven.

---

## M3 — Public site read-path (week 4)

**Deliverable:** anyone can read projects + blog. Content seeded from JSON / markdown files.

- [ ] `GET /v1/projects`, `GET /v1/projects/:slug`
- [ ] `GET /v1/posts`, `GET /v1/posts/:slug`, `GET /v1/tags`
- [ ] Public pages: `/`, `/about`, `/projects`, `/projects/[slug]`, `/blog`, `/blog/[slug]`, `/contact` (UI only — no submit yet)
- [ ] OG / Twitter card metadata
- [ ] `sitemap.xml`, `robots.txt`, `rss.xml`
- [ ] MDX rendering with code highlighting + copy button
- [ ] Header / footer / theme toggle
- [ ] 404 + error pages
- [ ] Lighthouse ≥ 90 on landing
- [ ] Tag filter on `/projects` (US-2.2)

**Exit gate:** site is shareable. Recruiter could read it today.

---

## M4 — Contact form + admin auth (week 5)

**Deliverable:** I can log in; visitors can message me.

- [ ] `POST /v1/contact` end-to-end (validate, captcha, persist, email)
- [ ] Rate limiting on contact + auth
- [ ] Honeypot + hCaptcha
- [ ] `POST /v1/auth/login`, `/logout`, `/me`
- [ ] Admin login page
- [ ] `/admin` route gating middleware
- [ ] Audit log table populated for auth events

**Exit gate:** I receive a real test email from the form; failed login attempts are throttled.

---

## M5 — Admin CRUD (week 6)

**Deliverable:** I can manage all content from the admin UI.

- [ ] Admin layout (sidebar, topbar)
- [ ] DataTable component
- [ ] Projects CRUD UI + API
- [ ] Posts CRUD UI + API with markdown editor
- [ ] Tag management
- [ ] Image uploads (presigned URL flow → R2)
- [ ] Publish / unpublish actions
- [ ] On-publish revalidation hook to web
- [ ] Soft delete + restore
- [ ] Contact submissions read-only view
- [ ] Audit log read view

**Exit gate:** zero hardcoded content remains in `apps/web` — all of it is editable through admin.

---

## M6 — Polish & launch (week 7)

**Deliverable:** v1.0.0 tagged and on the production domain.

- [ ] Lighthouse ≥ 95 across the four categories on landing
- [ ] Bundle size budget enforced in CI
- [ ] axe + Pa11y pass on every public route
- [ ] Playwright E2E for: read landing, read post, submit contact, admin login + publish
- [ ] Plausible (or Vercel Analytics) wired
- [ ] UptimeRobot configured
- [ ] Custom domain + HSTS + redirect non-www
- [ ] Production seed: ≥ 5 projects, ≥ 2 posts
- [ ] Tag `v1.0.0` in git, fill `CHANGELOG.md`
- [ ] Send link to first 10 recruiters

---

## Beyond v1 (parking lot)

Tracked separately as GitHub issues, not on this roadmap until promoted.

- Comments via GitHub Discussions
- Newsletter signup + first send
- Long-form case-study template
- "Now" page
- Webmentions
- View-counter / read-time signals
- View-source-style "how this site is built" page
- Public RSS-to-email subscribe

---

## Working agreements (with myself)

- One PR per user story, max ~400 lines diff. Bigger features get split.
- Tests with the feature, not later.
- Update `CHANGELOG.md` on the PR that introduces a user-facing change.
- If a milestone slips by more than 50%, write a short retro into `docs/retros/` and adjust scope, not just dates.
