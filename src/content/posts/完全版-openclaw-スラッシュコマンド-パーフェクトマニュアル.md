---
title: "【完全版】OpenClaw スラッシュコマンド パーフェクトマニュアル"
date: 2026-06-04
slug: 完全版-openclaw-スラッシュコマンド-パーフェクトマニュアル
category: "note.com"
eyecatch: "/assets/eyecatch/n756c18f60155.png"
---

# 【完全版】OpenClaw スラッシュコマンド パーフェクトマニュアル

> 出典: note.com / 2026-03-23

OpenClawのスラッシュコマンドを全て網羅した日本語マニュアル。公式ドキュメントは英語のみなので、実際に毎日使っている立場から全コマンドを分類・解説する。

## セッション管理

/new — 新しい会話を始める。モデル指定も可（例: /new sonnet）。/reset も同じ。前の会話の記憶はリセットされるが、MEMORY.mdに書いた情報は残る

/stop — AIの処理を即中断する。長い回答を生成中に「もういい」と止めたいときに

/restart — Gatewayを再起動する。openclaw.jsonの設定変更を反映させるときに

/compact — コンテキストを圧縮する。AIとの会話が長くなると「コンテキスト（AIが一度に覚えていられる情報量）」が膨らんでコストが上がり応答も遅くなる。/compact で会話を要約して短くする。/compact 設計の話は残して のように残したい情報も指定可能

/export — セッションをHTMLファイルとしてエクスポート。会話のバックアップや共有に

## 情報表示

/status — 今使っているモデル名、キャッシュ率（同じ情報を再送しない節約率）、トークン使用量、プロバイダーの残りクォータを一目で確認

/help — ヘルプ表示

/commands — 使えるコマンドの一覧

/whoami — 自分のSender IDを表示。/id でも同じ。OpenClawの設定で「誰にコマンドを許可するか」を指定するときにこのIDが必要

/context — AIが今どれだけの情報を抱えているかの内訳。/context detail で「どのファイルが何トークン食っているか」がわかる。コスト診断に使う

/usage — レスポンスごとにトークン数やコストを表示するか切り替える。off で非表示、tokens でトークン数のみ、full で詳細、cost でセッション全体のコスト合計

## モデル・思考制御

/model — AIのモデル（頭脳）を切り替える。引数なしで番号ピッカー、/model 3 で選択、/model openai/gpt-5.2 で直接指定、/model status でAPIエンドポイント確認。Discordではドロップダウンメニュー表示

/think — AIの「考える深さ」を設定。off は直感的に即答、minimal〜low は軽く考える、medium は標準、high〜xhigh は時間をかけて深く推論。難しい問題にはhigh、雑談にはoffがコスパ良い。/t でも同じ

/fast — 速度優先モード。on で高速応答、off で通常品質。セッション中ずっと有効

/reasoning — 推論過程（思考の途中経過）を見せるか。on で「Reasoning:」付き別メッセージとして表示。AIがどう考えたか確認したいときに。グループでは内部思考が他人に見えるので注意

## 実行制御

/elevated — AIがシェルコマンドを実行するときの許可レベル。off は禁止、ask は毎回確認（デフォルト）、on は許可済みコマンドを自動実行、full は全コマンド確認なし。full は便利だが危険なので信頼環境のみ

/exec — AIがコマンドをどこで実行するかの設定。host=sandbox でサンドボックス（隔離環境）、host=gateway でGatewayマシン、host=node で別マシン。引数なしで現在の設定表示

/approve — AIが「このコマンド実行していいですか？」と聞いてきたとき。allow-once は1回だけ許可、allow-always は同じコマンドを今後も自動許可、deny は拒否

/bash — チャットからホストのシェルコマンドを直接実行。! でも同じ（例: ! ls -la）。!poll で出力確認、!stop で停止。セキュリティ設定が必要

## サブエージェント管理

サブエージェントとは、メインAIが別のAIを裏で起動して並列作業させる仕組み。「このバグ直して」と頼むとコーディング専用エージェントを起動して委譲する

/subagents — サブエージェントの管理。list で一覧、kill で停止、log でログ、steer で方向転換、spawn で新規起動

/kill — サブエージェントを即停止。確認なし。/kill all で全停止。暴走時の緊急停止に

