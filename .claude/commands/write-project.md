# Write Project

Convert raw notes about a project into a complete, SEO-optimized `CreateProjectInput` ready to POST to `/api/v1/projects`.

**Input:** `$ARGUMENTS` — brain-dump notes about the project. Can be messy bullets, a paragraph, or a list of facts.

---

## Your job

1. Extract all signals: what it does, why it was built, your role, tech used, timeline, URLs, measurable impact.
2. Generate a complete `CreateProjectInput` JSON (all required fields, reasonable defaults for optionals).
3. Upload any images mentioned, embed their URLs in `descriptionMd`, then create and publish the project via the API.

---

## Field rules

### `slug`

- kebab-case, no stop words (a, the, an, my), max 5 words
- Descriptive: `real-time-chat-app` not `chat-project-2024`

### `title`

- Title case, concise (3–7 words)
- Lead with the product name or what it is, not "My"

### `tagline`

- One punchy sentence (≤ 120 chars) shown below the title on the project page
- Lead with the what + outcome; end with the most impressive signal (shipped, team size, scale)
- Example: `"Real-time social football-prediction app — led 3 engineers, built from scratch, shipped to App Store & Google Play"`

### `shortDescription`

- ≤ 160 characters (Google meta description cap)
- Lead with delivered value, include primary keyword, end with a hook
- Example: `"Open-source dashboard that visualises Postgres query plans as interactive flame graphs. Built with Next.js and Rust."`

### `descriptionMd`

Structure every project page with these H2 sections (skip a section only if there is genuinely nothing to say):

```
## Overview
2-4 sentences. Lead with the problem solved or value delivered. End with the measurable outcome or current status.

## The Problem
What specific gap or pain prompted this? Be concrete — "there was no good solution" is filler.

## What I Built
The solution in plain language. What does it do? How does it work at a high level?

## Tech Stack
- **Frontend**: list frameworks / libraries
- **Backend**: list frameworks / services
- **Infrastructure**: hosting, CI/CD, storage

## Key Features
- Feature one — one sentence of user-facing value
- Feature two
- Feature three

## Results & Impact
Quantify where possible: MAU, perf gains, time saved, GitHub stars, revenue. If pre-launch, state the intended outcome.
```

Embed images inline where relevant (see media section below).

### `role`

Single phrase: `"Sole developer"`, `"Frontend lead"`, `"Full-stack engineer"`, etc.

### `startedAt` / `endedAt`

Full ISO-8601 datetime strings: `"YYYY-MM-DDT00:00:00.000Z"`. Use `null` for ongoing projects (`endedAt`).

### `tagSlugs`

Infer from the tech stack and domain. Lowercase kebab-case: `nextjs`, `typescript`, `rust`, `postgres`, `open-source`, `react`, `node`, `docker`, etc. Max 8 tags.

**IMPORTANT — tags must exist before project creation.** If you include a slug for a tag that doesn't exist, Prisma will throw and the project will be soft-deleted (deletedAt set), making it invisible and blocking the slug permanently.

Before creating the project, check which tags already exist and create any missing ones:

```bash
# See what slugs exist across current projects
curl -s http://localhost:3001/v1/projects | node -e "
const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));
const tags=new Set();
d.items.forEach(p=>p.tags?.forEach(t=>tags.add(t.slug)));
console.log([...tags].sort().join('\n'));
"
```

Create missing tags via the db package script (run from `packages/db/`):

```bash
# Add to packages/db/scripts/create-thrust-tags.ts (or any temp file):
import { createPrismaClient } from '../src/index'
const prisma = createPrismaClient()
const tags = [
  { slug: 'node', label: 'Node.js', color: '#339933' },
  // ...
]
async function main() {
  for (const tag of tags) {
    const t = await prisma.tag.upsert({ where: { slug: tag.slug }, update: {}, create: tag })
    console.log('Tag:', t.slug)
  }
}
main().catch(console.error).finally(() => prisma.$disconnect())
```

