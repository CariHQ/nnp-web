import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { db } from '@/lib/db'
import { heroImages } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'

export async function GET() {
  try {
    const images = await db.select().from(heroImages).orderBy(desc(heroImages.order))
    return NextResponse.json({ images })
  } catch (error) {
    console.error('Error fetching hero images:', error)
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const [newImage] = await db.insert(heroImages).values(body).returning()
    return NextResponse.json({ image: newImage })
  } catch (error) {
    console.error('Error creating hero image:', error)
    return NextResponse.json({ error: 'Failed to create image' }, { status: 500 })
  }
}

