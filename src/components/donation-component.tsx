import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { handleDonation } from "@/actions/donationActions";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

export function DonationComponent() {
   // Load your publishable key from your environment variables
   const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

   if (!stripePublicKey) {
      console.error("Stripe publishable key is not set");
      return null; // or handle the error appropriately
   }

   const stripePromise = loadStripe(stripePublicKey);

   return (
      <Elements stripe={stripePromise}>
         <Form />
      </Elements>
   );
}

export function Form() {
   const [donation, setDonation] = useState(false);
   const [donationType, setDonationType] = useState<"one-time" | "monthly">(
      "one-time"
   );
   const [amount, setAmount] = useState("");
   const [name, setName] = useState("");
   const [email, setEmail] = useState("");
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

   const handleDonation = async (
      secret: string,
      name: string,
      email: string
   ) => {
      if (!stripe || !elements) {
         return;
      }
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
         console.error("Card element not found");
         return;
      }

      // Check for customer ID in localStorage
      let customerId = localStorage.getItem("stripeCustomerId");

      if (!customerId) {
         // Create a new customer
         const customerResponse = await fetch("/api/create-customer", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               email: email, // Use the email from the form
               name: name, // Use the name from the form
            }),
         });

         const customerData = await customerResponse.json();

         if (customerData.error) {
            console.error("Error creating customer:", customerData.error);
            return;
         }

         customerId = customerData.customerId;
         if (customerId) {
            // Save the customer ID to localStorage
            localStorage.setItem("stripeCustomerId", customerId);
         }
      }

      if (donationType === "one-time") {
         const { error } = await stripe.confirmCardPayment(secret, {
            payment_method: {
               card: cardElement,
               billing_details: {
                  name: name,
                  email: email,
               },
            },
         });

         if (error) {
            console.log(error);
         } else {
            setDonation(true);
         }
      } else if (donationType === "monthly") {
         const { paymentMethod, error: paymentMethodError } =
            await stripe.createPaymentMethod({
               type: "card",
               card: cardElement,
               billing_details: {
                  name: name,
                  email: email,
               },
            });

         if (paymentMethodError) {
            console.error("Error creating payment method:", paymentMethodError);
            return;
         }

         const response = await fetch("/api/create-subscription", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               paymentMethodId: paymentMethod.id,
               amount: parseFloat(amount),
               currency: "usd",
               customerId: customerId, // Use the customer ID
            }),
         });

         const { subscriptionId, error } = await response.json();

         if (error) {
            console.error("Error creating subscription:", error);
         } else {
            setDonation(true);
         }
      }
   };

   const onSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
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

      await handleDonation(clientSecret, name, email);
      setLoading(false);
   };

   return (
      <>
         {!donation ? (
            <>
               <CardHeader>
                  <CardTitle>Support Our Campaign</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="space-y-6">
                     <form className="space-y-4" onSubmit={onSubmit}>
                        <div className="grid grid-cols-1 gap-4 w-full">
                           <div>
                              <Label htmlFor="name">Name</Label>
                              <Input
                                 id="name"
                                 type="text"
                                 placeholder="Enter your name"
                                 value={name}
                                 onChange={(e) => setName(e.target.value)}
                              />
                           </div>
                           <div>
                              <Label htmlFor="email">Email</Label>
                              <Input
                                 id="email"
                                 type="email"
                                 placeholder="Enter your email"
                                 value={email}
                                 onChange={(e) => setEmail(e.target.value)}
                              />
                           </div>
                           <RadioGroup
                              defaultValue={donationType || "one-time"}
                              onValueChange={(value) =>
                                 setDonationType(
                                    value as "one-time" | "monthly"
                                 )
                              }
                              className="flex items-center justify-around w-full">
                              <div className="flex flex-col items-center w-full">
                                 <RadioGroupItem
                                    value="one-time"
                                    id="one-time"
                                    className="hidden"
                                 />
                                 <Label
                                    htmlFor="one-time"
                                    className={`h-24 flex items-center justify-center cursor-pointer ${
                                       donationType === "one-time"
                                          ? "bg-green-600 text-white"
                                          : "bg-white text-black"
                                    } border rounded-md border-gray-300 transition duration-200 w-full`}>
                                    One-Time Donation
                                 </Label>
                              </div>
                              <div className="flex flex-col items-center w-full">
                                 <RadioGroupItem
                                    value="monthly"
                                    id="monthly"
                                    className="hidden"
                                 />
                                 <Label
                                    htmlFor="monthly"
                                    className={`h-24 flex items-center justify-center cursor-pointer ${
                                       donationType === "monthly"
                                          ? "bg-green-600 text-white"
                                          : "bg-white text-black"
                                    } border rounded-md border-gray-300 transition duration-200 w-full`}>
                                    Monthly Support
                                 </Label>
                              </div>
                           </RadioGroup>
                        </div>
                        <div>
                           <Label htmlFor="amount">Amount</Label>
                           <Input
                              id="amount"
                              type="number"
                              placeholder="Enter amount"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                           />
                        </div>
                        <div className="rounded-md border border-input px-3 py-3">
                           <CardElement />
                        </div>
                        <Button
                           type="submit"
                           disabled={loading}
                           className="w-full">
                           {loading ? "Processing..." : "Proceed to Payment"}
                        </Button>
                     </form>
                  </div>
               </CardContent>
            </>
         ) : (
            <div className="text-center py-16 px-4">
               <h2 className="text-lg font-bold">Donation received!</h2>
               <p>
                  Thank you for your donation! We sincerely appreciate your
                  support. Your contribution helps us further our mission and
                  make a difference in the community.
               </p>
            </div>
         )}
      </>
   );
}
