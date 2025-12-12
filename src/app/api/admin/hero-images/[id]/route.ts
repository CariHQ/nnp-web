import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { heroImages } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    
    await db
      .update(heroImages)
      .set({ ...body, updatedAt: new Date().getTime() / 1000 })
      .where(eq(heroImages.id, parseInt(id)))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating hero image:', error)
    return NextResponse.json({ error: 'Failed to update image' }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.delete(heroImages).where(eq(heroImages.id, parseInt(id)))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting hero image:', error)
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 })
  }
}

