---
title: "【加藤メカトロ】M5 Maxで考える2026年夏の最強ローカル作画環境—Draw Things + ComfyUI + MFLUX三層構成"
date: 2026-07-14
category: "メカトロ"
tags: ["M5 Max", "Draw Things", "ComfyUI", "MFLUX", "ローカル画像生成", "Apple Silicon", "AI作画", "FLUX"]
excerpt: "M5 Max 128GBで実現する2026年夏の最強ローカル作画環境。Draw Things + ComfyUI + MFLUX 三層構成、FLUX.2 dev 32BからKrea 2 Turbo、Ideogram 4まで、モデルの適材適所を解説。"
---

【加藤メカトロ】M5 Maxで考える2026年夏の最強ローカル作画環境—Draw Things + ComfyUI + MFLUX三層構成

---

## プロローグ：「クラウドでいいじゃないか」という選択肢は正しいのか

2026年7月。AI画像生成の世界では、Midjourney・DALL·E・Stability AIのクラウドサービスが成熟し、FAL.aiのようなサーバーレスGPUも日々値下がりしている。

「わざわざローカルで動かす必要ある？」——この問いはもっともだ。

だが、あなたが：

- 月に数千枚の画像を生成する
- 機密性の高いデザイン案件を扱う
- 同一キャラクター・同一画風の大量生成が必要
- レイテンシ1秒未満の対話的生成を求める
- モデルの重みを自社で所有したい

これらのいずれかに当てはまるなら、ローカル作画環境は「贅沢」ではなく「投資」になる。

そして、M5 Max（40コアGPU・128GBユニファイドメモリ）は、2026年夏現在、**ノートPCで実現できる最強のローカル作画環境**だ。

本稿では、このマシンで何ができて、どう構成すべきかを、具体的なモデルとワークフローとともに解説する。

---

## 1. なぜM5 Maxなのか：Apple Siliconと画像生成の現在地

Apple Siliconは、M1世代から画像生成のローカル環境として注目されてきた。しかし、長らく「CUDAには及ばない」という評価がつきまとった。

M5 Maxで状況が変わる。

**M5 Max（フルスペック）のスペック：**
- CPU：18コア（12高性能 + 6効率）
- GPU：40コア
- メモリ帯域：614GB/s
- ユニファイドメモリ：最大128GB
- SSD：最大8TB
- メモリバンド幅：M4 Max比で約1.5倍

重要なのは、**CPU・GPU・メモリが物理的に一つのパッケージに統合されている**点だ。従来のPCのように、GPUのVRAMにデータをコピーするオーバーヘッドがない。128GBのユニファイドメモリは、実質的に「128GBのVRAM」として機能する。

これにより、FLUX.2 dev（32Bパラメータ、BF16で約64GB）のような巨大モデルを、ノートPC一台で動かせる時代が来た。

---

## 2. 結論：三層構成が最強

2026年7月14日時点で、M5 Maxを最大限使う構成は、単一アプリケーションでは実現できない。

**Draw Things + ComfyUI + MFLUX の三層構成**——これが速度・画質・最新モデル対応・自動化・ローカル完結を最も高い水準で両立する。

```
┌─────────────┐
│   Draw Things  │ ← 高速レンダリング核（日常の9割）
│  ComfyUI連携 │ ← ワークフロー自動化層
│     MFLUX    │ ← 最新モデル実験層
└─────────────┘
```

それぞれの役割を見ていこう。

---

## 3. 第一層：Draw Things—高速レンダリングの中心

Draw Thingsは、macOS/iOS向けにApple Siliconへ**ネイティブ最適化**された画像生成アプリケーションだ。

M1世代から開発が続いており、M5 MaxではM4 Max比で**一部処理が3.3倍以上高速化**したとの公式測定もある。

**Draw Thingsで担当する処理：**
- 高速なラフ生成（FLUX.2 klein 4B）
- 高品質レンダリング（FLUX.2 dev）
- インペイント・アウトペイント
- キャラクターLoRA・画風LoRAの学習
- SeedVR2による拡大・復元
- Qwen Imageによる文字入り画像

何より、**GUIが完成している**。ComfyUIのようなノードエディタに不慣れなユーザーでも、直感的に操作できる。

### Draw Thingsの重要な最適化機能

| 機能 | 効果 |
|------|------|
| Lightning Draft | 高速プレビュー生成。構図検討を秒単位で |
| 8-bit S量子化 | メモリ使用量を半減しつつ高品質維持 |
| Universal Weights Cache | 大容量メモリMacでは物理メモリの約半分をキャッシュに使用 |
| SeedVR2 | 画像の超解像・復元。3B/7Bモデルに対応 |

**設定の初期値：**
Universal Weights Cacheは標準で物理メモリの約半分（64GB）を使用する設計。128GB機では64GBをキャッシュに割り当て、残り64GBをmacOS・ブラウザ・レタッチソフト用に残すのが妥当だ。

