FROM node:20-bookworm-slim AS build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.0.0 --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/runner-worker/package.json apps/runner-worker/package.json
RUN pnpm install --frozen-lockfile
COPY apps/runner-worker apps/runner-worker
RUN pnpm --filter @javaquets/runner-worker build

FROM node:20-bookworm-slim
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends docker.io ca-certificates && rm -rf /var/lib/apt/lists/*
COPY --from=build /app/apps/runner-worker/dist ./dist
EXPOSE 4100
CMD ["node", "dist/server.js"]
