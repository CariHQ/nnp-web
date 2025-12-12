import { NextResponse } from 'next/server'
export const dynamic = 'force-static'
import { db } from '@/lib/db'
import { heroImages } from '@/lib/db/schema'
import { eq, asc } from 'drizzle-orm'

export async function GET() {
  try {
    const images = await db
      .select()
      .from(heroImages)
      .where(eq(heroImages.active, true))
      .orderBy(asc(heroImages.order))

    return NextResponse.json({ images })
  } catch (error) {
    console.error('Error fetching hero images:', error)
    return NextResponse.json({ error: 'Failed to fetch hero images' }, { status: 500 })
  }
}
