---
title: "【M1 Mac 64GB × GPT-SoVITS】note記事を完全自動でポッドキャスト化してYouTubeにアップロードする「最強の自主運用パイプライン」の全貌"
date: 2026-07-02
category: "Tech"
eyecatch: "/assets/eyecatch/pipeline-podcast.jpg"
excerpt: "M1 Mac 64GBユニファイドメモリでGPT-SoVITSをローカル実行し、note記事を自動で音声合成→動画化→YouTube投稿する完全無料パイプラインの構築方法を詳解。ElevenLabs不要。"
tags: ["GPT-SoVITS", "M1 Mac", "音声合成", "ポッドキャスト", "YouTube", "AI", "自動化", "パイプライン", "ローカルAI", "映像", "Apple", "プログラミング"]
---

# 【M1 Mac 64GB × GPT-SoVITS】note記事を完全自動でポッドキャスト化してYouTubeにアップロードする「最強の自主運用パイプライン」の全貌

元記事: https://note.com/famous_prawn2009/n/nbbb1bdc32646

## なぜ「M1 Mac 64GB × GPT-SoVITS」が最適なのか

**ElevenLabs**は高品質だが、個人が毎日記事をポッドキャスト化するには3つの壁がある：料金、文字数制限、英語風アクセント。

### 1. メモリ64GBの破壊力
AppleシリコンのユニファイドメモリはCPUとGPUが共有。64GBあれば巨大な音声モデルもVRAM不足エラーなしで常駐・処理可能。

### 2. GPT-SoVITSの本人再現度
わずか1分の録音データで「喋り方のクセ」「呼吸」「声色」を完璧コピー。日本語読み上げ精度が非常に高く、不自然な訛りを排除。

## パイプラインアーキテクチャ

1. 新着note記事を検出
2. 記事本文を抽出
3. GPT-SoVITS API（ポート9880）にテキスト送信
4. 生成音声を動画編集ソフト/FFmpegで動画化
5. YouTube APIで自動アップロード

## Python核心コード

```python
import requests
from youtube_upload.client import YoutubeUploader

GPT_SOVITS_URL = "http://localhost:9880"

def text_to_speech(text, speaker="narator"):
    params = {"text": text, "text_lang": "ja", "char": speaker}
    r = requests.get(f"{GPT_SOVITS_URL}/tts", params=params)
    with open("output.wav", "wb") as f:
        f.write(r.content)
    return "output.wav"
```

## おわりに

ElevenLabsに課金する代わりに、M1 Mac 64GBという手元のハードウェアとオープンソース技術を組み合わせて「完全無料・超リアル・フルオートメーション」なシステムを構築する楽しさを。

まずはGPT-SoVITSの環境構築から始めてみよう。

---

元記事: https://note.com/famous_prawn2009/n/nbbb1bdc32646

