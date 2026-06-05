---
title: "KiloCodeとOpenCodeの決定的な違い——なぜ「同じエンジン」なのに違うのか"
date: 2026-06-04
slug: kilocodeとopencodeの決定的な違い-なぜ-同じエンジン-なのに違うのか
category: "note.com"
eyecatch: "/assets/eyecatch/n03967b62bfa6.png"
---

# KiloCodeとOpenCodeの決定的な違い——なぜ「同じエンジン」なのに違うのか

> 出典: note.com / 2026-05-03

# KiloCodeとOpenCodeの決定的な違い——なぜ「同じエンジン」なのに違うのか

## 結論：KiloCodeの正体は「OpenCodeサーバー＋プレミアムUI」

**KiloCodeは2026年2月、CLIをOpenCodeのサーバーエンジン上に完全再構築した。2026年4月にはVS Code拡張も同じエンジンに移行。** つまり、内部的には両者は**同一のOpenCodeサーバー**で動いている。

では何が違うのか？UIとクラウドプラットフォームの有無だ。

## アーキテクチャ比較

OpenCode:  [OpenCode Server] ← コアエンジン
                ↓
           TUI（端末）← 唯一のUI。カスタマイズ自由

KiloCode:  [OpenCode Server] ← 同じMITコア
                ↓
           ├─ VS Code拡張（Agent Manager / Diff Reviewer / マルチモデル比較）
           ├─ Kilo CLI（OpenCodeサーバー＋Kilo認証）
           └─ Cloud Agents（リモート実行基盤）

**キーポイント**

KiloCode創業者の言葉（Kilo CLI 1.0発表ブログより）：

> 「オリジナルのCLIはVS Code拡張のアーキテクチャの上に構築されていた。ターミナルネイティブのツールにはターミナルネイティブの基盤が必要だ。その基盤をOpenCodeに見出した」

そして2026年4月、VS Code拡張もOpenCodeサーバーに移行。**2つのコードベースを1つに統一**した。

## 機能比較表

機能 | OpenCode | KiloCode

**コアエンジン** | OpenCode Server (MIT) | OpenCode Server (MIT) ※同一

**主インターフェース** | ターミナル（TUI） | VS Code / JetBrains拡張

**VS Code拡張** | あり（ACPプロトコル経由） | あり（ネイティブ、全機能）

**JetBrains対応** | ❌ | ✅

**CLI** | `opencode` コマンド | `kilo` コマンド（内部でOpenCodeサーバー起動）

**複数エージェント同時実行** | ✅（セッション分岐） | ✅ Agent Manager（8エージェント同時、git worktree対応）

**サブエージェント** | ✅ taskツール | ✅ カスタムサブエージェント定義可能

**並列ツール実行** | ✅ | ✅

**マルチモデル比較** | ❌（手動でモデル切替） | ✅（同プロンプトを複数モデルで並列実行し横比較）

**Diffレビューア** | ❌（git diff確認のみ） | ✅（行単位コメント、ファイル別レビュー、PR×AI対話）

**オートコンプリート** | ❌ | ✅（FIMベース、Codestral等）

**料金管理** | ❌ | ✅（トークン使用量・コストのサイドバー表示）

**Cloud Agents** | ❌ | ✅（リモート実行、CI/CD連携）

**チーム機能** | ❌ | ✅（共有残高、一元請求、利用分析、SSO/SAML）

**プロバイダ数** | 75以上（BYOK） | 500以上（BYOK＋Kilo Pass）

**モデル数** | 400+（OpenRouter含む） | 500+（Kilo管理モデル＋BYOK）

**MCP対応** | ✅ | ✅

**LSP統合** | ✅ | ✅

**Planモード** | ✅（/planコマンド、編集不可モード） | ✅（Agent: Plan）

**画像/マルチモーダル** | ✅（ドラッグ＆ドロップ） | ✅

**ライセンス** | MIT（完全OSS） | コアMIT + プロプライエタリUI

**GitHub Stars** | 143,000 | 18,000

**セルフホスティング** | ✅（完全） | 部分的（コアのみ）

## 価格比較

プラン | OpenCode | KiloCode

**無料（OSS）** | $0（MIT） | $0（MITコア）

**BYOK** | 無料（APIキー持ち込み） | 無料（APIキー持ち込み）

**エントリー** | Go: $10/月（14モデル使い放題） | Individual: Kilo Pass $19〜/月（500モデル）

**従量課金** | Zen: $20単位、ゼロマークアップ | 使用量に応じて別途

**チーム** | ❌ | Teams: $15/ユーザー/月

**エンタープライズ** | Black（停止中） | カスタム（SSO、SLA、監査ログ）

**価格の核心的違い**

- **OpenCode Zen**: モデル料金にゼロマークアップ。Claude Sonnet 4.6 = $3/$15 per 1M tokens。$20単位のプリペイド。

