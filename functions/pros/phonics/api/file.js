// /pros/phonics/api/file の GET — Mattermost の添付ファイルを認証付きで中継する。
// 会話の中で動画・画像をその場で再生するために使う。
// query: ?id=<mattermost file_id>
// 認証: 共通パスワード（/pros/* と共通）。Range を転送するので動画のシークも効く。

const MM_BASE = "https://ktailabo.tail5c4c1d.ts.net";
const REQUIRED_PASSWORD = 'kodama-momo-2156';
const COOKIE_NAME = 'pros_auth';
const COOKIE_MAX_AGE = 2592000; // 30日（秒）
const SECRET_SUFFIX = '::pros-cookie-v1';

function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const enc = new TextEncoder();
  const aBytes = enc.encode(a);
  const bBytes = enc.encode(b);
  if (aBytes.length !== bBytes.length) return false;
  let diff = 0;
  for (let i = 0; i < aBytes.length; i++) diff |= aBytes[i] ^ bBytes[i];
  return diff === 0;
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

// Cookie（30日ログイン）または Basic（ユーザー名任意・共通パスワード）を許可
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

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

export async function onRequest(context) {
  const { request, env } = context;
  if (request.method !== "GET") {
    return json({ ok: false, message: "GET のみ対応しています。" }, 405);
  }
  if (!(await isAuthorized(request))) {
    return new Response("Authentication required", { status: 401 });
  }
  const token = env && env.PHONICS_WEBAPP_PAT;
  if (!token) {
    return json({ ok: false, message: "サーバーの設定が未完了です。" }, 500);
  }

  const id = (new URL(request.url).searchParams.get("id") || "").trim();
  if (!/^[a-z0-9]{20,32}$/i.test(id)) {
    return json({ ok: false, message: "ファイルIDが不正です。" }, 400);
  }

  const headers = { Authorization: "Bearer " + token, "User-Agent": "phonics-webapp/1.0" };
  const range = request.headers.get("Range");
  if (range) headers["Range"] = range;

  let res;
  try {
    res = await fetch(MM_BASE + "/api/v4/files/" + id, { headers });
  } catch (e) {
    return json({ ok: false, message: "ファイルサーバーに接続できませんでした。" }, 502);
  }
  if (!res.ok && res.status !== 206) {
    return json({ ok: false, message: "ファイルを読めませんでした（" + res.status + "）。" }, res.status === 404 ? 404 : 502);
  }

  const out = new Headers();
  out.set("Content-Type", res.headers.get("Content-Type") || "application/octet-stream");
  const len = res.headers.get("Content-Length");
  if (len) out.set("Content-Length", len);
  const cr = res.headers.get("Content-Range");
  if (cr) out.set("Content-Range", cr);
  out.set("Accept-Ranges", "bytes");
  out.set("Cache-Control", "private, max-age=3600");
  return new Response(res.body, { status: res.status, headers: out });
}
