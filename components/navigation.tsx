"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function Navigation() {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    fetch("/api/admin/me")
      .then((res) => res.json())
      .then((data) => setIsAdmin(data.isAdmin ?? false))
      .catch(() => setIsAdmin(false));
  }, []);

  useEffect(() => {
    // Sync initial hash if present
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "");
      if (hash) setActiveSection(hash);
    }

    if (pathname !== "/") {
      setActiveSection("");
      return;
    }

    const sections = ["how-it-works", "features", "pricing"];
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -40% 0px",
      threshold: 0.15,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pathname]);

  const links = [
    {
      id: "how-it-works",
      href: "/#how-it-works",
      label: "How it works",
      external: false,
    },
    {
      id: "features",
      href: "/#features",
      label: "Features",
      external: false,
    },
    {
      id: "pricing",
      href: "/#pricing",
      label: "Pricing",
      external: false,
    },
    {
      id: "blog",
      href: "https://blog.focurio.com",
      label: "Blog",
      external: true,
    },
  ];

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    link: (typeof links)[0],
  ) => {
    if (link.external) return;

    if (pathname === "/") {
      e.preventDefault();
      const el = document.getElementById(link.id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.pushState(null, "", `#${link.id}`);
        setActiveSection(link.id);
      }
    }
  };

  return (
    <nav className="flex items-center gap-6">
      {links.map((link) => {
        const isActive = pathname === "/" && activeSection === link.id;

        return (
          <a
            key={link.id}
            href={link.href}
            onClick={(e) => handleNavClick(e, link)}
            {...(link.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className={cn(
              "text-sm font-semibold tracking-wide border-b-2 py-0.5 transition-all duration-300 ease-in-out",
              isActive
                ? "text-[#c9beff] border-[#6c47ff]"
                : "text-[#c9c3d9] border-transparent hover:text-[#e1e2ec] hover:border-[#6c47ff]/40",
            )}
          >
            {link.label}
          </a>
        );
      })}

      {isAdmin && (
        <Link
          href="/admin"
          className={cn(
            "text-sm font-semibold tracking-wide border-b-2 py-0.5 transition-all duration-300 ease-in-out",
            pathname === "/admin"
              ? "text-[#c9beff] font-bold border-[#6c47ff]"
              : "text-[#c9c3d9] border-transparent hover:text-[#e1e2ec]",
          )}
        >
          Admin
        </Link>
      )}
    </nav>
  );
}
