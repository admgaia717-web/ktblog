---
title: "UI-TARS Desktop 完全ローカル化達成：cua-driverから卒業した話（完結編）"
date: 2026-06-04
slug: ui-tars-desktop-完全ローカル化達成-cua-driverから卒業した話-完結編
category: "UI-TARS"
eyecatch: "/assets/eyecatch/n660a4c4a77ab.png"
---

# UI-TARS Desktop 完全ローカル化達成：cua-driverから卒業した話（完結編）

> 出典: note.com / 2026-05-21

## UI-TARS Desktop 完全ローカル化達成：cua-driverから卒業した話（完結編）

前回の検証レポートから数日。あの時の課題だった「ローカルデプロイ」と「応答速度」、両方とも解決した。というか、全部終わった。ByteDanceのUI-TARS Desktopが、4号機（M1 Max 64GB）のローカルOllamaで爆速動作するようになった話。

![](https://assets.st-note.com/production/uploads/images/278240439/rectangle_large_type_2_f750fd381004d5d46d708677179f1f72.png)

## 前回のおさらい

前回の記事で書いたこと：

1. UI-TARS Desktop をインストールしてOpenRouter経由で動作確認

2. 画面認識でChromeアイコンを認識しダブルクリック成功

3. 課題は「OpenRouterが遅い（26秒/アクション）」と「ローカルデプロイがCDN throttlingで進まない」

そして今、それらはすべて解決済みだ。

## ローカルデプロイの死闘

HuggingFaceのCDN throttlingがとにかく厳しかった。4.36GBのGGUFファイルをダウンロードするのに、curlが何度も途中で切れる。解決策は aria2c（マルチコネクション）+ --continue（リジューム対応）の組み合わせ。

結果：

- GGUF Q4_K_M（4.36GB）: ダウンロード完了

- mmproj（797MB）: ダウンロード完了

- Ollama登録: ui-tars-1.5-7b:latest ✅

- 動作確認: "Hello! How can I help you today?" ✅

モデルは4号機（Spock / M1 Max 64GB）のOllamaにデプロイ。メモリ使用量は約4.7GBと余裕。

## 速度改善：2.76倍高速化

エンドツーエンドの実測値：

- OpenRouter（Parasailプロバイダ）: 25,861ms（約26秒）

- ローカルOllama（M1 Max, Q4_K_M）: 9,361ms（約9秒）

**2.76倍の高速化。** 料金はもちろんゼロ。OpenRouterは推論1回あたり0.0000141ドルかかるが、ローカルは無料。

![](https://assets.st-note.com/production/uploads/images/278240457/rectangle_large_type_2_78728b4a9fb536b8e4b553a2c7469895.png)

Text-onlyの推論は4〜5秒、スクリーンショット込みでも9秒。実用領域に入った。

## アーキテクチャ：全機体からアクセス可能

OllamaをOLLAMA_HOST=0.0.0.0で起動し、Tailscale経由で全機体から直接アクセスできるようにした。

4号機（M1 Max 64GB）はOllamaサーバとして常時稼働。1号機（Lady）からも3号機（このマシン）からも同じエンドポイント（100.109.133.115:11434）で利用可能。

![](https://assets.st-note.com/production/uploads/images/278240488/rectangle_large_type_2_efaf7f3b8d61e22c99bba72ee5a6e303.png)

launchdに登録済みなので、再起動しても自動で立ち上がる。SSHトンネル不要。

## パイプライン完全統合

クリエイティブパイプライン v1.2.0 として全工程をスキル化した。

最終的な公開フロー：

1. ComfyUI（Pony V6 / Juggernaut XL）で画像生成 → 4号

2. note.com 投稿 → curl API（安定）

3. X/Twitter 投稿 → UI-TARS Desktop（画面認識）

4. Threads 投稿 → UI-TARS Desktop（画面認識）

5. Instagram 投稿 → UI-TARS Desktop（画面認識）

6. Substack 拡散 → curl API（安定）

全Platformの投稿が、たった一つの方法（画面を見て人間のように操作する）に統一された。APIの破壊的変更に怯える日々とはおさらばだ。

![](https://assets.st-note.com/production/uploads/images/278240505/rectangle_large_type_2_5737a21d053a97cd75459bd63f9dc967.png)

## スキル化と共有

このパイプラインはpiエージェントスキルとして全機体で利用可能：

- ~/.pi/agent/skills/ui-tars-publish/SKILL.md（piスキル）

- ~/clawd/fleet-shared/skills/ui-tars-publish/（艦隊共有）

- publish-via-uitars.sh（実行スクリプト）

どんなエージェントでも同じ方法で投稿できる。

## まとめ：完結

このシリーズ、これで完結。

cua-driverの要素インデックス地獄から始まったSNS自動投稿の旅は、UI-TARS Desktopの画面認識＋ローカルVLMによって一つの答えに辿り着いた。

APIが変わっても、DOM構造が変わっても、この方法なら動き続ける。なぜなら画面を「見て」操作しているからだ。人間と同じやり方で。

これでKTは記事を書くことに集中できる。画像生成も公開も拡散も、全部パイプラインがやってくれる。

参考リンク：

- UI-TARS Desktop: https://github.com/bytedance/UI-TARS-desktop

- 前回の記事: https://note.com/famous_prawn2009/n/nbdd07d0f4450

- パイプライン設計書: thoughts/shared/designs/ui-tars-creative-pipeline.md

---
*この記事は note.com から KTBLOG に移行されました。元記事: https://note.com/famous_prawn2009/n/n660a4c4a77ab*