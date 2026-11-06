// /pros/phonics/api/file の GET — Mattermost の添付ファイルを認証付きで中継する。
// 会話の中で動画・画像をその場で再生するために使う。
// query: ?id=<mattermost file_id>
// 認証: Basic 5155（/pros/* と共通）。Range を転送するので動画のシークも効く。

const MM_BASE = "https://ktailabo.tail5c4c1d.ts.net";
const REQUIRED_PASSWORD = "5155";
const REALM = "pros";

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
    headers: { "Content-Type": "application/json; charset=utf-8" },
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