---

## 4. 第二層：ComfyUI＋Draw Thingsブリッジ—ワークフロー自動化

Draw Thingsだけでは「決まった処理を何度も実行する」のが面倒だ。ここでComfyUIの出番になる。

**ComfyUI（公式gRPCブリッジ経由）の役割：**
- ワークフローの設計
- バッチ生成の自動化
- ControlNetの適用
- プロンプト・メタデータの管理
- エージェントからの呼び出し

ポイントは、**ComfyUIのPyTorch MPSバックエンドを直接レンダラーに使わない**ことだ。

ComfyUI公式Wikiでも、Apple SiliconのMPSは未対応演算やFP8制限などにより低い評価になっている。M5で性能は改善しているが、構造的な制限は残る。

**Draw Things公式のComfyUI連携リポジトリ**を使うことで、ComfyUIの柔軟なグラフ設計と、Draw ThingsのApple Silicon最適化を組み合わせられる。

```
ComfyUIで設計 → gRPC経由 → Draw Thingsでレンダリング
```

これが、M5 Maxで取るべき最も合理的な構成だ。

---

## 5. 第三層：MFLUX—最新モデルの実験場

MFLUXは、AppleのMLX（機械学習フレームワーク）を直接利用する画像生成基盤だ。

**MFLUXの強み：**
- Draw Thingsへの実装を待たず、最新モデルを最速で試せる
- Python・CLIからの大量生成
- API化によるエージェントからの呼び出し
- 量子化・LoRA・img2img・ControlNet対応

2026年6月に公開されたKrea 2 TurboやIdeogram 4のような最先端モデルも、MFLUXならMac上で動作させられる。

インストールは驚くほど簡単：

```bash
brew install uv
uv tool install --upgrade mflux
```

Draw ThingsよりGUIや統合機能は弱いが、**研究用バックエンド**として優秀だ。

---

## 6. モデルの役割分担

M5 Max 128GBという広大なメモリを活かし、複数モデルを適材適所で使い分ける。

| 用途 | 第一候補 | 実行環境 | メモリ概算 |
|------|---------|---------|-----------|
| 超高速ラフ・構図検討 | FLUX.2 klein 4B | Draw Things | ~13GB |
| 高品質ラフ・汎用生成 | FLUX.2 klein 9B | Draw Things | ~20GB |
| 最終品質・複数参照編集 | FLUX.2 dev 32B | Draw Things | ~64GB（BF16） |
| 芸術性・独特な画風 | Krea 2 Turbo 12B | MFLUX | ~24GB |
| ポスター・ロゴ・文字組み | Ideogram 4 FP8 | MFLUX | ~28GB |
| 多言語文字・精密編集 | Qwen Image 2512 | Draw Things | ~40GB |
| アニメ・イラスト系 | Anima Preview 3 | Draw Things | ~15GB |
| 拡大・顔や細部の復元 | SeedVR2 3B/7B | Draw Things/MFLUX | ~8GB/16GB |

### 各モデルの特徴

**FLUX.2 klein 4B**（高速生成の本命）
- Apache 2.0ライセンス。商用利用可能
- 4Bパラメータで約13GB。Lightning Draftと組み合わせて瞬時生成
- 記事用キャッチ画像や構図探しに最適

**FLUX.2 dev 32B**（最高品質）
- 32Bパラメータ。BF16で約64GB
- 複数参照画像からの編集・人物・画風の維持に対応
- 128GB機なら実用的に常駐させられる数少ないモデル
- **注意：** ライセンスに制限あり。商用利用は条件確認が必要

**Krea 2 Turbo**（創造性重視）
- 2026年6月公開の12Bオープンウェイトモデル
- 写実性一本ではなく、創造的な構図・広告的ビジュアルに強い
- 8ステップ生成対応

**Ideogram 4**（タイポグラフィ）
- 文字・ロゴ・ポスターに特化
- JSON形式でバウンディングボックスや配色を指定可能
- noteのキャッチ画像に正確な見出しを埋め込みたい場合の第一候補

**Qwen Image 2512 / Edit 2511**（多言語文字）
- 20B級。日本語文字の生成に強い
- フルモデル約58GB。128GB機なら余裕
- 複雑な漢字は最終的にレタッチソフトで修正する前提が安全

---

## 7. 8TB SSDの推奨配分

モデルファイルは1つで数十GB。すぐに数百GBを消費する。以下が推奨配分だ。

| 領域 | 推奨容量 | 対象 |
|------|---------|------|
| Draw Thingsモデル | 1.0〜1.5TB | メインで使う全モデル |
| HuggingFace/MFLUXモデル | 1.0〜1.5TB | 実験用モデル |
| LoRA・ControlNet | 500GB | 学習済みアダプター |
| 学習データセット | 500GB〜1TB | 学習用画像 |
| 生成画像・動画 | 1.5〜2TB | 出力ファイル |
| 一時ファイル・キャッシュ | 500GB | 作業領域 |
| macOS・開発環境・余白 | 1.5TB以上 | OS・アプリ・バッファ |

