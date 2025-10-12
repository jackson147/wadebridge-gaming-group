#!/bin/sh
# exit when any command fails
set -e

# Run Prisma migrations
npm run db:migrate

exec "$@"