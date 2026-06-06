FROM node:22-alpine AS base
RUN corepack enable

# ---- Prune monorepo to only API-relevant packages ----
FROM base AS pruner
WORKDIR /app
RUN npm install -g turbo@2
COPY . .
RUN turbo prune @portfolio/api --docker

# ---- Install deps + generate Prisma client ----
FROM base AS runner
WORKDIR /app

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

COPY --from=pruner /app/out/full/ .
COPY --from=pruner /app/tsconfig.base.json .
RUN pnpm --filter @portfolio/db run db:generate

run pnpm --filter @portfolio/api type-check

RUN pnpm turbo build

EXPOSE 3001

ENV NODE_ENV=production
CMD ["node", "apps/api/dist/server.js"]
