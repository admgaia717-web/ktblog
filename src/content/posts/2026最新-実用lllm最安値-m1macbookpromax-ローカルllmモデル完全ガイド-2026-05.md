---
title: "2026最新⚡️実用LLLM最安値💻M1MacBookProMax ローカルLLMモデル完全ガイド 2026-05"
date: 2026-06-04
slug: 2026最新-実用lllm最安値-m1macbookpromax-ローカルllmモデル完全ガイド-2026-05
category: "note.com"
eyecatch: "/assets/eyecatch/nb4c76077a189.png"
---

# 2026最新⚡️実用LLLM最安値💻M1MacBookProMax ローカルLLMモデル完全ガイド 2026-05

> 出典: note.com / 2026-05-03

# 4号機（Spock M1 Max 64GB）ローカルLLMモデル完全ガイド

> 2026-05-03 更新｜Ollama macOSアプリで選択可能な全モデル解説

## 総覧

# | モデル名 | 種別 | サイズ | 容量 | Vision | 思考 | ツール

1 | **qwen3.6:35b-a3b** | MoE | 36B(A3B) | 22.3GB | ✅ | ✅ | ✅

2 | **ornstein37** | MoE | 34.7B | 21.8GB | ❌ | ✅ | ✅

3 | **qwen36-toolhead** | MoE特化 | 34.7B | 20.2GB | ❌ | ❌ | ✅

4 | **qwen36-27b-hauhau** | 27B | 26.9B | 16.3GB | ❌ | ❌ | ❌

5 | **qwen36-27b-uncensored-hauhaucs** | 27B Q8 | 26.9B | 29.8GB | ❌ | ❌ | ❌

6 | **huihui_ai/Qwen3.6-abliterated:27b** | 27B | 27.8B | 16.2GB | ✅ | ✅ | ✅

7 | **hermes-head** | 27B特化 | 26.9B | 15.4GB | ❌ | ❌ | ✅

8 | **fredrezones55 無検閲MoE** | MoE | 35.1B | 20.6GB | ✅ | ✅ | ✅

9 | **sgemma-lightning** | 7B | 7.5B | 5.0GB | ❌ | ✅ | ✅

10 | **gemma4-uncensored** | 7B | 7.5B | 5.0GB | ❌ | ✅ | ✅

11 | **supergemma4** | 7B | 7.5B | 5.0GB | ❌ | ❌ | ❌

12 | **qwen2.5vl:7b** | Vision | 8.3B | 5.6GB | ✅ | ❌ | ❌

13 | **smolvlm2** | 超軽量Vision | 1.8B | 1.0GB | ✅ | ❌ | ❌

14 | **cron-4b** | 軽量 | 4.0B | 2.3GB | ❌ | ✅ | ✅

15 | **cron-3b** | 軽量 | 3.2B | 1.9GB | ❌ | ❌ | ✅

16 | **llama3.2:3b** | 軽量 | 3.2B | 1.9GB | ❌ | ❌ | ✅

17 | **glm-5:cloud** | ☁️クラウド | — | 0GB | ❌ | ✅ | ✅

18 | **qwen3.5:cloud** | ☁️クラウド | 397B | 0GB | ✅ | ✅ | ✅

19 | **kimi-k2.5:cloud** | ☁️クラウド | 1T | 0GB | ✅ | ✅ | ✅

## 🧠 MoE（Mixture of Experts）大規模モデル

**qwen3.6:35b-a3b（⭐主力）**

Qwen 3.6 の MoE 版。総パラメータ36Bだが、トークンごとに3Bだけ活性化（A3B）するため、実質的な推論速度は7B級。vision・ツール呼出・思考モードの全機能完備。**日常使いのデフォルトに最適。**

- ファミリー: qwen35moe - 量子化: Q4_K_M（22.3GB） - 長所: バランス型。高速・多機能。日本語強い - 短所: MoEのためVRAM使用量が大きい（実体22GB）

**ornstein37（ダークホース）**

Qwen 3.5 MoEベースのカスタムモデル。"Ornstein"はダークソウルの竜狩りから。名前の通り戦闘力高く、クリエイティブな文章生成に優れる。思考モード対応で長文推論も可。

