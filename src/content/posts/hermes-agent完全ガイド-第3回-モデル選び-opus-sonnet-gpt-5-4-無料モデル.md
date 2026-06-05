---
title: "Hermes Agent完全ガイド 第3回：モデル選び — Opus/Sonnet/GPT-5.4/無料モデル"
date: 2026-06-04
slug: hermes-agent完全ガイド-第3回-モデル選び-opus-sonnet-gpt-5-4-無料モデル
category: "note.com"
eyecatch: "/assets/eyecatch/n794f43fe5da1.png"
---

# Hermes Agent完全ガイド 第3回：モデル選び — Opus/Sonnet/GPT-5.4/無料モデル

> 出典: note.com / 2026-03-22

## あなたのAIエージェントの「脳」を選ぶ

Hermes Agentを使い始めて最初にぶつかる壁がある。

**「モデルは何を選べばいいんだ？」**

Claude Opus 4.6、Claude Sonnet 4.5、GPT-5.4、Gemini 3 Pro、DeepSeek、Qwen……。選択肢が多すぎる。しかもそれぞれ値段が違う。性能が違う。得意分野が違う。

この記事では、Hermes Agentで使えるモデルを全て解説し、「あなたの使い方なら、これを選べ」という具体的な指針を示す。机上の空論ではない。実際に4台のマシンで毎日Hermes Agentを運用している経験から書く。

## まず理解すべきこと：Hermes Agentは「モデル非依存」

ここがHermes Agentの最大の設計思想の一つだ。

実はOpenClawもClaude専用ではない。OpenAI、Gemini、Ollamaなど複数プロバイダーに対応している。ただし、OpenClawはClaude（特にSonnet）との親和性が最も高く設計されており、他モデルでの動作は限定的だ。

一方、Hermes Agentは設計の根幹から**マルチモデル対応**を前提にしている。Anthropic、OpenAI、Google、DeepSeek、Qwen、Kimi、MiniMax、さらにはOllamaで動かすローカルモデルまで。対応プロバイダーは20以上。

これが意味するのは：

・**最高性能が欲しいなら** → Claude Opus 4.6やGPT-5.4 Proを使える

・**コストを抑えたいなら** → 無料モデルや格安モデルに切り替えられる

・**オフラインで使いたいなら** → Ollamaでローカルモデルを動かせる

・**用途に応じて混在できる** → メインはOpus、サブタスクはSonnet、検索はGemini

OpenClawでも理論上はモデル切替が可能だが、Hermesほどシームレスではない。Hermesはconfig.yaml一行の変更で全プロバイダーに切り替えられ、補助タスクごとに別モデルを割り当てる機構まで備えている。

## 主要モデル一覧 — 2026年3月現在

Tier S：最高性能（月額$60〜$200の覚悟）

**Claude Opus 4.6**（Anthropic）

・Hermes Agentの「推奨モデル」。公式が一番上に置いている

・コーディング能力が圧倒的。複雑なマルチファイル編集、長いコンテキストでの整合性維持が得意

・200Kトークンのコンテキストウィンドウ

・弱点：高い。入力$15/100万トークン、出力$75/100万トークン。長時間セッションで数千円飛ぶこともある

・うちの運用：4号機（M1 Pro Max 64GB）のメイン頭脳。判断・指揮・分析専門

**GPT-5.4 Pro**（OpenAI）

・OpenAIの最上位。推論能力はOpusと互角かそれ以上の場面もある

・100万トークンのコンテキスト。Opusの5倍

・弱点：さらに高い。そしてOpenAIのAPI制限が厳しい

・うちの運用：特殊な推論タスクで使うことがある程度

Tier A：高性能・実用的（月額$10〜$60）

**Claude Sonnet 4.5 / 4.6**（Anthropic）

・Opusの弟分。性能はOpusの7〜8割だが、コストは約1/5

・入力$3/100万トークン、出力$15/100万トークン

・日常的なコーディング、文章作成、分析なら十分すぎる

・Hermes Agentの「サブエージェント」として最適。メインのOpusが指揮を取り、実作業をSonnetに委譲するパターン

**GPT-5.4**（OpenAI）

・バランス型。コーディングも推論もそこそこ強い

・100万トークンコンテキスト

・うちの運用：30日間の統計で3セッション、376万トークン消費。大量のデータ分析に使った

**Gemini 3 Pro / Flash**（Google）

・100万トークンのコンテキストが最大の武器

・長大なドキュメントを丸ごと読ませる用途に最適

・Flashは高速・低コスト。要約やデータ変換に向く

