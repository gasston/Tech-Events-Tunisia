import type { FastifyInstance } from 'fastify'
import { CATEGORIES, CITIES, AUDIENCES } from '@tet/shared'

// Provider-neutral extraction via any OpenAI-compatible Chat Completions API.
// Works with DeepSeek (https://api.deepseek.com/v1, deepseek-chat) or a local
// model on the VPS via Ollama / vLLM / LM Studio (http://host:11434/v1, e.g.
// qwen2.5 for text, llava / qwen2-vl for posters). Configure via env:
//   LLM_BASE_URL, LLM_API_KEY (optional for local), LLM_MODEL
// ponytail: plain fetch, no SDK — the endpoint is a stable, well-known JSON API.

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const

function systemPrompt() {
  const today = new Date().toISOString().slice(0, 10)
  return `Tu extrais les informations d'un événement tech en Tunisie à partir d'une affiche et/ou d'un texte.
Date du jour : ${today}. Fuseau horaire : Tunisie (UTC+01:00).

Réponds UNIQUEMENT avec un objet JSON valide (aucun texte autour), avec exactement ces clés :
{
  "title": string,
  "organizer": string,
  "description": string,              // résumé clair en français, 2 à 5 phrases
  "startDate": string|null,           // ISO 8601 +01:00, ex "2026-11-20T18:30:00+01:00"
  "endDate": string|null,
  "format": "onsite"|"online"|"hybrid",
  "city": string|null,                // une ville parmi: ${CITIES.join(', ')}
  "address": string|null,
  "categories": string[],             // parmi: ${CATEGORIES.join(', ')}
  "targetAudience": string[],         // parmi: ${AUDIENCES.join(', ')}
  "isFree": boolean,
  "price": number|null,               // en TND si payant
  "registrationUrl": string|null,
  "websiteUrl": string|null,
  "onlineUrl": string|null
}

Règles : si l'année d'une date manque, déduis l'occurrence à venir la plus proche. Mets null pour tout champ réellement absent. N'invente jamais d'URL, de lieu ni de date.`
}

function clampArray(values: unknown, allowed: readonly string[]): string[] {
  if (!Array.isArray(values)) return []
  const set = new Set(allowed.map((a) => a.toLowerCase()))
  return values
    .filter((v): v is string => typeof v === 'string')
    .map((v) => allowed.find((a) => a.toLowerCase() === v.toLowerCase()))
    .filter((v): v is string => !!v)
}

function normalize(raw: any) {
  const format = ['onsite', 'online', 'hybrid'].includes(raw?.format) ? raw.format : 'onsite'
  const city = typeof raw?.city === 'string'
    ? CITIES.find((c) => c.toLowerCase() === raw.city.toLowerCase()) ?? null
    : null
  return {
    title: typeof raw?.title === 'string' ? raw.title : '',
    organizer: typeof raw?.organizer === 'string' ? raw.organizer : '',
    description: typeof raw?.description === 'string' ? raw.description : '',
    startDate: typeof raw?.startDate === 'string' ? raw.startDate : null,
    endDate: typeof raw?.endDate === 'string' ? raw.endDate : null,
    format,
    city,
    address: typeof raw?.address === 'string' ? raw.address : null,
    categories: clampArray(raw?.categories, CATEGORIES),
    targetAudience: clampArray(raw?.targetAudience, AUDIENCES),
    isFree: raw?.isFree !== false, // default free unless explicitly false
    price: typeof raw?.price === 'number' ? raw.price : null,
    registrationUrl: typeof raw?.registrationUrl === 'string' ? raw.registrationUrl : null,
    websiteUrl: typeof raw?.websiteUrl === 'string' ? raw.websiteUrl : null,
    onlineUrl: typeof raw?.onlineUrl === 'string' ? raw.onlineUrl : null,
  }
}

// ponytail: in-memory fixed-window rate limit, per IP — bounds LLM cost/abuse on
// this public endpoint. Resets on restart; swap for Redis if you go multi-instance.
const WINDOW_MS = 60 * 60 * 1000
const MAX_PER_WINDOW = 10
const hits = new Map<string, { count: number; reset: number }>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const h = hits.get(ip)
  if (!h || now > h.reset) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS })
    return false
  }
  h.count++
  return h.count > MAX_PER_WINDOW
}

export async function extractRoutes(app: FastifyInstance) {
  // Public (used by the open /submit form) — rate-limited instead of auth-gated.
  app.post('/api/extract', async (req, reply) => {
    if (rateLimited(req.ip)) {
      return reply.status(429).send({ error: 'Trop de requêtes. Réessaie plus tard.' })
    }

    const baseUrl = process.env.LLM_BASE_URL
    const model = process.env.LLM_MODEL
    if (!baseUrl || !model) {
      return reply.status(503).send({ error: 'Extraction IA non configurée (LLM_BASE_URL / LLM_MODEL manquants)' })
    }

    let imageDataUrl: string | null = null
    let text: string | undefined

    if (req.isMultipart()) {
      for await (const part of req.parts()) {
        if (part.type === 'file') {
          if (!IMAGE_TYPES.includes(part.mimetype as any)) {
            return reply.status(400).send({ error: 'Type d’image non supporté' })
          }
          const b64 = (await part.toBuffer()).toString('base64')
          imageDataUrl = `data:${part.mimetype};base64,${b64}`
        } else if (part.fieldname === 'text') {
          text = part.value as string
        }
      }
    } else {
      text = ((req.body ?? {}) as { text?: string }).text
    }

    if (!imageDataUrl && !text?.trim()) {
      return reply.status(400).send({ error: 'Fournis une affiche ou un texte' })
    }

    // OpenAI-compatible user content: string, or parts array when an image is present.
    const userContent: any = imageDataUrl
      ? [
          ...(text?.trim() ? [{ type: 'text', text }] : [{ type: 'text', text: 'Extrais les infos de cette affiche.' }]),
          { type: 'image_url', image_url: { url: imageDataUrl } },
        ]
      : (text as string)

    try {
      const res = await fetch(`${baseUrl.replace(/\/$/, '')}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(process.env.LLM_API_KEY ? { Authorization: `Bearer ${process.env.LLM_API_KEY}` } : {}),
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt() },
            { role: 'user', content: userContent },
          ],
          temperature: 0,
          response_format: { type: 'json_object' },
          max_tokens: 1500,
        }),
        signal: AbortSignal.timeout(120_000), // CPU inference can be slow; fail cleanly, don't hang
      })

      if (!res.ok) {
        const detail = await res.text().catch(() => '')
        req.log.error({ status: res.status, detail }, 'LLM error')
        return reply.status(502).send({ error: `Erreur IA (${res.status})` })
      }

      const data: any = await res.json()
      const content: string = data?.choices?.[0]?.message?.content ?? ''

      // Models sometimes wrap JSON in prose or ```json fences — extract the object.
      const match = content.match(/\{[\s\S]*\}/)
      if (!match) return reply.status(422).send({ error: "Réponse IA illisible" })

      let raw: unknown
      try {
        raw = JSON.parse(match[0])
      } catch {
        return reply.status(422).send({ error: "JSON IA invalide" })
      }

      return reply.send(normalize(raw))
    } catch (err: any) {
      req.log.error(err)
      return reply.status(500).send({ error: 'Erreur extraction' })
    }
  })
}
