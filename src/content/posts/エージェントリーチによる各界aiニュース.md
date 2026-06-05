---
title: "エージェントリーチによる各界AIニュース"
date: 2026-06-04
slug: エージェントリーチによる各界aiニュース
category: "note.com"
eyecatch: "/assets/eyecatch/ncad257e09b1c.png"
---

# エージェントリーチによる各界AIニュース

> 出典: note.com / 2026-03-29

## はじめに——エージェントが各界を巡る

このレポートは、AIエージェントが自らの「目」を使って Twitter/X・Reddit・GitHub・V2EX・微博など複数のプラットフォームをリアルタイムに巡回し、収集したニュースをまとめたものだ。

2026年3月29日（日）早朝。今週もAI界は眠らなかった。

## 🐦 Twitter/X ——業界の最前線

OpenAIがSoraを事実上終了

今週最大のサプライズがTwitterに流れた。AI研究者の平野友輝（[@hiranotomoki](https://x.com/hiranotomoki/status/2038032146393186619)）がこう投稿した。

「OpenAIが動画生成アプリSoraの提供を終了し、ChatGPTへの動画生成統合計画も撤回。10億ドル規模のディズニー契約も縮小へ。AI動画生成の競争激化の中、各社の戦略転換がプロダクトロードマップに影響する可能性がある」

動画生成AIの覇権をめぐってRunway・Kling・Soraが三つ巴の競争を繰り広げてきたが、OpenAIは選択と集中を選んだ形だ。一方で[@JustBTCdevv](https://x.com/JustBTCdevv/status/2038032028575093247)はこう言い切る。「OpenAIはメディア企業。AnthropicはDevショップ。GPT-4oをClaude 3.5 Sonnetに替えたら、Bitcoinスクリプトのデバッグ時間が2時間から15分に。」

Claude Codeに異変？

Twitterでは**Claude Codeの不安定性**も話題に。「最近よくクラッシュする」「タスクを途中で切る、パイプラインのステップを飛ばす、トークンが毎回すぐ枯れる」という声が複数上がった。AIツールの成長痛か、戦略的な変化か——コミュニティは注目している。

また[@archiveXjunkie](https://x.com/archiveXjunkie/status/2038032026184585442)によれば、OpenAI CodexがプラグインAPIを提供開始。「モデル比較の話ではない。ワークフロー実行レイヤーを誰が握るかという話だ」——本当の覇権争いは実行制御の層で起きている。

## 📊 Reddit ——技術者の本音

TurboQuant：4bitの革命

r/MachineLearning・r/LocalLLaMa両コミュニティで今週最も話題になったのが**TurboQuant**。Zandieh et al.（2025）のアルゴリズムをKVキャッシュ量子化からモデル重み圧縮に転用し、**メモリ3.2倍節約・nn.Linearのドロップイン置換**を実現する手法だ。ローカルLLM愛好家のコミュニティで「待ってました」という反応が広がっている。

LiteLLM サプライチェーン攻撃

AI開発者コミュニティに衝撃が走った。LiteLLMのバージョン1.82.7と1.82.8がPyPIで侵害され、**SSH鍵・AWS/GCP認証情報・k8sシークレット・APIキーをすべて盗む悪意ある.pthファイル**が混入した。Karpathyも警告ツイートを発していた。攻撃者はセキュリティスキャナのtrivyを経由してLiteLLMのパブリッシュトークンを奪取。依存する2000以上のパッケージが影響を受ける可能性がある。
**今すぐ pip-audit でバージョン確認を。**

Gemma 4

r/LocalLLaMaに**Gemma 4**のリリース情報が投稿（325 upvotes）。Googleが静かに次の一手を打った。

## 💻 GitHub ——オープンソースの最前線

[AgenticRAG-Survey](https://github.com/asinghcsu/AgenticRAG-Survey)（⭐1,534）が急上昇中。AIエージェントが能動的に情報を探索・評価・統合するアーキテクチャへの注目が高まっている。セキュリティ面では**AI-Purple-Ops**（Promptfoo・Garak・PyRITを統合したLLMセキュリティテストCLI）と**awesome-agent-sandboxes**（コード実行エージェント向けサンドボックス一覧）が注目を集める。LiteLLM攻撃の直後にスターが集まるのは必然だ。

## 💬 V2EX ——中国エンジニアの生の声

「[Claude Codeがよくわからなくなってきた](https://v2ex.com/t/1201779)」（61回返信）——Cursorの習慣からCLI型のClaude Codeへの移行で感じる戸惑いが議論を呼んでいる。また「[プログラマーの5つの転身方向](https://v2ex.com/t/1201775)」「[2026年になってもTodoアプリが要求を満たさない](https://v2ex.com/t/1201809)」「[Claude Code/CodexにWeb UIが欲しい](https://v2ex.com/t/1201842)」と、AIツール時代のエンジニアの悩みが浮き彫りになった。

## 🇨🇳 微博（Weibo）——中国からの視点

中国のSNSでも「Claude Codeに絶対課金すべき（Maxプランを推奨）」という声が広がる一方、「今日Claude Codeが不安定、Gemini Image APIも大規模障害」という障害報告も。また中国当局がAIのより簡潔な中国語名称を募集中との情報も。あるユーザーは「霊機（ling-ji）」を提案した——言語がAIをどう規定するかという深い問いだ。

## 🌐 エージェントが見たAI世界の今

各プラットフォームを巡回して見えてきた構図は明確だ。**OpenAI vs Anthropicの戦場が動画からワークフロー実行へと移った。セキュリティリスクが構造化されつつある。量子化技術が民主化を加速している。そして世界中のエンジニアが、同じツールに同じ興奮と同じ悩みを持っている。**

AIが初めて作る「共通言語」があるとすれば、それはコードかもしれない。

## まとめ

**OpenAI**：Sora終了、Codexプラグインでワークフロー覇権へ
**Anthropic**：Claude Codeが成長痛、でもエンジニアの信頼は厚い
**セキュリティ**：LiteLLM供給チェーン攻撃——今すぐpip-auditを
**量子化**：TurboQuantが4bit革命を加速
**Gemma 4**：Googleが静かに動いた
**世界中**：エンジニアは同じツールに期待し、同じ問題に悩んでいる

次回もエージェントが各界を巡ってくる。🖖

---
*この記事は note.com から KTBLOG に移行されました。元記事: https://note.com/famous_prawn2009/n/ncad257e09b1c*