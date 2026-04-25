import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: NextRequest) {
  const { content, category } = await req.json();
  if (!content) return NextResponse.json({ error: "Content required" }, { status: 400 });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GROQ_API_KEY not configured" }, { status: 503 });
  }

  try {
    const groq = new Groq({ apiKey });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "あなたはブラジリアン柔術の経験豊富なコーチです。練習メモを読んで、BJJの専門用語を正確に使いながら整理・校正してください。",
        },
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

    const organized = completion.choices[0].message.content ?? "";
    return NextResponse.json({ organized });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
