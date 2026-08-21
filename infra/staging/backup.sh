#!/usr/bin/env sh
set -eu
: "${DATABASE_URL:?DATABASE_URL is required}"
mkdir -p backups
stamp="$(date -u +%Y%m%dT%H%M%SZ)"
pg_dump --format=custom --no-owner --dbname="${DATABASE_URL}" --file="backups/javaquets-${stamp}.dump"
echo "Backup created: backups/javaquets-${stamp}.dump"
