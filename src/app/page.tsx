import { prisma } from "@/lib/prisma";
import CalendarView from "@/components/calendar/CalendarView";

export default async function HomePage() {
  const memos = await prisma.memo.findMany({
    include: { category: true },
    orderBy: { date: "asc" },
  });

  const dotsByDate: Record<string, { color: string }[]> = {};
  for (const memo of memos) {
    if (!dotsByDate[memo.date]) dotsByDate[memo.date] = [];
    dotsByDate[memo.date].push({ color: memo.category.color });
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-1" style={{ color: "#f1f5f9" }}>練習カレンダー</h1>
        <p className="text-sm" style={{ color: "#64748b" }}>日付をクリックしてその日のメモを確認・追加できます</p>
      </div>
      <CalendarView dotsByDate={dotsByDate} />
    </div>
  );
}
