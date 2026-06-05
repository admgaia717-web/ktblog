---
title: "Hermes Agent完全ガイド 第5回：Telegram接続と運用 — AIエージェントをポケットに入れる"
date: 2026-06-04
slug: hermes-agent完全ガイド-第5回-telegram接続と運用-aiエージェントをポケットに入れる
category: "note.com"
eyecatch: "/assets/eyecatch/nbcd50491718d.png"
---

# Hermes Agent完全ガイド 第5回：Telegram接続と運用 — AIエージェントをポケットに入れる

> 出典: note.com / 2026-03-22

## なぜTelegramなのか

AIエージェントは、ターミナルの前に座っている時だけ使えるものではない。

買い物中に「あのファイルどうなった？」と聞きたい。電車の中で「サーバーの状態を確認して」と頼みたい。布団の中からスマホで「明日のタスクを整理して」と指示したい。

Hermes Agentはそれができる。**Telegramをフロントエンドにして、どこからでもAIエージェントと会話できる**。

これが「メッセージングゲートウェイ」という仕組みだ。Telegram以外にもDiscord、Slack、WhatsApp、Signalに対応しているが、今回はTelegramに絞って解説する。うちが毎日使っているのがTelegramだからだ。

## セットアップ — 3ステップで完了

Step 1: Telegram Botを作る

Telegramで「@BotFather」に話しかける。

「/newbot」と送ると、botの名前とユーザー名を聞かれる。適当に決めると、**Bot Token**が発行される。「646338...」のような長い文字列だ。これがbotの認証キーになる。

所要時間：2分。

Step 2: .envに設定を書く

Hermes Agentの設定ファイル ~/.hermes/.env に3行追加する。

TELEGRAM_BOT_TOKEN=（BotFa...ークン）

TELEGRAM_ALLOWED_USERS=（あなたのTelegram ID）

TELEGRAM_HOME_CHANNEL=（あなたのTelegram ID）

**TELEGRAM_ALLOWED_USERS** が重要だ。これを設定しないと、世界中の誰でもあなたのAIエージェントに話しかけられてしまう。APIトークンが溶ける。

自分のTelegram IDの調べ方：Telegramで「@userinfobot」に話しかけると、自分のIDが返ってくる。数字の羅列だ。

Step 3: ゲートウェイを起動する

hermes gateway run

これだけだ。ターミナルにログが流れ始め、Telegramのbotが応答し始める。

スマホでbotに「こんにちは」と送ってみろ。返事が来たら成功だ。

## 実運用で知っておくべき7つのこと

セットアップは簡単だ。だが実運用で躓くポイントがいくつかある。うちが3ヶ月運用して学んだことを共有する。

1. ゲートウェイは落ちる

これが最大の問題だ。hermes gateway runはただのPythonプロセスだ。何かの拍子に落ちる。ネットワーク障害、APIタイムアウト、メモリ不足。理由は様々だ。

対策は**LaunchAgent**（macOS）または**systemd**（Linux）で自動再起動を設定すること。うちのmacOSでの設定例：

~/Library/LaunchAgents/com.hermes.gateway.plist

このファイルにKeepAliveをtrueに設定しておけば、落ちても自動で再起動する。詳細は第8回「落ちる問題と対策」で解説する。

2. 許可ユーザーの設定は命綱

TELEGRAM_ALLOWED_USERS は絶対に設定しろ。

うちの設定：

TELEGRAM_ALLOWED_USERS=5753177929

複数人を許可したい場合はカンマ区切りだ。

もしくは TELEGRAM_ALLOW_ALL_USERS=true にすると全員許可になるが、これはグループチャットで使う場合や、botを公開サービスにする場合だけにしろ。普段は特定ユーザーだけに制限すべきだ。

3. スラッシュコマンドが使える

Telegramのbot UIには、スラッシュコマンドが統合されている。主要なコマンド：

「/new」 — 新しい会話を始める。コンテキストをリセットしたい時に使う

「/status」 — エージェントの状態を確認する

「/model」 — 使用中のモデルを確認・変更する

「/compact」 — コンテキストを圧縮する。会話が長くなって動作が重くなった時に

これらはTelegramのコマンドメニューにも表示される。BotFatherで「/setcommands」を使って登録しておくとユーザー体験が良くなる。

4. 音声メッセージに対応している

Telegramの音声メッセージ（ボイスメモ）を送ると、Hermes Agentが文字起こしして処理する。逆に、エージェントの返答を音声で受け取ることもできる。

config.yamlのTTS設定：

tts:

provider: edge

edge:

voice: ja-JP-NanamiNeural

