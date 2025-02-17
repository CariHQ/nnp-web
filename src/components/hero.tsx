import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CustomImage } from "@/components/ui/image";

export function Hero() {
   return (
      <div className="relative h-[80vh] flex items-center justify-center bg-linear-to-r from-green-600 to-green-800 text-white">
         <div className="absolute inset-0 bg-black/50 w-full h-full">
            <CustomImage
               src={`/carenage.jpg`}
               alt="Hero Image"
               width={500}
               height={500}
               className="absolute inset-0 object-cover w-full h-full opacity-20"
            />
         </div>
         <div className="absolute inset-0 bg-black/50" />

         <div className="relative z-10 text-center space-y-6 max-w-3xl mx-auto px-4">
            <h1 className="text-5xl font-bold">
               Building a Stronger Grenada Together
            </h1>
            <p className="text-xl">
               Join the New National Party in shaping the future of our nation
            </p>
            <div className="flex gap-4 justify-center">
               <Button asChild size="lg" variant="secondary">
                  <Link href="/membership">Become a Member</Link>
               </Button>
               <Button asChild size="lg">
                  <Link href="#donate">Donate</Link>
               </Button>
            </div>
         </div>
      </div>
   );
}
