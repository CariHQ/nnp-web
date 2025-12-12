import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { db } from '@/lib/db'
import { blogPosts } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const slug = searchParams.get('slug')
    
    if (slug) {
      // Get single post by slug
      const post = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.slug, slug))
        .limit(1)
      
      if (post.length === 0) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 })
      }
      
      return NextResponse.json({ post: post[0] })
    }
    
    // Get all published posts
    const posts = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.published, true))
      .orderBy(desc(blogPosts.publishedAt))
    
    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Error fetching press releases:', error)
    return NextResponse.json({ error: 'Failed to fetch press releases' }, { status: 500 })
  }
}

