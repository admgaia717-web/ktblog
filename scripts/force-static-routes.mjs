// Cloudflare Pages 用の post-build hook
// 目的: _routes.json を「/pros/* のみ Pages Function 経由」+「他は静的配信」にする
// なぜ必要か: /pros/* には Basic 認証 Function があるため、そのパスのみ
//   include し、残りは静的に配信する。
//   （include: [] にしてしまうと、Function が有る場合に
//     "Routes must have at least 1 include rule" でデプロイが失敗する）
import fs from 'fs';
import path from 'path';

const dist = path.resolve('dist');
const routesPath = path.join(dist, '_routes.json');

if (fs.existsSync(routesPath)) {
  // Cloudflare adapter が生成した _routes.json を上書き
  // include: ['/pros/*'] → /pros/* のみ Functions（Basic認証）経由
  // exclude: [] → それ以外はすべて静的配信
  const minimal = {
    version: 1,
    include: ['/pros/*'],
    exclude: []
  };
  fs.writeFileSync(routesPath, JSON.stringify(minimal, null, 2));
  console.log('✓ _routes.json を /pros/*-only に設定（include: ["/pros/*"]）');
} else {
  const minimal = { version: 1, include: ['/pros/*'], exclude: [] };
  fs.writeFileSync(routesPath, JSON.stringify(minimal, null, 2));
  console.log('✓ _routes.json を新規作成（/pros/*-only）');
}

// _worker.js ディレクトリがあれば削除（Pages Function 無効化）
const workerJs = path.join(dist, '_worker.js');
if (fs.existsSync(workerJs)) {
  fs.rmSync(workerJs, { recursive: true, force: true });
  console.log('✓ _worker.js ディレクトリ削除');
}
