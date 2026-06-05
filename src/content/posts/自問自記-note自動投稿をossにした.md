---
title: "「自問自記」——note自動投稿をOSSにした"
date: 2026-06-04
slug: 自問自記-note自動投稿をossにした
category: "note/python/自動化/Github/OSS/自問自記"
eyecatch: "/assets/eyecatch/n13490180dfc1.png"
---

# 「自問自記」——note自動投稿をOSSにした

> 出典: note.com / 2026-05-07

## 「自問自記」——チャットの疑問を即記事にして、自分を教育する仕組みを作った

僕にはAI艦隊がいる。3台のMacに10体のAIエージェント。毎日いろんなことを自動化してる。

で——艦隊と話してると、自然と**「あれ？Gitって何だっけ」**みたいな疑問が浮かぶ。

AIが解説してくれる。ふむふむ、なるほど。でも——

**「これ、記事にしたらよくない？」**

そう思った。疑問→解説→そのまま記事公開。読者にも役立つし、自分の理解も深まる。しかも後から検索できる。一石三鳥どころか四鳥。

これに**「自問自記（じもんじき）」**と名付けた。自分に問い、自分で記す。すべての会話が教材になる。

そして——この仕組みをオープンソースにした。名付けて **note-publisher**。

## note-publisherで何ができるか

# Python 3行でnote記事を公開 + 全SNSに拡散
from note_publisher import NotePublisher

pub = NotePublisher(cookie="あなたのnoteクッキー")
result = pub.publish("タイトル", "本文HTML", eyecatch_path="画像.png")
# → https://note.com/あなた/n/xxxxx が公開される！

# そのままSubstack + X + Threadsに自動拡散
from note_publisher.distribute import distribute
distribute(result["url"])
# → ✅ Substack ✅ X ✅ Threads

これだけ。記事を書いて画像を貼って「公開」を押す——その一連の作業が全部自動化される。

## なぜオープンソースにしたか

理由はシンプル——**僕が欲しいから**。そして**たぶん他の人も欲しいから**。

note.comには公式APIがない。でもブラウザの通信を解析すれば、内部APIを使える。その解析結果をコードにして公開した。これで誰でもnote自動投稿ができる。

さらに——Substack、X、Threadsへの同時拡散も1コマンド。

これは僕の「自問自記」サイクルそのものだ。疑問→AIが解説→記事化→公開→拡散。このサイクルを回すためのエンジン。

## 詳細とスターのお願い

GitHubで公開しています。気に入ったら⭐スターください。

🔗 https://github.com/admgaia717-web/note-publisher

「noteで記事を書いてるけど、自動化したい」——そんな人はぜひ使ってみてほしい。バグ報告やプルリクも大歓迎。

自問自記。あなたの疑問も、きっと誰かの答えになる。

*技術スタック: Python 3.13 / requests / ComfyUI（アイキャッチ生成）/ note.com非公式API / Substack API / agent-browser（X/Threads）*

---
*この記事は note.com から KTBLOG に移行されました。元記事: https://note.com/famous_prawn2009/n/n13490180dfc1*