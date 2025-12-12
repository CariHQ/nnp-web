import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import * as schema from './schema'

// For Cloud Run or production with Turso URL, use Turso
// Otherwise use local SQLite for development
const useTurso = process.env.TURSO_DATABASE_URL && process.env.TURSO_DATABASE_URL.startsWith('libsql://')

const client = createClient({
  url: useTurso 
    ? process.env.TURSO_DATABASE_URL!
    : 'file:./local.db',
  authToken: useTurso && process.env.TURSO_AUTH_TOKEN 
    ? process.env.TURSO_AUTH_TOKEN 
    : undefined,
})

export const db = drizzle(client, { schema })
