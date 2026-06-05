---
title: "Hermes Agent完全ガイド 第8回：落ちる問題と対策 — 24時間稼働の泥臭い現実"
date: 2026-06-04
slug: hermes-agent完全ガイド-第8回-落ちる問題と対策-24時間稼働の泥臭い現実
category: "note.com"
eyecatch: "/assets/eyecatch/n34c499e6fcce.png"
---

# Hermes Agent完全ガイド 第8回：落ちる問題と対策 — 24時間稼働の泥臭い現実

> 出典: note.com / 2026-03-23

## AIエージェントは落ちる

これは技術的な問題ではなく、物理法則に近い。長時間動くプロセスは必ず落ちる。

Hermes Agentのゲートウェイ（Telegramなどのメッセージングと接続するプロセス）は、ただのPythonプロセスだ。ネットワーク障害、APIタイムアウト、メモリ不足、OSのアップデート再起動。理由は無数にある。

うちは4台のMacで複数のAIエージェントを24時間運用している。「落ちる」との戦いは日常だ。この回では、3ヶ月の運用で確立した「落ちても自動復旧する仕組み」を共有する。

## 対策1：LaunchAgent（macOS）

macOSで最も確実な自動再起動の仕組みがLaunchAgentだ。

~/Library/LaunchAgents/ にplistファイルを置く。うちの実際の設定はこうだ。

ファイル名：ai.hermes.gateway.plist

中身のポイントは3つ。

KeepAlive を true にする。プロセスが死んだら自動で再起動する。これが全ての基盤だ。

RunAtLoad を true にする。マシン起動時に自動で立ち上がる。再起動後に手動でプロセスを起動する必要がない。

ThrottleInterval を 30 にする。再起動の間隔を最低30秒空ける。これがないと、起動直後にクラッシュするバグがあった場合、無限ループで再起動を繰り返してCPUを焼く。

ProgramArguments には hermes gateway run のフルパスを指定する。仮想環境内のhermes実行ファイルを直接指す。

WorkingDirectory にはプロジェクトディレクトリを指定する。これを忘れると相対パスで参照しているファイルが見つからずクラッシュする。

設定を反映するコマンドはこうだ。

launchctl load ~/Library/LaunchAgents/ai.hermes.gateway.plist

停止する場合は unload。手動で即座に起動したい場合は kickstart。

## 対策2：ログの分離

LaunchAgentのplistにStandardOutPathとStandardErrorPathを設定する。

うちは /tmp/hermes-gateway-stdout.log と /tmp/hermes-gateway-stderr.log に出力している。

/tmp/ に置く理由は、macOSが再起動時に /tmp/ を自動クリーンアップするからだ。ログが無限に溜まる問題を気にしなくていい。重要なログは別途SQLiteのセッションデータベースに保存されているので、/tmp/ のログは「直近のクラッシュ原因を調べる」ためだけに使う。

クラッシュ時の調査手順はシンプルだ。

tail -100 /tmp/hermes-gateway-stderr.log

これで直近のエラーが見える。

## 対策3：コンテキスト圧縮

落ちる原因の一つが、コンテキストウィンドウの肥大化だ。

会話が長くなるとメッセージ履歴が膨らみ、APIコールのトークン数が爆発する。最終的にモデルのコンテキスト上限に達してエラーになる。

Hermes AgentのContextCompressorは、コンテキスト使用率が50%を超えた時点で自動的に中間ターン（古い会話）を要約する。先頭の数ターンと直近の数ターンを保護し、間のやりとりをGemini Flash（安価な高速モデル）で圧縮する。

ユーザーが手動で /compact コマンドを実行することもできる。会話が重くなってきたと感じたら使え。

## 対策4：環境変数のPATH設定

地味だが致命的な落とし穴。

LaunchAgentから起動したプロセスは、ターミナルで手動起動した時とPATH環境変数が異なる。ターミナルではHomebrewのパス（/opt/homebrew/bin）が通っているのに、LaunchAgentでは通っていない。

