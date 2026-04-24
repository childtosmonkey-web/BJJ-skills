"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  NodeTypes,
  ReactFlowProvider,
  EdgeLabelRenderer,
  BaseEdge,
  getStraightPath,
  EdgeProps,
  Node,
  Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import PositionNode from "./PositionNode";
import { FlowNode, FlowEdge } from "@/types";

const nodeTypes: NodeTypes = { position: PositionNode };

function LabeledEdge({ id, sourceX, sourceY, targetX, targetY, label, markerEnd, style }: EdgeProps) {
  const [edgePath, labelX, labelY] = getStraightPath({ sourceX, sourceY, targetX, targetY });
  return (
    <>
      <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} style={style} />
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              background: "#1e293b",
              border: "1px solid #475569",
              borderRadius: 6,
              padding: "2px 8px",
              fontSize: 11,
              color: "#94a3b8",
              pointerEvents: "all",
              cursor: "default",
            }}
            className="nodrag nopan"
          >
            {label as string}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

const edgeTypes = { labeled: LabeledEdge };

type Props = {
  initialNodes: FlowNode[];
  initialEdges: FlowEdge[];
  onSave: (nodes: FlowNode[], edges: FlowEdge[]) => void;
};

function toRFNode(n: FlowNode): Node {
  return { id: n.id, type: n.type, position: n.position, data: n.data };
}

function toRFEdge(e: FlowEdge): Edge {
  return { id: e.id, source: e.source, target: e.target, label: e.label, type: e.type ?? "labeled" };
}

function FlowCanvas({ initialNodes, initialEdges, onSave }: Props) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes.map(toRFNode));
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges.map(toRFEdge));
  const saveTimer = useRef<NodeJS.Timeout | null>(null);

  const triggerSave = useCallback(
    (n: Node[], e: Edge[]) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        onSave(n as unknown as FlowNode[], e as unknown as FlowEdge[]);
      }, 2000);
    },
    [onSave]
  );

  useEffect(() => {
    triggerSave(nodes, edges);
  }, [nodes, edges, triggerSave]);

  const onConnect = useCallback(
    (connection: Connection) => {
      const label = prompt("技の名前を入力してください（例：アームバー）") ?? "";
      setEdges((eds) =>
        addEdge(
          { ...connection, type: "labeled", label, markerEnd: { type: "arrowclosed" } } as Edge,
          eds
        )
      );
    },
    [setEdges]
  );

  function addNode() {
    const label = prompt("ポジション名を入力してください（例：クローズドガード）") ?? "ポジション";
    const id = `node-${Date.now()}`;
    const newNode: Node = {
      id,
      type: "position",
      position: { x: Math.random() * 300 + 100, y: Math.random() * 200 + 100 },
      data: {
        label,
        color: "#3b82f6",
        onChange: (lbl: string, col: string) => {
          setNodes((nds) =>
            nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, label: lbl, color: col } } : n))
          );
        },
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-3 left-3 z-10 flex gap-2">
        <button
          onClick={addNode}
          className="text-sm px-4 py-2 rounded-lg font-medium shadow"
          style={{ background: "#ef4444", color: "#fff" }}
        >
          + ノード追加
        </button>
      </div>
      <div className="absolute top-3 right-3 z-10 text-xs hidden sm:block" style={{ color: "#475569" }}>
        ダブルクリックで編集 / ハンドルをドラッグで接続
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
      >
        <Background color="#334155" gap={20} />
        <Controls />
        <MiniMap
          nodeColor="#334155"
          style={{ background: "#0f172a", border: "1px solid #334155" }}
        />
      </ReactFlow>
    </div>
  );
}

export default function FlowchartCanvas(props: Props) {
  return (
    <ReactFlowProvider>
      <FlowCanvas {...props} />
    </ReactFlowProvider>
  );
}
