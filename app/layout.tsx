import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "UCARiq — UCAR's Intelligence Brain",
  description: "Natural language analytics and AI-powered command center for the UCAR network.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark", inter.variable)}>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased text-slate-200",
          inter.className
        )}
      >
        {children}
      </body>
    </html>
  );
}
