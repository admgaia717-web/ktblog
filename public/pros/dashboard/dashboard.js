/* PROS PHONICS 首脳スタッフ ダッシュボード
 * データ源: 2026-09-03 第2回定例（Zoom, 100分）文字起こし + 8/27 キックオフ記録
 * チェック状態はブラウザの localStorage に保存（キー: pros-dash-v1）
 */
'use strict';

const MEETING = {
  date: '2026-09-03',
  title: '第2回 定例ミーティング',
  minutes: 100,
  next: { iso: '2026-09-17T14:30:00+09:00', label: '9月17日（木）14:30〜16:00', place: 'Zoom（プロスのアカウント）' },
};

const MEMBERS = {
  motoyama: { name: '本山先生', role: 'プロス代表・グランドデザイン', color: 'apple', initial: '本' },
  kitaura:  { name: '北浦先生', role: '現場・SNS・受付', color: 'broccoli', initial: '北' },
  tamagawa: { name: '玉川（KT）', role: 'AI・エージェント・拡散', color: 'berry', initial: '玉' },
  hachiya:  { name: '蜂谷さん', role: '橋渡し・進行・記録', color: 'lemon', initial: '蜂' },
  agent:    { name: 'オ課長＋第5中隊', role: 'AI 制作部隊（4号機 Hermes・まー君の後継）', color: 'sky', initial: 'オ' },
  all:      { name: '全員', role: '4人＋オ課長', color: 'peach', initial: '全' },
};

/* 会議の流れ（分） */
const FLOW = [
  { from: 0, to: 8, title: 'オープニングと疑問の整理', who: ['motoyama', 'kitaura'],
    points: ['Zoom で顔を見ながら話す運用に決定（プロスのアカウント2本）', '本山先生の疑問：「100円で作れる」とは何か／アプリ化の形／2文字・3文字・有料化までの全体像が描けない', '北浦先生：枠組みをある程度決めてから進めたい'] },
  { from: 8, to: 27, title: '「100円動画」の正体と拡散戦略', who: ['tamagawa', 'motoyama'],
    points: ['踊るリンゴ動画＝11秒で約100円。エージェントがプロスHPを読んで自分で筋書きを作った', '幼児向け（プロスフォニックス）から積み上げる。上位は市販教科書なので売れない', 'SNS（TikTok・YouTube・X・Instagram）で無料拡散→フィードバック→欲しい教材を作る→販売', '先生自身がエージェント（会議時点はマー君、現在はオ課長）に指示して作る。KT が最初にお手本'],
    decision: '4人でエージェント（現・オ課長）を共有し、先生が直接指示して作る' },
  { from: 27, to: 47, title: 'プロスフォニックスの本質を共有', who: ['motoyama', 'kitaura'],
    points: ['最小パーツ＝「1文字＝1動画」（Annie Apple → あっ）。文字を押すと動く', '音・文字・アクションの3点セットは必須。短い GIF 風の繰り返しアニメでよい', '作る人はストーリー（なぜその動きか）を理解すること。理解がないとジェスチャーがズレる', '体で音を覚える（右脳）。小3までは体・音・視覚が一体。日本人に合う'],
    decision: '最小パーツと3点セットを確定' },
  { from: 47, to: 58, title: '第一段階の範囲・収益・録音', who: ['motoyama', 'hachiya', 'tamagawa'],
    points: ['1音ずつ面白がって発音・ジェスチャーするところまでは無料', '教材（DL・ゲーム・本）で収益化するという発想を共有。有料化点は未定', '最終形：プロスの体系で多読・リーディングまで', '生の録音が絶対必要（要約ではダメ）。エージェントに入れてアクションプランを作る'],
    decision: '生録音を毎回残す' },
  { from: 58, to: 72, title: 'アプリと拡散を同時に進める', who: ['tamagawa', 'kitaura', 'motoyama'],
    points: ['マークの動画→動画生成でジェスチャーをコピー、手にリンゴを乗せる等も可能', 'Telegram の使い分け：人間界（人へ）／システム（エージェント＝現・オ課長へ）', '1文字できればエージェントが 3D・2D アニメに展開できる', '北浦先生の SNS 運用（HP・FB・Instagram・GBP）をエージェントに移管。TikTok・LINE を追加'],
    decision: '既存 SNS と接続し、拡散はエージェントが実行' },
  { from: 72, to: 83, title: '目的の言語化と役割分担', who: ['motoyama', 'hachiya', 'tamagawa'],
    points: ['本山先生が目的を箇条書き：自然に読める・書ける／正しい音／楽しい／入り口を間違えない／読める喜び', '第一段階＝A〜G のジェスチャー付きアバターアプリ。まず A・B・C を試作', '役割別エージェントを増やす（SNS・事務）。設定の説明書を KT が送る'],
    decision: 'A・B・C を試作してから広げる' },
  { from: 83, to: 92, title: 'スケジュールと働き方', who: ['motoyama', 'tamagawa', 'kitaura'],
    points: ['3ヶ月単位で形にして振り返る（KT は6ヶ月目安）', '動けるのは9〜12月。1〜3月は繁忙期。12月までに「楽になった」実感を', '音声入力アプリ（Typeless 等）を入れて録音→Telegram で指示', '次回 9/17（木）14:30〜16:00。来週はエージェントを使ってみてから判断'],
    decision: '次回 9/17・定例は木曜枠' },
  { from: 92, to: 100, title: '経営と責任のすり合わせ', who: ['motoyama', 'tamagawa'],
    points: ['本山先生：社長への責任。チャンスでも賭けにしない、責任が取れる範囲で', 'KT：今がチャンス。設備投資は価値が下がりにくい', '社長・本山先生・KT の3者で経営・資金の話をする場を設ける'],
    decision: '3者会談を設定' },
];

