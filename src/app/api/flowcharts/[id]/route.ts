import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const fc = await prisma.flowchart.findUnique({ where: { id } });
  if (!fc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(fc);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { name, description, nodesJson, edgesJson } = body;

  const fc = await prisma.flowchart.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(nodesJson !== undefined && { nodesJson }),
      ...(edgesJson !== undefined && { edgesJson }),
    },
  });
  return NextResponse.json(fc);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.flowchart.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
