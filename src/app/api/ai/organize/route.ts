import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/claude";

export async function POST(req: NextRequest) {
  const { content, category } = await req.json();
  if (!content) return NextResponse.json({ error: "Content required" }, { status: 400 });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === "your_api_key_here") {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 503 });
  }

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: "あなたはブラジリアン柔術の経験豊富なコーチです。練習メモを読んで、BJJの専門用語を正確に使いながら整理・校正してください。",
    messages: [
      {
        role: "user",
        content: `以下の練習メモを次の形式で整理してください：

## 学んだ技術の要点
（箇条書きで）

## 重要なポイント・注意点
（箇条書きで）

## 次の練習への提案
（1〜2文で）

【カテゴリ】${category ?? "未分類"}
【原文メモ】
${content}`,
      },
    ],
  });

  const organized = message.content[0].type === "text" ? message.content[0].text : "";
  return NextResponse.json({ organized });
}
