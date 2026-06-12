# KTblog — エージェント用ガイド

https://ktblog.pages.dev のリポジトリ。Astro + Tailwind + Cloudflare Pages。

## 記事投稿ワークフロー

```bash
# 1. 記事Markdownファイルを作る
cat > /tmp/article.md << 'EOF'
---
# 本文をMarkdownで書く
EOF

# 2. 記事を生成（--title は必須）
npm run new-post -- \
  --title "記事タイトル" \
  --category "カテゴリ名" \
  --tags "AIエージェント,Claude" \
  --eyecatch "/assets/eyecatch/ファイル名.png" \
  --excerpt "要約文" \
  --file /tmp/article.md

# 3. 内容を読み取ってタグ・カテゴリ・検索インデックスを更新
npm run analyze -- --apply

# 4. デプロイ
npm run deploy "New article: 記事タイトル"
```

### 引数
| 引数 | 必須 | 説明 |
|------|------|------|
| `--title` | yes | 記事タイトル |
| `--category` | no | カテゴリ |
| `--tags` | no | タグ（カンマ区切り） |
| `--eyecatch` | no | アイキャッチ画像パス |
| `--excerpt` | no | 要約 |
| `--file` | no | 本文ファイル（省略時stdin） |
| `--date` | no | 日付（ISO、省略時今日） |
| `--dry-run` | no | 作成せず表示のみ |

### タグ・検索インデックス
- `npm run analyze` — 本文を読み取りタグを提案（dry-run）
- `npm run analyze -- --apply` — 実際に front-matter に tags を書き込み
- `npm run build` 時に `public/search-index.json` が自動生成される
- 新規/更新後は必ず `npm run analyze -- --apply` を実行すること

### 記事の構造

`src/content/posts/{slug}.md` に生成される。フロントマター:

```yaml
title: "記事タイトル"       # 必須
date: 2026-06-11           # 必須 YYYY-MM-DD
category: "カテゴリ"        # 任意
eyecatch: "/assets/..."    # 任意
excerpt: "要約"             # 任意
```

画像は `public/assets/eyecatch/` に配置し、パスは `/assets/eyecatch/ファイル名`。

## ローカル開発

```bash
pnpm dev     # http://localhost:4321
pnpm build   # 本番ビルド → dist/
```

## Cloudflare

初回 MCP 呼び出し時に OAuth 認証。`.opencode.jsonc` に MCP サーバー設定済み。