/* ロードマップ（月＝2026-09 を 1 とする列位置） */
const ROADMAP = [
  { stage: 'STAGE 0', name: '準備・お手本', start: 1, span: 1, color: 'sky',
    goals: ['録音→オ課長に読み込み', 'A・B・C 動画試作', '設定説明書・音声入力導入', '9/17 で確認'] },
  { stage: 'STAGE 1', name: 'A〜G アバターアプリ＋SNS 開始', start: 1, span: 2, color: 'apple',
    goals: ['ジェスチャー付きアバター A〜G', 'メイキング動画で SNS 先行', '既存 SNS・TikTok・LINE 接続', '先生が直接オ課長に指示'] },
  { stage: 'STAGE 2', name: '26文字・ゲーム化・振り返り', start: 2, span: 3, color: 'broccoli',
    goals: ['A〜Z 全26体', 'ショート動画を量産して拡散', 'プロスの生徒が家で遊べる形', '12月：3ヶ月の振り返り'] },
  { stage: 'STAGE 3', name: '2文字・3文字読み・教材化', start: 4, span: 3, color: 'lemon',
    goals: ['2文字→3文字の読み', 'ミニブック・DL 教材', '有料化ポイントの検証', '（1〜3月は先生方の繁忙期：軽運転）'] },
  { stage: 'STAGE 4', name: '多読・展開', start: 7, span: 2, color: 'berry',
    goals: ['プロスの体系で多読まで', '3D・2D アニメ展開', '他教室・フランチャイズは先の話'] },
];
const ROADMAP_MONTHS = ['9月', '10月', '11月', '12月', '1月', '2月', '3月', '4月〜'];

