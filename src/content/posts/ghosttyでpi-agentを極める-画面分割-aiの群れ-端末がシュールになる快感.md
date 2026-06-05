---
title: "GhosttyでPi Agentを極める——画面分割、AIの群れ、端末がシュールになる快感"
date: 2026-06-04
slug: ghosttyでpi-agentを極める-画面分割-aiの群れ-端末がシュールになる快感
category: "note.com"
eyecatch: "/assets/eyecatch/n61bc26d0e4b9.png"
---

# GhosttyでPi Agentを極める——画面分割、AIの群れ、端末がシュールになる快感

> 出典: note.com / 2026-05-17

## GhosttyでPi Agentを極める——画面分割、AIの群れ、端末がシュールになる快感

![](https://assets.st-note.com/production/uploads/images/276775891/rectangle_large_type_2_7bd7f109ddaf3d67cb610c53297aaab6.png)

Pi Agentを使い始めて気づいたことがある。

**ターミナル選びが、エージェント運用の半分を決める。**

どれだけ優秀なAIを動かしても、画面がストレスフルなら作業効率は落ちる。逆に、ターミナルひとつで作業体験が劇的に変わる。

そしてPi Agentの真骨頂は「1台のMacで複数のAIエージェントを並行動作させる」ことにある。そのとき最も重要なのが、ターミナルの分割能力だ。

![](https://assets.st-note.com/production/uploads/images/276775796/rectangle_large_type_2_f5068bdcbaca4463a0c10e66add69356.png)

## なぜGhosttyなのか

結論から言う——Pi AgentをやるならGhostty一択だと断言する。

理由は3つ。

**1. 軽い**

Ghosttyはネイティブコンパイルされたターミナルだ。GPU描画で動作する。つまり5つも6つもターミナルを開いても、CPU負荷がほぼゼロ。Warp（Electron製）のようにメモリを食い潰すことがない。

Pi Agentは複数プロセスを同時に動かすからこそ価値がある。その土台が重くては本末転倒だ。

**2. ボタン一発で画面分割**

これが最大の理由だ。Ghosttyは標準でtmux並みのスプリット機能を持っている。設定不要、プラグイン不要。

![](https://assets.st-note.com/production/uploads/images/276775822/rectangle_large_type_2_6531a75ac37803e1975327921f2d4dde.png)

**3. 設定がテキスト**

Pi Agentと同じで、Ghosttyの設定もテキストファイルに集約される。つまりコピーするだけで同じ環境が再現できる。設定をGit管理すれば、どのMacでも同じターミナル体験が手に入る。

## Ghosttyのキーボードショートカット完全解説

これさえ覚えれば、5つのPi Agentを1ウィンドウで管理できる。

**基本中の基本（まず覚えろ）**

Cmd + D — 縦分割。画面を左右に割る
Cmd + Shift + D — 横分割。画面を上下に割る

たったこの2つで、画面を自由自在に区切れる。いわばターミナル版の「Mission Control」だ。

**ペイン操作（次に覚えろ）**

Cmd + Shift + Enter — 今いるペインを最大化（もう一度押すと戻る）
Ctrl + Tab — ペイン間を移動
Cmd + W — ペインを閉じる

**サイズ調整（慣れてきたら）**

Cmd + Ctrl + 矢印キー — ペインの境界線を移動してサイズ変更

これらのショートカットを組み合わせると、次のようなレイアウトが30秒で作れる。

┌─────────────────────┬─────────────────┐
│ ① Pi Agent         │ ② 汎用Pi        │
│ 記事執筆中          │                 │
├────────────────────

![](https://assets.st-note.com/production/uploads/images/276775872/rectangle_large_type_2_062a4a0e270d82b849236db36c530095.png)

─┤                 │
│ ③ 汎用Pi           │                 │
│                     │                 │
├──────────┬──────────┴─────────────────┤
│ ④ Discord│ ⑤ 理事会Pi                 │
│ GPT連携  │ 貸出中用                   │
└───────

![](https://assets.st-note.com/production/uploads/images/276775872/rectangle_large_type_2_062a4a0e270d82b849236db36c530095.png)

───┴────────────────────────────┘

一覧で見やすいものを30秒で構築できる。

## 画面がシュールになる

こ

![](https://assets.st-note.com/production/uploads/images/276775872/rectangle_large_type_2_062a4a0e270d82b849236db36c530095.png)

れを実際に動かしてみてほしい。

5つのペインで5つのPi Agentがそれぞれ独立して動いている。左のペインでは記事を書き、真ん中ではコードをレビューし、右ではDiscordのメッセージを処理し、右下では自治会のWebサイトが更新されている。

それぞれのペインでカラフルな文字が流れ、コードが走り、JSONが踊る。

画面全体が真っ黒な背景の中で、色とりどりのテキストが同時に動いている——これがとてつもなくシュールで美しい。

Macの画面が真っ黒でも真っ白でも、文字だけがカラフルに動いている光

![](https://assets.st-note.com/production/uploads/images/276775872/rectangle_large_type_2_062a4a0e270d82b849236db36c530095.png)

景。これを見ると「ああ、俺はロボットを飼っているんだな」と実感する。

## Piが動く時の音

Pi Agentはターミナルで動くと、内部でビープ音を鳴らす機能がある。

ペインごとにPiが応答するたびに、微妙に異なるタイミングで beep が鳴る——まるで鳥のさえずりのように。

5つのPiが同時に動いていると、そのビープ音が重なり合って、一種のポリリズムになる。

視覚と聴覚の両方で「AIが生きている」ことを感じられる。これがPi Agent運用の醍醐味だ。

## Ghosttyの設定をテキストで管理する

最後に、設定ファイルの運用を紹介する。

Ghosttyの設定は ~/.config/ghostty/config に書く。以下が今の設定だ：

# ~/.config/ghostty/config
window-save-state = always
font-size = 14
font-family = JetBrains Mono

たった3行。軽い。そしてテキストなのでGitに突っ込める。

window-save-state = always を入れておくと、Ghosttyを再起動したときに、前回のウィンドウ構成とペインレイアウトが完全に復元される。つまり一度作った5ペイン構成を、明日も明後日も使い回せる。

## 結論

Pi Agentの真価は並行稼働にある。並行稼働の真価はターミナル分割にある。ターミナル分割の最適解はGhosttyにある。

軽くて、速くて、画面が割れて、AIが群れになって動く。

これが2026年、Pi Agentを遊び尽くすための唯一無二の環境だ。

あなたもGhosttyを開いて、

**Ctrl+Tab でペインを渡り歩きながら、Cmd+Shift+Enter で一つのペインに没入し、ビープ音をBGMに5体のエージェントを操る——**

そんな未来を、すぐに手に入れられる。

---
*この記事は note.com から KTBLOG に移行されました。元記事: https://note.com/famous_prawn2009/n/n61bc26d0e4b9*