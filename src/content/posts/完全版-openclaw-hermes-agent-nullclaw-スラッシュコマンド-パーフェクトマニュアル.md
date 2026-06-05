---
title: "【完全版】OpenClaw / Hermes Agent / NullClaw スラッシュコマンド パーフェクトマニュアル"
date: 2026-06-04
slug: 完全版-openclaw-hermes-agent-nullclaw-スラッシュコマンド-パーフェクトマニュアル
category: "note.com"
eyecatch: "/assets/eyecatch/nb8beb542dca6.png"
---

# 【完全版】OpenClaw / Hermes Agent / NullClaw スラッシュコマンド パーフェクトマニュアル

> 出典: note.com / 2026-03-23

OpenClawには大量のスラッシュコマンドが用意されている。Telegramでもslackでもdiscordでも、チャット画面から / を打つだけで一覧が出てくる。でも、公式ドキュメントは英語だし、全コマンドを網羅した日本語マニュアルはどこにもない。**このnoteが、OpenClawスラッシュコマンドの日本語パーフェクトマニュアルだ。**

## セッション管理

/new — 新しい会話を始める。モデル指定も可（例: /new sonnet）。/reset も同じ。AIとの会話が長くなったり、話題を変えたいときに使う。前の会話の記憶はリセットされるが、MEMORY.mdに書いた情報は残る

/stop — AIの処理を即中断する。長い回答を生成中のとき、「もういいよ」と止めたいときに

/restart — Gatewayを再起動する。openclaw.jsonの設定を変更した後、反映させるときに使う

/compact — コンテキストを圧縮する。AIとの会話が長くなると「コンテキスト（AIが一度に覚えていられる情報量）」が膨らんでコストが上がり、応答も遅くなる。/compact を打つとAIが会話を要約して短くしてくれる。/compact 設計の話は残して のように、残したい情報を指定することもできる

/export — セッションをHTMLファイルとしてエクスポートする。会話のバックアップや共有に便利

## 情報表示

/status — 今使っているモデル名、キャッシュ率（同じ情報を再送しない節約率）、トークン使用量、プロバイダーの残りクォータなどを一目で確認できる

/help — 使い方のヘルプを表示する

/commands — 今使えるコマンドの一覧を表示する

/whoami — 自分のSender IDを表示する。/id でも同じ。OpenClawの設定で「誰にコマンドを許可するか」を指定するときに、このIDが必要になる

/context — AIが今どれだけの情報を抱えているかの内訳を見る。/context detail で「どのファイルが何トークン食っているか」がわかる。コンテキストが大きすぎてコストが気になるとき、どこを削ればいいかの診断に使う

/usage — AIの返答ごとにトークン数やコストを表示するかどうかを切り替える。off で非表示、tokens でトークン数のみ、full で詳細、cost でセッション全体のコスト合計を表示

## モデル・思考制御

/model — AIのモデル（頭脳）を切り替える。引数なしで番号付きの一覧が出て、/model 3 で選択できる。/model openai/gpt-5.2 のようにプロバイダー/モデル名で直接指定も可。/model status でどのAPIエンドポイントに繋がっているか確認できる。Discordではドロップダウンメニューが表示される

/think — AIの「考える深さ」を設定する。off は直感的に即答、minimal〜low は軽く考える、medium は標準、high〜xhigh は時間をかけて深く推論する。難しい問題にはhigh、簡単な雑談にはoffやminimalがコスパ良い。/t でも同じ

/fast — 速度優先モード。on にすると軽量な設定で高速応答、off で通常品質に戻る。この設定はセッション中ずっと有効

/reasoning — AIの推論過程（思考の途中経過）を見せるかどうか。on にすると「Reasoning:」という見出し付きで思考過程が別メッセージとして表示される。AIがどう考えてその答えに至ったか確認したいときに。stream はTelegramのドラフト表示のみ対応。グループチャットでは内部思考が他人に見えるので注意

## 実行制御

/elevated — AIがシェルコマンド（ファイル操作やスクリプト実行）を実行するとき、どこまで許可するかの設定。off は実行禁止、ask は毎回確認を求める（デフォルト）、on は許可済みコマンドを自動実行、full は全コマンドを確認なしで実行する。full は便利だが危険なので、信頼できる環境でのみ使うこと

