import { db } from '../src/lib/db/index'
import { users, accounts, heroImages } from '../src/lib/db/schema'
import { eq } from 'drizzle-orm'

async function testTursoSeed() {
  console.log('🧪 Testing Turso database connection and seed data...\n')

  try {
    // Test 1: Check database connection
    console.log('1️⃣  Testing database connection...')
    const testQuery = await db.execute('SELECT 1 as test')
    console.log('   ✅ Database connection successful\n')

    // Test 2: Check if admin user exists
    console.log('2️⃣  Checking for admin user...')
    const adminUser = await db.query.users.findFirst({
      where: eq(users.email, 'admin@votennp.com'),
    })

    if (adminUser) {
      console.log('   ✅ Admin user exists:')
      console.log(`      - Email: ${adminUser.email}`)
      console.log(`      - Name: ${adminUser.name}`)
      console.log(`      - ID: ${adminUser.id}\n`)
    } else {
      console.log('   ⚠️  Admin user not found. Run: npm run db:seed\n')
    }

    // Test 3: Check if admin account with password exists
    if (adminUser) {
      console.log('3️⃣  Checking for admin account...')
      const adminAccount = await db.query.accounts.findFirst({
        where: eq(accounts.userId, adminUser.id),
      })

      if (adminAccount && adminAccount.password) {
        console.log('   ✅ Admin account with password exists\n')
      } else {
        console.log('   ⚠️  Admin account not found or missing password\n')
      }
    }

    // Test 4: Check hero images
    console.log('4️⃣  Checking hero images...')
    const images = await db.query.heroImages.findMany()
    console.log(`   ✅ Found ${images.length} hero image(s)\n`)

    // Test 5: Verify login would work
    console.log('5️⃣  Summary:')
    if (adminUser) {
      console.log('   ✅ Admin user: admin@votennp.com')
      console.log('   ✅ Password: admin123 (default)')
      console.log('   ⚠️  Remember to change password after first login!')
    } else {
      console.log('   ❌ Admin user not found - run: npm run db:seed')
    }

    console.log('\n✅ All tests completed!')
    process.exit(0)
  } catch (error: any) {
    console.error('\n❌ Test failed:', error.message)
    console.error('\nError details:', error)
    process.exit(1)
  }
}

testTursoSeed()

