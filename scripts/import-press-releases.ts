// Load environment variables from .env file
import { config } from 'dotenv'
config()

import { db } from '../src/lib/db/index'
import { blogPosts } from '../src/lib/db/schema'
import { readFileSync, readdirSync, statSync, unlinkSync, existsSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'
import { eq } from 'drizzle-orm'
import { createWorker } from 'tesseract.js'
import { exec } from 'child_process'
import { promisify } from 'util'
import OpenAI from 'openai'

const execAsync = promisify(exec)

const PDFParse = require('pdf-parse').PDFParse

// Initialize OpenAI client (optional - will gracefully fail if no API key)
let openaiClient: OpenAI | null = null
try {
  if (process.env.OPENAI_API_KEY) {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    console.log('🤖 OpenAI API configured - AI date cleaning enabled\n')
  } else {
    console.log('⚠️  OPENAI_API_KEY not set - AI date cleaning disabled (using basic validation only)\n')
  }
} catch (error) {
  console.warn('⚠️  OpenAI not available - date cleaning will use basic validation only\n')
}

// Validate if a date is reasonable (year between 2000-2100)
function isValidDate(date: Date | null): boolean {
  if (!date || isNaN(date.getTime())) return false
  const year = date.getFullYear()
  return year >= 2000 && year <= 2100
}

// Clean entire content using AI - fix OCR errors, formatting, etc.
async function cleanContentWithAI(rawContent: string): Promise<string> {
  if (!openaiClient || !rawContent) {
    return rawContent
  }

  try {
    console.log(`   🤖 Cleaning content with AI...`)
    const response = await openaiClient.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a text cleaning assistant for press releases. Clean up OCR errors, fix formatting, correct dates (e.g., "56506" should be "2024"), fix typos, and improve readability while preserving the original meaning and structure. Return the cleaned, properly formatted press release text.'
        },
        {
          role: 'user',
          content: `Clean and format this press release text. Fix OCR errors, correct dates, and improve formatting:\n\n${rawContent}`
        }
      ],
      temperature: 0.2,
      max_tokens: 4000
    })

    const cleanedContent = response.choices[0]?.message?.content?.trim()
    if (cleanedContent && cleanedContent.length > 0) {
      console.log(`   ✓ Content cleaned (${cleanedContent.length} chars)`)
      return cleanedContent
    }
  } catch (error: any) {
    console.error(`   ⚠️  AI content cleaning failed:`, error.message)
  }

  return rawContent
}

// Clean and correct date using AI model
async function cleanDateWithAI(rawDateText: string, content: string): Promise<Date | null> {
  if (!openaiClient) {
    return null
  }

  try {
    const response = await openaiClient.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a date extraction assistant. Extract the correct date from the given text. Return ONLY a date in YYYY-MM-DD format, or "null" if no valid date can be found. The date should be from the press release content, typically between 2020-2025. Fix any OCR errors (e.g., "56437" should be "2024").'
        },
        {
          role: 'user',
          content: `Extract the correct date from this press release. The OCR extracted date text is: "${rawDateText}". Here's the relevant content:\n\n${content.substring(0, 1000)}`
        }
      ],
      temperature: 0.1,
      max_tokens: 50
    })

    const cleanedDate = response.choices[0]?.message?.content?.trim()
    if (!cleanedDate || cleanedDate.toLowerCase() === 'null') {
      return null
    }

    // Try to parse the cleaned date
    const date = new Date(cleanedDate)
    if (isValidDate(date)) {
      return date
    }
  } catch (error: any) {
    console.error(`   ⚠️  AI date cleaning failed:`, error.message)
  }

  return null
}

// Extract date using OpenAI - analyze entire content to find the correct press release date
async function extractDateWithAI(content: string): Promise<Date | null> {
  if (!openaiClient || !content) {
    return null
  }

  try {
    const response = await openaiClient.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a date extraction expert for press releases. Extract the CORRECT publication date from the press release content. Look for dates near "For Immediate Release", in headers, or at the beginning of the document. Ignore OCR errors (like "56506" should be "2024"). Return ONLY the date in YYYY-MM-DD format, or "null" if no valid date can be found. The date should be between 2020-2025 for press releases.'
        },
        {
          role: 'user',
          content: `Extract the publication date from this press release. Look for the date that appears with "For Immediate Release" or in the header. Here's the content:\n\n${content.substring(0, 3000)}`
        }
      ],
      temperature: 0.1,
      max_tokens: 50
    })

    const dateStr = response.choices[0]?.message?.content?.trim()
    if (!dateStr || dateStr.toLowerCase() === 'null') {
      return null
    }

    // Try to parse the date
    const date = new Date(dateStr)
    if (isValidDate(date)) {
      return date
    }
  } catch (error: any) {
    console.error(`   ⚠️  AI date extraction failed:`, error.message)
  }

  return null
}

