import Link from "next/link";

export function Footer() {
   return (
      <footer className="bg-green-900 text-white">
         <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div>
                  <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                  <address className="not-italic">
                     <p>The New National Party</p>
                     <p>St. George's, Grenada</p>
                     <p>Email: info@nnp.gd</p>
                     <p>Phone: +1 473-440-1875</p>
                  </address>
               </div>
               <div>
                  <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                  <ul className="space-y-2">
                     <li>
                        <Link href="/about">About Us</Link>
                     </li>
                     <li>
                        <Link href="/membership">Join NNP</Link>
                     </li>
                     {/* <li>
                        <Link href="/donate">Donate</Link>
                     </li> */}
                     {/* <li>
                        <Link href="/contact">Contact</Link>
                     </li> */}
                  </ul>
               </div>
               <div>
                  <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                  <ul className="space-y-2">
                     <li>
                        <Link href="https://www.facebook.com/nnpgrenada/">
                           Facebook
                        </Link>
                     </li>
                     <li>
                        <Link href="https://x.com/nnpgrenada/">Twitter</Link>
                     </li>
                     <li>
                        <Link href="https://www.instagram.com/nnpgrenada/">
                           Instagram
                        </Link>
                     </li>
                     <li>
                        <Link href="https://www.youtube.com/@nnpgrenadalive">
                           YouTube
                        </Link>
                     </li>
                     <li>
                        <Link href="https://tiktok.com/@nnpgrenada">
                           TikTok
                        </Link>
                     </li>
                     <li>
                        <Link href="https://whatsapp.com/channel/0029VaE8E5z0VycAg6YUpx0r">
                           Whatsapp
                        </Link>
                     </li>
                  </ul>
               </div>
            </div>
            <div className="mt-8 pt-8 border-t border-green-800 text-center">
               <p>
                  &copy; {new Date().getFullYear()} The New National Party. All
                  rights reserved.
               </p>
            </div>
         </div>
      </footer>
   );
}
