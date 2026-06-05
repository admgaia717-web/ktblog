---
title: "知らなきゃ損！Hermes Agent作者Nous Researchの「Nous Portal」サブスクリプション完全攻略ガイド"
date: 2026-06-04
slug: 知らなきゃ損-hermes-agent作者nous-researchの-nous-portal-サブスクリプション完全攻略ガイド
category: "note.com"
eyecatch: "/assets/eyecatch/n7b05afafa12e.jpg"
---

# 知らなきゃ損！Hermes Agent作者Nous Researchの「Nous Portal」サブスクリプション完全攻略ガイド

> 出典: note.com / 2026-05-26

## 知らなきゃ損！Hermes Agent作者Nous Researchの「Nous Portal」サブスクリプション完全攻略ガイド

みなさん、Hermes Agent使ってますか？　あの「使うほど賢くなる」オープンソースAIエージェントです。

でもこんな経験ありませんか？

「モデルAPIキー」「Web検索APIキー」「画像生成APIキー」「TTSのキー」... 5つも6つも登録して管理がカオス

「どのプロバイダーが安いんだっけ？」

「無料で使えるモデルないかな...」

実は**Hermes Agentを作ったNous Researchが、これらの問題を全部解決するサブスクリプション「Nous Portal」をリリースしていた**んです。

## Nous Portalって何？

2026年4月27日にローンチされた**Nous Research公式のサブスクリプションサービス**です。

一言で言うと：

**「APIキー地獄から解放される統一プラットフォーム」**

今まであなたは以下のサービスを個別に契約する必要がありました：

**従来:**

・モデルAPI: OpenRouter / Anthropic / OpenAI

・Web検索: Firecrawl / Tavily

・画像生成: FAL / Stability AI

・TTS: OpenAI / ElevenLabs

・ブラウザ自動化: Browserbase / Browser Use

・管理画面: 5つのダッシュボード

**Nous Portal:**

・✅ 1つのOAuthで300+モデル

・✅ ゲートウェイ内蔵（Web検索）

・✅ FLUX 2 Pro対応（画像生成）

・✅ OpenAI TTS内蔵（TTS）

・✅ ゲートウェイ内蔵（ブラウザ自動化）

・✅ 1つのポータルで完結（管理画面）

## 料金プラン

無料プラン（$0/月）

月額$0.10のクレジット付き。無料モデルへのアクセスあり。評価用として十分です。

$20プラン（コスパ最強）

@HermesAgentTips 氏曰く「$20サブはSUPER worth（超お得）」。

・Web検索：Firecrawl連携

・画像生成：FLUX 2 Pro対応

・TTS：OpenAI TTS

・ブラウザ自動化：Browser Use / Browserbase

・コード実行：サンドボックス実行環境

・音声I/O：音声入力・出力両対応

これらのツールが**追加APIキー不要**で使えます。

## セットアップ方法

① サブスクライブ

[portal.nousresearch.com](https://portal.nousresearch.com) でアカウント作成。無料プランでもクレカ登録が必要ですが、課金はされません。

② Hermes Agentに接続

# ワンタイムセットアップ
hermes setup --portal
# → ブラウザが開いてOAuth認証 → 完了

# または手動
hermes config set model.provider nous
hermes auth add nous --type oauth

③ 動作確認

hermes portal status
# → "Logged in as: xxx@example.com (Free/Pro plan)"

④ モデル選択

# おすすめ設定（コスパ重視）
/model anthropic/claude-sonnet-4.6
# 安価なコーダー
/model qwen/qwen3-coder-plus
# 安価な軽量モデル
/model deepseek/deepseek-v4-flash

**注意:** Hermes-4-70Bや405Bはチャット/推論モデルであってエージェント向けではありません。エージェントワークにはClaude Sonnet / GPT / DeepSeek / Qwen等のツールコール対応モデルを選んでください。

## X Premium+ユーザーへの朗報

2026年5月15日、Nous ResearchとxAIが提携。**X Premium+ユーザーは既存のGrokサブスクリプションをHermesでそのまま使える**ようになりました。

・Grok 4.3 モデル

・Grok TTS

・Grok Imagine（画像生成）

これらが**OAuthフロー経由で追加課金なし**で利用可能です。

hermes auth add grok --type oauth
# → X Premium+アカウントで認証 → HermesからGrokが使える！

## こんな人にオススメ

・「APIキー管理が面倒」→ 全部Nous Portalが吸収

・「無料で使い始めたい」→ Freeプランで評価

・「$20なら試してみたい」→ ツール全部入りで超お得

・「X Premium入ってる」→ Grok OAuthでさらに拡張

## まとめ

**「Hermes Agentを使うなら、まずNous Portalのアカウントを作れ」**

無料プランで$0.10クレジットが付いてくるので、まずは評価。そのまま使い続けるなら$20プラン。X Premiumに入ってるならGrokも追加料金なし。

これで**5つのAPIキーを管理する地獄**から解放されます。

[Nous Portalに登録する →](https://portal.nousresearch.com)

---

参照: @HermesAgentTips / Nous Research公式ドキュメント / Hermes Agent公式ガイド

---
*この記事は note.com から KTBLOG に移行されました。元記事: https://note.com/famous_prawn2009/n/n7b05afafa12e*