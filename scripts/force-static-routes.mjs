// Cloudflare Pages 用の post-build hook
// 目的: _routes.json を「Pages Function 無効化」+「静的配信強制」にする
// なぜ必要か: Cloudflare adapter のデフォルトの _routes.json は
//   include: ["/*"] で全リクエストを Pages Function に通す。
//   しかし Pages Function が動かない環境では、SPA mode が
//   上書きして全 URL を index.html にしてしまう。
//   そこで _routes.json を最小化（include: [], exclude: []）して
//   Cloudflare Pages に「Pages Function なし、静的配信のみ」と伝える。
import fs from 'fs';
import path from 'path';

const dist = path.resolve('dist');
const routesPath = path.join(dist, '_routes.json');

if (fs.existsSync(routesPath)) {
  // Cloudflare adapter が生成した _routes.json を上書き
  // include: [] → Pages Function を完全に無効化
  // exclude: [] → すべての URL を静的配信
  const minimal = {
    version: 1,
    include: [],
    exclude: []
  };
  fs.writeFileSync(routesPath, JSON.stringify(minimal, null, 2));
  console.log('✓ _routes.json を最小化（include: [], exclude: []）');
} else {
  // 念のため空の _routes.json を作成
  const minimal = { version: 1, include: [], exclude: [] };
  fs.writeFileSync(routesPath, JSON.stringify(minimal, null, 2));
  console.log('✓ _routes.json を新規作成（最小化）');
}

// _worker.js ディレクトリがあれば削除（Pages Function 無効化）
const workerJs = path.join(dist, '_worker.js');
if (fs.existsSync(workerJs)) {
  fs.rmSync(workerJs, { recursive: true, force: true });
  console.log('✓ _worker.js ディレクトリ削除');
}
