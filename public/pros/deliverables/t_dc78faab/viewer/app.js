// 26字ジェスチャービューア — t_dc78faab
// クリップ26本を一覧再生できる静的ページ。依存ライブラリなし。
// クリップ26本を一覧再生できる静的ページ。依存ライブラリなし。DATA は data.js で定義。

const grid = document.getElementById('grid');
const counts = { match: 0, partial: 0, mismatch: 0 };
DATA.letters.forEach(L => { counts[L.actions.verdict] = (counts[L.actions.verdict] || 0) + 1; });

const verdictJa = { match: '○ 正本と一致', partial: '△ 一部一致', mismatch: '× 正本と別系統' };

document.getElementById('summary').textContent =
  '26字（実測 ' + DATA.span + '）／アクション判定 ○' + counts.match +
  '・△' + counts.partial + '・×' + counts.mismatch +
  '（×は h・m・s。採否は9/10「お話し通り」照合待ち）';

DATA.letters.forEach(L => {
  const card = document.createElement('div');
  card.className = 'card v-' + L.actions.verdict;
  const vid = document.createElement('video');
  vid.src = 'clips/' + L.letter + '.mp4';
  vid.controls = true;
  vid.preload = 'none';
  vid.playsInline = true;
  const badge = document.createElement('span');
  badge.className = 'badge b-' + L.actions.verdict;
  badge.textContent = verdictJa[L.actions.verdict];
  const head = document.createElement('div');
  head.className = 'head';
  const lt = document.createElement('span');
  lt.className = 'lt';
  lt.textContent = L.letter;
  const nm = document.createElement('span');
  nm.className = 'nm';
  nm.textContent = L.character;
  head.append(lt, nm, badge);
  const meta = document.createElement('div');
  meta.className = 'meta';
  const win = DATA.measured[L.letter] || {};
  const clipTxt = win.clip_start != null
    ? '実演 ' + L.start + '–' + L.end + '秒／クリップ ' + win.clip_start + '–' + win.clip_end + '秒'
    : '実演 ' + L.start + '–' + L.end + '秒';
  meta.textContent = clipTxt;
  const act = document.createElement('div');
  act.className = 'act';
  act.textContent = '正本: ' + L.actions.canonical.join(' → ');
  const obs = document.createElement('div');
  obs.className = 'obs';
  obs.textContent = '実測: ' + L.actions.observed;
  if (L.actions.note) {
    const nt = document.createElement('div');
    nt.className = 'note';
    nt.textContent = '注: ' + L.actions.note;
    act.append(nt);
  }
  card.append(head, vid, meta, act, obs);
  grid.append(card);
});
