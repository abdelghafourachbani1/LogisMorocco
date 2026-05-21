import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutContent from "@/components/LayoutContent";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "LogiMorocco Admin Console",
  description: "Logistics and performance management dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="bg-[#FAFAFA] font-sans text-gray-900">
        <LayoutContent>{children}</LayoutContent>
      </body>
    </html>
  );
}
