# 🥋 BJJ Skills

ブラジリアン柔術の技術記録・管理 Web アプリ

## 機能

- **カレンダー** — 練習日ごとにメモを記録。メモのあった日にカテゴリカラーのドット表示
- **学びメモ** — カテゴリ分類（ガード / スイープ / サブミッション など）とタグ付き
- **AI整理** — Claude API でメモを自動的に整理・校正
- **フローチャート** — ポジションと技の展開を視覚的に管理

## セットアップ

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. AI機能の設定（任意）

プロジェクトルートに `.env.local` を作成して Anthropic API キーを設定：

```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxx
```

API キーは https://console.anthropic.com/ から取得できます。
AI整理機能を使わない場合は設定不要です。

### 3. 開発サーバー起動

```bash
npm run dev
```

http://localhost:3000 でアクセスできます。

## 技術スタック

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4**（ダークテーマ）
- **Prisma 6** + SQLite（ローカルDB）
- **React Flow** (@xyflow/react) — フローチャート
- **Claude API** (claude-sonnet-4-6) — AI校正

## カテゴリ

ガード / スイープ / パス / サブミッション / テイクダウン / エスケープ / バックテイク / その他