// Extract date from filename or content
async function extractDate(filename: string, content?: string): Promise<Date | null> {
  // Try to extract date from filename patterns first
  const datePatterns = [
    /(\d{4})-(\d{2})-(\d{2})/, // YYYY-MM-DD
    /(\d{2})\/(\d{2})\/(\d{4})/, // MM/DD/YYYY
    /(\d{4})_(\d{2})_(\d{2})/, // YYYY_MM_DD
  ]

  for (const pattern of datePatterns) {
    const match = filename.match(pattern)
    if (match) {
      if (pattern === datePatterns[0]) {
        const date = new Date(`${match[1]}-${match[2]}-${match[3]}`)
        if (isValidDate(date)) return date
      } else if (pattern === datePatterns[1]) {
        const date = new Date(`${match[3]}-${match[1]}-${match[2]}`)
        if (isValidDate(date)) return date
      } else if (pattern === datePatterns[2]) {
        const date = new Date(`${match[1]}-${match[2]}-${match[3]}`)
        if (isValidDate(date)) return date
      }
    }
  }

  // If we have content, USE OPENAI to extract the date
  if (content && openaiClient) {
    console.log(`   🤖 Using AI to extract date from content...`)
    const aiDate = await extractDateWithAI(content)
    if (aiDate) {
      console.log(`   ✓ AI extracted date: ${aiDate.toLocaleDateString()}`)
      return aiDate
    }
  }

  // Fallback to regex if AI fails or not available
  if (content) {
    const contentDatePatterns = [
      // "Date: June 30, 2024" or "Dated: June 30, 2024" or "November 18th, 2024"
      /(?:Date|Dated?|Published?|For Immediate Release)[:\s]+(\w+)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})/i,
      // "June 30, 2024" or "November 18th, 2024" (standalone)
      /(\w+)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})/,
      // "6/30/2024" or "06/30/2024"
      /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/,
      // "30 June 2024"
      /(\d{1,2})\s+(\w+)\s+(\d{4})/,
    ]

    const monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']
    const monthAbbr = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

    // Find ALL dates and prefer valid ones
    const foundDates: Array<{ date: Date; text: string; valid: boolean }> = []

    for (const pattern of contentDatePatterns) {
      const matches = content.matchAll(new RegExp(pattern.source, pattern.flags + 'g'))
      for (const match of matches) {
        if (match.length === 4) {
          const monthStr = match[1].toLowerCase()
          let monthIndex = monthNames.findIndex(m => m.startsWith(monthStr))
          if (monthIndex === -1) {
            monthIndex = monthAbbr.findIndex(m => m.startsWith(monthStr))
          }
          
          if (monthIndex !== -1) {
            const day = match[2].padStart(2, '0')
            const year = match[3]
            const month = String(monthIndex + 1).padStart(2, '0')
            const date = new Date(`${year}-${month}-${day}`)
            foundDates.push({ date, text: match[0], valid: isValidDate(date) })
          } else if (!isNaN(parseInt(match[1]))) {
            const first = parseInt(match[1])
            const second = parseInt(match[2])
            const year = match[3]
            
            let date: Date | null = null
            if (first > 12) {
              const day = match[1].padStart(2, '0')
              const month = match[2].padStart(2, '0')
              date = new Date(`${year}-${month}-${day}`)
            } else {
              const month = match[1].padStart(2, '0')
              const day = match[2].padStart(2, '0')
              date = new Date(`${year}-${month}-${day}`)
            }
            if (date) {
              foundDates.push({ date, text: match[0], valid: isValidDate(date) })
            }
          }
        }
      }
    }

    // Prefer valid dates, and dates near "For Immediate Release"
    const validDates = foundDates.filter(d => d.valid)
    if (validDates.length > 0) {
      // Prefer dates that appear near "For Immediate Release"
      const immediateReleaseIndex = content.toLowerCase().indexOf('for immediate release')
      if (immediateReleaseIndex >= 0) {
        const nearbyDates = validDates.filter(d => {
          const dateIndex = content.indexOf(d.text)
          return dateIndex >= 0 && Math.abs(dateIndex - immediateReleaseIndex) < 200
        })
        if (nearbyDates.length > 0) {
          return nearbyDates[0].date
        }
      }
      return validDates[0].date
    }

    // If no valid dates, try AI cleaning on invalid ones
    for (const found of foundDates.filter(d => !d.valid)) {
      const cleaned = await cleanDateWithAI(found.text, content)
      if (cleaned) return cleaned
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
    const buffer = readFileSync(filePath)
    const parser = new PDFParse()
    const result = await parser.parse(buffer)
    return result.text.trim()
  } catch (error: any) {
    // Silently fail - we'll try OCR if this fails
    return ''
  }
}

