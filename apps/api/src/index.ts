import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import cookie from '@fastify/cookie'
import jwt from '@fastify/jwt'
import multipart from '@fastify/multipart'
import staticFiles from '@fastify/static'
import path from 'path'

import { healthRoutes } from './routes/health'
import { eventsRoutes } from './routes/events'
import { authRoutes } from './routes/auth'
import { adminRoutes } from './routes/admin'
import { uploadRoutes } from './routes/upload'
import { newsletterRoutes } from './routes/newsletter'
import { extractRoutes } from './routes/extract'

const app = Fastify({ logger: true, trustProxy: true })

const uploadsDir = process.env.UPLOADS_DIR || path.join(process.cwd(), 'uploads')
const allowedOrigins = [
  process.env.APP_URL || 'http://localhost:3000',
  'http://localhost:3000',
]

async function start() {
  await app.register(cors, {
    origin: allowedOrigins,
    credentials: true,
  })

  await app.register(cookie)

  await app.register(jwt, {
    secret: process.env.JWT_SECRET || 'changeme',
    cookie: { cookieName: 'admin_token', signed: false },
  })

  await app.register(multipart, { limits: { fileSize: 10 * 1024 * 1024 } })

  await app.register(staticFiles, {
    root: uploadsDir,
    prefix: '/uploads/',
    decorateReply: false,
  })

  // Decorate authenticate shorthand
  app.decorate('authenticate', async (req: any, reply: any) => {
    try {
      await req.jwtVerify()
    } catch {
      reply.status(401).send({ error: 'Unauthorized' })
    }
  })

  await app.register(healthRoutes)
  await app.register(eventsRoutes)
  await app.register(authRoutes)
  await app.register(adminRoutes)
  await app.register(uploadRoutes)
  await app.register(newsletterRoutes)
  await app.register(extractRoutes)

  const port = parseInt(process.env.PORT || '3001', 10)
  await app.listen({ port, host: '0.0.0.0' })
  console.log(`API running on port ${port}`)
}

start().catch((err) => {
  console.error(err)
  process.exit(1)
})

// Fastify type augmentation
declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (req: any, reply: any) => Promise<void>
  }
}
