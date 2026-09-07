'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const data = window.LESSON_DATA;
  const voice = $('voice');
  let selected = 'a', view = 'home', guideReturn = 'home', controller = null;
  function error(message) { $('error').textContent = message; $('error').hidden = !message; }
  function status(message) { $('status').textContent = message; }
  function stop(message) {
    if (controller) controller.abort();
    controller = null;
    voice.pause();
    try { voice.currentTime = 0; } catch (_) { /* No media loaded yet. */ }
    if (message) status(message);
  }
  function show(next) {
    stop(); view = next;
    for (const id of ['home','lesson','guide']) $(id).hidden = id !== next;
    window.scrollTo(0,0);
  }
  function setLetter(letter) {
    selected = letter;
    const d = data[letter];
    $('lesson-image').src = `assets/${letter}.png`;
    $('lesson-image').alt = `小文字 ${letter} の形の ${d.name}`;
    $('lesson-title').textContent = d.name;
    $('lesson-jp').textContent = d.jp;
    $('story-text').textContent = d.story;
    $('gesture-text').textContent = d.gesture;
    $('teacher-prompt').textContent = d.prompt;
    $('original-text').textContent = d.original;
    document.querySelectorAll('.letter-nav button').forEach(b => b.setAttribute('aria-current',String(b.dataset.letter === letter)));
  }
  function choose(letter) {
    stop(); error(''); setLetter(letter); show('lesson');
    $('story-panel').hidden = true;
    $('story-button').setAttribute('aria-expanded','false');
    $('teacher-cue').open = false;
    status('おはなし・音・まねっこ、どこからでも。');
    $('lesson-title').focus({preventScroll:true});
  }
  function delay(ms, signal) {
    return new Promise((resolve,reject) => {
      if(signal.aborted) { reject(new DOMException('Stopped','AbortError')); return; }
      const cancelled = () => { clearTimeout(timer); reject(new DOMException('Stopped','AbortError')); };
      const timer = setTimeout(() => { signal.removeEventListener('abort',cancelled); resolve(); },ms);
      signal.addEventListener('abort',cancelled,{once:true});
    });
  }
  function playOnce(letter, signal) {
    return new Promise((resolve,reject) => {
      if(signal.aborted) { reject(new DOMException('Stopped','AbortError')); return; }
      const clean = () => { voice.removeEventListener('ended',ended); voice.removeEventListener('error',failed); signal.removeEventListener('abort',cancelled); };
      const ended = () => { clean(); resolve(); };
      const failed = () => { clean(); reject(new Error('音を再生できませんでした。もう一度押してください。続く場合は端末の音声出力と assets フォルダを確認してください。')); };
      const cancelled = () => { clean(); voice.pause(); reject(new DOMException('Stopped','AbortError')); };
      voice.addEventListener('ended',ended,{once:true});
      voice.addEventListener('error',failed,{once:true});
      signal.addEventListener('abort',cancelled,{once:true});
      voice.src = `assets/${letter}.wav`;
      voice.playbackRate = 1; voice.defaultPlaybackRate = 1; voice.volume = 1; voice.muted = false;
      voice.play().catch(e => { clean(); reject(e); });
    });
  }
  async function start(practice) {
    stop(); error('');
    const run = new AbortController(); controller = run;
    const {signal} = run;
    const count = practice ? Number(document.querySelector('input[name="repeat"]:checked').value) : 1;
    const gap = Number($('gap').value) * 1000;
    const letters = practice && $('sequence').checked ? ['a','b','c'] : [selected];
    if (practice) { $('story-panel').hidden = true; $('story-button').setAttribute('aria-expanded','false'); }
    try {
      for(const letter of letters) {
        setLetter(letter);
        for(let n=1;n<=count;n++) {
          if(signal.aborted) return;
          status(practice ? `${letter}：音をきこう（${n}回目）` : `${letter}：音をきこう`);
          await playOnce(letter,signal);
          if(practice) { status(`${letter}：先生と まねっこ（${gap/1000}秒）`); await delay(gap,signal); }
        }
      }
      if(signal.aborted) return;
      status(practice ? 'いっしょに できたね。もういっかい？' : 'きけたね。先生と まねしてみよう。');
    } catch(e) {
      if(signal.aborted || e.name === 'AbortError') return;
      voice.pause();
      error(e.name === 'NotAllowedError' ? '音の再生が止められました。「音をきく」を押してから、もう一度始めてください。' : e.message);
      status('音を確認して、もう一度押してください。');
    } finally { if(controller === run) controller = null; }
  }
  function openGuide() {
    guideReturn = view; stop(); show('guide');
    if (!$('feedback-note').value.trim()) $('feedback-letter').value = selected;
    updateFeedback();
    $('guide-title').focus({preventScroll:true});
  }
  function updateFeedback() {
    const l = $('feedback-letter').value;
    $('feedback-note').placeholder = `例：${data[l].example}`;
    const note = $('feedback-note').value.trim();
    $('feedback-output').value = note ? `${l}／${$('feedback-kind').value}／${note}` : '';
    $('copy-status').textContent = '外部送信はしません。児童名は書かないでください。';
  }
  async function copyFeedback() {
    updateFeedback();
    const output = $('feedback-output');
    if (!output.value) { $('copy-status').textContent = '直したい一言を入力してください。'; $('feedback-note').focus(); return; }
    try {
      if (!navigator.clipboard) throw new Error('Use local fallback');
      await navigator.clipboard.writeText(output.value);
      $('copy-status').textContent = 'コピーしました。先生が選んだ方法で受け渡せます。';
    } catch (_) {
      output.focus(); output.select();
      try {
        if(!document.execCommand('copy')) throw new Error('Copy unavailable');
        $('copy-status').textContent = 'コピーしました。先生が選んだ方法で受け渡せます。';
      } catch (_) { $('copy-status').textContent = '文を選択しました。端末の「コピー」を使ってください。'; }
    }
  }
  document.querySelectorAll('[data-letter]').forEach(b => b.addEventListener('click',()=>choose(b.dataset.letter)));
  $('back-home').addEventListener('click',()=>{show('home');$('home-title').setAttribute('tabindex','-1');$('home-title').focus();});
  $('open-guide').addEventListener('click',openGuide); $('lesson-guide').addEventListener('click',openGuide);
  $('close-guide').addEventListener('click',()=>{show(guideReturn);status('おはなし・音・まねっこ、どこからでも。'); if(guideReturn === 'lesson') $('lesson-title').focus(); else $('open-guide').focus();});
  $('story-button').addEventListener('click',()=>{stop();error('');const open=$('story-panel').hidden;$('story-panel').hidden=!open;$('story-button').setAttribute('aria-expanded',String(open));status(open?'おはなしを きこう。':'音や まねっこも えらべるよ。');});
  $('listen-button').addEventListener('click',()=>start(false));
  $('practice-button').addEventListener('click',()=>start(true));
  $('again-button').addEventListener('click',()=>start(true));
  $('stop-button').addEventListener('click',()=>stop('とまったよ。すきなところから もういちど。'));
  $('done-button').addEventListener('click',()=>{stop();error('');status('できたね！ いっしょに やってくれて ありがとう。');});
  document.querySelectorAll('input[name="repeat"],#gap,#sequence').forEach(el=>el.addEventListener('change',()=>stop('設定をかえたよ。「いっしょにまねる」で はじめよう。')));
  $('feedback-form').addEventListener('submit',e=>e.preventDefault());
  for(const id of ['feedback-letter','feedback-kind','feedback-note']) $(id).addEventListener('input',updateFeedback);
  $('copy-button').addEventListener('click',copyFeedback);
  document.querySelectorAll('.print-links a').forEach(a=>a.addEventListener('click',()=>stop()));
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop('いったん とめたよ。ボタンで はじめよう。');});
  window.addEventListener('pagehide',()=>stop());
  document.addEventListener('keydown',e=>{if(e.key==='Escape')stop('とまったよ。');});
  document.querySelectorAll('img').forEach(img=>img.addEventListener('error',()=>error('カード画像を読み込めません。assets フォルダを確認してください。')));
  for(const [letter,d] of Object.entries(data)) {
    const card = document.createElement('article'); card.className='guide-card';
    const header = document.createElement('div');header.className='guide-card-header';
    const img = document.createElement('img'); img.src=`assets/${letter}.png`;img.alt=d.name;
    const heading = document.createElement('h3');heading.textContent=`${letter} — ${d.name}`;header.append(img,heading);card.append(header);
    for(const text of [d.story,d.gesture,d.prompt]) { const p=document.createElement('p');p.textContent=text;card.append(p); }
    const quote=document.createElement('blockquote');quote.lang='en';quote.textContent=d.original;card.append(quote);$('guide-characters').append(card);
    const review=document.createElement('article');review.className='review';
    const title=document.createElement('h3');title.textContent=`${letter} — ${d.name}`;review.append(title);
    const result=window.MEDIA_REVIEW[letter];
    if(result) {
      const dl=document.createElement('dl');
      for(const [label,value] of [['技術検査',result.technical],['動作・内容照合',result.content],['先生の採用確認','採用確認待ち（明示承認なし）'],['修正依頼',result.request]]) {const dt=document.createElement('dt');dt.textContent=label;const dd=document.createElement('dd');dd.textContent=value;dl.append(dt,dd);}review.append(dl);
    }
    $('media-review').append(review);
  }
  setLetter('a'); updateFeedback();
})();
