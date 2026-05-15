# 02 — User Stories & Acceptance Criteria

Each story follows the form **As a [persona], I want [capability], so that [benefit]**, with explicit acceptance criteria written in Given/When/Then. Acceptance criteria are what the test suite will verify.

Stories are grouped by epic from the PRD. IDs (`US-x.y`) are stable so they can be referenced from commits and PRs.

---

## Epic E1 — Public landing & about

### US-1.1 — Hero immediately communicates who I am
**As a** recruiter
**I want to** know within 5 seconds who this person is and what they do
**So that** I can decide if it's worth scrolling further.

**Acceptance criteria**
- Given I land on `/`
- When the page renders above the fold
- Then I see: my name, a one-line role statement, a short intro paragraph, and a primary CTA (Contact / Email).
- And the page reaches LCP in under 2.0s on simulated 4G.

### US-1.2 — LLM Chat
**As a** visitor
**I want to** write or choose a question in LLM Chat
**So that** I can get exact information without going through all portfolio and understand that developer is capable of implementing LLM Chat.

**Acceptance criteria**
- Given there is LLM chat
- When I view the landing page
- Then I see exactly input to ask a question or I can have prepopulated questions
- And LLM form needs to answer in reasonable time with corresponding answer.

### US-1.3 — Featured projects on landing
**As a** visitor
**I want to** see 3 featured projects without leaving the landing page
**So that** I get a quick sense of skill range.

**Acceptance criteria**
- Given there are ≥ 3 published projects flagged `featured = true`
- When I view the landing page
- Then I see exactly 3 featured project cards with title, one-line description, and tech tags.
- And each card links to `/projects/[slug]`.

### US-1.4 — About page
**As a** visitor
**I want** a longer-form about page
**So that** I can read background and motivation.

**Acceptance criteria**
- Given I navigate to `/about`
- Then I see a long-form bio, a photo, and links to GitHub, LinkedIn, and email.

---

## Epic E2 — Project showcase

### US-2.1 — Browse all projects
**As a** visitor
**I want to** see every project in one place
**So that** I can browse by interest.

**Acceptance criteria**
- Given there are N published projects
- When I navigate to `/projects`
- Then I see N project cards, sorted by `displayOrder` then `createdAt` desc.
- And only `published = true` projects are shown.

### US-2.2 — Filter projects by tag
**As a** visitor with a stack preference
**I want to** filter to e.g. only React projects
**So that** I find relevant work fast.

**Acceptance criteria**
- Given the projects page is loaded
- When I click a tag chip (e.g. `React`)
- Then the URL becomes `/projects?tag=react`
- And only projects containing that tag are visible.
- And the filter is shareable (works on direct visit).

### US-2.3 — Project detail page
**As a** visitor interested in a project
**I want** a detail page with rich content
**So that** I can evaluate it deeply.

**Acceptance criteria**
- Given I click a project card
- When the detail page loads
- Then I see: title, role, dates, tech tags, description (markdown), live demo link, repo link, and an image gallery (if any).
- And the page has correct OG tags for sharing.

---

## Epic E3 — Blog

### US-3.1 — Browse blog posts
**As a** visitor
**I want to** see a list of posts with date and excerpt
**So that** I can pick what to read.

**Acceptance criteria**
- Given I navigate to `/blog`
- Then I see published posts in reverse-chronological order with title, date, excerpt, and read-time.
- Drafts (`published = false`) never appear.

### US-3.2 — Read a blog post
**As a** reader
**I want** a clean reading experience with code blocks
**So that** I can read technical content comfortably.

**Acceptance criteria**
- Given I open a post
- Then markdown/MDX renders to semantic HTML (h2/h3 hierarchy, lists, blockquotes, tables).
- And code blocks have syntax highlighting and a copy button.
- And the page shows reading time, publish date, and tags.
- And there is a table of contents that highlights the current section while scrolling.

### US-3.3 — RSS feed
**As a** subscriber
**I want** an RSS feed
**So that** I can follow updates in my reader.

**Acceptance criteria**
- Given I request `/rss.xml`
- Then I get a valid RSS 2.0 feed of the latest 20 published posts.

---

## Epic E4 — Contact

### US-4.1 — Submit contact form
**As a** visitor with hiring intent
**I want to** message me without leaving the site
**So that** there is no friction to reach out.

