import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
   try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
      const { amount, customerId } = await req.json();

      // Create a subscription with the metered price
      const subscription = await stripe.subscriptions.create({
         customer: customerId,
         items: [
            {
               price: process.env.STRIPE_METERED_PRICE_ID, // Your metered price ID
               metadata: {
                  monthly_amount: amount, // Store the chosen amount in metadata
               },
            },
         ],
      });

      // Report initial usage for the subscription
      await stripe.subscriptionItems.createUsageRecord(
         subscription.items.data[0].id,
         {
            quantity: amount,
            timestamp: "now",
            action: "set",
         }
      );

      return NextResponse.json({ subscriptionId: subscription.id });
   } catch (error) {
      console.error("Error creating subscription:", error);
      return NextResponse.json(
         { error: "Failed to create subscription" },
         { status: 500 }
      );
   }
}
