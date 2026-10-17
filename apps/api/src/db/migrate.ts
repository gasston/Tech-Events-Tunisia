import 'dotenv/config'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { db } from './index'
import path from 'path'

async function main() {
  console.log('Running migrations...')
  await migrate(db, { migrationsFolder: path.join(__dirname, '../../drizzle/migrations') })
  console.log('Migrations done.')
  process.exit(0)
}

main().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
