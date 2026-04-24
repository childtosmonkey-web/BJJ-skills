"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
} from "date-fns";
import { ja } from "date-fns/locale";

type DotInfo = { color: string };

type Props = {
  dotsByDate: Record<string, DotInfo[]>;
};

export default function CalendarView({ dotsByDate }: Props) {
  const router = useRouter();
  const [current, setCurrent] = useState(new Date());

  const monthStart = startOfMonth(current);
  const monthEnd = endOfMonth(current);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const weekdays = ["月", "火", "水", "木", "金", "土", "日"];

  return (
    <div className="w-full">
      {/* header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setCurrent(subMonths(current, 1))}
          className="w-10 h-10 rounded-lg flex items-center justify-center text-lg transition-colors hover:text-white"
          style={{ color: "#94a3b8", background: "#1e293b" }}
        >
          ‹
        </button>
        <h2 className="text-xl font-bold" style={{ color: "#f1f5f9" }}>
          {format(current, "yyyy年 M月", { locale: ja })}
        </h2>
        <button
          onClick={() => setCurrent(addMonths(current, 1))}
          className="w-10 h-10 rounded-lg flex items-center justify-center text-lg transition-colors hover:text-white"
          style={{ color: "#94a3b8", background: "#1e293b" }}
        >
          ›
        </button>
      </div>

      {/* weekday headers */}
      <div className="grid grid-cols-7 mb-2">
        {weekdays.map((d) => (
          <div key={d} className="text-center text-xs font-medium py-2" style={{ color: "#475569" }}>
            {d}
          </div>
        ))}
      </div>

      {/* day cells */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const dots = dotsByDate[dateStr] ?? [];
          const inMonth = isSameMonth(day, current);
          const today = isToday(day);

          return (
            <button
              key={dateStr}
              onClick={() => router.push(`/memos/${dateStr}`)}
              className="aspect-square rounded-xl flex flex-col items-center justify-center gap-1 transition-colors relative"
              style={{
                background: today ? "#1e3a5f" : inMonth ? "#1e293b" : "transparent",
                opacity: inMonth ? 1 : 0.3,
                border: today ? "1px solid #3b82f6" : "1px solid transparent",
              }}
            >
              <span
                className="text-sm font-medium"
                style={{ color: today ? "#93c5fd" : inMonth ? "#f1f5f9" : "#475569" }}
              >
                {format(day, "d")}
              </span>
              {dots.length > 0 && (
                <div className="flex gap-0.5 flex-wrap justify-center px-1">
                  {dots.slice(0, 3).map((dot, i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: dot.color }}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
