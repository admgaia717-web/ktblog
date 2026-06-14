---
title: "🏗️ 【2026-06-14】LLMプロバイダー比較 — プロバイダー比較大全"
date: 2026-06-14
slug: free-llm-20260614-providers
category: "AI・テクノロジー"
eyecatch: "/assets/eyecatch/hero-local-ai.png"
excerpt: "OpenRouter・Groq・NVIDIA NIM・GitHub Models… 無料LLMが使える全プロバイダを徹底比較。"
tags: ["LLM", "プロバイダー", "無料API", "OpenRouter", "日次更新"]
---

# 🏗️ リサーチインスティチュート — プロバイダー比較大全

> **2026-06-14 17:00 JST** · 毎日02・08・12・17・22時更新  
> プロバイダー別 無料枠・特徴を比較  
> データ元: 各プロバイダー公式サイト

---

## 🏪 7大プロバイダー比較

| プロバイダー | 無料モデル数 | レート制限 | APIキー | 特徴 |
|------------|------------|----------|---------|------|
| [OpenRouter](https://openrouter.ai/models?order=newest) | 26種（$0） | 20 req/min | 無料登録 | 最大の品揃え |
| [GitHub Models](https://github.com/marketplace/models) | 10+種 | 60-300 req/min | GitHub PAT | 高レート制限 |
| [Groq](https://console.groq.com/docs/models) | 5種 | 30 req/min | 要登録 | 超高速推論 |
| [NVIDIA NIM](https://build.nvidia.com/explore/discover) | 10+種 | 20 req/min | 要登録 | Nemotron専用 |
| [Together AI](https://api.together.ai/models) | 無料枠$1 | 要確認 | 要登録 | 種類豊富 |
| [HuggingFace](https://huggingface.co/inference-api) | 多数 | レート制限 | 不要 | コミュニティ主導 |
| [free-llm-api](https://github.com/coder-afk/free-llm-api-webwright) | 多数 | 不安定 | 不要 | 非公式 |

---

## 🎯 使い分けガイド

### こんな人は → このプロバイダー

| 目的 | おすすめ | 理由 |
|------|---------|------|
| とにかく種類が多い方がいい | [OpenRouter](https://openrouter.ai/models) | 337種、26種無料 |
| コード生成がしたい | [Qwen3 Coder](https://openrouter.ai/models/qwen/qwen3-coder:free) | 480B、1M ctx、無料 |
| 高速応答が欲しい | [Groq](https://console.groq.com/docs/models) | 最速推論エンジン |
| 長文処理（100万トークン） | [Nemotron Ultra](https://openrouter.ai/models/nvidia/nemotron-3-ultra-550b-a55b:free) | 1M ctx、無料 |
| GitHub連携したい | [GitHub Models](https://github.com/marketplace/models) | PATのみでOK |
| とにかく安く | [Ling-2.6-flash](https://openrouter.ai/models/inclusionai/ling-2.6-flash) | $0.01/M |
| 検閲なし | [Venice Uncensored](https://openrouter.ai/models/cognitivecomputations/dolphin-mistral-24b-venice-edition:free) | 無料・無修正 |

---

## 🔧 API設定例

```bash
# OpenRouter（推奨）
export OPENROUTER_API_KEY="sk-or-v1-..."
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "meta-llama/llama-3.3-70b-instruct:free",
        "messages": [{"role": "user", "content": "Hello"}]}'

# Groq
export GROQ_API_KEY="gsk_..."
curl https://api.groq.com/openai/v1/chat/completions \
  -H "Authorization: Bearer $GROQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "llama-3.3-70b-versatile",
        "messages": [{"role": "user", "content": "Hello"}]}'

# NVIDIA NIM
export NVIDIA_API_KEY="nvapi-..."
curl https://integrate.api.nvidia.com/v1/chat/completions \
  -H "Authorization: Bearer $NVIDIA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "nvidia/nemotron-3-ultra-550b-a55b:free",
        "messages": [{"role": "user", "content": "Hello"}]}'
```

---

> 🏢 **KT Fleet Research Institute** · 次回22:00: 本日総まとめ＆明日予告
