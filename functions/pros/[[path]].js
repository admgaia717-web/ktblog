// /pros/* を守る Pages Function
// 2026-11-06: Basic認証ダイアログ → ページ内ログイン + 署名付きCookie（30日）に変更。
// パスワードは functions/pros 配下の4ファイルで共通。
// - Cookie pros_auth（HMAC署名つき・30日）があれば素通し
// - Basic認証（ユーザー名任意・同じ新しいパスワード）も互換で通す（curl・既存スクリプト用）
// - 未認証のGETは /pros/login へリダイレクト（ブラウザの認証ダイアログは出さない）

const REQUIRED_PASSWORD = 'kodama-momo-2156';
const COOKIE_NAME = 'pros_auth';
const COOKIE_MAX_AGE = 2592000; // 30日（秒）
const SECRET_SUFFIX = '::pros-cookie-v1';

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const pathname = url.pathname;

  // ログインページ（GETは素通し・POSTはここで処理）
  if (pathname === '/pros/login' || pathname === '/pros/login/') {
    if (request.method === 'POST') return handleLogin(request);
    return context.next();
  }

  if (await isAuthorized(request)) {
    return authorizedResponse(context, pathname);
  }

  // 未認証: ページ要求はログインへ、それ以外は401（ダイアログを出さない）
  if (request.method === 'GET') {
    const next = encodeURIComponent(pathname + (url.search || ''));
    return new Response(null, {
      status: 302,
      headers: { Location: '/pros/login?next=' + next, 'Cache-Control': 'no-store' },
    });
  }
  return new Response('Authentication required', { status: 401 });
}

async function authorizedResponse(context, pathname) {
  if (pathname === '/pros/deliverables/abc-lesson' ||
      pathname.startsWith('/pros/deliverables/abc-lesson/')) {
    const source = await context.next();
    let response = new Response(source.body, source);
    // Only the classroom lesson excludes platform-injected analytics.
    // Authentication above and every other Pros path remain unchanged.
    response.headers.set('Cache-Control', 'private, no-store, no-transform');
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    response.headers.set('Referrer-Policy', 'same-origin');
    if ((response.headers.get('Content-Type') || '').includes('text/html')) {
      response = new HTMLRewriter()
        .on('script[src*="static.cloudflareinsights.com/beacon"]', {
          element(element) { element.remove(); }
        })
        .transform(response);
    }
    return response;
  }
  return context.next();
}

async function handleLogin(request) {
  let next = '/pros/dashboard/';
  let pw = '';
  try {
    const form = await request.formData();
    pw = String(form.get('pw') || '');
    const n = String(form.get('next') || '');
    if (n.startsWith('/pros/') && !n.startsWith('/pros//')) next = n;
  } catch {
    return loginFail(next);
  }
  if (!safeEqual(pw, REQUIRED_PASSWORD)) return loginFail(next);

  const exp = Math.floor(Date.now() / 1000) + COOKIE_MAX_AGE;
  const sig = await hmacHex('pros-auth:' + exp);
  const value = 'v1.' + exp + '.' + sig;
  return new Response(null, {
    status: 302,
    headers: {
      Location: next,
      'Set-Cookie': `${COOKIE_NAME}=${value}; Max-Age=${COOKIE_MAX_AGE}; HttpOnly; Secure; SameSite=Lax; Path=/`,
      'Cache-Control': 'no-store',
    },
  });
}

function loginFail(next) {
  return new Response(null, {
    status: 302,
    headers: { Location: '/pros/login?e=1&next=' + encodeURIComponent(next), 'Cache-Control': 'no-store' },
  });
}

async function isAuthorized(request) {
  if (await hasValidCookie(request)) return true;
  const auth = request.headers.get('Authorization');
  if (!auth || !auth.startsWith('Basic ')) return false;
  let decoded = '';
  try { decoded = atob(auth.slice('Basic '.length)); } catch { return false; }
  const i = decoded.indexOf(':');
  if (i === -1) return false;
  return safeEqual(decoded.slice(i + 1), REQUIRED_PASSWORD);
}

async function hasValidCookie(request) {
  const cookie = request.headers.get('Cookie') || '';
  const m = cookie.match(/(?:^|;\s*)pros_auth=([^;\s]+)/);
  if (!m) return false;
  const parts = m[1].split('.');
  if (parts.length !== 3 || parts[0] !== 'v1') return false;
  const exp = parseInt(parts[1], 10);
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000) - 300) return false;
  const sig = await hmacHex('pros-auth:' + parts[1]);
  return safeEqual(parts[2], sig);
}

async function hmacHex(msg) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(REQUIRED_PASSWORD + SECRET_SUFFIX),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(msg));
  let hex = '';
  for (const b of new Uint8Array(sig)) hex += b.toString(16).padStart(2, '0');
  return hex;
}

// 文字列の定数時間比較（長さの違いで早期returnせず、総当たりで比較）
function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const enc = new TextEncoder();
  const aBytes = enc.encode(a);
  const bBytes = enc.encode(b);
  if (aBytes.length !== bBytes.length) return false;
  let diff = 0;
  for (let i = 0; i < aBytes.length; i++) {
    diff |= aBytes[i] ^ bBytes[i];
  }
  return diff === 0;
}
