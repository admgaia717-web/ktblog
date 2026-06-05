---
title: "奈良で地震。その瞬間、CIAの司令室を開いた——World Monitor完全ガイド"
date: 2026-06-04
slug: 奈良で地震-その瞬間-ciaの司令室を開いた-world-monitor完全ガイド
category: "防災/地震/奈良/オープンソース/OSINT/WorldMonitor"
eyecatch: "/assets/eyecatch/n01134de4dfe7.png"
---

# 奈良で地震。その瞬間、CIAの司令室を開いた——World Monitor完全ガイド

> 出典: note.com / 2026-05-06

## 奈良で地震。その瞬間、僕は「CIAの司令室」を開いた。

今朝、奈良で揺れた。震度は大したことなかったが、「またか」と思った。

奈良は地震が多い。そして毎回、正確な情報が出るまでに時間がかかる。気象庁のサイトは重い。NHKは繰り返し同じ映像を流す。Twitterはデマが飛び交う。

でも今回は違った。手元に**World Monitor**があったからだ。

## CIAの司令室が、無料で、ブラウザで

World Monitor——GitHubで43,000スターを集めるオープンソースのグローバルインテリジェンスダッシュボード。開発者はElie Habib（レバノン出身の音楽ストリーミングCEO）。「週末にClaudeで作った」という代物だ。

これが凄い。紛争、軍事、地震、火災、サイバー攻撃、株価、暗号通貨——435以上のデータフィードを3D地球儀にリアルタイム表示する。

ログイン不要。完全無料。しかも**OllamaでローカルAI処理**までできる。

## 地震モニターが秒でわかる

World Monitorを開き、レイヤーパネルから「Natural Events」→「Earthquakes」をONにするだけ。

表示される情報：

震源地（マグニチュード4.5以上）
マグニチュードと深度
発生時刻
過去の地震との重ね合わせ

データソースはUSGS（アメリカ地質調査所）。世界中の地震をほぼリアルタイムで捕捉している。

さらに「NASA FIRMS」レイヤーをONにすれば、現在3,300件以上の山火事が世界中で燃えているのが見える。「GDACS」は国連の災害警報。火山、洪水、暴風雨も一目だ。

## 地震以外も全部見える

レイヤー内容データソース
🛩 軍用機ADS-Bライブ追跡Wingbits / OpenSky
🚢 船舶AIS船舶トラッキングAIS Hub
⚔️ 紛争戦闘地域・ホットスポットACLED / UCDP
🔒 サイバー攻撃・ボットネット・マルウェアAbuseIPDB / URLhaus
🌊 海底ケーブル全ケーブル・陸揚げ地点Submarine Cable Map
🏦 株式市場92取引所・13中央銀行Finnhub / BIS
🛢 原油WTI/Brent価格・生産量EIA
📡 衛星全人工衛星軌道CelesTrak

全部で45以上のレイヤーがある。つまり、地球上で起きていることのほぼ全てが、このダッシュボード一枚で見えるということだ。

## 自宅にインストールする方法（5分）

必要なもの：Node.js（v18以上）、Git。

# 1. クローン
git clone https://github.com/koala73/worldmonitor.git
cd worldmonitor

# 2. インストール
npm install

# 3. 起動
npx vite --host 0.0.0.0 --port 5173

# 4. ブラウザで開く
open http://localhost:5173

**APIキー不要。** 地図もニュースも地震も、全部デフォルトで動く。

AI分析を使いたい場合はOllamaを入れれば、ローカルLLMで日次要約や脅威分析が走る。

## スマホからも使える

PWA対応だから、ブラウザで開いて「ホーム画面に追加」すればネイティブアプリのように使える。Cloudflare Tunnelを使えば外出先からも自宅サーバーにアクセス可能。

# Cloudflare Tunnelで公開
cloudflared tunnel --url http://localhost:5173
# → https://xxx.trycloudflare.com が発行される

## 情報弱者から情報強者へ

World Monitorの本質は「情報の民主化」だ。

従来このレベルのインテリジェンスプラットフォームは、Bloomberg Terminal（月額2,000ドル）やPalantir（年額100万ドル〜）の領域だった。それが今、**完全無料・オープンソース**で手に入る。

地震が来たら、Twitterを見る前にWorld Monitorを開く。

紛争が起きたら、ニュースを見る前に軍用機の飛行情報を確認する。

株が動いたら、チャートを見る前に金利と地政学リスクを重ねて見る。

これが、2026年の「当たり前」になるべき情報リテラシーだ。

*World Monitor: https://worldmonitor.app

GitHub: https://github.com/koala73/worldmonitor

開発者: Elie Habib（@eliehabib）*

---
*この記事は note.com から KTBLOG に移行されました。元記事: https://note.com/famous_prawn2009/n/n01134de4dfe7*