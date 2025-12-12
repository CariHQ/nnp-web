import { db } from '../src/lib/db'
import { heroImages, pageContent } from '../src/lib/db/schema'
import { eq, and, asc } from 'drizzle-orm'
import fs from 'fs'
import path from 'path'

async function generateStaticData() {
  console.log('Generating static data files for GitHub Pages...')

  try {
    // Generate hero images JSON
    const heroImagesData = await db
      .select()
      .from(heroImages)
      .where(eq(heroImages.active, true))
      .orderBy(asc(heroImages.order))

    const heroImagesPath = path.join(process.cwd(), 'public', 'data', 'hero-images.json')
    fs.mkdirSync(path.dirname(heroImagesPath), { recursive: true })
    fs.writeFileSync(heroImagesPath, JSON.stringify({ images: heroImagesData }, null, 2))
    console.log(`✓ Generated ${heroImagesPath} with ${heroImagesData.length} images`)

    // Generate page content JSON
    const pages = ['about']
    for (const page of pages) {
      const content = await db
        .select()
        .from(pageContent)
        .where(and(eq(pageContent.page, page), eq(pageContent.active, true)))
        .orderBy(asc(pageContent.order))

      const pageDataPath = path.join(process.cwd(), 'public', 'data', `pages-${page}.json`)
      fs.writeFileSync(pageDataPath, JSON.stringify({ content }, null, 2))
      console.log(`✓ Generated ${pageDataPath} with ${content.length} sections`)
    }

    console.log('\n✓ Static data generation complete!')
  } catch (error) {
    console.error('Error generating static data:', error)
    // Don't fail the build if database isn't available
    console.log('Continuing without static data generation...')
  }
}

generateStaticData()

