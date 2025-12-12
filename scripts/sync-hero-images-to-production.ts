import { createClient } from '@libsql/client'
import { readFileSync } from 'fs'
import { createClient as createLocalClient } from '@libsql/client'

async function syncHeroImages() {
  console.log('🔄 Syncing hero images from local to production...\n')

  if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_DATABASE_URL.startsWith('libsql://')) {
    console.error('❌ TURSO_DATABASE_URL must be set')
    process.exit(1)
  }

  if (!process.env.TURSO_AUTH_TOKEN) {
    console.error('❌ TURSO_AUTH_TOKEN must be set')
    process.exit(1)
  }

  // Connect to local database
  const localClient = createLocalClient({
    url: 'file:./local.db',
  })

  // Connect to production database
  const prodClient = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  })

  try {
    // Get all images from local
    console.log('1️⃣  Fetching images from local database...')
    const localImages = await localClient.execute('SELECT * FROM hero_images ORDER BY "order"')
    console.log(`   Found ${localImages.rows.length} images in local database\n`)

    // Get existing images from production
    console.log('2️⃣  Checking production database...')
    const prodImages = await prodClient.execute('SELECT id, title FROM hero_images')
    const prodTitles = new Set(prodImages.rows.map((row: any) => row.title))
    console.log(`   Found ${prodImages.rows.length} existing images in production\n`)

    // Insert missing images
    console.log('3️⃣  Syncing images to production...')
    let synced = 0
    let skipped = 0

    for (const row of localImages.rows) {
      const title = row.title as string
      
      if (prodTitles.has(title)) {
        console.log(`   ⏭️  Skipped: "${title}" (already exists)`)
        skipped++
        continue
      }

      try {
        await prodClient.execute({
          sql: `INSERT INTO hero_images (title, image_url, caption, link, "order", active, created_at, updated_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            row.title,
            row.image_url,
            row.caption,
            row.link,
            row.order,
            row.active ? 1 : 0,
            row.created_at || Math.floor(Date.now() / 1000),
            row.updated_at || Math.floor(Date.now() / 1000),
          ],
        })
        console.log(`   ✅ Synced: "${title}"`)
        synced++
      } catch (err: any) {
        console.log(`   ❌ Error syncing "${title}": ${err.message}`)
      }
    }

    console.log(`\n✅ Sync complete!`)
    console.log(`   Synced: ${synced}`)
    console.log(`   Skipped: ${skipped}`)
    console.log(`   Total: ${localImages.rows.length}`)
    
    process.exit(0)
  } catch (error: any) {
    console.error('\n❌ Error:', error.message)
    process.exit(1)
  }
}

syncHeroImages()

