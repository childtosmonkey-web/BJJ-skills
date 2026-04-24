"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { ja } from "date-fns/locale";
import MemoCard from "@/components/memo/MemoCard";
import MemoEditor from "@/components/memo/MemoEditor";
import { Category, Memo } from "@/types";

export default function DayMemosPage() {
  const { date } = useParams<{ date: string }>();
  const router = useRouter();
  const [memos, setMemos] = useState<Memo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editing, setEditing] = useState<Memo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/memos?date=${date}`).then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ]).then(([m, c]) => {
      setMemos(m);
      setCategories(c);
      setLoading(false);
    });
  }, [date]);

  function handleSave(memo: Memo) {
    setMemos((prev) => {
      const exists = prev.find((m) => m.id === memo.id);
      return exists ? prev.map((m) => (m.id === memo.id ? memo : m)) : [memo, ...prev];
    });
    setShowEditor(false);
    setEditing(null);
  }

  function handleDelete(id: string) {
    setMemos((prev) => prev.filter((m) => m.id !== id));
  }

  function openEdit(memo: Memo) {
    setEditing(memo);
    setShowEditor(true);
  }

  const displayDate = (() => {
    try {
      return format(parseISO(date), "yyyy年M月d日（E）", { locale: ja });
    } catch {
      return date;
    }
  })();

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/")}
          className="text-sm px-3 py-1.5 rounded-lg transition-colors"
          style={{ background: "#1e293b", color: "#94a3b8" }}
        >
          ← カレンダー
        </button>
        <h1 className="text-xl font-bold" style={{ color: "#f1f5f9" }}>{displayDate}</h1>
      </div>

      {!showEditor && (
        <button
          onClick={() => { setEditing(null); setShowEditor(true); }}
          className="w-full py-3 rounded-xl text-sm font-semibold transition-colors"
          style={{ background: "#1e293b", color: "#94a3b8", border: "1px dashed #334155" }}
        >
          + メモを追加
        </button>
      )}

      {showEditor && (
        <MemoEditor
          date={date}
          categories={categories}
          editing={editing}
          onSave={handleSave}
          onCancel={() => { setShowEditor(false); setEditing(null); }}
        />
      )}

      {loading ? (
        <div className="text-center py-12" style={{ color: "#475569" }}>読み込み中...</div>
      ) : memos.length === 0 ? (
        <div className="text-center py-16" style={{ color: "#475569" }}>
          <p className="text-4xl mb-3">🥋</p>
          <p>この日のメモはまだありません</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {memos.map((memo) => (
            <MemoCard
              key={memo.id}
              memo={memo}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
