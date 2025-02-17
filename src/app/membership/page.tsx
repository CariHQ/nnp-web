"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
   Select,
   SelectTrigger,
   SelectValue,
   SelectContent,
   SelectItem,
} from "@/components/ui/select";
import { useState } from "react";

export default function MembershipPage() {
   const [membership, setMembership] = useState(false);
   const [donation, setDonation] = useState(false);

   const handleMembership = (e: any) => {
      e.preventDefault();
      setMembership(true);
   };

   const handleDonation = (e: any) => {
      e.preventDefault();
      setDonation(true);
   };

   return (
      <>
         <div className="container mx-auto px-4 py-12">
            <Card className="max-w-3xl mx-auto">
               {!membership ? (
                  <>
                     <CardHeader>
                        <CardTitle className="text-center">
                           NNP Membership Application
                        </CardTitle>
                     </CardHeader>
                     <CardContent>
                        <form className="space-y-6" onSubmit={handleMembership}>
                           <div className="grid gap-4">
                              <div className="grid gap-2">
                                 <Label htmlFor="id-number">ID Number</Label>
                                 <Input
                                    id="id-number"
                                    placeholder="Enter your ID number"
                                 />
                              </div>
                              <div className="grid gap-2">
                                 <Label htmlFor="name">Name (Mr./Ms.)</Label>
                                 <Input
                                    id="name"
                                    placeholder="Enter your full name"
                                 />
                              </div>
                              <div className="grid gap-2">
                                 <Label htmlFor="home-address">
                                    Home Address
                                 </Label>
                                 <Input
                                    id="home-address"
                                    placeholder="Enter your home address"
                                 />
                              </div>
                              <div className="grid gap-2">
                                 <Label htmlFor="home-phone">
                                    Home Phone Number
                                 </Label>
                                 <Input
                                    id="home-phone"
                                    type="tel"
                                    placeholder="e.g., 473-123-4567"
                                 />
                              </div>
                              <div className="grid gap-2">
                                 <Label htmlFor="business-address">
                                    Business Address
                                 </Label>
                                 <Input
                                    id="business-address"
                                    placeholder="Enter your business address"
                                 />
                              </div>
                              <div className="grid gap-2">
                                 <Label htmlFor="business-phone">
                                    Business Phone Number
                                 </Label>
                                 <Input
                                    id="business-phone"
                                    type="tel"
                                    placeholder="e.g., 473-765-4321"
                                 />
                              </div>

                              <div className="grid gap-2">
                                 <Label htmlFor="email">E-mail Address</Label>
                                 <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email address"
                                 />
                              </div>
                              <div className="grid gap-2">
                                 <Label htmlFor="constituency">
                                    Constituency
                                 </Label>
                                 <Select id="constituency">
                                    <SelectTrigger>
                                       <SelectValue placeholder="Select your constituency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                       <SelectItem value="saint_george_north_east">
                                          Saint George North East
                                       </SelectItem>
                                       <SelectItem value="saint_george_north_west">
                                          Saint George North West
                                       </SelectItem>
                                       <SelectItem value="saint_george_south">
                                          Saint George South
                                       </SelectItem>
                                       <SelectItem value="saint_george_south_east">
                                          Saint George South East
                                       </SelectItem>
                                       <SelectItem value="saint_john">
                                          Saint John
                                       </SelectItem>
                                       <SelectItem value="saint_mark">
                                          Saint Mark
                                       </SelectItem>
                                       <SelectItem value="saint_patrick_east">
                                          Saint Patrick East
                                       </SelectItem>
                                       <SelectItem value="saint_patrick_west">
                                          Saint Patrick West
                                       </SelectItem>
                                       <SelectItem value="saint_andrew_north_east">
                                          Saint Andrew North East
                                       </SelectItem>
                                       <SelectItem value="saint_andrew_north_west">
                                          Saint Andrew North West
                                       </SelectItem>
                                       <SelectItem value="saint_andrew_south_east">
                                          Saint Andrew South East
                                       </SelectItem>
                                       <SelectItem value="saint_andrew_south_west">
                                          Saint Andrew South West
                                       </SelectItem>
                                       <SelectItem value="saint_david">
                                          Saint David
                                       </SelectItem>
                                       <SelectItem value="town_of_st_george">
                                          Town of St. George
                                       </SelectItem>
                                       <SelectItem value="carriacou_and_petite_martinique">
                                          Carriacou and Petite Martinique
                                       </SelectItem>
                                    </SelectContent>
                                 </Select>
                              </div>
                           </div>

                           <div>
                              <Label>
                                 Have you been a member of any political party?
                              </Label>
                              <RadioGroup
                                 defaultValue="no"
                                 className="flex gap-4 mt-2">
                                 <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="no" id="no" />
                                    <Label htmlFor="no">No</Label>
                                 </div>
                                 <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="yes" id="yes" />
                                    <Label htmlFor="yes">Yes</Label>
                                 </div>
                              </RadioGroup>
                           </div>

                           <div>
                              <Label>
                                 Areas you would be willing to assist:
                              </Label>
                              <div className="grid grid-cols-2 gap-4 mt-2">
                                 <div className="flex items-center space-x-2">
                                    <Checkbox id="house" />
                                    <Label htmlFor="house">
                                       House to House Visits
                                    </Label>
                                 </div>
                                 <div className="flex items-center space-x-2">
                                    <Checkbox id="speaking" />
                                    <Label htmlFor="speaking">
                                       Speaking Assignments
                                    </Label>
                                 </div>
                                 <div className="flex items-center space-x-2">
                                    <Checkbox id="campaign" />
                                    <Label htmlFor="campaign">
                                       Campaign Activity
                                    </Label>
                                 </div>
                                 <div className="flex items-center space-x-2">
                                    <Checkbox id="research" />
                                    <Label htmlFor="research">
                                       Research Activities
                                    </Label>
                                 </div>
                                 <div className="flex items-center space-x-2">
                                    <Checkbox id="youth" />
                                    <Label htmlFor="youth">
                                       Youth Orgaization
                                    </Label>
                                 </div>
                                 <div className="flex items-center space-x-2">
                                    <Checkbox id="membership" />
                                    <Label htmlFor="membership">
                                       Membership Drive
                                    </Label>
                                 </div>
                                 <div className="flex items-center space-x-2">
                                    <Checkbox id="fund" />
                                    <Label htmlFor="fund">Fund Raising</Label>
                                 </div>
                                 <div className="flex items-center space-x-2">
                                    <Checkbox id="pubilc" />
                                    <Label htmlFor="public">
                                       Public Relations
                                    </Label>
                                 </div>
                                 <div className="flex items-center space-x-2">
                                    <Checkbox id="branch" />
                                    <Label htmlFor="branch">
                                       Branch Organization
                                    </Label>
                                 </div>
                                 <div className="flex items-center space-x-2">
                                    <Checkbox id="enumeration" />
                                    <Label htmlFor="enumeration">
                                       Enumeration
                                    </Label>
                                 </div>
                                 <div className="flex items-center space-x-2">
                                    <Checkbox id="transportation" />
                                    <Label htmlFor="transportation">
                                       Transportation
                                    </Label>
                                 </div>
                                 <div className="flex items-center space-x-2">
                                    <Checkbox id="other" />
                                    <Label htmlFor="other">Other</Label>
                                 </div>
                              </div>
                           </div>

                           <div className="space-y-2">
                              <Label>Declaration</Label>
                              <p className="text-sm text-muted-foreground">
                                 I affirm my loyalty to the Party and pledge to
                                 abide by its Rules and Regulations. I agree to
                                 pay the registration fee of $5.00 and monthly
                                 membership fee of $5.00.
                              </p>
                           </div>

                           <div className="grid gap-4">
                              <div className="grid gap-2">
                                 <Label htmlFor="signature">
                                    Signature of Applicant
                                 </Label>
                                 <Input id="signature" />
                              </div>
                              <div className="grid gap-2">
                                 <Label htmlFor="date">Date</Label>
                                 <Input id="date" type="date" />
                              </div>
                           </div>

                           <Button type="submit" className="w-full">
                              Submit Application
                           </Button>
                        </form>
                     </CardContent>
                  </>
               ) : (
                  <div className="text-center py-16 px-4">
                     <h2 className="text-lg font-bold">
                        Membership application submitted!
                     </h2>
                     <p>
                        Thank you for your application! We sincerely appreciate
                        your support.
                     </p>
                     <p>
                        After becoming a member, you can also choose to make a
                        donation to further support our cause.
                     </p>
                  </div>
               )}
            </Card>
         </div>

         <div className="container mx-auto px-4 py-12">
            <Card className="max-w-3xl mx-auto ">
               {!membership && !donation && (
                  <div className="text-center py-16 px-4">
                     <h2 className="text-lg font-bold">Make a Donation</h2>
                     <p>
                        {/* Thank you for your donation! We sincerely appreciate your support.  */}
                        Your contribution helps us further our mission and make
                        a difference in the community.
                     </p>
                  </div>
               )}
               {membership && !donation && (
                  <>
                     <CardHeader>
                        <CardTitle>Support Our Campaign</CardTitle>
                     </CardHeader>
                     <CardContent>
                        <div className="space-y-6">
                           <form
                              className="space-y-4"
                              onSubmit={handleDonation}>
                              <div className="grid grid-cols-2 gap-4">
                                 <Button variant="outline" className="h-24">
                                    One-Time Donation
                                 </Button>
                                 <Button variant="outline" className="h-24">
                                    Monthly Support
                                 </Button>
                              </div>
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
                  </>
               )}
               {membership && donation && (
                  <div className="text-center py-16 px-4">
                     <h2 className="text-lg font-bold">Donation received!</h2>
                     <p>
                        Thank you for your donation! We sincerely appreciate
                        your support. Your contribution helps us further our
                        mission and make a difference in the community.
                     </p>
                  </div>
               )}
            </Card>
         </div>
      </>
   );
}
