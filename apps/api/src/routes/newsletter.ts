import type { FastifyInstance } from 'fastify'
import { sql, desc, eq } from 'drizzle-orm'
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

  // ─── Admin (JWT) ────────────────────────────────────────────────────────
  app.register(async (admin) => {
    admin.addHook('onRequest', app.authenticate)

    // Count
    admin.get('/api/admin/newsletter/count', async (_, reply) => {
      const [{ count }] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(newsletterSubscribers)
      return reply.send({ count })
    })

    // List all subscribers (newest first)
    admin.get('/api/admin/newsletter', async (_, reply) => {
      const rows = await db
        .select()
        .from(newsletterSubscribers)
        .orderBy(desc(newsletterSubscribers.createdAt))
      return reply.send(
        rows.map((r) => ({ id: r.id, email: r.email, createdAt: r.createdAt.toISOString() }))
      )
    })

    // Add manually
    admin.post('/api/admin/newsletter', async (req, reply) => {
      const parsed = NewsletterSchema.safeParse(req.body)
      if (!parsed.success) return reply.status(400).send({ error: 'Email invalide' })
      const [row] = await db
        .insert(newsletterSubscribers)
        .values({ email: parsed.data.email.toLowerCase().trim() })
        .onConflictDoNothing()
        .returning()
      if (!row) return reply.status(409).send({ error: 'Email déjà inscrit' })
      return reply.status(201).send({ id: row.id, email: row.email, createdAt: row.createdAt.toISOString() })
    })

    // Delete
    admin.delete('/api/admin/newsletter/:id', async (req, reply) => {
      const { id } = req.params as { id: string }
      await db.delete(newsletterSubscribers).where(eq(newsletterSubscribers.id, id))
      return reply.send({ ok: true })
    })
  })
}
