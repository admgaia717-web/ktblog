---
title: "寝てる間にエージェントが勝手に成長する — Hermes Dojo 導入記"
date: 2026-06-04
slug: 寝てる間にエージェントが勝手に成長する-hermes-dojo-導入記
category: "note.com"
eyecatch: "/assets/eyecatch/n6b4a0e01da23.png"
---

# 寝てる間にエージェントが勝手に成長する — Hermes Dojo 導入記

> 出典: note.com / 2026-05-10

## 寝てる間に、エージェントが勝手に成長する

AIエージェントを使っていると、こんな経験ないだろうか。

**「また同じミスしてる…」**

ファイルパスを間違える。コマンドが見つからないと嘆く。何度も同じことを注意するのに、次のセッションでは忘れている。

人間のアシスタントなら学習して改善していくのに、AIはなぜ同じミスを繰り返すのか。それは**フィードバックループが閉じていない**からだ。

この問題を根本から解決するのが、Nous Researchハッカソンで誕生した **Hermes Dojo** だ。

## Dojo の核心：測って、直して、進化させる

![](https://assets.st-note.com/production/uploads/images/274773767/rectangle_large_type_2_fee7a5492c6b76dd4a415245c809c547.png)

Hermes Dojo は、Hermes Agent のための**自己改善道場**である。仕組みはシンプルで美しい。5段階のサイクルを回すだけ。

**① 計測（Monitor）** — 過去7日間のセッションログを自動解析。ツールの成功率、エラーパターン、ユーザーの修正指示を数値化する。

**② 弱点分析（Analyze）** — 失敗の根本原因を分類し、「web_extractがタイムアウトで100%失敗」「CSV解析が7回要求されたのにスキルがない」など改善優先順位をつける。

**③ 自動修正（Fix）** — 既存スキルにパッチ、または新規作成。さらにGEPA（自己進化）で最適化。

**④ 検証（Verify）** — 修正後に再計測し、成功率改善を確認。改善率5%未満なら手動レビュー。

**⑤ 報告（Report）** — 朝起きたらTelegramにレポート。「web_extract成功率0%→95%」など数字で改善が見える。

## 実際に動かしてみた結果

![](https://assets.st-note.com/production/uploads/images/274773798/rectangle_large_type_2_f872a0dd06b2baad595e5ec020e01e88.png)

7日分のデモデータでフルパイプラインを実行した結果。

**発見された弱点:** web_extract成功率0%（12/12失敗・タイムアウト）、execute_code 30%（7/10失敗・JSONエラー）、terminal_run 71%（11/38失敗・パスミス）

**自動生成された新スキル:** web-extract、terminal-run、execute-code、csv-parsing、json-formatting、deployment、api-integration の全7件

**学習曲線:** Day 1: 34.2% → Day 7: 57.1%（+22.9%）。たった7日で成功率1.7倍。

## インストールは30秒

![](https://assets.st-note.com/production/uploads/images/274773843/rectangle_large_type_2_f4e67c7ebcd1e20b1bb94d2bfec73ea7.png)

**git clone https://github.com/Yonkoo11/hermes-dojo.git**

**cd hermes-dojo && ./install.sh**

**python3 scripts/demo.py --reset**

あとは **/dojo auto** と打つだけ。毎朝6時に自動分析→改善→レポート。

## なぜこれが重要か

LLM単体の性能競争は飽和しつつある。次の戦場は**「エージェントがどれだけ自律的に成長できるか」**だ。Hermes Dojo はその問いに一つの答えを示している。

東洋の「道」の概念 — 型を繰り返し、少しずつ精度を上げていく稽古の精神が、ここには宿っている。

君のエージェントは、まだ同じミスを繰り返しているか？ ならば、道場に入れる時だ。

---
*この記事は note.com から KTBLOG に移行されました。元記事: https://note.com/famous_prawn2009/n/n6b4a0e01da23*