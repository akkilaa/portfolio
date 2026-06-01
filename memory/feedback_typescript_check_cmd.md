---
name: feedback_typescript_check_cmd
description: The correct command to run TypeScript type checking in this monorepo — tsc is not on PATH, must use the pnpm node_modules path directly
metadata:
  type: feedback
---

Use this exact command to run TypeScript checks in this project:

```
/Users/akkilaa/Projects/portfolio/node_modules/.pnpm/node_modules/.bin/tsc --noEmit -p <path-to-tsconfig.json>
```

Example for the API package:

```
/Users/akkilaa/Projects/portfolio/node_modules/.pnpm/node_modules/.bin/tsc --noEmit -p /Users/akkilaa/Projects/portfolio/apps/api/tsconfig.json
```

**Why:** `tsc` is not on PATH. `npx tsc` shows a "not the tsc command you are looking for" error. `pnpm exec tsc` fails with "Command not found". The binary lives at the pnpm virtual store path above.

**How to apply:** Any time a TypeScript check is needed, go straight to the full path above. Do not try `npx tsc`, `pnpm exec tsc`, `node_modules/.bin/tsc` from the root, or any other variant first.
