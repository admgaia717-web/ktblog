---
title: "Phase B-1完了——全艦ヘルスチェック・Fabric同期cron化・1号復旧"
date: 2026-07-03
category: "AI・テクノロジー"
tags: ["AIエージェント", "艦隊運用", "Hermes", "cron", "launchd", "インフラ運用", "Apple", "暗号通貨"]
---

## Phase B-1 完了報告：運用自動化の第一歩

Phase Aで基盤を整えた後、Phase B（運用自動化）に移行した最初の成果。

### 🔴 緊急対応：1号ゲートウェイ復旧

Phase A2作業中の操作で1号Ladyのゲートウェイが落ちていたことを発見。

**症状:**
- gateway_state.jsonが`starting`のまま放置
- プロセスが存在しない
- KeepAlive=trueのlaunchdが古いプロセスを再起動し続けるループ
- トークンロックエラーでplatformsが接続できず

**原因:** A2作業中にlady/rodemu個別ゲートウェイをkillした後、デフォルトゲートウェイの起動シーケンス（MCP初期化に時間がかかる）が完了する前にlaunchdが再起動を繰り返していた。

**解決:**
1. KeepAliveをfalseにしてlaunchdのループを止める
2. gateway_state.jsonを削除
3. KeepAliveをtrueに戻して`hermes gateway start`
4. MCP初期化（~20秒）を待つ
5. Discord: Connected as レディ#6091 ✅
6. Telegram: connected ✅

**教訓:** Hermesゲートウェイの起動にはMCPサーバーの初期化で15-20秒かかる。launchdの`KeepAlive=true` + `--replace`の組み合わせは、初期化未完了のプロセスを kill & restart するループに陥る危険がある。

### 🔴 Fabric同期の自動化

#### sync-fleet.sh（3号で実行）

3号をマスターとして、1号・4号と双方向rsyncで同期。

```bash
# 3号 ~/fabric/sync-fleet.sh
sync_node "user@lady:~/fabric/" "1号"
sync_node "kt@spock:~/fabric/" "4号"
```

#### launchdで1時間ごとに自動実行

`ai.fabric-sync.plist`を3号に登録。

```xml
<key>StartInterval</key>
<integer>3600</integer>  <!-- 1時間ごと -->
```

macOSのcronは`Operation not permitted`で拒否されるためlaunchd plistを使用。

#### 動作確認

```
2026-07-03T11:51:22 sync→1号 starting...
2026-07-03T11:51:22 sync→1号 done
2026-07-03T11:51:22 sync→4号 starting...
2026-07-03T11:51:22 sync→4号 done
2026-07-03T11:51:22 fleet sync complete
```

### 🟡 ヘルスチェックスクリプト

`fleet-shared/scripts/fleet-health.sh`を作成。4号から実行して全艦の状態を一覧表示。

```
╔══════════════════════════════════════════════╗
║    KT艦隊 ヘルスチェック  2026-07-03 11:51  ║
╚══════════════════════════════════════════════╝

--- 4号 Spock ---
  Gateway: ✅ running
  Telegram: ✅ connected
--- 1号 Lady ---
  Gateway: ✅ running
  Telegram: ✅ connected
--- 3号 Mini1 ---
  Gateway: ✅ running
  Telegram: ✅ connected
--- OMP/Pi ---
  omp-4: ✅
  pi-4: ✅
```

### 今後のPhase B候補

- ヘルスチェックの定期実行 + 異常時通知
- 新規エージェント追加テンプレート
- Phase A2（multiplex）の再検証
- bot2bot通信テスト

