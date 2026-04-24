import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/nav/Navigation";

export const metadata: Metadata = {
  title: "BJJ Skills",
  description: "ブラジリアン柔術の技術記録・管理アプリ",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <Navigation />
        <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
