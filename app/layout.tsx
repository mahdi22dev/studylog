import type React from "react";
import type { Metadata } from "next";
import { ClerkProvider, SignedOut } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { ThemeChanger } from "@/components/use-themes";
import Link from "next/link";
import { UserButtonModel } from "@/components/user-button";
import { GlobalProvider } from "@/contexts/globalProvider";
import { Navigation } from "@/components/navigation";

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
          <GlobalProvider>
            <header className="flex justify-between items-center p-4 gap-4 h-16 border-b border-border bg-background/80 backdrop-blur sticky top-0 z-50">
              <div className="flex items-center gap-6">
                <Logo />
                <Navigation />
              </div>
              <div className="flex justify-end gap-4">
                <ThemeChanger />
                <UserButtonModel />
                <SignedOut>
                  <div className="flex justify-between gap-4">
                    <Link href="/sign-in">
                      <Button variant="outline">Sign In</Button>
                    </Link>
                    <Link href="/sign-up">
                      <Button variant="default">Sign Up</Button>
                    </Link>
                  </div>
                </SignedOut>
              </div>
            </header>
            {children}
          </GlobalProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