/* タスク（チェックリスト） */
const TASKS = [
  // 玉川（KT）
  { id: 'kt-01', owner: 'tamagawa', title: '今回の生録音をエージェント（現・オ課長）に読み込ませ、アクションプランを4人に共有', due: '9/5', tag: '最優先', done: true, note: 'このダッシュボードが成果物' },
  { id: 'kt-02', owner: 'tamagawa', title: 'マークの動画を元に「動画→動画生成」で A（Annie Apple）を試作（約100円/本）', due: '9/10', tag: '試作' },
  { id: 'kt-03', owner: 'tamagawa', title: 'B（Betty Broccoli）・C を続けて試作し、3本セットで共有', due: '9/17', tag: '試作' },
  { id: 'kt-04', owner: 'tamagawa', title: 'オ課長への「お手本の指示」を出し、指示の仕方を先生方に見せる', due: '9/10', tag: 'お手本' },
  { id: 'kt-05', owner: 'tamagawa', title: 'エージェント設定の説明書（本山先生・北浦先生用）を作って送る', due: '9/10', tag: '説明書' },
  { id: 'kt-06', owner: 'tamagawa', title: '他社フォニックス教材（ズーフォニックス・マツカ等）のネット展開を調査', due: '9/17', tag: '調査' },
  { id: 'kt-07', owner: 'tamagawa', title: 'プロス訪問：SNS（FB・Instagram・TikTok・X・LINE）とエージェントのアカウント接続', due: '9月中', tag: '訪問' },
  { id: 'kt-08', owner: 'tamagawa', title: 'LINE 集客（Lステップ相当）をエージェントで構築', due: '10月', tag: '集客' },
  { id: 'kt-09', owner: 'tamagawa', title: '役割別エージェント（SNS 発信・事務）の増設と設定依頼', due: '10月', tag: '拡張' },
  { id: 'kt-10', owner: 'tamagawa', title: '本山先生の書籍・IAM 資料はローカル処理（クラウドに上げない）体制を維持', due: '継続', tag: '守秘' },
  { id: 'kt-11', owner: 'tamagawa', title: '社長・本山先生との3者会談に出席（経営・資金・責任範囲）', due: '日程調整中', tag: '経営' },
  // 本山先生
  { id: 'mo-01', owner: 'motoyama', title: 'Zoom の録音（生声）を KT とオ課長（システム側 Telegram）に送る', due: '9/4', tag: '最優先' },
  { id: 'mo-02', owner: 'motoyama', title: 'KT のお手本の後、オ課長に直接指示して動画を1本作ってみる', due: '9/17', tag: '体験' },
  { id: 'mo-03', owner: 'motoyama', title: '社長・本山先生・KT の3者会談を設定する', due: '9月中', tag: '経営' },
  { id: 'mo-04', owner: 'motoyama', title: '「最小パーツ（1文字＝1動画）」と A〜G の順番を承認する', due: '9/17', tag: '設計' },
  { id: 'mo-05', owner: 'motoyama', title: '北浦先生がこの仕事に時間を割けるよう社内で調整する', due: '9月中', tag: '体制' },
  { id: 'mo-06', owner: 'motoyama', title: 'IAM 関連資料をまとめて共有（ローカル処理前提）', due: '随時', tag: '資料' },
  { id: 'mo-07', owner: 'motoyama', title: '思いついたことを録音して Telegram に送る（音声入力アプリ導入）', due: '継続', tag: '習慣' },
  // 北浦先生
  { id: 'ki-01', owner: 'kitaura', title: 'オ課長に指示して Annie Apple 動画を作ってみる（手にリンゴ→口へ→「あっ」）', due: '9/17', tag: '体験' },
  { id: 'ki-02', owner: 'kitaura', title: '子どもがよく見る SNS を確認して共有', due: '9/17', tag: '調査' },
  { id: 'ki-03', owner: 'kitaura', title: '現在の SNS 運用（HP・FB・Instagram・Google ビジネスプロフィール）の内容と方針を KT とすり合わせ', due: '9/17', tag: 'SNS' },
  { id: 'ki-04', owner: 'kitaura', title: 'TikTok・X・LINE の開設可否をプロス内で確認', due: '9/17', tag: 'SNS' },
  { id: 'ki-05', owner: 'kitaura', title: '音声入力アプリ（Typeless 等）を入れて、話して指示できるようにする', due: '9/10', tag: '道具' },
  { id: 'ki-06', owner: 'kitaura', title: '試作動画のジェスチャーが正確か確認してフィードバック', due: '試作後', tag: '品質' },
  { id: 'ki-07', owner: 'kitaura', title: '丸ごと任せられる仕事を1つ選んで KT に渡す', due: '9/17', tag: 'AX' },
  // 蜂谷さん
  { id: 'ha-01', owner: 'hachiya', title: '8/30 送付アプリの「お話し通り」（26キャラのストーリー）を読み、ジェスチャーの意味を理解して KT に説明', due: '9/10', tag: '宿題' },
  { id: 'ha-02', owner: 'hachiya', title: 'Telegram「プロスAX 人間界」の運営と記録', due: '継続', tag: '運営' },
  { id: 'ha-03', owner: 'hachiya', title: '本山先生と相談してアプリ側の計画を作る（自分でも作ってみる）', due: '9/17', tag: '計画' },
  { id: 'ha-04', owner: 'hachiya', title: '会議の録音バックアップ（毎回）', due: '毎回', tag: '記録' },
  // オ課長＋第5中隊（4号機 Hermes: oh / ri / jumeok / gwangbeom / eundong / chisu）
  { id: 'ag-00', owner: 'agent', title: 'まー君（pi）からオ課長（4号機 Hermes）へ引き継ぎ。Telegram @Prososio1bot ＋ Mattermost #pros-lc で応答', due: '9/4', tag: '体制', done: true },
  { id: 'ag-01', owner: 'agent', title: '9/3 会議の録音・会議録を読み込み、プロジェクトのコンテキストを保持', due: '9/4', tag: '記憶', done: true },
  { id: 'ag-02', owner: 'agent', title: 'A・B・C のジェスチャー動画3本を生成（担当：eundong、Fal.ai 約300円、カード t_7ea0884b）', due: '9/16 18:00', tag: '生成' },
  { id: 'ag-03', owner: 'agent', title: '26キャラのストーリーを指示テンプレートに言語化（担当：jumeok、カード t_b071b7a8）', due: '9/12 ドラフト・9/16 確定', tag: '整理' },
  { id: 'ag-05', owner: 'agent', title: '3本の検品（担当：chisu、check_deliverables.py ＋目視）→ 9/17 定例で投影', due: '9/16', tag: '検品' },
  { id: 'ag-04', owner: 'agent', title: 'SNS 投稿の下書き→（接続後）投稿', due: '接続後', tag: '発信' },
  // 全員
  { id: 'al-01', owner: 'all', title: '9/17（木）14:30〜16:00 Zoom に出席', due: '9/17', tag: '会議' },
  { id: 'al-02', owner: 'all', title: '会議・思いつきは録音して Telegram に入れる運用を始める', due: '継続', tag: '習慣' },
  { id: 'al-03', owner: 'all', title: '来週（9/10）はエージェントを使ってみて、必要なら短い打合せ', due: '9/10', tag: '判断' },
];

