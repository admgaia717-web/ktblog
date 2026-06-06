// public/_worker.js
// Cloudflare Pages の SPA mode (Dashboard で有効化されている場合) を
// ワーカーレベルで上書きする最終手段。
//
// _worker.js は Pages プロジェクト全体の入口として動く。
// ASSETS バインディングを直接叩くことで、SPA fallback を経由せずに
// 実ファイルを返す。
//
// 設置場所: public/_worker.js → dist/_worker.js にコピー
// Cloudflare Pages が Pages Worker として自動認識

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);

      if (!env.ASSETS) {
        return new Response('ASSETS binding not available', { status: 500 });
      }

      // 拡張子を持つパス
      const isAssetPath = /\.(png|jpg|jpeg|svg|gif|webp|ico|bmp|tiff|avif|css|js|mjs|map|woff2?|ttf|otf|eot|txt|xml|json|webmanifest|pdf|mp4|webm|mp3|ogg|wav)(\?|#|$)/i.test(url.pathname);

      // 特殊なファイル
      const isSpecialFile = /^\/(robots\.txt|llms\.txt|_redirects|404\.html|favicon\.ico|sitemap.*\.xml|feed.*\.xml|manifest.*\.json)/i.test(url.pathname);

      // 1. ASSETS から直接取得
      const assetResponse = await env.ASSETS.fetch(request);
      const ct = assetResponse.headers.get('content-type') || '';

      // 2. 200 OK の場合
      if (assetResponse.status === 200) {
        // SPA fallback 判定: 拡張子持ちパス or 特殊ファイル で text/html が返る
        // = ファイルが存在しない (ダッシュボードの SPA mode で index.html が返された)
        const isSpaFallback = (isAssetPath || isSpecialFile) && ct.includes('text/html');
        if (isSpaFallback) {
          return new Response('Not Found', {
            status: 404,
            headers: { 'Content-Type': 'text/plain' }
          });
        }
        return assetResponse;
      }

      // 3. ファイルが存在しない (404)
      if (url.pathname === '/' || url.pathname === '') {
        return env.ASSETS.fetch(new URL('/index.html', url));
      }

      // 4. 404.html を返す
      const notFoundResponse = await env.ASSETS.fetch(new URL('/404.html', url));
      if (notFoundResponse.status === 200) {
        return new Response(notFoundResponse.body, {
          status: 404,
          headers: notFoundResponse.headers,
        });
      }

      return new Response('Not Found', {
        status: 404,
        headers: { 'Content-Type': 'text/plain' }
      });
    } catch (e) {
      return new Response('Worker Error: ' + e.message, { status: 500 });
    }
  }
};
