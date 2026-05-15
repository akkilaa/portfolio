# Portfolio

Personal fullstack portfolio site — a public-facing website to showcase projects, writing, and contact info, plus an admin dashboard for managing content.

**Status:** Planning phase. No code yet — see [`docs/`](./docs) for specs.

## Stack

- **Frontend:** Next.js (App Router) + TypeScript + Tailwind CSS
- **Backend:** Node.js + Express + TypeScript (REST API)
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** JWT (admin only)
- **Hosting:** Self Hosted

## Repo layout (planned)

```
portfolio/
├── apps/
│   ├── web/        # Next.js frontend
│   └── api/        # Express backend
├── packages/
│   ├── db/         # Prisma schema + migrations + client
│   ├── shared/     # Shared types, zod schemas
│   └── ui/         # Shared UI components (optional)
├── docs/           # All project documentation
└── .github/        # PR/issue templates, workflows
```

Monorepo via pnpm workspaces + Turborepo.

## Where to start

1. Read [`docs/00-PROCESS.md`](./docs/00-PROCESS.md) — the project methodology (documentation → design → implementation).
2. Then [`docs/01-PRD.md`](./docs/01-PRD.md) — what we're building and why.
3. Then [`docs/08-ROADMAP.md`](./docs/08-ROADMAP.md) — phased milestones.

## Local setup

> Will be filled in once code exists. See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the contribution workflow.

## License

MIT (placeholder).
