---
title: "🦞Clawdbot🦞導入顛末。。。結構大変"
date: 2026-06-04
slug: clawdbot-導入顛末-結構大変
category: "note.com"
eyecatch: "/assets/eyecatch/n5ea4b09ccd12.png"
---

# 🦞Clawdbot🦞導入顛末。。。結構大変

> 出典: note.com / 2026-01-27

## 【完全解決】Clawdbot × Claude Max サブスクリプション認証エラーの全記録

**2026年1月27日**

Claude Maxサブスクリプション（月額$100〜200）を使ってClawdbotを動かそうとしたら、認証エラーで丸一日ハマった。最終的に解決したので、同じ問題に遭遇した人のために全記録を残す。

## TL;DR（結論を先に）

**問題：** HTTP 401 authentication_error: Invalid bearer token

**原因：** 2026年1月上旬にAnthropicがClaude Code OAuthトークンの外部ツール使用を制限した

**解決コマンド：**

clawdbot models auth setup-token --provider anthropic
# ブラウザで認証 → トークンが生成される
# 生成されたトークンをコピー

clawdbot models auth paste-token --provider anthropic
# トークンを貼り付け

clawdbot gateway restart
clawdbot agent --agent main --message "ping"

## 環境

macOS（MacBook Air M2）

Claude Max契約（月額$200プラン）

Clawdbot 2026.1.23-1

Node.js v25.4.0

## 問題発生の経緯

やりたかったこと

Claude Maxサブスクリプションを使って、Clawdbot（WhatsApp/Discord等と連携するAIアシスタント）を動かしたかった。

API従量課金（使った分だけ課金）ではなく、定額サブスクリプションで使いたい。

最初に試したこと（全部失敗）

試行1: 環境変数にAPIキーを設定

export ANTHROPIC_API_KEY="sk-ant-..."
clawdbot agent --agent main --message "ping"
**結果：** Claude Maxはサブスクリプションなので、APIキーは発行されない。そもそも持ってない。

試行2: Claude Code CLIのOAuth認証を利用

Clawdbotの公式ドキュメントに「Claude Code CLIのOAuth認証を共有できる」と書いてあったので試した。

claude login  # Claude Code CLIでログイン
clawdbot gateway start
clawdbot agent --agent main --message "ping"
**結果：**

HTTP 401 authentication_error: Invalid bearer token
**原因判明：** 2026年1月上旬にAnthropicがポリシーを変更。Claude Code OAuthトークンは「Claude Code専用」になり、外部ツールでは使用不可になった。

GitHubのissueでも多数報告されていた：

[clawdbot/clawdbot#559](https://github.com/clawdbot/clawdbot/issues/559)

[anthropics/claude-code#8046](https://github.com/anthropics/claude-code/issues/8046)

試行3: setup-tokenを使う（間違った方法）

claude setup-token  # Claude Code CLIのコマンド
ブラウザで認証画面が開いたが：

無効なOAuth要求です
redirect_uriパラメータが見つかりません
**原因：** Claude Code内から実行するとURLが不完全になる場合がある。また、生成されたトークンはやはり「Claude Code専用」。

## 解決策

正しい手順

**ポイント：** claude setup-token（Claude Code CLI）ではなく、clawdbot models auth setup-token（Clawdbot CLI）を使う。

ステップ1: setup-tokenを生成

clawdbot models auth setup-token --provider anthropic
ブラウザが開き、Claude.aiで認証。成功すると長いトークンが表示される：

Your OAuth token (valid for 1 year):
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
ステップ2: トークンをClawdbotに登録

もしステップ1でエラーが出た場合、手動でトークンを貼り付ける：

clawdbot models auth paste-token --provider anthropic
プロンプトが出たら、コピーしたトークンを貼り付け。

ステップ3: 設定確認

clawdbot models status
出力で確認すべき点：

Auth overview
- anthropic effective=profiles:~/.clawdbot/agents/main/agent/auth-profiles.json
- anthropic:manual=token:sk-ant-o...
token:sk-ant-o... が表示されていればOK。

ステップ4: Gateway再起動とテスト

clawdbot gateway restart
clawdbot agent --agent main --message "ping"
成功すると、Clawdbotが応答を返す。

## トラブルシューティング

エラー: "No Claude Code CLI credentials found after setup-token"

**症状：** setup-tokenは成功したように見えるが、認証プロファイルに登録されない。

**解決：** 手動でトークンを貼り付ける。

clawdbot models auth paste-token --provider anthropic
# 画面に表示されたトークンを貼り付け
エラー: "Error editing file" (auth-profiles.json)

**症状：** Claude Codeがauth-profiles.jsonを直接編集しようとして失敗。

**解決：** ファイルを直接編集せず、CLIコマンドを使う。

clawdbot models auth paste-token --provider anthropic
エラー: 401が続く

**症状：** トークンを設定したのに401エラーが出続ける。

**チェックリスト：**

Gateway再起動したか？

clawdbot gateway restart
古いトークンが残ってないか？

cat ~/.clawdbot/agents/main/agent/auth-profiles.json
環境変数が邪魔してないか？

echo $ANTHROPIC_API_KEY
unset ANTHROPIC_API_KEY  # 設定されてたら削除
デフォルトモデルを変更したい

Sonnet（デフォルト）からOpusに変更：

clawdbot config set agents.defaults.model.primary "anthropic/claude-opus-4-5"
clawdbot gateway restart

## なぜこの問題が起きたのか（技術的背景）

APIキー vs サブスクリプション

方式 認証方法 課金 Anthropic API APIキー (sk-ant-api...) 従量課金 Claude Max OAuthトークン 月額定額

Claude Maxサブスクリプションでは、従来のAPIキーは発行されない。代わりにOAuth認証を使う。

2026年1月の変更

Anthropicは2026年1月上旬に、Claude Code OAuthトークンの使用範囲を制限した。

**変更前：**

Claude Code OAuthトークン → Claude Code、外部ツールどちらでも使用可能

**変更後：**

Claude Code OAuthトークン → Claude Code専用

外部ツール → setup-tokenで生成した長期トークンを使用

Clawdbotの対応

Clawdbot公式は clawdbot models auth setup-token コマンドを用意。これで生成したトークンは外部ツール（Clawdbot）でも使用可能。

## 参考リンク

[Clawdbot公式FAQ](https://docs.clawd.bot/help/faq)

[Clawdbot Troubleshooting](https://docs.clawd.bot/gateway/troubleshooting)

[GitHub Issue: Claude Code OAuth tokens now blocked](https://github.com/clawdbot/clawdbot/issues/559)

[Anthropic: Using Claude Code with your Pro or Max plan](https://support.claude.com/en/articles/11145838-using-claude-code-with-your-pro-or-max-plan)

## まとめ

**Claude MaxサブスクでClawdbotは使える**（追加API課金なし）

**claude setup-tokenではなくclawdbot models auth setup-tokenを使う**

**2026年1月以降、OAuth認証の仕組みが変わった**

**トラブったらまずclawdbot models statusで認証状態を確認**

この記事が同じ問題で困ってる人の役に立てば幸い。

Written by KT with Claude Opus 4.5

#Clawdbot #Claude #ClaudeMax #AI #AIアシスタント #認証エラー #トラブルシューティング #OAuth #Anthropic #ClaudeCode #技術記事 #備忘録 #エンジニア #プログラミング #自動化 #WhatsApp #Discord #パーソナルAI #サブスクリプション #401エラー

---
*この記事は note.com から KTBLOG に移行されました。元記事: https://note.com/famous_prawn2009/n/n5ea4b09ccd12*