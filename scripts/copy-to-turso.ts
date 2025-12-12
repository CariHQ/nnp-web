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

  console.log('📋 Copying blog_posts from local.db to Turso...\n')

  try {
    // Get all posts from local
    const localPosts = await localClient.execute('SELECT * FROM blog_posts')
    console.log(`Found ${localPosts.rows.length} posts in local database\n`)

    // Delete all existing posts in Turso
    await tursoClient.execute('DELETE FROM blog_posts')
    console.log('Cleared existing posts in Turso\n')

    // Insert all posts
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
      console.log(`✅ Copied: "${row.title}"`)
    }

    console.log(`\n✅ Done! Copied ${localPosts.rows.length} posts to Turso`)
    process.exit(0)
  } catch (error: any) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

copyToTurso()