/exec — AIがコマンドをどこで実行するかの設定。host=sandbox でサンドボックス（隔離環境）、host=gateway でGatewayマシン、host=node で接続済みの別マシン。security でセキュリティレベル、ask で承認タイミングも変えられる。引数なしで現在の設定を表示

/approve — AIが「このコマンドを実行していいですか？」と聞いてきたとき、承認・拒否する。allow-once は1回だけ許可、allow-always は同じコマンドを今後も自動許可、deny は拒否。承認IDは通知に表示される

/bash — チャットからホストマシンのシェルコマンドを直接実行する。! でも同じ（例: ! ls -la）。実行中のジョブの出力を確認するには !poll、停止するには !stop。セキュリティ設定が必要

## サブエージェント管理

サブエージェントとは、メインのAIが別のAIを裏で起動して並列に作業させる仕組み。たとえばメインAIに「このリポジトリのバグを直して」と頼むと、メインAIがコーディング専用のサブエージェントを起動して作業を委譲する

/subagents — サブエージェントの管理画面。list で一覧、kill で停止、log でログ確認、steer で方向転換指示、spawn で新規起動

/kill — サブエージェントを即座に停止する。確認なしで即停止。/kill all で全サブエージェント一括停止。暴走したエージェントの緊急停止に

/steer — 実行中のサブエージェントに「やっぱりこっちの方針でやって」と方向転換の指示を送る。/tell でも同じ

/agents — 現在のスレッドにバインド（紐付け）されているエージェントの一覧を見る

## ACP（Agent Control Protocol）

ACPは、OpenClawからClaude Code・Codex・Gemini CLI・OpenCode等の外部コーディングエージェントを遠隔操作する仕組み。チャット画面から「このコードを書いて」と言うだけで、裏でClaude Codeが動いてコードを書いてくれる

/acp — ACPセッションの操作。spawn で新規起動、status で今の状態を確認、cancel で実行中のタスクをキャンセル、steer で途中から指示変更、model で使うモデルを変更、doctor で接続診断。sessions で過去のセッション一覧

## 音声・TTS

/tts — AIの返答をテキストではなく音声で読み上げさせる。off で音声なし、always で全返答を音声化、inbound で受信メッセージを読み上げ、status で設定確認、provider で音声プロバイダー（ElevenLabs等）の設定。Discordでは /tts がDiscord自体に予約されているのでネイティブコマンドは /voice になる

## Discord専用

以下はDiscordでのみ使えるコマンド。Discordのスレッド機能とOpenClawのセッションを連動させるためのもの

/focus — Discordのスレッドを特定のセッションやサブエージェントに紐付ける。紐付けると、そのスレッド内の会話は専用セッションで処理される。複数の作業を並行するときに便利

/unfocus — スレッドの紐付けを解除して通常に戻す

/session idle — スレッドが一定時間操作されなかったとき、自動で紐付けを解除するタイマー。例: /session idle 30m で30分放置したら自動解除

/session max-age — スレッドの紐付けの最大存続時間。例: /session max-age 2h で2時間後に自動解除

/vc — Discordの音声チャンネルにAIを参加・退出させる（join / leave / status）。ネイティブコマンド専用でテキスト入力では動かない

## チャンネル切り替え

OpenClawは1つのGatewayでTelegram・Discord・Slack等の複数チャンネルを同時に扱える。dockコマンドでAIの返信先を動的に切り替えられる

/dock-telegram — 返信先をTelegramに切り替え

/dock-discord — 返信先をDiscordに切り替え

/dock-slack — 返信先をSlackに切り替え

/activation — グループチャットでの起動条件。mention にすると@メンションされたときだけ反応、always にするとグループ内の全メッセージに反応する。誤爆防止にはmentionが安全

## 設定管理

/config — OpenClawの設定ファイル（openclaw.json）をチャットから直接編集する。オーナー専用。show で全設定表示、get で特定キーの値を取得、set で値を変更（例: /config set messages.responsePrefix="[AI]"）、unset で削除。変更はバリデーションされ、不正な値は拒否される。再起動後も有効

/debug — 一時的な設定オーバーライド。/config と違い、メモリ上だけで有効でファイルには書き込まれない。Gateway再起動で消える。テスト用。/debug reset で全オーバーライドをクリア

