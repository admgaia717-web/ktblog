---
title: "【至急改善】リサーチインスティチュート — 現状の問題点と即時改善計画"
date: 2026-06-13
slug: research-institute-improvement-plan
category: "research"
eyecatch: "/assets/eyecatch/hero-local-ai.png"
---

# 【至急改善】リサーチインスティチュート — 現状の問題点と即時改善計画

> 2026-06-13 | リサーチインスティチュート by KT Fleet

## 現状の反省点（テスト投稿Ⅰ・Ⅱを受けて）

テスト投稿2回で判明した問題：

1. **エージェントリーチ未実施** — モデルの実機評価がゼロ。ベンチマークだけでは「使える」の判断ができない
2. **データソース不足** — OpenRouterしか見ていない。GitHub Models, Groq, Together AI, NVIDIA NIM 未調査
3. **差分検知がない** — 昨日の無料一覧と今日の差分を自動比較する仕組みがない
4. **定性評価がない** — X/Redditでの生の声を拾えていない
5. **プロバイダー×モデルのクロス分析が浅い** — 同じモデルが別プロバイダーでいくらかを比較できていない
6. **価格のスケール感が不明瞭** — $0.098/M が「安い」のか「高い」のか、基準がない
7. **自動化されていない** — 手動でデータ取って手動で投稿している

---

## 即時改善計画

### ① エージェントリーチの実装

艦隊の既存エージェントを使ってモデルを実機評価する。

| 評価項目 | 方法 | 使用エージェント |
|---------|------|----------------|
| コーディング | 簡単なコード生成タスクを実行 | 4号機 Hermes |
| 日本語品質 | 日本語指示への応答精度 | 全エージェント |
| 速度実測 | tokens/sec 計測 | 4号機 CLI |
| ツール使用 | function calling テスト | Mr.Kato / Lightning |

**優先度: 🔴 最優先**
**工数: 2時間**

### ② 他プロバイダー調査

| プロバイダー | 調査項目 | 方法 |
|------------|---------|------|
| GitHub Models | 無料モデル一覧・レート制限 | API調査 |
| Groq | 無料ルート・速度 | API `/v1/models` |
| Together AI | 無料枠の有無 | API調査 |
| NVIDIA NIM | Nemotron系無料API | API調査 |
| DeepSeek公式 | チャット無料枠 | Web調査 |
| Kimi/Moonshot | K2.7無料提供 | Web調査 |

**優先度: 🟡 高優先**
**工数: 3時間**

### ③ 差分検知エンジン

```
昨日のfreeリスト.json
        ↓ diff
今日のfreeリスト.json
        ↓
新登場モデル → アラート
価格変動モデル → 記録
消えたモデル → アーカイブ
```

**優先度: 🟡 高優先**
**工数: 2時間**

### ④ 定性評価パイプライン

- X/Twitter: AI関連アカウントのポストを収集
- Reddit r/LocalLLaMA: モデル評価スレッド
- HuggingFace: トレンドモデル検知

**優先度: 🟢 中優先**
**工数: 3時間**

### ⑤ 自動投稿パイプライン

```
cron (2/8/12/17/22時)
  → データ収集（OpenRouter API + 差分検知）
  → テンプレートに流し込み
  → GitHub push → Cloudflare Pages auto-deploy
```

**優先度: 🟢 中優先**
**工数: 4時間**

---

## 全体スケジュール（目標）

| フェーズ | 内容 | 期限 |
|---------|------|------|
| 🔴 0.5 | **エージェントリーチ**（まずNemotron 3 Ultraを実機評価） | 本日中 |
| 🟡 1 | **他プロバイダー調査** + プロバイダー×価格マトリクス拡充 | 明日朝刊まで |
| 🟡 2 | **差分検知エンジン** 初動 | 明日中 |
| 🟢 3 | **自動投稿cron**設定 | 今週中 |
| 🟢 4 | **定性評価** + **Head切替** | 来週 |

---

## 最初のアクション（今すぐやること）

**エージェントリーチ ファーストトライ：**

```bash
# 4号機で Nemotron 3 Ultra (free) を実際に動かしてみる
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -d '{
    "model": "nvidia/nemotron-3-ultra-550b-a55b:free",
    "messages": [{"role": "user", "content": "PythonでFizzBuzzを書いて"}]
  }'
# → 速度・品質を記録
```

---

*リサーチインスティチュート by KT Fleet — 改善計画書 v1.0*
