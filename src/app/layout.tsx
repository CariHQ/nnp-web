import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import type React from "react"; // Added import for React

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
   title: "The New National Party - Grenada",
   description: "Official website of the New National Party (NNP) of Grenada",
};

export default function RootLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <html lang="en">
         <body className={inter.className}>
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
         </body>
      </html>
   );
}

// import "./globals.css";