/allowlist — どのユーザーにコマンド権限を与えるかの管理。一覧表示、追加、削除ができる

/send — AIからのメッセージ送信のon/off。off にするとAIは考えるだけで返答しなくなる。デバッグやテスト時に

/verbose — デバッグ用の詳細表示モード。on にするとツールの失敗理由や内部処理の詳細が返答に含まれる。問題の原因調査に使う。普段はoff推奨。/v でも同じ

/queue — メッセージの処理キューの設定。素早く連続でメッセージを送ったとき、AIがどう処理するかを制御する。debounce:2s で2秒間の入力をまとめて処理、cap:25 でキュー上限25件、drop:summarize で溢れたメッセージを要約して処理

## スキルコマンド

スキルとは、OpenClawに後から追加できる機能拡張のこと。天気予報、GitHub操作、動画処理など、用途別のスキルをインストールすると自動でスラッシュコマンドとして使えるようになる

/skill — スキルを名前で実行する。npx clawhub で公式スキルストア（ClawHub）から検索・インストールできる

スキルの例（環境により異なる）:

/apple_notes — Apple純正メモの操作 | /coding_agent — コーディングタスクを外部エージェントに委譲 | /weather — 天気予報 | /voice_call — 電話をかける | /video_frames — 動画からフレーム抽出 | /github — GitHub操作 | /gh_issues — Issues自動処理+PR作成 | /summarize — URL・動画・ファイルの要約 | /things_mac — Things 3タスク管理 | /tmux — tmuxセッション操作 | /discord — Discord操作 | /gemini — Gemini CLI | /keyboard_maestro — Keyboard Maestroマクロ | /ddg_search — DuckDuckGo検索 | /crewai_factory — マルチエージェント記事生成 | /multi_stage_research — 多段リサーチ | /ollama_claude_code — 無料Claude Code | /golgo13 — 目的達成特化エージェント | /kimi_subagent — Kimiサブエージェント | /skill_quarantine — スキル検疫 | /acp_agents — ACP管理 | /pair — デバイスペアリング | /phone — フォン操作 | /voice — ElevenLabs音声

## 全コマンド早見表

セッション: /new /stop /restart /compact /export — 情報: /status /help /commands /whoami /context /usage — モデル: /model /think /fast /reasoning — 実行: /elevated /exec /approve /bash — エージェント: /subagents /kill /steer /tell /agents /acp — 音声: /tts /voice — Discord: /focus /unfocus /session /vc — チャンネル: /dock-telegram /dock-discord /dock-slack /activation — 設定: /config /debug /allowlist /send /verbose /queue — スキル: /skill + インストール済み全スキル

## 設定の永続性まとめ

OpenClawのコマンドには「どこまで設定が残るか」に3段階ある。これを知らないと「さっき変えたはずなのに戻ってる」という混乱が起きる

**【恒久】再起動しても残る**

/config — openclaw.jsonに書き込む。再起動後も有効。最も強い永続性

/allowlist — /config経由で保存。恒久

**【セッション永続】/new するまで有効**

/model — セッション中ずっと切り替わったまま。/new で初期値に戻る

/think — セッション中ずっと有効。/new でリセット

/fast — セッション中ずっと有効。/new でリセット

/reasoning — セッション中ずっと有効。/new でリセット

/elevated — セッション中ずっと有効。/new でリセット

/exec — セッション中ずっと有効。/new でリセット

/verbose — セッション中ずっと有効。/new でリセット

/queue — セッション中ずっと有効。/new でリセット

/usage — セッション中ずっと有効。/new でリセット

/tts — セッション中ずっと有効。/new でリセット

※ これらのコマンドを通常メッセージに混ぜて送ると（例: /think high この問題を解いて）、その1回だけ適用される「インラインヒント」になり、セッション設定は変わらない

**【一時】その場限り**

/debug — メモリ上のみ。Gateway再起動で消える

/stop /compact /export /status /help /commands /whoami /context — 実行して終わり。設定は変わらない

/new — セッション自体をリセットするので、上記のセッション永続設定も全部初期値に戻る

## Hermes Agent 独自コマンド

Hermes AgentはOpenClawとは別のAIエージェントフレームワーク。OpenClawと共通するコマンドも多いが、以下はHermes独自のもの

