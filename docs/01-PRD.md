# Product Requirements Document (PRD)

**Status:** Draft v0.1
**Owner:** akkila
**Last updated:** 2026-04-28

> A PRD answers: *what* are we building, *who* is it for, *why*, and *how do we know it's done*. Not how it's built that's the job of the architecture and tech-stack docs.

---

## 1. Summary

A personal fullstack portfolio site that showcases my projects, technical writing, and contact channels, with LLM Chat which will be probably hosted locally and a private admin dashboard for managing content without redeploying. The public site optimizes for fast first impressions on recruiters and engineers; the admin side optimizes for me.

**One-liner:** "A portfolio I'm proud to send to a hiring manager, that I can update from a phone."

---

## 2. Goals & Non-Goals

### Goals
- G1. Convert visitors with hiring intent into a contact-form submission or email click.
- G2. Demonstrate fullstack capability through both content (projects shown) and craft (the site itself is the demo with open-source code).
- G3. Let me publish a project or blog post in under 5 minutes without touching code or redeploying.
- G4. Score ≥ 95 on Lighthouse Performance, A11y, Best Practices, SEO for the landing page.

### Non-goals (explicitly out of scope for v1)
- Real-time features (websockets, live chat).
- Analytics dashboards beyond what Vercel/Plausible provide for free.
- i18n / multi-language. English only at launch.
- AT Protocol - Connecting this portfolio to the bluesky decentralized social network.

---

## 3. Target users & personas

| Persona | Primary intent | Success looks like |
|---|---|---|
| **Recruiter / hiring manager** | Skim profile in 60 seconds, decide if worth a call. | Reads hero + 3 projects, clicks "Contact" or copies email. |
| **Engineer peer** | Evaluate code quality, read a blog post, browse repo. | Clicks GitHub link, reads a blog post end-to-end. |
| **Future me (admin)** | Add/edit projects and posts on the go. | Logs in on phone, publishes, signs out. |

---

## 4. User stories (high level)

Detailed list with acceptance criteria lives in [`02-USER_STORIES.md`](./02-USER_STORIES.md). Top-level epics:

- **E1. Public landing & about**: visitor lands, immediately understands who I am and what I do.
- **E2. LLM Ask about me**: visitor lands, notices LLM Chat in which he can ask something about me or use prepoulated question.
- **E3. Project showcase**: visitor browses projects, filters by stack, opens a detail (project) page.
- **E4. Blog**: visitor reads posts; posts have rich content (code blocks, images).
- **E5. Contact**: visitor submits a message; I get notified by email; submissions are stored.
- **E6. Recommendations**: visitor browses recommendations, which are real people connected via linkedin or github.
- **E7. Developer recommends**: friendly developer comes to recommendation tab, leaves a good referral about me.
- **E8. Admin auth**: I log in via email link on a private route.
- **E9. Admin CRUD**: I create/edit/delete/publish projects and posts; upload images.
- **E10. Site polish**: dark/light mode, smooth transitions, responsive, accessible.

---

## 5. Functional requirements

### Public site
- F1. Landing page with hero, short intro, featured projects, recent posts, contact CTA.
- F2. `/projects` listing with filter by tag (e.g., `react`, `typescript`).
- F3. `/projects/[slug]` detail page with description, tech, links, images.
- F4. `/recommendations` /recommendations page lists approved recommendations from verified GitHub or LinkedIn accounts; each entry shows author name, avatar, profile link, recommendation text, and submission date.
- F5. `/blog` listing with title, date, excerpt.
- F6. `/blog/[slug]` post page with markdown/MDX rendering, syntax highlighting, table of contents.
- F7. `/about` long-form intro.
- F8. `/contact` form: name, email, message; bot protection; success/error states.
- F9. `/rss.xml` feed for blog.
- F10. `/sitemap.xml` and `robots.txt`.
- F11. OpenGraph + Twitter card metadata with JSON LD on every page.

### Admin (auth-gated under `/admin`)
- F11. Login form (email + password). Lockout after 5 failed attempts.
- F12. Project list, create, edit, delete, publish/unpublish.
- F13. Post list, create, edit, delete, publish/unpublish; markdown editor with live preview.
- F14. Image upload to object storage (S3-compatible).
- F15. Logout; sessions expire after 7 days.