```bash
# Run it from packages/db/:
DATABASE_URL="<value from .env>" pnpm exec tsx scripts/<filename>.ts
```

Only proceed to project creation once all slugs in `tagSlugs` are confirmed to exist.

### `featured` / `displayOrder`

Default `false` / `0` unless the user says this is a highlight piece.

---

## Execution workflow

Run these steps in order. Do not just output curl commands — actually execute them.

### Step 1 — Upload images (if any)

Media upload requires a JWT `accessToken` cookie. Generate one:

```bash
# Read JWT_SECRET from .env first — process.env won't have it automatically
JWT_SECRET=$(grep '^JWT_SECRET=' .env | cut -d= -f2) \
  node -e "
const jwt = require('./apps/api/node_modules/jsonwebtoken');
const token = jwt.sign({ sub: 'admin', role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
console.log(token);
"
```

Then upload each image:

```bash
curl -s -X POST http://localhost:3001/v1/media \
  -b "accessToken=<token>" \
  -F "file=@/path/to/image.png" \
  -F "alt=Description of what the image shows"
# → returns { "id": "...", "url": "http://localhost:3001/media/..." }
```

Embed returned URLs in `descriptionMd` using the correct wrapper for the image type:

**Portrait/mobile screenshots** — wrap in `screenshot-grid` (constrains to ~240px wide, side-by-side):

```md
<div class="screenshot-grid">

![Screen one caption](http://localhost:3001/media/...)

![Screen two caption](http://localhost:3001/media/...)

</div>
```

**App logo / square icon** — wrap in `app-logo` (120×120, centered):

```md
<div class="app-logo">

![App logo](http://localhost:3001/media/...)

</div>
```

**Wide/landscape images** — bare, no wrapper (full prose width, rounded, shadowed):

```md
![Caption](http://localhost:3001/media/...)
```

Place logo in **Overview**, hero screenshots in **Overview** or **What I Built**, UI screenshots in **Key Features**. Never dump bare portrait screenshots — they'll be enormous. Always use `screenshot-grid` for phone-shaped images.

### Step 2 — Create the project

No auth required:

```bash
curl -s -X POST http://localhost:3001/v1/projects \
  -H "Content-Type: application/json" \
  -d @payload.json
# → returns { "id": "...", "slug": "...", ... }
```

### Step 3 — Publish

No auth required:

```bash
curl -s -X PATCH http://localhost:3001/v1/projects/<id>/publish
# → returns the updated project with "published": true
```

---

## Output format

Output exactly one section — the JSON payload — then immediately execute steps 1–3.

```json
{
  "slug": "...",
  "title": "...",
  "tagline": "...",
  "shortDescription": "...",
  "descriptionMd": "...",
  "role": "...",
  "startedAt": "YYYY-MM-DDT00:00:00.000Z",
  "endedAt": "YYYY-MM-DDT00:00:00.000Z",
  "liveUrl": "https://...",
  "repoUrl": "https://...",
  "featured": false,
  "displayOrder": 0,
  "tagSlugs": ["..."]
}
```

---

## Media — gallery images

`images[]` on `ProjectDetailResponse` are cover/thumbnail images shown on listing cards. Add them after the project is created:

```bash
# Coming soon — attach a media asset as a project image via PATCH /v1/projects/:id
# For now, embed the primary visual in descriptionMd and note the media asset ID.
```

---

## Quality checklist (self-review before executing)

- [ ] `tagline` ≤ 120 chars, punchy, ends with the best signal
- [ ] `shortDescription` ≤ 160 chars and reads like a human wrote it
- [ ] `descriptionMd` has at least Overview + Tech Stack + one other section
- [ ] No section starts with "I" — lead with the product or the problem
- [ ] `slug` is unique-sounding and would make sense in a URL
- [ ] `tagSlugs` reflect actual tech used, not aspirational buzzwords
- [ ] Dates are full ISO datetime strings, not bare `YYYY-MM-DD`
