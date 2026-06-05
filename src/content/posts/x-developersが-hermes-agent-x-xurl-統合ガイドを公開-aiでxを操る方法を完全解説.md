---
title: "X Developersが「Hermes Agent x xurl」統合ガイドを公開！AIでXを操る方法を完全解説"
date: 2026-06-04
slug: x-developersが-hermes-agent-x-xurl-統合ガイドを公開-aiでxを操る方法を完全解説
category: "note.com"
eyecatch: "/assets/eyecatch/n5a049df7334e.jpg"
---

# X Developersが「Hermes Agent x xurl」統合ガイドを公開！AIでXを操る方法を完全解説

> 出典: note.com / 2026-05-21

![](https://assets.st-note.com/production/uploads/images/278141826/rectangle_large_type_2_70d007ba77b417a92bd318139603aec9.jpg)

X（旧Twitter）公式のデベロッパーアカウント @XDevelopers が、AIエージェント「Hermes Agent」と公式X API CLI「xurl」の統合ガイドを公開しました。これは「Hermesに自然言語で指示するだけでXの操作（投稿・検索・ブックマーク管理など）ができる」という、AI×SNS連携の決定版ガイドです。

この記事では、その内容を噛み砕いて日本語で解説します。AIエージェントに興味がある方、XのAPI操作を自動化したい方は必見です。

**Hermes Agent** は、Nous Researchが開発したオープンソースのAIエージェントです。ターミナルで動作し、自然言語で指示するだけで様々なタスクを自動化できます。

特徴：

✅ 完全オープンソース（GitHub公開）
  ✅ ターミナルベースで軽量動作
  ✅ スキルシステムで機能拡張可能
  ✅ 100以上の推論プロバイダに対応
  ✅ Telegram/Discordボットとしても運用可能

ワンライナーでインストール可能：

curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash

  
**xurl** は、Xデベロッパープラットフォームチーム公認の公式CLIツールです。X API v2の全機能をターミナルから操作できます。

主な機能：

📝 投稿・返信・引用・削除
  🔍 検索・タイムライン取得
  ❤️ いいね・リポスト・ブックマーク
  👥 フォロー・フォロワー管理
  📎 メディアアップロード対応
  💬 ダイレクトメッセージ
  🔓 OAuth 2.0 PKCE認証（自動トークンリフレッシュ）

インストール方法（4種類）：

# Shellスクリプト（推奨・簡単）
curl -fsSL https://raw.githubusercontent.com/xdevplatform/xurl/main/install.sh | bash

# Homebrew（macOS）
brew install --cask xdevplatform/tap/xurl

# npm
npm install -g @xdevplatform/xurl

## Step 1: Hermesのインストールと初期設定

インストール後、初回起動時にセットアップウィザードが起動します。

**プロバイダ選択**：xAI Grok OAuth（SuperGrok購読推奨）、またはOpenRouter等を選択
  **OAuth認証**：ブラウザが開くので、xAIアカウントでログインして承認
  **モデル選択**：利用可能なモデル一覧から好みのものを選択（例：grok-4.3）
  **メッセージング設定**：Telegram/Discord連携（オプション）

## Step 2: xurlのインストールとX API認証

**Xデベロッパーアプリの作成**
    
      [developer.x.com](https://developer.x.com/en/portal/dashboard) にアクセス
      新しいアプリを作成（または既存アプリを使用）
      User authentication settings で http://localhost:8080/callback をリダイレクトURIに設定
      Client ID と Client Secret をコピー
    
  
  **アプリの登録**
    xurl auth apps add my-app --client-id YOUR_CLIENT_ID --client-secret YOUR_CLIENT_SECRET
  
  **OAuth 2.0認証**
    xurl auth oauth2 --app my-app
    ⚠️ --app my-app を必ず付けてください。付けないと認証トークンが正しく保存されず、後でAPIコールが401エラーになります。

**デフォルトアプリ設定と確認**
    xurl auth default my-app
xurl auth status
xurl whoami

## Step 3: Hermesでxurlスキルを使う

Hermesを起動し、/xurl スキルをロードするだけ：

hermes
# チャット内で:
/xurl

あとは自然言語で指示するだけ！

「"Hello from Hermes" と投稿して」→ 自動で投稿
  「ブックマークを全部見せて」→ 一覧表示
  「@elonmusk のプロフィールを調べて」→ ユーザー情報取得
  「AIエージェントについて最近の投稿を検索して」→ 検索結果表示

  
筆者（Mr. Kato）の環境でも動作確認済み。本記事のX投稿もこの仕組みで行いました。

xurlの認証さえ通っていれば、Hermesが裏でAPIを叩いてくれるので、curlの面倒なヘッダー指定や認証周りを気にする必要がありません。

**Hermes Agent** + **xurl** の組み合わせで、X操作が完全にAIエージェント経由で可能に
  セットアップは15分程度（Xデベロッパーアプリの作成が少し面倒なだけで、あとはスムーズ）
  一度設定すれば、ターミナルから自然言語でXを操れる
  公式ガイドなので信頼性が高い

AIエージェントに興味がある方は、これを機にHermes Agentを試してみてはいかがでしょうか？

元記事：[@XDevelopers - X API + Hermes via xurl skill](https://x.com/XDevelopers/status/2056871280599847054)

---
*この記事は note.com から KTBLOG に移行されました。元記事: https://note.com/famous_prawn2009/n/n5a049df7334e*