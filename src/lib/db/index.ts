import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import * as schema from './schema'

const isProduction = process.env.NODE_ENV === 'production'

const client = createClient({
  url: isProduction && process.env.TURSO_DATABASE_URL 
    ? process.env.TURSO_DATABASE_URL 
    : 'file:./local.db',
  authToken: isProduction && process.env.TURSO_AUTH_TOKEN 
    ? process.env.TURSO_AUTH_TOKEN 
    : undefined,
})

export const db = drizzle(client, { schema })
