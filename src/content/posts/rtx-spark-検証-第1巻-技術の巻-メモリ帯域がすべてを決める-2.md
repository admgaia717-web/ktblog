---
title: "RTX Spark 検証 — 第1巻 技術の巻 — メモリ帯域がすべてを決める"
date: 2026-06-04
slug: rtx-spark-検証-第1巻-技術の巻-メモリ帯域がすべてを決める-2
category: "RTX Spark"
eyecatch: "/assets/eyecatch/n4225f55b7455.png"
---

# RTX Spark 検証 — 第1巻 技術の巻 — メモリ帯域がすべてを決める

> 出典: note.com / 2026-06-02

━━━ RTX Spark 検証 4部作 ━━━

技術層をKT独自の視点で再構成、4号機実運用に落とし込む

# RTX Spark 検証 — 第1巻 技術の巻

**前作 (第零巻)**: [検証の巻](./2026-06-02_rtx_spark_dgx_spark_verification.md) — 基本検証

Jensen Huang が公式に **「N1 = GB10 = RTX Spark」** と確認したのは2025年9月（Intel 提携時のQ&A）。Pokde.net, XDA, HardwareLuxx など複数の独立メディアが同定している。

これは「同じ半導体ダイを3つのフォームファクタで売る」古典的なシリコン再利用戦略：

製品フォーム電力帯域OSターゲット
------------------
**DGX Spark**ミニPC (1.13L)240W公称/100W実測273 GB/sDGX OS (Ubuntu)開発者・研究者
**RTX Spark N1 ベース**ノートPC45-80W~600 GB/sWindows 11 ARM消費者
**RTX Spark N1X プレミアム**ノートPC80-100W~600 GB/sWindows 11 ARMパワーユーザー
**OEM 派生**ミニPC, デスクトップ150-240W273-600 GB/s各種組込み・中小企業

 
**「同じシリコン、異なる熱設計」が持つ意味**：

- ノート向け 45-80W 電力プロファイルは **継続負荷で確実にサーマルスロットリングする**

- 30B 以上のモデルで **10分以内にクロックダウン** の報告（DGX Spark 初期ロットで複数）

- NVIDIA は 2026年1月ファームウェア（580.95.05）で改善したが、**「公称240W」と「実測100W」の乖離**は消えてない

- つまり **「1 PFLOP 連続動作」は物理的に不可能**。ピーク性能と持続性能の区別が必須

**KT 視点の結論**: 「ハード選定は『ピーク性能』ではなく『持続性能 + コスト + 熱設計』で行うべき」。Surface Laptop Ultra の 18mm / 2kg / 公称45-80W のバランスは **「日常使いには最適、研究には不適」**。

数値の内訳

NVIDIA 公式「**1 PetaFLOP = FP4 (4-bit浮動小数点) + sparse (50%間引き)**」。これは「最も都合の良い条件」での値。

精度スパース性実効 TFLOPSDGX Spark 比
------------
FP4 (4-bit)sparse (50%)**1,000**公称値
FP4 (4-bit)dense**500**1/2
FP8 (8-bit)dense**250**1/4 (これが実用下限)
BF16 (16-bit)dense**125**1/8 (学習の下限)
FP32 (32-bit)dense**31**1/32 (RTX 5070 クラス)

 
**Mac Studio M3 Ultra FP16: ~27 TFLOPS** との比較を「26倍」と称していたが、これは **FP4 sparse vs FP16 dense** という最悪条件の比較。**公正な比較**は **FP8 dense 250 TFLOPS vs FP16 27 TFLOPS = 約9倍**。

これが意味すること

- **「1 PFLOP のすごさ」** を語るとき、**「どの精度で、どのスパース性で」** を必ず明示すべき

- 動画「競合の26倍」は完全な誤り

- **実用的な FLOPS$ 比較** では、DGX Spark の魅力は **「70B+ モデルが128GB に載る」** という **容量の制約** であり、**「1 PFLOP の速さ」ではない**

**KT 視点の結論**: FLOPS 値はあくまで **マーケティング指標**。実運用で効くのは **「メモリ帯域 × 容量 × 電力効率」** の3軸。DGX Spark は帯域で Mac Studio に3倍負けている。

推論の2フェーズ

