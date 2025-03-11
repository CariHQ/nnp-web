"use client";
import React, { forwardRef } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Form } from "@/components/payment-form";

const PaymentComponent = forwardRef(
   ({ setPayment, payment, amount }: any, ref: any) => {
      // Load your publishable key from your environment variables
      const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

      if (!stripePublicKey) {
         console.error("Stripe publishable key is not set");
         return null; // or handle the error appropriately
      }

      const stripePromise = loadStripe(stripePublicKey);

      return (
         <Elements stripe={stripePromise}>
            <Form
               ref={ref}
               payment={payment}
               setPayment={setPayment}
               amount={amount}
            />
         </Elements>
      );
   }
);

export default PaymentComponent;
