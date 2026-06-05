---
title: "Hermes Agent完全ガイド 第4回：認証の仕組み — APIキーと.envファイルの全貌"
date: 2026-06-04
slug: hermes-agent完全ガイド-第4回-認証の仕組み-apiキーと-envファイルの全貌
category: "note.com"
eyecatch: "/assets/eyecatch/ncb03e791f853.png"
---

# Hermes Agent完全ガイド 第4回：認証の仕組み — APIキーと.envファイルの全貌

> 出典: note.com / 2026-03-23

## AIエージェントの「鍵束」

Hermes Agentは自分では何も考えない。Claude、GPT、Geminiといった外部のAIモデルに問い合わせて回答を得る。Web検索もBrowserbaseやFirecrawlといった外部サービスを使う。

つまり、エージェントが動くためには「外部サービスにアクセスする鍵」が必要だ。APIキーである。

この回では、Hermes Agentの認証の仕組みを解剖する。どこに鍵を置くのか、どう読み込まれるのか、セキュリティはどうなっているのか。

## 2つの設定ファイル

Hermes Agentの設定は2つのファイルに分かれている。

~/.hermes/config.yaml — 動作設定。使うモデル、ツールの有効/無効、表示オプションなど。

~/.hermes/.env — APIキーとシークレット。外部サービスの認証情報だけをここに集約する。

なぜ分けるのか。config.yamlはGitで共有したり、他の人に見せたりしても問題ない。だが.envにはAPIキーが入っている。これを誤ってGitにpushしたら、APIキーが全世界に公開される。ファイルを分けることで、.envだけを.gitignoreに入れれば事故を防げる。

## .envファイルの中身

.envファイルの形式はシンプルだ。1行1変数。

ANTHROPIC_API_KEY=***

OPENAI_API_KEY=***

GOOGLE_API_KEY=***

TELEGRAM_BOT_TOKEN=700000...xxxx

BROWSERBASE_API_KEY=***

これだけだ。特別なフォーマットはない。シェルの環境変数と同じ KEY=VALUE 形式。

## セットアップウィザード

初回起動時、hermes setup を実行するとウィザードが走る。

ウィザードはカテゴリごとにAPIキーの入力を促す。

プロバイダー系 — Anthropic、OpenAI、Google、Groqなど。最低1つは必要。これがないとモデルに問い合わせできない。

ツール系 — Browserbase（ブラウザ自動操作）、Firecrawl（Web抽出）など。なくても動くが、使えるツールが減る。

メッセージング系 — Telegram Bot Token、Discord Bot Tokenなど。ゲートウェイ（メッセージング接続）を使うなら必要。

入力されたキーは ~/.hermes/.env に書き込まれる。ファイルのパーミッションは自動的に600（オーナーのみ読み書き可）に設定される。

## 認証の解決順序

Hermes Agentはモデルに問い合わせる時、以下の順序でAPIキーを探す。

第一に、環境変数。ターミナルで export ANTHROPIC_API_KEY=*** と設定していれば、それが使われる。

第二に、~/.hermes/.env ファイル。起動時に読み込まれる。

第三に、プロバイダー固有の認証ファイル。一部のプロバイダー（Google Cloudなど）は独自の認証ファイルを参照する。

環境変数が最優先なので、一時的に別のキーを使いたい場合は環境変数で上書きできる。本番用のキーを.envに置き、テスト用のキーを環境変数で渡す、という使い方ができる。

## config.yamlの主要設定

config.yamlはYAML形式で、主要な設定項目はこうだ。

model — メインで使うモデル。例えば anthropic/claude-sonnet-4-20250514 と書く。プロバイダー名/モデル名の形式。

auxiliary_model — セッション検索の要約やコンテキスト圧縮に使う安価なモデル。Gemini Flashなどを指定するとコストを抑えられる。

summary_model — 会話終了時の要約に使うモデル。

toolsets — 有効にするツールセットの一覧。

display.reasoning — 思考過程を表示するかどうか。trueにするとモデルの内部推論が見える。デバッグ時に便利。

terminal.backend — ターミナルの実行環境。local、docker、sshなどを選べる。

config.yamlが存在しない場合、または空の場合はデフォルト値で動作する。うちの4号機のconfig.yamlは0バイトだ。全てデフォルト値で動いている。

## マルチプロバイダー対応

Hermes AgentはOpenAI互換のAPIインターフェースを採用している。つまり、OpenAIのAPI形式に対応しているプロバイダーなら何でも使える。

Anthropic（Claude）、OpenAI（GPT）、Google（Gemini）、Groq、DeepSeek、Alibaba Cloud（Qwen）、ローカルのOllama。全て同じインターフェースで接続する。

プロバイダーを切り替えるにはモデル名を変えるだけだ。config.yamlの model を anthropic/claude-opus-4-6 から openai/gpt-5.4 に変えれば、次の起動からGPTで動く。

複数のプロバイダーのAPIキーを同時に.envに置ける。メインモデルはClaude、補助モデルはGemini Flash、という組み合わせもできる。

## Telegramボットの認証

Telegram接続には、BotFatherで作成したBot Tokenが必要だ。

TELEGRAM_BOT_TOKEN=700000...xxxx

これを.envに書くだけで、hermes gateway run を実行すればTelegramボットとして接続される。

さらに、TELEGRAM_ALLOWED_USERS で応答するユーザーを制限できる。設定しないと、誰がメッセージを送っても応答してしまう。自分のTelegram IDだけを許可リストに入れるのが基本だ。

## セキュリティの実装

Hermes Agentは認証情報の保護にいくつかの仕組みを持っている。

第一に、ファイルパーミッション。.envファイルは作成時に自動的にchmod 600される。オーナー以外は読めない。~/.hermesディレクトリ自体もchmod 700で保護される。

第二に、メモリへの書き込み制限。エージェントがmemoryツールでAPIキーを保存しようとした場合、セキュリティスキャンで検出・ブロックされる。APIキーが会話ログやメモリファイルに残らないようになっている。

第三に、スキルのセキュリティスキャン。エージェントが作成するスキル（SKILL.md）にAPIキーの外部送信コードが含まれていれば、作成をブロックする。

## 実運用の教訓

3つ挙げる。

第一に、.envは絶対にGitに入れるな。~/.hermes/.gitignore に .env を追加しろ。これは初日にやれ。

第二に、APIキーは定期的にローテーションしろ。特にBot Tokenは漏洩すると誰でもあなたのボットとしてメッセージを送れる。月1回の更新を推奨する。

第三に、auxiliary_modelを必ず設定しろ。デフォルトではメインモデルがセッション要約やコンテキスト圧縮にも使われる。Opusの料金で要約を生成するのは無駄だ。安価なモデルを指定するだけで、月のAPIコストが大きく変わる。

## まとめ

・設定は config.yaml（動作設定）と .env（APIキー）の2ファイルに分離

・hermes setup でウィザードが走り、対話形式でキーを入力

・認証解決は 環境変数 → .env → プロバイダー固有の順

・マルチプロバイダー対応。モデル名を変えるだけで切り替え可能

・ファイルパーミッション、メモリスキャン、スキルスキャンの3層でセキュリティを確保

・auxiliary_modelの設定はコスト削減に直結する

次回は「第5回：Telegram接続と運用 — AIエージェントをポケットに入れる」。スマホからAIエージェントと会話する環境の構築手順を解説する。

---
*この記事は note.com から KTBLOG に移行されました。元記事: https://note.com/famous_prawn2009/n/ncb03e791f853*