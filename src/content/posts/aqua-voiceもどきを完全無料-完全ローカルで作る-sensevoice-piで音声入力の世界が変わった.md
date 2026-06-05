---
title: "Aqua Voiceもどきを完全無料・完全ローカルで作る——SenseVoice + piで音声入力の世界が変わった"
date: 2026-06-04
slug: aqua-voiceもどきを完全無料-完全ローカルで作る-sensevoice-piで音声入力の世界が変わった
category: "note.com"
eyecatch: "/assets/eyecatch/n5b2062dc92c6.png"
---

# Aqua Voiceもどきを完全無料・完全ローカルで作る——SenseVoice + piで音声入力の世界が変わった

> 出典: note.com / 2026-05-02

## Aqua Voiceもどきを完全無料・完全ローカルで作る——SenseVoice + piで音声入力の世界が変わった

Aqua Voiceをご存知だろうか。Macのどこにいても、ショートカットキーを押して話しかけるだけで、音声がテキストになってカーソル位置に入力される。あの感覚は一度味わうとやめられない。だが有料だ。

そこで俺は考えた。「これ、ローカルで無料でできんじゃね？」

結論から言うと、**できた。完全無料。完全ローカル。ネット不要。**

![課金の鎖から解き放たれる](https://assets.st-note.com/production/uploads/images/272232877/rectangle_large_type_2_fc482329c17e911f63ce2fadb5b72e34.png)

## 使ったもの——4つの魔法の道具

**SenseVoice**（Alibaba FunASR）—— 234MBの軽量モデル。日本語対応。感情認識付き。Whisperより高精度。非Whisper系。**sounddevice**——Pythonでマイクから音声キャプチャ。**pynput**——キーボードショートカット検出。**pi**——音声指示を実行するAIエージェント。全部pip install一発。全部タダ。

![4つの魔法の道具](https://assets.st-note.com/production/uploads/images/272232956/rectangle_large_type_2_a8b1453671a37f8f4ed5ca92ae815c35.png)

## 仕組み——音が言葉になり、言葉が行動になる

① Fnキーを押す→録音開始。② 話す。日本語でベラベラと。③ キーを離す→SenseVoiceが文字起こし。④ テキストをアクティブなアプリにペースト（またはpiに送信）。この4ステップが1〜2秒。ネット不要。全部Macの中で完結する。

![音が言葉に変わる瞬間](https://assets.st-note.com/production/uploads/images/272232966/rectangle_large_type_2_7446a6b37a43a655b24555957ca63996.png)

## インストール——1行の魔法

pip install funasr sounddevice soundfile pynput

初回起動時にSenseVoiceSmallモデル（234MB）が自動ダウンロード。あとはスクリプトを起動して、話すだけ。

![1行のコマンドが生む宇宙](https://assets.st-note.com/production/uploads/images/272232975/rectangle_large_type_2_47384b461bd5e729c788a701326ae84c.png)

## Aqua Voiceとの違い——巨人と侍

Aqua Voiceはクラウド経由。ネット必須。有料。俺のこれは完全ローカル。ネット不要。無料。精度はSenseVoiceが優秀で、日本語認識率はWhisper以上。感情（怒り・喜び・悲しみ）まで認識する。

![クラウド巨人に立ち向かう侍](https://assets.st-note.com/production/uploads/images/272233000/rectangle_large_type_2_079c0dc27998a019c59cc21a9c5bb255.png)

## 結論——課金のいらない世界へ

2026年5月。個人が無料でここまでできる。Aqua Voiceに月額払う前に、自分で作ってみるのも悪くない。というか、作ったほうが愛着が湧く。コードはそのうちGitHubに上げる。気になる人はnoteのコメントかX（@aipraxislab）まで。

---
*この記事は note.com から KTBLOG に移行されました。元記事: https://note.com/famous_prawn2009/n/n5b2062dc92c6*