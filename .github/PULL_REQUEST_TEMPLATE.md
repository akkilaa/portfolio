<!-- Title: <type>(<scope>): <short summary>  e.g. feat(US-2.2): filter projects by tag -->

## What

<!-- One or two sentences. What does this PR do? -->

## Why

<!-- Link to user story (e.g. US-2.2 in docs/02-USER_STORIES.md) or issue. What problem does this solve? -->

## How

<!-- Brief description of the approach. Highlight anything non-obvious. -->

## Screenshots / recordings

<!-- For UI changes. Include light + dark mode if visual. -->

## Checklist

- [ ] Branch named `feat|fix|chore|docs|refactor/<desc>`
- [ ] Title and commits follow Conventional Commits
- [ ] Tests added/updated for the user story's acceptance criteria
- [ ] `pnpm lint && pnpm typecheck && pnpm test` pass locally
- [ ] Docs updated if behavior, API, or data model changed
- [ ] `CHANGELOG.md` updated for user-facing changes
- [ ] No secrets, no console logs, no commented-out code
- [ ] A11y check (where UI changed): keyboard nav, focus, contrast, reduced-motion
- [ ] Bundle size and Lighthouse not regressed (where applicable)

## Risk

<!-- What could break? Anything reviewers should pay extra attention to? -->

## Rollout

<!-- Anything special needed at deploy time (migrations, env vars, feature flags)? -->
