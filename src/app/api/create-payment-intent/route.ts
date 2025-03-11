import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
   try {
      const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
      if (!stripeSecretKey) {
         throw new Error("Stripe secret key is not set");
      }

      const stripe = new Stripe(stripeSecretKey);
      const { amount } = await req.json();
      const paymentIntent = await stripe.paymentIntents.create({
         amount,
         currency: "usd",
      });
      return NextResponse.json({ clientSecret: paymentIntent.client_secret });
   } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
   }
}