Tier B：コスパ重視（月額$0〜$10）

**Qwen 3.5 Plus**（Alibaba Cloud）

・中国発のモデルだが性能は侮れない

・Alibaba Cloudのコーディング定額プランなら月$10で使い放題

・うちの運用：補助タスク（圧縮、セッション検索、ビジョン分析）を全てQwenに回している。これでOpusのトークンを節約

**DeepSeek V3.2 / Chat**（DeepSeek）

・中国発。コーディング特化で評価が高い

・65Kトークンとコンテキストは狭いが、指示追従性が良い

・価格が非常に安い

**Claude Haiku 4.5**（Anthropic）

・Claudeファミリーの最軽量。高速・低コスト

・単純なタスク（ファイル検索、フォーマット変換、簡単な質問応答）に最適

・うちの運用：2セッション使用。軽い作業専用

Tier C：無料モデル（$0）

**Hunter Alpha / Healer Alpha**（OpenRouter提供）

・OpenRouterが提供する無料モデル

・性能はTier Sに遠く及ばないが、学習用・テスト用としては十分

・制限：レート制限あり、応答品質にばらつき

**Nemotron 3 Super 120B / Trinity Large**（NVIDIA / Arcee AI）

・OpenRouter経由で無料利用可能

・ローカルで動かすには巨大すぎるモデルを無料で試せる

**Ollamaローカルモデル**

・自分のマシンで動かすなら完全無料

・うちの4号機にはOllama経由で16モデル、合計350GBが常駐している

・弱点：M1 Pro Max 64GBでも大型モデルは遅い。推論品質もクラウドAPIには及ばない

・利点：オフライン動作、プライバシー完全確保、ランニングコスト¥0

## 設定方法 — config.yamlの書き方

Hermes Agentのモデル設定は ~/.hermes/config.yaml で行う。

メインモデルの設定：

hermes setup を実行すると対話形式で設定できる。もしくはconfig.yamlを直接編集する。

プロバイダーの設定は ~/.hermes/.env にAPIキーを書く：

ANTHROPIC_API_KEY=sk-ant-xxx

OPENAI_API_KEY=sk-xxx

GROQ_API_KEY=gsk_xxx

OpenRouterを使えば、1つのAPIキーで全モデルにアクセスできる：

OPENROUTER_API_KEY=sk-or-xxx

これがHermes Agentの「モデル非依存」を実現している仕組みだ。

## うちの実運用 — 4台の艦隊はこう使い分けている

ここからが本題だ。理論ではなく、実際の運用を見せる。

**4号機（オーベルシュタイン）— M1 Pro Max 64GB**

・メインモデル：Claude Opus 4.6（Anthropic直接）

・補助モデル：Kimi K2.5（圧縮・検索・ビジョン用）

・役割：判断・指揮・分析。最も高度なタスクを担当

・コスト戦略：Opusは高いので、単純作業はサブエージェントに委譲。自分は「考える」ことに専念

**1号機（ロデム）— M1 Air**

・メインモデル：定時X投稿（1日21本のcron）を担当

・役割：ソーシャルメディア運用の自動化

**2号機（DATA少佐）— 2019 Intel MBP**

・OpenClaw（Claude直接）で動作

・役割：暗号通貨・サイファーパンク関連

・Hermes Agentではなく、あえてOpenClawを使っている理由：この用途ではOpenClawのシンプルさが合う

**3号機（ラフォージ）— Mac mini M4**

・OpenClaw（Claude直接）で動作

・役割：会計コンサルSaaS開発

4台中2台がHermes Agent、2台がOpenClaw。これが現実だ。全てをHermesにする必要はない。タスクに合ったツールを選ぶ。

## 「補助モデル」という概念 — Hermesだけの武器

Hermes Agentには「auxiliary（補助）」という設定がある。これがコスト最適化の鍵だ。

config.yamlで以下のように設定する：

auxiliary:

compression:

model: kimi-k2.5

provider: custom

session_search:

model: kimi-k2.5

provider: custom

vision:

model: kimi-k2.5

provider: custom

これは何をしているかというと：

・コンテキスト圧縮（会話が長くなった時の要約）→ 安いモデルに任せる

・セッション検索（過去の会話を探す）→ 安いモデルに任せる

・画像認識（スクリーンショット分析など）→ 安いモデルに任せる

メインのOpusは「判断」だけに集中し、それ以外の雑務は安いモデルが処理する。人間の組織と同じだ。社長が経理もやっていたら会社は回らない。

