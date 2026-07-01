---
title: "🔬 【2026-07-01】モデル深掘り — 実力検証"
date: 2026-07-01
slug: free-llm-20260701-deepdive
category: "AI・テクノロジー"
eyecatch: "/assets/eyecatch/hero-local-ai.png"
excerpt: "本日ピックアップ3モデルの詳細スペック・コンテキスト・価格体系・リンクを徹底比較。"
tags: ["LLM", "モデル比較", "OpenRouter", "深掘り", "日次更新"]
---

# 🔬 リサーチインスティチュート — モデル深掘り

> **2026-07-01 12:00 JST** · 毎日02・08・12・17・22時更新  
> 特定モデルの性能・ベンチマーク評価  
> データ元: [OpenRouter API](https://openrouter.ai/models)

---

## 🎯 本日のピックアップモデル

### Google: Gemma 4 31B (free)

| 項目 | 値 |
|------|-----|
| モデルID | `google/gemma-4-31b-it:free` |
| コンテキスト長 | 262,144 tokens |
| 価格 | **無料** ($0) |
| モダリティ | text+image+video->text |
| Tokenizer | Gemma |
| リンク | [OpenRouter](https://openrouter.ai/models/google/gemma-4-31b-it:free) |

> Gemma 4 31B Instruct is Google DeepMind's 30.7B dense multimodal model supporting text and image input with text output. Features a 256K token context window, configurable thinking/reasoning mode, native function...

### NVIDIA: Nemotron 3 Super (free)

| 項目 | 値 |
|------|-----|
| モデルID | `nvidia/nemotron-3-super-120b-a12b:free` |
| コンテキスト長 | 1,000,000 tokens |
| 価格 | **無料** ($0) |
| モダリティ | text->text |
| Tokenizer | Other |
| リンク | [OpenRouter](https://openrouter.ai/models/nvidia/nemotron-3-super-120b-a12b:free) |

> NVIDIA Nemotron 3 Super is a 120B-parameter open hybrid MoE model, activating just 12B parameters for maximum compute efficiency and accuracy in complex multi-agent applications. Built on a hybrid Mamba-Transformer...

### NVIDIA: Nemotron Nano 12B 2 VL (free)

| 項目 | 値 |
|------|-----|
| モデルID | `nvidia/nemotron-nano-12b-v2-vl:free` |
| コンテキスト長 | 128,000 tokens |
| 価格 | **無料** ($0) |
| モダリティ | text+image+video->text |
| Tokenizer | Other |
| リンク | [OpenRouter](https://openrouter.ai/models/nvidia/nemotron-nano-12b-v2-vl:free) |

> NVIDIA Nemotron Nano 2 VL is a 12-billion-parameter open multimodal reasoning model designed for video understanding and document intelligence. It introduces a hybrid Transformer-Mamba architecture, combining transformer-level accuracy with Mamba’s...


---

## ⚖️ 3モデル比較

| モデル | コンテキスト | 用途 |
|--------|------------|------|
| [Google: Gemma 4 31B (free)](https://openrouter.ai/models/google/gemma-4-31b-it:free) | 262,144 | 文書分析・エージェント |
| [NVIDIA: Nemotron 3 Super (free)](https://openrouter.ai/models/nvidia/nemotron-3-super-120b-a12b:free) | 1,000,000 | 長文分析・RAG・コード生成 |
| [NVIDIA: Nemotron Nano 12B 2 VL (free)](https://openrouter.ai/models/nvidia/nemotron-nano-12b-v2-vl:free) | 128,000 | チャット・軽量タスク |

---

## 🔗 その他注目モデル

- [Nemotron 3 Ultra (550B, 1M ctx)](https://openrouter.ai/models/nvidia/nemotron-3-ultra-550b-a55b:free) — 最大級の無料モデル
- [Hermes 3 405B (131K ctx)](https://openrouter.ai/models/nousresearch/hermes-3-llama-3.1-405b:free) — Nous Research謹製
- [Qwen3 Coder 480B (1M ctx)](https://openrouter.ai/models/qwen/qwen3-coder:free) — コード最適化
- [Qwen3 Next 80B (262K ctx)](https://openrouter.ai/models/qwen/qwen3-next-80b-a3b-instruct:free) — 最新アーキテクチャ
- [Nemotron 3 Super (120B, 1M ctx)](https://openrouter.ai/models/nvidia/nemotron-3-super-120b-a12b:free) — バランス型

---

> 🏢 **KT Fleet Research Institute** · 次回17:00: プロバイダー比較大全
