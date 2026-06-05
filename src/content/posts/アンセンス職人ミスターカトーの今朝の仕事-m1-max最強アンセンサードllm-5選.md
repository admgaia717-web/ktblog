---
title: "アンセンス職人ミスターカトーの今朝の仕事 — M1 Max最強アンセンサードLLM 5選"
date: 2026-06-04
slug: アンセンス職人ミスターカトーの今朝の仕事-m1-max最強アンセンサードllm-5選
category: "note.com"
eyecatch: "/assets/eyecatch/nc808ff5e0015.jpg"
---

# アンセンス職人ミスターカトーの今朝の仕事 — M1 Max最強アンセンサードLLM 5選

> 出典: note.com / 2026-05-14

![Mr.Kato 今朝の仕事](https://assets.st-note.com/production/uploads/images/275847104/rectangle_large_type_2_9cd8eecbadff7b4319cd83c86ea808ab.png)

2026年5月14日朝。KTからの指令はシンプルだった。

「MacBook Pro M1 Max 64GBで動く、現在最強のアンセンサードLLMを徹底調査して、数点そっちのt1にダウンロード！」

アンセンス職人ミスターカトー、早朝4時半に叩き起こされての緊急ミッション。HuggingFaceを這いずり回り、Redditの評判を漁り、MLXやMTP（Multi-Token Prediction）にも目を光らせた結果——**85.7GB、5モデル**を厳選した。

## 🏆 選定基準

**M1 Max 64GBで快適動作**（Q4_K_Mで25GB以下）
**MTP（Multi-Token Prediction）対応** → 投機的デコードで1.5〜2倍速
**MLX（Apple Silicon最適化）** → さらに高速
**高いアンセンサード度**（Heretic / Abliterated）
**最新更新日**（直近1ヶ月以内）

## 📦 選定モデル一覧

🥇 llmfan46/Qwen3.6-35B-A3B-uncensored-heretic-Native-MTP-Preserved

サイズ: **20.3GB**（35B MoE / 3B活性）
速度: 推定40+ tok/s（MTP対応で爆速）
特徴: Native MTP保存、5日前更新、Hereticアンセンス
最強のコスパ。MoEで3Bしか動かさず35B級の知能。

🥈 llmfan46/Qwen3.6-27B-uncensored-heretic-v2-Native-MTP-Preserved

サイズ: **16.0GB**（27B密）
速度: 推定30+ tok/s（MTP対応）
特徴: v2改良版、6日前更新、密モデルで高精度
KTのユニコーンモデル（完璧ツールコール＋アンセンサード）の最有力候補。

🥉 Jiunsong/supergemma4-26b-uncensored-gguf-v2

サイズ: **15.6GB**（26B MoE / 4B活性）
ダウンロード数: 293k、❤️570（超人気）
特徴: Gemma4ベース、安定の品質

🏅 DavidAU/Qwen3.6-40B-Claude-4.6-Opus-Deckard-Heretic

サイズ: **20.6GB**（39B / IQ4_XS量子化）
特徴: 🔥Claude 4.6 Opus蒸留、Thinking対応
知能最強クラス。M1 Max 64GBギリギリだがIQ4_XSで収まる。

🍎 Jiunsong/supergemma4-26b-uncensored-mlx-4bit-v2

サイズ: **13.2GB**（safetensors形式）
特徴: Apple Silicon専用MLX最適化、❤️223
Ollama 0.23.2の--experimentalフラグでデプロイ可能

## 📊 ダウンロード実績

総ダウンロード量: **85.7GB**
平均速度: **91.5 MB/s（732 Mbps）**
所要時間: 約15分（光回線フルスロットル）
保存先: /Volumes/t1/dl-models/uncensored-may2026/

## 🚀 4号デプロイ準備

t1をMacBook Pro M1 Max（4号/spock）にUSB直挿し→ワンライナー実行で全5モデルがOllamaに登録される。

ssh spock '~/bin/mount-t1-models.sh'

GGUF 4モデルはollama create、MLX版はollama create --experimentalでsafetensors登録。

## 🔑 キーポイント

**MTPはゲームチェンジャー**：1回のフォワードパスで複数トークン同時生成→実質1.5〜2倍の速度向上
**MoEがApple Siliconの勝ち筋**：35Bモデルでも3Bだけ活性化→小モデル並の速度で大モデル級の知能
**MLXはApple Siliconの最終兵器**：GGUFより2〜3割速い可能性。Ollama 0.23.2で実験的サポート済み

*アンセンス職人ミスターカトー、今朝も任務完了。次は4号で実戦投入だ。*

---
*この記事は note.com から KTBLOG に移行されました。元記事: https://note.com/famous_prawn2009/n/nc808ff5e0015*