/* 課題・リスク */
const ISSUES = [
  { level: 'high', title: '収益化モデルが未定', body: 'どこから有料にするか（DL 教材・会員・ゲーム）が決まっていない。まず無料で認知→反応→欲しいものを作る、で3ヶ月検証。', owner: ['tamagawa', 'motoyama'], action: '9/17 までに仮説を1枚にまとめる' },
  { level: 'high', title: '社長への責任と投資判断', body: '「チャンスでも賭けにしない」。責任が取れる範囲で進めたい本山先生と、今がチャンスと見る KT の温度差。', owner: ['motoyama', 'tamagawa'], action: '社長・本山先生・KT の3者会談で合意' },
  { level: 'high', title: '北浦先生の時間がない', body: '現場の中心が最も忙しい。自分でエージェントを覚える時間も惜しい。', owner: ['kitaura', 'motoyama'], action: '仕事を丸ごと KT・エージェントに振る。社内で時間を確保' },
  { level: 'high', title: '動ける期間が 9〜12月に限られる', body: '1〜3月は先生方の繁忙期で時間が取れない。', owner: ['all'], action: '12月までに「楽になった」実感を作る。無ければ中止も選択肢' },
  { level: 'mid', title: 'ジェスチャーがズレる', body: '作り手がストーリー（なぜその動きか）を理解していないと形が崩れる。', owner: ['hachiya', 'kitaura'], action: 'ストーリー理解を必須に。北浦先生が品質チェック' },
  { level: 'mid', title: 'SNS（TikTok 等）のリスクと責任者', body: '問題が起きたときに誰が責任を取るかが不明。教育コンテンツなので低リスクではある。', owner: ['kitaura', 'tamagawa'], action: '担当（北浦先生）と方針をすり合わせてから開設' },
  { level: 'mid', title: '「作る」と「拡散」を同時に進める戸惑い', body: '先生方は作業が別だと感じている。アプリ完成前に何を出すのか。', owner: ['tamagawa'], action: 'メイキング動画と既存コンテンツで先行' },
  { level: 'mid', title: 'AI と英語教育、互いに分からない', body: '4人の知識が対称ではない。細かいニュアンスが文字だけでは伝わらない。', owner: ['all'], action: '中身＝先生、技術＝KT・蜂谷。録音で伝言ゲームを減らす' },
  { level: 'low', title: '守秘：書籍・IAM 資料', body: '本山先生の書籍はクラウドに上げない希望。', owner: ['tamagawa'], action: 'ローカル処理のカプセルで対応済み' },
  { level: 'low', title: 'Zoom・カメラのトラブル', body: 'サインインメールが届かない、カメラが映らない。', owner: ['kitaura'], action: 'Zoom は固定運用、Telegram を併用' },
];

