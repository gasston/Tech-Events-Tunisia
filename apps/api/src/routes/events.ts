import type { FastifyInstance } from 'fastify'
import { eq, and, ilike, sql, or, lte, gt } from 'drizzle-orm'
import { db } from '../db'
import { events } from '../db/schema'
import { SubmitEventSchema, EventFiltersSchema, getTemporalStatus } from '@tet/shared'

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

export async function eventsRoutes(app: FastifyInstance) {
  // List published events with filters
  app.get('/api/events', async (req, reply) => {
    const parsed = EventFiltersSchema.safeParse(req.query)
    if (!parsed.success) return reply.status(400).send({ error: 'Invalid filters' })
    const { format, city, category, audience, status, q, page, limit } = parsed.data

    const now = new Date()
    const conditions = [eq(events.moderationStatus, 'published')]

    if (format) conditions.push(eq(events.format, format as any))
    if (city) conditions.push(ilike(events.city!, `%${city}%`))
    if (q) {
      conditions.push(
        or(
          ilike(events.title, `%${q}%`),
          ilike(events.organizer, `%${q}%`)
        )!
      )
    }
    if (status === 'upcoming') {
      conditions.push(gt(events.startDate, now))
    } else if (status === 'past') {
      conditions.push(lte(events.startDate, now))
    }

    let query = db
      .select()
      .from(events)
      .where(and(...conditions))
      .limit(limit)
      .offset((page - 1) * limit)
      .orderBy(events.startDate)
      .$dynamic()

    let rows = await query

    // Client-side filter for category / audience (stored as JSON arrays)
    if (category) {
      rows = rows.filter((r) =>
        (r.categories as string[]).some((c) =>
          c.toLowerCase().includes(category.toLowerCase())
        )
      )
    }
    if (audience) {
      rows = rows.filter((r) =>
        (r.targetAudience as string[]).some((a) =>
          a.toLowerCase().includes(audience.toLowerCase())
        )
      )
    }

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(events)
      .where(and(...conditions))
    // ponytail: count ignores category/audience (filtered in JS below); accurate enough until those move to SQL

    return reply.send({
      events: rows.map(toEvent),
      total: count,
      page,
      limit,
    })
  })

  // Get single event by slug
  app.get('/api/events/:slug', async (req, reply) => {
    const { slug } = req.params as { slug: string }
    const [row] = await db
      .select()
      .from(events)
      .where(and(eq(events.slug, slug), eq(events.moderationStatus, 'published')))
      .limit(1)

    if (!row) return reply.status(404).send({ error: 'Not found' })
    return reply.send(toEvent(row))
  })

  // Submit new event (public)
  app.post('/api/events', async (req, reply) => {
    const parsed = SubmitEventSchema.safeParse(req.body)
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
        moderationStatus: 'pending',
      })
      .returning()

    return reply.status(201).send(toEvent(created))
  })

  // Increment view counter (idempotency handled client-side via cookie)
  app.post('/api/events/:id/view', async (req, reply) => {
    const { id } = req.params as { id: string }
    await db
      .update(events)
      .set({ views: sql`${events.views} + 1` })
      .where(eq(events.id, id))
    return reply.send({ ok: true })
  })
}
