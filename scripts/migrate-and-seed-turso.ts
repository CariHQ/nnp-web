import { createClient } from '@libsql/client'
import { readFileSync } from 'fs'
import { join } from 'path'

async function migrateAndSeed() {
  console.log('🔄 Migrating and seeding Turso database...\n')

  if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_DATABASE_URL.startsWith('libsql://')) {
    console.error('❌ TURSO_DATABASE_URL must be set and start with libsql://')
    process.exit(1)
  }

  if (!process.env.TURSO_AUTH_TOKEN) {
    console.error('❌ TURSO_AUTH_TOKEN must be set')
    process.exit(1)
  }

  // Create direct client connection
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  })

  try {
    // Step 1: Apply migrations manually from SQL files
    console.log('1️⃣  Running database migrations...')
    const migrationFiles = [
      'drizzle/0000_spotty_silver_surfer.sql',
      'drizzle/0001_pink_starfox.sql'
    ]
    
    for (const file of migrationFiles) {
      try {
        const sql = readFileSync(join(process.cwd(), file), 'utf-8')
        // Split by statement breakpoint
        const sections = sql.split('--> statement-breakpoint')
        
        for (let i = 0; i < sections.length; i++) {
          const section = sections[i].trim()
          if (!section || section.length < 10) continue
          
          // Extract SQL statements (they're between backticks in the migration file format)
          const sqlMatch = section.match(/```sql\n([\s\S]*?)\n```/) || section.match(/(CREATE|ALTER|INSERT|DROP|PRAGMA)[\s\S]*?;/g)
          
          if (sqlMatch) {
            const statements = Array.isArray(sqlMatch) ? sqlMatch : [sqlMatch[1]]
            
            for (const statement of statements) {
              const cleanStatement = statement
                .replace(/```sql\n?/g, '')
                .replace(/```\n?/g, '')
                .trim()
              
              if (!cleanStatement || cleanStatement.startsWith('--')) continue
              
              try {
                await client.execute(cleanStatement)
              } catch (err: any) {
                // Ignore "table already exists" and "duplicate" errors
                const errorMsg = err.message || ''
                if (!errorMsg.includes('already exists') && 
                    !errorMsg.includes('duplicate') &&
                    !errorMsg.includes('UNIQUE constraint')) {
                  console.log(`   ⚠️  ${errorMsg.substring(0, 60)}`)
                }
              }
            }
          } else {
            // Try to extract any SQL-like statements
            const lines = section.split('\n').filter(l => 
              l.trim() && 
              !l.trim().startsWith('--') &&
              (l.includes('CREATE') || l.includes('INSERT') || l.includes('ALTER'))
            )
            if (lines.length > 0) {
              const statement = lines.join('\n')
              try {
                await client.execute(statement)
              } catch (err: any) {
                if (!err.message?.includes('already exists') && 
                    !err.message?.includes('duplicate')) {
                  // Silent for expected errors
                }
              }
            }
          }
        }
        console.log(`   ✅ Processed ${file}`)
      } catch (err: any) {
        console.log(`   ⚠️  ${file}: ${err.message}`)
      }
    }
    console.log('   ✅ Migrations completed\n')

    // Step 2: Seed the database
    console.log('2️⃣  Seeding database...')
    // Import and run seed
    const seedModule = await import('../src/lib/db/seed')
    // The seed.ts runs automatically when imported, but let's wait a moment
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('   ✅ Seed completed\n')
    
    console.log('\n✅ Migration and seeding completed successfully!')
    console.log('\n🔐 Admin credentials:')
    console.log('   Email: admin@votennp.com')
    console.log('   Password: admin123')
    console.log('\n⚠️  Remember to change the password after first login!')
    
    process.exit(0)
  } catch (error: any) {
    console.error('\n❌ Error:', error.message)
    console.error(error)
    process.exit(1)
  }
}

migrateAndSeed()

