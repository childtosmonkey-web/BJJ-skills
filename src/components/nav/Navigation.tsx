"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const CalendarIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
    <rect x="1" y="2" width="13" height="12" rx="1.5" />
    <path d="M1 6h13" />
    <path d="M5 1v2M10 1v2" />
    <path d="M4 9h1M7 9h1M10 9h1M4 11.5h1M7 11.5h1" />
  </svg>
);

const TagIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1.5 1.5h5.2l6.3 6.3a1 1 0 0 1 0 1.4l-3.8 3.8a1 1 0 0 1-1.4 0L1.5 6.7V1.5z" />
    <circle cx="4.5" cy="4.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const FlowIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="1" width="4" height="3" rx="1" />
    <rect x="5.5" y="6" width="4" height="3" rx="1" />
    <rect x="10" y="11" width="4" height="3" rx="1" />
    <path d="M3 4v1.5a1 1 0 0 0 1 1h2.5" />
    <path d="M7.5 9v1.5a1 1 0 0 0 1 1H12" />
  </svg>
);

const links = [
  { href: "/", label: "カレンダー", Icon: CalendarIcon },
  { href: "/categories", label: "カテゴリ", Icon: TagIcon },
  { href: "/flowcharts", label: "フローチャート", Icon: FlowIcon },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50" style={{ background: "#0a1628", borderBottom: "1px solid #1e293b" }}>
      <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">

        {/* ロゴ */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded flex items-center justify-center text-xs font-black" style={{ background: "#ef4444", color: "#fff", letterSpacing: "-0.05em" }}>
            B
          </div>
          <span className="font-semibold text-sm tracking-wide" style={{ color: "#f1f5f9" }}>BJJ Skills</span>
        </Link>

        {/* ナビ */}
        <nav className="flex items-center gap-1">
          {links.map(({ href, label, Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150"
                style={{
                  color: active ? "#f1f5f9" : "#64748b",
                  background: active ? "#1e293b" : "transparent",
                }}
              >
                <Icon />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </nav>

      </div>
    </header>
  );
}
