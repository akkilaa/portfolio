# 06 — API Specification

REST API exposed by `apps/api`. Versioned under `/api/v1`.

This doc is human-readable. The machine-readable contract lives as Zod schemas in `packages/shared/src/schemas/` and is generated to OpenAPI on build.

---

## Conventions

- **Base URL:** `https://api.akkila.dev/v1`
- **Content type:** `application/json; charset=utf-8` (except multipart for image uploads, where supported)
- **Auth:** JWT via `HttpOnly` cookie named `pf_session` (admin endpoints only)
- **CORS:** allowlist the web origin per env
- **Rate limits:** noted per endpoint
- **Errors:** consistent shape

```jsonc
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Human-readable summary.",
    "fields": { "email": "Must be a valid email." },
  },
}
```

| HTTP status | When                              |
| ----------- | --------------------------------- |
| 200         | OK with body                      |
| 201         | Created                           |
| 204         | OK no body                        |
| 400         | Validation failed                 |
| 401         | Not authenticated                 |
| 403         | Authenticated but not allowed     |
| 404         | Not found                         |
| 409         | Conflict (e.g. duplicate slug)    |
| 429         | Rate limited                      |
| 500         | Server error (logged + GlitchTip) |

Pagination: cursor-based.

```
GET /v1/posts?limit=20&cursor=eyJpZCI6...
```

Response includes `nextCursor` (null when exhausted).

---

## Public endpoints

### `GET /v1/health`

Liveness check. Returns `{ "status": "ok", "uptime": 12345 }`.

### `GET /v1/projects`

List published projects.

Query: `?tag=<slug>&limit=20&cursor=<>`

Response 200:

```jsonc
{
  "items": [
    {
      "id": "uuid",
      "slug": "string",
      "title": "string",
      "shortDescription": "string",
      "tags": [{ "slug": "react", "label": "React", "color": "#61dafb" }],
      "coverImage": { "url": "...", "width": 1200, "height": 630, "alt": "..." } | null,
      "featured": false,
      "displayOrder": 0
    }
  ],
  "nextCursor": "string | null"
}
```

### `GET /v1/projects/:slug`

One project, including images and full description.

404 if not found or not published.

### `GET /v1/posts`

List published posts. Query: `?tag=&limit=&cursor=`.

Response 200:

```jsonc
{
  "items": [
    {
      "id": "uuid",
      "slug": "string",
      "title": "string",
      "excerpt": "string",
      "publishedAt": "ISO-8601",
      "readingMinutes": 5,
      "tags": [...],
      "coverImage": "url | null"
    }
  ],
  "nextCursor": "string | null"
}
```

### `GET /v1/posts/:slug`

Full post with `contentMd`. 404 if draft or missing.

### `GET /v1/tags`

All tags, with counts of published projects + posts.

### `GET /v1/recommendations`

List approved recommendations, newest first.

Response 200:

```jsonc
{
  "items": [
    {
      "id": "uuid",
      "comment": "string",
      "createdAt": "ISO-8601",
      "author": {
        "displayName": "string",
        "username": "string | null",
        "avatarUrl": "string | null",
        "profileUrl": "string",
        "provider": "github | linkedin",
      },
    },
  ],
}
```

No pagination — total count is small by design.

### `POST /v1/contact`

Submit a contact form.

Body:

```jsonc
{
  "name": "string (1-80)",
  "email": "valid email",
  "message": "string (10-2000)",
  "captchaToken": "string", // hCaptcha
}
```

- Rate limit: 3 per IP per 10 min.
- 400 on validation failure or captcha failure.
- 200 on success: `{ "ok": true }`.

---

## Auth endpoints

### `POST /v1/auth/login`

Body: `{ "email", "password" }`.

- 200 + `Set-Cookie: pf_session=...; HttpOnly; Secure; SameSite=Lax; Max-Age=604800`
- 401 on bad credentials (generic message — no enumeration)
- 423 if locked: `{ "error": { "code": "ACCOUNT_LOCKED", "lockedUntil": "ISO-8601" } }`
- Rate limit: 10 per IP per 15 min

### `POST /v1/auth/logout`

204. Clears `pf_session`.

### `GET /v1/auth/me`

- 200 with `{ id, email, role }` if authenticated
- 401 otherwise

---

## OAuth endpoints (recommendations)

Used only for the "leave a recommendation" flow. Issues a separate short-lived cookie (`rec_session`) — entirely independent from the admin `pf_session`.

### `GET /v1/auth/oauth/:provider`

Redirects the browser to the OAuth provider's authorization page.

- `:provider` ∈ `{ github, linkedin }`
- Stores a CSRF `state` param in a short-lived cookie before redirect

### `GET /v1/auth/oauth/:provider/callback`

OAuth callback. Exchanges the code for a token, fetches the user's profile, upserts into `recommendation_authors`, then issues a `rec_session` cookie.

- `rec_session`: `HttpOnly`, `Secure`, `SameSite=Lax`, TTL 1 hour — only needed long enough to submit
- On success: redirects to `/recommendations?auth=success`
- On failure: redirects to `/recommendations?auth=error`

### `POST /v1/recommendations`

Submit a recommendation. Requires a valid `rec_session` cookie.

Body:

```jsonc
{
  "comment": "string (10–1000)",
}
```

