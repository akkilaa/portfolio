# 00 — Project Process & Methodology

This document describes **how this project is run** — the industry-standard flow from idea → documentation → design → implementation. Read this first. It is the meta-doc; everything else is an artifact produced by this process.

The flow has three phases, each with explicit deliverables and an exit gate. You don't move to the next phase until the previous one's exit gate is met. This is how real engineering teams ship software, scaled down for a solo project.

---

## Why bother with documentation first?

It is tempting to open a code editor and start writing JSX. Don't. The cost of changing a decision rises sharply once code exists:

| When you change your mind | Cost                                        |
| ------------------------- | ------------------------------------------- |
| While writing the PRD     | Edit a paragraph.                           |
| While wireframing         | Move some boxes.                            |
| While coding              | Rewrite components, migrations, API routes. |
| After deploy              | Migrate prod data, fix bugs, lose users.    |

Documentation is **cheap thinking**. The goal isn't a binder of paperwork — it's a deliberate sequence of decisions written down so future-you (and recruiters reading your repo) can see your reasoning.

---

## Phase 1 — Discovery & Specification (Documentation)

**Goal:** answer "what are we building, for whom, why, and roughly how" — in writing — before designing pixels or writing code.

### Deliverables

| Doc                  | Purpose                                                                                                                                                                                  |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `01-PRD.md`          | Product Requirements Document. The "what" and "why." Vision, target user, goals, success criteria, in-scope/out-of-scope features, non-functional requirements (performance, a11y, SEO). |
| `02-USER_STORIES.md` | User stories ("As a visitor, I want to…") and acceptance criteria. Translates the PRD into testable behaviors.                                                                           |
| `03-TECH_STACK.md`   | Stack decisions with rationale. Why Next.js over Remix, why Postgres over Mongo, etc.                                                                                                    |
| `04-ARCHITECTURE.md` | High-level system diagram. Frontend ↔ API ↔ DB ↔ third-party services. Request lifecycle. Auth model. Deployment topology.                                                               |
| `05-DATA_MODEL.md`   | ERD + table specs. Every entity, field, type, relationship, index.                                                                                                                       |
| `06-API_SPEC.md`     | REST endpoints, request/response shapes, status codes, auth requirements. Effectively your contract between frontend and backend.                                                        |
| `08-ROADMAP.md`      | Phased milestones (MVP → v1 → v2). What ships when.                                                                                                                                      |
| `adr/`               | Architecture Decision Records — short docs capturing significant decisions and their context. One ADR per decision.                                                                      |

### Exit gate

- [ ] You can explain the project in two sentences.
- [ ] Every feature traces to a user story.
- [ ] Every user story traces to one or more API endpoints + DB entities.
- [ ] You know what is **not** in scope (just as important as what is).
- [ ] Roadmap has a clear MVP that you could ship in ~2 weeks of focused work.

### Common mistakes

- Writing a PRD that's just a feature list. A PRD without a "why" is a wishlist.
- Skipping non-functional requirements. "It must load in <2s on 4G," "WCAG AA," "must work without JS for SEO" are all decisions you make once and reference later.
- Trying to spec v2 features. Defer. The PRD covers MVP plus an explicit "later" section.

---

## Phase 2 — Design

**Goal:** decide what every screen looks like and how the user moves between them, before writing components.

### Deliverables

| Artifact                | Where                                                                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Sitemap                 | `07-DESIGN_SYSTEM.md` (or a separate `IA.md`)                                                                                  |
| User flows              | One flow per top-level task: "visit site," "read blog post," "submit contact form," "log into admin."                          |
| Wireframes (low-fi)     | Figma. Greyboxes only. Decide layout & hierarchy without getting distracted by color.                                          |
| Design tokens           | `07-DESIGN_SYSTEM.md`. Colors, typography scale, spacing scale, radii, shadows, breakpoints. These map 1:1 to Tailwind config. |
| Component inventory     | List of every reusable component (`Button`, `Card`, `ProjectTile`, etc.) with variants.                                        |
| High-fidelity mockups   | Figma. Desktop + mobile for every screen.                                                                                      |
| Accessibility checklist | WCAG 2.1 AA. Color contrast, focus states, keyboard nav, alt text plan, reduced-motion.                                        |

### Tools

