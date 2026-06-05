---
title: "【完全版】Hermes Agent スラッシュコマンド パーフェクトマニュアル"
date: 2026-06-04
slug: 完全版-hermes-agent-スラッシュコマンド-パーフェクトマニュアル
category: "note.com"
eyecatch: "/assets/eyecatch/n53e0a0b57e3b.png"
---

# 【完全版】Hermes Agent スラッシュコマンド パーフェクトマニュアル

> 出典: note.com / 2026-03-23

Hermes AgentのスラッシュコマンドをCLI専用・Gateway共通含めて全て網羅した日本語マニュアル。OpenClawと共通するコマンドも多いが、Hermes独自の強力な機能が多数ある。

## セッション管理

/new — 新しいセッションを開始。/reset でも同じ

/clear — 画面をクリアして新セッション開始（CLI専用）

/stop — 実行中のバックグラウンドプロセスを全て停止

/retry — 最後のメッセージをAIに再送信する。回答が微妙だったとき、もう一度やり直させる。同じ入力でも回答は毎回変わるので、気に入る答えが出るまでリトライできる

/undo — 直前のユーザー発言+AI回答のペアを丸ごと削除する。「さっきの質問なかったことに」。会話の流れをきれいに保ちたいときに

/title — セッションにタイトルを付ける（例: /title バグ修正作業）。後から /resume で名前で再開できる

/compress — 会話コンテキストを手動圧縮する。OpenClawの /compact に相当。長い会話でトークンが膨らんだときに

/rollback — ファイルシステムのチェックポイントを一覧・復元する。AIがファイルを壊したとき、変更前の状態に戻せる。番号指定で特定時点に復元可能。コーディング作業の安全網

/background — プロンプトをバックグラウンドで実行する。/bg でも同じ。時間がかかる処理を裏で走らせながら別の質問ができる。例: /bg このコードをリファクタリングして

/save — 現在の会話を保存する（CLI専用）。/resume で後から再開できる

/history — 会話履歴を表示する（CLI専用）

/resume — 以前に保存・名前付けしたセッションを再開する。例: /resume バグ修正作業

/status — セッション情報を表示する（Gateway専用）

/sethome — 現在のチャットをホームチャンネルに設定する。/set-home でも同じ。AIの「ホーム」として通知やステータスがここに送られる（Gateway専用）

## モデル・設定

/model — モデルの表示・切り替え。/model で現在のモデル、/model gpt-5.4 で切り替え

/provider — 利用可能なプロバイダー一覧と現在のプロバイダーを表示。どのAPI経由でAIを使っているか確認できる

/personality — AIの性格プリセットを切り替える。登録済みの人格（丁寧、簡潔、フレンドリー等）を選べる。例: /personality concise

/prompt — システムプロンプト（AIへの基本指示）を表示・変更する（CLI専用）。/prompt clear でリセット

/config — 現在の設定を表示（CLI専用）

/reasoning — 推論レベルの管理。none / low / minimal / medium / high / xhigh で深さ設定、show / hide で推論過程の表示切り替え。OpenClawより選択肢が多い

/verbose — ツール進行状況の表示レベルを切り替える: off → new → all → verbose の4段階（CLI専用）

/skin — 表示テーマを変更する（CLI専用）。ダーク、ライト等のスキンを切り替え

/statusbar — コンテキスト/モデルのステータスバー表示を切り替え（CLI専用）。/sb でも同じ

## ツール・スキル管理

/tools — ツールの一覧表示・有効化・無効化。特定のツールだけ使わせたくないときに。例: /tools disable browser で ブラウザツールを無効化（CLI専用）

/toolsets — 利用可能なツールセットの一覧（CLI専用）

/skills — スキルの検索・インストール・情報表示・管理。search でスキルストアから検索、browse で一覧閲覧、inspect で詳細確認、install でインストール（CLI専用）

/cron — スケジュールタスクの管理（CLI専用）。定期的にAIに作業させる。list で一覧、add で追加（例: /cron add "0 9 * * *" "今日の天気を教えて"）、pause で一時停止、resume で再開、run で即時実行、remove で削除

/reload-mcp — MCP（Model Context Protocol）サーバーの設定を再読み込みする。MCPサーバーの設定を変更した後に使う。/reload_mcp でも同じ

/browser — ChromeのDevToolsプロトコル経由でブラウザを接続する。connect で接続、disconnect で切断、status で状態確認（CLI専用）

/plugins — インストール済みプラグインの一覧と状態（CLI専用）

## 情報・分析

/help — 使えるコマンドの一覧

/usage — 現在のセッションのトークン使用量を表示

/insights — トークン使用量の分析・統計。日数指定可能（例: /insights 30 で30日分）。どのモデルにいくら使ったか、どの時間帯に多いか等を可視化

/platforms — Gateway/メッセージングプラットフォームの接続状態を表示（CLI専用）。/gateway でも同じ

/paste — クリップボードに画像があれば添付する（CLI専用）

/update — Hermes Agentを最新版にアップデートする（Gateway専用）

## 音声

/voice — 音声モードの切り替え。on で音声入出力有効化、off で無効化、tts でテキスト読み上げのみ、status で状態確認

## CLI専用 vs Gateway共通

**CLI専用（ターミナルでのみ使用可）:** /clear, /history, /save, /config, /prompt, /verbose, /skin, /statusbar, /tools, /toolsets, /skills, /cron, /browser, /plugins, /platforms, /paste

**Gateway専用（チャット経由でのみ使用可）:** /status, /sethome, /update

**どちらでも使用可:** /new, /stop, /retry, /undo, /title, /compress, /rollback, /background, /resume, /model, /provider, /personality, /reasoning, /reload-mcp, /help, /usage, /insights, /voice

## 全コマンド早見表

セッション: /new /clear /stop /retry /undo /title /compress /rollback /background /save /history /resume /status /sethome — 設定: /model /provider /personality /prompt /config /reasoning /verbose /skin /statusbar — ツール: /tools /toolsets /skills /cron /reload-mcp /browser /plugins — 情報: /help /usage /insights /platforms /paste /update — 音声: /voice — 終了: /quit

---
*この記事は note.com から KTBLOG に移行されました。元記事: https://note.com/famous_prawn2009/n/n53e0a0b57e3b*