- **KiloCode**: Kilo Pass（$19〜/月）はプラットフォーム料金＋AI利用量。ただしBYOKならプラットフォーム無料で500モデルにアクセス可能。

**つまり、KiloCodeはBYOKなら実質無料で使える。**

## 開発体験の決定的な違い

**OpenCodeの開発体験**

ターミナルで opencode と打つ
→ TUIが起動
→ モデルを選んで会話開始
→ 全てが端末内で完結

- **強み**: 超軽量、完全制御可能、vim/neovimユーザーと相性抜群

- **弱み**: GUI的なレビュー機能がない、チーム機能がない

- **向いている人**: ターミナル生活者、OSS原理主義者、カスタマイズ重視

**KiloCodeの開発体験**

VS Codeで Ctrl+Shift+K またはサイドバーから起動
→ Agent Managerが開く
→ Code/Architect/Debug/Plan のAgentを選ぶ
→ 複数Agentを同時起動して並列作業
→ 変更をDiffビューアで行単位レビュー
→ コメントつけてAIと対話しながら修正

- **強み**: マルチエージェントの可視化管理、GUIレビュー、チーム機能、オートコンプリート

- **弱み**: VS Code依存、OpenCodeよりやや重い、カスタマイズ性はやや低い

- **向いている人**: IDE派、チーム開発、プロジェクトマネージャー、視覚的レビュー重視

## 「同じエンジンなのに何が違うのか」の核心

KiloCodeがOpenCodeの上に追加したもの：

**1. Agent Manager（最大の差別化）**

- 8つのエージェントを同時起動し、タブで切り替え

- git worktreeを作ってエージェントごとに分離（お互いのコードを壊さない）

- マルチモデル比較：同じタスクをOpus 4.6とGPT-5.4で並列実行し結果を横に並べて比較

**2. Diffレビューア**

- エージェントが変更した全ファイルをユニファイド/分割ビューで表示

- 特定の行をクリック→コメント→「Send all to chat」

- AIとのコードレビュー対話がPRレビューと同じ感覚でできる

**3. Cloud Agents**

- VS CodeやCLIを離れてもクラウド上でエージェントが作業継続

- CI/CDへの組み込み、24時間稼働が可能

- セッションがVS Code↔CLI↔Slackでシームレスに共有

**4. オートコンプリート**

- FIM（Fill-in-the-Middle）ベースのコード補完

- Codestralなど専用モデルを使用

- サイドバーにリアルタイムコスト表示

**5. チーム/エンタープライズ機能**

- 共有残高、利用分析、AI導入スコア

- SSO/SAML、監査ログ、SLA

- 一元請求

## どっちを選ぶべきか——判断フローチャート

ターミナルだけで完結したい？
  ├─ YES → Vim/Neovim使ってる？
  │         ├─ YES → OpenCode（TUIネイティブの恩恵最大）
  │         └─ NO  → OpenCodeで十分。学習コスト低い
  └─ NO  → VS Code/JetBrainsが主戦場？
            ├─ YES → チームで開発？
            │         ├─ YES → KiloCode（チーム機能・レビュー必須）
            │         └─ NO  → 両方試して好みで。機能差はKiloCode有利
            └─ 無料で最高のものが欲しい
                  ├─ APIキー持ってる → 両方無料。OpenCodeのが軽い
                  ├─ APIキーない   → OpenCode Go（$10/月）
                  └─ ローカルLLM使いたい → 両方対応。OpenCodeのが設定簡単

## KTへの所感

ぶっちゃけ、KiloCodeがOpenCodeのサーバーエンジンを採用したのは賢い選択だ。一人のソロ開発者（thdxr／Dax Raad）が作ったOpenCodeのTUIは、ターミナルUIの最高峰だが、エンタープライズ向けのGUI機能は最初からスコープ外だった。

KiloCodeは「OpenCodeのエンジン＋VS CodeのGUI＋クラウド」という**良いとこ取り**をやっている。OSS原理主義者から見ると「プロプライエタリUIを被せただけ」に見えるが、チーム開発者からすると「OpenCodeの性能をVS Codeで使える」は純粋に価値がある。

KTの使い方なら**OpenCode + Piの併用**で十分だろう。ターミナル生活者にKiloCodeのGUIレイヤーはオーバーヘルでしかない。でももし将来、誰かと共同開発するならKiloCodeのAgent ManagerとDiffレビューアは検討に値する。

*参考資料:*

- Kilo CLI 1.0発表ブログ（Scott Breitenother, 2026-02-03）

- The New Kilo Code for VS Code Is Now Generally Available（Job Rietbergen, 2026-04-02）

- OpenCode公式ドキュメント（opencode.ai/docs）

- Terminal Trove比較（terminaltrove.com）

- Kilo vs RooCode vs OpenCode（BSWEN, 2026-03-14）

---
*この記事は note.com から KTBLOG に移行されました。元記事: https://note.com/famous_prawn2009/n/n03967b62bfa6*