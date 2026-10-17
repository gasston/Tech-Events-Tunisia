import { z } from 'zod'

export const SubmitEventSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(5000),
  organizer: z.string().min(2).max(200),
  coverImage: z.string().optional().nullable(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional().nullable(),
  format: z.enum(['onsite', 'online', 'hybrid']),
  city: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  onlineUrl: z.string().url().optional().nullable(),
  targetAudience: z.array(z.string()).min(1),
  categories: z.array(z.string()).min(1),
  registrationUrl: z.string().url().optional().nullable(),
  websiteUrl: z.string().url().optional().nullable(),
  isFree: z.boolean(),
  price: z.number().positive().optional().nullable(),
})

export const AdminUpdateEventSchema = SubmitEventSchema.extend({
  moderationStatus: z.enum(['pending', 'published', 'rejected']).optional(),
})

export const NewsletterSchema = z.object({
  email: z.string().email(),
})

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const EventFiltersSchema = z.object({
  format: z.enum(['onsite', 'online', 'hybrid']).optional(),
  city: z.string().optional(),
  category: z.string().optional(),
  audience: z.string().optional(),
  status: z.enum(['upcoming', 'past']).optional(),
  q: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
})

export type NewsletterInput = z.infer<typeof NewsletterSchema>
export type SubmitEventInput = z.infer<typeof SubmitEventSchema>
export type AdminUpdateEventInput = z.infer<typeof AdminUpdateEventSchema>
export type LoginInput = z.infer<typeof LoginSchema>
export type EventFiltersInput = z.infer<typeof EventFiltersSchema>