- **Figma** for wireframes + mockups. Free tier is enough.
- **Excalidraw** or **tldraw** for diagrams in markdown docs.
- **Coolors / Realtime Colors** to lock palette before tokens.

### Exit gate

- [ ] Every screen in the sitemap has a hi-fi mockup.
- [ ] Every component in the inventory appears in at least one mockup.
- [ ] Design tokens are finalized and pasted into the design system doc.
- [ ] You've checked color contrast for body text and interactive elements.
- [ ] Mobile layout exists for every screen, not just "we'll figure it out later."

### Common mistakes

- Designing in code. Stay in Figma — iteration is 10x faster.
- Picking colors first. Lay out structure in greyscale, add color last.
- Skipping the mobile pass and discovering at implementation time that the desktop layout doesn't reflow.

---

## Phase 3 — Implementation

**Goal:** turn specs and mockups into working software, milestone by milestone.

### Setup before writing feature code

1. **Repo & tooling**
   - `pnpm` workspaces + Turborepo (monorepo)
   - TypeScript with `strict: true` everywhere
   - ESLint + Prettier + `lint-staged` + `husky` pre-commit
   - EditorConfig
2. **CI**
   - GitHub Actions: lint, typecheck, test, build on every PR
   - Branch protection on `main`
3. **Conventions**
   - [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `chore:`)
   - Branch naming: `feat/<short-desc>`, `fix/<short-desc>`
   - Trunk-based workflow with short-lived feature branches
4. **Database**
   - Prisma initialized, schema mirrors `05-DATA_MODEL.md`
   - First migration committed
5. **Skeletons**
   - `apps/web` Next.js scaffold builds and serves a "hello"
   - `apps/api` Express scaffold serves `/health` returning `{ status: "ok" }`
   - Tailwind installed, design tokens wired into `tailwind.config.ts`

### Build order — work milestone by milestone

For each milestone in the roadmap:

1. **Cut a branch** off `main`.
2. **Write failing tests** for the user story's acceptance criteria.
3. **Implement** until tests pass.
4. **Manual QA** against the mockup.
5. **Open a PR** using the PR template. Self-review the diff.
6. **Merge**, deploy to staging, smoke test.
7. **Update the changelog.**
8. **Tag a release** at the end of each milestone.

### Testing pyramid

- **Unit** (Vitest/Jest): pure functions, utils, schema validation. Many. Fast.
- **Integration** (Supertest): API routes against a test database. Some.
- **E2E** (Playwright): critical user journeys only — landing → contact submit, login → create project. Few. Slow.

### Observability from day one

- Structured logging (`pino`) on the API.
- Error tracking (Sentry free tier) on both web and api.
- Basic uptime check (UptimeRobot or BetterStack free).

### Exit gate per milestone

- [ ] All acceptance criteria pass.
- [ ] All tests pass in CI.
- [ ] Deployed to staging.
- [ ] Lighthouse score ≥ 90 on relevant pages.
- [ ] A11y check passes (`axe` clean).
- [ ] Changelog entry written.

---

## How the docs feed into each other

```
PRD (01) ──► User Stories (02) ──► API Spec (06)  ──► Implementation
     │                  │                  ▲
     │                  ▼                  │
     │           Data Model (05) ──────────┘
     ▼
Tech Stack (03) ──► Architecture (04) ──► ADRs
                            │
                            ▼
                     Design System (07)
                            │
                            ▼
                       Roadmap (08)
```

If you change something in an upstream doc, walk it forward. PRD changed? Re-check user stories. User stories changed? Re-check API spec.

---

## Suggested working rhythm (solo)

- **Week 1:** Phase 1 (docs). End of week: PRD, stack, architecture, data model, API spec, roadmap done.
- **Week 2:** Phase 2 (design). End of week: Figma file with all mockups + tokens.
- **Weeks 3–6:** Phase 3, one milestone per week.
- **Daily:** Commit something, even if small. Update the changelog. Push to GitHub — a healthy commit graph is part of the portfolio.

Don't try to do all three phases in parallel. The whole point is that each phase de-risks the next.

---

## What "industry standard" actually means here

Real teams use variations of this — RFCs at Stripe, Design Docs at Google, PRDs at most product companies, ADRs popularized by Michael Nygard. The shared principle is **decide in writing, then build**. You're applying the same principle scaled to one person, which has a side benefit: a recruiter cloning your repo can read these docs and immediately see how you think.
