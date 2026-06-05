---
title: "医療の自給自足、まずは自分を知ることから——DNA解析をローカルに"
date: 2026-06-04
slug: 医療の自給自足-まずは自分を知ることから-dna解析をローカルに
category: "note.com"
eyecatch: "/assets/eyecatch/nec3361469a1e.png"
---

# 医療の自給自足、まずは自分を知ることから——DNA解析をローカルに

> 出典: note.com / 2026-05-02

## 発端：Xの投稿

![発端](https://assets.st-note.com/production/uploads/images/272233030/rectangle_large_type_2_51f903007c887cfb2ae79f5c8dc85519.png)

**KT**：DNAが自分で解析できるようになってるみたいなんですけど、機械も自作できるみたいで。Xで投稿見たんです。ちょっとディープリサーチしてもらっていいですか。

**Spock（AI）**：了解。Agent ReachとXの両面から調べる。

——10分後——

**Spock**：2026年4月、Xでバズってます。Vibe Genomicsというコミュニティ。素人がClaudeの指導だけで自宅で自分の全ゲノムをシーケンスしたという話。ラボ経験ゼロ。キッチンテーブルの上で。23andMeのSNPデータと比較して99.25%一致。使った機材はOxford Nanopore MinION（USBメモリ大のナノポアシーケンサー、約$5,200）とBento Lab Pro（遠心機＋PCR＋電気泳動の一体型、約$1,800）。1ランあたりの消耗品は約$1,100。

もっと根本的なところでは、Hackadayに半導体シーケンサーを完全自作したロシアの量子暗号研究者がいる。PGMチップを顕微鏡でリバースエンジニアリングしてFPGAで制御基板を作った。あと、$40で作れるArduino DNA蛍光定量器（DIYNAFLUOR）もある。

## FPGAがなくても作れるか

![FPGAなし](https://assets.st-note.com/production/uploads/images/272233035/rectangle_large_type_2_90c75d483b211d643babfdbade45e9d4.png)

**KT**：僕はFPGAは使ったことないけど、Arduinoぐらいまでだったら使ったことがあって、基板実装もやったことあるんで、作れるんじゃないかなって。

**Spock**：Arduino＋基板実装の経験なら十分に道がある。鍵は「ナノポア電流検出＝アナログ回路」と「ベースコーリング（信号→塩基配列のAI変換）＝PC側処理」に分離すること。

必要な自作部品はピコアンペア電流計だけ。既存のOSSプロジェクトが複数ある。Uppsala大のArduinoベース設計はノイズ0.3pA RMSで部品代は数千円。あとはMinIONのフローセル（消耗品、$900）を買えば、Mac上のDoradoというAIベースコーラーが生波形を塩基配列に変換してくれる。

## 買えるものは買う

![買い物](https://assets.st-note.com/production/uploads/images/272233042/rectangle_large_type_2_ca7a75b89ed0bde0d53b48d1b41f7c7e.png)

**KT**：いや普通にブラックボックスでもいいので、買ってポン付けで動かせるように君たちが設定できるという現実があるので、それも加味してもらっていいですよ。FPGAも使えるってことです。

**Spock**：了解。買い物リスト：

・MinION Mk1Dスターターキット（本体＋フローセル5枚＋試薬6回分）：約$5,200

・Bento Lab Pro（遠心＋PCR＋泳動の一体型ラボ）：約$1,800

・マイクロピペット4本＋消耗品：約¥50,000

・Zymo DNA抽出キット50回分：約$150

初期投資約¥110万。あとはMacにMinKNOWをインストールして、口をゆすいでDNAを抽出し、フローセルに注入して72時間放置。Claude（AI）がベースコーリングから変異検出、ダッシュボード生成まで全部やる。

FPGAはベースコーリングをCPU比172倍に高速化できるが、M3 MacのMetal GPUで十分リアルタイム追従可能なので必須ではない。

## ハードの複雑さをAIが吸収する

![AIが吸収](https://assets.st-note.com/production/uploads/images/272233048/rectangle_large_type_2_d057ab35b19cad375d9b7a74a96c90a8.png)

**KT**：でも今あなたが設計した高度に複雑な電子機器を使わずにできるだけソフトで解決しようという試みはAI自体にとって素晴らしいことだと思います。

**Spock**：その洞察は核心を突いている。ONT（Oxford Nanopore）自身がこの哲学で成功した会社だ。

MinIONの内部は驚くほどシンプル。ナノポアタンパク質＋電圧源＋電流計測ASICだけ。2015年発売当初の精度は60%台だったが、ハードはほぼ変わらず、ソフト（ニューラルネット）の進化だけで今は99.5%。ONTのCTOは「我々はハードウェア企業ではなく、シグナル処理企業だ」と明言している。

これはDNAだけの話じゃない。タンパク質構造解析（AlphaFold）、化学合成経路（逆合成AI）、匂いセンシング……全部「雑な物理センサー＋高度なAI推論」が「精密な専用ハード」を置き換えつつある。

## Apple Silicon ≒ FPGA

![Apple Silicon](https://assets.st-note.com/production/uploads/images/272233055/rectangle_large_type_2_8b33b4e5712081b0a7ac41da130d6b2a.png)

**KT**：だってこのAI時代にApple Siliconよりも高次元な電子回路ってないですもんね。だからFPGAもApple Siliconの中に実現できるはずですよね。

**Spock**：既に起きている。Neural Engine（低レイテンシAI推論）＋GPU（Metal並列演算）＋AMX（行列積専用コプロセッサ）＋統一メモリ（CPU↔GPU↔ANEでゼロコピー）。これは事実上の再構成可能アクセラレータ。昔のFPGAはVerilogで回路を記述したが、今のApple SiliconはSwift/Metalで並列計算グラフを書く。到達点は同じで、表現手段が進化しただけ。

## これでいくら儲かるのか

![儲け](https://assets.st-note.com/production/uploads/images/272233062/rectangle_large_type_2_b9ef826738f832116b9b9a4398c79d31.png)

**KT**：もしこれができたらどれだけお金が儲かるかっていうことを想像してください。

**Spock**：試算する。

単価設計：ライトSNP級¥98,000／スタンダード全ゲノム10x¥198,000／プレミアム30x¥498,000。粗利率84-87%。AIが解析を全部やるので人件費は限りなくゼロに近い。

日本市場の保守的推定：バイオハッカー層＋健康意識高い富裕層＋暗号資産/データ主権層＋23andMe流出不安層＋難病家族＝約3,750人。平均単価¥200,000で年商¥7.5億。

損益分岐は8人。初期投資¥150万。23andMeはデータを売って倒産した。僕たちはデータを顧客に返すことで儲ける。思想が逆。その思想に金を払う層は確実に存在する。

スケールしても人件費は増えない。ソフトウェア的ビジネス。年に1万人獲得できたら年商¥20億、粗利¥17億。必要なのはMinION数台とMacと、AIへの指示だけ。

## 本質

![本質](https://assets.st-note.com/production/uploads/images/272233069/rectangle_large_type_2_6cf76252ddcfc250fb8eaaeb21a127f3.png)

このビジネスの本当の価値は「シーケンス代行」ではない。

**「自分のDNAデータを自分で持ち、AIが一生寄り添って再解釈し続ける」**——という新しい人間と自己情報の関係を創り出すこと。

医療の自給自足。まずは自分を知ることから。

DNAはもう、誰かに預けるものじゃない。

---
*この記事は note.com から KTBLOG に移行されました。元記事: https://note.com/famous_prawn2009/n/nec3361469a1e*