/* 決定事項 */
const DECISIONS = [
  { title: '4人でエージェントを共有し、先生が直接指示して作る', body: '会議時点のマー君は 9/4 にオ課長（4号機 Hermes）へ引き継ぎ。KT が最初にお手本の指示。無理な指示は KT・蜂谷さんが途中で解釈を入れる。' },
  { title: '最小パーツは「1文字＝1動画」', body: 'Annie Apple → あっ。音・文字・アクションの3点セットを必ず入れる。短い繰り返しアニメでよい。' },
  { title: 'A・B・C を試作 → A〜G → 26文字', body: 'ジェスチャー付きの人型アバター。マークの動きを動画→動画生成でコピー。約100円/本。' },
  { title: '第一段階は無料で公開', body: '1音ずつ面白がって発音・ジェスチャーしてもらうところまでは、お金を取らない。' },
  { title: '拡散はエージェントが実行', body: '既存の HP・Facebook・Instagram・Google ビジネスプロフィールと接続。TikTok・LINE を追加。' },
  { title: '生の録音を毎回残す', body: '会議＝エージェントへの命令。要約ではなく生声をオ課長に入れる。' },
  { title: '3ヶ月単位で振り返る', body: 'KT は仕込み6ヶ月目安。12月が最初の節目。' },
  { title: '定例は木曜、次回 9/17 14:30〜16:00', body: '来週は「エージェントを使ってみてから」必要なら。9/24 は KT 不可。' },
  { title: 'Telegram を2本立てで使う', body: '人間界＝人に伝える／システム＝オ課長に直接指示する。' },
  { title: '経営・資金は3者で別途', body: '社長・本山先生・KT で会って話す。' },
];

/* ---------------- レンダリング ---------------- */
const STORE_KEY = 'pros-dash-v1';
const $ = (s, r = document) => r.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function loadState() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY) || '{}'); } catch { return {}; }
}
function saveState(state) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch { /* private mode */ }
}
let state = loadState();
if (!state.done) state.done = {};
for (const t of TASKS) if (t.done && state.done[t.id] === undefined) state.done[t.id] = true;

function isDone(id) { return !!state.done[id]; }

function avatar(key) {
  const m = MEMBERS[key];
  return `<span class="avatar c-${m.color}" title="${esc(m.name)}">${esc(m.initial)}</span>`;
}

