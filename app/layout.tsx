import type React from "react";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { GlobalProvider } from "@/contexts/globalProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Focurio | Intelligent Immersion",
  description:
    "Transform your learning journey with focused study sessions and intelligent progress tracking",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        suppressHydrationWarning
        className={`${inter.variable} ${sora.variable}`}
      >
        <Toaster richColors />
        <body className="antialiased">
          <GlobalProvider>{children}</GlobalProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
