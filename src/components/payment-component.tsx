import React, { forwardRef } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Form } from "@/components/payment-form";

const PaymentComponent = forwardRef(
   ({ setPayment, payment, amount }: any, ref: any) => {
      // Load your publishable key from your environment variables
      const stripePromise = loadStripe(
         process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
      );
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
