import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const categorySlug = searchParams.get("category");

  const where: Record<string, unknown> = {};
  if (date) where.date = date;
  if (categorySlug) where.category = { slug: categorySlug };

  const memos = await prisma.memo.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(memos);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { date, content, aiContent, categoryId, tags } = body;

  if (!date || !content || !categoryId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const memo = await prisma.memo.create({
    data: { date, content, aiContent, categoryId, tags: tags ?? "" },
    include: { category: true },
  });
  return NextResponse.json(memo, { status: 201 });
}