---

## 6. Non-functional requirements

| Category | Requirement |
|---|---|
| Performance | LCP < 2.0s on landing; TTI < 3.0s on 4G. JS bundle < 150KB gzipped on landing. |
| LLM Performance | first-token latency (TTFT) and streaming throughput, separate from page load. A target like "TTFT < 1.5s, ≥ 20 tokens/s" sets a usable bar. |
| LLM availability | If the LLM is unreachable or warming, the chat UI shows a "Chat offline — use the contact form" fallback within 3s.
| Safety | prompt-injection hardening, output filtering for hallucinated personal details, rate limit per IP/session.
| Compute budget | self-hosted, document the resource ceiling (e.g., "LLM uses ≤ X GB RAM, falls back to queue if concurrent requests > N").
| Accessibility | WCAG 2.1 AA. Keyboard navigable. Visible focus states. Reduced-motion respected. |
| SEO | Server-rendered (or SSG) HTML for all public pages. Structured data (JSON-LD) for `Person` and `BlogPosting`. |
| Security | HTTPS only. CSRF protection on form submits. Helmet headers on API. Rate limiting on `/contact` and `/admin/login`. Passwords hashed with bcrypt (cost ≥ 12). |
| Privacy | No third-party trackers. Privacy-friendly analytics (Plausible or none). Contact submissions retained 12 months. |
| Reliability | Uptime ≥ 99.5%. API responds < 300ms p95. |
| Browsers | Last 2 versions of Chrome, Firefox, Safari, Edge. iOS Safari 16+. Android Chrome 100+. |

---

## 7. Success metrics

- M1. **Landing Lighthouse**: ≥ 99 across all four categories.
- M2. **Time-to-first-message**: I can publish a new post in < 5 min from phone.
- M3. **Contact conversion**: ≥ 5% of `/contact` page visits submit the form.
- M4. **Bounce rate** (Plausible): < 60% on landing.
- M5. **Personal**: I send the link to ≥ 10 recruiters within 1 month of launch.

---

## 8. Constraints & assumptions

- **Solo build.** Time-boxed to ~6 weeks of evenings/weekends.
- **Budget:** ≤ $0 Will try to self host everything.
- **Domain:** will be `akkila.dev`, but in future will maybe buy `aleksajanjic.com`
- **Content:** at launch, ≥ 5 projects and ≥ 2 blog posts.

---

## 9. Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Scope creep (real-time chat, comments, etc.) | High | High | Strict v1 scope; "later" list documented below. |
| Spending weeks on design polish | High | Medium | Time-box design phase to 1 week; ship at "good," iterate after. |
| Admin UX nobody but me sees → over-investment | Medium | Low | Use a component library (e.g., shadcn) for admin to ship fast. |

---

## 10. "Later" list (post-v1 ideas)

Captured here to keep them out of v1 scope without losing the idea:

- Comments on blog posts (via GitHub Discussions integration or Linkedin?).
- Newsletter signup + transactional sends.
- Project case-study long-form template.
- "Now" page (à la nownownow.com).
- Add portfolio to the https://github.com/emmabostian/developer-portfolios
- Webmentions.
- View-counter / read-time signals.
- Related-posts recommendations.
- Public RSS-to-email subscribe.
- Do I run the LLM on the same VPS as the API, or a separate inference box? (Affects resource ceilings above.)
- What model? (llama-3.x, qwen, phi — pick before tech-stack doc gets updated.)
- Is "verified by GitHub" enough, or do I want a small "I personally know this person" badge separate from "OAuth-verified"?

---

## 11. Open questions

- [ ] Markdown for blog content.
- [ ] Self-host images.
- [ ] Magic-link auth.
- [ ] Single Postgres.

---

## 12. Sign-off

This PRD is "good enough" when you can answer **yes** to all of:

- [ ] I can describe the product in two sentences without looking at this doc.
- [ ] Every feature in §5 traces to a goal in §2.
- [ ] I am comfortable defending each item in §6 to a peer engineer.
- [ ] The "later" list contains every idea I had to suppress.
