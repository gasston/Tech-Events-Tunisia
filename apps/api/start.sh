#!/bin/sh
set -e
echo "Running DB migrations..."
node -e "
const { drizzle } = require('drizzle-orm/postgres-js');
const { migrate } = require('drizzle-orm/postgres-js/migrator');
const postgres = require('postgres');
const path = require('path');

const client = postgres(process.env.DATABASE_URL);
const db = drizzle(client);
migrate(db, { migrationsFolder: path.join(__dirname, 'drizzle/migrations') })
  .then(() => { console.log('Migrations done.'); return client.end(); })
  .catch(err => { console.error('Migration error:', err); process.exit(1); });
"
echo "Starting API..."
exec node dist/index.js
