---
title: "【徹底解説】2026年6月 無料・格安LLM完全ガイド — 使える場所と価格を全網羅"
date: 2026-06-13
slug: free-llm-guide-2026-june
category: "AI・テクノロジー"
eyecatch: "/assets/eyecatch/hero-local-ai.png"
excerpt: "OpenRouter・GitHub Models・Groq・NVIDIA NIM… 無料で使えるLLMがどこにあるのか、モデルごとにプロバイダーと価格を完全マッピング。実際のAPIエンドポイント付き。"
tags: ["LLM", "無料AI", "OpenRouter", "エージェント", "リサーチ"]
---

# 【徹底解説】2026年6月 無料・格安LLM完全ガイド

> リサーチインスティチュート by KT Fleet  
> 2026-06-13 | 毎日02・08・12・17・22時に自動更新

---

## 📡 本記事の目的

「このモデル、どこで無料で使えるの？」  
「無料って書いてあるけど、どのAPIにどうリクエスト送ればいいの？」

このギャップを埋めるのが本記事の目的です。  
モデル名だけでなく **「どのプロバイダーのどのエンドポイントでいくらか」** を網羅的にマッピングします。

---

## ① 完全無料モデル一覧（OpenRouter $0 ルート）

OpenRouter 上で Prompt・Completion 共に**完全無料（$0）**の23モデル。  
すべて `:free` サフィックスでアクセス可能。

