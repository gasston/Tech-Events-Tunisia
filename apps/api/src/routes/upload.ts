import type { FastifyInstance } from 'fastify'
import path from 'path'
import fs from 'fs/promises'
import crypto from 'crypto'

export async function uploadRoutes(app: FastifyInstance) {
  const uploadsDir = process.env.UPLOADS_DIR || path.join(process.cwd(), 'uploads')

  app.post('/api/upload', { onRequest: [app.authenticate] }, async (req, reply) => {
    const data = await req.file()
    if (!data) return reply.status(400).send({ error: 'No file' })

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowed.includes(data.mimetype)) {
      return reply.status(400).send({ error: 'File type not allowed' })
    }

    const ext = data.filename.split('.').pop() || 'jpg'
    const name = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${ext}`
    const dest = path.join(uploadsDir, name)

    await fs.mkdir(uploadsDir, { recursive: true })
    await fs.writeFile(dest, await data.toBuffer())

    return reply.send({ url: `/uploads/${name}` })
  })
}
