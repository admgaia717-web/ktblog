---
title: "【完全版】NullClaw スラッシュコマンド パーフェクトマニュアル"
date: 2026-06-04
slug: 完全版-nullclaw-スラッシュコマンド-パーフェクトマニュアル
category: "note.com"
eyecatch: "/assets/eyecatch/ne36bd55b668c.png"
---

# 【完全版】NullClaw スラッシュコマンド パーフェクトマニュアル

> 出典: note.com / 2026-03-23

NullClawのスラッシュコマンドを全て網羅した日本語マニュアル。NullClawはOpenClawの軽量フォークで、基本コマンドはOpenClawとほぼ共通。ローカルLLM（Ollama）との組み合わせに最適化されている。

## セッション管理

/new — 新しいセッションを開始。モデル指定も可（例: /new kimi-k2.5）。/reset でも同じ

/restart — Gatewayを再起動する。モデル指定も可（例: /restart gpt-5.4）

/stop — 実行中のプロセスを全て停止

/compact — コンテキストを圧縮する。長い会話でトークンが膨らんだときに

/export — セッションをエクスポートする。/export-session でも同じ

## 情報表示

/help — 使えるコマンドの一覧

/commands — コマンド一覧（/help と同じ）

/status — チャンネルの接続状態やセッション情報を表示

/whoami — 自分のSender IDを表示。/id でも同じ。allowlist設定に必要

/context — コンテキストの内訳を表示

/usage — トークン使用量の表示制御（off / tokens / full / cost）

## モデル・思考制御

/model — モデルの表示・切り替え。/models でも同じ。/model で現在のモデル確認、/model kimi-k2.5 で切り替え

/think — 思考レベル設定。OpenClawと同じ

/verbose — デバッグ詳細表示（on / full / off）

/reasoning — 推論過程の表示制御（on / off / stream）

## メモリ管理（NullClaw独自）

NullClaw最大の特徴。AIの記憶を直接操作できる

/memory stats — メモリの統計情報を表示。何件のメモリがあるか、容量はどれくらいか

/memory status — メモリシステムの状態確認

/memory reindex — メモリの再インデックス。検索が遅くなったときやメモリファイルを手動編集した後に

/memory count — メモリの件数を表示

/memory search — メモリをキーワードで検索する（例: /memory search API設定）。過去に記録した情報を素早く引き出せる

/memory get — 特定のキーでメモリを取得する

/memory list — メモリの一覧表示。--category でカテゴリ、--limit で件数、--include-internal で内部メモリも表示

/memory drain-outbox — メモリの送信キューを消化する。メモリ同期で詰まったときの復旧用

## 実行制御

/elevated — 昇格権限モード。security と ask を設定できる

/exec — 実行設定の表示・変更。OpenClawと同じ

/approve — exec承認の解決

/bash — ホストシェル直接実行。/poll で出力確認

## サブエージェント管理

/subagents — サブエージェントの管理。list で一覧、kill で停止、info で詳細、spawn で新規起動

/subagents spawn — 新しいサブエージェントを起動。--agent でエージェント指定可（例: /subagents spawn --agent coder バグを修正して）

/kill — サブエージェント即停止。/kill all で全停止

/steer — 方向転換指示。/tell でも同じ

/agents — バインドされたエージェント一覧

## チャンネル・グループ

/dock-telegram — 返信先をTelegramに | /dock-discord — Discordに | /dock-slack — Slackに

/activation — グループでの起動条件（mention / always）

/send — AI返答の送信on/off

/focus — スレッドバインド | /unfocus — バインド解除

## 設定管理

/config — 設定の表示・編集。NullClawは2段階方式: set でプレビュー、apply で実際に適用。誤設定防止の安全機構

/config show — 全設定を表示

/config get — 特定キーの値を取得（例: /config get agents.defaults.model）

/config set — 変更をプレビュー（この時点ではまだ適用されない）

/config apply set — プレビューした変更を実際に適用する

/config unset — 削除をプレビュー

/config apply unset — 削除を実際に適用

/config validate — 設定ファイルの妥当性を検証。問題があれば警告してくれる

/debug — 一時的なオーバーライド。メモリ上のみ

/allowlist — 権限ユーザーの管理

## システム管理（NullClaw独自）

/doctor — システムの健康診断。設定ミス・接続エラー・モデル不整合を自動検出して報告する。トラブル時にまず打つコマンド

/capabilities — AIが現在使える機能（ツール・スキル・権限）の一覧を表示

/session ttl — セッションの生存時間を設定する。例: /session ttl 2h で2時間後にセッション自動終了。リソース管理に

/skill — スキルを名前で実行。/skills info で詳細確認

## 音声

/tts — テキスト読み上げ制御。OpenClawと同じ

/voice — 音声モードの切り替え

## キュー

/queue — メッセージキュー設定。OpenClawと同じ

## OpenClawとの主な違い

**/memory** — NullClaw最大の武器。AIの記憶をコマンドで直接検索・閲覧・管理できる。OpenClawにはない

**/doctor** — ワンコマンドで健康診断。OpenClawにはない（openclaw doctor はCLIのみ）

**/config apply** — 設定変更を2段階（プレビュー→適用）で行う安全設計。OpenClawは /config set で即適用

**/session ttl** — セッション自体の寿命を設定。OpenClawの /session idle/max-age はDiscordスレッド限定だがNullClawは全セッション対象

**/capabilities** — 今何が使えるかを一覧表示。OpenClawにはない

## 全コマンド早見表

セッション: /new /restart /stop /compact /export — 情報: /help /commands /status /whoami /context /usage — モデル: /model /think /verbose /reasoning — メモリ: /memory stats /memory search /memory get /memory list /memory reindex /memory count /memory drain-outbox — 実行: /elevated /exec /approve /bash — エージェント: /subagents /kill /steer /tell /agents — チャンネル: /dock-telegram /dock-discord /dock-slack /activation /send /focus /unfocus — 設定: /config /config apply /config validate /debug /allowlist — システム: /doctor /capabilities /session ttl /skill — 音声: /tts /voice — キュー: /queue

---
*この記事は note.com から KTBLOG に移行されました。元記事: https://note.com/famous_prawn2009/n/ne36bd55b668c*