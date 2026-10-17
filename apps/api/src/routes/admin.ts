import type { FastifyInstance } from 'fastify'
import { eq, sql } from 'drizzle-orm'
import { db } from '../db'
import { events } from '../db/schema'
import { AdminUpdateEventSchema, getTemporalStatus } from '@tet/shared'

function toEvent(row: typeof events.$inferSelect) {
  return {
    ...row,
    startDate: row.startDate.toISOString(),
    endDate: row.endDate?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    temporalStatus: getTemporalStatus(
      row.startDate.toISOString(),
      row.endDate?.toISOString()
    ),
  }
}

function slugify(title: string) {
  return (
    title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim() +
    '-' +
    Date.now().toString(36)
  )
}

export async function adminRoutes(app: FastifyInstance) {
  // All admin routes require auth
  app.addHook('onRequest', app.authenticate)

  // Stats
  app.get('/api/admin/stats', async (_, reply) => {
    const [stats] = await db
      .select({
        total:     sql<number>`count(*)::int`,
        pending:   sql<number>`count(*) filter (where moderation_status = 'pending')::int`,
        published: sql<number>`count(*) filter (where moderation_status = 'published')::int`,
        rejected:  sql<number>`count(*) filter (where moderation_status = 'rejected')::int`,
      })
      .from(events)
    return reply.send(stats)
  })

  // List all events
  app.get('/api/admin/events', async (req, reply) => {
    const { status } = req.query as { status?: string }
    let query = db.select().from(events).orderBy(events.createdAt).$dynamic()
    if (status === 'pending' || status === 'published' || status === 'rejected') {
      query = query.where(eq(events.moderationStatus, status))
    }
    const rows = await query
    return reply.send(rows.map(toEvent))
  })

  // Create event directly as published
  app.post('/api/admin/events', async (req, reply) => {
    const parsed = AdminUpdateEventSchema.safeParse(req.body)
    if (!parsed.success) return reply.status(400).send({ error: parsed.error.flatten() })
    const data = parsed.data
    const [created] = await db
      .insert(events)
      .values({
        ...data,
        slug: slugify(data.title),
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        price: data.price?.toString() ?? null,
        moderationStatus: data.moderationStatus ?? 'published',
      })
      .returning()
    return reply.status(201).send(toEvent(created))
  })

  // Update event
  app.put('/api/admin/events/:id', async (req, reply) => {
    const { id } = req.params as { id: string }
    const parsed = AdminUpdateEventSchema.safeParse(req.body)
    if (!parsed.success) return reply.status(400).send({ error: parsed.error.flatten() })
    const data = parsed.data
    const [updated] = await db
      .update(events)
      .set({
        ...data,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        price: data.price?.toString() ?? null,
        updatedAt: new Date(),
      })
      .where(eq(events.id, id))
      .returning()
    if (!updated) return reply.status(404).send({ error: 'Not found' })
    return reply.send(toEvent(updated))
  })

  // Publish
  app.post('/api/admin/events/:id/publish', async (req, reply) => {
    const { id } = req.params as { id: string }
    await db.update(events).set({ moderationStatus: 'published', updatedAt: new Date() }).where(eq(events.id, id))
    return reply.send({ ok: true })
  })

  // Reject
  app.post('/api/admin/events/:id/reject', async (req, reply) => {
    const { id } = req.params as { id: string }
    await db.update(events).set({ moderationStatus: 'rejected', updatedAt: new Date() }).where(eq(events.id, id))
    return reply.send({ ok: true })
  })

  // Delete
  app.delete('/api/admin/events/:id', async (req, reply) => {
    const { id } = req.params as { id: string }
    await db.delete(events).where(eq(events.id, id))
    return reply.send({ ok: true })
  })
}
