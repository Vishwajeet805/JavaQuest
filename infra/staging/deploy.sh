#!/usr/bin/env sh
set -eu
: "${IMAGE_TAG:?IMAGE_TAG is required}"
previous_tag="$(sed -n 's/^IMAGE_TAG=//p' .env | head -n 1)"
cp .env ".env.rollback"
sed "s/^IMAGE_TAG=.*/IMAGE_TAG=${IMAGE_TAG}/" .env > .env.next
mv .env.next .env
docker compose pull
docker pull "${JAVA_RUNNER_IMAGE}"
if [ "${BOOTSTRAP_DATABASE:-false}" = "true" ]; then
  docker compose --profile tools run --rm migrate pnpm --filter @javaquets/database db:push
fi
docker compose --profile tools run --rm migrate
docker compose up -d --remove-orphans
if ! STAGING_URL="https://${STAGING_DOMAIN}" METRICS_TOKEN="${METRICS_TOKEN}" node smoke-staging.mjs; then
  echo "Smoke test failed; rolling back to ${previous_tag}"
  mv .env.rollback .env
  docker compose pull
  docker compose up -d --remove-orphans
  exit 1
fi
rm -f .env.rollback
