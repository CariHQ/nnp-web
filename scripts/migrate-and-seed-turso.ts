import { db } from '../src/lib/db/index'
import { readFileSync } from 'fs'
import { join } from 'path'
import { execSync } from 'child_process'

async function migrateAndSeed() {
  console.log('🔄 Migrating and seeding Turso database...\n')

  try {
    // Step 1: Run migrations using drizzle-kit
    console.log('1️⃣  Running database migrations...')
    try {
      execSync('npx drizzle-kit push', { 
        stdio: 'inherit',
        env: { ...process.env }
      })
      console.log('   ✅ Migrations completed\n')
    } catch (error: any) {
      console.log('   ⚠️  drizzle-kit push failed, trying manual migration...\n')
      
      // Fallback: Apply migrations manually
      const migrationFiles = [
        'drizzle/0000_spotty_silver_surfer.sql',
        'drizzle/0001_pink_starfox.sql'
      ]
      
      for (const file of migrationFiles) {
        try {
          const sql = readFileSync(join(process.cwd(), file), 'utf-8')
          // Split by statement and execute each
          const statements = sql.split('--> statement-breakpoint').filter(s => s.trim())
          for (const statement of statements) {
            const cleanStatement = statement.replace(/^[^`]*`/, '').replace(/`[^`]*$/, '').trim()
            if (cleanStatement && !cleanStatement.startsWith('--')) {
              await db.execute(cleanStatement as any)
            }
          }
          console.log(`   ✅ Applied ${file}`)
        } catch (err: any) {
          console.log(`   ⚠️  ${file}: ${err.message}`)
        }
      }
    }

    // Step 2: Seed the database
    console.log('\n2️⃣  Seeding database...')
    // Import and run seed function
    const seedModule = await import('../src/lib/db/seed')
    // The seed.ts file runs automatically, but we can also call it explicitly
    // For now, just run the seed script
    execSync('npm run db:seed', { 
      stdio: 'inherit',
      env: { ...process.env }
    })
    
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

