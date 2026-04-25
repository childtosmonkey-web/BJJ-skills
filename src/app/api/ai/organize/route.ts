import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  const { content, category } = await req.json();
  if (!content) return NextResponse.json({ error: "Content required" }, { status: 400 });

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GOOGLE_API_KEY not configured" }, { status: 503 });
  }

  const genai = new GoogleGenerativeAI(apiKey);
  const model = genai.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: "あなたはブラジリアン柔術の経験豊富なコーチです。練習メモを読んで、BJJの専門用語を正確に使いながら整理・校正してください。",
  });

  const result = await model.generateContent(`以下の練習メモを次の形式で整理してください：

## 学んだ技術の要点
（箇条書きで）

## 重要なポイント・注意点
（箇条書きで）

## 次の練習への提案
（1〜2文で）

【カテゴリ】${category ?? "未分類"}
【原文メモ】
${content}`);

  const organized = result.response.text();
  return NextResponse.json({ organized });
}
