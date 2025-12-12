import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { db } from '@/lib/db'
import { stripePayments } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
})

export async function GET() {
  try {
    const paymentIntents = await stripe.paymentIntents.list({
      limit: 100,
    })

    let synced = 0
    let skipped = 0

    for (const intent of paymentIntents.data) {
      const existing = await db
        .select()
        .from(stripePayments)
        .where(eq(stripePayments.stripePaymentId, intent.id))

      if (existing.length === 0) {
        await db.insert(stripePayments).values({
          stripePaymentId: intent.id,
          amount: intent.amount,
          currency: intent.currency,
          status: intent.status,
          customerEmail: intent.receipt_email || null,
          customerName: (intent.shipping?.name || null) as string | null,
          paymentMethod: intent.payment_method as string || null,
          description: intent.description || null,
          metadata: intent.metadata as any,
        })
        synced++
      } else {
        skipped++
      }
    }

    return NextResponse.json({
      success: true,
      synced,
      skipped,
      total: paymentIntents.data.length,
    })
  } catch (error: any) {
    console.error('Error syncing payments:', error)
    return NextResponse.json(
      { error: 'Failed to sync payments', details: error.message },
      { status: 500 }
    )
  }
}
