import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import TopHeader from "./TopHeader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fraud Prevention",
  description:
    "Protect your finances and secure your transactions with our advanced credit card fraud prevention platform. ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className + " px-24 "}>
        <Toaster richColors />
        <TopHeader />
        {children}
      </body>
    </html>
  );
}
