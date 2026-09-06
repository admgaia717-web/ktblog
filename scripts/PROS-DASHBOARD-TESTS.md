# プロス ダッシュボードの回帰テスト

対象は `public/pros/dashboard/`。既存のデータ配列・タスクID・`pros-dash-v1` を維持する。

## 構造・動作の回帰テスト

リポジトリの依存関係を増やさず、一時ディレクトリに検査用の依存を置く。

```sh
npm install --prefix /tmp/pros-dashboard-qa jsdom
node scripts/test-pros-dashboard.mjs
```

別の場所へインストールした場合は `PROS_QA_PACKAGE=/absolute/path/package.json` で指定。

検査対象: 成果物が先頭、詳細は閉じて開始、旧 `#flow` リンクを開くと会議の内容を展開、元の12成果物リンクと44タスクID、重複IDなし、自動再生なし。新しい納品・タスクを意図的に追加したときだけ `fixtures/pros-dashboard-baseline.json` の基準を更新する。

## ブラウザ検査

- PC 1440px、スマホ320/390px、タブレット768px。動画が最初の画面に見え、横にはみ出さないこと。
- ナビ4項目はスマホでも表示する。元の `dashboard.css` は960px以下でナビを非表示にするため、新CSS側で `display:flex` を明示する。
- 動画を再生し、再生時間が進むことを確認する。自動再生はしない。
- アーカイブの12リンクはGETで検査する（HEADはPagesの偽404に注意）。
- タスクを担当者で絞り、チェック変更→再読込で保存されることを確認する。検査用の隔離ブラウザを使い、ユーザーの保存状態を変更しない。
- `#flow` / `#board` 直リンク、同じアンカーの再クリック、折りたたみのキーボード操作を確認する。
- axe-core の `wcag2a` / `wcag2aa` を閉じた状態・すべて開いた状態の双方で実行する。

## デザイン変更範囲

`dashboard-clean.css` は `index.html` だけで読み込む。既存 `dashboard.css` は文字起こしページと共有しているため上書きしない。素材・会議データ・記録・認証設定は変更しない。

## デプロイ

`pnpm install --frozen-lockfile && pnpm build` → 対象ファイルだけをコミット → GitHub Actions。`public/tags.json` のビルド由来差分は混ぜない。本番で新HTML/CSS/JSの内容・認証維持を読み戻して確認する。