- ファミリー: qwen35moe - 量子化: Q4_K_M（21.8GB） - 長所: 文章力・創造性。RPGや物語生成向き - 短所: vision未対応。出自不明、やや不安定な場面あり

**fredrezones55/Qwen3.6-35B-A3B-Uncensored-HauhauCS-Aggressive（🔥最強無検閲MoE）**

Qwen3.6 MoE + HauhauCS無検閲加工 + Aggressiveチューニング。35Bパラメータで全機能（vision・ツール・思考）を無検閲で使える唯一のMoE。フィルターゼロ。

- ファミリー: qwen35moe - 量子化: Q4_K_M（20.6GB） - 長所: 検閲なし × 全機能 × 高速。最強の武器 - 短所: やや過激。普通の会話にはオーバースペック

## 🔥 27B級 無検閲モデル

**qwen36-27b-hauhau**

Qwen 3.6 27B を HauhauCS が無検閲化。27Bフルパラメータで動作する純粋無検閲モデル。思考・vision・ツールは非対応だが、生成品質は高い。

- ファミリー: qwen35 - 量子化: Q4_K_M（16.3GB） - 長所: 27Bフルの表現力。日本語完璧 - 短所: ツール呼出不可。16GB使う割に機能少

**qwen36-27b-uncensored-hauhaucs（💎最高品質無検閲）**

同じHauhauCS製だが量子化がQ8_0（高精度）。Q4_K_Mの約2倍の容量だが、品質低下がほぼゼロ。**品質重視の無検閲生成に最適。**

- ファミリー: qwen35 - 量子化: **Q8_0**（29.8GB）←全モデル中最大 - 長所: 最高画質の無検閲出力。劣化ほぼなし - 短所: 30GB食う。64GB Macでも複数同時起動は厳しい

**huihui_ai/Qwen3.6-abliterated:27b**

Huihui AIによるQwen3.6 27Bの abliteration（機械論的拒否除去）版。vision・ツール・思考の全機能を無検閲で使えるバランス型。

- ファミリー: qwen35 - 量子化: Q4_K_M（16.2GB） - 長所: 無検閲 + 全機能 = 理想形。27B級で唯一の万能型 - 短所: huihui版は更新が不定期

## 🛠️ ツール特化モデル

**qwen36-toolhead（🔧ツール呼出専用機）**

Qwen 3.6 MoE 34.7Bをツール呼出に特化させたモデル。Hermesゲートウェイのツール実行用に最適化。JSONスキーマの正確な出力が強み。

- ファミリー: qwen35moe - 量子化: 不明（20.2GB） - 長所: ツール呼出の精度が段違い。JSON破綻しない - 短所: 純粋な会話には向かない。ツール前提の設計

**hermes-head（🐚 Hermesエージェント頭脳）**

Hermesエージェント専用ヘッド。Qwen 3.5 27Bベースで、Hermesのツールセットに対応するよう調整済み。艦隊のエージェント運用に最適化。

- ファミリー: qwen35 - 量子化: Q4_K_M（15.4GB） - 長所: Hermesエコシステムとの統合。エージェント運用向け - 短所: 一般用途には過剰。Hermes専用設計

**sgemma-lightning（⚡Lightning用Gemma）**

Gemma 4 7.5BベースのLightningゲートウェイ用モデル。軽量なのにツール呼出・思考モード対応。常時稼働のゲートウェイ向け。

- ファミリー: gemma4 - 量子化: Q4_K_M（5.0GB） - 長所: 5GBと軽量。常駐向け。ツール可 - 短所: 7.5Bなので生成品質は中級

## 💎 Gemma 4 系統（7.5B級）

**gemma4-uncensored**

Google Gemma 4 の無検閲版。純粋なabliterationで拒否機能を除去。7.5Bという小ささで、ツール呼出・思考モード対応。

- ファミリー: gemma4 - 量子化: Q4_K_M（5.0GB） - 長所: 軽い・速い・無検閲・多機能 - 短所: 7.5Bの限界。複雑な推論は不得手

**hf.co/NidAll/supergemma4-e4b-abliterated-Q4_K_M-GGUF（⚗️実験強化版）**

NidAllがGemma 4をabliterate+追加調整した実験版。純粋なabliterationに加えてパフォーマンス強化あり。

