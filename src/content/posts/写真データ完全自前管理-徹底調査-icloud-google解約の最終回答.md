---
title: "写真データ完全自前管理 徹底調査——iCloud/Google解約の最終回答"
date: 2026-06-04
slug: 写真データ完全自前管理-徹底調査-icloud-google解約の最終回答
category: "note.com"
eyecatch: "/assets/eyecatch/ned12f40fa496.png"
---

# 写真データ完全自前管理 徹底調査——iCloud/Google解約の最終回答

> 出典: note.com / 2026-05-25

## 目的

iCloud・Googleフォト・Googleドライブを完全解約し、3TBの写真を含む全データを自前で管理する。

## 結論サマリー

**Intel N100ミニPC + Ubuntu + Docker + Immich + 6TB HDD** が、コスト・信頼性・拡張性のすべてで最適解。¥20,000の初期投資で月額¥0、10年間運用してもクラウド料金の1/10以下。

## 第1章：ハードウェア比較

| 機種 | 価格 | 消費電力 | Docker | 性能 | 総合 | |------|------|---------|--------|------|------| | Intel N100ミニPC | ¥15,000-25,000 | 6-15W | ◎ | ★★★★ | **最適解** | | 中古NUC i5 | ¥10,000-30,000 | 15-30W | ◎ | ★★★★★ | 高性能 | | Raspberry Pi 5 8GB | ¥12,000 | 5-8W | △ | ★★☆ | Immich非力 | | Synology DS224+ | ¥50,000 | 20W | ○ | ★★★ | 安定だが高い | | Mac mini M4(既存) | ¥0 | Mac全体 | △(OrbStack) | ★★★★★ | TCC地獄 |

**Intel N100の優位点：** - Ubuntuがネイティブ動作。DockerがVM不要で直接稼働 - macOSのTCC問題が存在しない - rootパーティション制限なし。100GB確保可能 - USB3.0で6TB HDDを直結 - ファンレスモデルなら無音 - 消費電力10W = 24時間稼働で月額¥200

## 第2章：ソフトウェア完全比較

写真管理：Immich 一択

| 機能 | Immich | PhotoPrism | Nextcloud | Googleフォト | |------|--------|-----------|-----------|-------------| | iOS自動バックアップ | ◎ | △ | ○ | ◎ | | AI顔認識 | ◎ | ◎ | ○ | ◎ | | Google的UI | ◎ | ○ | △ | ◎ | | 外部ライブラリ | ◎ | ○ | △ | - | | 複数ユーザー | ◎ | × | ◎ | ◎ | | 共有アルバム | ◎ | ○ | ◎ | ◎ | | 無料 | ◎ | ◎ | ◎ | 15GBまで |

ファイル同期：Syncthing

Googleドライブ/iCloud Driveの代替。P2P同期、サーバー不要。Mac↔iPhone間でフォルダ自動同期。

バックアップ：Restic + Borg

3-2-1ルール： - 3コピー（原本 + 外付け + 遠隔） - 2媒体（HDD + SSD） - 1オフサイト（友人の家かクラウドの最安層）

## 第3章：アーキテクチャ設計

推奨構成：N100ミニPC 集中型

┌─────────────────────────┐   iPhone(複数) ─Wi-Fi→│  N100 ミニPC (Ubuntu)   │                     │  ┌───────────────────┐  │                     │  │ Docker            │  │                     │  │ ├ Immich          │  │                     │  │ ├ PostgreSQL      │  │                     │  │ ├ Redis           │  │                     │  │ └ Syncthing       │  │                     │  └───────────────────┘  │                     │         │               │                     │    USB3 6TB HDD         │                     │    (写真 + ファイル)     │                     └─────────────────────────┘                               │                         Tailscale                               │                     外出先からアクセス

データフロー

1. iPhoneで撮影 → ImmichアプリがWi-Fi検知 → 自動アップロード 2. Immich → 6TB HDDに保存 → AI処理（顔認識/重複検出） 3. Google Takeout → 一括ダウンロード → External Libraryでインポート 4. Syncthing → Mac/iPhone間でファイル同期 5. Restic → 週次で別ドライブに暗号化バックアップ

解約できるクラウド

| サービス | 代替 | 月額削減 | |---------|------|---------| | iCloud 2TB | Immich + Syncthing | ¥1,300 | | Googleフォト | Immich | ¥0 (無料枠超過分) | | Googleドライブ | Syncthing | ¥250 | | **合計** | | **¥1,550/月 → 年¥18,600** |

## 第4章：移行手順

Phase 1: ハードウェア準備（1日）

1. N100ミニPC購入（Amazon/アリエク） 2. Ubuntu 24.04 LTSインストール 3. Docker + Docker Composeインストール 4. 6TB HDDをUSB接続、/mnt/photos にマウント

Phase 2: Immich構築（30分）

mkdir -p /opt/immich cd /opt/immich docker compose up -d

Phase 3: データ移行（数日）

1. iPhoneにImmichアプリ → 自動バックアップ 2. Google Takeoutリクエスト → ダウンロード → immich-cli でインポート 3. External Libraryで既存写真をインデックス

Phase 4: 検証・解約（1週間後）

1. 全写真がImmichで見えることを確認 2. iPhoneから元写真を削除 3. iCloud/Googleフォトを解約

## 第5章：macOSでの反省（イミッチ地獄より）

macOS + Docker + 外付けHDDの3層構造では以下が障害になる：

1. **macOS TCC**: ターミナルからリムーバブルメディアにアクセス不可 2. **Colima 20GB root制限**: VMのrootパーティションが固定で拡張不可。Docker運用で即満杯 3. **Docker Desktop File Sharing**: CLIから設定不可。GUI操作が必須 4. **OrbStack**: root自動拡張で改善するが、macOSのTCCは残る

→ **総合判断：写真データ3TB規模の本番運用にmacOS Dockerは不適。LinuxネイティブDockerが唯一の安定解。**

## 最終結論

| 項目 | 推奨 | |------|------| | ハードウェア | Intel N100ミニPC | | OS | Ubuntu 24.04 LTS | | 写真管理 | Immich | | ファイル同期 | Syncthing | | バックアップ | Restic | | リモートアクセス | Tailscale | | 初期投資 | ¥20,000 | | 月額コスト | ¥200（電気代） |

---
*この記事は note.com から KTBLOG に移行されました。元記事: https://note.com/famous_prawn2009/n/ned12f40fa496*