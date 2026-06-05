---
title: "Mercury Agent（ライトニング）完全コマンドマニュアル"
date: 2026-06-04
slug: mercury-agent-ライトニング-完全コマンドマニュアル
category: "Mercury"
eyecatch: "/assets/eyecatch/na98cf877f96d.png"
---

# Mercury Agent（ライトニング）完全コマンドマニュアル

> 出典: note.com / 2026-05-13

## はじめに — 君のテレグラムに住むAI執事

Mercury Agent（コードネーム: ライトニング）は、テレグラム上で24時間稼働するAIエージェント。ローカルLLM（qwen3.6:35b-a3b）で動作し、クラウドAPIに依存しない。

🖼 挿絵: [Mercury Agent概念図](https://drive.google.com/file/d/1WXKp8VyosHyEn8C0X64H-5L6onmxhwQ_/view)

## Spotify コマンド一覧

**/spotify play** — 再生
**/spotify pause** — 一時停止
**/spotify next** — 次の曲
**/spotify prev** — 前の曲
**/spotify volume [0-100]** — 音量設定
**/spotify shuffle** — シャッフル
**/spotify repeat** — リピート
**/spotify now** — 再生中表示
**/spotify devices** — デバイス一覧
**/spotify queue** — 待ち行列
**/spotify like** — 曲を保存
**/spotify search** — 検索

🖼 挿絵: [応用シナリオ](https://drive.google.com/file/d/1ESy2qVrheTK6nV9G2-26CiSZM8WPj-0H/view)

## 管理コマンド

**/help** / **/status** / **/tools** / **/skills**
**/progress** / **/bg** / **/budget**
**/stream** / **/permissions**

## 応用シナリオ

**朝のルーティン:** 「7時になったら音量25でBBCニュース流して」
**作業用BGM:** 「25分集中→5分休憩、集中中はローファイ」
**DJ代理:** 「今の雰囲気キープしつつ知らないアーティスト開拓」

## テクニカルノート

LLM: qwen3.6:35b-a3b / Spotify: Ktアカウント / 予算: 無制限 / 自動起動: LaunchAgent

---
*この記事は note.com から KTBLOG に移行されました。元記事: https://note.com/famous_prawn2009/n/na98cf877f96d*