import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
   return (
      <div className="container mx-auto px-4 py-12">
         <h1 className="text-4xl font-bold text-center mb-8">
            About the New National Party
         </h1>

         <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Our History</h2>
            <p className="mb-4">
               The New National Party (NNP) was founded in 1984 through the
               merger of the Grenada National Party and the National Democratic
               Party. Since its inception, the NNP has been committed to
               fostering economic growth, social development, and good
               governance in Grenada.
            </p>
            <p>
               Over the years, the NNP has played a significant role in shaping
               Grenada's political landscape, forming government multiple times
               and implementing policies aimed at improving the lives of
               Grenadians.
            </p>
         </section>

         <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Our Leadership</h2>
            <div className="grid md:grid-cols-2 gap-8">
               <Card>
                  <CardHeader>
                     <CardTitle>Party Leader</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center space-x-4">
                     <Image
                        src="/placeholder.svg?height=100&width=100"
                        alt="Party Leader"
                        width={100}
                        height={100}
                        className="rounded-full"
                     />
                     <div>
                        <h3 className="font-semibold">Dr. Keith Mitchell</h3>
                        <p className="text-sm text-muted-foreground">
                           Former Prime Minister and current Leader of the
                           Opposition
                        </p>
                     </div>
                  </CardContent>
               </Card>
               <Card>
                  <CardHeader>
                     <CardTitle>Deputy Leader</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center space-x-4">
                     <Image
                        src="/placeholder.svg?height=100&width=100"
                        alt="Deputy Leader"
                        width={100}
                        height={100}
                        className="rounded-full"
                     />
                     <div>
                        <h3 className="font-semibold">Emmalin Pierre</h3>
                        <p className="text-sm text-muted-foreground">
                           Member of Parliament for St. Andrew South East
                        </p>
                     </div>
                  </CardContent>
               </Card>
            </div>
         </section>

         <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Our Key Policies</h2>
            <div className="grid md:grid-cols-3 gap-6">
               <Card>
                  <CardHeader>
                     <CardTitle>Economic Growth</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <p>
                        Promoting sustainable economic development through
                        diversification, investment in key sectors, and support
                        for small businesses.
                     </p>
                  </CardContent>
               </Card>
               <Card>
                  <CardHeader>
                     <CardTitle>Education</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <p>
                        Investing in quality education at all levels, focusing
                        on skills development and preparing our youth for the
                        global job market.
                     </p>
                  </CardContent>
               </Card>
               <Card>
                  <CardHeader>
                     <CardTitle>Healthcare</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <p>
                        Improving healthcare infrastructure, expanding access to
                        medical services, and promoting preventive care and
                        healthy lifestyles.
                     </p>
                  </CardContent>
               </Card>
               <Card>
                  <CardHeader>
                     <CardTitle>Environmental Protection</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <p>
                        Implementing policies to protect Grenada's natural
                        resources, promote renewable energy, and build
                        resilience against climate change.
                     </p>
                  </CardContent>
               </Card>
               <Card>
                  <CardHeader>
                     <CardTitle>Tourism</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <p>
                        Enhancing Grenada's tourism product through sustainable
                        development, marketing, and improving infrastructure to
                        attract more visitors.
                     </p>
                  </CardContent>
               </Card>
               <Card>
                  <CardHeader>
                     <CardTitle>Youth Empowerment</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <p>
                        Creating opportunities for young Grenadians through
                        education, skills training, entrepreneurship support,
                        and job creation initiatives.
                     </p>
                  </CardContent>
               </Card>
            </div>
         </section>

         <section>
            <h2 className="text-2xl font-semibold mb-4">Our Commitment</h2>
            <p className="mb-4">
               The New National Party is dedicated to serving the people of
               Grenada, Carriacou, and Petite Martinique. We believe in
               transparent governance, inclusive development, and policies that
               benefit all Grenadians.
            </p>
            <p>
               As we move forward, we remain committed to our core values of
               integrity, accountability, and progress. We invite all Grenadians
               to join us in building a brighter future for our nation.
            </p>
         </section>
      </div>
   );
}
