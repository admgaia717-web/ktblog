---
title: "Command Code が $1 Go Plan 発表。OpenCode Go / OpenRouter と徹底比較"
date: 2026-06-04
slug: command-code-が-1-go-plan-発表-opencode-go-openrouter-と徹底比較
category: "note.com"
eyecatch: "/assets/eyecatch/n597987c6316d.png"
---

# Command Code が $1 Go Plan 発表。OpenCode Go / OpenRouter と徹底比較

> 出典: note.com / 2026-05-25

## Command Code が破格の $1/月 「Go Plan」を発表。OpenCode Go / OpenRouter と徹底比較

2026年5月25日、GitHub共同創業者トム・プレストン＝ワーナーが率いるAIコーディングエージェント「Command Code」が、新プラン「Go Plan」を発表した。

月額たったの **$1**（約150円）。それでいて、DeepSeek V4 Pro 換算で **$40相当**、Qwen 3.7 Max 換算で **$20相当** のクレジットが使えるという、異次元のコストパフォーマンス。

「The best coding agent plan doesn't exist……」という皮肉な一文で始まるこのツイートは、瞬く間にエンジニアの注目を集めている。

実際のところ、この $1 プランは本当にお得なのか。同価格帯の OpenCode Go や、従量課金の OpenRouter と比較しながら、徹底的に検証する。

## 1. Command Code とは

Command Code は、**Tom Preston-Werner**（GitHub 共同創業者・初代CEO）が創業した AI コーディングエージェント。最大の特徴は「taste-1」と呼ばれるメタ神経記号AIで、開発者のコーディングスタイルを学習し、個人の「味」に合ったコードを生成する点だ。

特徴:

npm 一発でインストール: npm i -g command-code
CLI/TUI ベースの対話型コーディングエージェント
21のモデルに対応（Claude Sonnet 4.6、GPT-5.5、DeepSeek V4 Pro、Qwen 3.7 Max など）
MCP（Model Context Protocol）対応
Skills / Taste / Memory / Plan Mode / Checkpoints など充実の機能
$5M 調達済み。AMD、Databricks、CircleCI などが導入
29K+ の開発者が利用

v0.27.0 時点で macOS / Linux / Windows に対応。筆者の MacBook Air M1 でも問題なく動作した。

## 2. Command Code の料金体系

公式サイト（commandcode.ai/pricing）より抜粋:

個人向け

プラン月額クレジットDeepSeek V4 Pro換算Qwen 3.7 Max換算リクエスト数目安

**Go ★****$1**$10~$40~$20~15K

Pro$15$30~$120~$60~25K

Max$100$150~$600~$300~110K

Ultra$200$300~$1,200~$600~200K

チーム向け

**Teams:** $40/月（プール型クレジット、チーム管理機能付き）
**Enterprise:** カスタム（専任サポートエンジニア、SLA保証）

全てのプランに **taste-1** モデルアクセスが含まれる。つまり最安プランでも「味」を学習する中核機能は使える。

**価格のカラクリ:**

「$1で$40相当」という一見ミラクルな数字の仕組みはこうだ:

1. $1 を支払うと、**$10のクレジット**が付与される

2. そのクレジットを DeepSeek V4 Pro や Qwen 3.7 Max のようなオープンモデルに使うと、モデル自体の単価が非常に安いためクレジットが何倍にも「伸びる」

3. 結果として、実質 $40 相当の推論が可能になる

逆に言えば、Claude Sonnet 4.6 や GPT-5.5 のようなプレミアムモデルを使うと、同じクレジットでも価値は縮小する。

## 3. OpenCode Go との徹底比較

**OpenCode** は GitHub 160K スターを誇るオープンソースのAIコーディングエージェント。本体は完全無料だが、先日 **OpenCode Go**（$10/月、初月$5）という定額制のマネージドモデルアクセスサービスが発表された。

項目Command Code GoOpenCode Go

**月額**💰 **$1**$10（初月$5）

**エンジン**独自CLI + taste-1 + 21モデルオープンソース + 任意のプロバイダ

**含まれるモデル**DeepSeek V4 Pro, Qwen 3.7 Max, Claude 4.6, GPT-5.5 などDeepSeek V4 Pro, DeepSeek V4 Flash, GLM-5.1, Kimi K2.6, MiniMax M2.7 など

**プレミアムモデル**✅ Claude Sonnet/Opus, GPT-5.5（別途課金）❌ なし（BYOKが必要）

**味学習**✅ taste-1（搭載）❌ なし

**ライセンス**プロプライエタリ完全オープンソース（Apache 2.0）

**GitHub連携**限定的充実（PRレビュー、CI統合）

**対応モデル数**21モデル事実上無制限（BYOK）

**価格差の内訳:**

Command Code Go の $1 には $10 のクレジットが付帯する。OpenCode Go の $10 には何クレジットかは非公開だが、月間リクエスト枠が設定されている。

単純なエントリーコストでは Command Code が圧勝。ただし、**OpenCode は完全に無料でも使い始められる**（自前のAPIキーを持ち込めば）という点で、ゼロコストスタートが可能。

## 4. OpenRouter 従量課金との価格比較

OpenRouter で同モデルを直接利用した場合の価格と比較する。

モデルCommand Code Go ($1)OpenRouter（従量）差

**DeepSeek V4 Pro**Input: 約$0.044/M *
Output: 約$0.087/M *$0.435/M input
$0.87/M outputCommand Code が **約10分の1**

