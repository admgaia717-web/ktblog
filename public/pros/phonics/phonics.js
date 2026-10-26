/* 教材動画ワークスペース — 頼む・進行中・見る・決める */
(function () {
  "use strict";
  const D = window.PHONICS || { items: [], chars: [] };
  const $ = (s) => document.querySelector(s);
  const BASE = "/pros/deliverables/";
  const API = "/pros/phonics/api/";

  const state = { char: null, q: "", finalOnly: false };

  function isFinal(it) { return !!it.adopted; }
  function fmtSize(n) { return n ? (n / 1048576).toFixed(1) + "MB" : ""; }

  function matches(it) {
    if (state.char && it.name !== state.char) return false;
    if (state.finalOnly && !isFinal(it)) return false;
    if (state.q) {
      const hay = (it.title + " " + it.desc + " " + it.name + " " + it.letter).toLowerCase();
      if (!hay.includes(state.q.toLowerCase())) return false;
    }
    return true;
  }

  /* ================= KPI ================= */
  function renderKpis() {
    const box = $("#kpis");
    if (!box) return;
    const finals = D.items.filter(isFinal).length;
    box.innerHTML =
      '<div class="kpi"><b>' + D.chars.length + '</b><span>キャラクター</span></div>' +
      '<div class="kpi"><b>' + D.items.length + '</b><span>公開中の版</span></div>' +
      '<div class="kpi"><b>' + finals + '</b><span>先生の最終版</span></div>';
  }

  /* ================= キャラクタータブ ================= */
  function renderChars() {
    const box = $("#chars");
    box.innerHTML = "";
    const all = document.createElement("button");
    all.textContent = "すべて";
    all.setAttribute("aria-selected", state.char === null ? "true" : "false");
    all.onclick = () => { state.char = null; render(); };
    box.appendChild(all);
    D.chars.forEach((c) => {
      const b = document.createElement("button");
      b.textContent = c.name;
      b.title = c.name + "（" + c.count + "版）";
      b.setAttribute("aria-selected", state.char === c.name ? "true" : "false");
      b.onclick = () => { state.char = state.char === c.name ? null : c.name; render(); };
      box.appendChild(b);
    });
  }

  /* ================= 成果物カード ================= */
  function render() {
    renderChars();
    const list = $("#list");
    list.innerHTML = "";
    const rows = D.items.filter(matches);
    $("#empty").hidden = rows.length > 0;

    // キャラクターごとにまとめる。生成物は折り畳み（折りたたみ）する
    const groups = [];
    const order = [];
    rows.forEach((it) => {
      let g = groups.find((x) => x.name === it.name);
      if (!g) { g = { name: it.name, letter: it.letter, items: [] }; groups.push(g); order.push(g); }
      g.items.push(it);
    });

    order.forEach((g) => {
      const box = document.createElement("section");
      box.className = "group";

      const head = document.createElement("button");
      head.className = "group-head";
      head.setAttribute("aria-expanded", "false");
      const nm = document.createElement("span");
      nm.className = "group-name";
      nm.textContent = g.name;
      const ct = document.createElement("span");
      ct.className = "group-count";
      ct.textContent = g.items.length + "版";
      const chev = document.createElement("span");
      chev.className = "chev";
      chev.textContent = "▾";
      head.appendChild(nm); head.appendChild(ct); head.appendChild(chev);
      box.appendChild(head);

      const grid = document.createElement("div");
      grid.className = "grid";
      g.items.forEach((it) => grid.appendChild(makeCard(it)));
      box.appendChild(grid);

      head.onclick = () => {
        const open = box.classList.toggle("open");
        head.setAttribute("aria-expanded", open ? "true" : "false");
        chev.textContent = open ? "▾" : "▸";
      };
      list.appendChild(box);
    });
  }

  function makeCard(it) {
    const card = document.createElement("article");
    card.className = "card" + (isFinal(it) ? " is-final" : "");

    const wrap = document.createElement("div");
    wrap.className = "thumb-wrap";
    const badge = document.createElement("span");
    badge.className = "badge " + (isFinal(it) ? "final" : "old");
    badge.textContent = isFinal(it) ? "先生の最終版" : it.letter + " 過去版";
    wrap.appendChild(badge);

    const thumb = document.createElement("img");
    thumb.className = "thumb";
    thumb.loading = "lazy";
    thumb.alt = it.title;
    thumb.src = BASE + it.slug + "/img/" + it.poster;
    thumb.onerror = function () { this.style.visibility = "hidden"; };
    thumb.onclick = () => openPlayer(it);
    wrap.appendChild(thumb);
    card.appendChild(wrap);

    const body = document.createElement("div");
    body.className = "card-body";
    const h = document.createElement("h3");
    h.textContent = it.name;
    body.appendChild(h);
    const desc = document.createElement("p");
    desc.className = "desc";
    desc.textContent = it.desc || it.title;
    body.appendChild(desc);
    const meta = document.createElement("p");
    meta.className = "meta";
    meta.textContent = it.mp4 + "　" + fmtSize(it.size);
    body.appendChild(meta);

    const acts = document.createElement("div");
    acts.className = "card-actions";
    const play = document.createElement("button");
    play.className = "btn play";
    play.textContent = "再生";
    play.onclick = () => openPlayer(it);
    const ask = document.createElement("button");
    ask.className = "btn";
    ask.textContent = "直す";
    ask.title = "この版の修正を依頼する";
    ask.onclick = () => {
      $("#body").value = it.name + "（" + (it.letter + " " + (it.title.match(/v\d+[a-z]?/) || [""])[0]) + "）の修正: ";
      document.querySelector("#make").scrollIntoView({ behavior: "smooth" });
      setTimeout(() => $("#body").focus(), 400);
    };
    const open = document.createElement("a");
    open.className = "btn";
    open.href = BASE + it.slug + "/";
    open.target = "_blank";
    open.rel = "noopener";
    open.textContent = "詳細";
    acts.appendChild(play);
    acts.appendChild(ask);
    acts.appendChild(open);
    body.appendChild(acts);
    card.appendChild(body);
    return card;
  }

  /* ================= 動画プレーヤー ================= */
  const player = $("#player");
  const video = $("#v");
  function openPlayer(it) {
    $("#pTitle").textContent = it.name;
    $("#pMeta").textContent =
      (isFinal(it) ? "先生の最終版　" : it.letter + " 過去版　") + it.mp4 + "　" + fmtSize(it.size) +
      "　" + it.slug;
    $("#pNote").textContent = (it.desc ? it.desc + "　／　" : "") +
      "音と口の形を確認してください。採用の判断は先生がします。";
    video.src = BASE + it.slug + "/" + it.mp4;
    player.hidden = false;
    document.body.style.overflow = "hidden";
    video.play().catch(() => {});
  }
  function closePlayer() {
    video.pause(); video.removeAttribute("src"); video.load();
    player.hidden = true; document.body.style.overflow = "";
  }
  $("#closePlayer").onclick = closePlayer;
  player.onclick = (e) => { if (e.target === player) closePlayer(); };
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (!player.hidden) closePlayer();
      if (!$("#drawer").hidden) closeDrawer();
    }
  });

  /* ================= 進行ボード ================= */
  const boardState = { posts: [], loading: false, timer: null };

  function stateLabel(s) {
    return {
      answered: "応答あり",
      need_approval: "承認待ち",
      delivered: "生成物あり",
      request: "受付",
      approved: "承認済み",
    }[s] || s || "—";
  }

  function renderBoard() {
    const box = $("#boardList");
    if (!box) return;
    // 依頼（root_id が無いもの）とそのスレッドの返信
    const reqs = boardState.posts.filter((p) => p.kind === "request" || p.kind === "reply" || p.who);
    if (!reqs.length) {
      box.innerHTML = '<p class="empty">依頼はまだありません。上のフォームから送ってください。</p>';
      return;
    }
    // ルート（依頼）ごとにまとめる
    const groups = {};
    reqs.forEach((p) => {
      if (!p.root_id) {
        if (!groups[p.id]) groups[p.id] = { root: p.id, request: p, replies: [] };
        else groups[p.id].request = p;
      } else {
        if (!groups[p.root_id]) groups[p.root_id] = { root: p.root_id, request: null, replies: [] };
        groups[p.root_id].replies.push(p);
      }
    });

    box.innerHTML = "";
    Object.keys(groups).forEach((key) => {
      const g = groups[key];
      const r = g.request;
      if (!r) return;
      // 最新の応答を状態として使う（新しい順で来るので先頭が最新）
      const replies = g.replies.slice().sort((a, b) => b.create_at - a.create_at);
      const last = replies.length ? replies[0] : null;
      // 返信（state なし）が最新でも状態を巻き戻さない。最後に状態を持つ投稿を使う
      const lastWithState = replies.find((x) => x.state);
      const st = lastWithState ? lastWithState.state : "request";
      const card = document.createElement("article");
      card.className = "req" + (st === "need_approval" ? " is-wait" : "");

      const top = document.createElement("div");
      top.className = "req-top";
      const who = document.createElement("span");
      who.className = "req-who";
      who.textContent = r.who || "先生";
      const stEl = document.createElement("span");
      stEl.className = "chip " + (st || "");
      stEl.textContent = stateLabel(st);
      const time = document.createElement("time");
      time.className = "req-time";
      time.textContent = new Date(r.create_at).toLocaleString("ja-JP", {
        month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit"
      });
      top.appendChild(who); top.appendChild(stEl); top.appendChild(time);
      card.appendChild(top);

      const body = document.createElement("p");
      body.className = "req-body";
      body.textContent = r.message.replace(/^@phonimaru-d.*?\n+/, "").trim();
      card.appendChild(body);

      const foot = document.createElement("div");
      foot.className = "req-foot";
      const openBtn = document.createElement("button");
      openBtn.className = "btn";
      openBtn.textContent = "会話を見る";
      openBtn.onclick = () => openDrawer(key);
      foot.appendChild(openBtn);
      const chatLink = document.createElement("a");
      chatLink.className = "btn";
      chatLink.href = "chat?root=" + encodeURIComponent(key);
      chatLink.textContent = "チャットで話す";
      foot.appendChild(chatLink);

      if (st === "need_approval") {
        const ok = document.createElement("button");
        ok.className = "btn approve";
        ok.textContent = "承認して進めて";
        ok.onclick = () => approve(key);
        foot.appendChild(ok);
      }
      if (last && last.files && last.files.length) {
        const f = document.createElement("span");
        f.className = "req-files";
        f.textContent = "生成物 " + last.files.length + "件";
        foot.appendChild(f);
      }
      card.appendChild(foot);
      box.appendChild(card);
    });
  }

  async function loadBoard() {
    if (boardState.loading) return;
    boardState.loading = true;
    try {
      const res = await fetch(API + "thread?limit=40");
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        boardState.posts = data.posts || [];
        renderBoard();
      }
    } catch (e) {
      /* 通信できない時は前回表示のまま */
    } finally {
      boardState.loading = false;
    }
  }

  async function approve(rootId) {
    const msg = $("#msg");
    try {
      const res = await fetch(API + "request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body: "承認しました。上限の金額で進めてください。",
          name: $("#name").value,
          root_id: rootId,
          approve: true
        })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        msg.className = "msg ok";
        msg.textContent = "承認を送りました。";
        setTimeout(loadBoard, 1200);
      } else {
        msg.className = "msg err";
        msg.textContent = "承認を送信できませんでした。";
      }
    } catch (e) {
      msg.className = "msg err";
      msg.textContent = "通信に失敗しました。";
    }
  }

  /* ================= 会話ドロワー ================= */
  const drawer = $("#drawer");
  function closeDrawer() { drawer.hidden = true; document.body.style.overflow = ""; }
  $("#closeDrawer").onclick = closeDrawer;
  drawer.onclick = (e) => { if (e.target === drawer) closeDrawer(); };

  async function openDrawer(rootId) {
    const body = $("#drawerBody");
    body.innerHTML = '<p class="empty">読み込み中…</p>';
    drawer.hidden = false;
    document.body.style.overflow = "hidden";
    try {
      const res = await fetch(API + "thread?root=" + encodeURIComponent(rootId));
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) { body.innerHTML = '<p class="empty">読めませんでした。</p>'; return; }
      const posts = (data.posts || []).slice().sort((a, b) => a.create_at - b.create_at);
      body.innerHTML = "";
      const h = document.createElement("h3");
      h.textContent = "依頼の会話";
      body.appendChild(h);
      posts.forEach((p) => {
        const d = document.createElement("div");
        d.className = "msg-item" + (p.kind === "reply" ? " reply" : " ask");
        const head = document.createElement("div");
        head.className = "msg-head";
        head.textContent = (p.who || "フォニ丸D") + "　" +
          new Date(p.create_at).toLocaleString("ja-JP", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
        const t = document.createElement("pre");
        t.className = "msg-text";
        t.textContent = p.message;
        d.appendChild(head); d.appendChild(t);
        if (p.files && p.files.length) {
          const ul = document.createElement("ul");
          ul.className = "msg-files";
          p.files.forEach((f) => {
            const li = document.createElement("li");
            li.textContent = f.name + "（" + fmtSize(f.size) + "）";
            ul.appendChild(li);
          });
          d.appendChild(ul);
        }
        body.appendChild(d);
      });
    } catch (e) {
      body.innerHTML = '<p class="empty">読めませんでした。</p>';
    }
  }

  /* ================= 進行状況 ================= */
  function renderStatus() {
    const tb = $("#statusBody");
    tb.innerHTML = "";
    D.chars.forEach((c) => {
      const finalItem = D.items.find((i) => i.slug === c.adopted_slug);
      const tr = document.createElement("tr");
      const tdWho = document.createElement("td");
      tdWho.className = "who";
      tdWho.textContent = c.name;
      const tdV = document.createElement("td");
      tdV.textContent = finalItem
        ? (finalItem.letter + " " + (finalItem.title.match(/v\d+[a-z]?/) || ["—"])[0]) : "—";
      const tdN = document.createElement("td");
      tdN.textContent = c.count + "版";
      const tdS = document.createElement("td");
      const st = document.createElement("span");
      st.className = "state " + (c.note === "公開済み" ? "live" : "wait");
      st.textContent = c.note;
      tdS.appendChild(st);
      tr.appendChild(tdWho); tr.appendChild(tdV); tr.appendChild(tdN); tr.appendChild(tdS);
      tb.appendChild(tr);
    });
  }

  /* ================= 依頼 ================= */
  $("#q").addEventListener("input", (e) => { state.q = e.target.value.trim(); render(); });
  $("#finalOnly").addEventListener("change", (e) => { state.finalOnly = e.target.checked; render(); });

  const NAMES = D.chars.map((c) => c.name);
  $("#body").addEventListener("input", (e) => {
    const v = e.target.value.toLowerCase();
    const hit = NAMES.find((n) => v.includes(n.toLowerCase().split(" ")[0]));
    const hint = $("#hint");
    if (hit) {
      hint.textContent = "「" + hit + "」の最終版を基準に直します。";
      hint.style.color = "var(--brand)";
    } else {
      hint.textContent = "キャラクター名も書いておくと早く動けます。例「Kelly」「Lenny」";
      hint.style.color = "";
    }
  });

  $("#form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = $("#send");
    const msg = $("#msg");
    const body = $("#body").value.trim();
    if (!body) { msg.className = "msg err"; msg.textContent = "依頼内容を入力してください。"; return; }
    const budget = $("#budget").value.trim();

    btn.disabled = true;
    msg.className = "msg";
    msg.textContent = "送っています…";
    try {
      const res = await fetch(API + "request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: body, name: $("#name").value, budget: budget })
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        msg.className = "msg err";
        msg.textContent = "認証が切れました。ページを再読み込みしてください。";
        return;
      }
      if (res.ok && data.ok) {
        msg.className = "msg ok";
        msg.textContent = "送りました。進捗は「進行中」で見られます。";
        $("#body").value = "";
        setTimeout(loadBoard, 1000);
      } else {
        msg.className = "msg err";
        msg.textContent = "送信できませんでした。" + (data.message ? " " + data.message : "");
      }
    } catch (err) {
      msg.className = "msg err";
      msg.textContent = "通信に失敗しました。時間をおいて試してください。";
    } finally {
      btn.disabled = false;
    }
  });

  /* ================= 初期化 ================= */
  renderKpis();
  render();
  renderStatus();
  loadBoard();
  boardState.timer = setInterval(loadBoard, 20000);
})();
