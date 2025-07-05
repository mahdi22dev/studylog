import type React from "react";
import type { Metadata } from "next";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "next-themes";

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
      <html
        lang="en"
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable}`}
      >
        <Toaster richColors />
        <body className="antialiased">
          <header className="flex justify-between items-center p-4 gap-4 h-16">
            <Logo />
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <div className="flex justify-between gap-4">
                <SignInButton mode="redirect">
                  <Button variant="outline">Sign In</Button>
                </SignInButton>
                <SignUpButton mode="redirect">
                  <Button variant="default">Sign Up</Button>
                </SignUpButton>
              </div>
            </SignedOut>
          </header>
          <ThemeProvider>{children}</ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
