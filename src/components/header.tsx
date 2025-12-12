import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CustomImage } from "@/components/ui/image";

export function Header() {
   return (
      <header className="border-b relative z-50">
         <nav className="container relative mx-auto px-4 py-4 flex items-center justify-between">
            <Link
               href="/"
               className="text-2xl font-bold absolute z-[60] border -mb-6 mt-6 md:mt-12 bg-white p-1 rounded-full w-[100px] h-[100px] md:w-[120px] md:h-[120px]">
               <CustomImage
                  src={`/nnplogo.png`}
                  alt="Logo"
                  width={120}
                  height={120}
                  priority={true}
               />
            </Link>
            <div></div>
            <div className="flex gap-4 items-center">
               <Link href="/about">About</Link>
               <Link href="/blog">Press</Link>
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
