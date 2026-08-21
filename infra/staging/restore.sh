#!/usr/bin/env sh
set -eu
: "${DATABASE_URL:?DATABASE_URL is required}"
: "${1:?Pass the reviewed backup file path}"
pg_restore --clean --if-exists --no-owner --exit-on-error --dbname="${DATABASE_URL}" "$1"