function renderFlow() {
  const track = $('#flow-track');
  const total = MEETING.minutes;
  track.style.gridTemplateColumns = FLOW.map((b) => `minmax(240px, ${b.to - b.from}fr)`).join(' ');
  track.innerHTML = FLOW.map((b, i) => `
    <article class="flow-card" style="--i:${i}">
      <div class="flow-time"><span>${String(b.from).padStart(2, '0')}:00</span><i></i><span>${String(b.to).padStart(2, '0')}:00</span></div>
      <h3><span class="flow-no">${i + 1}</span>${esc(b.title)}</h3>
      <div class="flow-who">${b.who.map(avatar).join('')}</div>
      <ul>${b.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
      ${b.decision ? `<div class="flow-decision">決定：${esc(b.decision)}</div>` : ''}
    </article>`).join('');
  const bar = $('#flow-bar');
  bar.innerHTML = FLOW.map((b, i) => `<span style="flex:${b.to - b.from}" class="seg s${i % 6}" title="${esc(b.title)}"></span>`).join('');
  $('#flow-total').textContent = `${total}分`;
}

function renderRoadmap() {
  const head = $('#rm-months');
  head.innerHTML = ROADMAP_MONTHS.map((m, i) => `<div class="rm-month ${i >= 4 && i <= 6 ? 'busy' : ''}">${m}</div>`).join('');
  const body = $('#rm-rows');
  body.innerHTML = ROADMAP.map((r) => {
    const goals = `<ul>${r.goals.map((g) => `<li>${esc(g)}</li>`).join('')}</ul>`;
    const narrow = r.span < 2;
    return `
    <div class="rm-row ${narrow ? 'narrow' : ''}">
      <div class="rm-label"><b>${esc(r.stage)}</b><span>${esc(r.name)}</span>${narrow ? goals : ''}</div>
      <div class="rm-grid">
        <div class="rm-bar c-${r.color}" style="grid-column:${r.start} / span ${r.span}">${narrow ? '' : goals}</div>
      </div>
    </div>`;
  }).join('');
}

function renderDecisions() {
  $('#decisions-grid').innerHTML = DECISIONS.map((d, i) => `
    <article class="decision"><span class="d-no">${String(i + 1).padStart(2, '0')}</span><h3>${esc(d.title)}</h3><p>${esc(d.body)}</p></article>`).join('');
}

function renderIssues() {
  const label = { high: '重要', mid: '注意', low: '軽微' };
  $('#issues-grid').innerHTML = ISSUES.map((x) => `
    <article class="issue lv-${x.level}">
      <div class="issue-head"><span class="lv">${label[x.level]}</span><h3>${esc(x.title)}</h3></div>
      <p>${esc(x.body)}</p>
      <div class="issue-foot"><div class="owners">${x.owner.map(avatar).join('')}</div><div class="issue-action">${esc(x.action)}</div></div>
    </article>`).join('');
}

let filter = 'all-members';

function renderBoard() {
  const cols = ['tamagawa', 'motoyama', 'kitaura', 'hachiya', 'agent', 'all'];
  const board = $('#board-grid');
  board.innerHTML = cols
    .filter((k) => filter === 'all-members' || filter === k)
    .map((k) => {
      const m = MEMBERS[k];
      const list = TASKS.filter((t) => t.owner === k);
      const done = list.filter((t) => isDone(t.id)).length;
      return `
      <section class="col c-${m.color}" data-owner="${k}">
        <header class="col-head">
          ${avatar(k)}
          <div><h3>${esc(m.name)}</h3><span>${esc(m.role)}</span></div>
          <b class="col-count">${done}/${list.length}</b>
        </header>
        <div class="col-progress"><i style="width:${list.length ? (done / list.length) * 100 : 0}%"></i></div>
        <ul class="tasks">
          ${list.map((t) => `
          <li class="task ${isDone(t.id) ? 'is-done' : ''}">
            <label>
              <input type="checkbox" data-id="${t.id}" ${isDone(t.id) ? 'checked' : ''}>
              <span class="box"></span>
              <span class="task-body">
                <span class="task-title">${esc(t.title)}</span>
                <span class="task-meta"><span class="due">${esc(t.due)}</span><span class="tag">${esc(t.tag)}</span>${t.note ? `<span class="note">${esc(t.note)}</span>` : ''}</span>
              </span>
            </label>
          </li>`).join('')}
        </ul>
      </section>`;
    }).join('');
  renderProgress();
}

