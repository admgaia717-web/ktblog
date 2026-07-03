---
title: "Phase A3完了——fleet-shared/skillsを全プロファイルで共有し、艦隊固有スキルの中央管理を開始する"
date: 2026-07-03
category: "AI・テクノロジー"
tags: ["AIエージェント", "艦隊運用", "Hermes", "skills", "external_dirs", "インフラ運用", "投資"]
---

## Phase A3 完了報告：fleet-shared/skills 全プロファイル共有

### 問題

Hermesのスキル（skills）は各プロファイルが個別にcuratorで自動ダウンロードする仕組みになっている。結果、各艦に大量の標準スキルが重複して存在し、**KT艦隊固有の共通スキルを入れる場所がなかった。**

| プロファイル | 標準skills数 | external_dirs | 艦隊固有skills |
|---|---|---|---|
| 4号 default | 22個 | 空 | omp-fleet-tmux |
| 1号 lady | 35個 | 空 | browserbase, webwright等 |
| 1号 rodemu | 34個 | 空 | 同上 |
| 1号 qwen37 | 23個 | 空 | なし |
| 3号 aniki | 37個 | 空 | content-creation等 |

### やったこと

#### 1. fleet-shared/skillsを4号に作成

```
~/fleet-shared/skills/
  └ fleet-protocol/
      └ SKILL.md
```

最初の共通スキルとして`fleet-protocol`を作成。全エージェントがセッション開始時・終了時に従うべき基本ルールを定義。

#### 2. 全艦にrsyncで同期

```
4号 → 1号: rsync -avz ~/fleet-shared/skills/ 1gou:~/fleet-shared/skills/
4号 → 3号: rsync -avz ~/fleet-shared/skills/ 3gou:~/fleet-shared/skills/
```

Tailscale SSH経由で即座に同期可能。

#### 3. 全プロファイルのexternal_dirsに追加

```yaml
skills:
  external_dirs:
    - /Users/<user>/fleet-shared/skills
```

### 作業後の状態

| プロファイル | external_dirs | 共有スキル |
|---|---|---|
| 4号 default | ✅ /Users/kt/fleet-shared/skills | fleet-protocol |
| 1号 lady | ✅ /Users/user/fleet-shared/skills | fleet-protocol |
| 1号 rodemu | ✅ /Users/user/fleet-shared/skills | fleet-protocol |
| 1号 qwen37 | ✅ /Users/user/fleet-shared/skills | fleet-protocol |
| 3号 aniki | ✅ /Users/mini1/fleet-shared/skills | fleet-protocol |

### 今後の展望

fleet-shared/skillsに追加すべき共通スキルの候補：

- **gbrain-howto**: GBrainへの保存・検索・参照の具体的手順
- **bot2bot-protocol**: エージェント間直接対話の手順
- **fleet-status-check**: 全艦のヘルスチェック手順
- **incident-response**: エージェントダウン時の対応手順

新しい共通スキルを追加する際の手順：

1. 4号の`~/fleet-shared/skills/`にスキルを作成
2. `rsync -avz ~/fleet-shared/skills/ 1gou:~/fleet-shared/skills/`
3. `rsync -avz ~/fleet-shared/skills/ 3gou:~/fleet-shared/skills/`
4. 各艦のゲートウェイ再起動で自動読み込み

### Phase Aシリーズ完了

Phase A1〜A5の基盤整備がすべて完了。

| Phase | 内容 | 状態 |
|---|---|---|
| A1 | プロファイル作成・Hermes修復・v0.18.0統一 | ✅ |
| A1-f | SOUL.md/config.yaml整備 | ✅ |
| A2 | 1号機multiplex_profiles有効化 | ✅（稼働中） |
| A3 | fleet-shared/skills共有 | ✅ |
| A4 | Icarus Plugin統一 | ✅ |
| A5 | GBrain MCP統一 | ✅ |

次は残る低優先度課題（重複Fabric整理・埋没資産終了宣言）か、Phase B（運用自動化）への移行。

