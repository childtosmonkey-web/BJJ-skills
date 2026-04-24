import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { memos: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-1" style={{ color: "#f1f5f9" }}>カテゴリ</h1>
        <p className="text-sm" style={{ color: "#64748b" }}>技術カテゴリ別にメモを整理・参照できます</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.slug}`}
            className="rounded-xl p-5 flex flex-col gap-3 transition-all hover:scale-[1.02]"
            style={{ background: "#1e293b", border: `1px solid ${cat.color}33` }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold"
              style={{ background: cat.color + "22", color: cat.color }}
            >
              {cat.name[0]}
            </div>
            <div>
              <div className="font-semibold text-sm" style={{ color: "#f1f5f9" }}>{cat.name}</div>
              <div className="text-xs mt-0.5" style={{ color: "#64748b" }}>{cat.description}</div>
            </div>
            <div
              className="text-xs font-semibold px-2 py-0.5 rounded-full self-start"
              style={{ background: cat.color + "22", color: cat.color }}
            >
              {cat._count.memos} 件
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
