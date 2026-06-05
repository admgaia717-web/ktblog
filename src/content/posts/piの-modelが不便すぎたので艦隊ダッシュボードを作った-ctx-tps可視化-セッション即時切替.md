---
title: "piの/modelが不便すぎたので艦隊ダッシュボードを作った——CTX/TPS可視化＋セッション即時切替"
date: 2026-06-04
slug: piの-modelが不便すぎたので艦隊ダッシュボードを作った-ctx-tps可視化-セッション即時切替
category: "note.com"
eyecatch: "/assets/eyecatch/nbfa197efa4fd.jpg"
---

# piの/modelが不便すぎたので艦隊ダッシュボードを作った——CTX/TPS可視化＋セッション即時切替

> 出典: note.com / 2026-05-05

## piの/modelが不便すぎたので、艦隊ダッシュボードを作った

pi（AIコーディングエージェント）の /model コマンド——200以上のモデルがずらりと並ぶ。プロバイダもバラバラ。Ollamaのローカルモデル、OpenRouterの無料枠、OpenCode-Goの高速ヘッド……。

探すのが大変。どれが今のセッションで使われてるのかもわからない。コンテクストサイズも小さな数字でしか見えない。速度（TPS）に至っては完全に闇。

**というわけで作った。**

## 艦隊モデルセレクター

![](https://assets.st-note.com/production/uploads/images/273094866/rectangle_large_type_2_52e6c63269cf5bc7653c5487fe6d1619.jpeg)

ブラウザで開くWeb UI。クリックするだけでモデルが切り替わる。

作ったのはPythonの小さなHTTPサーバーとHTML/CSS/JSのシングルページアプリ。4号機（spock / M1 Max 64GB）のlaunchdで常時起動させている。

## 1カードでわかる全情報

各モデルが1枚のカードに収まっている：

**モデル名 + ID** — 一目で識別可能
**バッジ** — 🔞無検閲 / 🖼VLM / 🧠Think / 無料 / ローカル
**CTXバー** — コンテクストウィンドウを横長グラフで可視化。8K（橙）→32K（青）→131K（緑）→262K（紫）と色分け
**TPSバー** — 推定生成速度（tok/s）を紫グラデーションのバーで表示。80tok/sが満タン
**最大出力トークン**

数字だけの一覧と違い、**CTXの広さと生成速度が視覚的に一瞬で比較できる**。Qwen 27BとGemma4 7.5BでCTXが8Kと131Kの差があるのも、バーの長さで一目瞭然だ。

## セッションを選んで即時切替

普通のモデル切替UIは「settings.jsonのdefaultModelを書き換える」だけ。つまり次回セッション起動時まで反映されない。

艦隊モデルセレクターは違う。**走っているpiセッションを選んで、その場でモデルを切り替えられる。**

仕組みはこうだ：pi拡張（TypeScript 100行）が各セッションの情報を /tmp/pi-sessions/ に書き出す。Web UIがそれを読み取ってセッション一覧に表示。切替時はシグナルファイルに書き込むだけで、拡張が fs.watch で検知し pi.setModel() を発動する。

Web UI → POST /switch {provider, model, pid}
  → /tmp/pi-sessions/signal-4079.json に書き込み
  → pi拡張（fs.watch）が検知
  → pi.setModel(model) 発動
  → セッションのモデルが即時切替

## 1号機と4号機のモデル同期

このダッシュボードを作る前段階として、1号機（MacBook Air M3）と4号機（M1 Max 64GB）のモデル設定を同期した。

1号機には scopedModels が26件登録されていたが、4号機は0件。1号機の設定を4号機にコピーし、さらに4号機の実Ollamaモデル（全20件）を自動スキャンして追加。最終的に scopedModels は41件になった。

4号機にある全Ollamaモデル——cron-3bからwasserstein-deepまで、20モデルすべてが1クリックで選択可能になった。

## ファイル構成

すべて ~/.pi/scripts/ と ~/.pi/agent/extensions/ に収まっている：

model_switcher.py — Python HTTPサーバー（180行）
model_switcher.html — Web UI（280行、依存ゼロ）
model-switcher-bridge/index.ts — pi拡張（120行）
com.pi.model-switcher.plist — launchd自動起動設定

データベース不要。APIキー不要。**全部ローカル、全部無料。**

## 作った理由

piに200以上のモデルがあるのはすばらしい。だが「200の中から1つを選ぶ」体験は最悪だった。

ターミナルで /model を打ち、矢印キーでスクロールし、モデル名だけを見て判断し、Ctrl+Sで保存し、セッションを再起動する——この流れが30秒かかる。モデルを試すたびにだ。

ダッシュボードなら2クリック。しかも走ってるセッションに即反映。

**道具は、使うときに邪魔になってはいけない。**

モデル選択という「手段」に時間を取られて、肝心の「考えること」が遅れるのは本末転倒だ。

## まとめ

piの200+モデルをビジュアルに一覧できるWeb UIを作った
CTXとTPSを横長バーで視覚化。無検閲モデルには🔞マーク
走ってるpiセッションを選んでモデルを即時切替可能
全部ローカル、全部無料、依存ゼロ
4号機で launchd 常時起動済み

**もしpiの/modelに不満があるなら、これを使ってほしい。**コードはすべて ~/.pi/scripts/ にある。

---
*この記事は note.com から KTBLOG に移行されました。元記事: https://note.com/famous_prawn2009/n/nbfa197efa4fd*