# ADR-0001: Record architecture decisions

## Status
Accepted — 2026-04-28

## Context
This project is a solo build but is structured to mirror professional engineering practices. Significant decisions accumulate over time; without a record, the rationale is lost and revisits become expensive.

## Decision
Maintain ADRs in `docs/adr/`. One file per decision, named `NNNN-kebab-title.md`. Format follows Michael Nygard's template (Status, Context, Decision, Consequences, Alternatives).

ADRs are written **at decision time**, not retrospectively. They are append-only — to overturn an ADR, write a new one with `Status: Supersedes ADR-XXXX` and update the old one's status to `Superseded by ADR-YYYY`.

## Consequences
- Pros: durable record of reasoning; faster code review; visible decision-making for any reader of the repo.
- Cons: small overhead per decision. Mitigated by keeping ADRs short.

## Alternatives considered
- **Inline comments** — too local, too easy to miss.
- **Wiki / Notion** — drifts from the code; can't be reviewed in PRs.
- **Long design docs** — overkill for most decisions.
