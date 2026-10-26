/* 教材動画ワークスペース — 会話（チャット）
   依頼も雑談も同じ欄から送れて、返信は新着で知らせ、動画は会話の中で再生する。 */
(function () {
  "use strict";
  const D = window.PHONICS || { items: [], chars: [] };
  const API = "/pros/phonics/api/";
  const BASE = "/pros/deliverables/";
  const $ = (s) => document.querySelector(s);

  const state = {
    posts: [],
    threads: [],
    active: "",
    activePosts: [],
    loadingList: false,
    loadingThread: false,
    sound: false,
    firstLoad: true,
    unreadBefore: 0,
  };

  /* ---------- 既読 ---------- */
  const READ_KEY = "phonicsChatReadV1";
  let readMap = {};
  try { readMap = JSON.parse(localStorage.getItem(READ_KEY) || "{}") || {}; } catch (e) { readMap = {}; }
  function saveRead() { try { localStorage.setItem(READ_KEY, JSON.stringify(readMap)); } catch (e) {} }
  function markRead(root, ts) {
    if (!root || !ts) return;
    if ((readMap[root] || 0) < ts) { readMap[root] = ts; saveRead(); }
  }
  function myName() { return $("#name").value; }
  function isHuman(p) { return !!p.who && p.who !== "フォニ丸D"; }
  function isMine(p) { return isHuman(p) && p.who === myName(); }
  function whoLabel(p) {
    if (p.who) return p.who;
    return p.phonics_present ? "フォニ丸D" : "チーム";
  }
  function isUnreadPost(p, root) {
    const seen = readMap[root] || 0;
    return !isMine(p) && p.create_at > seen;
  }

  /* ---------- ユーティリティ ---------- */
  function fmtTime(ts) {
    const d = new Date(ts);
    const hm = d.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });
    if (sameDay(ts, Date.now())) return "今日 " + hm;
    if (sameDay(ts, Date.now() - 86400000)) return "昨日 " + hm;
    return d.toLocaleDateString("ja-JP", { month: "numeric", day: "numeric" }) + " " + hm;
  }
  function fmtDay(ts) {
    return new Date(ts).toLocaleDateString("ja-JP", { month: "long", day: "numeric", weekday: "short" });
  }
  function sameDay(a, b) {
    const x = new Date(a), y = new Date(b);
    return x.getFullYear() === y.getFullYear() && x.getMonth() === y.getMonth() && x.getDate() === y.getDate();
  }
  function fmtSize(n) { return n ? (n / 1048576).toFixed(1) + "MB" : ""; }
  function stateLabel(s) {
    return { answered: "応答あり", need_approval: "承認待ち", delivered: "動画あり", request: "受付", approved: "承認済み" }[s] || "";
  }
  const CHIP_HINT = {
    answered: "フォニ丸Dから返信が来ています",
    need_approval: "承認すると作業が進みます（料金が発生する場合があります）",
    delivered: "動画が届いています。会話の中で再生できます",
    request: "依頼を受け付けました",
    approved: "承認済みです",
  };
  function makeChip(s) {
    const c = el("span", "chip " + s, stateLabel(s));
    if (CHIP_HINT[s]) c.title = CHIP_HINT[s];
    return c;
  }
  function renderWho() {
    const w = $("#replyWho");
    w.hidden = !state.active;
    w.innerHTML = "";
    w.appendChild(document.createTextNode("あなたは "));
    w.appendChild(el("b", "", myName()));
    w.appendChild(document.createTextNode(" として送ります。左の「あなたの名前」で変更できます。"));
  }
  function cleanMessage(raw) {
    let m = String(raw || "");
    m = m.replace(/^@phonimaru-d[^\n]*\n?/i, "");
    m = m.replace(/^【依頼者】[^\n]*\n?/m, "");
    m = m.replace(/^【予算の上限】[^\n]*\n?/m, "");
    m = m.replace(/^【承認者】[^\n]*\n?/m, "");
    m = m.replace(/^【上限金額】[^\n]*\n?/m, "");
    m = m.replace(/^【依頼内容】\n?/m, "");
    m = m.replace(/^【内容】\n?/m, "");
    m = m.replace(/^【[^】\n]+】[ \t]*\n?/gm, "");
    return m.trim();
  }
  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined && text !== null) n.textContent = text;
    return n;
  }

  /* ---------- スレッド化 ---------- */
  function groupThreads(posts) {
    const map = {};
    posts.forEach((p) => {
      const root = p.root_id || p.id;
      if (!map[root]) map[root] = { root: root, all: [], request: null };
      map[root].all.push(p);
      if (!p.root_id && !map[root].request) map[root].request = p;
    });
    const list = Object.keys(map).map((k) => {
      const t = map[k];
      t.all.sort((a, b) => a.create_at - b.create_at);
      t.last = t.all[t.all.length - 1];
      const withState = t.all.filter((p) => p.state);
      t.state = withState.length ? withState[withState.length - 1].state : "request";
      t.unread = t.all.some((p) => isUnreadPost(p, t.root));
      t.title = t.request ? cleanMessage(t.request.message) : cleanMessage(t.all[0].message);
      return t;
    });
    list.sort((a, b) => b.last.create_at - a.last.create_at);
    return list;
  }

  /* ---------- 一覧 ---------- */
  function renderList() {
    const box = $("#threadList");
    box.innerHTML = "";
    if (!state.threads.length) {
      box.appendChild(el("p", "empty", "まだ依頼がありません。「＋ 新しい依頼を送る」から始められます。"));
      return;
    }
    state.threads.forEach((t) => {
      const b = el("button", "thread" + (t.root === state.active ? " active" : ""));
      b.type = "button";
      const top = el("div", "t-top");
      if (t.unread) top.appendChild(el("span", "unread-dot"));
      top.appendChild(el("span", "t-who", t.request ? (t.request.who || "チーム") : "チーム"));
      const st = stateLabel(t.state);
      if (st) top.appendChild(makeChip(t.state));
      top.appendChild(el("span", "t-time", fmtTime(t.last.create_at)));
      b.appendChild(top);
      const title = t.title.split("\n").filter(Boolean)[0] || "（依頼）";
      b.appendChild(el("div", "t-body", title));
      const mediaCount = t.all.reduce((n, p) => n + (p.files || []).filter((f) => /\.mp4$/i.test(f.name || "")).length, 0);
      if (mediaCount) b.appendChild(el("div", "t-media", "🎬 動画 " + mediaCount + "本"));
      b.onclick = () => openThread(t.root);
      box.appendChild(b);
    });
    const unreadCount = state.threads.filter((t) => t.unread).length;
    document.title = (unreadCount ? "(" + unreadCount + ") " : "") + "会話 | 教材動画ワークスペース";
    if (!state.firstLoad && unreadCount > state.unreadBefore && state.sound) beep();
    state.unreadBefore = unreadCount;
  }

  async function loadThreads() {
    if (state.loadingList) return;
    state.loadingList = true;
    try {
      const res = await fetch(API + "thread?limit=60");
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        state.posts = data.posts || [];
        // 初回は過去分を既読にして、これから来る返信だけを新着として扱う
        if (state.firstLoad) {
          state.posts.forEach((p) => {
            const root = p.root_id || p.id;
            if (!readMap[root]) readMap[root] = p.create_at;
          });
          saveRead();
        }
        state.threads = groupThreads(state.posts);
        renderList();
      }
    } catch (e) {
      /* 通信できない時は前回表示のまま */
    } finally {
      state.loadingList = false;
      state.firstLoad = false;
    }
  }

  /* ---------- メディア ---------- */
  function videoCard(src, caption, note, poster) {
    const card = el("div", "media-card");
    const v = el("video");
    v.controls = true;
    v.playsInline = true;
    v.preload = "metadata";
    if (poster) v.poster = poster;
    v.src = src;
    card.appendChild(v);
    if (caption) card.appendChild(el("div", "media-cap", caption));
    if (note) card.appendChild(el("div", "media-note", note));
    return card;
  }
  function findItemByMp4(name) {
    return (D.items || []).find((x) => x.mp4 === name);
  }
  function posterOf(it) {
    return it && it.poster ? BASE + it.slug + "/img/" + it.poster : "";
  }
  function appendMedia(container, p, rawMessage) {
    const files = p.files || [];
    files.forEach((f) => {
      const name = f.name || "添付ファイル";
      const src = API + "file?id=" + encodeURIComponent(f.id);
      if (/\.mp4$/i.test(name)) {
        const hit = findItemByMp4(name);
        container.appendChild(videoCard(src, "🎬 " + (hit ? hit.name : name) + (f.size ? "（" + fmtSize(f.size) + "）" : ""), "▶ 再生ボタンを押すと、ここで見られます。音も出ます。", posterOf(hit)));
      } else if (/\.(png|jpe?g|gif|webp)$/i.test(name)) {
        const card = el("div", "media-card");
        const img = el("img");
        img.src = src; img.alt = name; img.loading = "lazy";
        card.appendChild(img);
        card.appendChild(el("div", "media-cap", name));
        container.appendChild(card);
      } else {
        const a = el("a", "file-link", "📎 " + name + (f.size ? "（" + fmtSize(f.size) + "）" : ""));
        a.href = src; a.target = "_blank"; a.rel = "noopener";
        container.appendChild(a);
      }
    });
    // 本文中の成果物ページ（/pros/deliverables/<slug>/）を動画カードにする
    const slugs = [];
    const re = /\/pros\/deliverables\/([a-z0-9-]+)\//gi;
    let m;
    while ((m = re.exec(rawMessage || "")) !== null) {
      if (slugs.indexOf(m[1]) === -1) slugs.push(m[1]);
    }
    slugs.forEach((slug) => {
      const it = (D.items || []).find((x) => x.slug === slug);
      if (it && it.mp4) {
        container.appendChild(videoCard(
          BASE + it.slug + "/" + it.mp4,
          "🎬 " + it.name + "　" + it.mp4,
          it.adopted ? "先生の最終版です。▶ 再生ボタンで見られます。" : "この版の動画です。▶ 再生ボタンで見られます。",
          posterOf(it)
        ));
      } else {
        const a = el("a", "file-link", "🎬 動画ページを開く");
        a.href = BASE + slug + "/"; a.target = "_blank"; a.rel = "noopener";
        container.appendChild(a);
      }
    });
    const directMp4 = (rawMessage || "").match(/https?:\/\/[^\s)]+\.mp4/gi);
    if (directMp4) {
      directMp4.slice(0, 2).forEach((u) => container.appendChild(videoCard(u, "🎬 動画")));
    }
  }

  /* ---------- 会話 ---------- */
  function renderConversation(scrollToEnd) {
    const box = $("#messages");
    const prevBottom = box.scrollHeight - box.scrollTop - box.clientHeight < 80;
    box.innerHTML = "";
    const posts = state.activePosts;
    if (!posts.length) {
      box.appendChild(el("p", "empty", "この依頼にはまだ投稿がありません。"));
      return;
    }
    let lastDay = null;
    posts.forEach((p) => {
      if (!lastDay || !sameDay(lastDay, p.create_at)) {
        box.appendChild(el("div", "day-sep", fmtDay(p.create_at)));
        lastDay = p.create_at;
      }
      const mine = isHuman(p);
      const row = el("div", "bubble-row " + (mine ? "me" : "bot") + (isUnreadPost(p, state.active) ? " new" : ""));
      const head = el("div", "bubble-head", whoLabel(p) + "　" + fmtTime(p.create_at));
      row.appendChild(head);
      const bubble = el("div", "bubble");
      const text = cleanMessage(p.message);
      if (text) bubble.appendChild(el("div", "bubble-text", text));
      appendMedia(bubble, p, p.message);
      row.appendChild(bubble);
      box.appendChild(row);
    });
    if (scrollToEnd || prevBottom) box.scrollTop = box.scrollHeight;
  }

  function updateConvHeader() {
    const t = state.threads.find((x) => x.root === state.active);
    $("#convTitle").textContent = t ? (t.title.split("\n").filter(Boolean)[0] || "依頼").slice(0, 60) : "会話";
    const chip = $("#convState");
    const st = t ? stateLabel(t.state) : "";
    chip.textContent = st;
    chip.className = "chip " + (t ? t.state : "");
    if (t && CHIP_HINT[t.state]) chip.title = CHIP_HINT[t.state];
    const need = t && t.state === "need_approval";
    $("#approveBar").hidden = !need;
  }

  async function loadThread(scrollToEnd) {
    if (!state.active || state.loadingThread) return;
    state.loadingThread = true;
    try {
      const res = await fetch(API + "thread?root=" + encodeURIComponent(state.active));
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        state.activePosts = (data.posts || []).slice().sort((a, b) => a.create_at - b.create_at);
        renderConversation(scrollToEnd);
        const last = state.activePosts[state.activePosts.length - 1];
        if (last) markRead(state.active, last.create_at);
        state.threads = groupThreads(state.posts);
        renderList();
        updateConvHeader();
      }
    } catch (e) {
      /* 表示は前回のまま */
    } finally {
      state.loadingThread = false;
    }
  }

  function openThread(root) {
    state.active = root;
    $("#chatWrap").classList.add("in-chat");
    $("#replyForm").hidden = false;
    renderWho();
    $("#messages").innerHTML = '<p class="empty">読み込み中…</p>';
    updateConvHeader();
    loadThread(true);
    setTimeout(() => $("#replyBody").focus(), 300);
  }

  /* ---------- 送信 ---------- */
  async function postRequest(payload) {
    const res = await fetch(API + "request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok && data.ok, status: res.status, data: data };
  }

  $("#replyForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const body = $("#replyBody").value.trim();
    if (!body || !state.active) return;
    const btn = $("#replySend");
    const msg = $("#convMsg");
    btn.disabled = true;
    msg.className = "msg";
    msg.textContent = "";
    // すぐ自分の吹き出しを出す（ポンポンやり取りできるように）
    const optimistic = {
      id: "local-" + Date.now(), root_id: state.active, create_at: Date.now(),
      who: myName(), phonics_present: false, message: body, files: [], state: "", kind: "request",
    };
    state.activePosts.push(optimistic);
    renderConversation(true);
    $("#replyBody").value = "";
    try {
      const r = await postRequest({ body: body, name: myName(), root_id: state.active });
      if (r.ok) {
        msg.className = "msg ok";
        msg.textContent = "送りました。返信が来たらここに出ます。";
        setTimeout(() => { loadThreads(); loadThread(false); }, 1200);
      } else {
        state.activePosts = state.activePosts.filter((p) => p.id !== optimistic.id);
        renderConversation(false);
        msg.className = "msg err";
        msg.textContent = "送信できませんでした。" + (r.data.message ? " " + r.data.message : "");
        $("#replyBody").value = body;
      }
    } catch (err) {
      state.activePosts = state.activePosts.filter((p) => p.id !== optimistic.id);
      renderConversation(false);
      msg.className = "msg err";
      msg.textContent = "通信に失敗しました。もう一度送ってください。";
      $("#replyBody").value = body;
    } finally {
      btn.disabled = false;
    }
  });

  $("#replyBody").addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
      e.preventDefault();
      $("#replyForm").requestSubmit();
    }
  });

  $("#approveBtn").addEventListener("click", async () => {
    if (!state.active) return;
    const msg = $("#convMsg");
    msg.className = "msg";
    msg.textContent = "承認を送っています…";
    const r = await postRequest({
      body: "承認しました。上限の金額で進めてください。",
      name: myName(), root_id: state.active, approve: true,
    });
    msg.className = "msg " + (r.ok ? "ok" : "err");
    msg.textContent = r.ok ? "承認を送りました。" : "承認を送信できませんでした。";
    setTimeout(() => { loadThreads(); loadThread(false); }, 1200);
  });

  /* ---------- 新規依頼 ---------- */
  function openModal() { $("#newModal").hidden = false; setTimeout(() => $("#newBody").focus(), 100); }
  function closeModal() { $("#newModal").hidden = true; $("#newMsg").textContent = ""; }
  $("#newReq").addEventListener("click", openModal);
  $("#newCancel").addEventListener("click", closeModal);
  $("#newModal").addEventListener("click", (e) => { if (e.target === $("#newModal")) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !$("#newModal").hidden) closeModal(); });

  $("#newSend").addEventListener("click", async () => {
    const body = $("#newBody").value.trim();
    const msg = $("#newMsg");
    if (!body) { msg.className = "msg err"; msg.textContent = "内容を書いてください。"; return; }
    if (!$("#newOk").checked) { msg.className = "msg err"; msg.textContent = "確認のチェックを入れてください。"; return; }
    const btn = $("#newSend");
    btn.disabled = true;
    msg.className = "msg";
    msg.textContent = "送っています…";
    try {
      const r = await postRequest({ body: body, name: myName(), budget: $("#newBudget").value.trim() });
      if (r.ok) {
        closeModal();
        $("#newBody").value = ""; $("#newBudget").value = ""; $("#newOk").checked = false;
        await loadThreads();
        if (r.data.post_id) openThread(r.data.post_id);
      } else {
        msg.className = "msg err";
        msg.textContent = "送信できませんでした。" + (r.data.message ? " " + r.data.message : "");
      }
    } catch (e) {
      msg.className = "msg err";
      msg.textContent = "通信に失敗しました。";
    } finally {
      btn.disabled = false;
    }
  });

  /* ---------- 新着の音 ---------- */
  let audioCtx = null;
  function beep() {
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const notes = [880, 1174.66];
      notes.forEach((freq, i) => {
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.type = "sine";
        o.frequency.value = freq;
        o.connect(g); g.connect(audioCtx.destination);
        const t = audioCtx.currentTime + i * 0.18;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.12, t + 0.03);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
        o.start(t); o.stop(t + 0.32);
      });
    } catch (e) {}
  }
  function renderSoundBtn() {
    const b = $("#notifBtn");
    b.textContent = state.sound ? "新着の音: ON" : "新着の音: OFF";
    b.classList.toggle("on", state.sound);
  }
  $("#notifBtn").addEventListener("click", () => {
    state.sound = !state.sound;
    try { localStorage.setItem("phonicsChatSound", state.sound ? "1" : "0"); } catch (e) {}
    if (state.sound) beep();
    renderSoundBtn();
  });

  /* ---------- その他 ---------- */
  $("#backBtn").addEventListener("click", () => {
    $("#chatWrap").classList.remove("in-chat");
    state.active = "";
    renderList();
  });
  $("#name").addEventListener("change", () => {
    try { localStorage.setItem("phonicsChatName", myName()); } catch (e) {}
    state.threads = groupThreads(state.posts);
    renderList();
    renderWho();
  });

  /* ---------- 初期化 ---------- */
  try {
    state.sound = localStorage.getItem("phonicsChatSound") === "1";
    const savedName = localStorage.getItem("phonicsChatName");
    if (savedName && ["北浦先生", "蜂谷さん", "KT"].indexOf(savedName) >= 0) $("#name").value = savedName;
  } catch (e) {}
  renderSoundBtn();
  loadThreads().then(() => {
    const wanted = new URLSearchParams(location.search).get("root");
    if (wanted && state.threads.some((t) => t.root === wanted)) openThread(wanted);
    else if (state.threads.length) openThread(state.threads[0].root);
  });
  setInterval(() => {
    loadThreads();
    if (state.active) loadThread(false);
  }, 10000);
})();
