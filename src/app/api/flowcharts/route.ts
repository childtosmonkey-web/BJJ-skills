import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const flowcharts = await prisma.flowchart.findMany({
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(flowcharts);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, description } = body;
  if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });

  const flowchart = await prisma.flowchart.create({
    data: { name, description: description ?? null },
  });
  return NextResponse.json(flowchart, { status: 201 });
}
