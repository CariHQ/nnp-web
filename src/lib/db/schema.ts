import { sql } from 'drizzle-orm'
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

// Better Auth user schema
export const users = sqliteTable('user', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  emailVerified: integer('emailVerified', { mode: 'boolean' }).notNull().default(false),
  name: text('name').notNull(),
  image: text('image'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
})

// Better Auth session schema
export const sessions = sqliteTable('session', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: integer('expiresAt', { mode: 'timestamp' }).notNull(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
})

// Better Auth account schema (for email/password)
export const accounts = sqliteTable('account', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  expiresAt: integer('expiresAt', { mode: 'timestamp' }),
  password: text('password'),
})

export const heroImages = sqliteTable('hero_images', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  imageUrl: text('image_url').notNull(),
  caption: text('caption'),
  link: text('link'),
  order: integer('order').notNull().default(0),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
})

export const stripePayments = sqliteTable('stripe_payments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  stripePaymentId: text('stripe_payment_id').notNull().unique(),
  amount: integer('amount').notNull(),
  currency: text('currency').notNull().default('usd'),
  status: text('status').notNull(),
  customerEmail: text('customer_email'),
  customerName: text('customer_name'),
  paymentMethod: text('payment_method'),
  description: text('description'),
  metadata: text('metadata', { mode: 'json' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
})

// Page content for CMS
export const pageContent = sqliteTable('page_content', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  page: text('page').notNull(), // 'about', 'home', etc.
  section: text('section').notNull(), // 'history', 'leadership', 'mission', etc.
  title: text('title'),
  content: text('content', { mode: 'json' }), // Store as JSON for flexibility
  order: integer('order').notNull().default(0),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type HeroImage = typeof heroImages.$inferSelect
export type NewHeroImage = typeof heroImages.$inferInsert
export type StripePayment = typeof stripePayments.$inferSelect
export type NewStripePayment = typeof stripePayments.$inferInsert
export type PageContent = typeof pageContent.$inferSelect
export type NewPageContent = typeof pageContent.$inferInsert
