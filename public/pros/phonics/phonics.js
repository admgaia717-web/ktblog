/* 教材動画ワークスペース — 依頼する・見る */
(function () {
  "use strict";
  const D = window.PHONICS || { items: [], chars: [] };
  const $ = (s) => document.querySelector(s);
  const BASE = "/pros/deliverables/";

  const state = { char: null, q: "", finalOnly: false };

  function isFinal(it) {
    return !!it.adopted;
  }

  function fmtSize(n) {
    if (!n) return "";
    return (n / 1048576).toFixed(1) + "MB";
  }

  function matches(it) {
    if (state.char && it.name !== state.char) return false;
    if (state.finalOnly && !isFinal(it)) return false;
    if (state.q) {
      const hay = (it.title + " " + it.desc + " " + it.name + " " + it.letter).toLowerCase();
      if (!hay.includes(state.q.toLowerCase())) return false;
    }
    return true;
  }

  /* ---------- KPI ---------- */
  function renderKpis() {
    const box = $("#kpis");
    if (!box) return;
    const finals = D.items.filter(isFinal).length;
    box.innerHTML =
      '<div class="kpi"><b>' + D.chars.length + '</b><span>キャラクター</span></div>' +
      '<div class="kpi"><b>' + D.items.length + '</b><span>公開中の版</span></div>' +
      '<div class="kpi"><b>' + finals + '</b><span>先生の最終版</span></div>';
  }

  /* ---------- キャラクタータブ ---------- */
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

  /* ---------- 一覧 ---------- */
  function render() {
    renderChars();
    const list = $("#list");
    list.innerHTML = "";
    const rows = D.items.filter(matches);
    $("#empty").hidden = rows.length > 0;

    rows.forEach((it) => {
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
      const open = document.createElement("a");
      open.className = "btn";
      open.href = BASE + it.slug + "/";
      open.target = "_blank";
      open.rel = "noopener";
      open.textContent = "詳細";
      acts.appendChild(play);
      acts.appendChild(open);
      body.appendChild(acts);

      card.appendChild(body);
      list.appendChild(card);
    });
  }

  /* ---------- 再生 ---------- */
  const player = $("#player");
  const video = $("#v");
  function openPlayer(it) {
    $("#pTitle").textContent = it.name;
    $("#pMeta").textContent =
      (isFinal(it) ? "先生の最終版　" : it.letter + " 過去版　") + it.mp4 + "　" + fmtSize(it.size) +
      "　" + it.slug;
    $("#pNote").textContent = it.desc
      ? it.desc + "　／　音と口の形を確認してください。採用の判断は先生がします。"
      : "音と口の形を確認してください。採用の判断は先生がします。";
    video.src = BASE + it.slug + "/" + it.mp4;
    player.hidden = false;
    document.body.style.overflow = "hidden";
    video.play().catch(() => {});
  }
  function closePlayer() {
    video.pause();
    video.removeAttribute("src");
    video.load();
    player.hidden = true;
    document.body.style.overflow = "";
  }
  $("#closePlayer").onclick = closePlayer;
  player.onclick = (e) => { if (e.target === player) closePlayer(); };
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !player.hidden) closePlayer(); });

  /* ---------- 進行状況 ---------- */
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
        ? (finalItem.letter + " " + (finalItem.title.match(/v\d+[a-z]?/) || ["—"])[0])
        : "—";
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

  /* ---------- 依頼 ---------- */
  $("#q").addEventListener("input", (e) => { state.q = e.target.value.trim(); render(); });
  $("#finalOnly").addEventListener("change", (e) => { state.finalOnly = e.target.checked; render(); });

  /* 依頼文にキャラクター名が入っていれば、そのキャラクターのカードを強調 */
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

    btn.disabled = true;
    msg.className = "msg";
    msg.textContent = "送っています…";
    try {
      const res = await fetch("/pros/phonics/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: body, name: $("#name").value })
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        msg.className = "msg err";
        msg.textContent = "認証が切れました。ページを再読み込みしてください。";
        return;
      }
      if (res.ok && data.ok) {
        msg.className = "msg ok";
        msg.textContent = "送りました。作業の返事は「Send the message」チャンネルに届きます。";
        $("#body").value = "";
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

  /* ---------- 初期化 ---------- */
  renderKpis();
  render();
  renderStatus();
})();
