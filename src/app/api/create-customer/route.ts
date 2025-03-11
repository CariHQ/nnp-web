import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request) {
   try {
      const billingDetails = await request.json();
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
      // Create a new customer in Stripe
      const customer = await stripe.customers.create({
         name: billingDetails?.name,
         email: billingDetails?.email,
         address: {
            line1: billingDetails?.address?.line1,
            city: billingDetails?.address?.city,
            state: billingDetails?.address?.state,
            postal_code: billingDetails?.address?.postal_code,
         },
      });

      return NextResponse.json({ customerId: customer.id });
   } catch (error) {
      console.error("Error creating customer:", error);
      return NextResponse.json(
         { error: "Failed to create customer" },
         { status: 500 }
      );
   }
}
