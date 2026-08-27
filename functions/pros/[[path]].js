// /pros/* にBasic認証をかける Pages Function
// ユーザー名: 空（任何）/ パスワード: 5155
// 認証OKなら元の静的アセットを返す。それ以外は401でブラウザに認証ダイアログを出す。

const REQUIRED_PASSWORD = '5155';
const REALM = 'pros';

export async function onRequest(context) {
  const { request } = context;

  // Basic認証ヘッダを取得
  const auth = request.headers.get('Authorization');
  if (!auth || !auth.startsWith('Basic ')) {
    return requireAuth();
  }

  // "Basic <base64>" をデコード → "username:password"
  let decoded = '';
  try {
    decoded = atob(auth.slice('Basic '.length));
  } catch {
    return requireAuth();
  }

  // ユーザー名は問わない。パスワード部分だけ照合。
  // "username:password" → 2つ目の要素（最初の ":" で分割）
  const colonIdx = decoded.indexOf(':');
  if (colonIdx === -1) {
    return requireAuth();
  }
  const password = decoded.slice(colonIdx + 1);

  // 定数時間比較でタイミング攻撃を軽減
  if (!safeEqual(password, REQUIRED_PASSWORD)) {
    return requireAuth();
  }

  // 認証OK → 元の静的アセットへパススルー
  return context.next();
}

function requireAuth() {
  return new Response('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': `Basic realm="${REALM}", charset="UTF-8"`,
    },
  });
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