**Acceptance criteria**
- Given I'm on `/contact`
- When I fill name (required), email (required, valid), message (required, 10–2000 chars) and submit
- Then the form posts to `/api/contact`
- And I see a success state without a full page reload.
- And the message is persisted to the `contact_submissions` table.
- And the admin email receives a notification within 1 minute.

### US-4.2 — Form is bot-protected
**As** site owner
**I want** spam protection on the contact form
**So that** my inbox stays clean.

**Acceptance criteria**
- Submissions failing a hCaptcha (or honeypot) check are rejected with HTTP 400.
- Same IP submitting > 3 times in 10 minutes is rate-limited (HTTP 429).

### US-4.3 — Form errors are accessible
**As a** keyboard / screen-reader user
**I want** validation errors I can perceive
**So that** I can correct them.

**Acceptance criteria**
- Inline field errors are linked to inputs via `aria-describedby`.
- Errors are announced via `aria-live="polite"` region.
- Focus moves to the first invalid field on submit.

---

## Epic E5 — Recommendations

### US-5.1 — Review recommendations
**As a** visitor with hiring intent
**I want to** see recommendations from other developers or non-technical persons
**So that** I be more confident to contact the developer.

**Acceptance criteria**
- Given I'm on `/recommendations`
- Can scroll through recommendations
- Can click and open in new tab their linkedin or github profile.
- All recommendations are from authenticated users via linkedin or github
- They're reviewd and published through Admin panel.

---


## Epic E6 — Admin auth

### US-6.1 — Log in
**As** site owner
**I want to** log in to manage content
**So that** I don't need to redeploy to publish.

**Acceptance criteria**
- Given I navigate to `/admin/login`
- When I submit valid email
- Then an email with login link is sent to the email's inbox
- Then a link is clicked, and redirected to the website
- Then a JWT cookie (`HttpOnly`, `Secure`, `SameSite=Lax`) is set, lifetime 7 days.
- And I'm redirected to `/admin`.
- Invalid email return a generic error (no enumeration).
- After 5 failed attempts within 15 min, login is locked for that account for 30 min.

### US-6.2 — Auth gates `/admin/*`
- Given I'm not authenticated
- When I request any `/admin/*` route
- Then I'm redirected to `/admin/login`.

### US-6.3 — Log out
- Logout clears the auth cookie (maybe calls logout endpoint so we remove JWT on server?) and redirects to `/`.

---

## Epic E7 — Admin CRUD

### US-7.1 — Create a project
- Given I'm on `/admin/projects/new`
- When I fill required fields (title, slug, description) and submit
- Then a project is created with `published = false`.
- And I'm redirected to `/admin/projects/:id/edit`.

### US-7.2 — Edit a project
- All fields editable. Slug is unique; collisions return a friendly error.

### US-7.3 — Publish / unpublish a project
- Toggling `published` immediately changes visibility on the public site (no redeploy).

### US-7.4 — Delete a project
- Confirmation modal required. Soft delete preferred (`deletedAt` timestamp).

### US-7.5 — Create / edit a post
- Markdown editor with split live preview.
- Front-matter fields: title, slug, excerpt, tags, coverImage, publishedAt.

### US-7.6 — Upload an image
- Given I drag an image into the editor
- Then it uploads to object storage and inserts the URL into markdown.
- Max 5MB. Allowed types: `jpg|jpeg|png|webp|gif`.

### US-7.7 — Review and publish recommendation
- Given I should have list of pending recommendations
- Then I can publish them and they will be publicly visible.

---

## Epic E8 — Site polish

### US-8.1 — Light/dark mode
- Theme toggle in header. Choice persisted in `localStorage`.
- System preference respected on first visit.
- No flash of incorrect theme on page load.

### US-8.2 — Responsive layout
- All pages usable from 360px width up.
- Hero, project grid, and blog post layouts have explicit mobile mockups.

### US-8.3 — Reduced motion
- Animations disabled when `prefers-reduced-motion: reduce`.

### US-8.4 — Loading & error states
- Every async UI shows a skeleton/spinner.
- API errors render a recoverable error UI (not a white screen).

---

## Traceability

When you implement a story, reference its ID in the commit and PR title:

```
feat(US-2.2): filter projects by tag
```

This makes the path from PRD → user story → commit → deploy traceable end to end.
