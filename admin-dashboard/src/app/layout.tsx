import type { Metadata } from "next";
import "./globals.css";
import ToastContainer from "@/components/ToastContainer";
import ConfirmDialog from "@/components/ConfirmDialog";

export const metadata: Metadata = {
  title: "EduBag Admin — Control Center",
  description: "EduBag Owner Admin Dashboard",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0f]">
        <ToastContainer />
        <ConfirmDialog />
        {children}
      </body>
    </html>
  );
}
