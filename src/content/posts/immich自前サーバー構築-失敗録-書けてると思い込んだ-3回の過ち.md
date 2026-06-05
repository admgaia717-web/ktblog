---
title: "Immich自前サーバー構築 失敗録——「書けてると思い込んだ」3回の過ち"
date: 2026-06-04
slug: immich自前サーバー構築-失敗録-書けてると思い込んだ-3回の過ち
category: "Immich"
eyecatch: "/assets/eyecatch/n3aa2f39a9955.png"
---

# Immich自前サーバー構築 失敗録——「書けてると思い込んだ」3回の過ち

> 出典: note.com / 2026-05-24

## 目的

iCloud・Googleフォトを完全解約し、6TB HDDに全写真を自前保存する。

## 同じ失敗を3回繰り返したAI

1回目：20GB VMにアップ→満杯→消えた。2回目：100GB VMにアップ→満杯→ENOSPC→消えた。3回目：50GB VMで待機中。毎回「直った」と言ってユーザーにアップさせ、毎回VM内に溜めて満杯で消失。3回ともテストを怠った。

## 本当の失敗原因（KTによる訂正）

**結論：「macOSでDocker + 外付けドライブが不可能」ではない。**

本当の原因は：

1. Colima/VZの共有仕様の弱さ

2. Docker DesktopのFile Sharing未許可

3. bind mountの検証不足（docker inspectを怠った）

4. Immich upload locationの実体確認不足

つまり「外付けHDDに書けていると思い込んでいた」のが核心。

Docker DesktopもOrbStackも、本来は普通に外付けSSD/HDDを共有できる。ColimaだけがmacOSのVolume共有（特にremovable media、TCC、APFSパーミッション）に弱い。

## 最悪だった点

volumes: 設定はDocker Compose上は成功するが、サイレントでVM内部ディスクにフォールバックする。docker inspectしないと真実が見えない。これはDocker初心者〜中級者がmacOSでめちゃくちゃハマる罠。

## 本来やるべきだった検証（1分で済んだ）

コンテナ内: touch /photos/test.txt → ホスト側: ls /Volumes/HD-SGDA で即確認。これを最初にやるべきだった。

## Immich側の罠

Immichはupload library、external library、postgres、ML cache、thumbnails、encoded-videoが全部別。UPLOAD_LOCATIONだけ外付けにしても、DBやML cacheやサムネイルがVM内に膨らむ。970枚で死んだのはサムネイルとML cacheの可能性が高い。

## 228GB SSDのMac miniでImmichは結構キツい

Apple SiliconのDocker VMはqcow2肥大化、overlay2肥大化、build cache、postgres WALで猛烈にディスクを食う。

## KTのケースで最適な構成

**短期：OrbStack + External Library**（既存写真はindex onlyで安全）

**長期：Linux mini PC（N100等）+ Docker + Immich**（VM不要、bind mount地獄なし、TCCなし、Immich公式想定に近い最強構成）

## 最大の教訓

「Dockerで見えてる ≠ 永続化されてる」特にmacOSでは本当にそう。

---
*この記事は note.com から KTBLOG に移行されました。元記事: https://note.com/famous_prawn2009/n/n3aa2f39a9955*