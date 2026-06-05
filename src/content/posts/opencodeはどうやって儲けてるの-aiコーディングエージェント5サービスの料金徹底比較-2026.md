---
title: "OpenCodeはどうやって儲けてるの？——AIコーディングエージェント5サービスの料金徹底比較 2026"
date: 2026-06-04
slug: opencodeはどうやって儲けてるの-aiコーディングエージェント5サービスの料金徹底比較-2026
category: "note.com"
eyecatch: "/assets/eyecatch/n4decca184d6e.png"
---

# OpenCodeはどうやって儲けてるの？——AIコーディングエージェント5サービスの料金徹底比較 2026

> 出典: note.com / 2026-05-03

# OpenCodeはどうやって儲けてるの？——AIコーディングエージェントの料金体系を徹底比較（2026年5月版）

> この記事は @amritwt 氏の投稿「how does opencode make money bro」（115K Views）の全リプライを翻訳・解説し、OpenCode / KiloCode / OpenRouter / Claude Code / Pi の料金比較を加えたものです。 > 元スレッド: https://x.com/amritwt/status/2050628794080440582

## きっかけ：OpenCodeってどうやって儲けてるの？

amrit氏の率直な疑問から始まったこのスレッド。115,000ビューを集め、OpenCodeの創業者や開発者までもがコメントに参加する展開に。

**開発者たちの反応**

**「ははははは、儲けてないよ」** — @ryanvogel（vogel）OpenCode関係者

**「存在を顕現させてるんだよ」** — @nkcbuilds

**「彼らはプロバイダと取り決めがあって、@opencodeを支援するためにコストを subsidize してる」** — @quantumaidev

**「文字通り MiniMax まで無料で提供してる」** — @srbcode

**「OpenCodeは命の恩人」** — @diddydesign

**「スポンサー収入と、OpenCode Go と Zen プランでの推論販売」** — @Divkix（最も的確な回答）

**「OpenAIやAnthropicには研究費・人材・高速推論など見えないコストが山ほどある。OpenCodeはずっとリーンだから、1ドルあたりでより多くを提供できる」** — @nazmulpcc

**最も詳しい解説（@rajpundkar）**

> OpenCodeのコアエージェントは100%無料・オープンソース（MIT）。自分のAPIキーを持ち込むか、既存サブスクリプションを使う。 > > 収益化は軽く： > 1. **Go**: $5（初月）→ $10/月で、OSSモデルをバンドル。寛大な利用制限つき。 > 2. **Zen**: 従量課金。モデル料金にゼロマークアップ。ボリュームをまとめてプロバイダと良いレートを交渉し、そのまま還元。 > 3. **Black（エンタープライズ）**: フラットレート。現在受付停止中。 > > 創業者たちはホスティング部分を「損益分岐点／戦略的」と捉えていて、ツールをオープンに保ちながら大規模採用（MAU 650万）を推進するフライホイールを回している。「儲けてない」という返信は半分ジョークで、利益最大化ではなくフライホイール維持が目的。

## 主要AIコーディングエージェント 料金比較表

**OpenCode（SST社）**

プラン | 料金 | 内容

**無料** | $0 | MITライセンス。BYOK。一部無料モデルあり。75以上のプロバイダ対応

**Go** | $5→$10/月 | 14種のOSSモデル（Kimi K2.5/2.6, GLM-5/5.1, Qwen3.5/3.6 Plus, MiniMax M2.5/2.7, DeepSeek V4 Pro/Flash, MiMo各種）。5時間$12分、月$60分の利用枠

**Zen** | $20単位の従量課金 | 30以上のモデルをゼロマークアップで提供。Claude Opus 4.7 $5/$25, Sonnet 4.6 $3/$15, GPT-5.5 $5/$30, Kimi K2.6 $0.95/$4.00 (1M tokens)

**Black** | $20/$100/$200/月 | 現在受付停止中。Claude/GPT/Geminiを含むフラットレート

**KiloCode（Kilo社）**

プラン | 料金 | 内容

**無料（OSS）** | $0 | MITライセンス。BYOK。VS Code/JetBrains/CLI対応。Ollama/LM Studioのローカルモデル対応

**Individual** | プラットフォーム無料 + Kilo Pass $19〜/月 | 500以上のAIモデルにアクセス。Autocomplete、Orchestrator/Architect/Code/Debugの4モード

**Teams** | $15/ユーザー/月 | 共有残高、利用分析、AI導入スコア、一元請求

**Enterprise** | カスタム | SSO/SAML、監査ログ、SLA、専用サポート

**Claude Code（Anthropic）**

プラン | 料金 | 内容

**Pro** | $20/月 | Claude Code込み。Sonnet 4.6 + Opus 4.7。小規模コードベース向け

**Max 5x** | $100/月 | 大規模コードベースの日常利用向け

**Max 20x** | $200/月 | ヘビーユーザー向け

**API** | トークン課金 | Sonnet 4.6: $3/$15 per 1M tokens。エンタープライズ平均$150-250/開発者/月

**Pi Coding Agent（Mario Zechner）**

プラン | 料金 | 内容

**無料（OSS）** | $0 | MITライセンス。4ツール（read/write/edit/bash）。型拡張可能

**BYOK** | APIキー費用のみ | Anthropic/OpenAI/Google/xAI/Groq/OpenRouter/Ollama他20プロバイダ対応

**サブスク連携** | 各社サブスク料金 | Claude Pro/Max、ChatGPT Plus/Pro、GitHub CopilotのOAuth認証で既存サブスクを利用可能

**OpenRouter（APIアグリゲーター）**

