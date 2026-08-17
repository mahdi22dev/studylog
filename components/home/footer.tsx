import { Timer } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative z-10 w-full py-16 bg-[#0b0e15] border-t border-white/5">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 px-6 max-w-[1200px] mx-auto">
        {/* Centered logo */}
        <div className="col-span-1 md:col-span-4 flex justify-center mb-6">
          <div className="flex items-center gap-2">
            <Timer className="h-6 w-6 text-[#c9beff]" />
            <span className="font-heading text-xl font-bold text-[#c9beff]">
              Focurio
            </span>
          </div>
        </div>

        {/* Product */}
        <div className="flex flex-col gap-3 items-center md:items-start text-center md:text-left">
          <h4 className="text-sm font-semibold tracking-wide mb-1">
            Product
          </h4>
          <Link
            href="/timer"
            className="text-sm text-[#c9c3d9] hover:text-[#38dfab] transition-colors"
          >
            Timer
          </Link>
          <Link
            href="/notes"
            className="text-sm text-[#c9c3d9] hover:text-[#38dfab] transition-colors"
          >
            Notes
          </Link>
          <Link
            href="/schedule"
            className="text-sm text-[#c9c3d9] hover:text-[#38dfab] transition-colors"
          >
            Schedule
          </Link>
        </div>

        {/* Company */}
        <div className="flex flex-col gap-3 items-center md:items-start text-center md:text-left">
          <h4 className="text-sm font-semibold tracking-wide mb-1">
            Company
          </h4>
          <a
            href="#"
            className="text-sm text-[#c9c3d9] hover:text-[#38dfab] transition-colors"
          >
            About Us
          </a>
          <a
            href="https://blog.focurio.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#c9c3d9] hover:text-[#38dfab] transition-colors"
          >
            Blog
          </a>
          <a
            href="#"
            className="text-sm text-[#c9c3d9] hover:text-[#38dfab] transition-colors"
          >
            Contact
          </a>
        </div>

        {/* Legal */}
        <div className="flex flex-col gap-3 items-center md:items-start text-center md:text-left">
          <h4 className="text-sm font-semibold tracking-wide mb-1">Legal</h4>
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
        <div className="flex flex-col gap-3 items-center md:items-start text-center md:text-left">
          <h4 className="text-sm font-semibold tracking-wide mb-1">
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
        <div className="col-span-1 md:col-span-4 text-center mt-6">
          <p className="text-sm text-[#c9c3d9]">
            © {new Date().getFullYear()} Focurio. Intelligent Immersion for
            High-Performance Minds.
          </p>
        </div>
      </div>
    </footer>
  );
}
