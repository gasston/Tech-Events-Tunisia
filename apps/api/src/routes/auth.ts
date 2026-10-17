import type { FastifyInstance } from 'fastify'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { db } from '../db'
import { admins } from '../db/schema'
import { LoginSchema } from '@tet/shared'

export async function authRoutes(app: FastifyInstance) {
  app.post('/api/auth/login', async (req, reply) => {
    const body = LoginSchema.safeParse(req.body)
    if (!body.success) return reply.status(400).send({ error: 'Invalid input' })

    const { email, password } = body.data
    const [admin] = await db.select().from(admins).where(eq(admins.email, email)).limit(1)

    if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
      return reply.status(401).send({ error: 'Invalid credentials' })
    }

    const token = app.jwt.sign({ sub: admin.id, email: admin.email }, { expiresIn: '7d' })
    reply.setCookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    return reply.send({ ok: true })
  })

  app.post('/api/auth/logout', async (_, reply) => {
    reply.clearCookie('admin_token', { path: '/' })
    return reply.send({ ok: true })
  })

  app.get('/api/auth/me', { onRequest: [app.authenticate] }, async (req, reply) => {
    return reply.send({ user: (req as any).user })
  })
}
