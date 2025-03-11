// "use server";
// import { CardElement } from "@stripe/react-stripe-js";
// import Stripe from "stripe";
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const handleDonation = async (
   stripe: any,
   elements: any,
   CardElement: any,
   donationType: "one-time" | "monthly" | null,
   setDonation: any,
   //    amount: string, // Amount in XCD
   secret: string
) => {
   //    console.log(stripe, elements);
   if (!stripe || !elements) {
      return;
   }
   //    console.log("hello");
   if (donationType === "one-time") {
      const { error } = await stripe.confirmCardPayment(secret, {
         payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
               // Add billing details if needed
            },
         },
      });

      if (error) {
         console.log(error);
      } else {
         // Payment successful
         console.log("success");
         setDonation(true);
      }
   } else if (donationType === "monthly") {
      // Handle recurring payment (subscription)
      // Implement your subscription logic here
   }
};
