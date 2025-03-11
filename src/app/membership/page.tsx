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
import { useState, useRef } from "react";
import { DonationComponent } from "@/components/donation-component";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import PaymentComponent from "@/components/payment-component";

type FormData = {
   idNumber: string;
   firstName: string;
   lastName: string;
   email: string;
   phone: string;
   address: string;
   businessAddress: string;
   businessPhone: string;
   constituency: string;
   membershipType: string;
   city: string;
   state: string;
   zip: string;
   politicalPartyMember: string;
   assistanceAreas: string[];
   signature: string;
   date: string;
};

type BillingDetails = {
   name: string;
   email: string;
   address: {
      line1: string;
      city: string;
      state: string;
      postal_code: string;
   };
};

export default function MembershipPage() {
   const [membership, setMembership] = useState(false);
   const [payment, setPayment] = useState(false);
   const [billingDetails, setBillingDetails] = useState<BillingDetails | null>(
      null
   );
   const {
      register,
      handleSubmit,
      formState: { errors },
      setValue,
   } = useForm<FormData>();
   const paymentRef = useRef<any>(null); // Create a ref for the PaymentComponent

   const onSubmit: SubmitHandler<FormData> = async (data) => {
      // Set billing details
      setBillingDetails({
         name: `${data.firstName} ${data.lastName}`,
         email: data.email,
         address: {
            line1: data.address,
            city: data.city,
            state: data.state,
            postal_code: data.zip,
         },
      });

      // Call the onSubmit method of PaymentComponent
      if (paymentRef.current) {
         const paymentResponse = await paymentRef.current.onSubmit();
         if (!paymentResponse) {
            console.error("Payment failed, not submitting the form.");
            return; // Stop the form submission if payment fails
         }
      }

      // Proceed with sending data to Odoo
      setMembership(true);
      await sendToOdoo(data);
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
                        <form
                           className="space-y-6"
                           onSubmit={handleSubmit(onSubmit)}>
                           <div className="grid gap-4">
                              <div className="grid gap-2">
                                 <Label htmlFor="id-number">ID Number</Label>
                                 <Input
                                    id="id-number"
                                    placeholder="Enter your ID number"
                                    {...register("idNumber", {
                                       required: true,
                                    })}
                                 />
                                 {errors.idNumber && (
                                    <span className="text-red-500">
                                       This field is required
                                    </span>
                                 )}
                              </div>
                              <div className="grid gap-2">
                                 <Label htmlFor="firstName">First name</Label>
                                 <Input
                                    id="firstName"
                                    placeholder="Enter your first name"
                                    {...register("firstName", {
                                       required: true,
                                    })}
                                 />
                                 {errors.firstName && (
                                    <span className="text-red-500">
                                       This field is required
                                    </span>
                                 )}
                              </div>
                              <div className="grid gap-2">
                                 <Label htmlFor="lastName">Last name</Label>
                                 <Input
                                    id="lastName"
                                    placeholder="Enter your last name"
                                    {...register("lastName", {
                                       required: true,
                                    })}
                                 />
                                 {errors.lastName && (
                                    <span className="text-red-500">
                                       This field is required
                                    </span>
                                 )}
                              </div>
                              <div className="grid gap-2">
                                 <Label htmlFor="home-address">
                                    Home Address
                                 </Label>
                                 <Input
                                    id="home-address"
                                    placeholder="Enter your home address"
                                    {...register("address", { required: true })}
                                 />
                                 {errors.address && (
                                    <span className="text-red-500">
                                       This field is required
                                    </span>
                                 )}
                              </div>
                              <div className="grid gap-2">
                                 <Label htmlFor="home-phone">
                                    Home Phone Number
                                 </Label>
                                 <Input
                                    id="home-phone"
                                    type="tel"
                                    placeholder="e.g., 473-123-4567"
                                    {...register("phone", { required: true })}
                                 />
                                 {errors.phone && (
                                    <span className="text-red-500">
                                       This field is required
                                    </span>
                                 )}
                              </div>
                              <div className="grid gap-2">
                                 <Label htmlFor="business-address">
                                    Business Address
                                 </Label>
                                 <Input
                                    id="business-address"
                                    placeholder="Enter your business address"
                                    {...register("businessAddress", {
                                       required: true,
                                    })}
                                 />
                                 {errors.businessAddress && (
                                    <span className="text-red-500">
                                       This field is required
                                    </span>
                                 )}
                              </div>
                              <div className="grid gap-2">
                                 <Label htmlFor="business-phone">
                                    Business Phone Number
                                 </Label>
                                 <Input
                                    id="business-phone"
                                    type="tel"
                                    placeholder="e.g., 473-765-4321"
                                    {...register("businessPhone", {
                                       required: true,
                                    })}
                                 />
                                 {errors.businessPhone && (
                                    <span className="text-red-500">
                                       This field is required
                                    </span>
                                 )}
                              </div>

                              <div className="grid gap-2">
                                 <Label htmlFor="email">E-mail Address</Label>
                                 <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email address"
                                    {...register("email", { required: true })}
                                 />
                                 {errors.email && (
                                    <span className="text-red-500">
                                       This field is required
                                    </span>
                                 )}
                              </div>
                              <div className="grid gap-2">
                                 <Label htmlFor="constituency">
                                    Constituency
                                 </Label>
                                 <Select
                                    {...register("constituency", {
                                       required: true,
                                    })}
                                    onValueChange={(value) =>
                                       setValue("constituency", value)
                                    }
                                    defaultValue="">
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
                                 {errors.constituency && (
                                    <span className="text-red-500">
                                       This field is required
                                    </span>
                                 )}
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
                                    <RadioGroupItem
                                       value="no"
                                       id="no"
                                       {...register("politicalPartyMember")}
                                    />
                                    <Label htmlFor="no">No</Label>
                                 </div>
                                 <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                       value="yes"
                                       id="yes"
                                       {...register("politicalPartyMember")}
                                    />
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
                                    <Checkbox
                                       id="house"
                                       {...register("assistanceAreas")}
                                       value="house"
                                    />
                                    <Label htmlFor="house">
                                       House to House Visits
                                    </Label>
                                 </div>
                                 <div className="flex items-center space-x-2">
                                    <Checkbox
                                       id="speaking"
                                       {...register("assistanceAreas")}
                                       value="speaking"
                                    />
                                    <Label htmlFor="speaking">
                                       Speaking Assignments
                                    </Label>
                                 </div>
                                 <div className="flex items-center space-x-2">
                                    <Checkbox
                                       id="campaign"
                                       {...register("assistanceAreas")}
                                       value="campaign"
                                    />
                                    <Label htmlFor="campaign">
                                       Campaign Activity
                                    </Label>
                                 </div>
                                 <div className="flex items-center space-x-2">
                                    <Checkbox
                                       id="research"
                                       {...register("assistanceAreas")}
                                       value="research"
                                    />
                                    <Label htmlFor="research">
                                       Research Activities
                                    </Label>
                                 </div>
                                 <div className="flex items-center space-x-2">
                                    <Checkbox
                                       id="youth"
                                       {...register("assistanceAreas")}
                                       value="youth"
                                    />
                                    <Label htmlFor="youth">
                                       Youth Organization
                                    </Label>
                                 </div>
                                 <div className="flex items-center space-x-2">
                                    <Checkbox
                                       id="membership"
                                       {...register("assistanceAreas")}
                                       value="membership"
                                    />
                                    <Label htmlFor="membership">
                                       Membership Drive
                                    </Label>
                                 </div>
                                 <div className="flex items-center space-x-2">
                                    <Checkbox
                                       id="fund"
                                       {...register("assistanceAreas")}
                                       value="fund"
                                    />
                                    <Label htmlFor="fund">Fund Raising</Label>
                                 </div>
                                 <div className="flex items-center space-x-2">
                                    <Checkbox
                                       id="public"
                                       {...register("assistanceAreas")}
                                       value="public"
                                    />
                                    <Label htmlFor="public">
                                       Public Relations
                                    </Label>
                                 </div>
                                 <div className="flex items-center space-x-2">
                                    <Checkbox
                                       id="branch"
                                       {...register("assistanceAreas")}
                                       value="branch"
                                    />
                                    <Label htmlFor="branch">
                                       Branch Organization
                                    </Label>
                                 </div>
                                 <div className="flex items-center space-x-2">
                                    <Checkbox
                                       id="enumeration"
                                       {...register("assistanceAreas")}
                                       value="enumeration"
                                    />
                                    <Label htmlFor="enumeration">
                                       Enumeration
                                    </Label>
                                 </div>
                                 <div className="flex items-center space-x-2">
                                    <Checkbox
                                       id="transportation"
                                       {...register("assistanceAreas")}
                                       value="transportation"
                                    />
                                    <Label htmlFor="transportation">
                                       Transportation
                                    </Label>
                                 </div>
                                 <div className="flex items-center space-x-2">
                                    <Checkbox
                                       id="other"
                                       {...register("assistanceAreas")}
                                       value="other"
                                    />
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
                              <PaymentComponent
                                 ref={paymentRef}
                                 setPayment={setPayment}
                                 payment={payment}
                                 amount={5}
                                 billingDetails={billingDetails}
                              />
                           </div>

                           <div className="grid gap-4">
                              <div className="grid gap-2">
                                 <Label htmlFor="signature">
                                    Signature of Applicant
                                 </Label>
                                 <Input
                                    id="signature"
                                    {...register("signature", {
                                       required: true,
                                    })}
                                 />
                                 {errors.signature && (
                                    <span className="text-red-500">
                                       This field is required
                                    </span>
                                 )}
                              </div>
                              <div className="grid gap-2">
                                 <Label htmlFor="date">Date</Label>
                                 <Input
                                    id="date"
                                    type="date"
                                    {...register("date", { required: true })}
                                 />
                                 {errors.date && (
                                    <span className="text-red-500">
                                       This field is required
                                    </span>
                                 )}
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
            <Card className="max-w-3xl mx-auto">
               {!membership ? (
                  <div className="text-center py-16 px-4">
                     <h2 className="text-lg font-bold">Make a Donation</h2>
                     <p>
                        Your contribution helps us further our mission and make
                        a difference in the community.
                     </p>
                  </div>
               ) : (
                  <DonationComponent />
               )}
            </Card>
         </div>
      </>
   );
}

async function sendToOdoo(data: FormData) {
   try {
      const accessToken = process.env.NEXT_PUBLIC_ODOO_ACCESS_TOKEN;
      const response = await fetch(
         "https://new-national-party1.odoo.com/api/v1/leads",
         {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
               data: {
                  first_name: data.firstName,
                  last_name: data.lastName,
                  email: data.email,
                  phone: data.phone,
                  address: data.address,
                  business_address: data.businessAddress,
                  business_phone: data.businessPhone,
                  constituency: data.constituency,
                  membership_type: data.membershipType,
                  city: data.city,
                  state: data.state,
                  zip: data.zip,
                  political_party_member: data.politicalPartyMember,
                  assistance_areas: data.assistanceAreas.join(", "),
                  role: "member",
               },
            }),
         }
      );

      if (!response.ok) {
         const errorData = await response.json();
         console.error("Failed to send data to Odoo:", errorData);
      } else {
         console.log("Data sent successfully to Odoo");
      }
   } catch (error) {
      console.error("Error sending data to Odoo:", error);
   }
}
