import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { db } from '@/lib/db'
import { blogPosts } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'

export async function GET() {
  try {
    const posts = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt))
    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Error fetching press releases:', error)
    return NextResponse.json({ error: 'Failed to fetch press releases' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const [newPost] = await db.insert(blogPosts).values({
      ...body,
      updatedAt: new Date(),
    }).returning()
    return NextResponse.json({ post: newPost })
  } catch (error) {
    console.error('Error creating press release:', error)
    return NextResponse.json({ error: 'Failed to create press release' }, { status: 500 })
  }
}

