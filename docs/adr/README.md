# Architecture Decision Records

This folder contains short documents, one per significant decision, capturing what was decided, when, why, and what alternatives were considered.

## Why ADRs

Significant choices ("why Express? why Prisma? why JWT in cookie?") get re-litigated months later when you've forgotten the context. ADRs let future-you (or a reviewer) read the original reasoning in 2 minutes instead of guessing.

## When to write one

Write an ADR if the decision:
- is hard to reverse,
- affects multiple parts of the system,
- you'd want to explain to a teammate during code review.

Don't write one for a one-line refactor or a personal style choice.

## Format

Each ADR is a markdown file: `NNNN-<short-kebab-name>.md` where `NNNN` increments. Keep it short — one screen if possible.

```markdown
# ADR-NNNN: Title

## Status
Proposed | Accepted | Deprecated | Superseded by ADR-XXXX

## Context
What is the problem? What are the forces at play?

## Decision
What did we decide?

## Consequences
What are the trade-offs and follow-ups?

## Alternatives considered
What else did we look at and why did we reject it?
```

## Index

- [ADR-0001](./0001-record-architecture-decisions.md) — Record architecture decisions

(Add new ADRs to this list as they're written.)

## Source

This pattern follows Michael Nygard's "Documenting Architecture Decisions" (2011).
