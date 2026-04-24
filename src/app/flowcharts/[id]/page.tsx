"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import FlowchartCanvas from "@/components/flowchart/FlowchartCanvas";
import { Flowchart, FlowNode, FlowEdge } from "@/types";

export default function FlowchartEditorPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [flowchart, setFlowchart] = useState<Flowchart | null>(null);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/flowcharts/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setFlowchart(data);
        setLoading(false);
      });
  }, [id]);

  const handleSave = useCallback(
    async (nodes: FlowNode[], edges: FlowEdge[]) => {
      setSaveStatus("saving");
      await fetch(`/api/flowcharts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nodesJson: JSON.stringify(nodes),
          edgesJson: JSON.stringify(edges),
        }),
      });
      setSaveStatus("saved");
    },
    [id]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96" style={{ color: "#475569" }}>
        読み込み中...
      </div>
    );
  }

  if (!flowchart) {
    return <div style={{ color: "#ef4444" }}>フローチャートが見つかりません</div>;
  }

  const nodes: FlowNode[] = JSON.parse(flowchart.nodesJson);
  const edges: FlowEdge[] = JSON.parse(flowchart.edgesJson);

  return (
    <div className="flex flex-col gap-0" style={{ height: "calc(100vh - 120px)" }}>
      {/* top bar */}
      <div
        className="flex items-center justify-between px-4 py-3 rounded-t-xl"
        style={{ background: "#1e293b", border: "1px solid #334155", borderBottom: "none" }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/flowcharts")}
            className="text-sm px-3 py-1.5 rounded-lg"
            style={{ background: "#334155", color: "#94a3b8" }}
          >
            ← 一覧
          </button>
          <h1 className="font-bold" style={{ color: "#f1f5f9" }}>{flowchart.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-xs px-2 py-1 rounded"
            style={{
              color: saveStatus === "saved" ? "#22c55e" : saveStatus === "saving" ? "#eab308" : "#94a3b8",
              background: saveStatus === "saved" ? "#14532d22" : "#334155",
            }}
          >
            {saveStatus === "saved" ? "✓ 保存済み" : saveStatus === "saving" ? "保存中..." : "未保存"}
          </span>
        </div>
      </div>

      {/* canvas */}
      <div
        className="flex-1 rounded-b-xl overflow-hidden"
        style={{ border: "1px solid #334155" }}
      >
        <FlowchartCanvas
          initialNodes={nodes}
          initialEdges={edges}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}
