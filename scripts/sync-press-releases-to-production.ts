// Load environment variables from .env file
import { config } from 'dotenv'
config()

import { createClient } from '@libsql/client'
import { readFileSync } from 'fs'

async function syncPressReleases() {
  console.log('🔄 Syncing press releases from local to production Turso...\n')

  if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_DATABASE_URL.startsWith('libsql://')) {
    console.error('❌ TURSO_DATABASE_URL must be set and start with libsql://')
    process.exit(1)
  }

  if (!process.env.TURSO_AUTH_TOKEN) {
    console.error('❌ TURSO_AUTH_TOKEN must be set')
    process.exit(1)
  }

  // Connect to local database
  const localClient = createClient({
    url: 'file:./local.db',
  })

  // Connect to production database
  const prodClient = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  })

  try {
    // Get all press releases from local
    console.log('1️⃣  Fetching press releases from local database...')
    const localPosts = await localClient.execute('SELECT * FROM blog_posts ORDER BY published_at DESC')
    console.log(`   Found ${localPosts.rows.length} press releases in local database\n`)

    // Get existing posts from production
    console.log('2️⃣  Checking production database...')
    const prodPosts = await prodClient.execute('SELECT id, slug FROM blog_posts')
    const prodSlugs = new Set(prodPosts.rows.map((row: any) => row.slug))
    console.log(`   Found ${prodPosts.rows.length} existing posts in production\n`)

    // Sync posts
    console.log('3️⃣  Syncing press releases to production...')
    let synced = 0
    let updated = 0
    let skipped = 0

    for (const row of localPosts.rows) {
      const slug = row.slug as string
      const isUpdate = prodSlugs.has(slug)

      try {
        if (isUpdate) {
          // Update existing
          await prodClient.execute({
            sql: `UPDATE blog_posts 
                  SET title = ?, content = ?, excerpt = ?, author = ?, published = ?, published_at = ?, updated_at = ?, header_image = ?
                  WHERE slug = ?`,
            args: [
              row.title,
              row.content,
              row.excerpt,
              row.author,
              row.published ? 1 : 0,
              row.published_at,
              Math.floor(Date.now() / 1000),
              row.header_image,
              slug,
            ],
          })
          console.log(`   🔄 Updated: "${row.title}"`)
          updated++
        } else {
          // Insert new
          await prodClient.execute({
            sql: `INSERT INTO blog_posts (title, slug, content, excerpt, author, published, published_at, created_at, updated_at, header_image) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
              row.title,
              row.slug,
              row.content,
              row.excerpt,
              row.author,
              row.published ? 1 : 0,
              row.published_at,
              row.created_at || Math.floor(Date.now() / 1000),
              Math.floor(Date.now() / 1000),
              row.header_image,
            ],
          })
          console.log(`   ✅ Synced: "${row.title}"`)
          synced++
        }
      } catch (err: any) {
        console.log(`   ❌ Error syncing "${row.title}": ${err.message}`)
        skipped++
      }
    }

    console.log(`\n✅ Sync complete!`)
    console.log(`   Synced: ${synced}`)
    console.log(`   Updated: ${updated}`)
    console.log(`   Errors: ${skipped}`)
    console.log(`   Total: ${localPosts.rows.length}`)
    
    process.exit(0)
  } catch (error: any) {
    console.error('\n❌ Error:', error.message)
    if (error.stack) {
      console.error(error.stack)
    }
    process.exit(1)
  }
}

syncPressReleases()

