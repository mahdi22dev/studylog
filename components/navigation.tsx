"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Home, Timer, FileText, Calendar, Shield } from "lucide-react";

export function Navigation() {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch("/api/admin/me")
      .then((res) => res.json())
      .then((data) => setIsAdmin(data.isAdmin ?? false))
      .catch(() => setIsAdmin(false));
  }, []);

  const links = [
    {
      href: "/",
      label: "Home",
      icon: Home,
    },
    {
      href: "/timer",
      label: "Timer",
      icon: Timer,
    },
    {
      href: "/notes",
      label: "Notes",
      icon: FileText,
    },
    {
      href: "/schedule",
      label: "Schedule",
      icon: Calendar,
    },
    ...(isAdmin
      ? [
          {
            href: "/admin",
            label: "Admin",
            icon: Shield,
          },
        ]
      : []),
  ];

  return (
    <nav className="flex items-center gap-1">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