**運用のコツ：**
現役モデルは内蔵SSDに置き、旧モデル・古いLoRA・過去出力は外付けSSDへ移す。

---

## 8. 実際の制作フロー

最も効率のよいワークフローは、以下の流れだ。

### Step 1: ラフ検討（数秒単位）

```
FLUX.2 klein 4B + Lightning Draft
→ 数十案を高速生成
→ 構図・画角・配色を選定
```

### Step 2: 品質詰め（数十秒単位）

```
選んだ構図をklein 9B、Krea 2、Qwen Imageで描写
→ 人物・物体の一貫性を確認
→ 必要ならFLUX.2 devへ参照画像を渡す
```

### Step 3: 修正（分単位）

```
Draw Thingsのインペイント
→ 手・顔・背景の細部を修正
→ 足りない部分をアウトペイント
```

### Step 4: 拡大（秒単位）

```
SeedVR2で2倍〜4倍に拡大
→ 顔や細部を復元
→ 最終出力
```

### Step 5: 文字組み（必要に応じて）

```
Ideogram 4でタイトル文字を別生成
→ レタッチソフトで合成
→ またはComfyUIワークフローに組み込み
```

### Step 6: 自動化

```
ComfyUIに工程を保存
→ エージェントから再実行可能に
→ 同じ処理をバッチで回す
```

この設計なら、普段はGUIで人間が描き、同じ処理を後からエージェントやバッチ処理へ移せる。

---

## 9. 現時点で避けるべき構成

### ❌ ComfyUI単体＋MPS
互換性確認用ならよいが、M5 Maxの能力を最も効率よく引き出す構成ではない。Draw Thingsのネイティブ実装の方が高速かつ安定している。

### ❌ HunyuanImage 3.0を無理に動かす
80B MoE・13Bアクティブ。非常に強力だが、公式環境はCUDA 12.8中心。量子化すれば128GBに収まる可能性はあるが、ネイティブMLX/Draw Things対応が成熟しておらず、「動かす研究」になり制作効率が落ちる。

### ❌ Draw Things CLIだけに依存
公式CLIはHomebrewで配布されているが、2026年7月時点ではビルドや依存関係の報告あり。まずDraw Thingsアプリを安定基盤とし、CLIは自動化部分だけに使うのが安全。

---

## 10. 最終判定：M5 Max 128GB最強構成

| 観点 | 推奨構成 |
|------|---------|
| **最強・研究運用** | Draw Things + ComfyUI(gRPCブリッジ) + MFLUX |
| | FLUX.2 klein 4B/9B + FLUX.2 dev + Krea 2 Turbo |
| | Ideogram 4 + Qwen Image 2512 + Anima Preview 3 + SeedVR2 |
| **安定・実務運用** | Draw Thingsのみ |
| | FLUX.2 klein 4B + FLUX.2 dev + Qwen Image + Anima Preview 3 + SeedVR2 |

**率直な結論：**
M5 Max 128GBでは「巨大モデルを無理に動かすこと」より、Draw Thingsの高速ネイティブ実装を中心に複数モデルを適材適所で切り替える方が強い。MFLUXを追加することで、Draw Thingsが未対応の最新モデルも補完できる。

この分野の進化は速い。Draw Things・MFLUX・主要画像モデルのアップデートは**月1回の調査**を習慣にすることを勧める。

---

## エピローグ：ノートPCでここまでできる時代

2024年、FLUX.1が登場したとき、「ローカルでFLUXを動かすには24GB以上のVRAMが必要」と言われた。

2025年、M4 Maxで64GBユニファイドメモリが標準になり、「VLAM 64GB相当」がノートPCで実現した。

2026年、M5 Maxで128GB。そしてDraw Thingsのネイティブ最適化により、FLUX.2 dev 32BがノートPC一台で実用的に動く。

「画像生成にはクラウドGPUが必要」という常識は、もはや過去のものだ。

ノートPCを開き、Draw Thingsを起動し、FLUX.2 devで4K画像を生成する——それが、2026年夏の現実なのである。

---

**出典・参考情報：**
- Draw Things 公式サイト: https://drawthings.ai
- MFLUX GitHub: https://github.com/ds8k/mflux
- ComfyUI 公式: https://github.com/comfyanonymous/ComfyUI
- Apple M5 Pro/M5 Max 発表（2025年11月）: Apple Newsroom
- FLUX.2 モデルファミリー: Black Forest Labs
- Krea 2 Turbo: Krea AI（2026年6月公開）
- Ideogram 4: Ideogram AI（2026年6月公開）
- Qwen Image 2512/Edit 2511: Alibaba Cloud
- SeedVR2: 超解像モデル

---

*2026年7月14日 | 加藤ラジコン出版*

