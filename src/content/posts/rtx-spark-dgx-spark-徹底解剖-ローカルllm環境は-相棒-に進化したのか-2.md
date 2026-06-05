---
title: "RTX Spark / DGX Spark 徹底解剖 ─ ローカルLLM環境は「相棒」に進化したのか"
date: 2026-06-04
slug: rtx-spark-dgx-spark-徹底解剖-ローカルllm環境は-相棒-に進化したのか-2
category: "RTX Spark"
eyecatch: "/assets/eyecatch/nad8be9dd4dfb.png"
---

# RTX Spark / DGX Spark 徹底解剖 ─ ローカルLLM環境は「相棒」に進化したのか

> 出典: note.com / 2026-06-02

━━━ RTX Spark 検証 4部作 ━━━

第零巻 検証の巻 — YouTube動画「PCが道具から相棒に変わる」の主張を技術的に検証

# 【検証記事】RTX Spark / DGX Spark 徹底解剖 ─ ローカルLLM環境は「相棒」に進化したのか

この2つは同じ「GB10 Grace Blackwell スーパーシップ」を搭載するが、フォームファクタが違う。

- **DGX Spark**：デスクトップ型、240W、273 GB/s、$3,999-4,699、発売済

- **RTX Spark**：ノートPC・小型デスクトップ向け、45-80W、~600 GB/s、2026年秋発売

- Jensen Huang公式：**「RTX Spark (N1/N1X) = GB10 = DGX Spark」**と確認済み

両者の性能差は電源と熱設計に由来する。YouTube動画が混同しているのはこの点。ノート版を「14mm・1.4kg・240W」と紹介しているが、実機のSurface Laptop Ultraは**18mm・2kg未満・公称45-80W**で、別物。

## 2. 元動画の嘘・誇張を暴く

日本のYouTube動画は軒並み「革命的」と煽っていたが、冷静に検証すると問題が多い。

❌ 嘘その1：「14mmノートで240W、丸1日バッテリー」

DGX Spark（**デスクトップ**）が240W。RTX Spark（**ノート**）は45-80Wの電力プロファイル。両者を混同している。**14mmで240Wは技術的に不可能**。Surface Laptop Ultraの公式仕様は18mm未満、2kg未満。

❌ 嘘その2：「1 PetaFLOP = 競合の26倍」

1 PFLOPは **FP4（4-bit浮動小数点）+ sparse（疎行列50%間引き）** という最も有利な条件での値。実用int8/FP8なら**約250 TFLOPS相当**。Apple M3 Ultra FP16（27 TFLOPS）との比較を「26倍」と称しているが、桁違いに条件が違う。

❌ 嘘その3：「$3,999で買える」

発売時のFounder's Editionは$3,999だったが、**2026年2月に$4,699へ値上げ**。OEM版（ASUS、MSI等）は$2,999から。混同されている。

❌ 嘘その4：「ゲーム1440p+100fps、12K動画編集」

GB10のGPU性能は**RTX 5070クラス**（FP32 31 TFLOPS）。RTX 5090（FP8 105 TFLOPS）の1/3以下。32GB VRAMに収まるモデルならRTX 5090の方が4倍速いトークン生成速度を出す。DGX Sparkが真価を発揮するのは**70B以上の巨大モデル限定**。

❌ 嘘その5：「2028年オフラインAIが標準」

希望的観測。根拠薄弱。DRAM供給危機でM5 Ultra Mac Studio自体が遅延、Apple・NVIDIA双方の量産に影響。**2028年どころか、2026年末でもRTX Spark第一世代は普及しない**可能性大。

⚠️ 重大懸念：John Carmack氏レビュー（2025年10月）

元id Softwareの天才がDGX SparkをXで酷評した。**実測消費電力が公称240Wではなく100W止まり、性能が公称の半分、サーマルスロットリング、自然再起動**。NVIDIAは2026年1月ファームウェアで改善したが、第一世代の初期品質問題は深刻だった。

## 3. 本当の性能差：メモリ帯域が決定要因

LLM推論は2つのフェーズに分かれる。

