# KTblog - デザイン制作システム

Astro + Tailwind CSSで構築されたブログシステム。4つの異なるデザインテーマから選択可能。

## 📁 プロジェクト構造

```
ktblog/
├── src/                          # メインアプリケーション
│   ├── components/               # 再利用可能なコンポーネント
│   ├── layouts/                  # ページレイアウト
│   ├── pages/                    # ルーティング
│   ├── content/                  # Markdown記事
│   └── styles/                   # グローバルスタイル
├── designs/                      # 4つのデザインテーマ
│   ├── sample-a/                 # 黒・金・深緑
│   ├── sample-b/                 # 生成り・墨・赤
│   ├── sample-c/                 # 黒・白・蛍光グリーン
│   └── sample-d/                 # 白・グレー・金
├── preview/                      # プレビューシステム
│   └── index.html                # テーマ比較ページ
└── public/                       # 静的ファイル
```

## 🎨 デザインテーマ

### Sample A: 黒・金・深緑
**コンセプト:** 現代の寺子屋 × サイバーパンク × 戦国記録庫

- **キーワード:** 重厚感、未来志向、知的、シネマティック
- **配色:** 黒 (#0a0a0a) + 金 (#d4af37) + 深緑 (#4a7c2c)
- **特徴:** 金色のアクセント、深緑の差し色、未来的な書庫の雰囲気

### Sample B: 生成り・墨・赤
**コンセプト:** 古文書 × 思想誌 × 奈良の記録

- **キーワード:** 古典、品格、静謐、文学的
- **配色:** 生成り (#f5f0e8) + 墨 (#2c2416) + 朱 (#c41e3a)
- **特徴:** 和紙のような背景、明朝体、均等割付、印章風タグ

### Sample C: 黒・白・蛍光グリーン
**コンセプト:** AI兵法 × ハッカー思想メディア

- **キーワード:** ターミナル、先鋭的、ミニマル、技術的
- **配色:** 黒 (#000000) + 白 (#ffffff) + 蛍光グリーン (#00ff41)
- **特徴:** ターミナル風、スキャンライン効果、等幅フォント

### Sample D: 白・グレー・金
**コンセプト:** 高級note代替 × 読みやすい個人思想メディア

- **キーワード:** 洗練、読みやすい、高級感、ミニマル
- **配色:** 白 (#ffffff) + グレー (#f8f8f8) + 金 (#d4af37)
- **特徴:** シンプルで上品、高級雑誌風、快適な読書体験

## 🚀 セットアップ

### 前提条件

- Node.js 18以上
- pnpm（推奨）または npm

### インストール

```bash
# 依存関係のインストール
pnpm install

# 開発サーバーの起動
pnpm dev
```

開発サーバーが `http://localhost:4321` で起動します。

## 🎯 テーマの比較と選択

### 方法1: プレビューシステム（推奨）

ブラウザでプレビューページを開き、4つのテーマを視覚的に比較できます。

```bash
# preview/index.html をブラウザで開く
open preview/index.html
```

または、開発サーバー起動中に:

```
http://localhost:4321/preview/
```

各テーマカードをクリックすると、詳細なプレビューが表示されます。

### 方法2: 個別プレビュー

各テーマのプレビューを直接開く:

```bash
open designs/sample-a/index.html
open designs/sample-b/index.html
open designs/sample-c/index.html
open designs/sample-d/index.html
```

## 🔄 テーマの適用

テーマを選択したら、`src/styles/global.css` を該当するテーマのCSSで置き換えます。

### 例: Sample A を適用

```bash
# Sample A のCSSをコピー
cp designs/sample-a/src/styles/global.css src/styles/global.css
```

### 例: Sample B を適用

```bash
# Sample B のCSSをコピー
cp designs/sample-b/src/styles/global.css src/styles/global.css
```

### 例: Sample C を適用

```bash
# Sample C のCSSをコピー
cp designs/sample-c/src/styles/global.css src/styles/global.css
```

### 例: Sample D を適用

```bash
# Sample D のCSSをコピー
cp designs/sample-d/src/styles/global.css src/styles/global.css
```

## 📝 記事の追加

新しい記事は `src/content/posts/` にMarkdownファイルとして追加します。

### フロントマター例

```markdown
---
title: "記事タイトル"
date: 2026-06-06
category: "カテゴリ名"
eyecatch: "/images/eyecatch.jpg"
excerpt: "記事の要約テキスト"
---

ここに記事の本文を書きます。

## 見出し2

段落テキスト...
```

### フロントマターフィールド

- `title` (必須): 記事のタイトル
- `date` (必須): 公開日（ISO形式）
- `category` (必須): カテゴリ名
- `eyecatch` (任意): アイキャッチ画像のパス
- `excerpt` (任意): 記事の要約

## 🔧 ビルドとプレビュー

```bash
# 本番ビルド
pnpm build

# ビルド結果のプレビュー
pnpm preview
```

ビルド結果は `dist/` ディレクトリに生成されます。

## ☁️ Cloudflare Pages へのデプロイ

### 方法1: Git統合（推奨）

1. **リポジトリをGitHubにプッシュ**

```bash
git init
git add .
git commit -m "Initial commit: KTblog with 4 design themes"
git remote add origin https://github.com/YOUR_USERNAME/ktblog.git
git push -u origin main
```

2. **Cloudflare Pagesでプロジェクト作成**

- [Cloudflare Dashboard](https://dash.cloudflare.com/) にログイン
- "Workers & Pages" → "Create application" → "Pages" → "Connect to Git"
- GitHubリポジトリを選択

3. **ビルド設定**

```
Framework preset: Astro
Build command: pnpm build
Build output directory: dist
Install command: pnpm install
```

4. **デプロイ**

- "Save and Deploy" をクリック
- 数分でデプロイ完了

### 方法2: 直接アップロード

```bash
# ビルド実行
pnpm build

# Wrangler CLIでデプロイ
npx wrangler pages deploy dist --project-name=ktblog
```

### カスタムドメイン設定

1. Cloudflare Pagesダッシュボードでプロジェクトを開く
2. "Custom domains" タブをクリック
3. "Set up a custom domain" をクリック
4. ドメイン名を入力（例: `tsurumai-nara.com`）
5. DNS設定を確認・適用

## 🎨 テーマのカスタマイズ

各テーマのCSS変数を調整して、色やフォントをカスタマイズできます。

### 例: Sample A のアクセントカラーを変更

```css
/* src/styles/global.css */
:root {
  --color-accent: #ff6b6b; /* 金から赤に変更 */
}
```

### 例: フォントを変更

```css
/* src/styles/global.css */
body {
  font-family: 'Your Custom Font', sans-serif;
}
```

## 📊 パフォーマンス最適化

Astroはデフォルトで最適化されていますが、追加の最適化:

### 画像最適化

```astro
---
import { Image } from 'astro:assets';
import myImage from '../images/photo.jpg';
---

<Image src={myImage} alt="Description" width={800} height={600} />
```

### フォント最適化

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

## 🔍 トラブルシューティング

### 開発サーバーが起動しない

```bash
# ポートを確認
lsof -ti:4321

# プロセスを終了
kill -9 <PID>

# 再度起動
pnpm dev
```

### ビルドエラー

```bash
# 依存関係を再インストール
rm -rf node_modules pnpm-lock.yaml
pnpm install

# キャッシュをクリア
rm -rf .astro dist
pnpm build
```

### スタイルが適用されない

```bash
# 開発サーバーを再起動
pnpm dev

# ブラウザキャッシュをクリア（Cmd+Shift+R）
```

## 📚 リソース

- [Astro ドキュメント](https://docs.astro.build/)
- [Tailwind CSS ドキュメント](https://tailwindcss.com/docs)
- [Cloudflare Pages ドキュメント](https://developers.cloudflare.com/pages/)

## 📄 ライセンス

このプロジェクトは自由に使用・改変できます。

---

**KTblog Design System** - 4つの美しいテーマで、あなたの思想を表現しよう。
