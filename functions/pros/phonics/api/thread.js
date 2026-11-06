// /pros/phonics/api/thread の GET — Webアプリから依頼スレッドの状態を読み取る。
//
// query: ?root=<root_post_id>  … そのスレッドの投稿を新しい順に返す
//         （無指定なら「依頼」的な投稿だけを新しい順）
//
// 認証: 共通パスワード（/pros/* と共通）。読み取り専用。

const MM_BASE = "https://ktailabo.tail5c4c1d.ts.net";
const CHANNEL_ID = "meskynx4fibo3ch7r7x8imi7nw";
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
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "private, no-store",
    },
  });
}

export async function onRequest(context) {
  const { request, env } = context;
  if (request.method !== "GET") {
    return json({ ok: false, message: "GET のみ対応しています。" }, 405);
  }
  if (!(await isAuthorized(request))) {
    return json({ ok: false, message: "ログインが必要です。" }, 401);
  }
  const token = env && env.PHONICS_WEBAPP_PAT;
  if (!token) {
    return json({ ok: false, message: "サーバーの設定が未完了です。" }, 500);
  }

  const url = new URL(request.url);
  const root = url.searchParams.get("root") || "";
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "40", 10) || 40, MAX_POSTS);

  let res = await fetch(
    MM_BASE + "/api/v4/channels/" + CHANNEL_ID + "/posts?per_page=" + MAX_POSTS,
    { headers: { Authorization: "Bearer " + token, "User-Agent": "phonics-webapp/1.0" } }
  );
  if (!res.ok) {
    return json({ ok: false, message: "チャンネルを読めませんでした（" + res.status + "）。" }, 502);
  }
  const data = await res.json();
  const posts = data.posts || {};
  const order = data.order || [];

  const items = [];
  for (const pid of order) {
    const p = posts[pid];
    if (!p || p.type) continue;
    const props = p.props || {};
    if (HIDDEN_ROOTS.has(p.root_id || p.id)) continue;
    if (root) {
      // 指定スレッド（root か、そのスレッドへの返信）
      if (p.id !== root && p.root_id !== root) continue;
    }
    // root 無指定は全投稿を返す（会話画面が新着・未読を検知できるようにする。
    // 依頼だけに絞るとフォニ丸Dの応答が取れず、返信が来たか分からないため）
    const ph = props.phonics || {};
    // 添付は metadata.files に入る（props.files ではない。これが無いと動画が表示されない）
    const metaFiles = (p.metadata && p.metadata.files) || props.files || [];
    items.push({
      id: p.id,
      root_id: p.root_id || "",
      create_at: p.create_at,
      user_id: p.user_id,
      // 依頼は依頼者名（override_username）、応答はフォニ丸D
      who: (!p.root_id && OWNER_OVERRIDE[p.id]) || props.override_username || (ph.kind === "reply" ? "フォニ丸D" : ""),
      phonics_present: !!props.phonics,
      message: p.message || "",
      files: metaFiles.map((f) => ({ name: f.name, id: f.id, size: f.size, mime: f.mime_type || "" })),
      state: ph.state || "",
      kind: ph.kind || "",
    });
  }
  items.sort((a, b) => b.create_at - a.create_at);
  return json({ ok: true, posts: items.slice(0, limit) });
}
