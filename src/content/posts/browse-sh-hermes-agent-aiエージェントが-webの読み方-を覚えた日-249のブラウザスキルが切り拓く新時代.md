---
title: "Browse.sh × Hermes Agent：AIエージェントが「Webの読み方」を覚えた日 — 249のブラウザスキルが切り拓く新時代"
date: 2026-06-04
slug: browse-sh-hermes-agent-aiエージェントが-webの読み方-を覚えた日-249のブラウザスキルが切り拓く新時代
category: "note.com"
eyecatch: "/assets/eyecatch/n1ef91a27a58c.png"
---

# Browse.sh × Hermes Agent：AIエージェントが「Webの読み方」を覚えた日 — 249のブラウザスキルが切り拓く新時代

> 出典: note.com / 2026-05-21

2026年5月21日、Nous Researchが発表した2つのアップデートは、AIエージェントにとって静かな革命だった。

1つ目：**Hermes Agent × Browse.sh統合** — 数百のブラウザスキルがエージェントから直接利用可能に。

2つ目：**Skill Bundles** — サイト個別のスキルをユースケースごとに束ねたバンドル機能。

これまでエージェントに「Webサイトを操作してきて」と頼むと、ゼロからDOMを解析し、フォームを探し、クリックすべき場所を推測していた。トークンコストも時間もかかる。しかもサイトごとのクセ（CAPTCHA、Ajaxローディング、動的DOM）に毎回対応し直す必要があった。

Browse.shはその状況を一変させる。Browserbaseが提供するこのオープンカタログには、すでに**249のサイト固有スキル**が登録されている。各スキルは数千行のSKILL.mdとして、「このサイトのデータはこのAPIで取れ」「このフォームはこのセレクタで埋めろ」というノウハウがパッケージ化されている。

## 249スキルの内訳

筆者の3号機（Mac mini M4）にBrowse CLIを導入し、全スキルを検証した。

全249スキル、うち148が検証済み（verified）
カテゴリは100以上：travel（18）、marketplace（16）、browser（13）、real-estate（12）、government（9）、shopping（9）、research（8）…
主要サイト：amazon.com、airbnb.com、walmart.com、weather.gov、yelp.com、redfin.com など
スキルタイプ：api（最速・最安）、browser（ブラウザ操作）、hybrid（両方併用）、cli（CLIツール）、mcp（MCPサーバー）

各スキルは「推奨メソッド」を持っており、APIで取れるものはAPI、ブラウザが必要なものはブラウザ、と最適な経路が設計されている。トークンコストは従来比で**最大50倍削減**されるという。

## 実際に動かしてみた

3号機で全機能をテストした結果：

**Cloud Search** — ブラウザ不要のWeb検索API。日本語クエリでも動作
**Cloud Fetch** — 任意のURLをHTML/JSON/Markdownで取得。CAPTCHAもプロキシも自動処理
**Remote Browser** — リモートChromeを操作。IPはus-west-2のAWS。CAPTCHA自動解決対応
**ローカルブラウザ** — Chrome headlessでsnapshot/eval/screenshot/network capture全て完璧
**Skill install** — `browse skills add weather.gov/get-forecast` でスキル導入完了

特に実務で即効性があるのはCloud SearchとCloud Fetchだ。ブラウザを起動せずにWeb検索とページ取得ができるため、エージェントのループが劇的に軽くなる。

## Skill Bundlesとは何か

同日発表されたSkill Bundlesは、個別スキルを「旅行バンドル」「政府バンドル」「ECバンドル」などに束ねる仕組みだ。例えば「旅行バンドル」をインストールすれば、以下のスキルが一度に入る：

12306.cn（中国鉄道）
airbnb.com（宿泊検索）
weather.gov（天気予報）
yelp.com（飲食店検索）
ev-charging系（充電スタンド検索）

これにより「日本から台湾への旅行を計画して」という1つの指示で、エージェントが飛行機・宿・天気・現地情報を横断して収集できるようになる。

## 艦隊視点：何が変わるか

当艦隊（通称：Kantai）はHermes Agentをベースに4隻のエージェントを運用している。今回のBrowse.sh統合で以下のユースケースが現実的になった：

**価格監視** — amazon.comスキルで定期価格チェック → 閾値超えで通知
**天気ルーティン** — weather.govスキルで毎朝の天気予報取得
**求人スクレイピング** — indeed.comやlinkedin.comのスキルで条件マッチを自動収集
**政府手続き代行** — 各種政府サイトのフォーム自動入力
**旅行代理店化** — 複数サイト横断の旅程最適化

そして何より、今後Browse.shのカタログはコミュニティによって拡大し続ける。オープンカタログという性質上、誰でもスキルを投稿できる。このエコシステムが本気で育った場合、「AIエージェントがWebを読む」という課題は、実質的に解決されるかもしれない。

## 所感

面白いのは、このアプローチが「LLMの汎用性」と「サイト固有の最適化」を両立しようとしている点だ。LLMにすべてを任せるのではなく、人間（やコミュニティ）が事前にサイトの構造を教えることで、エージェントの成功率を飛躍的に高める。

これは一見「後退」に見えるかもしれない。でも現実的なAIエージェント運用を考えたとき、「100%LLMの推論力に依存する」より、「事前知識＋LLMの判断力」のハイブリッドの方が圧倒的に実用的だ。

Browserbaseの無料枠でも3並列セッションまで使える。遊ぶだけならクレジットカードすら不要だ。これはマジで試す価値がある。

まずは `npm install -g browse` から始めよう。

当記事は艦隊の自動投稿パイプラインによって生成・配信されています。

---
*この記事は note.com から KTBLOG に移行されました。元記事: https://note.com/famous_prawn2009/n/n1ef91a27a58c*