// /pros/phonics/api/thread の GET — Webアプリから依頼スレッドの状態を読み取る。
//
// query: ?root=<root_post_id>  … そのスレッドの投稿を新しい順に返す
//         （無指定なら「依頼」性质的投稿だけを新しい順）
//
// 認証: Basic 5155（/pros/* と共通）。読み取り専用。

const MM_BASE = "https://ktailabo.tail5c4c1d.ts.net";
const CHANNEL_ID = "meskynx4fibo3ch7r7x8imi7nw";
const REQUIRED_PASSWORD = "5155";
const REALM = "pros";
const MAX_POSTS = 60;

function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const enc = new TextEncoder();
  const aBytes = enc.encode(a);
  const bBytes = enc.encode(b);
  if (aBytes.length !== bBytes.length) return false;
  let diff = 0;
  for (let i = 0; i < aBytes.length; i++) diff |= aBytes[i] ^ bBytes[i];
  return diff === 0;
}

function isAuthorized(request) {
  const auth = request.headers.get("Authorization");
  if (!auth || !auth.startsWith("Basic ")) return false;
  let decoded = "";
  try { decoded = atob(auth.slice("Basic ".length)); } catch { return false; }
  const i = decoded.indexOf(":");
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
  if (!isAuthorized(request)) {
    return new Response("Authentication required", {
      status: 401,
      headers: { "WWW-Authenticate": `Basic realm="${REALM}", charset="UTF-8"` },
    });
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
    if (root) {
      // 指定スレッド（root か、そのスレッドへの返信）
      if (p.id !== root && p.root_id !== root) continue;
    } else {
      // 依頼性质的投稿だけ（Webアプリからの依頼・承認）
      const ph = props.phonics || {};
      if (!props.override_username && ph.kind !== "request" && ph.kind !== "reply") continue;
    }
    const ph = props.phonics || {};
    items.push({
      id: p.id,
      root_id: p.root_id || "",
      create_at: p.create_at,
      user_id: p.user_id,
      // 依頼は依頼者名（override_username）、応答はフォニ丸D
      who: props.override_username || (ph.kind === "reply" ? "フォニ丸D" : ""),
      message: p.message || "",
      files: (props.files || []).map((f) => ({ name: f.name, id: f.id, size: f.size })),
      state: ph.state || "",
      kind: ph.kind || "",
    });
  }
  items.sort((a, b) => b.create_at - a.create_at);
  return json({ ok: true, posts: items.slice(0, limit) });
}
