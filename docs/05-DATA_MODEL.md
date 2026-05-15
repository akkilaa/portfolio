# 05 — Data Model

The persistent shape of the system. Every entity, field, and relationship.

The source of truth is `packages/db/prisma/schema.prisma`. This doc is the human-readable narrative — they must stay in sync.

---

## 1. ER diagram

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│   User       │       │   Project    │       │     Post     │
│  (admin only)│       │              │       │              │
│  id          │       │  id          │       │  id          │
│  email       │       │  slug        │       │  slug        │
│  password    │       │  title       │       │  title       │
│  role        │       │  description │       │  excerpt     │
│  failedTries │       │  role        │       │  contentMd   │
│  lockedUntil │       │  startedAt   │       │  coverImage  │
│  createdAt   │       │  endedAt     │       │  publishedAt │
│  updatedAt   │       │  liveUrl     │       │  createdAt   │
└──────────────┘       │  repoUrl     │       │  updatedAt   │
                       │  featured    │       │  authorId ───┼──┐
                       │  published   │       └──────┬───────┘  │
                       │  displayOrder│              │          │
                       │  createdAt   │              │          │
                       │  updatedAt   │              │          │
                       │  deletedAt   │              │          │
                       └──────┬───────┘              │          │
                              │                      │          │
                              │ M:N                  │ M:N      │
                              ▼                      ▼          │
                       ┌──────────────┐       ┌──────────────┐  │
                       │ ProjectTag   │       │   PostTag    │  │
                       │ projectId    │       │  postId      │  │
                       │ tagId        │       │  tagId       │  │
                       └──────┬───────┘       └──────┬───────┘  │
                              └─────────┬────────────┘          │
                                        ▼                       │
                                 ┌──────────────┐               │
                                 │     Tag      │               │
                                 │  id          │               │
                                 │  slug (uniq) │               │
                                 │  label       │               │
                                 │  color       │               │
                                 └──────────────┘               │
                                                                │
                       ┌──────────────────────────┐             │
                       │   ProjectImage           │             │
                       │  id                      │             │
                       │  projectId  ─────────────┼─► Project   │
                       │  url                     │             │
                       │  alt                     │             │
                       │  width / height          │             │
                       │  displayOrder            │             │
                       └──────────────────────────┘             │
                                                                │
                       ┌──────────────────────────┐             │
                       │   ContactSubmission      │             │
                       │  id                      │             │
                       │  name                    │             │
                       │  email                   │             │
                       │  message                 │             │
                       │  ip / userAgent          │             │
                       │  createdAt               │             │
                       └──────────────────────────┘             │
                                                                │
                       ┌──────────────────────────┐             │
                       │   AuditLog               │             │
                       │  id                      │             │
                       │  actorId  ───────────────┼─────────────┘
                       │  action  (enum)          │
                       │  entityType / entityId   │
                       │  metadata (jsonb)        │
                       │  createdAt               │
                       └──────────────────────────┘

┌──────────────────────────┐       ┌──────────────────────────┐
│  RecommendationAuthor    │       │      Recommendation      │
│  id                      │◄──────┤  id                      │
│  provider                │  1:1  │  authorId (uniq)         │
│  providerId              │       │  comment                 │
│  displayName             │       │  status (enum)           │
│  username                │       │  createdAt               │
│  avatarUrl               │       │  updatedAt               │
│  profileUrl              │       └──────────────────────────┘
│  createdAt               │
│  updatedAt               │
└──────────────────────────┘

