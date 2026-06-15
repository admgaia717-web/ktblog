#!/usr/bin/env node
/**
 * deploy — 記事をコミットしてデプロイ
 *
 * 使い方:
 *   node scripts/deploy.mjs "コミットメッセージ"
 *
 * コミットメッセージを省略すると "update posts" が使われる。
 * DRY_RUN 環境変数を設定すると git push をスキップ:
 *   DRY_RUN=1 node scripts/deploy.mjs
 */

import { execSync } from 'child_process';

const msg = process.argv[2] || 'update posts';

try {
  const status = execSync('git status --porcelain', { encoding: 'utf-8' });
  if (!status.trim()) {
    console.log('✓ 変更がないためスキップ');
    process.exit(0);
  }

  execSync('git add src/content/posts/', { stdio: 'inherit' });
  execSync('git add scripts/', { stdio: 'inherit' });
  execSync('git add public/', { stdio: 'inherit' });
  execSync(`git commit -m "${msg.replace(/"/g, '\\"')}"`, { stdio: 'inherit' });

  if (process.env.DRY_RUN) {
    console.log('✓ DRY_RUN: git push をスキップ');
  } else {
    execSync('git push origin main', { stdio: 'inherit' });
    console.log('✓ デプロイ完了 (Cloudflare Pages)');
  }
} catch (err) {
  console.error('エラー:', err.message);
  process.exit(1);
}
