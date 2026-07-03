---
title: "Phase A1-f完了——全プロファイルのSOUL.mdとconfig.yamlを正しく設定し、anikiの致命的ミスを修正する"
date: 2026-07-03
category: "AI・テクノロジー"
tags: ["AIエージェント", "艦隊運用", "Hermes", "SOUL.md", "プロファイル", "インフラ運用", "ロボット"]
---

## Phase A1-f 完了報告：全プロファイルのSOUL.md・config.yaml整備

Phase A1でプロファイルを作ったが、**中身の整備ができていなかった**。今回それをやった。

### 発見した問題

全艦SSHでプロファイルのSOUL.mdとconfig.yamlを調査した結果、**深刻なミス**を発見。

#### 🚨 anikiプロファイル：SOUL.mdが全く別のエージェントのものだった

3号Mini1の`aniki`プロファイルは`@kt_aniki_bot`（移動支援の兄ちゃん）用のボットトークンを持っている。しかしSOUL.mdの中身は**@Ktmrkatobot（ミスターカトー）**のものだった。

> 「このプロセスのボット: @Ktmrkatobot（ミスターカトー）」
> 「@kt_aniki_bot は別のボット（移動支援の兄ちゃん）だ。勘違いするな。」

**完全に逆だ。** このプロファイルこそが@kt_aniki_botなのに、中身はカトーの人格とおばあちゃん対応ルールが300行以上書かれている状態だった。

おそらくプロファイル作成時にデフォルトのSOUL.mdをそのままコピーしたか、間違ったファイルを配置した。

#### qwen37プロファイル：SOUL.mdが英語テンプレートのまま

1号の`qwen37`プロファイルのSOUL.mdはHermesのデフォルト英語テンプレートだった。

> "You are Hermes Agent, an intelligent AI assistant created by Nous Research..."

KT艦隊の文脈が一切反映されていない。誰が使っているのか、何のエージェントなのか不明。

#### config.yamlのばらつき

| プロファイル | system_prompt | GBrain指示 | 表示言語 |
|---|---|---|---|
| 4号 default | GODMODE + 日本語 | ❌ なし | ja |
| 1号 lady | GODMODE + GBrain | ✅ あり | en |
| 1号 rodemu | GODMODE + GBrain | ✅ あり | en |
| 1号 qwen37 | KT専用 + GODMODE | ❌ なし | en |
| 3号 aniki | 「日本語で応答しろ。」のみ | ❌ なし | **en** |

表示言語が`en`なのに日本語のSOUL.mdを持つプロファイルが複数。system_promptにGBrain利用ルールが書かれているプロファイルと書かれていないプロファイルが混在。

### やったこと

#### 1. aniki SOUL.mdを正しく書き直した

@kt_aniki_bot（移動支援の兄ちゃん）としての役割に合わせてSOUL.mdを新規作成。カトーの人格・おばあちゃん対応ルール・bot2botグループ情報など、別エージェントの内容を全て削除。

**移動支援の兄ちゃんとしての役割：**
- つるまい移動支援のスケジュール管理・調整
- ドライバーシフトの連絡調整
- 利用者からの問い合わせ対応
- KTへの日報・申し送り

#### 2. qwen37 SOUL.mdをKT艦隊仕様に書き直した

デフォルト英語テンプレートを破棄し、KT艦隊のQwen37としてのSOUL.mdを作成。

#### 3. 全プロファイルのsystem_promptにGBrain利用ルールを統一追加

全5プロファイルに以下のGBrainルールを追加：

```
## Gbrain知識ベースの活用
あなたはGbrain（チーム共有知識ベース）にMCP経由でアクセスできる。

### 基本ルール
1. 保存: 会話で得た新しい知見・重要な情報は積極的にgbrainに保存する
2. 検索: 不明点があればまずgbrainを検索してから回答する
3. 参照: 過去の会話や決定事項を確認するときはgbrainを参照する
```

#### 4. anikiの表示言語をen→jaに変更

### 修正後の状態

| プロファイル | 艦 | ボット | SOUL.md | GBrain指示 | 言語設定 |
|---|---|---|---|---|---|
| default | 4号 | @KeiTyAIAnswerBot | ✅ オーベルシュタイン | ✅ 追加済み | ja |
| lady | 1号 | — | ✅ レディ | ✅ 既存 | en |
| rodemu | 1号 | — | ✅ ロデム | ✅ 既存 | en |
| qwen37 | 1号 | — | ✅ 新規作成 | ✅ 追加済み | en |
| aniki | 3号 | @kt_aniki_bot | ✅ 新規作成 | ✅ 追加済み | ja ✅ |

### 教訓

**「プロファイルを作った ≠ 完了」**

Phase A1でプロファイルの殻を作ったが、中身の整備をスキップしていた。これはよくある失敗：

1. インフラ（プロファイル）を作る
2. 中身（SOUL.md、config.yaml）を設定するのを忘れる
3. エージェントが別人の人格で動く

**プロファイル作成のチェックリストを今後は必須にするべき：**
- [ ] SOUL.mdが正しいエージェント用か
- [ ] config.yamlのsystem_promptにGBrain指示があるか
- [ ] 表示言語が正しいか
- [ ] ボットトークンとSOUL.mdのボット名が一致しているか

### 次のPhase

- **Phase A3**: fleet-shared/skillsをexternal_dirsで共有（共通スキルの統一）
- **Phase A4**: Icarus Pluginを全プロファイルにインストール（記憶システムの統一）
- **Phase A5**: GBrain MCPサーバーを全プロファイルに追加（知識ベースアクセスの統一）

