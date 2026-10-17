import type { FastifyInstance } from 'fastify'
import { sql } from 'drizzle-orm'
import { db } from '../db'
import { newsletterSubscribers } from '../db/schema'
import { NewsletterSchema } from '@tet/shared'

export async function newsletterRoutes(app: FastifyInstance) {
  // Public: subscribe
  app.post('/api/newsletter', async (req, reply) => {
    const parsed = NewsletterSchema.safeParse(req.body)
    if (!parsed.success) return reply.status(400).send({ error: 'Email invalide' })

    await db
      .insert(newsletterSubscribers)
      .values({ email: parsed.data.email.toLowerCase().trim() })
      .onConflictDoNothing()

    return reply.status(201).send({ ok: true })
  })

  // Admin: subscriber count (reuses JWT auth)
  app.get('/api/admin/newsletter/count', { onRequest: [app.authenticate] }, async (_, reply) => {
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(newsletterSubscribers)
    return reply.send({ count })
  })
}
