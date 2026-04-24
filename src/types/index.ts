export type Category = {
  id: string;
  name: string;
  slug: string;
  color: string;
  description: string | null;
  createdAt: Date;
  _count?: { memos: number };
};

export type Memo = {
  id: string;
  date: string;
  content: string;
  aiContent: string | null;
  categoryId: string;
  category: Category;
  tags: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Flowchart = {
  id: string;
  name: string;
  description: string | null;
  nodesJson: string;
  edgesJson: string;
  createdAt: Date;
  updatedAt: Date;
};

export type FlowNode = {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: { label: string; color: string };
};

export type FlowEdge = {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: string;
};
