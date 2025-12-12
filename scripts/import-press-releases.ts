import { db } from '../src/lib/db/index'
import { blogPosts } from '../src/lib/db/schema'
import { readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'
import { eq } from 'drizzle-orm'

// Extract date from filename or content
function extractDate(filename: string, content?: string): Date | null {
  // Try to extract date from filename patterns
  const datePatterns = [
    /(\d{4})-(\d{2})-(\d{2})/, // YYYY-MM-DD
    /(\d{2})\/(\d{2})\/(\d{4})/, // MM/DD/YYYY
    /(\d{4})_(\d{2})_(\d{2})/, // YYYY_MM_DD
  ]

  for (const pattern of datePatterns) {
    const match = filename.match(pattern)
    if (match) {
      if (pattern === datePatterns[0]) {
        return new Date(`${match[1]}-${match[2]}-${match[3]}`)
      } else if (pattern === datePatterns[1]) {
        return new Date(`${match[3]}-${match[1]}-${match[2]}`)
      } else if (pattern === datePatterns[2]) {
        return new Date(`${match[1]}-${match[2]}-${match[3]}`)
      }
    }
  }

  // Try to extract from content if provided
  if (content) {
    const contentDatePatterns = [
      /(?:Date|Dated?|Published?)[:\s]+(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/i,
      /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/,
    ]

    for (const pattern of contentDatePatterns) {
      const match = content.match(pattern)
      if (match) {
        const month = match[1].padStart(2, '0')
        const day = match[2].padStart(2, '0')
        const year = match[3]
        return new Date(`${year}-${month}-${day}`)
      }
    }
  }

  return null
}

// Generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 100) // Limit length
}

// Extract title from filename
function extractTitle(filename: string): string {
  // Remove extension
  let title = filename.replace(/\.(pdf|png|jpg|jpeg)$/i, '')
  
  // Remove common prefixes
  title = title.replace(/^NNP\s+/i, '')
  title = title.replace(/^New National Party\s+/i, '')
  title = title.replace(/\s*\(1\)$/, '') // Remove (1) suffix
  
  return title.trim()
}

// Read PDF text
async function readPDF(filePath: string): Promise<string> {
  try {
    // Try to use pdf-parse if available
    try {
      const pdfParse = require('pdf-parse')
      const buffer = readFileSync(filePath)
      const data = await pdfParse(buffer)
      return data.text.trim()
    } catch (pdfError) {
      // Fallback: return placeholder
      return `Press release content from ${filePath}. Full text available in original PDF.`
    }
  } catch (error) {
    console.error(`Error reading PDF ${filePath}:`, error)
    return `Press release content from ${filePath}. Full text available in original PDF.`
  }
}

// Read image and extract text (placeholder)
async function readImage(filePath: string): Promise<string> {
  // For images, we'll use the filename as the content
  // In production, you might want to use OCR
  return `Press release image: ${filePath}`
}

async function importPressReleases() {
  console.log('📰 Importing press releases from press-releases folder...\n')

  const pressReleasesDir = join(process.cwd(), 'press-releases')
  const files = readdirSync(pressReleasesDir)

  const releases: Array<{
    title: string
    slug: string
    content: string
    date: Date | null
    filename: string
  }> = []

  for (const file of files) {
    const filePath = join(pressReleasesDir, file)
    const title = extractTitle(file)
    const slug = generateSlug(title)
    
    // Read content first if PDF
    let fullContent = ''
    if (file.toLowerCase().endsWith('.pdf')) {
      fullContent = await readPDF(filePath)
    } else if (file.toLowerCase().match(/\.(png|jpg|jpeg)$/i)) {
      fullContent = await readImage(filePath)
    }
    
    const date = extractDate(file, fullContent)

    releases.push({
      title,
      slug,
      content: fullContent || title, // Use title as fallback content
      date,
      filename: file,
    })

    console.log(`📄 Found: ${title}`)
    if (date) {
      console.log(`   Date: ${date.toLocaleDateString()}`)
    } else {
      console.log(`   Date: Not found (will use file modification date)`)
    }
  }

  // Sort by date (earliest first), then by filename
  releases.sort((a, b) => {
    if (a.date && b.date) {
      return a.date.getTime() - b.date.getTime()
    }
    if (a.date) return -1
    if (b.date) return 1
    return a.filename.localeCompare(b.filename)
  })

  console.log(`\n📝 Importing ${releases.length} press releases...\n`)

  for (const release of releases) {
    try {
      // Check if slug already exists
      const existing = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.slug, release.slug))
        .limit(1)

      if (existing.length > 0) {
        console.log(`⏭️  Skipped: "${release.title}" (slug already exists)`)
        continue
      }

      // Use file modification date if no date found
      let publishedDate: Date
      if (release.date && release.date instanceof Date) {
        publishedDate = release.date
      } else {
        // Use file modification time
        const stats = statSync(join(pressReleasesDir, release.filename))
        // stats.mtime is already a Date object in Node.js
        publishedDate = new Date(stats.mtime)
      }
      
      // Double-check it's a Date
      if (!(publishedDate instanceof Date) || isNaN(publishedDate.getTime())) {
        console.error(`Invalid date for ${release.title}, using current date`)
        publishedDate = new Date()
      }

      // Drizzle expects a Date object for timestamp mode, not a number
      await db.insert(blogPosts).values({
        title: release.title,
        slug: release.slug,
        content: release.content,
        excerpt: release.title.substring(0, 200), // Use title as excerpt for now
        published: true,
        publishedAt: publishedDate, // Pass Date object, Drizzle will convert to timestamp
        author: 'New National Party',
      })

      console.log(`✅ Imported: "${release.title}"`)
      console.log(`   Published: ${publishedDate.toLocaleDateString()}`)
    } catch (error: any) {
      console.error(`❌ Error importing "${release.title}":`, error.message)
      console.error(`   Full error:`, error)
      if (error.stack) {
        console.error(`   Stack:`, error.stack.split('\n').slice(0, 3).join('\n'))
      }
    }
  }

  console.log(`\n✅ Import complete!`)
}

importPressReleases()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error:', error)
    process.exit(1)
  })
