---
title: "OpenRouter Pareto Code — AIモデル選びの「コスパ革命」"
date: 2026-06-04
slug: openrouter-pareto-code-aiモデル選びの-コスパ革命
category: "note.com"
eyecatch: "/assets/eyecatch/n4e120b2227ad.png"
---

# OpenRouter Pareto Code — AIモデル選びの「コスパ革命」

> 出典: note.com / 2026-05-10

## モデル選択、もう悩まなくていい

「どのモデル使えばいい？」

AIエージェントを運用していると、毎回この問いにぶつかる。GPT-5.5は強いけど高い。DeepSeek V4 Flashは安いけど弱い。その中間のkimi-k2.6はどうか。毎回ベンチマークを見比べて、手動で選んでいた。

OpenRouterが発表した**Pareto Code**は、この悩みを一発で解決する。

## Pareto Codeとは

仕組みはシンプル。**`min_coding_score` を一つ指定するだけ。**

```json

{

"model": "openrouter/pareto-code",

"plugins": [{

"id": "pareto-router",

"min_coding_score": 0.8

}]

}

```

あとはOpenRouterが「その品質を満たす最安モデル」を自動選択する。ランキングはArtificial Analysisのベンチマークに基づき、リアルタイム更新される。

## 実際に試した

3段階のスコアでテスト。結果はこうなった。

| score | 選ばれたモデル | コスト（109 token） |

|-------|-------------|-------------------|

| 0.2 | DeepSeek V4 Flash | $0.000009 |

| 0.5 | GPT-5.4 Mini | $0.000057 |

| 0.8 | DeepSeek V4 Pro | $0.000037 |

スコア0.2と0.8では選ばれるモデルが違い、コストも最大6倍の差がつく。でも0.2でも動くタスク（簡単なFizzBuzz等）ならFlashで十分。

## 3段階ティア構造

Pareto Codeは内部的に3つのティアを持つ。

| ティア | スコア | モデル例 |

|--------|--------|---------|

| High | ≥0.66 | GPT-5.5, Gemini 3.1 Pro, Claude Opus 4.7, DeepSeek V4 Pro |

| Medium | 0.33〜0.66 | GPT-5.4 Mini, Claude Sonnet 4.6, kimi-k2.6, Grok 4.3 |

| Low | <0.33 | Mimo V2.5 Pro, Qwen3.6 Max, GLM-5.1, DeepSeek V4 Flash |

ティア内では常に**最安モデル**が選ばれる。もしそのモデルが落ちていても、隣のティアにフォールバックするから安心。

## 対応状況

- ✅ **OpenRouter API** — 直接使える（curl / SDK）

- ✅ **Hermes Agent** — Proxy経由で統合済（min_coding_score: 0.5）

- ✅ **OpenCode Studio** — 設定から選択可能

- 🆓 **無料** — ルーター自体に手数料なし。モデル利用料のみ

## 艦隊での運用

筆者の「艦隊」（AIエージェント群）ではこう使い分けている。

- **重い実装・設計**: score 0.8（DeepSeek V4 Pro）

- **記事執筆・翻訳**: score 0.5（GPT-5.4 Mini）

- **定型タスク・バッチ**: score 0.2（DeepSeek V4 Flash）

これでAIコストが劇的に最適化された。月額$20で4エージェントを運用できるレベル。

## まとめ

Pareto Codeは「過剰品質に金を払わない」ためのルーター。

コードを書く度に「どのモデルがベストか」を悩む必要はもうない。`min_coding_score` 一つで、常に最適なコスパのモデルが選ばれる。

AIエージェント運用者には必須のインフラだ。

---
*この記事は note.com から KTBLOG に移行されました。元記事: https://note.com/famous_prawn2009/n/n4e120b2227ad*