edgeプロバイダーなら無料だ。日本語の音声で返答が返ってくる。ElevenLabsを使えばより自然な音声になるが、有料だ。

5. ファイルの送受信ができる

Telegramでファイルを送ると、Hermes Agentがそのファイルを受け取って処理できる。画像を送れば画像認識で分析する。テキストファイルを送れば内容を読んで処理する。

逆にエージェントからファイルを送ることもできる。生成したコードや画像、音声ファイルをTelegramに直接送信する。

6. グループチャットでも使える

個人DMだけでなく、Telegramのグループチャットにbotを追加して使うこともできる。

うちの運用例：「鶴舞AI開発部」というグループを作り、開発メンバーとAIエージェントが同じチャットにいる。メンバーがbotにメンションすると応答する。

グループで使う場合の注意点：

・botの「Group Privacy」設定をBotFatherでオフにする必要がある場合がある

・TELEGRAM_ALLOW_ALL_USERS=true にするか、グループメンバー全員のIDをALLOWED_USERSに追加する

・メンション時のみ反応するように設定できる

7. cronジョブとの連携

Hermes Agentにはcronジョブ機能がある。定期的にタスクを実行し、結果をTelegramに通知する。

例：毎朝6時にサーバーの状態をチェックして、問題があればTelegramに報告する。

うちの運用では、金庫番（セキュリティチェック）が6時間ごとに実行され、結果がTelegramに届く。朝の定期メンテナンスジョブもある。何もしなくてもスマホに報告が来る。

## OpenClawとの比較 — メッセージングの思想の違い

OpenClawもTelegramに対応している。これは事実だ。

だが思想が異なる。

OpenClawのTelegram対応は、基本的にはCLIの延長としてのチャットインターフェースだ。テキストを送って、テキストが返ってくる。

Hermes Agentのゲートウェイは**マルチプラットフォームハブ**として設計されている。Telegram、Discord、Slack、WhatsApp、Signal、Home Assistantまで、同一の会話をどのプラットフォームからでも続けられる。音声入出力、ファイル送受信、グループチャット、cronジョブ通知、バックグラウンドプロセスの進捗通知まで統合されている。

Hermesのゲートウェイが対応するプラットフォーム：

・Telegram

・Discord（音声チャンネルでのリアルタイム会話にも対応）

・Slack

・WhatsApp

・Signal

・Home Assistant

この6プラットフォーム対応は、単なるチャットボットではなく「どこからでもアクセスできるAIエージェント」という設計思想から来ている。

## 実際の運用風景 — うちの1日

朝、布団の中でスマホを見る。Telegramにオーベルシュタイン（4号機のAIエージェント）からの定期レポートが届いている。「金庫番ジョブ完了。異常なし」。

電車の中で「今日のタスクを整理して」と送る。エージェントが過去の会話を検索し、未完了のタスクをリストアップしてくれる。

カフェで作業中、ファイルの確認が必要になる。スマホからファイル名を指定すると、中身を要約して返してくれる。

夜、「明日のcronジョブを確認して」と送る。予定されたジョブの一覧が返ってくる。

これが全てスマホのTelegramだけで完結する。MacBookを開く必要がない。

## セットアップの落とし穴と対策

Bot Tokenの漏洩に注意

Bot Tokenが漏洩すると、誰でもあなたのbotとして振る舞える。.envファイルをGitにコミットするな。.gitignoreに必ず追加しろ。

Webhookとポーリング

Hermes Agentのデフォルトはポーリング方式（定期的にTelegramサーバーに問い合わせる）。Webhook方式も設定可能だが、VPSやNgrokが必要になる。家のMacで動かすならポーリングで十分だ。

長い応答が途切れる

Telegramには1メッセージ4096文字の制限がある。Hermes Agentは長い応答を自動的に分割して送信するが、まれにタイムアウトで途切れることがある。

対策：会話が長くなったら「/compact」でコンテキストを圧縮する。または「/new」で新しいセッションを始める。

## まとめ

・Telegram接続は3ステップ：BotFather→.env設定→gateway起動

・TELEGRAM_ALLOWED_USERSは必ず設定しろ

・LaunchAgentまたはsystemdで自動再起動を設定しろ

・音声・ファイル・グループチャット・cronジョブ通知まで対応

・スマホだけでAIエージェントの全機能にアクセスできる

次回は「第6回：メモリシステム — MEMORY.md/USER.md/セッション検索」。Hermes Agentが「忘れないAI」である仕組みを深掘りする。

---
*この記事は note.com から KTBLOG に移行されました。元記事: https://note.com/famous_prawn2009/n/nbcd50491718d*