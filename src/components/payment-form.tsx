import React, { forwardRef, useImperativeHandle, useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

export const Form = forwardRef(
   ({ payment, setPayment, amount, billingDetails }: any, ref: any) => {
      const [loading, setLoading] = useState(false);
      const stripe = useStripe();
      const elements = useElements();

      const getExchangeRate = async (): Promise<number> => {
         const response = await fetch(
            "https://api.exchangerate-api.com/v4/latest/USD"
         ); // Example API
         const data = await response.json();
         return data.rates.XCD; // Get the rate for XCD
      };

      const createSubscription = async (
         amountInUSD: number,
         customerId: string
      ) => {
         const response = await fetch("/api/create-subscription", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               amount: Math.round(amountInUSD * 100),
               customerId,
            }),
         });

         const { subscriptionId } = await response.json();
         return subscriptionId;
      };

      const createCustomer = async () => {
         const response = await fetch("/api/create-customer", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(billingDetails),
         });

         const { customerId } = await response.json();
         localStorage.setItem("customerId", customerId);
         return customerId;
      };

      const handlePayment = async (
         secret: string,
         isRecurring: boolean,
         amountInUSD: number
      ) => {
         if (!stripe || !elements) {
            return;
         }
         const cardElement = elements.getElement(CardElement);
         if (!cardElement) {
            console.error("CardElement not found");
            return;
         }

         // Create customer before confirming payment
         const customerId = await createCustomer();

         const { error } = await stripe.confirmCardPayment(secret, {
            payment_method: {
               card: cardElement,
               billing_details: billingDetails,
            },
         });

         if (error) {
            console.log(error);
         } else {
            // Payment successful
            setPayment(true);
            if (isRecurring) {
               await createSubscription(amountInUSD, customerId);
            }
         }
      };

      useImperativeHandle(ref, () => ({
         onSubmit: async (isRecurring: boolean = false) => {
            setLoading(true);
            const conversionRate = await getExchangeRate();
            const amountInUSD = parseFloat(amount) / conversionRate;

            // Fetch the client secret from the server
            const response = await fetch("/api/create-payment-intent", {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
               },
               body: JSON.stringify({ amount: Math.round(amountInUSD * 100) }),
            });

            const { clientSecret } = await response.json();

            await handlePayment(clientSecret, isRecurring, amountInUSD);
            setLoading(false);
            return true;
         },
      }));

      return (
         <>
            {!payment ? (
               <>
                  <div className="rounded-md border border-input px-3 py-3">
                     <CardElement />
                  </div>
               </>
            ) : (
               <div className="text-center py-4 px-4">
                  <h2 className="text-lg font-bold">Payment received!</h2>
               </div>
            )}
         </>
      );
   }
);
