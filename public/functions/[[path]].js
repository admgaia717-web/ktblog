// public/functions/[[path]].js
// Cloudflare Pages の catch-all handler。
// _worker.js と異なり、functions/ ディレクトリ内の [[path]].js は
// Pages Function として確実に認識される。
//
// なぜ必要か:
//   - Cloudflare Pages の SPA mode (Dashboard で有効化) が
//     _redirects / 404.html / _worker.js を全部上書きしてしまう
//   - しかし functions/[[path]].js は Pages Function として登録され、
//     リクエストの単一入口として ASSETS バインディングで実ファイルを取得できる
//   - これにより SPA mode をランタイムで上書きできる
//
// 設置場所: public/functions/[[path]].js → dist/functions/[[path]].js
// Cloudflare Pages が Pages Function として自動認識

export const onRequest = async (context) => {
  const { request, env, next } = context;
  const url = new URL(request.url);

  if (!env.ASSETS) {
    return new Response('ASSETS binding not available', { status: 500 });
  }

  // 拡張子を持つパス（画像・CSS・JS・txt 等）
  const isAssetPath = /\.(png|jpg|jpeg|svg|gif|webp|ico|bmp|tiff|avif|css|js|mjs|map|woff2?|ttf|otf|eot|txt|xml|json|webmanifest|pdf|mp4|webm|mp3|ogg|wav)(\?|#|$)/i.test(url.pathname);

  // 特殊なファイル（robots.txt, llms.txt 等）
  const isSpecialFile = /^\/(robots\.txt|llms\.txt|_redirects|404\.html|favicon\.ico|sitemap.*\.xml|feed.*\.xml|manifest.*\.json)/i.test(url.pathname);

  const needsAssetOverride = isAssetPath || isSpecialFile;

  // 1. ASSETS バインディングを直接叩く
  if (needsAssetOverride) {
    try {
      const assetRequest = new Request(url.toString(), {
        method: request.method,
        headers: request.headers,
      });
      const assetResponse = await env.ASSETS.fetch(assetRequest);

      if (assetResponse && assetResponse.status === 200) {
        const ct = assetResponse.headers.get('content-type') || '';

        // SPA fallback 判定: 拡張子持ちパス or 特殊ファイル で text/html が返る
        // = ファイルが存在しない (Dashboard の SPA mode で index.html にされた)
        const isSpaFallback = (isAssetPath || isSpecialFile) && ct.includes('text/html');
        if (isSpaFallback) {
          return new Response('Not Found', {
            status: 404,
            headers: { 'Content-Type': 'text/plain' },
          });
        }

        return new Response(assetResponse.body, {
          status: assetResponse.status,
          statusText: assetResponse.statusText,
          headers: assetResponse.headers,
        });
      }
    } catch (e) {
      // ASSETS で例外が出たら next() にフォールバック
    }
  }

  // 2. 通常のルーティング
  return next();
};
