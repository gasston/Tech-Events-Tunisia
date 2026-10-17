import type { FastifyInstance } from 'fastify'
import { db } from '../db'
import { sql } from 'drizzle-orm'

export async function healthRoutes(app: FastifyInstance) {
  app.get('/health', async (_, reply) => {
    try {
      await db.execute(sql`SELECT 1`)
      return reply.send({ status: 'ok', db: 'ok' })
    } catch {
      return reply.status(503).send({ status: 'error', db: 'unreachable' })
    }
  })
}
