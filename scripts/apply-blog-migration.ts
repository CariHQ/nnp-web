import { createClient } from '@libsql/client'
import { readFileSync } from 'fs'
import { join } from 'path'

async function applyBlogMigration() {
  if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_DATABASE_URL.startsWith('libsql://')) {
    console.error('❌ TURSO_DATABASE_URL must be set and start with libsql://')
    process.exit(1)
  }

  if (!process.env.TURSO_AUTH_TOKEN) {
    console.error('❌ TURSO_AUTH_TOKEN must be set')
    process.exit(1)
  }

  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  })

  try {
    console.log('🔄 Applying blog migration...\n')
    
    const sql = readFileSync(join(process.cwd(), 'drizzle/0002_flat_magdalene.sql'), 'utf-8')
    const statements = sql
      .split('--> statement-breakpoint')
      .map(s => s.trim())
      .filter(s => s && s.length > 10 && !s.startsWith('--'))
    
    for (const statement of statements) {
      try {
        await client.execute(statement)
        console.log(`✅ Applied: ${statement.substring(0, 60)}...`)
      } catch (err: any) {
        if (err.message?.includes('already exists') || err.message?.includes('duplicate')) {
          console.log(`⚠️  Already exists: ${statement.substring(0, 40)}...`)
        } else {
          console.log(`❌ Error: ${err.message}`)
        }
      }
    }
    
    console.log('\n✅ Blog migration completed!')
    process.exit(0)
  } catch (error: any) {
    console.error('\n❌ Error:', error.message)
    process.exit(1)
  }
}

applyBlogMigration()