| モデル | パラメータ | コンテキスト | 得意分野 | APIモデルID |
|--------|-----------|------------|---------|------------|
| **Nemotron 3 Ultra** | 550B MoE | 1M tokens | 総合力最強クラス | [`nvidia/nemotron-3-ultra-550b-a55b:free`](https://openrouter.ai/models/nvidia/nemotron-3-ultra-550b-a55b:free) |
| **Nemotron 3 Super** | 120B MoE | 1M tokens | 軽量で高性能 | [`nvidia/nemotron-3-super-120b-a12b:free`](https://openrouter.ai/models/nvidia/nemotron-3-super-120b-a12b:free) |
| **gpt-oss-120b** | 120B MoE | 131K tokens | オープンウェイトMoE | [`openai/gpt-oss-120b:free`](https://openrouter.ai/models/openai/gpt-oss-120b:free) |
| **Qwen3 Coder 480B** | 480B MoE | **1M tokens** | コーディング特化 | [`qwen/qwen3-coder:free`](https://openrouter.ai/models/qwen/qwen3-coder:free) |
| **Gemma 4 31B** | 31B dense | 262K tokens | マルチモーダル | [`google/gemma-4-31b-it:free`](https://openrouter.ai/models/google/gemma-4-31b-it:free) |
| **Gemma 4 26B A4B** | 26B MoE | 262K tokens | 軽量MoE | [`google/gemma-4-26b-a4b-it:free`](https://openrouter.ai/models/google/gemma-4-26b-a4b-it:free) |
| **Qwen3 Next 80B** | 80B A3B | 262K tokens | 軽量思考 | [`qwen/qwen3-next-80b-a3b-instruct:free`](https://openrouter.ai/models/qwen/qwen3-next-80b-a3b-instruct:free) |
| **Laguna M.1** | 非公開 | 262K tokens | エージェント特化 | [`poolside/laguna-m.1:free`](https://openrouter.ai/models/poolside/laguna-m.1:free) |
| **Nex-N2-Pro** | 非公開 MoE | 262K tokens | 画像入力可 | [`nex-agi/nex-n2-pro:free`](https://openrouter.ai/models/nex-agi/nex-n2-pro:free) |
| **Llama 3.3 70B** | 70B dense | 131K tokens | 安定の定番 | [`meta-llama/llama-3.3-70b-instruct:free`](https://openrouter.ai/models/meta-llama/llama-3.3-70b-instruct:free) |
| **Hermes 3 405B** | 405B dense | 131K tokens | 最大級コンテキスト | [`nousresearch/hermes-3-llama-3.1-405b:free`](https://openrouter.ai/models/nousresearch/hermes-3-llama-3.1-405b:free) |

> 🔗 **OpenRouter 全無料モデル一覧**: [openrouter.ai/models?q=free](https://openrouter.ai/models?q=free)  
> 🔗 **OpenRouter Free Router** (200K ctx, 良モデルを自動ルーティング): [`openrouter/free`](https://openrouter.ai/models/openrouter/free)

### 使い方（curl）

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -d '{
    "model": "nvidia/nemotron-3-ultra-550b-a55b:free",
    "messages": [{"role": "user", "content": "こんにちは"}]
  }'
```

> 💡 **Tips**: `$OPENROUTER_API_KEY` は [OpenRouter Keys](https://openrouter.ai/keys) から無料で発行可能。クレカ不要。

---

## ② 格安激安モデル一覧

完全無料ではないが、**1クエリあたり0.01円未満**で使える驚異的なコスパモデル。

| モデル | パラメータ | コンテキスト | Prompt $/M | Completion $/M | 1M tokあたり |
|--------|-----------|------------|-----------|---------------|-------------|
| **DeepSeek V4 Flash** | 非公開 MoE | **1M** | **$0.098** | **$0.196** | **¥0.03/回** |
| **MiMo V2.5** | 非公開 | **1M** | **$0.14** | **$0.28** | **¥0.04/回** |
| **Qwen3.5 Flash** | 非公開 | **1M** | **$0.065** | **$0.26** | **¥0.03/回** |
| **LFM2-24B-A2B** | 24B A2B | 128K | **$0.03** | **$0.12** | **¥0.01/回** |
| **Nemotron 3 Nano** | 30B A3B | 262K | **$0.05** | **$0.20** | **¥0.02/回** |
| **DeepSeek V4 Pro** | 非公開 MoE | **1M** | $0.44 | $0.87 | ¥0.10/回 |
| **MiMo V2.5 Pro** | 非公開 | **1M** | $0.44 | $0.87 | ¥0.10/回 |
| **MiniMax M3** | 非公開 MoE | **1M** | $0.30 | $1.20 | ¥0.12/回 |
| **Qwen3.6 Flash** | 非公開 | **1M** | $0.19 | $1.13 | ¥0.10/回 |
| **Qwen3.7 Plus** | 非公開 | **1M** | $0.32 | $1.28 | ¥0.12/回 |
| **Kimi K2.7 Code** | 非公開 | 262K | $0.95 | $4.00 | ¥0.37/回 |

> 🔗 **全モデルの価格比較**: [openrouter.ai/models?order=newest](https://openrouter.ai/models)  
> 🔗 **BenchLM.ai ベンチマーク**: [benchlm.ai](https://benchlm.ai) — 257モデル×237ベンチマークの詳細スコア  
> 🔗 **Artificial Analysis 知能指数**: [artificialanalysis.ai](https://artificialanalysis.ai) — 速度・価格・知能の3軸比較

---

## ③ プロバイダー別無料枠ガイド

### OpenRouter

| 項目 | 内容 |
|------|------|
| 無料モデル数 | **23モデル**（2026-06-13時点） |
| アクセス方法 | API Key 無料発行、`:free` サフィックス |
| レート制限 | 中程度（Free Routerで緩和可能） |
| 登録 | メールアドレスのみ（クレカ不要） |
| 🔗 | [openrouter.ai](https://openrouter.ai) / [Keys発行](https://openrouter.ai/keys) |

### GitHub Models

| 項目 | 内容 |
|------|------|
| 無料枠 | 主要モデルを無料プレイグラウンド + API |
| アクセス方法 | GitHub Token + GH Models endpoint |
| レート制限 | 1日あたり制限あり |
| 注意 | GitHubアカウント必須 |
| 🔗 | [GitHub Marketplace Models](https://github.com/marketplace/models) |

### Groq

| 項目 | 内容 |
|------|------|
| 強み | **LPU超高速推論**（10,000 tok/s以上） |
| 無料モデル | Llama 3, Mixtral, Gemma 等 |
| アクセス方法 | OpenAI互換API |
| レート制限 | RPM制限あり（実用十分） |
| 🔗 | [console.groq.com](https://console.groq.com) |

### NVIDIA NIM

| 項目 | 内容 |
|------|------|
| 無料モデル | Nemotron 3 シリーズ中心 |
| アクセス方法 | API Key 発行 |
| 強み | 1Mコンテキストをフル活用可能 |
| 🔗 | [build.nvidia.com](https://build.nvidia.com/explore/discover) |

### Together AI

| 項目 | 内容 |
|------|------|
| 無料枠 | 新規登録で$1クレジット + 一部無料モデル |
| 強み | オープンソースモデル充実 |
| 🔗 | [together.ai](https://together.ai) |

### HuggingFace Inference API

| 項目 | 内容 |
|------|------|
| 無料枠 | コミュニティモデルを無料推論 |
| アクセス方法 | API Token |
| 制限 | 有料モデルは従量課金 |
| 🔗 | [huggingface.co/inference-api](https://huggingface.co/inference-api) |

---

## ④ モデル選定フローチャート

```
まず試す → OpenRouter Free Router
  ↓
無料で十分？
  ├── Yes → Nemotron 3 Ultra / gpt-oss-120b / Qwen3 Coder
  └── No → 次の条件
      ↓
コスパ最優先？
  ├── Yes → DeepSeek V4 Flash ($0.098/M)
  └── No → 次の条件
      ↓
品質重視？
  ├── Kimi K2.7 Code → コーディング最強
  ├── DeepSeek V4 Pro → 汎用最高品質
  ├── MiniMax M3 → オープンウェイト
  └── Qwen3.7 Plus → マルチモーダル
      ↓
速度重視？
  └── Groq (Llama 3 70B) → LPU爆速
```

---

## ⑤ 艦隊エージェント実機評価（エージェントリーチ）

> ⏳ **準備中**

今週中に以下の評価を実施し結果を公開：

- 各モデルを Lightning / Mr.Kato / Jarvis / Codex に割り当てて実機テスト
- 日本語精度・コーディング能力・マルチターン持続性・速度実測
- ツール使用（function calling）精度

---

## ⑥ データソース一覧

| ソース | 種類 | URL |
|--------|------|-----|
| OpenRouter API | モデル価格・一覧 | [openrouter.ai/api/v1/models](https://openrouter.ai/api/v1/models) |
| BenchLM.ai | ベンチマークスコア | [benchlm.ai](https://benchlm.ai) |
| Artificial Analysis | 知能指数・速度・価格 | [artificialanalysis.ai](https://artificialanalysis.ai) |
| Vellum | タスク別ランキング | [vellum.ai](https://vellum.ai) |
| LiveBench | 汚染フリー評価 | [livebench.ai](https://livebench.ai) |
| LMSYS Arena | Eloレーティング | [lmarena.ai](https://lmarena.ai) |
| HuggingFace Daily Papers | 新モデルトレンド | [huggingface.co/papers](https://huggingface.co/papers) |

---

## 更新履歴

| 日時 | 内容 |
|------|------|
| 2026-06-13 05:00 JST | 初版公開（テスト#2） |

---

*リサーチインスティチュート by KT Fleet*  
*毎日02:00 / 08:00 / 12:00 / 17:00 / 22:00 自動更新*
