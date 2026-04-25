import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import EduBot from "@/components/EduBot";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "EduBag | Your Ultimate Educational Guide",
  description: "Explore a wealth of resources, including learning material, recommended courses and past examination questions, to ace your exams with confidence.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "EduBag | Your Ultimate Educational Guide",
    description: "Explore learning material, recommended courses and past examination questions.",
    images: ["/images/logo.png"],
    url: "https://edubag.in",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen bg-white dark:bg-black text-slate-900 dark:text-slate-100 flex flex-col`}>
        <Navbar />
        <main className="flex-grow pt-16 pb-20 md:pb-0">
          {children}
        </main>
        <EduBot />
        <BottomNav />
        <Footer />
      </body>
    </html>
  );
}
