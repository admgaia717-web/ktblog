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
const REQUIRED_PASSWORD = '5155';
const REALM = 'pros';

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

function isAuthorized(request) {
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

  if (!isAuthorized(request)) {
    return new Response('Authentication required', {
      status: 401,
      headers: { 'WWW-Authenticate': `Basic realm="${REALM}", charset="UTF-8"` },
    });
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

  if (!body) {
    return json({ ok: false, message: "依頼内容を入力してください。" }, 400);
  }
  if (body.length > MAX_BODY) {
    return json({ ok: false, message: "依頼内容は " + MAX_BODY + " 文字までです。" }, 400);
  }

  // 依頼者は北浦先生・蜂谷さん・KT の3名に絞る（他人の名義で投稿しないため）
  const ALLOWED = ["北浦先生", "蜂谷さん", "KT"];
  const who = ALLOWED.indexOf(name) >= 0 ? name : "北浦先生";

  const lines = [
    "@phonimaru-d Webアプリからの依頼です。",
    "",
    "【依頼者】" + who,
    "",
    "【依頼内容】",
    body,
  ];

  const props = { override_username: who };
  const res = await fetch(MM_BASE + "/api/v4/posts", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
      "User-Agent": "phonics-webapp/1.0",
    },
    body: JSON.stringify({
      channel_id: CHANNEL_ID,
      message: lines.join("\n"),
      props: props,
    }),
  });

  if (!res.ok) {
    const t = await res.text().catch(() => "");
    return json({ ok: false, message: "送信できませんでした（" + res.status + "）。" }, 502);
  }
  const post = await res.json().catch(() => ({}));
  return json({ ok: true, post_id: post.id || "" });
}