- ファミリー: gemma4 - 量子化: Q4_K_M（5.0GB） - 長所: gemma4-uncensoredよりチューニング進化版の可能性 - 短所: ツール非対応。実験版のため安定性未確認

## 👁️ Visionモデル

**qwen2.5vl:7b（画像解析主力）**

Qwen 2.5 VL。テキスト+画像のマルチモーダル生成。このガイドのスクリーンショット解析にも使用した。8.3Bながら画像認識精度は高い。

- ファミリー: qwen25vl - 量子化: Q4_K_M（5.6GB） - 長所: 画像+テキスト入力。OCR精度良好。日本語対応 - 短所: ツール呼出不可。画像生成はできない（認識のみ）

**richardyoung/smolvlm2-2.2b-instruct:q4_k_m（超軽量Vision）**

SmolVLM2。1.8Bという驚異的な小ささで画像認識が可能。1GBしか使わない。簡易OCRや画像分類向け。

- ファミリー: llama - 量子化: Q4_K_M（1.0GB） - 長所: 爆速・超軽量。最低限の画像認識 - 短所: 精度は低い。複雑な画像は無理

## 🪶 軽量・常駐モデル

**cron-4b**

Qwen 3 4Bベースのcronタスク用。ツール・思考対応。cronジョブの自動実行に最適な軽量さ。

- ファミリー: qwen3 - 量子化: Q4_K_M（2.3GB） - 長所: 軽い。思考対応。cron自動化向け - 短所: 4Bの限界。深い会話は無理

**cron-3b**

Llama 3.2 3Bベースの軽量cron用。ツール呼出可能。さらに軽い自動化向け。

- ファミリー: llama - 量子化: Q4_K_M（1.9GB） - 長所: 最軽量級のツール対応。常駐向け - 短所: 生成品質は最低限

**llama3.2:3b**

MetaのLlama 3.2 3B公式版。ツール呼出可能な最小限モデル。テスト・デバッグ用。

- ファミリー: llama - 量子化: Q4_K_M（1.9GB） - 長所: 安心のMeta公式。安定動作 - 短所: 3Bの限界。日本語はやや弱い

## ☁️ クラウド経由モデル

**kimi-k2.5:cloud（🌩️ 最大級）**

Moonshot AIのKimi K2.5。1兆パラメータ超の超大作。Ollamaクラウド経由でAPI呼出。vision・思考・ツール完備。

- パラメータ: 1T超 - 量子化: INT4 - 長所: 巨大モデルの知性。中国語・日本語最強クラス - 短所: クラウド依存。API制限あり。レイテンシあり

**qwen3.5:cloud（🌩️ 大規模）**

Alibaba Qwen 3.5 397B。Ollamaクラウド経由。vision・思考・ツール完備の巨大モデル。

- パラメータ: 397B - 量子化: BF16 - 長所: 高性能・全機能 - 短所: 劣らずクラウド依存

**glm-5:cloud（🌩️ 中国発）**

智譜AI GLM-5。思考・ツール対応。中国発の大規模モデル。

- ファミリー: glm5 - 量子化: FP8 - 長所: 中国圏の情報に強い - 短所: クラウド依存。日本語は未知数

## 🗺️ 使い分け早見表

用途 | 推奨モデル

🥇 **日常のデフォルト** | qwen3.6:35b-a3b

🔥 **無検閲・高品質** | qwen36-27b-uncensored-hauhaucs（Q8）

🔥 **無検閲・全機能** | huihui_ai/Qwen3.6-abliterated:27b

🔥 **無検閲・最強** | fredrezones55 Aggressive

🛠️ **ツール操作** | qwen36-toolhead

🐚 **Hermesエージェント** | hermes-head / sgemma-lightning

👁️ **画像解析** | qwen2.5vl:7b

⚡ **高速・軽量** | cron-4b / gemma4-uncensored

✍️ **創作・物語** | ornstein37

🌩️ **超大規模推論** | kimi-k2.5:cloud / qwen3.5:cloud

*🖖 Spock艦隊 4号機 M1 Max 64GB — 全20モデル運用中*

---
*この記事は note.com から KTBLOG に移行されました。元記事: https://note.com/famous_prawn2009/n/nb4c76077a189*