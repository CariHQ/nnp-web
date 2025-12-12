import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { stripePayments } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'

export async function GET() {
  try {
    const payments = await db
      .select()
      .from(stripePayments)
      .orderBy(desc(stripePayments.createdAt))
      .limit(100)

    return NextResponse.json({ payments })
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 })
  }
}