- **Prefill（プロンプト処理）**：計算量依存 → DGX Spark得意

- **Decode（トークン生成）**：**メモリ帯域依存** → Mac Studio得意

これが「DGX Sparkは遅い」と感じる根本原因。

機種メモリ帯域DGX Spark比
---------
Mac Studio M5 Ultra（噂）1,100 GB/s**4.0倍**
Mac Studio M3 Ultra819 GB/s3.0倍
Mac Studio M4 Max 128GB410-546 GB/s1.5-2.0倍
RTX Spark ノート~600 GB/s2.2倍
**DGX Spark****273 GB/s**1.0（基準）
RTX 5090（32GB VRAM）1,792 GB/s6.6倍

 
Ken Huang氏（2026年3月）の実測：**Mac Mini M4 64GB が DGX Spark 128GB より2倍速い**（Qwen3.5-35B トークン生成時）。「128GB積んでるから速い」は完全な誤り。

## 4. Mac Studio 128GB（実機・現在）との詳細比較

ここが本題。**「今、Mac Studio 128GBを持っている人がDGX Sparkを買うべきか」**の判断材料。

ケース別トークン生成速度（実測値ベース）

モデルDGX SparkMac Studio M3 Ultra 192GB差
------------
Llama 3.1 8B Q438 tok/s70-90 tok/sMac 2倍
Qwen3 32B Q49 tok/s18-22 tok/sMac 2倍
GPT-OSS 120B55 tok/s30-40 tok/s (Q4)**DGX 1.5倍**
Llama 3.1 405B動かない（クラスタ必須）**20-25 tok/s (Q2)****Macのみ可**

 
つまり：

- **70B以下**：Mac Studio が圧勝

- **120B**：DGX Spark が有利（メモリ容量のため）

- **405B以上**：Mac Studio 512GB のみが単体で動かせる

価格対性能

## 5. もう一つの盲点：CUDA vs MLX ソフトウェア成熟度

構成価格性能/コスト
---------
Mac Studio M3 Ultra 192GB$5,500前後◎
Mac Studio M4 Max 128GB$4,000前後○
DGX Spark 128GB$4,699△（CUDA価値込みで○）
Mac Studio M3 Ultra 512GB$10,000+△（特殊用途）
RTX 5090 ワークステーション$2,500-3,500**◎（32B以下最強）**

 
「アーキテクチャは統一された、ではソフトは？」

NVIDIA CUDA の強み

- 17年の蓄積、全論文・全OSSモデル即日動作

- vLLM、SGLang、TensorRT-LLM、ComfyUI 完全対応

- Hermes Agent、OpenClaw、Dify などエージェント系ほぼ全対応

- **Windows タスクバーから直接OpenShellでエージェント起動**（RTX Spark限定）

Apple MLX の現状

- 2023年登場、**まだ2年**

- llama.cpp / Ollama / LM Studio は対応

- 独自モデル（CoreML最適化）は強い

- サードパーティの成熟度はまだ3-5年遅れ

- ただし**Mac ネイティブ（Xcode、Swift）は不動の優位**

つまり、**「Unified Memory」=「Mac vs PC 対決」は終わったが、「CUDA vs MLX」=「Windows/Linux vs Mac」=「開発者 vs クリエイター」の構図は依然続いている**。これが日本YouTube動画で最も隠された論点。

## 6. あなたの「Mac Studio 128GB」次のアップグレード判断

Q1. 用途は？

- **生成AI開発・fine-tuning中心** → DGX Spark追加 or 既存GPU強化

- **長文LLM推論・エージェント運用中心** → M5 Ultra Mac Studio待ち

- **両方** → ハイブリッド（EXO Labs構成）

Q2. 予算は？

- **$4,000以下** → M3 Ultra 192GB（今、$3,999-5,500）か RTX 5090 ワークステーション

- **$4,000-7,000** → M5 Ultra 256GB（2026年Q4）または DGX Spark（今）

- **$10,000+** → Mac Studio M3 Ultra 512GB（今）または M5 Ultra 512GB（10月以降）

Q3. 待てる？

- **6ヶ月待てる** → M5 Ultra が最良の選択肢