// Convert PDF page to image using ImageMagick and OCR it
async function readPDFWithOCR(filePath: string, ocrWorker: any, pageNum: number = 1): Promise<string> {
  const tempDir = join(process.cwd(), 'temp')
  if (!existsSync(tempDir)) {
    mkdirSync(tempDir, { recursive: true })
  }
  
  const tempImagePath = join(tempDir, `temp_pdf_page_${Date.now()}_${pageNum}.png`)
  
  try {
    // Use ImageMagick magick command (v7) or convert (v6)
    // -density 300: Higher DPI for better OCR quality
    // [0]: First page (0-indexed)
    // -quality 100: Maximum quality
    // -resize 2000x2000: Resize maintaining aspect ratio, max 2000px
    // Escape the file path properly for shell execution
    const escapedFilePath = filePath.replace(/'/g, "'\\''")
    const escapedImagePath = tempImagePath.replace(/'/g, "'\\''")
    
    // Check if magick (v7) is available, fallback to convert (v6)
    let convertCmd
    try {
      await execAsync('which magick')
      convertCmd = `magick -density 300 '${escapedFilePath}[${pageNum - 1}]' -quality 100 -resize '2000x2000>' '${escapedImagePath}'`
    } catch {
      convertCmd = `convert -density 300 '${escapedFilePath}[${pageNum - 1}]' -quality 100 -resize '2000x2000>' '${escapedImagePath}'`
    }
    
    await execAsync(convertCmd)
    
    if (!existsSync(tempImagePath)) {
      throw new Error(`Converted image file not found at ${tempImagePath}`)
    }
    
    // OCR the image
    const { data: { text } } = await ocrWorker.recognize(tempImagePath)
    
    // Clean up temp file
    if (existsSync(tempImagePath)) {
      unlinkSync(tempImagePath)
    }
    
    return text.trim()
  } catch (error: any) {
    // Clean up on error
    if (existsSync(tempImagePath)) {
      unlinkSync(tempImagePath)
    }
    console.error(`   ❌ Error converting PDF to image:`, error.message)
    return ''
  }
}

// Read image using OCR (Tesseract.js)
// Accepts optional worker parameter for reuse across multiple files
async function readImage(filePath: string, worker?: any): Promise<string> {
  let shouldTerminate = false
  let ocrWorker = worker
  
  try {
    if (!ocrWorker) {
      console.log(`   🔍 Initializing OCR worker...`)
      ocrWorker = await createWorker('eng')
      shouldTerminate = true
    }
    
    console.log(`   🔍 Running OCR on image...`)
    const { data: { text } } = await ocrWorker.recognize(filePath)
    
    const extractedText = text.trim()
    if (extractedText) {
      console.log(`   ✓ Extracted ${extractedText.length} characters via OCR`)
      return extractedText
    } else {
      console.log(`   ⚠️  OCR did not extract any text`)
      const filename = filePath.split('/').pop() || ''
      return `Press release image: ${filename}. OCR did not extract text from image.`
    }
  } catch (error: any) {
    console.error(`   ❌ Error running OCR on ${filePath}:`, error.message)
    const filename = filePath.split('/').pop() || ''
    return `Press release image: ${filename}. OCR failed: ${error.message}`
  } finally {
    if (shouldTerminate && ocrWorker) {
      await ocrWorker.terminate()
    }
  }
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

  // Check if we need OCR (for images or potentially scanned PDFs)
  const needsOCR = files.some(file => 
    file.toLowerCase().match(/\.(png|jpg|jpeg)$/i)
  )
  
  // Create OCR worker once if needed, reuse for all files
  let ocrWorker: any = null
  if (needsOCR) {
    console.log('🔧 Initializing OCR engine (this may take a moment on first run)...\n')
    try {
      ocrWorker = await createWorker('eng')
    } catch (error: any) {
      console.error('⚠️  Failed to initialize OCR worker:', error.message)
      console.error('   Continuing without OCR support for images...\n')
    }
  }

  for (const file of files) {
    const filePath = join(pressReleasesDir, file)
    const title = extractTitle(file)
    const slug = generateSlug(title)
    
    // Read content first if PDF or image
    let fullContent = ''
    let needsCleaning = false
    
    if (file.toLowerCase().endsWith('.pdf')) {
      console.log(`📄 Reading PDF: ${file}...`)
      fullContent = await readPDF(filePath)
      if (fullContent && fullContent.trim().length > 0) {
        console.log(`   ✓ Extracted ${fullContent.length} characters`)
        needsCleaning = true // Clean PDF text too
      } else {
        // PDF parsing failed - try OCR by converting PDF to image
        if (ocrWorker) {
          console.log(`   ⚠️  PDF text extraction failed, converting to image and using OCR...`)
          // Create temp directory if it doesn't exist
          const tempDir = join(process.cwd(), 'temp')
          if (!existsSync(tempDir)) {
            mkdirSync(tempDir, { recursive: true })
          }
          
          fullContent = await readPDFWithOCR(filePath, ocrWorker, 1)
          if (fullContent && fullContent.trim().length > 0) {
            console.log(`   ✓ Extracted ${fullContent.length} characters via OCR`)
            needsCleaning = true
          } else {
            console.log(`   ⚠️  OCR did not extract text from PDF`)
            const filename = filePath.split('/').pop() || ''
            fullContent = `Press release PDF: ${filename}. Text extraction and OCR failed.`
          }
        } else {
          console.log(`   ⚠️  PDF text extraction failed and OCR not available`)
          const filename = filePath.split('/').pop() || ''
          fullContent = `Press release PDF: ${filename}. Text extraction failed.`
        }
      }
    } else if (file.toLowerCase().match(/\.(png|jpg|jpeg)$/i)) {
      console.log(`🖼️  Reading image: ${file}...`)
      if (ocrWorker) {
        fullContent = await readImage(filePath, ocrWorker)
        if (fullContent && fullContent.trim().length > 0 && !fullContent.includes('OCR did not extract')) {
          needsCleaning = true
        }
      } else {
        const filename = filePath.split('/').pop() || ''
        fullContent = `Press release image: ${filename}. OCR not available.`
        console.log(`   ⚠️  OCR not available, skipping text extraction`)
      }
    }
    
    // Clean content with AI if we have actual content (not error messages)
    if (needsCleaning && fullContent && fullContent.trim().length > 100 && 
        !fullContent.includes('Text extraction failed') && 
        !fullContent.includes('OCR not available') &&
        !fullContent.includes('OCR did not extract')) {
      fullContent = await cleanContentWithAI(fullContent)
    }
    
    const date = await extractDate(file, fullContent)

    releases.push({
      title,
      slug,
      content: fullContent || title, // Use title as fallback content
      date,
      filename: file,
    })

    console.log(`📄 Found: ${title}`)
    if (date && isValidDate(date)) {
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

  // Clean up OCR worker
  if (ocrWorker) {
    console.log('\n🧹 Cleaning up OCR worker...')
    await ocrWorker.terminate()
  }

  console.log(`\n📝 Importing ${releases.length} press releases...\n`)

  for (const release of releases) {
    try {
      // Check if slug already exists - if so, update it
      const existing = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.slug, release.slug))
        .limit(1)

      // Use extracted date if valid, otherwise use file modification date
      let publishedDate: Date
      if (release.date && release.date instanceof Date && isValidDate(release.date)) {
        publishedDate = release.date
        console.log(`   📅 Using extracted date: ${publishedDate.toLocaleDateString()}`)
      } else {
        // Use file modification time as fallback
        const stats = statSync(join(pressReleasesDir, release.filename))
        publishedDate = new Date(stats.mtime)
        console.log(`   📅 Using file modification date: ${publishedDate.toLocaleDateString()}`)
      }
      
      // Double-check it's a valid Date
      if (!(publishedDate instanceof Date) || isNaN(publishedDate.getTime())) {
        console.error(`   ⚠️  Invalid date for ${release.title}, using current date`)
        publishedDate = new Date()
      }

      // Convert Date to Unix timestamp (seconds) for database
      const publishedTimestamp = Math.floor(publishedDate.getTime() / 1000)

      if (existing.length > 0) {
        // Update existing
        await db
          .update(blogPosts)
          .set({
            title: release.title,
            content: release.content,
            excerpt: release.content.substring(0, 200),
            publishedAt: new Date(publishedTimestamp * 1000), // Drizzle will convert to timestamp
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
          publishedAt: new Date(publishedTimestamp * 1000), // Drizzle will convert to timestamp
          author: 'New National Party',
        })
        console.log(`✅ Imported: "${release.title}"`)
      }
      console.log(`   📅 Published: ${publishedDate.toLocaleDateString()} (${publishedTimestamp})`)
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