- **Prefill (プロンプト処理)**: 計算量依存。行列演算で「全トークンを一気に処理」

- **Decode (トークン生成)**: **メモリ帯域依存**。1トークンごとに全パラメータを読む

実測値（公開ベンチマーク）

機種メモリ帯域GPT-OSS-120B decodeLlama 3.1 8B decode
------------
RTX 50901,792 GB/s(VRAM制約で不可)~140 tok/s
**Mac Studio M3 Ultra 192GB****819 GB/s****30-40 tok/s** (Q4量子化)**70-90 tok/s**
**Mac Studio M5 Ultra (噂)****1,100 GB/s****45-55 tok/s****100+ tok/s**
RTX Spark ノート~600 GB/s(推定) 22-30 tok/s(推定) 50-65 tok/s
**DGX Spark****273 GB/s****55 tok/s** (MXFP4, NV公式)**38 tok/s** (NV公式)

 
**衝撃の事実**: **Mac Studio M3 Ultra 192GB は DGX Spark 128GB より 120B モデルの decode が遅い (40 vs 55 tok/s)** が、**8B モデルでは2倍速い (90 vs 38 tok/s)**。

Decode phase 速度の支配方程式

decode_time_per_token = (model_size_bytes) / memory_bandwidth

 

- 120B モデル (60GB in FP16) を 819 GB/s で読む = 73ms/トークン = **約14 tok/s** が上限

- DGX Spark 273 GB/s で 60GB を読む = 220ms/トークン = **約4.5 tok/s** が物理上限

- 実測 55 tok/s は **MXFP4 量子化** で 15GB 相当になっているから高速

**つまり「帯域 × 容量」の積が推論体験を決める**。DGX Spark は容量 (128GB) に振り、Mac Studio は帯域 (819 GB/s) に振った。**両者は直交する最適化**。

**KT 視点の結論**:

- 8B-32B モデル中心なら **Mac Studio 圧勝** (帯域)

- 70B+ モデル中心なら **DGX Spark が必要** (容量)

- 「1台で全部」は **M5 Ultra 512GB (1,100 GB/s + 512GB)** だけが解決する = **2026年Q4 待ちが正解**

4号機の物理性能

- M1 Max 10-core CPU + 32-core GPU

- 64GB unified memory (LPDDR5, 推定 400 GB/s)

- 電力: システム全体 ~50W (アイドル10W)

- macOS 15.x

4号機で動くモデルの現実

モデルサイズ量子化4号機 decode実用性
------------
7B (Llama 3.1 8B)Q450-60 tok/s◎ 快適
14B (Qwen3 14B)Q430-40 tok/s○ 使える
32B (Qwen3 32B)Q415-20 tok/s△ 遅い
70B (Llama 3.1 70B)Q45-8 tok/s× 実用外
120B (GPT-OSS 120B)Q4動かない (容量不足)×

 
**4号機の限界**: **32B が実用上限、70B は無理**。これが「DGX Spark を追加で欲しくなる」理由。

4号機の優位性

- **完全無音** (アイドル 1.6W 音圧、ファン無音)

- **省電力** (50W vs DGX Spark 240W = 1/5)

- **MLX 最適化** (Apple の独自フレームワーク、Llama 3.1 8B で70 tok/s)

- **fabric 統合** (~/fabric/ 永続層として稼働)

- **Hermes Agent 稼働中** (Port 8642)

**KT 視点の結論**: 4号機は **「日常の fabricOS ノード」** として完成形に近づいてる。**不足分は DGX Spark 1台で補える**。**M5 Ultra は「4号機の完全上位互換」が出るまで待つ**。

エコシステムの成熟度

2026年6月時点の実情

観点CUDA (NVIDIA)MLX (Apple)
---------
歴史17年 (2007〜)2年 (2023〜)
フレームワークPyTorch, JAX, TensorRT, vLLM, SGLang, llama.cppllama.cpp, Ollama, LM Studio, mlx-lm
モデル即日対応◎ (大半のOSSモデル)△ (mlx-lm 変換待ち、数日)
エージェント基盤◎ (OpenShell, Hermes Agent, OpenClaw)○ (Apple Intelligence, MLX Agents)
開発者ドキュメント◎ (20年蓄積)○ (2年分)
パフォーマンス◎ (TensorRT 最適化)○ (M3 Ultra で競合並)
電力効率× (240W vs 190W)◎ (50-190W)
エコシステム総数数百万のライブラリ数千のライブラリ

 
- **「日常会話 + コード補完 + ドキュメント検索」**: どちらでも同じ

