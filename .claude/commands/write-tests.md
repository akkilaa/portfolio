# Write Tests

Write integration tests for the feature: $ARGUMENTS

Read the relevant controller, service, and port files for that feature before writing anything. Then produce the fixture file, fake repository (if it doesn't exist), and test file following the conventions below.

## Stack

- **Vitest** + **supertest** — no Jest, no other test runners
- **No mocks** — ever. Use fake in-memory repositories that implement the real port interface.
- **No `repo.method()` in tests** — all actions go through `request(app())`, including setup.

## File locations

- Tests: `apps/api/tests/<feature>.test.ts`
- Fakes: `apps/api/tests/fakes/InMemory<Entity>Repository.ts`
- Fixtures: `apps/api/tests/fixtures/<feature>.fixtures.ts`

## Fixtures

Typed as `CreateXxxInput` from `@portfolio/shared` — not full entity objects. No hardcoded IDs or dates.

```ts
import type { CreatePostInput } from '@portfolio/shared'

export const publishedPostInput: CreatePostInput = {
  slug: 'published-post',
  title: 'Published Post',
  excerpt: 'This post is live',
  contentMd: '# Published',
  authorId: 'author-1',
}
```

## Fake repository

Implements the real `IXxxRepository` port from `apps/api/src/ports/`. In-memory `Map` store, sequential string IDs (`'1'`, `'2'`, ...), `seed()` method kept but not used in tests.

## App factory

```ts
let repo: InMemoryPostRepository

beforeEach(() => {
  repo = new InMemoryPostRepository()
})

function app() {
  return composeApp({ posts: new PostsController(new PostsService(repo)) })
}
```

Each test gets a fresh repo via `beforeEach`. `app()` is called per-request — not once per test — because it wraps the shared `repo` reference.

## Setup helpers

State is built through HTTP, not repo methods. Define local async helpers at the top of the test file:

```ts
async function createDraft(input: CreatePostInput = draftPostInput) {
  const res = await request(app()).post('/v1/posts').send(input)
  return res.body
}

async function createPublished(input: CreatePostInput = publishedPostInput) {
  const draft = await createDraft(input)
  await request(app()).patch(`/v1/posts/${draft.id}/publish`)
  return draft
}

async function createDeleted(input: CreatePostInput = deletedPostInput) {
  const draft = await createDraft(input)
  await request(app()).delete(`/v1/posts/${draft.id}`)
  return draft
}
```

## Test structure

- `describe` — feature name from a product angle, readable by non-technical people. e.g. `'Publishing a post'`
- `it` — behavior described as Given/expected outcome. e.g. `'given an existing draft post, publishing it should set a publication date'`

```ts
describe('Publishing a post', () => {
  it('given an existing draft post, publishing it should set a publication date', async () => {
    const draft = await createDraft()

    const res = await request(app()).patch(`/v1/posts/${draft.id}/publish`)

    expect(res.status).toBe(200)
    expect(res.body.publishedAt).not.toBeNull()
  })
})
```

## Rules

1. Each `it` block follows Arrange / Act / Assert with a blank line between each section.
2. Assertions check HTTP status code AND response body shape.
3. Fixtures use the input type — never hand-craft full entity objects with IDs in tests.
4. Never import from `@portfolio/db` in test files.
5. `describe` names the feature. `it` names the observable behavior, not the implementation.
