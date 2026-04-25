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
          const hasMemos = dots.length > 0;

          return (
            <button
              key={dateStr}
              onClick={() => router.push(`/memos/${dateStr}`)}
              className="aspect-square rounded-xl flex flex-col items-center justify-center gap-1 transition-all hover:brightness-125"
              style={{
                background: inMonth ? "#1e293b" : "transparent",
                opacity: inMonth ? 1 : 0.25,
              }}
            >
              {/* 日付数字 — 今日は赤丸で囲む */}
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold"
                style={
                  today
                    ? { background: "#ef4444", color: "#fff" }
                    : { color: inMonth ? "#f1f5f9" : "#475569" }
                }
              >
                {format(day, "d")}
              </div>

              {/* メモドット（カテゴリ色を重複排除して表示） */}
              {hasMemos ? (
                <div className="flex gap-0.5 justify-center flex-wrap px-1">
                  {[...new Set(dots.map((d) => d.color))].map((color, i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: color }}
                    />
                  ))}
                </div>
              ) : (
                /* ドットがない日も高さを揃えるためのスペーサー */
                <span className="w-1.5 h-1.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* 凡例 */}
      <div className="flex items-center gap-4 mt-6 text-xs" style={{ color: "#475569" }}>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "#ef4444", color: "#fff" }}>
            1
          </div>
          <span>今日</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: "#3b82f6" }} />
          <span>メモあり</span>
        </div>
      </div>
    </div>
  );
}
