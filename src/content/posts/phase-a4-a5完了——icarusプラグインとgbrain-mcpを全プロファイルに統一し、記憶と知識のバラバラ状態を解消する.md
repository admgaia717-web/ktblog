---
title: "Phase A4+A5完了——IcarusプラグインとGBrain MCPを全プロファイルに統一し、記憶と知識のバラバラ状態を解消する"
date: 2026-07-03
category: "AI・テクノロジー"
tags: ["AIエージェント", "艦隊運用", "Hermes", "Icarus", "GBrain", "MCP", "記憶システム", "インフラ運用", "ロボット", "LLM"]
---

## Phase A4+A5 完了報告：Icarus Plugin + GBrain MCP 全プロファイル統一

KT艦隊のエージェントたちが「記憶」と「知識」を共有できる基盤を整えた。

### 作業前の問題

Phase A1-fでSOUL.mdとsystem_promptに「gbrainを使え」と書いたが、**実際にgbrainにアクセスできるMCPサーバーが設定されていないプロファイルがほとんど**だった。言ってみれば「辞書を使いなさい」と言いつつ辞書を渡していない状態。

#### 作業前のマトリクス

| プロファイル | 艦 | Icarus Plugin | GBrain MCP |
|---|---|---|---|
| default | 4号 | ✅ | ✅ |
| lady | 1号 | ✅ | ❌ |
| rodemu | 1号 | ✅ | ❌ |
| qwen37 | 1号 | ❌ | ❌ |
| aniki | 3号 | ✅ | ❌ |

4号だけが完璧。他のプロファイルは「IcarusはあるけどGBrainがない」か「何もない」。

### やったこと

#### 1. 1号・3号にgbrainをインストール

```
1号: ~/.bun/bin/bun install -g gbrain → gbrain@1.3.1
3号: ~/.bun/bin/bun install -g gbrain → gbrain@1.3.1
```

bunはPATHに入っていなかったが `~/.bun/bin/` に存在していた。

#### 2. 全プロファイルにGBrain MCPサーバーを追加

```yaml
mcp_servers:
  gbrain:
    command: /Users/<user>/.bun/bin/gbrain
    args: ["serve"]
    enabled: true
    connect_timeout: 30
    timeout: 120
```

#### 3. qwen37にIcarus Pluginを追加

qwen37はプラグインが空だったので、icarusを追加。

#### 4. 残りのMCPサーバーは現状維持

1号は `zai-search`、3号/4号は `zai-web-search` など名前の違いがあるが、動いているものには触らない。

### 作業後のマトリクス

| プロファイル | 艦 | Icarus Plugin | GBrain MCP | その他MCP |
|---|---|---|---|---|
| default | 4号 | ✅ | ✅ | cua-driver, zai-vision, zai-web-reader, zai-web-search, zai-zread, x-docs |
| lady | 1号 | ✅ | ✅ | zai-search, zai-reader, zai-vision, zai-zread |
| rodemu | 1号 | ✅ | ✅ | zai-search, zai-reader, zai-vision, zai-zread |
| qwen37 | 1号 | ✅ | ✅ | — |
| aniki | 3号 | ✅ | ✅ | cua-driver, notebooklm-mcp, zai-web-search, zai-web-reader, zai-vision, zai-zread |

**全5プロファイルでIcarus ✅ + GBrain ✅ を達成。**

### これで何が変わるか

1. **Icarus（記憶システム）**: 全エージェントがfabric_write/recallでタスク管理・知識永続化できる。作業記録がsessionログに埋もれなくなる
2. **GBrain（知識ベース）**: 全エージェントが14,769ページのセマンティック知識ベースにアクセスできる。LLMの事前学習知識だけでなく、KT艦隊の固有知識を参照できる
3. **system_promptとの整合**: Phase A1-fで書いた「gbrainを使え」という指示が、実際に機能するようになった

### 残課題

- **MCPサーバー名の不統一**: 1号の`zai-search` vs 3号/4号の`zai-web-search`。動いているので今は放置
- **qwen37のMCPサーバー不足**: gbrain以外のzai系MCPがない。Telegram bot tokenも空なので、現状は研究・テスト用プロファイル
- **ゲートウェイ再起動が必要**: config.yaml変更は次回ゲートウェイ再起動時に反映される

### 次のPhase

- **Phase A3**: fleet-shared/skillsをexternal_dirsで共有（共通スキルの統一）

