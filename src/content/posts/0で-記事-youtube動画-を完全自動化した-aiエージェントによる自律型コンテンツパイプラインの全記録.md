---
title: "¥0で「記事→YouTube動画」を完全自動化した——AIエージェントによる自律型コンテンツパイプラインの全記録"
date: 2026-06-04
slug: 0で-記事-youtube動画-を完全自動化した-aiエージェントによる自律型コンテンツパイプラインの全記録
category: "note.com"
eyecatch: "/assets/eyecatch/ne1a364da5ca2.png"
---

# ¥0で「記事→YouTube動画」を完全自動化した——AIエージェントによる自律型コンテンツパイプラインの全記録

> 出典: note.com / 2026-05-09

## ¥0で「記事→YouTube動画」を完全自動化した——AIエージェントによる自律型コンテンツパイプラインの全記録

**要約：** AIエージェントのみで、note記事の抽出→AI音声化→画像生成→字幕→動画化→YouTube公開までを完全自動化するパイプラインを**¥0・3分/記事**で構築した。処理時間は従来の手動編集の**約1/25**。全コードはOSS（edge-tts, ComfyUI SDXL, Whisper, FFmpeg）のみで構成。YouTube OAuthの3段階認証という実運用上の壁の突破方法も含めた技術ドキュメント。

## 1. 着想：Descriptの分解

2026年5月9日。OpenRouterのAPI利用ランキングで5位（48.9Bトークン/月）にランクインしたDescript（AI動画編集ツール）の調査から始まった。Princeton/GA TechのGenerative Engine Optimization論文（KDD 2024, arXiv:2311.09735）が示すように、今日のAIツールは「分解→OSS再構築」によって大幅なコスト削減が可能だ。

Descriptの機能を分解した結果：

**• 文字起こし** → OpenAI Whisper（OSS・完全無料）

**• 音声合成** → Microsoft edge-tts（APIキー不要・無制限無料）

**• 動画編集** → FFmpeg（世界最強OSS）

**• 画像生成** → ComfyUI + Stable Diffusion XL Lightning（ローカル・1枚8秒）

**• 字幕生成** → Whisper tiny（14分の音声を1分で字幕化）

## 2. パイプライン設計：5ステップの自動化

各ステップは以下のOSSツールで構成され、総コストは**¥0**、処理時間は**3〜5分/記事**。比較対象として、人間が同じ作業をすると**2〜4時間**かかる。

**Step 1** — note.com API v3で記事HTMLを取得。curl + JSON パースのみ。

**Step 2** — edge-tts（Microsoft提供・無料）のja-JP-NanamiNeuralボイスで全文を音声化。14分の記事が14分のポッドキャストになる。スピードレート+10%で自然な速さに。

**Step 3** — 記事のh2セクション（平均5つ）ごとにComfyUI SDXL Lightningで画像生成。1枚8秒、全5枚で40秒。4号（M1 Max 64GB）のComfyUIをSSH経由で遠隔利用し、ローカルのリソースを消費しない。

**Step 4** — FFmpegで画像スライドショー＋音声を結合。解像度1280×720、24fps、H.264エンコード。37MB/14分の動画が生成される。

**Step 5** — YouTube Data API v3でアップロード＋メタデータ設定＋カスタムサムネイル＋字幕。OAuth 2.0トークンは初回認証後、リフレッシュトークンで永続的に自動更新。

## 3. 技術的障壁：YouTube OAuthの3段階認証

YouTube Data API v3のOAuth実装で遭遇した最大の障壁は、権限スコープの**段階的な不足**だった。

**1回目**：youtube.uploadスコープのみ取得 → 動画アップロードは成功。しかしメタデータ（タイトル・説明文）更新が403エラー（insufficient scope）。

**2回目**：youtubeスコープ（フルアクセス）取得 → メタデータ更新は成功。しかしサムネイル設定が「カスタムサムネイル権限なし」エラー。YouTubeアカウントの電話番号認証（SMS）が別途必要だった。

