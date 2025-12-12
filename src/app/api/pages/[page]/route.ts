import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { pageContent } from '@/lib/db/schema'
import { eq, and, asc } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ page: string }> }
) {
  try {
    const { page } = await params
    
    const content = await db
      .select()
      .from(pageContent)
      .where(and(eq(pageContent.page, page), eq(pageContent.active, true)))
      .orderBy(asc(pageContent.order))

    return NextResponse.json({ content })
  } catch (error) {
    console.error('Error fetching page content:', error)
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 })
  }
}

