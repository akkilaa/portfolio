# AT Protocol Readiness — Brainstorm

**Status:** Parking lot / future work — **not** part of v1 scope.
**Created:** 2026-04-28

This doc captures the AT Protocol thinking from early planning. It exists so the seams we leave in v1 (nullable columns, reserved routes, strategy-shaped auth) are remembered later, and so when v2 picks atproto up, the homework is already done.

If you're reading this cold: AT Protocol is the federated/decentralized protocol behind Bluesky and the broader "ATmosphere" ecosystem. It is identity-first — every account is a DID (`did:plc:...` or `did:web:...`) with a human-readable handle that can be a domain. Records are signed, content-addressed JSON, defined by **Lexicons** (typed schemas) and addressed via AT URIs (`at://akkila.dev/<collection>/<rkey>`).

---

## Why this is unusually relevant for this portfolio

Two early decisions accidentally stack the deck:

- **`akkila.dev` is owned.** Atproto handles can *be* a domain via a `.well-known/atproto-did` file. Your portfolio domain, your bsky handle, and your atproto identity become one thing.
- **Markdown for content.** Portable across Lexicons (e.g. `com.whtwnd.blog.entry`) without rewriting.

Add a few cheap structural decisions in v1 and a future "I publish to my own PDS, my site is just a UI on top of records" pivot is straightforward instead of a rewrite.

---

## Cheap things to do **now** (no v1 scope creep)

These are the seams. Do them during M2 (foundations) and you pay nothing later.

### 1. Reserve the handle (~30 min)

Create a Bluesky account, set the handle to `akkila.dev` by serving `/.well-known/atproto-did` (a single text file containing `did:plc:...`).

Effect: your bsky handle, your domain, and your atproto identity are unified from day one. Add `did:plc:...` to the `sameAs` array of your `Person` JSON-LD — both search engines and atproto clients win.

### 2. Add nullable columns to the data model

In `posts` and `projects`:

```sql
ALTER TABLE posts ADD COLUMN at_uri TEXT NULL;
ALTER TABLE posts ADD COLUMN cid TEXT NULL;

ALTER TABLE projects ADD COLUMN at_uri TEXT NULL;
ALTER TABLE projects ADD COLUMN cid TEXT NULL;
```

Cost today: zero. They sit empty until/unless you publish a record to a PDS later. Adding these *after* live data exists is a real migration with backfill considerations — much more annoying.

> Update `docs/05-DATA_MODEL.md` to include these columns when this section is acted on.

### 3. Design content fields to be Lexicon-portable

Avoid free-form `meta JSONB` for things that have obvious atproto analogues. Prefer:

- `cover_image` (single URL) — maps cleanly to `app.bsky.embed.images` or a custom field.
- `excerpt` (string) — maps to summary fields.
- Discrete columns over a `details JSONB` blob.

When the eventual mapping to `com.whtwnd.blog.entry` (or `dev.akkila.project`) happens, it's mechanical, not archaeological.

### 4. Make recommendation auth a **strategy**, not hardcoded checks

Today: GitHub OAuth + LinkedIn. Define a small interface so adding atproto sign-in later is a new strategy file, not a refactor:

```ts
// packages/shared/src/identity.ts
export type IdentityKind = "github" | "linkedin" | "atproto";

export interface VerifiedIdentity {
  kind: IdentityKind;
  externalId: string;       // did:plc:..., gh user id, li urn
  displayName: string;
  avatarUrl?: string;
  profileUrl: string;       // public link visitors can click to verify
  verifiedAt: Date;
}

export interface IdentityProvider {
  kind: IdentityKind;
  beginAuth(req: Request, res: Response): Promise<void>;
  completeAuth(req: Request): Promise<VerifiedIdentity>;
}
```

The `recommendations` table just stores a `VerifiedIdentity` record alongside the recommendation text. All three NFRs (moderation, rate limit, abuse control) apply uniformly across providers.

### 5. Reserve atproto routes in the Next.js tree

Stub these as 501 / empty handlers so they appear in routing diagrams and can't be claimed by another feature:

- `/.well-known/atproto-did` — actually populate this in step 1.
- `/at` — placeholder for a future "view this site through atproto" page.
- `/oauth/atproto/callback` — placeholder for atproto OAuth.
- `/api/v1/atproto/*` — namespace reserved on the API for future endpoints.

### 6. Write a short ADR

`docs/adr/0002-atproto-readiness.md` titled "Shape v1 to be atproto-adoptable without committing to v1 scope." Status: Accepted. Decision: implement the seams above (1–5). Consequences: small upfront work, large later optionality. This is what future-you needs in order to remember why those nullable columns exist.

---

## Implementation tiers (what "doing it" actually looks like)

In ascending ambition. Nothing here is v1 — these are options for v2 / v3.

### Tier 1 — Cross-post (a weekend)
- On every blog publish, also write a thread to Bluesky linking back. Or write a `com.whtwnd.blog.entry` record (Whitewind) so the post lives in atproto natively.
- Embed the resulting Bluesky reply thread on the blog page as your **comment system**. Free moderation tools, social distribution, zero new infra.
- Display your bsky handle prominently on the site.

### Tier 2 — Records-first content (a sprint)
- Treat blog posts as atproto records *first*, your DB as a cache.
- The "Publish" admin action writes a record to your PDS (Bluesky's, initially); your site reads from your repo via the firehose / `com.atproto.repo.getRecord`.
- Your portfolio is now genuinely federated — anyone running an atproto reader sees your stuff.
- Comments via Bluesky thread continue to work.

### Tier 3 — Custom Lexicons + self-hosted PDS (a real project)
- Define your own Lexicons:
  - `dev.akkila.project` for portfolio entries.
  - `dev.akkila.recommendation` for recommender records.
- Recommenders sign records with their DID; GitHub/LinkedIn become optional verification, not the trust anchor. Self-host a PDS so your repo isn't on Bluesky's infrastructure.
- The portfolio is now itself a small atproto application — strong piece to point to in interviews.

### Adjacent direction
- Identity-first auth across the whole admin: log in via atproto OAuth instead of (or alongside) email + password.
- Aggregator: a public "ATmosphere activity" page on `/at` showing your posts, likes, follows.

---

## Useful prior art (study, don't NIH)

- **Bluesky / atproto docs** — `https://atproto.com/`, `https://docs.bsky.app/`. Lexicon spec, repo format, identity (DID/PLC).
- **Whitewind** — `https://whtwnd.com` — Lexicon-based blogging on atproto. Borrow the schema rather than invent your own for posts.
- **Smoke Signal** — `https://smokesignal.events` — events as atproto records; nice example of a custom Lexicon and a polished UI.
- **Statusphere** — Bluesky's own tutorial app for atproto-on-Next.js patterns. Start here when actually building Tier 2/3.
- **Frontpage / Linkat / Bookhive** — community apps showing how single-purpose Lexicons feel.

---

## Open questions (decide later, not now)

- Use Bluesky's PDS for the first iteration, or self-host a PDS from day one of Tier 2?
- Define `dev.akkila.project` and `dev.akkila.recommendation` Lexicons myself, or wait for a community standard?
- Migrate the recommendation feature to atproto-only when v2 lands, or keep GitHub + LinkedIn permanently as alternative identity providers?
- Treat blog posts as `com.whtwnd.blog.entry` for compatibility, or my own `dev.akkila.post`?
- Use atproto OAuth for `/admin` login, or keep magic-link as primary?
- Comments — Bluesky thread embed, or a separate Lexicon (`dev.akkila.comment`)?

---

## How to use this doc

1. When v1 ships and you're picking the next milestone, re-read sections **Cheap things to do now** and **Tier 1**.
2. If you didn't act on the M2 seams, do them in order — they're the gating step for everything else.
3. Promote items from the **Open questions** list into ADRs as decisions are made.
4. When a tier is implemented, move it out of this doc into `04-ARCHITECTURE.md` and `06-API_SPEC.md` proper.