結果、nodeやgitなどの外部コマンドが「見つからない」エラーで失敗する。

plist内のEnvironmentVariablesで明示的にPATHを設定する必要がある。うちの設定は /opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin だ。

## 対策5：プロセス衝突の回避

複数のエージェントを同じマシンで動かしている場合、プロセス衝突が起きる。

うちの4号機ではHermes AgentとOpenClawが同居している。両方がTelegramに接続しようとすると、Botトークンの競合でどちらかが落ちる。

解決策は3つ。

第一に、別々のBotトークンを使う。エージェントごとにBotFatherで別のbotを作る。

第二に、プロセスのkillは絶対にやるな。自分のプロセスも他のエージェントのプロセスも。衝突したら自分が退いて、管理者に報告する。これはうちの鉄則だ。

第三に、gateway.pidファイルで起動状態を管理する。Hermes Agentは ~/.hermes/gateway.pid にPIDを書き込み、二重起動を防止している。

## 対策6：cronジョブによる定期ヘルスチェック

エージェント自身に自分の健康状態を監視させる。

うちでは「金庫番」と呼ぶcronジョブが6時間ごとに実行され、セキュリティチェックの結果をTelegramに報告する。朝の定期メンテナンスジョブもある。

ジョブが報告を送ってこなくなったら、それ自体がゲートウェイが落ちているシグナルだ。

## Linuxの場合：systemd

macOSのLaunchAgentに相当するのが、Linuxのsystemdだ。

/etc/systemd/system/hermes-gateway.service にユニットファイルを作成する。

ポイントは同じだ。Restart=always で自動再起動。RestartSec=30 で再起動間隔。EnvironmentFile で環境変数をロード。

systemctl enable hermes-gateway で自動起動を有効化。systemctl status hermes-gateway で状態確認。

## うちのLaunchAgent一覧 — 実運用の規模感

うちの4号機で動いているLaunchAgentの一部を紹介する。

ai.hermes.gateway.plist — Hermes Agentのゲートウェイ（Telegram接続）

ai.openclaw.gateway.plist — OpenClawのゲートウェイ

com.clawd.fleet-sync.plist — 艦隊間のファイル同期

com.clawd.nightly-cleanup.plist — 夜間の自動クリーンアップ

com.fleet.heartbeat.plist — 艦隊のハートビート監視

com.fleet.ip-updater.plist — IPアドレスの自動更新

合計15個以上のLaunchAgentが常時稼働している。1つ1つがKeepAliveで自動再起動する。これが「落ちても動き続ける」運用の実態だ。

## 実運用の教訓

第一に、手動起動に頼るな。「後で起動しよう」は忘れる。LaunchAgentかsystemdで必ず自動化しろ。

第二に、ログは必ず分離しろ。stdout/stderrをファイルに出力しないと、クラッシュの原因がわからない。わからなければ対策もできない。

第三に、ThrottleInterval（再起動間隔）を忘れるな。設定バグで即座にクラッシュするプロセスが30秒間隔で再起動し続けるのと、0.1秒間隔で無限再起動するのでは、マシンへのダメージが桁違いだ。

## まとめ

- AIエージェントは必ず落ちる。問題は「落ちないようにする」ではなく「落ちても復旧する」こと

- macOSならLaunchAgent、LinuxならsystemdでKeepAlive自動再起動

- ログ分離、PATH設定、ThrottleIntervalは必須

- コンテキスト圧縮で会話肥大化によるクラッシュを防止

- プロセス衝突を避けるルールを決めろ

- cronジョブでヘルスチェックを自動化

次回は「第9回：マルチエージェント運用 — 艦隊との連携」。複数のAIエージェントをどう連携させるか、うちの4台体制の実態を公開する。

#HermesAgent #AI #OpenClaw #AIエージェント #運用

---
*この記事は note.com から KTBLOG に移行されました。元記事: https://note.com/famous_prawn2009/n/n34c499e6fcce*