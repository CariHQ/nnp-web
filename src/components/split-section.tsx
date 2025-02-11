import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function SplitSection() {
   return (
      <section id="donate" className="grid md:grid-cols-2">
         <div className="bg-green-50 p-8 md:p-12 lg:p-16">
            <Card>
               <CardHeader>
                  <CardTitle>Volunteer With Us</CardTitle>
               </CardHeader>
               <CardContent>
                  <form className="space-y-4">
                     <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="Enter your name" />
                     </div>
                     <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                           id="email"
                           type="email"
                           placeholder="Enter your email"
                        />
                     </div>
                     <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                           id="phone"
                           type="tel"
                           placeholder="Enter your phone number"
                        />
                     </div>
                     <div>
                        <Label htmlFor="message">
                           How would you like to help?
                        </Label>
                        <Textarea
                           id="message"
                           placeholder="Tell us about your interests"
                        />
                     </div>
                     <Button type="submit" className="w-full">
                        Submit
                     </Button>
                  </form>
               </CardContent>
            </Card>
         </div>
         <div className="bg-green-100 p-8 md:p-12 lg:p-16">
            <Card>
               <CardHeader>
                  <CardTitle>Support Our Campaign</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="space-y-6">
                     <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" className="h-24">
                           One-Time Donation
                        </Button>
                        <Button variant="outline" className="h-24">
                           Monthly Support
                        </Button>
                     </div>
                     <form className="space-y-4">
                        <div>
                           <Label htmlFor="amount">Amount</Label>
                           <Input
                              id="amount"
                              type="number"
                              placeholder="Enter amount"
                           />
                        </div>
                        <Button type="submit" className="w-full">
                           Proceed to Payment
                        </Button>
                     </form>
                  </div>
               </CardContent>
            </Card>
         </div>
      </section>
   );
}
