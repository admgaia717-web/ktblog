// /pros/api/request の POST — Webアプリの依頼を Mattermost「Send the message」に送る。
//
// 入力: { body, name }
// 出力: { ok: true } / { ok: false, message }
//
// 認証: Cloudflare Pages の環境変数 PHONICS_WEBAPP_PAT（投稿専用アカウントのPAT）を読む。
// 表示名は props.override_username で依頼者名義にする。
// 注意: フォニ丸D のPATで投げると user_id が フォニ丸D になり、ブリッジが
//       自分の投稿とみなして無視する。専用の投稿アカウントが必要。

const MM_BASE = "https://ktailabo.tail5c4c1d.ts.net";
const CHANNEL_ID = "meskynx4fibo3ch7r7x8imi7nw"; // send-the-message
const MAX_BODY = 2000;
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
  const { request } = context;
  if (request.method !== "POST") {
    return json({ ok: false, message: "POST のみ対応しています。" }, 405);
  }

  if (!(await isAuthorized(request))) {
    return json({ ok: false, message: "ログインが必要です。" }, 401);
  }

  const token = context.env && context.env.PHONICS_WEBAPP_PAT;
  if (!token) {
    return json({ ok: false, message: "サーバーの送信設定が未完了です。" }, 500);
  }

  let payload;
  try {
    payload = await request.json();
  } catch (e) {
    return json({ ok: false, message: "入力が読めませんでした。" }, 400);
  }

  const body = String((payload && payload.body) || "").trim();
  const name = String((payload && payload.name) || "").trim();
  const rootId = String((payload && payload.root_id) || "").trim();
  const budget = String((payload && payload.budget) || "").trim();
  const approve = !!(payload && payload.approve);

  if (!body) {
    return json({ ok: false, message: "依頼内容を入力してください。" }, 400);
  }
  if (body.length > MAX_BODY) {
    return json({ ok: false, message: "依頼内容は " + MAX_BODY + " 文字までです。" }, 400);
  }

  // 依頼者は北浦先生・蜂谷さん・KT の3名に絞る（他人の名義で投稿しないため）
  const ALLOWED = ["北浦先生", "蜂谷さん", "KT"];
  const who = ALLOWED.indexOf(name) >= 0 ? name : "北浦先生";

  const isReply = !!rootId && !approve;
  const lines = approve
    ? [
        "@phonimaru-d 承認です。",
        "",
        "【承認者】" + who,
        (budget ? "【上限金額】" + budget + " ドル" : ""),
        "",
        "【内容】",
        body,
      ].filter((x) => x !== "")
    : isReply
    ? [
        "@phonimaru-d",
        "",
        "【" + who + "】",
        body,
      ]
    : [
        "@phonimaru-d Webアプリからの依頼です。",
        "",
        "【依頼者】" + who,
        (budget ? "【予算の上限】" + budget + " ドル" : ""),
        "",
        "【依頼内容】",
        body,
      ].filter((x) => x !== "");

  // 返信は state を空にして、進行ボードの状態表示を巻き戻さない
  const props = {
    override_username: who,
    phonics: { kind: "request", state: approve ? "approved" : (isReply ? "" : "request") },
  };
  const postPayload = {
    channel_id: CHANNEL_ID,
    message: lines.join("\n"),
    props: props,
  };
  // 承認・返信は同じスレッドに返す（フォニ丸D が文脈を保ったまま受け取る）
  if (rootId) {
    postPayload.root_id = rootId;
  }
  const res = await fetch(MM_BASE + "/api/v4/posts", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
      "User-Agent": "phonics-webapp/1.0",
    },
    body: JSON.stringify(postPayload),
  });

  if (!res.ok) {
    const t = await res.text().catch(() => "");
    return json({ ok: false, message: "送信できませんでした（" + res.status + "）。" }, 502);
  }
  const post = await res.json().catch(() => ({}));
  return json({ ok: true, post_id: post.id || "" });
}
