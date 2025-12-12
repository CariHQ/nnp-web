import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { pageContent } from '@/lib/db/schema'
import { desc, eq, and } from 'drizzle-orm'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = searchParams.get('page')

    let query = db.select().from(pageContent).orderBy(desc(pageContent.order))

    if (page) {
      const content = await db.select().from(pageContent)
        .where(and(eq(pageContent.page, page), eq(pageContent.active, true)))
        .orderBy(desc(pageContent.order))
      return NextResponse.json({ content })
    }

    const content = await query
    return NextResponse.json({ content })
  } catch (error) {
    console.error('Error fetching page content:', error)
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const [newContent] = await db.insert(pageContent).values(body).returning()
    return NextResponse.json({ content: newContent })
  } catch (error) {
    console.error('Error creating page content:', error)
    return NextResponse.json({ error: 'Failed to create content' }, { status: 500 })
  }
}

