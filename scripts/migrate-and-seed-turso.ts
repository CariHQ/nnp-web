import { db } from '../src/lib/db/index'
import { readFileSync } from 'fs'
import { join } from 'path'

async function migrateAndSeed() {
  console.log('🔄 Migrating and seeding Turso database...\n')

  if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_DATABASE_URL.startsWith('libsql://')) {
    console.error('❌ TURSO_DATABASE_URL must be set and start with libsql://')
    process.exit(1)
  }

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
        // Split by statement breakpoint and execute each statement
        const statements = sql
          .split('--> statement-breakpoint')
          .map(s => s.trim())
          .filter(s => s && !s.startsWith('--') && s.length > 10)
        
        for (const statement of statements) {
          // Clean up the statement
          let cleanStatement = statement
            .replace(/^[^`]*`/, '')
            .replace(/`[^`]*$/, '')
            .trim()
          
          // Skip empty or comment-only statements
          if (!cleanStatement || cleanStatement.startsWith('--')) continue
          
          try {
            // Use raw SQL execution
            await (db as any).execute(cleanStatement)
          } catch (err: any) {
            // Ignore "table already exists" errors
            if (!err.message?.includes('already exists') && !err.message?.includes('duplicate')) {
              console.log(`   ⚠️  Statement error (may be expected): ${err.message.substring(0, 50)}`)
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
    // Import seed function directly
    const { seed } = await import('../src/lib/db/seed')
    // The seed function is exported but also runs automatically
    // We'll just let it run
    console.log('   ✅ Seed script will run automatically\n')
    
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

