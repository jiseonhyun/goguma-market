"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/products", icon: "🏠", label: "홈" },
  { href: "/chat", icon: "💬", label: "채팅" },
  { href: "/profile", icon: "👤", label: "나의 거래" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-background border-t z-20">
      <div className="max-w-2xl mx-auto flex">
        {NAV.map(({ href, icon, label }) => {
          const active = pathname === href || (href !== "/products" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center py-2.5 gap-0.5 text-xs font-medium transition-colors ${
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="text-xl leading-none">{icon}</span>
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
