import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Header() {
   return (
      <header className="border-b">
         <nav className="container relative mx-auto px-4 py-4 flex items-center justify-between">
            <Link
               href="/"
               className="text-2xl font-bold absolute z-20 border -mb-6 mt-6 md:mt-12 bg-white p-1 rounded-full w-[100px] h-[100px] md:w-[120px] md:h-[120px]">
               <Image src="/nnplogo.png" alt="Logo" width={120} height={120} />
            </Link>
            <div></div>
            <div className="flex gap-4 items-center">
               <Link href="/about">About</Link>
               <Link href="/membership">Join Us</Link>
               {/* <Link href="/gallery">Gallery</Link> */}
               <Button asChild variant="secondary">
                  <Link href="/#donate">Donate</Link>
               </Button>
            </div>
         </nav>
      </header>
   );
}