function renderProgress() {
  const total = TASKS.length;
  const done = TASKS.filter((t) => isDone(t.id)).length;
  const pct = Math.round((done / total) * 100);
  $('#progress-num').textContent = `${done} / ${total}`;
  $('#progress-pct').textContent = `${pct}%`;
  $('#progress-bar').style.width = `${pct}%`;
  const ring = $('#ring');
  if (ring) ring.style.setProperty('--p', pct);
}

function renderCountdown() {
  const target = new Date(MEETING.next.iso);
  const now = new Date();
  const days = Math.ceil((target - now) / 86400000);
  const el = $('#countdown');
  if (days > 1) el.textContent = `あと ${days} 日`;
  else if (days === 1) el.textContent = '明日';
  else if (days === 0) el.textContent = '今日';
  else el.textContent = '開催済み';
}

function copyProgress() {
  const lines = [`PROS PHONICS 進捗 ${new Date().toLocaleDateString('ja-JP')}`];
  for (const k of ['tamagawa', 'motoyama', 'kitaura', 'hachiya', 'agent', 'all']) {
    const list = TASKS.filter((t) => t.owner === k);
    lines.push('', `■ ${MEMBERS[k].name}`);
    for (const t of list) lines.push(`${isDone(t.id) ? '[x]' : '[ ]'} ${t.title}（${t.due}）`);
  }
  const text = lines.join('\n');
  const flash = (msg) => { const b = $('#copy-btn'); const o = b.textContent; b.textContent = msg; setTimeout(() => (b.textContent = o), 1600); };
  if (navigator.clipboard) navigator.clipboard.writeText(text).then(() => flash('コピーしました'), () => fallback());
  else fallback();
  function fallback() {
    const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); flash('コピーしました'); } catch { flash('コピーできません'); }
    ta.remove();
  }
}

function resetProgress() {
  if (!confirm('チェックをすべて外します。よろしいですか？')) return;
  state = { done: {} };
  saveState(state);
  renderBoard();
}

function init() {
  renderFlow();
  renderRoadmap();
  renderDecisions();
  renderIssues();
  renderBoard();
  renderCountdown();
  $('#meeting-next').textContent = MEETING.next.label;
  $('#board-grid').addEventListener('change', (e) => {
    const cb = e.target;
    if (!(cb instanceof HTMLInputElement) || !cb.dataset.id) return;
    state.done[cb.dataset.id] = cb.checked;
    saveState(state);
    cb.closest('.task').classList.toggle('is-done', cb.checked);
    const col = cb.closest('.col');
    const list = TASKS.filter((t) => t.owner === col.dataset.owner);
    const done = list.filter((t) => isDone(t.id)).length;
    col.querySelector('.col-count').textContent = `${done}/${list.length}`;
    col.querySelector('.col-progress i').style.width = `${(done / list.length) * 100}%`;
    renderProgress();
  });
  $('#filters').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-filter]');
    if (!b) return;
    filter = b.dataset.filter;
    for (const x of $('#filters').querySelectorAll('button')) x.classList.toggle('active', x === b);
    renderBoard();
  });
  $('#copy-btn').addEventListener('click', copyProgress);
  $('#reset-btn').addEventListener('click', resetProgress);
  const nav = $('#topnav');
  const sections = [...document.querySelectorAll('main section[id]')];
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) if (en.isIntersecting) {
      for (const a of nav.querySelectorAll('a')) a.classList.toggle('active', a.getAttribute('href') === `#${en.target.id}`);
    }
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach((s) => io.observe(s));
}

document.addEventListener('DOMContentLoaded', init);
