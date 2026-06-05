#!/bin/bash

# KTblog テーマ適用スクリプト
# 使用法: ./apply-theme.sh <theme-name>
# 例: ./apply-theme.sh sample-a

set -e

# 引数チェック
if [ $# -eq 0 ]; then
  echo "エラー: テーマ名を指定してください"
  echo ""
  echo "使用法: ./apply-theme.sh <theme-name>"
  echo ""
  echo "利用可能なテーマ:"
  echo "  sample-a - 黒・金・深緑（現代の寺子屋 × サイバーパンク × 戦国記録庫）"
  echo "  sample-b - 生成り・墨・赤（古文書 × 思想誌 × 奈良の記録）"
  echo "  sample-c - 黒・白・蛍光グリーン（AI兵法 × ハッカー思想メディア）"
  echo "  sample-d - 白・グレー・金（高級note代替 × 読みやすい個人思想メディア）"
  echo ""
  echo "例: ./apply-theme.sh sample-b"
  exit 1
fi

THEME_NAME=$1
THEME_PATH="./designs/$THEME_NAME"
TARGET_PATH="./src/styles/global.css"

# テーマ存在チェック
if [ ! -d "$THEME_PATH" ]; then
  echo "エラー: テーマ '$THEME_NAME' が見つかりません"
  echo ""
  echo "利用可能なテーマ:"
  ls -1 designs/ | sed 's/^/  /'
  exit 1
fi

# CSSファイル存在チェック
if [ ! -f "$THEME_PATH/src/styles/global.css" ]; then
  echo "エラー: テーマ '$THEME_NAME' にCSSファイルが見つかりません"
  exit 1
fi

# バックアップ作成
if [ -f "$TARGET_PATH" ]; then
  BACKUP_PATH="$TARGET_PATH.backup.$(date +%Y%m%d-%H%M%S)"
  cp "$TARGET_PATH" "$BACKUP_PATH"
  echo "✓ 既存のスタイルをバックアップしました: $BACKUP_PATH"
fi

# テーマ適用
cp "$THEME_PATH/src/styles/global.css" "$TARGET_PATH"

echo ""
echo "✓ テーマ '$THEME_NAME' を適用しました"
echo ""
echo "次のステップ:"
echo "  1. 開発サーバーで確認: pnpm dev"
echo "  2. ビルドして確認: pnpm build && pnpm preview"
echo "  3. 変更をコミット: git add . && git commit -m \"Apply $THEME_NAME theme\""
echo ""