- **今すぐ必要** → M3 Ultra 192GB（Mac派）or DGX Spark（CUDA派）

## 7. 私の結論：4つの命題

1. **「PCが相棒に」は誇張。2026年6月時点で「相棒」はまだ道半ば。** OpenShellとMicrosoft Security Primitivesは良い仕組みだが、エコシステム全体で成熟するには2-3年必要。

2. **NVIDIAのUnified Memory採用でMac特権は消滅。** アーキテクチャ的には等価。ただし**性能・容量・電力・静音では依然Mac優位**。M5 Ultra（1,100 GB/s）まで行くと「性能」だけ見ればMac圧勝。

3. **DGX Sparkは「CUDA開発者向けニッチ製品」。** 一般ユーザーが「120Bモデルを動かす」目的で買うと、帯域273 GB/sの遅さに失望する。**40 tok/s**で「相棒」と会話できると思うな。

4. **ベスト戦略は「待ち＋選択的購入」**。M5 Ultra 256GB（2026年Q4）+ 必要に応じてDGX Spark 1台追加。RTX Spark第一世代ノートPCは**2027年Q2まで待つ**べき。

## 8. 実用的アクションプラン

## 9. 元動画への最終評価

時期アクション投資
---------
2026年6-9月4号機（M1 Max 64GB）現状維持。Hermes Agent/ComfyUI運用継続$0
2026年Q4M5 Ultra Mac Studio 256GB 購入判断$5,000-7,000
2027年Q1M5 Ultra安定稼働後、4号機の役割を再定義$0
2027年Q2-Q3LLM研究本格化なら DGX Spark 1台追加$4,000-5,000
2027年Q4必要なら DGX Spark 2台クラスタ or RTX Spark第2世代$4,000-8,000
**総投資（2年）****$9,000-15,000**

 
あのYouTube動画の問題は、**NVIDIA公式発表の数字を「都合よく」繋ぎ合わせただけ**であること。以下の事実を意図的に隠している：

- 273 GB/s帯域の遅さ

- Mac Studio の3倍速い実測トークン速度

- DGX Spark 128GB 容量の壁（405B非対応）

- Carmack氏が報告した実機品質問題

- DRAM供給危機による競合他社の発売延期

- Prism エミュレーションの互換性リスク

- CUDA vs MLX のソフト成熟度差

「道具から相棒へ」は美しいキャッチコピーだが、**工学的にはマーケティング**。2026年6月時点で「真の相棒」はM5 Ultra Mac Studio 512GBまたは将来のRTX Spark第2世代を待つべき。今買うなら**「学習と実験のための先行投資」**と割り切ること。

## 10. 参考文献・データソース

- NVIDIA公式 DGX Spark datasheet (2025-10)

- NVIDIA Blog "How NVIDIA DGX Spark's Performance Enables Intensive AI Tasks" (2026-02-11)

- Ollama Blog "NVIDIA DGX Spark performance" (公式ベンチマーク)

- LMSYS Blog "Optimizing GPT-OSS on NVIDIA DGX Spark" (2025-11-03)

- StorageReview, ServeTheHome, Tom's Hardware (Carmack氏レビュー)

- Microsoft Surface Laptop Ultra 公式発表 (2026-06-01)

- Exxact, Skorppio, Bizon-tech, ToolHalla (ベンチマーク比較)

- Ken Huang Substack "Mac Mini M4 beats DGX Spark" (2026-03-15)

- EXO Labs "DGX Spark + Mac Studio = 2.8x faster" (2025-10)

- Billy Newport Medium "M3 Ultra Mac Studio misses the mark" (2025-04)

- Bloomberg, Macworld, Wccftech (M5 Ultra 発売延期報道)

**作成完了日: 2026-06-02**

**次のアクション: WWDC 2026 (6/8-12) でM5 Ultra発表を監視**

▶ 次巻: [第1巻 技術の巻「メモリ帯域がすべてを決める」]()

---
*この記事は note.com から KTBLOG に移行されました。元記事: https://note.com/famous_prawn2009/n/nad8be9dd4dfb*