- **「100B+ モデルの fine-tuning」**: CUDA のみ (MLX はまだ実装弱い)

- **「マルチモーダル (Vision, Audio)」**: 互角 (両者とも transformers ベース)

- **「Stable Diffusion / ComfyUI」**: CUDA 圧勝 (SDPA, xformers が CUDA 前提)

- **「音声認識 (Whisper)」**: 互角

- **「ベクトル検索 (Qdrant, Weaviate)」**: 互角 (CPU 部分が支配的)

**KT 視点の結論**: **2026年6月時点で「LLM だけ」なら MLX で十分**。**「Stable Diffusion + 画像生成 + 動画生成」** まで含めるなら **CUDA 必須**。**4号機で MLX + 4号機に GPU 増設 or 別機で CUDA** が現実解。

価格帯別マトリクス

艦隊構成 (2026年〜2027年 KT 推奨)

[今あるもの - 即戦力]
4号機 (M1 Max 64GB)        - fabricOS プライマリ、Telegram UI
1号機 (M1 16GB)             - オーケストレータ
2号機 (i9 32GB)              - セキュアチャネル
3号機 (M4 16GB)              - インフラ復旧

[2026年Q4 追加]
Mac Studio M5 Ultra 256GB   - 4号機の後継 fabricOS プライマリ (1,100 GB/s)
                              4号機は sub-agent / モバイル用に格下げ

[2027年Q2 追加]
DGX Spark 128GB (Linux)     - CUDA 開発 / Fine-tuning / 巨大モデル
                              4号機とは別の部屋に配置

[2027年Q4 検討]
DGX Spark 2台クラスタ (256GB) - 405B モデル対応
                              RTX Spark 第2世代を評価

 

 

予算構成性能おすすめ用途
------------
**$0 (今あるもの)**4号機 M1 Max 64GB8B-32B、8-50 tok/s日常会話、コード補完、ドキュメント検索
**$2,500**RTX 5090 ワークステーション32B Q4 で 100+ tok/s、ComfyUI 最速画像生成中心、軽い LLM
**$4,000**Mac Studio M3 Ultra 192GB32B-70B Q4 で 30-50 tok/sLLM + クリエイティブ
**$4,700**DGX Spark 128GB70B-200B Q4、CUDA 開発巨大モデル研究開発
**$5,500**Mac Studio M3 Ultra 192GB (上位)70B+ まで実用妥協なしの LLM + 動画制作
**$10,000+**Mac Studio M3 Ultra 512GB405B Q2 で 20-25 tok/s大規模研究のみ
**$7,000+ (2026 Q4)**Mac Studio M5 Ultra 256GB (予定)70B+ 帯域 1,100 GB/s**本命。次世代 fabricOS ノード**
**$10,000+ (2026 Q4)**Mac Studio M5 Ultra 512GB (予定)405B+ も 40+ tok/sfabricOS プライマリの本命

 
**総投資**: $9,000-15,000 (2年間)

**故障時**: 4号機 or M5 Ultra のどっちか落ちても、他機で継続可能 (fabric 同期)

YouTube動画は「100万トークンで 120B」と煽ったが、実態は：

実運用での使い分け

項目値注意点
---------
モデルサイズGPT-OSS 120B = 117B params (MoE 5.1B active)MoE なので「全パラメータが動く」わけではない
メモリ必要量60-65GB (MXFP4)DGX Spark 128GB に余裕で乗る
コンテキスト長1M tokens (公式主張)実測では 100K-200K で 10-20 tok/s に低下
decode 速度55 tok/s (短コンテキスト)100K+ コンテキストで 5-10 tok/s
実用性△「100万トークン常時」は電気代・速度的に現実的でない

 
- **8B-32B**: 日常は 4号機 / M5 Ultra で十分。50+ tok/s

- **70B-120B**: 専門タスクのみ。10-20 tok/s で我慢

- **200B+**: DGX Spark クラスタ必須。月数回の利用

