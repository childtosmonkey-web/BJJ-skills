import { Handle, Position, NodeProps } from "@xyflow/react";
import { useState } from "react";

const COLOR_OPTIONS = [
  "#3b82f6", "#ef4444", "#22c55e", "#f97316",
  "#a855f7", "#eab308", "#d97706", "#64748b",
];

export default function PositionNode({ data, selected }: NodeProps) {
  const nodeData = data as { label: string; color: string; onChange?: (label: string, color: string) => void };
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(nodeData.label);
  const [color, setColor] = useState(nodeData.color ?? "#3b82f6");

  function save() {
    nodeData.onChange?.(label, color);
    setEditing(false);
  }

  return (
    <div
      className="relative"
      style={{
        minWidth: 120,
        padding: "10px 16px",
        borderRadius: 10,
        background: "#1e293b",
        border: `2px solid ${selected ? color : color + "88"}`,
        boxShadow: selected ? `0 0 12px ${color}44` : "none",
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: color }} />

      {editing ? (
        <div className="flex flex-col gap-2" style={{ minWidth: 160 }}>
          <input
            autoFocus
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="text-sm rounded px-2 py-1 outline-none"
            style={{ background: "#0f172a", color: "#f1f5f9", border: "1px solid #475569" }}
            onKeyDown={(e) => e.key === "Enter" && save()}
          />
          <div className="flex gap-1.5 flex-wrap">
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className="w-5 h-5 rounded-full"
                style={{ background: c, border: color === c ? "2px solid white" : "2px solid transparent" }}
              />
            ))}
          </div>
          <button
            onClick={save}
            className="text-xs py-1 rounded font-medium"
            style={{ background: "#ef4444", color: "#fff" }}
          >
            OK
          </button>
        </div>
      ) : (
        <div
          onDoubleClick={() => setEditing(true)}
          className="text-sm font-semibold text-center cursor-pointer"
          style={{ color: color }}
        >
          {nodeData.label || "ポジション"}
        </div>
      )}

      <Handle type="source" position={Position.Bottom} style={{ background: color }} />
    </div>
  );
}
