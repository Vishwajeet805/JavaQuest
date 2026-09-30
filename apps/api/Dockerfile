FROM node:20-bookworm-slim AS build

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@10.0.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.base.json ./

COPY apps/api/package.json apps/api/package.json
COPY packages/config/package.json packages/config/package.json
COPY packages/database/package.json packages/database/package.json
COPY packages/shared/package.json packages/shared/package.json
COPY packages/validation/package.json packages/validation/package.json

RUN pnpm install --frozen-lockfile

COPY apps/api apps/api
COPY packages packages

RUN pnpm --filter @javaquets/database db:generate \
  && pnpm --filter @javaquets/api build


FROM eclipse-temurin:21-jdk-jammy AS jdk

FROM node:20-bookworm-slim AS runtime

COPY --from=jdk /opt/java/openjdk /opt/java/openjdk
ENV JAVA_HOME=/opt/java/openjdk
ENV PATH="/opt/java/openjdk/bin:${PATH}"
ENV JAVA_RUNNER_PROVIDER=direct
ENV NODE_ENV=production

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@10.0.0 --activate

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=build /app/packages ./packages
COPY --from=build /app/apps/api/dist ./apps/api/dist

# Keeps "type": "module" available for apps/api/dist/server.js
COPY --from=build /app/apps/api/package.json ./apps/api/package.json

COPY package.json pnpm-workspace.yaml ./

USER node
# Build-time smoke check under the actual runtime user, including temp writes.
RUN java -version && javac -version \
  && workspace="$(mktemp -d)" \
  && printf '%s\n' 'class Quest {} public class Main { public static void main(String[] args) { System.out.println("jdk-ready"); } }' > "$workspace/Main.java" \
  && javac "$workspace/Main.java" \
  && java -Xmx64m -cp "$workspace" Main \
  && rm -r "$workspace"

EXPOSE 4000

CMD ["node", "apps/api/dist/server.js"]