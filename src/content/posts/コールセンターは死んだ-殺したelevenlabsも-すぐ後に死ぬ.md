---
title: "コールセンターは死んだ。殺したElevenLabsも、すぐ後に死ぬ。"
date: 2026-06-04
slug: コールセンターは死んだ-殺したelevenlabsも-すぐ後に死ぬ
category: "note.com"
eyecatch: "/assets/eyecatch/ne728fe796791.png"
---

# コールセンターは死んだ。殺したElevenLabsも、すぐ後に死ぬ。

> 出典: note.com / 2026-05-03

![](https://assets.st-note.com/production/uploads/images/272561482/rectangle_large_type_2_76bb2858077c6858b42096d2792da1d8.png)

## 速報：コールセンターは死んだ。殺したElevenLabsも、すぐ後に死ぬ。

ElevenLabsがᵘᴱᴱᴼを上げた。

「コールセンターは正式に死んだ。$400億のカスタマーサポート業界を一掃した。$0.08/min。Revolut、Cisco、Deliverooが導入済み。」

素晴らしい。本当に素晴らしい技術だ。

しかし、待ってほしい。**言ってる自分がオープンソースに殺される側**だと気づいているのだろうか。

## 🔗 食物連鎖：誰が誰を殺すのか

![](https://assets.st-note.com/production/uploads/images/272560406/rectangle_large_type_2_5378246ff7cc53bbb8f9f830a8ed2ad4.png)

ElevenLabsはコールセンターを殺した。しかし、その武器（STT・LLM・TTS）はすべてオープンソースで代替可能だ。CosyVoice 2は⭐20,844。Kokoroは⭐6,849。Voxtralは70ms遅延。オープンソースの群れが、ElevenLabsを包囲している。

## ElevenLabsの主張を整理する

まず、彼らの宣伝を真面目に読む。

・70以上の言語で人間らしく聞こえる

・通話中に予約、更新、チケットをクローズ

・GPT、Claude、Gemini、どんなLLMにも接続可能

・$0.08/min、スタートアップは$4,000分無料

コスト削減率：**99.2%**

## 問題：この技術、全部丸見え

ElevenLabsが使っている技術スタックを分解してみる。

**STT（音声認識）**→ Whisper系、もしくは自社モデル

**LLM（推論）**→ GPT、Claude、Gemini（彼らが言ってる）

**TTS（音声合成）**→ 自社モデル（ここだけ独自）

**オーケストレーション**→ パイプライン処理

**TTS以外はすべてオープンソースで代替可能**。そしてTTSすら、2026年5月時点でオープンソースが猛追している。

## 💰 コスト比較：残酷な数字

![](https://assets.st-note.com/production/uploads/images/272560441/rectangle_large_type_2_704f7f77ae107d033fa1604de9d901f6.png)

1日8時間、月20日稼働のコールセンターで計算する。

**ElevenLabs:** $0.08 × 480min × 20日 = **$768/月**（約11.5万円）。年間$9,216。

10台同時稼働なら年間**$110,592（約1,660万円）**

**ローカル構築:** 初期投資約30万円。月額ランニングコスト**$0**。

**損益分岐点：約3ヶ月**

## ⏱️ レイテンシ比較

![](https://assets.st-note.com/production/uploads/images/272560458/rectangle_large_type_2_5729814e7237f186a47b01db4d9e4ed1.png)

Voxtral TTSの70ms遅延は、ElevenLabsのAPI経由よりも速い。ネットワーク往復が不要だからだ。

## 「でも品質が劣るんでしょ？」

2024年ならそうだった。2026年5月、もうそうではない。

Kokoro 82Mの音質は、ブラインドテストでElevenLabsと区別がつかない。CosyVoice 2は声のクローン精度で上回る。品質で負けていない。コストで圧倒。レイテンシで勝利。

## 📈 予測：2027年の市場シェア

![](https://assets.st-note.com/production/uploads/images/272560479/rectangle_large_type_2_214fb9f0622d842fd50a99057e7cdaaf.png)

## 🎯 ElevenLabsの生存戦略

![](https://assets.st-note.com/production/uploads/images/272560495/rectangle_large_type_2_7fc1cbbcf45da9fb3056ed1a78a6d1c5.png)

ElevenLabsが生き残る道は2つ。

①**プラットフォーム化** — 声のマーケットプレイス、声のNFT、声のライセンス

②**淘汰** — オープンソースに市場を奪われ縮小

CosyVoice 2が2万スターを超えた時点で、もう市場は変わり始めている。

## 結論

**コールセンターは死んだ。

殺したElevenLabsも、すぐ後に死ぬ。

そして、殺すのはオープンソースだ。**

## 主要プロジェクト

・[speech-to-speech](https://github.com/huggingface/speech-to-speech) ⭐4,704

・[CosyVoice 2](https://github.com/FunAudioLLM/CosyVoice) ⭐20,844

・[Kokoro 82M](https://github.com/hexgrad/kokoro) ⭐6,849

・[RealtimeSTT](https://github.com/KoljaB/RealtimeSTT) ⭐9,757

---
*この記事は note.com から KTBLOG に移行されました。元記事: https://note.com/famous_prawn2009/n/ne728fe796791*