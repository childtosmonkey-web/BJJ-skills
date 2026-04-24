import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const memo = await prisma.memo.findUnique({ where: { id }, include: { category: true } });
  if (!memo) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(memo);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { content, aiContent, categoryId, tags } = body;

  const memo = await prisma.memo.update({
    where: { id },
    data: { content, aiContent, categoryId, tags: tags ?? "" },
    include: { category: true },
  });
  return NextResponse.json(memo);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.memo.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