- **405B+**: クラウド API (OpenAI, Anthropic) で十分。ローカルの意味薄い

**KT 視点の結論**: 「120B を動かせる」は大事だが、**「日常で 120B を使う」のは無意味**。**30B で十分なタスクが 90%、120B が必要なのは 10%**。**10% のために 128GB マシン買うのは過剰**。

実機消費電力（実測ベース）

クラウド API との比較

機種アイドル軽負荷フルロード年間電気代 (24h)
---------------
4号機 (M1 Max 64GB)10W30W50W¥1,800 (月150円)
Mac Studio M3 Ultra20W80W190W¥6,800 (月570円)
Mac Studio M5 Ultra (噂)20W80W190W¥6,800
**DGX Spark**30W100W**240W公称/100W実測**¥4,400 (月370円)
RTX 5090 ワークステーション50W200W575W¥20,700 (月1,725円)
Surface Laptop Ultra (RTX Spark)5W20W80W¥2,900 (月240円)
シナリオコスト
------
GPT-4o 月100万トークン (OpenAI API)$30-60/月
Claude 3.5 Sonnet 月100万トークン$20-50/月
**Mac Studio M3 Ultra 5年償却**$91/月 ($5,500/60)
**DGX Spark 5年償却**$78/月 ($4,700/60)
**4号機 (既存)**$0 (既に持ってる)

 
**損益分岐**: 月$20 以上 AI サブスクを払ってるなら、**Mac Studio 1台買う方が得**。

**KT 視点の結論**: 個人 PC での LLM 運用は **サブスクより経済的に正しい選択**。**M5 Ultra は損益分岐まで1年**。4号機の電気代 (月150円) は誤差レベル。

必要コンポーネント

- Alpine Linux (200MB ISO)

- Python 3.12 + asyncio

- 1プロセス: 入力待ち + LLM ループ + ツール実行 + 出力

- nginx (reverse proxy)

- fabric (git 管理の永続層)

- 各 tool は HTTP API として登録

動作フロー

[入力] Telegram bot がユーザーからメッセージ受信
   ↓
[計算] fabricos core process
   - state.json を fabric から読み出し
   - LLM に「意図解釈 + ツール選択」を依頼
   - ツール実行 (sandbox 内で)
   - 結果を state.json に保存
   ↓
[出力] Telegram bot が結果を返信、fabric にも書き出し
   ↓
[通信] 艦隊メンバーに必要なら RPC、git pull/push

 

**実装の鍵**: 既存の **Hermes Agent (Port 8642)** がこの大部分を実装済み。**新タスクは「GUI を捨てて TUI / Telegram に絞る」**だけ。

**開発期間**: 5-6週間 (平日夜 + 週末) で **MVP 完成圏**。

5つの命題

1. **「1 PFLOP = 競合の26倍」は誤り**。**実用 FP8 で 250 TFLOPS、競合の9倍** が公正な値

2. **メモリ帯域が決定要因**。**Mac Studio M3 Ultra (819 GB/s) は DGX Spark (273 GB/s) の 3倍速い** decode phase

3. **DGX Spark は「70B+ モデル専用機」**。**4号機で日常、DGX Spark で研究** の役割分担

4. **CUDA は依然有利**。**「LLM だけ」なら MLX で十分だが、画像生成 / Fine-tuning は CUDA 必須**

5. **fabricOS は技術的に 5-6週間で作れる**。**4号機の既存 Hermes Agent が 80% の実装済み**

4号機の今後 (技術層)

- 2026年Q4: M5 Ultra Mac Studio へ移行 (1,100 GB/s、256GB)

- 2027年Q2: DGX Spark 1台追加 (CUDA 開発用)

- 4号機: モバイル / サブエージェント用に格下げ

- 全資産: $9,000-15,000 (2年間)

次のステップ

- ✅ 基本検証記事 (~/fabric/2026-06-02_rtx_spark_dgx_spark_verification.md) 完了

- ✅ 技術巻 (本書) 完了

- ⏳ 哲学巻 (次)

- ⏳ 戦略巻 (その次)

- ⏳ fabricOS 試作 (実装フェーズは戦略巻で詳細)

---
*この記事は note.com から KTBLOG に移行されました。元記事: https://note.com/famous_prawn2009/n/n4225f55b7455*