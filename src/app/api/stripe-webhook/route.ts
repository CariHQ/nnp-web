import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import Stripe from 'stripe'
import { db } from '@/lib/db'
import { stripePayments } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// Lazy initialization to avoid build-time errors
function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-02-24.acacia',
  })
}

function getWebhookSecret() {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not configured')
  }
  return process.env.STRIPE_WEBHOOK_SECRET
}

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    const stripe = getStripe()
    const webhookSecret = getWebhookSecret()
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
