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
    // Look for dates in various formats in the content
    const contentDatePatterns = [
      /(?:Date|Dated?|Published?|For Immediate Release)[:\s]+(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/i,
      /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/,
      /(?:Date|Dated?)[:\s]+(\w+)\s+(\d{1,2}),?\s+(\d{4})/i, // "Date: June 30, 2024"
      /(\w+)\s+(\d{1,2}),?\s+(\d{4})/, // "June 30, 2024"
    ]

    for (const pattern of contentDatePatterns) {
      const match = content.match(pattern)
      if (match) {
        if (match.length === 4) {
          // Check if it's a month name format
          if (isNaN(parseInt(match[1]))) {
            // Month name format: "June 30, 2024"
            const monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']
            const monthIndex = monthNames.findIndex(m => m.startsWith(match[1].toLowerCase()))
            if (monthIndex !== -1) {
              const month = String(monthIndex + 1).padStart(2, '0')
              const day = match[2].padStart(2, '0')
              const year = match[3]
              return new Date(`${year}-${month}-${day}`)
            }
          } else {
            // Numeric format: "6/30/2024" or "06/30/2024"
            const month = match[1].padStart(2, '0')
            const day = match[2].padStart(2, '0')
            const year = match[3]
            return new Date(`${year}-${month}-${day}`)
          }
        }
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
    const pdfParse = require('pdf-parse')
    const buffer = readFileSync(filePath)
    const data = await pdfParse(buffer)
    return data.text.trim()
  } catch (error: any) {
    console.error(`Error reading PDF ${filePath}:`, error.message)
    return ''
  }
}

// Read image - for now just return placeholder
async function readImage(filePath: string): Promise<string> {
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
      // Check if slug already exists - if so, update it
      const existing = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.slug, release.slug))
        .limit(1)

      // Use file modification date if no date found
      let publishedDate: Date
      if (release.date && release.date instanceof Date) {
        publishedDate = release.date
      } else {
        // Use file modification time
        const stats = statSync(join(pressReleasesDir, release.filename))
        publishedDate = new Date(stats.mtime)
      }
      
      // Double-check it's a Date
      if (!(publishedDate instanceof Date) || isNaN(publishedDate.getTime())) {
        console.error(`Invalid date for ${release.title}, using current date`)
        publishedDate = new Date()
      }

      if (existing.length > 0) {
        // Update existing
        await db
          .update(blogPosts)
          .set({
            title: release.title,
            content: release.content,
            excerpt: release.content.substring(0, 200),
            publishedAt: publishedDate,
            updatedAt: new Date(),
          })
          .where(eq(blogPosts.id, existing[0].id))
        console.log(`✅ Updated: "${release.title}"`)
      } else {
        // Insert new
        await db.insert(blogPosts).values({
          title: release.title,
          slug: release.slug,
          content: release.content,
          excerpt: release.content.substring(0, 200),
          published: true,
          publishedAt: publishedDate,
          author: 'New National Party',
        })
        console.log(`✅ Imported: "${release.title}"`)
      }
      console.log(`   Published: ${publishedDate.toLocaleDateString()}`)
    } catch (error: any) {
      console.error(`❌ Error importing "${release.title}":`, error.message)
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
