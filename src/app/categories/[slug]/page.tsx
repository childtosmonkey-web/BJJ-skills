import { notFound } from "next/navigation";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { ja } from "date-fns/locale";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ slug: string }> };

export default async function CategoryDetailPage({ params }: Props) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      memos: {
        orderBy: { date: "desc" },
      },
    },
  });
  if (!category) notFound();

  const groupedByDate: Record<string, typeof category.memos> = {};
  for (const memo of category.memos) {
    if (!groupedByDate[memo.date]) groupedByDate[memo.date] = [];
    groupedByDate[memo.date].push(memo);
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <Link
          href="/categories"
          className="text-sm px-3 py-1.5 rounded-lg"
          style={{ background: "#1e293b", color: "#94a3b8" }}
        >
          ← カテゴリ一覧
        </Link>
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold"
            style={{ background: category.color + "22", color: category.color }}
          >
            {category.name[0]}
          </div>
          <h1 className="text-xl font-bold" style={{ color: "#f1f5f9" }}>{category.name}</h1>
          <span className="text-sm" style={{ color: "#475569" }}>({category.memos.length}件)</span>
        </div>
      </div>

      {category.memos.length === 0 ? (
        <div className="text-center py-16" style={{ color: "#475569" }}>
          <p className="text-4xl mb-3">📝</p>
          <p>このカテゴリにはまだメモがありません</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {Object.entries(groupedByDate).map(([date, memos]) => (
            <div key={date}>
              <Link
                href={`/memos/${date}`}
                className="text-sm font-semibold mb-2 block hover:underline"
                style={{ color: "#94a3b8" }}
              >
                {format(parseISO(date), "yyyy年M月d日（E）", { locale: ja })}
              </Link>
              <div className="flex flex-col gap-2">
                {memos.map((memo) => (
                  <div
                    key={memo.id}
                    className="rounded-xl p-4"
                    style={{ background: "#1e293b", border: "1px solid #334155" }}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "#cbd5e1" }}>
                      {memo.aiContent ?? memo.content}
                    </p>
                    {memo.tags && (
                      <div className="flex gap-1.5 flex-wrap mt-2">
                        {memo.tags.split(",").filter(Boolean).map((tag) => (
                          <span key={tag} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#334155", color: "#94a3b8" }}>
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
