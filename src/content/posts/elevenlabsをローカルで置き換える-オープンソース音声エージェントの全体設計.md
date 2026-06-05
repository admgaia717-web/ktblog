---
title: "ElevenLabsをローカルで置き換える——オープンソース音声エージェントの全体設計"
date: 2026-06-04
slug: elevenlabsをローカルで置き換える-オープンソース音声エージェントの全体設計
category: "note.com"
eyecatch: "/assets/eyecatch/nefdce6df251e.png"
---

# ElevenLabsをローカルで置き換える——オープンソース音声エージェントの全体設計

> 出典: note.com / 2026-05-03

## ElevenLabsをローカルで置き換える——オープンソース音声エージェントの全体設計

ElevenLabs Agentsがコールセンター業界を揺るがしている。$0.08/min、70+言語対応、GPT/Claude/Geminiと接続可能。RevolutやCiscoが導入済み。

しかし、**この仕組みは完全にローカルで再現できる**。月額コストはゼロ。すべてオープンソースで実現可能だ。

本記事では、ElevenLabs互換のローカル音声エージェントを構築するためのアーキテクチャ設計図を提示する。

## 全体アーキテクチャ

音声エージェントは4つのレイヤーで構成される。

**①イングレス層（入力）**

SIP/VoIPゲートウェイ（Asterisk）またはWebSocketサーバー（FastAPI）で通話を受ける。電話回線とも接続可能。

**②音声認識層（STT）**

音声をテキストに変換する。MistralのVoxtral 4Bが最有力候補。レイテンシ約70msで9言語に対応する。Apple Silicon（MLX）でそのまま動く。faster-whisperやMoonshineも選択肢。

**③推論エンジン（LLM）**

Ollama経由でQwen 2.5、Llama 3.x、DeepSeekなどを実行する。ローカルGPU（Apple Siliconの統合メモリ）で動作。APIキー不要。

**④音声合成層（TTS）**

テキスト応答を音声に変換する。Kokoro 82M（高品質・多言語）、CosyVoice 2（声のクローン対応）、Voxtral TTS（超低遅延70ms）、Piper TTS（超軽量）から選択する。

## データフロー：リアルタイム通話の流れ

通話中のデータの流れは以下の通りだ。

1. ユーザーが話す → 音声ストリームがイングレス層に到達

2. VAD（Silero VAD）が発話区間を検出 → 無音部分をカット

3. STT（Voxtral）が音声をテキストに変換（~70ms）

4. LLM（Qwen/Ollama）が応答を生成（~200ms）

5. TTS（Kokoro）が応答テキストを音声に変換（~100ms）

6. 音声がユーザーに届く

**総合レイテンシ目標：500ms以下**。ElevenLabsとほぼ同等の応答速度だ。

## TTSエンジン比較表

主要なTTSエンジンを比較する。

**Kokoro 82M** — 品質★★★★★、遅延~100ms、8+言語対応、VRAM 2GB、GitHub ⭐6,849

最もバランスが良い。音質が非常に高く、軽量。

**CosyVoice 2**（アリババ） — 品質★★★★★、遅延~150ms、10+言語対応、声クローン10秒で可能、VRAM 4GB、GitHub ⭐20,844

声のクローン機能が強力。10秒の音声サンプルで任意の声を再現できる。

**Voxtral TTS**（Mistral） — 品質★★★★☆、遅延~70ms、9言語対応、VRAM 8GB

最も低遅延。リアルタイム対話に最適。ただしVRAM要求が大きい。

**Piper TTS** — 品質★★★☆☆、遅延~30ms、30+言語対応、VRAM 200MB

最も軽量。Raspberry Piでも動く。品質は控えめだが、十分実用的。

**XTTS v2**（Coqui） — 品質★★★★☆、遅延~200ms、17言語対応、声クローン対応、VRAM 4GB

コミュニティが成熟している。utorialsや統合例が多い。

## コスト比較：ElevenLabs vs ローカル

ElevenLabsの$0.08/minは、1日8時間利用で月額約$1,152（約17万円）。年間で約$13,824（約200万円）。

ローカル構築の場合、**月額コストはゼロ**。ハードウェアは既にあるApple Silicon Macを使えば追加投資なし。GPUサーバーを立てるなら初期投資で数十万円だが、1年で元が取れる計算だ。

## M1 Max 64GBでの推奨構成

4号機（M1 Max 64GB）で実行する場合の推奨構成。

**STT:** Voxtral 4B（MLX版）— メモリ約8GB

**LLM:** Qwen 2.5 14B（Q4_K_M量化） — メモリ約8GB

**TTS:** Kokoro 82M — メモリ約2GB

合計メモリ使用量は約20GB。64GBあるので余裕を持って同時動作する。

フレームワークはHuggingFaceの「speech-to-speech」を使う。オープンソースで、STT→LLM→TTSのパイプラインをまとめて構築できる。GitHub ⭐4,704。

## 主要プロジェクト一覧

**音声エージェントプラットフォーム**

・huggingface/speech-to-speech（⭐4,704）— HF公式。ローカル音声エージェント構築フレームワーク

・rapidaai/voice-ai（⭐593）— エンドツーエンド。STT+TTS+VAD+エージェント管理

・dograh-hq/dograh（⭐428）— オープンソース音声エージェントプラットフォーム

・echokit_server（⭐562）— オープンソース音声エージェントプラットフォーム

**STT（音声認識）**

・Voxtral 4B — Mistral。70ms遅延。mlx対応

・RealtimeSTT（⭐9,757）— 低遅延。VAD+ウェイクワード対応

・Moonshine — 超低遅延。音声エージェント向け設計

・faster-whisper — OpenAI Whisperの最適化版

**TTS（音声合成）**

・Kokoro 82M（⭐6,849）— 最高品質バランス

・CosyVoice 2（⭐20,844）— 声クローン最強

・RealtimeTTS（⭐3,889）— リアルタイム合成特化

・Piper TTS — 超軽量

・TTS-WebUI（⭐3,106）— 全TTSエンジン統合WebUI

## 実装のポイント

**レイテンシが最重要**。ユーザー体験を決めるのは応答速度だ。STTとTTSは低遅延モデルを優先選択すべき。

**Voxtral 4Bが新時代の鍵**。STTとTTSの両方を70msで処理できるモデルは初めて。Mistralの力作だ。

**声のクローンが必要ならCosyVoice**。10秒の音声サンプルで任意の声を再現できる。ブランドボイスや特定人物の声が必要なケースで有効。

**最小構成ならPiper + faster-whisper**。Raspberry Piでも動く超軽量構成。コスト重視ならこれで十分。

## おわりに

ElevenLabsの技術は素晴らしいが、オープンソースコミュニティが急速に追いついている。2026年現在、ローカルで同等の品質を実現できるレベルに達した。

$0.08/minを払い続ける必要はない。あなたのマシンの上で、今すぐ音声エージェントを動かせる。

設計図のMermaid版は以下で公開している。

[GitHub: voice-agent-architecture](https://github.com)

---
*この記事は note.com から KTBLOG に移行されました。元記事: https://note.com/famous_prawn2009/n/nefdce6df251e*