/retry — 最後のメッセージをAIに再送信する。回答が微妙だったとき、もう一度やり直させる

/undo — 直前のユーザー発言+AI回答のペアを削除する。「さっきの質問なかったことに」

/title — セッションにタイトルを付ける。後から探すときに便利（例: /title バグ修正作業）

/compress — 会話コンテキストを手動圧縮する（OpenClawの /compact に相当）

/rollback — ファイルシステムのチェックポイントを一覧・復元する。AIが壊したファイルを元に戻せる

/background — プロンプトをバックグラウンドで実行する。/bg でも同じ。時間がかかる処理を裏で走らせながら別の質問ができる

/resume — 以前に名前を付けて保存したセッションを再開する

/personality — AIの性格プリセットを切り替える。登録済みの人格を選べる

/provider — 利用可能なプロバイダー一覧と現在のプロバイダーを表示する

/tools — ツールの一覧表示・有効化・無効化。特定のツールだけ使わせたくないときに

/toolsets — 利用可能なツールセットの一覧

/skills — スキルの検索・インストール・情報表示・管理（search / browse / inspect / install）

/cron — スケジュールタスクの管理。定期実行の追加・一時停止・再開・削除ができる

/reload-mcp — MCP（Model Context Protocol）サーバーの設定を再読み込みする

/browser — ChromeのDevToolsプロトコル経由でブラウザを接続する（connect / disconnect / status）

/insights — トークン使用量の分析・統計を表示する。日数を指定可能

/update — Hermes Agentを最新版にアップデートする

/sethome — 現在のチャットをホームチャンネルに設定する。/set-home でも同じ

/save — 現在の会話を保存する（CLI専用）

/history — 会話履歴を表示する（CLI専用）

/reasoning — 推論レベルの管理（none / low / minimal / medium / high / xhigh / show / hide）。OpenClawより選択肢が多い

/voice — 音声モードの切り替え（on / off / tts / status）

## NullClaw 独自コマンド

NullClawはOpenClawの軽量フォーク。基本コマンドはOpenClawとほぼ同じだが、以下が独自

/memory — メモリの直接操作。stats で統計、reindex で再インデックス、search で検索、get で取得、list で一覧、count で件数、drain-outbox で送信キューを消化。OpenClawにはない強力なメモリ管理機能

/memory search — メモリをキーワードで検索する（例: /memory search API設定）

/memory get — 特定のキーでメモリを取得する

/memory list — メモリ一覧。カテゴリ・件数フィルタ可能

/doctor — システムの健康診断を実行する。設定・接続・モデルの問題を自動検出

/capabilities — AIが現在使える機能の一覧を表示する

/session ttl — セッションの生存時間を設定する（例: /session ttl 2h で2時間後に自動終了）

/config validate — 設定ファイルの妥当性を検証する

/config apply — 設定変更を実際に適用する（OpenClawの /config set は即適用だが、NullClawはプレビュー→applyの2段階）

## 3つのフレームワークの比較

**OpenClaw** — 最も多機能。マルチチャンネル（Telegram/Discord/Slack/WhatsApp等）対応、ACP、サンドボックス、スキルストア（ClawHub）。本格運用向け

**Hermes Agent** — CLI体験が最も洗練されている。rollback、background、insights等のCLI専用機能が豊富。personality切り替えやcronスケジューラも強い

**NullClaw** — 軽量・シンプル。memoryコマンドによるメモリ直接操作、config apply のプレビュー機構、doctorによる自動診断が特徴。ローカルLLM（Ollama）との組み合わせに最適

## Tips

コマンドと引数の間にコロンを挟んでもOK（/think: high）。許可ユーザーからのコマンド単体メッセージはキューもモデルもバイパスして即処理される。グループでもメンション不要。/new はモデルのエイリアス・プロバイダー名のファジーマッチに対応。

**OpenClawはチャットアプリをAI OSに変えるツールだ。**このスラッシュコマンド群がそのコントロールパネル。覚える必要はない。/ を打てば出てくる。でも「何ができるか」を知っていることが使いこなしの第一歩。

---
*この記事は note.com から KTBLOG に移行されました。元記事: https://note.com/famous_prawn2009/n/nb8beb542dca6*