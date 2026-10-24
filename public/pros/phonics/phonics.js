/* フォニックス教材動画 作業室 — 一覧・絞り込み・再生・依頼 */
(function () {
  "use strict";
  const D = window.PHONICS || { items: [], letters: [] };
  const $ = (s) => document.querySelector(s);
  const BASE = "/pros/deliverables/";

  const state = { letter: null, q: "", latestOnly: false };

  /** 各文字の最終版Slug（グループ単位で判定する） */
  const latestByLetter = {};
  D.letters.forEach((l) => { latestByLetter[l.k] = l.v; });

  function isLatest(it) {
    return it.version === latestByLetter[it.letter];
  }

  function fmtSize(n) {
    if (!n) return "";
    return (n / 1048576).toFixed(1) + "MB";
  }

  function matches(it) {
    if (state.letter && it.letter !== state.letter) return false;
    if (state.latestOnly && !isLatest(it)) return false;
    if (state.q) {
      const hay = (it.title + " " + it.slug + " " + it.letter).toLowerCase();
      if (!hay.includes(state.q.toLowerCase())) return false;
    }
    return true;
  }

  /* ---------- 一覧 ---------- */
  function renderLetters() {
    const box = $("#letters");
    box.innerHTML = "";
    const all = document.createElement("button");
    all.textContent = "すべて";
    all.setAttribute("aria-selected", state.letter === null ? "true" : "false");
    all.onclick = () => { state.letter = null; render(); };
    box.appendChild(all);
    D.letters.forEach((l) => {
      const b = document.createElement("button");
      b.textContent = l.k;
      b.title = l.k + "（" + l.v + "件）";
      b.setAttribute("aria-selected", state.letter === l.k ? "true" : "false");
      b.onclick = () => { state.letter = state.letter === l.k ? null : l.k; render(); };
      box.appendChild(b);
    });
  }

  function render() {
    renderLetters();
    const list = $("#list");
    list.innerHTML = "";
    const rows = D.items.filter(matches);
    $("#empty").hidden = rows.length > 0;

    rows.forEach((it) => {
      const card = document.createElement("article");
      card.className = "item" + (isLatest(it) ? " latest" : "");

      const thumbUrl = BASE + it.slug + "/img/" + it.poster;
      const thumb = document.createElement("img");
      thumb.className = "thumb";
      thumb.loading = "lazy";
      thumb.alt = it.title;
      thumb.src = thumbUrl;
      thumb.onerror = function () { this.style.visibility = "hidden"; };
      thumb.onclick = () => openPlayer(it);
      card.appendChild(thumb);

      const body = document.createElement("div");
      body.className = "body";

      const ver = document.createElement("span");
      ver.className = "ver" + (isLatest(it) ? "" : " old");
      ver.textContent = it.letter + " v" + it.version + (it.variant ? " " + it.variant : "") +
        (isLatest(it) ? "（最新版）" : "");
      body.appendChild(ver);

      const h = document.createElement("h3");
      h.textContent = it.title;
      body.appendChild(h);

      const meta = document.createElement("p");
      meta.className = "meta";
      meta.textContent = it.mp4 + "　" + fmtSize(it.size);
      body.appendChild(meta);

      const row = document.createElement("div");
      row.className = "row";
      const play = document.createElement("button");
      play.className = "play";
      play.textContent = "再生";
      play.onclick = () => openPlayer(it);
      const open = document.createElement("a");
      open.href = BASE + it.slug + "/";
      open.target = "_blank";
      open.rel = "noopener";
      open.textContent = "詳細";
      row.appendChild(play);
      row.appendChild(open);
      body.appendChild(row);

      card.appendChild(body);
      list.appendChild(card);
    });

    const total = D.items.length;
    $("#stat").textContent =
      "公開 " + total + "版（A〜" + D.letters[D.letters.length - 1].k + "）。文字ごとに " +
      D.letters.map((l) => l.k).join(" ") + "。表示中 " + rows.length + "版。";
  }

  /* ---------- 再生 ---------- */
  const player = $("#player");
  const video = $("#v");
  function openPlayer(it) {
    $("#pTitle").textContent = it.title;
    $("#pMeta").textContent =
      it.letter + " v" + it.version + (it.variant ? " " + it.variant : "") +
      "　" + it.mp4 + "　" + fmtSize(it.size) + "　" + it.slug;
    $("#pNote").textContent = "音と口の形を確認してください。採用の判断は先生がします。";
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
    D.letters.forEach((l) => {
      const items = D.items.filter((i) => i.letter === l.k);
      const latest = items.filter(isLatest);
      const tr = document.createElement("tr");
      const tdL = document.createElement("td");
      tdL.className = "l";
      tdL.textContent = l.k;
      const tdV = document.createElement("td");
      tdV.textContent = latest.length
        ? latest.map((i) => "v" + i.version + (i.variant ? " " + i.variant : "")).join(" / ")
        : "—";
      const tdN = document.createElement("td");
      tdN.textContent = items.length;
      const tdNote = document.createElement("td");
      tdNote.textContent = l.k === "L" ? "10/26 先生の確認待ち" : "公開済み";
      tr.appendChild(tdL); tr.appendChild(tdV); tr.appendChild(tdN); tr.appendChild(tdNote);
      tb.appendChild(tr);
    });
  }

  /* ---------- 依頼 ---------- */
  const selLetter = $("#letter");
  const selVersion = $("#version");
  D.letters.forEach((l) => {
    const o = document.createElement("option");
    o.value = l.k;
    o.textContent = l.k;
    selLetter.appendChild(o);
  });

  function fillVersions() {
    const L = selLetter.value;
    selVersion.innerHTML = "";
    const none = document.createElement("option");
    none.value = "";
    none.textContent = "指定なし（先生にお願い）";
    selVersion.appendChild(none);
    if (!L) return;
    const items = D.items.filter((i) => i.letter === L)
      .sort((a, b) => b.version - a.version);
    const seen = new Set();
    items.forEach((i) => {
      const key = "v" + i.version + (i.variant ? " " + i.variant : "");
      if (seen.has(key)) return;
      seen.add(key);
      const o = document.createElement("option");
      o.value = key;
      o.textContent = key + (isLatest(i) ? "（最新版）" : "");
      selVersion.appendChild(o);
    });
  }
  selLetter.onchange = fillVersions;

  $("#q").addEventListener("input", (e) => { state.q = e.target.value.trim(); render(); });
  $("#latestOnly").addEventListener("change", (e) => { state.latestOnly = e.target.checked; render(); });

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
        body: JSON.stringify({
          letter: selLetter.value,
          version: selVersion.value,
          body: body,
          name: $("#name").value.trim()
        })
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        msg.className = "msg err";
        msg.textContent = "認証が切れました。ページを再読み込みしてください。";
        return;
      }
      if (res.ok && data.ok) {
        msg.className = "msg ok";
        msg.textContent = "送りました。フォニ丸D が返事をします（このチャンネル内に返信が届きます）。";
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
  render();
  renderStatus();
  fillVersions();
})();