**3回目**：youtube.force-ssl + youtubepartnerを含む**4スコープ一括取得** → すべて成功。教訓：初回セットアップ時に全権限を一括で取得する設計が必須。

この知見はOAuth実装全般に応用可能だ。特にAIエージェントが自律的にAPIを操作する場合、権限不足のエラーは人間よりも回復が難しいため、**初回で最大権限を取得する「全部盛り戦略」**が最適解である。

## 4. 1号・4号連携：ComfyUI自動検出

パイプラインは1号（M4 Mac mini）と4号（M1 Max spock）のどちらからでも実行可能。ComfyUIの自動検出ロジックは以下の優先順位で動作する：

**1.** localhost:8188にComfyUIが応答 → ローカル生成

**2.** SSH経由でspockに接続 → リモート生成 → SCPで画像取得

**3.** 両方不可 → Pollinations.ai（無料API）にフォールバック

この設計により、**マシンの状態に依存しない耐障害性**を確保している。

## 5. コスト構造：本当に¥0の内訳

月30本の動画を生成した場合のコスト：

**edge-tts**：Microsoft提供、API制限なし、完全無料。日本語品質はNanamiNeuralが十分に自然で、人間のナレーションとの区別が困難なレベル。

**ComfyUI SDXL Lightning**：4号M1 Max 64GBで1枚8秒。1本5枚で40秒。電気代は40W×40秒×30本 = 約0.013kWh/月 ≒ **¥0.4/月**。

**Whisper tiny**：ローカル実行。14分の音声を約1分で処理。M4のNeural Engineで高速化。

**FFmpeg**：OSS。H.264エンコードはM4/M1 Maxのハードウェアエンコーダ（VideoToolbox）を使用。

**YouTube API**：無料クォータ10,000ユニット/日。動画1本あたり約1,600消費 = **1日6本まで完全無料**。

**総計：¥0/月（電気代含めて実質無料）**

## 6. 成果物と今後の展開

パイプラインで生成した実績：

• Descript徹底解剖（14分44秒）→ https://youtu.be/t3O0eY4z7t4

• パイプライン全記録（12分）→ https://youtu.be/QWZmw0Fc-Zc

今後の拡張計画：

• Spotify播客（Anchor API）同時投稿

• Rumble/Odysee分散配信対応

• 完全cron自動化（記事公開検知→即動画化→マルチプラットフォーム配信）

• 多言語翻訳＋多言語字幕（1記事→10カ国語動画）

• ClawRouter（x402/USDCマイクロペイメント）連携でLLMコスト最適化

## 7. 技術スタック詳細

**全文OSS構成：**

• テキスト抽出: note.com API v3 (Public)

• TTS: edge-tts 7.2.8 (MIT互換)

• 画像生成: ComfyUI + SDXL Lightning 4step

• 字幕: OpenAI Whisper tiny

• 動画: FFmpeg 8.0.1

• アップロード: YouTube Data API v3（Google公式）

• 認証: OAuth 2.0 + pickle永続化

• マシン連携: SSH + SCP + auto-detect

**コード量**：メインパイプライン ~500行（Python）、YouTube認証 ~150行。全コードはMITライセンスで公開予定。

## 参考・引用

• Princeton/GA Tech GEO: "Generative Engine Optimization" (KDD 2024, arXiv:2311.09735) — GEOの9手法、PAWC指標、GPT-3.5/Perplexity検証

• AutoGEO (CMU, ICLR 2026) — GRPO学習によるGEO自動化フレームワーク

• x402 Protocol — AIエージェント向けUSDCマイクロペイメント（x402.org）

• ClawRouter (BlockRunAI, GitHub 6,500+ stars) — エージェント向けLLMルーター、x402/USDC対応

---
*この記事は note.com から KTBLOG に移行されました。元記事: https://note.com/famous_prawn2009/n/ne1a364da5ca2*