OpenClawにも補助的なモデル活用の概念はあるが、Hermesほど体系的に「メインモデルと補助モデルを明確に分離する」設計にはなっていない。Hermesのauxiliary設定は、タスク種別ごとに別モデルを割り当てる粒度の細かさが特徴だ。

## モデル選びの判断フローチャート

迷ったらこの順番で考えろ：

予算は月いくらか？

・¥0 → Ollamaローカルモデル or OpenRouter無料モデル

・〜¥1,500 → Qwen 3.5 Plus（Alibaba定額）or DeepSeek

・〜¥5,000 → Claude Sonnet 4.5 + 補助モデルにQwen

・〜¥15,000 → Claude Opus 4.6 + 補助モデルにKimi/Qwen

・上限なし → GPT-5.4 Pro + Opus の二刀流

主な用途は？

・コーディング中心 → Claude Opus 4.6 が最強

・長文分析 → Gemini 3 Pro（100万トークン）

・チャットボット運用 → Sonnet 4.5 で十分

・学習・実験 → 無料モデルで始めてから上げていく

プライバシーは？

・クラウドに送りたくないデータがある → Ollamaローカルモデル一択

## OpenClawとの比較 — モデル選びの自由度

**項目:** 対応モデル / **Hermes Agent:** 50種以上 / **OpenClaw:** Claude/OpenAI/Gemini/Ollama等（Claudeが最適）

**項目:** プロバイダー / **Hermes Agent:** 20以上（Anthropic/OpenAI/Google/DeepSeek/Qwen/Kimi/MiniMax/Ollama他） / **OpenClaw:** 複数対応（Claudeとの親和性が最高）

**項目:** モデル切替 / **Hermes Agent:** config.yaml一行で全プロバイダー / **OpenClaw:** 設定変更で対応（Hermesほどシームレスではない）

**項目:** 補助モデル / **Hermes Agent:** あり（タスク種別ごとに別モデル割当可能） / **OpenClaw:** 限定的

**項目:** 無料モデル / **Hermes Agent:** あり（OpenRouter経由で複数） / **OpenClaw:** 限定的

**項目:** ローカルモデル / **Hermes Agent:** Ollama完全対応 / **OpenClaw:** Ollama対応あり

OpenClawの設計思想は「Claudeとの親和性を最大化する」だ。他モデルにも対応しているが、Claudeで使った時に最も力を発揮する。

Hermes Agentの設計思想は「どのモデルでも等しく動く」だ。20以上のプロバイダーを一級市民として扱い、補助タスクのモデル分離まで設計に組み込んでいる。

どちらが正解かは、あなたの状況次第だ。Claudeメインなら OpenClawの方がシンプルで良い場面もある。モデルの選択肢と柔軟性を重視するならHermesだ。

## 実際のコストを晒す

うちの直近30日間のHermes Agent統計：

・全セッション: 61回

・全メッセージ: 3,318通

・全ツール呼び出し: 1,359回

・全トークン: 4,252,286（入力: 4,219,824 / 出力: 32,462）

モデル別の内訳：

・GPT-5.4: 3セッション、3,762,147トークン

・Claude Opus 4.6: 25セッション、490,139トークン

・Qwen 3.5 Plus: 12セッション（補助タスク）

・Claude Haiku 4.5: 2セッション

注目すべきは、GPT-5.4がたった3セッションで376万トークンを消費していること。大量データ処理に使うとトークンが爆発する。日常運用はOpusの49万トークンで25セッション回している。

補助モデル（Kimi/Qwen）のおかげで、Opusの消費を最小限に抑えている。この「頭脳と手足の分離」がHermes Agentの運用コスト最適化の核心だ。

## まとめ：モデル選びは「予算×用途」の掛け算

・金に糸目をつけないなら、Claude Opus 4.6一択。Hermes Agentの全機能を最大限引き出せる

・コスパ重視なら、Sonnet 4.5 + Qwen補助の組み合わせが最強

・完全無料でも始められる。Ollamaかo OpenRouter無料モデルで「AIエージェントとは何か」を体感してから課金しても遅くない

・OpenClawも複数モデルに対応しているが、Hermesの強みは対応プロバイダーの広さと、補助モデルによるコスト分離の設計にある

次回はさらに深い話をする。「第4回：認証の真実 — OAuth/APIキー/setup-token」。Hermes Agentの認証システムは一見複雑に見えるが、理解すれば強力だ。そしてOpenClawのsetup-tokenとは根本的に違う。

---
*この記事は note.com から KTBLOG に移行されました。元記事: https://note.com/famous_prawn2009/n/n794f43fe5da1*