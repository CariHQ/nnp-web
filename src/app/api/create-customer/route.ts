import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
   const billingDetails = await request.json();

   try {
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