┌──────────────────────────┐
│      LlmChatLog          │
│  id                      │
│  sessionId               │
│  prompt                  │
│  responseText            │
│  durationMs              │
│  model                   │
│  ip                      │
│  createdAt               │
└──────────────────────────┘
```

---

## 2. Tables

### `users`
The admin user(s). At launch there is exactly one row.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | uuid | PK | `gen_random_uuid()` |
| email | citext | unique, not null | case-insensitive |
| password_hash | text | not null | bcrypt, cost ≥ 12 |
| role | enum (`admin`) | not null, default `admin` | future: extend |
| failed_attempts | int | not null, default 0 | reset on successful login |
| locked_until | timestamptz | nullable | login locked while `now() < locked_until` |
| created_at | timestamptz | not null, default `now()` | |
| updated_at | timestamptz | not null, default `now()` | trigger or Prisma `@updatedAt` |

Indexes: `email` unique.

### `projects`

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | uuid | PK | |
| slug | text | unique, not null | URL fragment |
| title | text | not null | |
| description_md | text | not null | markdown |
| short_description | text | not null | for cards, ≤ 160 chars |
| role | text | nullable | "Solo developer," "Frontend lead," etc. |
| started_at | date | nullable | |
| ended_at | date | nullable | null = ongoing |
| live_url | text | nullable | |
| repo_url | text | nullable | |
| featured | bool | not null, default false | landing page picks `featured = true` |
| published | bool | not null, default false | |
| display_order | int | not null, default 0 | lower = earlier |
| created_at | timestamptz | not null | |
| updated_at | timestamptz | not null | |
| deleted_at | timestamptz | nullable | soft delete |

Indexes: `slug` unique; `(published, display_order)` for listings; partial index `WHERE deleted_at IS NULL` if soft deletes get heavy.

### `posts`

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | uuid | PK | |
| slug | text | unique, not null | |
| title | text | not null | |
| excerpt | text | not null | ≤ 240 chars |
| content_md | text | not null | MDX |
| cover_image | text | nullable | R2 URL |
| reading_minutes | int | not null, default 1 | computed on save |
| published_at | timestamptz | nullable | null = draft |
| author_id | uuid | FK → users.id | |
| created_at | timestamptz | not null | |
| updated_at | timestamptz | not null | |
| deleted_at | timestamptz | nullable | |

Indexes: `slug` unique; `published_at desc` for listings; `tsvector` GIN index on `title || excerpt || content_md` for search.

### `tags`

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | uuid | PK | |
| slug | text | unique, not null | URL-safe |
| label | text | not null | display label |
| color | text | nullable | optional hex for chip styling |

### `project_tags` (join)

| Column | Type | Constraints |
|---|---|---|
| project_id | uuid | FK → projects.id, on delete cascade |
| tag_id | uuid | FK → tags.id, on delete restrict |
| (project_id, tag_id) | PK | composite |

### `post_tags` (join)
Same shape, swap `project_id` for `post_id`.

### `project_images`

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | uuid | PK | |
| project_id | uuid | FK → projects.id, cascade | |
| url | text | not null | R2 URL |
| alt | text | not null | a11y required |
| width | int | not null | for `next/image` |
| height | int | not null | |
| display_order | int | not null, default 0 | |

### `contact_submissions`

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | uuid | PK | |
| name | text | not null | |
| email | citext | not null | validated, not unique |
| message | text | not null | 10–2000 chars |
| ip | inet | nullable | for abuse review |
| user_agent | text | nullable | |
| created_at | timestamptz | not null | |

Retention: `created_at < now() - interval '12 months'` rows are deleted by a scheduled job (see roadmap).

### `audit_log`

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | uuid | PK | |
| actor_id | uuid | FK → users.id, nullable | nullable for unauth events |
| action | text | not null | e.g. `project.publish` |
| entity_type | text | not null | `project`, `post`, `auth` |
| entity_id | text | nullable | |
| metadata | jsonb | nullable | additional context |
| created_at | timestamptz | not null | |

### `recommendation_authors`

OAuth-verified identities of people who left a recommendation. Kept separate from `users` — these are public visitors, not admins; they have no password, role, or lockout fields.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | uuid | PK | |
| provider | text | not null | `"github"` or `"linkedin"` |
| provider_id | text | not null | stable ID issued by the OAuth provider |
| display_name | text | not null | full name shown on the recommendation card |
| username | text | nullable | GitHub handle or LinkedIn slug |
| avatar_url | text | nullable | profile picture URL from provider |
| profile_url | text | not null | link to their public GitHub / LinkedIn profile |
| created_at | timestamptz | not null | |
| updated_at | timestamptz | not null | refreshed on re-login |

Indexes: `UNIQUE(provider, provider_id)` — deduplication key; same person re-authenticating resolves to the same row.

### `recommendations`

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | uuid | PK | |
| author_id | uuid | FK → recommendation_authors.id, unique | unique = one recommendation per person |
| comment | text | not null | 10–1000 chars |
| status | enum | not null, default `pending` | `pending` \| `approved` \| `rejected` |
| created_at | timestamptz | not null | |
| updated_at | timestamptz | not null | |

Indexes: `author_id` unique; `(status, created_at desc)` for admin listing.

### `llm_chat_logs`

Every prompt sent to the LLM chat and its full response. Used for quality auditing, abuse detection, and latency monitoring.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | uuid | PK | |
| session_id | uuid | not null | client-generated per page visit; groups a conversation |
| prompt | text | not null | raw user input |
| response_text | text | nullable | full LLM response; null if request failed |
| duration_ms | int | nullable | time from prompt received to full response sent |
| model | text | not null | e.g. `"llama-3.2-3b"` — survives model swaps |
| ip | inet | nullable | for rate limiting and abuse review |
| created_at | timestamptz | not null | |

Indexes: `session_id` for conversation grouping; `created_at desc` for admin log view; `ip` for abuse queries.

Retention: consider purging rows older than 6 months — prompts can contain personal info.

---

## 3. Conventions

- **IDs:** UUID v7 (sortable) when supported; otherwise UUID v4.
- **Timestamps:** always `timestamptz`. Application logic uses UTC; presentation layer formats locally.
- **Soft deletes:** `deleted_at` columns. Queries use a Prisma middleware that filters them out by default; `withDeleted: true` opts in.
- **Slugs:** lowercase kebab-case, `^[a-z0-9-]+$`, generated from the title at create-time, editable.
- **Casing in DB:** `snake_case` columns, `camelCase` in TypeScript via Prisma's `@map`.

---

## 4. Migrations workflow

```
# create
pnpm prisma migrate dev --name add_audit_log

# apply in CI/prod
pnpm prisma migrate deploy
```

- Every PR that changes the schema must include the generated migration SQL.
- Migrations are append-only — never edit a migration after it's merged.

---

## 5. Seed data

`packages/db/prisma/seed.ts` creates:
- One admin user from env (`SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`).
- A handful of tags: `react`, `typescript`, `node`, `postgres`, `nextjs`, `tailwind`.
- One example project + one example post for visual checking.

Seed runs in dev only (`NODE_ENV !== "production"` guard).