項目 | 詳細

**料金体系** | プロバイダ価格をそのままパススルー。クレジット購入時に**5.5%手数料**

**モデル数** | 623以上のモデル

**Claude Sonnet 4.6** | $3.17/$15.83 per 1M tokens（実質+5.5%）

**GPT-5** | $1.25/$10.00 per 1M tokens

**利点** | 1つのAPIキーで全モデルにアクセス。自動フォールバック。

## 💰 コスト実感比較：月どのくらいかかる？

**ライトユーザー（月50万トークン、1日数回の相談）**

サービス | 月額目安

OpenCode Go | **$10**（固定）

OpenCode Zen（Sonnet 4.6） | ~$9

KiloCode Individual + Pass | ~$19〜

Claude Code Pro | **$20**（固定）

Pi + Claude API | ~$9

OpenRouter + Sonnet 4.6 | ~$10

**ミドルユーザー（月500万トークン、毎日ヘビーに使う）**

サービス | 月額目安

OpenCode Go | **$10**（枠内なら）

OpenCode Zen（Kimi K2.6） | ~$25

OpenCode Zen（Sonnet 4.6） | ~$90

KiloCode Teams + 使用料 | ~$50〜100

Claude Code Max 5x | **$100**（固定）

Pi + Claude API | ~$90

OpenRouter + Sonnet 4.6 | ~$95

**ヘビーユーザー（月2000万トークン、エージェント常時稼働）**

サービス | 月額目安

OpenCode Go | 枠超え→Zenへ

OpenCode Zen（Kimi K2.6） | ~$100

OpenCode Zen（Sonnet 4.6） | ~$360

Claude Code Max 20x | **$200**（固定）

Pi + Claude API | ~$360

Pi + OpenRouter無料モデル | **ほぼ$0**

## 🔍 ポイント解説

**OpenCodeはなぜ無料でやっていけるのか**

1. **超リーン運営** — OpenAIやAnthropicと違い、自社でLLMの研究開発をしていない。基礎研究コストゼロ。 2. **プロバイダとの戦略的提携** — MiniMax、GLM、Kimiなどの中国系プロバイダがOpenCodeを通じて西側開発者のシェアを獲得したい。無料枠はそのマーケティング投資。 3. **Zenで損益分岐点** — ゼロマークアップの従量課金だが、大量のボリュームをまとめてプロバイダと有利なレート交渉。差分が運営費に。 4. **650万MAUのフライホイール** — 無料で開発者を囲い込み、Go/Zen/Blackへ自然なアップセル。Black（エンタープライズ）が本命。

**OpenRouterの盲点**

OpenRouterは5.5%のクレジット手数料を取る。月$1,000使うと年$660の「通行料」。プロバイダ直契約+PiやOpenCodeのBYOKで回避できる。

**Piの隠れた強み**

- 全プロバイダのBYOK + 20種類のサブスクリプションOAuth対応

- Claude Pro/Max、ChatGPT Plus/Pro、GitHub Copilotの「既存サブスク」をそのまま流用可能

- 実質的な追加コストゼロで最高級モデルを使える

- MITライセンスで完全に自前運用可能。検閲も制限もゼロ

**結局どれを選ぶべきか**

あなたの状況 | おすすめ

たまに使う、無料で済ませたい | Pi + BYOK（無料モデル）+ OpenCode無料枠

毎日使う、固定費で安心したい | OpenCode Go（$10/月）or Claude Code Pro（$20/月）

最高品質、コスパ重視 | Pi + Claude Proサブスク（$20/月）を流用

チームで使う | KiloCode Teams or Claude Code Team

とにかく一番安く | Pi + OpenRouter無料モデル + Ollamaローカル

プライバシー最優先 | Pi + OllamaローカルLLM（完全無料）

## 📌 スレッドの名言集

> *「儲けてないよ、ははははは」* — @ryanvogel

> *「OpenAIやAnthropicには見えないコストが山ほどある。OpenCodeはリーン。それが全部の違い」* — @nazmulpcc

> *「OpenCodeのコアは無料・OSS（MIT）。収益化は軽く。GoとZen。利益最大化ではなくフライホイールを回すのが目的」* — @rajpundkar

> *「OpenCodeに払うのは、OpenRouterに払うより効率的。彼らはベンダーとして推論優先権を持ってるから」* — @charliegreenman

> *「マジで無料で使わせてくれて寛大すぎる。喜んで払うよ」* — @jasoki

## 筆者（KT）の考え

このスレッドを見て思ったこと：

OpenCodeのビジネスモデルは「無料で囲って、必要な人だけ有料プランへ」という古典的なSaaSのフライホイールだ。だが、他と決定的に違うのは**コアが完全にOSS（MIT）である**こと。

つまり、OpenCodeが仮に明日消えても、コードは残る。誰でもフォークできる。Piも同じくMITだ。

これが「サブスクリプション資本主義」への本当の対抗手段だと思う。プロプライエタリなAIに毎月課金し続けるのではなく、OSSのエージェントを自分のAPIキーで動かす。あるいはローカルLLMで完全自走する。

月$10〜20で最高のAIコーディングができる時代。しかも、ちゃんと選べば一円も大手プラットフォームに搾取されない。

それが2026年の現実だ。

*本記事は @amritwt 氏のスレッドおよび全リプライ参加者にリスペクトを込めて構成しました。元スレッド: https://x.com/amritwt/status/2050628794080440582*

---
*この記事は note.com から KTBLOG に移行されました。元記事: https://note.com/famous_prawn2009/n/n4decca184d6e*