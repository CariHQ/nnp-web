import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { db } from '@/lib/db'
import { stripePayments } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      
      const existing = await db
        .select()
        .from(stripePayments)
        .where(eq(stripePayments.stripePaymentId, paymentIntent.id))

      if (existing.length === 0) {
        await db.insert(stripePayments).values({
          stripePaymentId: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: 'succeeded',
          customerEmail: paymentIntent.receipt_email || null,
          customerName: (paymentIntent.shipping?.name || null) as string | null,
          paymentMethod: paymentIntent.payment_method as string || null,
          description: paymentIntent.description || null,
          metadata: paymentIntent.metadata as any,
        })
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