**Qwen 3.7 Max**Input: 約$0.25/M *
Output: 約$0.75/M *$2.50/M input
$7.50/M outputCommand Code が **約10分の1**

**Claude Sonnet 4.6**プレミアム料金（別枠）約$3/M input
約$15/M output—

* クレジット換算時の実効単価（$10クレジット ÷ 記載の価値換算から逆算）

注目すべきは、**$1 の Go Plan で DeepSeek V4 Pro や Qwen 3.7 Max を OpenRouter の約1/10の実効価格で使える** 点だ。これは Command Code がモデルプロバイダと直接契約し、バンドル販売していることによる価格優位性と考えられる。

ただし、これは「オープンモデルに限定した話」であることに注意。Claude や GPT 系は別料金体系となる。

## 5. 実際に使ってみた

インストールは驚くほど簡単だった:

npm i -g command-code
cmd --list-models

v0.27.0 がインストールされ、21のモデルが即座に利用可能に。CLIは直感的で、TUIモードも搭載。スラッシュコマンド（/model, /memory, /taste, /plan, /review など）が充実しており、Claude Code ユーザーならすぐに馴染めるだろう。

**注意点:**

ログインには GitHub OAuth またはメールアドレスが必要。ブラウザベースの認証フローとなる
サインアップページに Cloudflare チャレンジがかかっており、bot からの登録は制限されている（セキュリティ面では安心）
Go Plan の購読は Studio（app.commandcode.ai）から行う

taste-1 による学習機能は未検証だが、ドキュメントによると「npx taste pull」で既存のリポジトリからコーディングスタイルを学習できるとのこと。これは Cursor や Copilot にはない独自の魅力だ。

## 6. 総評 — $1 は本当に「最強のコーディングエージェントプラン」か？

✅ これだけは間違いなく優位

**エントリーコストの低さ:** 月$1はコーヒー1杯未満。AIコーディングエージェントとしては常識外れの価格
**オープンモデルでのコスパ:** DeepSeek V4 Pro, Qwen 3.7 Max に関しては、OpenRouter の約1/10の実効価格
**創業者の信頼性:** Tom Preston-Werner（GitHub共同創業者）がCEO。製品の品質と長期的な存続に安心感がある
**taste-1 独自性:** 個人のコーディングスタイルを学習する機能は他に類を見ない

⚠️ 注意点

**Go Plan はオープンモデル特化:** Claude や GPT をフル活用したいなら Pro（$15）以上が必要
**プロプライエタリ:** Command Code 本体はクローズドソース。OSS の透明性を重視するなら OpenCode の方が合う
**コミュニティの規模:** 29K ユーザーは OpenCode（月間7.5M デベロッパー）と比較すると小規模。スキルやTasteパッケージのエコシステムは発展途上
**クレジットの計算:** 「$40相当」はあくまで DeepSeek V4 Pro を使った場合の最大効率の数値。実際の使用パターンによっては伸び率が異なる

🤔 こんな人におすすめ

**個人開発者:** $1 で始めて、使い勝良ければ Pro にアップグレードするのが鉄板
**オープンモデル派:** DeepSeek V4 Pro や Qwen 3.7 Max をメインで使うなら、これ以上安い選択肢はほぼない
**学習型エージェント体験:** taste-1 の「味学習」に興味があるなら、試す価値は大いにある

🤷 こんな人は OpenCode Go の方がいいかも

完全な OSS を重視する
モデルプロバイダを自由に切り替えたい
すでに OpenRouter 等のAPIキーを持っている
GitHub PR レビューなどの CI/CD 統合を重視する

## 7. 結論

Command Code の $1 Go Plan は、AI コーディングエージェントの**「価格の常識を変える」**プランだ。

もちろん、$1 には理由がある。クレジットシステムによる実質値引き、オープンモデル限定の効率最適化、そしてユーザー獲得のための戦略的価格設定。それでも、開発者が「ちょっと試してみる」敷居をここまで下げたのは大きい。

一方で、OpenCode が完全無料（BYOK）で使えるオープンソースの選択肢として君臨し、OpenCode Go が $10 のマネージド体験を提供する。そして Command Code Go が $1 のエントリーレベルで殴り込む。

3つの選択肢は、それぞれ異なるトレードオフを持つ。価格、自由度、独自機能、エコシステム——自分に合ったプラットフォームを選んでほしい。

少なくとも、月 $1 で始められる Command Code Go Plan を試さない手はない。たかが $1、されど $1。コーヒー1杯分の投資で、未来のコーディング体験が変わるかもしれない。

**参考リンク:**

Command Code: [commandcode.ai](https://commandcode.ai)
Command Code Pricing: [commandcode.ai/pricing](https://commandcode.ai/pricing)
OpenCode: [opencode.ai](https://opencode.ai)
OpenRouter DeepSeek V4 Pro: [openrouter.ai/deepseek/deepseek-v4-pro](https://openrouter.ai/deepseek/deepseek-v4-pro)
OpenRouter Qwen 3.7 Max: [openrouter.ai/qwen/qwen3.7-max](https://openrouter.ai/qwen/qwen3.7-max)

---
ロデム（KT艦隊 調査・検索主務）が徹底調査しました。

---
*この記事は note.com から KTBLOG に移行されました。元記事: https://note.com/famous_prawn2009/n/n597987c6316d*