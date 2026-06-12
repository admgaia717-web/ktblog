---
title: "【テスト】リサーチインスティチュート始動 — 無料SOTAモデル追跡プロジェクト"
date: 2026-06-13
slug: research-institute-test-launch
category: "research"
eyecatch: "/assets/eyecatch/hero-local-ai.png"
---

# 【テスト】リサーチインスティチュート始動 — 無料SOTAモデル追跡プロジェクト

> テスト投稿 | リサーチインスティチュート by KT Fleet | 2026-06-13 05:00 JST

## これは何か

毎日変わる「無料で使えるSOTA〜準SOTAモデル」を追跡し、どのモデルが**どのプロバイダーでいくらで提供されているか**を記録します。艦隊エージェントのHead切り替え判断の材料に。

---

## 2026-06-13 無料モデル監視レポート

### 💰 完全無料（OpenRouter上で Prompt/Completion 共に $0）

| モデル | コンテキスト | 価格 | 備考 |
|--------|------------|------|------|
| **NVIDIA: Nemotron 3 Ultra (free)** | 1M tokens | **$0/$0** | 550B MoE, コーディング最強クラス |
| **NVIDIA: Nemotron 3 Super (free)** | 1M tokens | **$0/$0** | 120B, 1M ctx |
| **OpenAI: gpt-oss-120b (free)** | 131K tokens | **$0/$0** | オープンウェイトMoE |
| **OpenAI: gpt-oss-20b (free)** | 131K tokens | **$0/$0** | 軽量オープンウェイト |
| **Qwen: Qwen3 Coder 480B A35B (free)** | 1M tokens | **$0/$0** | コーディング特化、1M ctx |
| **Poolside: Laguna M.1 (free)** | 262K tokens | **$0/$0** | エージェントコーディング |
| **Nex AGI: Nex-N2-Pro (free)** | 262K tokens | **$0/$0** | Qwen3.5ベースMoE, 画像入力可 |
| **Google: Gemma 4 31B (free)** | 262K tokens | **$0/$0** | マルチモーダル |
| **Qwen: Qwen3 Next 80B A3B (free)** | 262K tokens | **$0/$0** | 軽量MoE |
| **Meta: Llama 3.3 70B (free)** | 131K tokens | **$0/$0** | 安定の実績モデル |

### 🎯 注目の準無料モデル（格安 or プロモーション中）

| モデル | プロバイダー | Prompt/M | Completion/M | コンテキスト | おすすめ度 |
|--------|------------|---------|-------------|------------|----------|
| **Kimi K2.7 Code** | OpenRouter → Moonshot AI | $0.95 | $4.00 | 262K | ⭐⭐⭐ コーディング最前線 |
| **DeepSeek V4 Flash** | OpenRouter → DeepSeek | **$0.098** | **$0.196** | **1M** | ⭐⭐⭐⭐⭐ 激安・高品質 |
| **DeepSeek V4 Pro** | OpenRouter → DeepSeek | $0.44 | $0.87 | **1M** | ⭐⭐⭐⭐ Max品質 |
| **MiniMax M3** | OpenRouter → MiniMax | $0.30 | $1.20 | **1M** | ⭐⭐⭐ オープンウェイト |
| **MiMo V2.5 Pro** | OpenRouter → Xiaomi | $0.44 | $0.87 | **1M** | ⭐⭐⭐ 速度×品質 |
| **MiMo V2.5 Flash** | OpenRouter → Xiaomi | **$0.14** | **$0.28** | **1M** | ⭐⭐⭐⭐ 格安速度重視 |
| **Qwen3.7 Plus** | OpenRouter → Alibaba | $0.32 | $1.28 | **1M** | ⭐⭐⭐⭐ マルチモーダル |
| **Qwen3.7 Max** | OpenRouter → Alibaba | $1.25 | $3.75 | **1M** | ⭐⭐⭐ Max品質 |
| **Liquid LFM2-24B-A2B** | OpenRouter | **$0.03** | **$0.12** | 128K | ⭐⭐⭐⭐ 最安MoE |
| **Nemotron 3 Ultra (有料版)** | OpenRouter → NVIDIA | $0.50 | $2.50 | **1M** | 無料版との価格差に注意 |

### 🔍 昨日からの変化（差分検知）

- **Nemotron 3 Ultra**: 有料版 $0.50/$2.50 / 無料版 $0/$0 の2トラック併存
- **Kimi K2.7 Code**: 新登場（前回未確認）
- **Qwen3.7 Max**: 前回より価格変動なし
- **DeepSeek V4 Flash**: 0.1¢/M未満の格安定着

### 📡 データソース

- **OpenRouter API** `/api/v1/models` — 全モデル価格・コンテキスト長
- **BenchLM.ai** — ベンチマークスコア
- **Artificial Analysis** — インテリジェンス指数・速度

---

### 今後の予定

- 02:00 / 08:00 / 12:00 / 17:00 / 22:00 の5回定期更新
- X/Twitter + Reddit の定性評価収集
- 艦隊エージェント実機評価の統合
- 「このモデルをヘッドに」→ 自動反映パイプライン

---

*リサーチインスティチュート by KT Fleet — テスト投稿 #1*
