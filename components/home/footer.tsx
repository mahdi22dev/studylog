import Link from "next/link";
import { Logo } from "@/components/logo";

export function Footer() {
  return (
    <footer className="relative z-10 w-full py-12 md:py-16 bg-[#0b0e15] border-t border-white/5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 px-6 max-w-[1200px] mx-auto">
        {/* Centered logo */}
        <div className="col-span-2 md:col-span-4 flex justify-center mb-4 md:mb-6">
          <Logo />
        </div>

        {/* Product */}
        <div className="flex flex-col gap-2.5 items-start text-left">
          <h4 className="text-sm font-semibold tracking-wide mb-1 text-white">
            Product
          </h4>
          <a
            href="/#features"
            className="text-sm text-[#c9c3d9] hover:text-[#38dfab] transition-colors"
          >
            Features
          </a>
          <a
            href="/#pricing"
            className="text-sm text-[#c9c3d9] hover:text-[#38dfab] transition-colors"
          >
            Pricing
          </a>
          <a
            href="#"
            className="text-sm text-[#c9c3d9] hover:text-[#38dfab] transition-colors"
          >
            Changelog
          </a>
          <a
            href="#"
            className="text-sm text-[#c9c3d9] hover:text-[#38dfab] transition-colors"
          >
            Roadmap
          </a>
        </div>

        {/* Company */}
        <div className="flex flex-col gap-2.5 items-start text-left">
          <h4 className="text-sm font-semibold tracking-wide mb-1 text-white">
            Company
          </h4>
          <a
            href="#"
            className="text-sm text-[#c9c3d9] hover:text-[#38dfab] transition-colors"
          >
            About Us
          </a>
          <Link
            href="/blog"
            className="text-sm text-[#c9c3d9] hover:text-[#38dfab] transition-colors"
          >
            Blog
          </Link>
          <a
            href="#"
            className="text-sm text-[#c9c3d9] hover:text-[#38dfab] transition-colors"
          >
            Contact
          </a>
        </div>

        {/* Legal */}
        <div className="flex flex-col gap-2.5 items-start text-left">
          <h4 className="text-sm font-semibold tracking-wide mb-1 text-white">
            Legal
          </h4>
          <a
            href="#"
            className="text-sm text-[#c9c3d9] hover:text-[#38dfab] transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-sm text-[#c9c3d9] hover:text-[#38dfab] transition-colors"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="text-sm text-[#c9c3d9] hover:text-[#38dfab] transition-colors"
          >
            Cookie Policy
          </a>
        </div>

        {/* Support */}
        <div className="flex flex-col gap-2.5 items-start text-left">
          <h4 className="text-sm font-semibold tracking-wide mb-1 text-white">
            Support
          </h4>
          <a
            href="#"
            className="text-sm text-[#c9c3d9] hover:text-[#38dfab] transition-colors"
          >
            Help Center
          </a>
          <a
            href="#"
            className="text-sm text-[#c9c3d9] hover:text-[#38dfab] transition-colors"
          >
            FAQs
          </a>
        </div>

        {/* Copyright */}
        <div className="col-span-2 md:col-span-4 text-center mt-6 md:mt-8 pt-6 border-t border-white/5">
          <p className="text-xs md:text-sm text-[#c9c3d9]">
            © {new Date().getFullYear()} Focurio. Intelligent Immersion for
            High-Performance Minds.
          </p>
        </div>
      </div>
    </footer>
  );
}
