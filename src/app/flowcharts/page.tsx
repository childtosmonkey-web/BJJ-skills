"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Flowchart } from "@/types";

export default function FlowchartsPage() {
  const router = useRouter();
  const [flowcharts, setFlowcharts] = useState<Flowchart[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetch("/api/flowcharts").then((r) => r.json()).then((data) => {
      setFlowcharts(data);
      setLoading(false);
    });
  }, []);

  async function createNew() {
    const name = prompt("フローチャート名を入力してください（例：クローズドガードの展開）");
    if (!name?.trim()) return;
    setCreating(true);
    const res = await fetch("/api/flowcharts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const fc = await res.json();
    setCreating(false);
    router.push(`/flowcharts/${fc.id}`);
  }

  async function deleteFlowchart(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm("このフローチャートを削除しますか？")) return;
    await fetch(`/api/flowcharts/${id}`, { method: "DELETE" });
    setFlowcharts((prev) => prev.filter((f) => f.id !== id));
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: "#f1f5f9" }}>フローチャート</h1>
          <p className="text-sm" style={{ color: "#64748b" }}>ポジションから技の展開を視覚的に整理できます</p>
        </div>
        <button
          onClick={createNew}
          disabled={creating}
          className="text-sm px-5 py-2.5 rounded-lg font-semibold transition-colors disabled:opacity-50"
          style={{ background: "#ef4444", color: "#fff" }}
        >
          {creating ? "作成中..." : "+ 新規作成"}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12" style={{ color: "#475569" }}>読み込み中...</div>
      ) : flowcharts.length === 0 ? (
        <div className="text-center py-20" style={{ color: "#475569" }}>
          <p className="text-5xl mb-4">🔀</p>
          <p className="text-lg mb-2">フローチャートがまだありません</p>
          <p className="text-sm">「新規作成」からポジション図を作り始めましょう</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {flowcharts.map((fc) => {
            const nodes = JSON.parse(fc.nodesJson) as { id: string }[];
            const edges = JSON.parse(fc.edgesJson) as { id: string }[];
            return (
              <button
                key={fc.id}
                onClick={() => router.push(`/flowcharts/${fc.id}`)}
                className="rounded-xl p-5 text-left flex flex-col gap-3 transition-all hover:scale-[1.01]"
                style={{ background: "#1e293b", border: "1px solid #334155" }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="text-base font-semibold leading-snug" style={{ color: "#f1f5f9" }}>
                    {fc.name}
                  </div>
                  <button
                    onClick={(e) => deleteFlowchart(fc.id, e)}
                    className="text-xs shrink-0 px-2 py-0.5 rounded"
                    style={{ color: "#ef4444", background: "#3f1515" }}
                  >
                    削除
                  </button>
                </div>
                {fc.description && (
                  <p className="text-sm" style={{ color: "#64748b" }}>{fc.description}</p>
                )}
                <div className="flex items-center gap-4 text-xs" style={{ color: "#475569" }}>
                  <span>ノード: {nodes.length}</span>
                  <span>エッジ: {edges.length}</span>
                </div>
                <div className="text-xs" style={{ color: "#334155" }}>
                  更新: {format(new Date(fc.updatedAt), "M月d日", { locale: ja })}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
