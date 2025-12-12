// Load environment variables from .env file
import { config } from 'dotenv'
config()

import { createClient } from '@libsql/client'

async function copyToTurso() {
  if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_DATABASE_URL.startsWith('libsql://')) {
    console.error('❌ TURSO_DATABASE_URL must be set')
    process.exit(1)
  }

  if (!process.env.TURSO_AUTH_TOKEN) {
    console.error('❌ TURSO_AUTH_TOKEN must be set')
    process.exit(1)
  }

  const localClient = createClient({ url: 'file:./local.db' })
  const tursoClient = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  })

  console.log('📋 Copying all content from local.db to Turso...\n')

  try {
    // 1. Copy blog_posts
    console.log('📰 Copying blog_posts...')
    const localPosts = await localClient.execute('SELECT * FROM blog_posts')
    console.log(`   Found ${localPosts.rows.length} posts in local database`)

    await tursoClient.execute('DELETE FROM blog_posts')
    console.log('   Cleared existing posts in Turso')

    for (const row of localPosts.rows) {
      await tursoClient.execute({
        sql: `INSERT INTO blog_posts (id, title, slug, content, excerpt, author, published, published_at, created_at, updated_at, header_image) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          row.id,
          row.title,
          row.slug,
          row.content,
          row.excerpt,
          row.author,
          row.published,
          row.published_at,
          row.created_at,
          row.updated_at,
          row.header_image,
        ],
      })
      console.log(`   ✅ Copied: "${row.title}"`)
    }
    console.log(`   ✅ Done! Copied ${localPosts.rows.length} blog posts\n`)

    // 2. Copy page_content
    console.log('📄 Copying page_content...')
    const localPageContent = await localClient.execute('SELECT * FROM page_content')
    console.log(`   Found ${localPageContent.rows.length} page content items in local database`)

    await tursoClient.execute('DELETE FROM page_content')
    console.log('   Cleared existing page_content in Turso')

    for (const row of localPageContent.rows) {
      await tursoClient.execute({
        sql: `INSERT INTO page_content (id, page, section, title, content, "order", active, created_at, updated_at) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          row.id,
          row.page,
          row.section,
          row.title,
          row.content,
          row.order,
          row.active,
          row.created_at,
          row.updated_at,
        ],
      })
      console.log(`   ✅ Copied: ${row.page}/${row.section}`)
    }
    console.log(`   ✅ Done! Copied ${localPageContent.rows.length} page content items\n`)

    // 3. Copy hero_images
    console.log('🖼️  Copying hero_images...')
    const localHeroImages = await localClient.execute('SELECT * FROM hero_images')
    console.log(`   Found ${localHeroImages.rows.length} hero images in local database`)

    await tursoClient.execute('DELETE FROM hero_images')
    console.log('   Cleared existing hero_images in Turso')

    for (const row of localHeroImages.rows) {
      await tursoClient.execute({
        sql: `INSERT INTO hero_images (id, title, image_url, caption, link, "order", active, created_at, updated_at) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          row.id,
          row.title,
          row.image_url,
          row.caption,
          row.link,
          row.order,
          row.active,
          row.created_at,
          row.updated_at,
        ],
      })
      console.log(`   ✅ Copied: "${row.title}"`)
    }
    console.log(`   ✅ Done! Copied ${localHeroImages.rows.length} hero images\n`)

    console.log('✅ All content synced to Turso!')
    process.exit(0)
  } catch (error: any) {
    console.error('❌ Error:', error.message)
    if (error.stack) {
      console.error('Stack:', error.stack)
    }
    process.exit(1)
  }
}

copyToTurso()
