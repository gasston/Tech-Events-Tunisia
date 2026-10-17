import { pgTable, uuid, text, timestamp, boolean, integer, real, jsonb, pgEnum, numeric } from 'drizzle-orm/pg-core'

export const formatEnum = pgEnum('format', ['onsite', 'online', 'hybrid'])
export const moderationStatusEnum = pgEnum('moderation_status', ['pending', 'published', 'rejected'])

export const events = pgTable('events', {
  id:               uuid('id').primaryKey().defaultRandom(),
  slug:             text('slug').unique().notNull(),
  title:            text('title').notNull(),
  description:      text('description').notNull(),
  organizer:        text('organizer').notNull(),
  organizerLogo:    text('organizer_logo'),
  coverImage:       text('cover_image'),
  startDate:        timestamp('start_date', { withTimezone: true }).notNull(),
  endDate:          timestamp('end_date', { withTimezone: true }),
  format:           formatEnum('format').notNull(),
  city:             text('city'),
  address:          text('address'),
  latitude:         real('latitude'),
  longitude:        real('longitude'),
  onlineUrl:        text('online_url'),
  targetAudience:   jsonb('target_audience').$type<string[]>().notNull().default([]),
  categories:       jsonb('categories').$type<string[]>().notNull().default([]),
  registrationUrl:  text('registration_url'),
  websiteUrl:       text('website_url'),
  isFree:           boolean('is_free').notNull().default(true),
  price:            numeric('price', { precision: 10, scale: 2 }),
  views:            integer('views').notNull().default(0),
  moderationStatus: moderationStatusEnum('moderation_status').notNull().default('pending'),
  createdAt:        timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt:        timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const newsletterSubscribers = pgTable('newsletter_subscribers', {
  id:        uuid('id').primaryKey().defaultRandom(),
  email:     text('email').unique().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const admins = pgTable('admins', {
  id:           uuid('id').primaryKey().defaultRandom(),
  email:        text('email').unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  createdAt:    timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
