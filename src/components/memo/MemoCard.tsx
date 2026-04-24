"use client";

import { useState } from "react";
import { Memo } from "@/types";

type Props = {
  memo: Memo;
  onEdit: (memo: Memo) => void;
  onDelete: (id: string) => void;
};

export default function MemoCard({ memo, onEdit, onDelete }: Props) {
  const [showAi, setShowAi] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const tags = memo.tags ? memo.tags.split(",").filter(Boolean) : [];

  async function handleDelete() {
    if (!confirm("このメモを削除しますか？")) return;
    setDeleting(true);
    await fetch(`/api/memos/${memo.id}`, { method: "DELETE" });
    onDelete(memo.id);
  }

  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-3"
      style={{ background: "#1e293b", border: "1px solid #334155" }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ background: memo.category.color + "22", color: memo.category.color }}
          >
            {memo.category.name}
          </span>
          {tags.map((tag) => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#334155", color: "#94a3b8" }}>
              #{tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onEdit(memo)}
            className="text-xs px-2 py-1 rounded transition-colors"
            style={{ color: "#94a3b8", background: "#334155" }}
          >
            編集
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-xs px-2 py-1 rounded transition-colors"
            style={{ color: "#ef4444", background: "#3f1515" }}
          >
            削除
          </button>
        </div>
      </div>

      <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "#cbd5e1" }}>
        {showAi && memo.aiContent ? memo.aiContent : memo.content}
      </div>

      {memo.aiContent && (
        <button
          onClick={() => setShowAi(!showAi)}
          className="text-xs self-start px-3 py-1 rounded-full transition-colors"
          style={{ background: showAi ? "#1e3a5f" : "#334155", color: showAi ? "#93c5fd" : "#94a3b8" }}
        >
          {showAi ? "✦ AI整理済み表示中" : "✦ AI整理版を見る"}
        </button>
      )}
    </div>
  );
}
