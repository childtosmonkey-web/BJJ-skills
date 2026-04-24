"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "カレンダー", icon: "📅" },
  { href: "/categories", label: "カテゴリ", icon: "🏷️" },
  { href: "/flowcharts", label: "フローチャート", icon: "🔀" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b" style={{ background: "#0f172a", borderColor: "#334155" }}>
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg" style={{ color: "#ef4444" }}>
          <span>🥋</span>
          <span>BJJ Skills</span>
        </Link>
        <nav className="flex items-center gap-1">
          {links.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                style={{
                  background: active ? "#1e3a5f" : "transparent",
                  color: active ? "#93c5fd" : "#94a3b8",
                }}
              >
                <span>{l.icon}</span>
                <span className="hidden sm:inline">{l.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
