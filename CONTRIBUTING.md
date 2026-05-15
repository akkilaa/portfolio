# Contributing

This is a solo project, but written as if a teammate could land here tomorrow. The conventions below are followed even when the only contributor is me — that's the point.

## Quick start

```bash
pnpm install
pnpm db:migrate
pnpm dev   # runs apps/web and apps/api in parallel via Turborepo
```

Required env vars are listed in `.env.example`. Copy to `.env` and fill in.

## Branching

- `main` is always deployable to production.
- Work happens on short-lived feature branches off `main`.
- Branch names: `feat/<short-desc>`, `fix/<short-desc>`, `chore/<short-desc>`, `docs/<short-desc>`, `refactor/<short-desc>`.

## Commits

[Conventional Commits](https://www.conventionalcommits.org/). Format:

```
<type>(<scope>): <short summary>

<optional body, wrapped at 72 cols>

<optional footer: BREAKING CHANGE, refs to issue/story IDs>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.

Reference user stories from `docs/02-USER_STORIES.md` where applicable:

```
feat(US-2.2): filter projects by tag
```

`commitlint` enforces this in CI and via husky pre-commit.

## Pull requests

1. Push the branch. Open a PR against `main` using the PR template.
2. PR title also follows Conventional Commits.
3. Self-review the diff before requesting review (or before merging, solo).
4. CI must be green: lint, typecheck, test, build.
5. Squash-merge. The squash commit becomes the changelog entry.
6. Delete the branch after merge.

PRs are kept small (~400 lines diff max). If the diff outgrows that, split it.

## Code style

- TypeScript `strict: true` everywhere. No `any` without an inline justifying comment.
- ESLint + Prettier are the source of truth. Don't argue with the formatter.
- Imports ordered: builtin → external → internal aliases (`@/...`) → relative.
- One default export per file is fine, but prefer named exports for testability.
- React components are PascalCase files; everything else is kebab-case.
- API handlers live thin — push logic into `services/` and Zod schemas.

## Testing

- Unit: Vitest. Co-located with source as `*.test.ts`.
- API integration: Supertest in `apps/api/src/**/*.spec.ts`.
- E2E: Playwright in `apps/web/e2e/`.
- Acceptance criteria from user stories drive what's tested. Don't write tests for getters and setters.
- Coverage is a guide, not a target. Focus on critical paths.

Run:

```bash
pnpm test            # all unit + integration
pnpm test:e2e        # Playwright
```

## Database

- Schema source of truth: `packages/db/prisma/schema.prisma`.
- New schema = new migration. Never edit a merged migration.
- `pnpm db:migrate` (dev) or `pnpm db:migrate:deploy` (prod via CI).
- Seeds: `pnpm db:seed` runs in dev only.

## Documentation

If your change affects:
- public behavior → update `CHANGELOG.md`
- API surface → update `docs/06-API_SPEC.md`
- data model → update `docs/05-DATA_MODEL.md` and add a migration
- a non-obvious decision → add an ADR in `docs/adr/`

PRs that don't update docs they should are sent back.

## Security

- Never commit `.env` or secrets. `.env.example` lives in the repo with empty values.
- Validate every API input with Zod.
- Run `pnpm audit` before tagging a release. CI runs `pnpm audit --audit-level=high`.
- Rotate the JWT secret on any suspected leak.

## Releases

- Tag from `main`: `git tag vX.Y.Z && git push --tags`.
- `CHANGELOG.md` follows [Keep a Changelog](https://keepachangelog.com/).
- SemVer: bump major on breaking API changes; minor on additive features; patch on fixes.

## Issues

Use the templates in `.github/ISSUE_TEMPLATE/`:
- **Bug** — what happened, what was expected, repro steps.
- **Feature** — user story format, why this matters.

Label with one of: `bug`, `feature`, `chore`, `docs`, `tech-debt`, `security`.

## Code of conduct

It's a solo project. Be kind to your future self. Leave the code better than you found it.
