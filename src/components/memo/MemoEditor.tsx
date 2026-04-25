"use client";

import { useState, useEffect } from "react";
import { Category, Memo } from "@/types";

type Props = {
  date: string;
  categories: Category[];
  editing?: Memo | null;
  onSave: (memo: Memo) => void;
  onCancel: () => void;
};

export default function MemoEditor({ date, categories, editing, onSave, onCancel }: Props) {
  const [content, setContent] = useState(editing?.content ?? "");
  const [categoryId, setCategoryId] = useState(editing?.categoryId ?? categories[0]?.id ?? "");
  const [tags, setTags] = useState(editing?.tags ?? "");
  const [aiContent, setAiContent] = useState(editing?.aiContent ?? null);
  const [aiPreview, setAiPreview] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editing) {
      setContent(editing.content);
      setCategoryId(editing.categoryId);
      setTags(editing.tags);
      setAiContent(editing.aiContent);
    }
  }, [editing]);

  const selectedCategory = categories.find((c) => c.id === categoryId);

  async function handleAiOrganize() {
    if (!content.trim()) return;
    setAiLoading(true);
    setAiError("");
    setAiPreview("");
    try {
      const res = await fetch("/api/ai/organize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, category: selectedCategory?.name }),
      });
      const data = await res.json();
      if (data.error) {
        setAiError(data.error);
      } else {
        setAiPreview(data.organized);
      }
    } catch {
      setAiError("AI整理に失敗しました");
    } finally {
      setAiLoading(false);
    }
  }

  function acceptAi() {
    setContent(aiPreview);
    setAiContent(aiPreview);
    setAiPreview("");
  }

  async function handleSave() {
    if (!content.trim() || !categoryId) return;
    setSaving(true);
    try {
      const url = editing ? `/api/memos/${editing.id}` : "/api/memos";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, content, aiContent, categoryId, tags }),
      });
      const memo = await res.json();
      onSave(memo);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-xl p-5 flex flex-col gap-4" style={{ background: "#1e293b", border: "1px solid #334155" }}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold" style={{ color: "#f1f5f9" }}>
          {editing ? "メモを編集" : "メモを追加"}
        </h3>
        <button onClick={onCancel} style={{ color: "#64748b" }} className="text-xl leading-none">
          ×
        </button>
      </div>

      {/* category */}
      <div>
        <label className="text-xs font-medium mb-1.5 block" style={{ color: "#94a3b8" }}>カテゴリ</label>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategoryId(c.id)}
              className="text-xs px-3 py-1.5 rounded-full font-medium transition-all"
              style={{
                background: categoryId === c.id ? c.color + "33" : "#334155",
                color: categoryId === c.id ? c.color : "#94a3b8",
                border: categoryId === c.id ? `1px solid ${c.color}66` : "1px solid transparent",
              }}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* content */}
      <div>
        <label className="text-xs font-medium mb-1.5 block" style={{ color: "#94a3b8" }}>メモ内容</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          placeholder="今日学んだことを自由に書いてください..."
          className="w-full rounded-lg px-3 py-2 text-sm resize-none outline-none focus:ring-1"
          style={{
            background: "#0f172a",
            color: "#f1f5f9",
            border: "1px solid #334155",
            caretColor: "#ef4444",
          }}
        />
      </div>

      {/* tags */}
      <div>
        <label className="text-xs font-medium mb-1.5 block" style={{ color: "#94a3b8" }}>
          タグ（カンマ区切り）
        </label>
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="アームバー, クローズドガード"
          className="w-full rounded-lg px-3 py-2 text-sm outline-none focus:ring-1"
          style={{ background: "#0f172a", color: "#f1f5f9", border: "1px solid #334155" }}
        />
      </div>

      {/* AI actions */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={handleAiOrganize}
          disabled={aiLoading || !content.trim()}
          className="text-sm px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-40"
          style={{ background: "#312e81", color: "#a5b4fc" }}
        >
          {aiLoading ? "✦ 整理中..." : "✦ AIで整理する"}
        </button>
        {aiContent && (
          <span className="text-xs" style={{ color: "#22c55e" }}>✓ AI整理済み</span>
        )}
      </div>

      {/* AI preview */}
      {aiPreview && (
        <div className="rounded-lg p-4 flex flex-col gap-3" style={{ background: "#1a1a3e", border: "1px solid #4338ca" }}>
          <div className="text-xs font-semibold" style={{ color: "#a5b4fc" }}>✦ AI整理プレビュー</div>
          <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "#c7d2fe" }}>
            {aiPreview}
          </div>
          <div className="flex gap-2">
            <button
              onClick={acceptAi}
              className="text-sm px-3 py-1.5 rounded-lg font-medium"
              style={{ background: "#22c55e", color: "#fff" }}
            >
              採用する
            </button>
            <button
              onClick={() => setAiPreview("")}
              className="text-sm px-3 py-1.5 rounded-lg"
              style={{ background: "#334155", color: "#94a3b8" }}
            >
              破棄
            </button>
          </div>
        </div>
      )}

      {aiError && (
        <p className="text-xs" style={{ color: "#ef4444" }}>{aiError}</p>
      )}

      {/* save/cancel */}
      <div className="flex justify-end gap-2 pt-1">
        <button
          onClick={onCancel}
          className="text-sm px-4 py-2 rounded-lg"
          style={{ background: "#334155", color: "#94a3b8" }}
        >
          キャンセル
        </button>
        <button
          onClick={handleSave}
          disabled={saving || !content.trim()}
          className="text-sm px-5 py-2 rounded-lg font-semibold transition-colors disabled:opacity-40"
          style={{ background: "#ef4444", color: "#fff" }}
        >
          {saving ? "保存中..." : "保存"}
        </button>
      </div>
    </div>
  );
}
