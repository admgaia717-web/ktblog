---
title: "🔬 【2026-06-14】モデル深掘り — 実力検証"
date: 2026-06-14
slug: free-llm-20260614-deepdive
category: "AI・テクノロジー"
eyecatch: "/assets/eyecatch/hero-local-ai.png"
excerpt: "本日ピックアップ3モデルの詳細スペック・コンテキスト・価格体系・リンクを徹底比較。"
tags: ["LLM", "モデル比較", "OpenRouter", "深掘り", "日次更新"]
---

# 🔬 リサーチインスティチュート — モデル深掘り

> **2026-06-14 12:00 JST** · 毎日02・08・12・17・22時更新  
> 特定モデルの性能・ベンチマーク評価  
> データ元: [OpenRouter API](https://openrouter.ai/models)

---

## 🎯 本日のピックアップモデル

### NVIDIA: Nemotron 3.5 Content Safety (free)

| 項目 | 値 |
|------|-----|
| モデルID | `nvidia/nemotron-3.5-content-safety:free` |
| コンテキスト長 | 128,000 tokens |
| 価格 | **無料** ($0) |
| モダリティ | text+image->text |
| Tokenizer | Other |
| リンク | [OpenRouter](https://openrouter.ai/models/nvidia/nemotron-3.5-content-safety:free) |

> NVIDIA Nemotron 3.5 Content Safety is a compact 4B-parameter multimodal guardrail model from NVIDIA, fine-tuned from Google Gemma-3-4B. It moderates both inputs to and responses from LLMs and VLMs, accepting...

### OpenAI: gpt-oss-20b (free)

| 項目 | 値 |
|------|-----|
| モデルID | `openai/gpt-oss-20b:free` |
| コンテキスト長 | 131,072 tokens |
| 価格 | **無料** ($0) |
| モダリティ | text->text |
| Tokenizer | GPT |
| リンク | [OpenRouter](https://openrouter.ai/models/openai/gpt-oss-20b:free) |

> gpt-oss-20b is an open-weight 21B parameter model released by OpenAI under the Apache 2.0 license. It uses a Mixture-of-Experts (MoE) architecture with 3.6B active parameters per forward pass, optimized for...

### Owl Alpha

| 項目 | 値 |
|------|-----|
| モデルID | `openrouter/owl-alpha` |
| コンテキスト長 | 1,048,756 tokens |
| 価格 | **無料** ($0) |
| モダリティ | text->text |
| Tokenizer | Other |
| リンク | [OpenRouter](https://openrouter.ai/models/openrouter/owl-alpha) |

> Owl Alpha is a high-performance foundation model designed for agentic workloads. Natively supports tool use, and long-context tasks, with strong performance in code generation, automated workflows, and complex instruction execution....


---

## ⚖️ 3モデル比較

| モデル | コンテキスト | 用途 |
|--------|------------|------|
| [NVIDIA: Nemotron 3.5 Content Safety (free)](https://openrouter.ai/models/nvidia/nemotron-3.5-content-safety:free) | 128,000 | チャット・軽量タスク |
| [OpenAI: gpt-oss-20b (free)](https://openrouter.ai/models/openai/gpt-oss-20b:free) | 131,072 | チャット・軽量タスク |
| [Owl Alpha](https://openrouter.ai/models/openrouter/owl-alpha) | 1,048,756 | 長文分析・RAG・コード生成 |

---

## 🔗 その他注目モデル

- [Nemotron 3 Ultra (550B, 1M ctx)](https://openrouter.ai/models/nvidia/nemotron-3-ultra-550b-a55b:free) — 最大級の無料モデル
- [Hermes 3 405B (131K ctx)](https://openrouter.ai/models/nousresearch/hermes-3-llama-3.1-405b:free) — Nous Research謹製
- [Qwen3 Coder 480B (1M ctx)](https://openrouter.ai/models/qwen/qwen3-coder:free) — コード最適化
- [Qwen3 Next 80B (262K ctx)](https://openrouter.ai/models/qwen/qwen3-next-80b-a3b-instruct:free) — 最新アーキテクチャ
- [Nemotron 3 Super (120B, 1M ctx)](https://openrouter.ai/models/nvidia/nemotron-3-super-120b-a12b:free) — バランス型

---

> 🏢 **KT Fleet Research Institute** · 次回17:00: プロバイダー比較大全
