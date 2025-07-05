import type React from "react";
import type { Metadata } from "next";
import { ClerkProvider, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthButtons } from "@/components/auth-buttons";
import { Logo } from "@/components/logo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Study Log",
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
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
        <Toaster richColors />
        <body className="antialiased">
          <header className="flex justify-between items-center p-4 gap-4 h-16 backdrop-blur-sm bg-gradient-to-br from-purple-50/80 via-white/70 to-violet-50/80 border-b border-violet-100 shadow-sm">
            <Logo />
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <AuthButtons />
            </SignedOut>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