/steer — 実行中のサブエージェントに方向転換指示。/tell でも同じ

/agents — スレッドにバインドされたエージェントの一覧

## ACP（Agent Control Protocol）

ACPはOpenClawからClaude Code・Codex・Gemini CLI等の外部コーディングエージェントを遠隔操作する仕組み。チャットから「このコード書いて」と言うだけで裏でClaude Codeが動く

/acp — spawn で起動、status で状態確認、cancel でキャンセル、steer で指示変更、model でモデル変更、doctor で診断、sessions で一覧

## 音声・TTS

/tts — 返答を音声で読み上げさせる。off で音声なし、always で全返答音声化、status で設定確認、provider でプロバイダー設定。Discordでは /voice がネイティブコマンド

## Discord専用

/focus — Discordスレッドを特定のセッションやサブエージェントに紐付ける。複数作業を並行するときに

/unfocus — 紐付け解除

/session idle — 一定時間操作なしで自動解除するタイマー（例: /session idle 30m）

/session max-age — 紐付けの最大存続時間（例: /session max-age 2h）

/vc — 音声チャンネル制御（join / leave / status）。ネイティブコマンド専用

## チャンネル切り替え

OpenClawは1つのGatewayでTelegram・Discord・Slack等を同時運用。dockコマンドで返信先を動的切替

/dock-telegram — 返信先をTelegramに | /dock-discord — Discordに | /dock-slack — Slackに

/activation — グループでの起動条件。mention で@メンション時のみ反応、always で全メッセージ反応。誤爆防止にはmention

## 設定管理

/config — openclaw.jsonをチャットから直接編集。show で全設定、get で値取得、set で変更（例: /config set messages.responsePrefix="[AI]"）、unset で削除。再起動後も有効。オーナー専用

/debug — 一時的な設定オーバーライド。メモリ上だけで有効、ファイル不書込み。再起動で消える。/debug reset で全クリア

/allowlist — コマンド権限ユーザーの管理

/send — AI返答の送信on/off。off でAIは考えるだけで返答しない。デバッグ時に

/verbose — デバッグ詳細表示。on でツール失敗理由等が見える。普段はoff。/v でも同じ

/queue — メッセージキュー設定。連続送信時の処理方法を制御。debounce:2s でまとめ処理、cap:25 で上限、drop:summarize で溢れ分要約

## スキルコマンド

スキルはOpenClawに後から追加できる機能拡張。インストールすると自動でスラッシュコマンドになる。/skill で名前実行。npx clawhub で検索・インストール可能

スキル例: /apple_notes（メモ）| /coding_agent（コーディング委譲）| /weather（天気）| /voice_call（電話）| /video_frames（動画フレーム）| /github（GitHub）| /gh_issues（Issues+PR）| /summarize（要約）| /things_mac（Things 3）| /tmux（tmux）| /discord（Discord）| /gemini（Gemini CLI）| /keyboard_maestro（KMマクロ）| /ddg_search（検索）| /crewai_factory（マルチエージェント記事）| /multi_stage_research（多段リサーチ）| /ollama_claude_code（無料Claude Code）| /golgo13（目的達成特化）| /kimi_subagent（Kimi）| /pair（ペアリング）| /voice（ElevenLabs）

## 設定の永続性

**【恒久】再起動しても残る** — /config, /allowlist

**【セッション永続】/new するまで有効** — /model, /think, /fast, /reasoning, /elevated, /exec, /verbose, /queue, /usage, /tts。通常メッセージに混ぜると（例: /think high この問題を解いて）その1回だけの一時適用になる

**【一時】その場限り** — /debug（再起動で消える）、/stop /compact /status /help 等（実行して終わり）

## 全コマンド早見表

セッション: /new /stop /restart /compact /export — 情報: /status /help /commands /whoami /context /usage — モデル: /model /think /fast /reasoning — 実行: /elevated /exec /approve /bash — エージェント: /subagents /kill /steer /tell /agents /acp — 音声: /tts /voice — Discord: /focus /unfocus /session /vc — チャンネル: /dock-telegram /dock-discord /dock-slack /activation — 設定: /config /debug /allowlist /send /verbose /queue — スキル: /skill + 全スキル

---
*この記事は note.com から KTBLOG に移行されました。元記事: https://note.com/famous_prawn2009/n/n756c18f60155*