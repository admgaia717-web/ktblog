// functions/_middleware.js
// Cloudflare Pages の SPA fallback（ダッシュボードで有効化された状態）を
// ランタイムで上書きする。env.ASSETS バインディングを使い、
// 実ファイルが存在するパスを強制的にそのまま返す。
//
// なぜ必要か:
//   - Cloudflare Pages の SPA mode が ON だと、_redirects や 404.html よりも
//     優先して全パスを index.html に rewrite する
//   - そのため <img src="/assets/eyecatch/...png"> も _astro/*.css も
//     text/html (index.html) が返り、ブラウザがレンダリングできない
//   - この middleware は ASSETS を直接 fetch して実ファイルを取得する
//
// 設置場所:
//   public/functions/_middleware.js → dist/functions/_middleware.js にコピー
//   Cloudflare Pages が Pages Function として自動認識

export const onRequest = async (context) => {
  const { request, env, next } = context;
  const url = new URL(request.url);

  // 拡張子ベースで「本来実ファイルを返すべきパス」か判定
  const isAssetPath = /\.(png|jpg|jpeg|svg|gif|webp|ico|bmp|tiff|avif|css|js|mjs|map|woff2?|ttf|otf|eot|txt|xml|json|webmanifest|pdf|mp4|webm|mp3|ogg|wav)(\?|#|$)/i.test(url.pathname);

  // SPA fallback がかかった場合に text/html で返ってくる拡張子なしパス
  // （/robots.txt, /llms.txt, /_redirects など special ファイルも対象）
  const isSpecialFile = /^\/(robots\.txt|llms\.txt|_redirects|404\.html|favicon\.ico|sitemap.*\.xml|feed.*\.xml|rss.*\.xml|manifest.*\.json)/i.test(url.pathname);

  const needsAssetOverride = isAssetPath || isSpecialFile;

  // 1. ASSETS バインディングを直接叩いて実ファイルを取得
  if (needsAssetOverride && env.ASSETS) {
    try {
      const assetRequest = new Request(url.toString(), {
        method: request.method,
        headers: request.headers,
      });
      const assetResponse = await env.ASSETS.fetch(assetRequest);

      if (assetResponse && assetResponse.status === 200) {
        const ct = assetResponse.headers.get('content-type') || '';
        // ASSETS から text/html が返ってきたら本物の HTML か SPA fallback か判別不能
        // その場合は next() にフォールバック
        if (!ct.includes('text/html') || url.pathname.endsWith('.html') || url.pathname.endsWith('/')) {
          return new Response(assetResponse.body, {
            status: assetResponse.status,
            statusText: assetResponse.statusText,
            headers: assetResponse.headers,
          });
        }
      }
    } catch (e) {
      // ASSETS で例外が出たら next() にフォールバック
    }
  }

  // 2. 通常のルーティング（SPA fallback 込み）
  return next();
};