- 201 on success: `{ "ok": true }` — status is `pending` until admin approves
- 409 if this author already has a recommendation
- 401 if `rec_session` is missing or expired
- Rate limit: 3 attempts per IP per hour

### `POST /v1/auth/oauth/logout`

Clears `rec_session`. 204.

---

## Admin endpoints (auth required)

All under `/v1/admin/*`. Middleware verifies JWT and `role === "admin"`.

### Projects

| Method | Path                               | Notes                                                                         |
| ------ | ---------------------------------- | ----------------------------------------------------------------------------- |
| GET    | `/v1/admin/projects`               | All projects, including drafts and soft-deleted (with `?includeDeleted=true`) |
| POST   | `/v1/admin/projects`               | Create. Body validated by Zod schema. 201 + Location header.                  |
| GET    | `/v1/admin/projects/:id`           | Full project record.                                                          |
| PATCH  | `/v1/admin/projects/:id`           | Partial update.                                                               |
| DELETE | `/v1/admin/projects/:id`           | Soft delete.                                                                  |
| POST   | `/v1/admin/projects/:id/restore`   | Undo soft delete.                                                             |
| POST   | `/v1/admin/projects/:id/publish`   | Sets `published = true` and triggers revalidation.                            |
| POST   | `/v1/admin/projects/:id/unpublish` | Sets `published = false`.                                                     |

Body example for create/update:

```jsonc
{
  "slug": "string",
  "title": "string",
  "shortDescription": "string",
  "descriptionMd": "string",
  "role": "string | null",
  "startedAt": "YYYY-MM-DD | null",
  "endedAt": "YYYY-MM-DD | null",
  "liveUrl": "string | null",
  "repoUrl": "string | null",
  "featured": false,
  "displayOrder": 0,
  "tagSlugs": ["react", "typescript"],
}
```

### Posts

Same shape as projects, with `publishedAt` instead of `published`. Setting `publishedAt = now()` on publish action.

| Method | Path                            |
| ------ | ------------------------------- |
| GET    | `/v1/admin/posts`               |
| POST   | `/v1/admin/posts`               |
| GET    | `/v1/admin/posts/:id`           |
| PATCH  | `/v1/admin/posts/:id`           |
| DELETE | `/v1/admin/posts/:id`           |
| POST   | `/v1/admin/posts/:id/publish`   |
| POST   | `/v1/admin/posts/:id/unpublish` |

### Tags

| Method | Path                 |
| ------ | -------------------- |
| GET    | `/v1/admin/tags`     |
| POST   | `/v1/admin/tags`     |
| PATCH  | `/v1/admin/tags/:id` |
| DELETE | `/v1/admin/tags/:id` |

### Media

#### `POST /v1/admin/media/uploads`

Body: `{ "filename", "contentType", "byteSize" }`

Returns a pre-signed PUT URL the client uses to upload directly to R2:

```jsonc
{
  "uploadUrl": "https://...r2...?X-Amz-Signature=...",
  "publicUrl": "https://cdn.portfolio.example.com/uploads/...",
  "expiresIn": 300,
}
```

Constraints: `contentType ∈ { image/png, image/jpeg, image/webp, image/gif }`; `byteSize ≤ 5MB`.

### Contact submissions (read-only)

| Method | Path                    | Notes                        |
| ------ | ----------------------- | ---------------------------- |
| GET    | `/v1/admin/contact`     | Paginated list, newest first |
| GET    | `/v1/admin/contact/:id` | Detail                       |
| DELETE | `/v1/admin/contact/:id` | Hard delete                  |

### Recommendations

| Method | Path                                    | Notes                                                                 |
| ------ | --------------------------------------- | --------------------------------------------------------------------- |
| GET    | `/v1/admin/recommendations`             | All recommendations; filter by `?status=pending\|approved\|rejected`  |
| GET    | `/v1/admin/recommendations/:id`         | Detail with full author info                                          |
| POST   | `/v1/admin/recommendations/:id/approve` | Sets `status = approved`, triggers revalidation of `/recommendations` |
| POST   | `/v1/admin/recommendations/:id/reject`  | Sets `status = rejected`                                              |
| DELETE | `/v1/admin/recommendations/:id`         | Hard delete                                                           |

### Audit log

| Method | Path                  |
| ------ | --------------------- |
| GET    | `/v1/admin/audit-log` |

---

## Caching & revalidation

The web app caches public list/detail responses with ISR. After every admin write that affects public data, the API issues:

```
POST https://akkila.dev/api/revalidate
{
  "secret": "<env>",
  "paths": ["/projects", "/projects/my-slug", "/blog", "/blog/my-post", "/recommendations"]
}
```

The web app exposes this protected endpoint to receive the trigger.

---

## Versioning policy

- `/v1` is the current version. Breaking changes require `/v2` plus a deprecation window for `/v1`.
- Additive changes (new optional fields, new endpoints) are allowed within `/v1`.
- Document every breaking change in `CHANGELOG.md`.

---

## Definition of "done" for an endpoint

Before merging an endpoint:

- [ ] Zod schema in `packages/shared` for request and response.
- [ ] OpenAPI snippet in `apps/api/openapi.yaml` (or auto-generated).
- [ ] Integration test (Supertest) covering happy path + at least one error path.
- [ ] Auth boundary tested (where applicable).
- [ ] Rate limit verified (where applicable).
- [ ] Logged at appropriate level on entry / exit / error.
