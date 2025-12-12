import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { pageContent } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    
    await db
      .update(pageContent)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(pageContent.id, parseInt(id)))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating page content:', error)
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.delete(pageContent).where(eq(pageContent.id, parseInt(id)))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting page content:', error)
    return NextResponse.json({ error: 'Failed to delete content' }, { status: 500 })
  }
}

