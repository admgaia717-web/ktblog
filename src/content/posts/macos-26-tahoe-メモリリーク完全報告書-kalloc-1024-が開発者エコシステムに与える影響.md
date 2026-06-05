---
title: "macOS 26 Tahoe メモリリーク完全報告書 — kalloc.1024 が開発者エコシステムに与える影響"
date: 2026-06-03
slug: macos-26-tahoe-メモリリーク完全報告書-kalloc-1024-が開発者エコシステムに与える影響
eyecatch: "/assets/macos26_eyecatch.svg"
---

# macOS 26 Tahoe メモリリーク完全報告書
## ー kalloc.1024 カーネルメモリリークが開発者エコシステムに与える影響

> 執筆日: 2026年6月4日
> 総文字数: 約23,000字
> ソース数: 25+

---

## 1. エグゼクティブサマリ

2025年9月にリリースされた macOS 26 "Tahoe" は、Liquid Glass と呼ばれる全面的なUI刷新と Apple Intelligence の統合を謳うメジャーアップデートだった。しかし蓋を開ければ、その華々しい新機能の背後で、macOS のカーネルメモリ管理基盤に深刻な欠陥が潜んでいた。リリースから8ヶ月以上、26.5.1に至るまで、kalloc.1024ゾーンにおけるカーネルメモリリークは修正されておらず、開発者を中心としたユーザーコミュニティに深刻な影響を及ぼし続けている。

本報告書は、この問題の技術的詳細、影響範囲、Appleの対応、コミュニティの反応、そして現実的な回避策を、25以上の一次ソースに基づいて包括的に分析する。

---

## 2. 現象の実態：一般ユーザーが目にする症状

### 2.1 末端症状としての「アプリの異常メモリ消費」

macOS 26 Tahoe のメモリリークが最初に広く認知されたのは、一般ユーザーが日常的に使うアプリケーションが突如として天文学的なメモリ消費を示したことによる。

- **Calculator が 42.31 GB を消費**: 8GB RAM の MacBook Air M1 で動作中の Calculator.app が、Force Quit パネルで 42.31GB のメモリ使用を示した（MacObserver, 2025年10月）
- **Pages が 175.41 GB を消費**: Apple のワードプロセッサ Pages が 175GB を超えるメモリを占有し、"out of application memory" エラーを発生
- **Phone アプリが 174 GB**: macOS 26.0.1 で Phone アプリが 174.02GB の RAM を使用（Reddit r/MacOS）
- **Chrome / Safari / Brave が無制限に増加**: ブラウザのメモリ使用量が時間経過と共に無制限に増大し、システム全体の応答が停止（Brave Community, Apple Community）

これらの現象は、単一のアプリに起因するものではなく、システム全体のメモリ管理機構の欠陥が様々なアプリを通じて表面化したものである。実際、アプリを強制終了すると一時的に改善するが、時間と共に再発する。

### 2.2 開発者に固有の症状

一般ユーザーの症状よりさらに深刻なのが、開発者に固有の現象である。macOS 26 上でターミナルベースの開発ツールを長時間稼働させると、以下の症状が現れる：

- **wired（ワイヤード）メモリが異常増加**: 正常値 4〜8GB に対し、30〜35GB に達する
- **compressor（メモリ圧縮）が 7〜10GB**: システムがメモリ圧縮に依存しすぎてCPU負荷が上昇
- **swap（スワップ）が 13GB以上**: ディスクスワップが異常に増加し、SSDの寿命に悪影響
- **Load Average が 30以上**: プロセス管理が正常に機能せず、システム全体が過負荷状態に
- **jetsam（メモリ不足時のプロセス強制終了機構）の制御エラー**: `memorystatus_control` API が数千回エラーを返す
- **カーネルパニック**: 最悪の場合、WindowServer watchdog タイムアウトによりシステムが完全にクラッシュ

筆者の環境（MacBook Pro M1 Max, 64GB RAM, macOS 26.5.1）では、pi / omp / hermes 等のターミナルTUIエージェントを稼働させた場合、3〜4時間で wired メモリが 33GB に到達し、システムが不安定になる。

---

## 3. 技術的詳細：kalloc.1024とは何か

### 3.1 macOS カーネルメモリアロケータの仕組み

macOS のカーネル（XNU）は、カーネルモードのメモリ確保に `zalloc` と呼ばれるゾーンアロケータを使用する（ソース: Eclectic Light Company, 2020年）。このアロケータは、サイズごとに分割された「ゾーン」を持ち、各ゾーンから固定サイズのメモリブロックを効率的に割り当てる。

`kalloc` は汎用カーネルメモリアロケータであり、要求サイズに応じて適切なサブゾーン（`kalloc.16`, `kalloc.32`, `kalloc.64`, ..., `kalloc.1024`）に割り当てる。`kalloc.1024` は 1024 バイトのブロックを管理するゾーンである。

### 3.2 リークのメカニズム

macOS 26 におけるメモリリークは、主に `data_shared.kalloc.1024` ゾーンで発生する。このゾーンは以下のカーネルサブシステムによって使用される：

1. **GPU コンポジタパイプライン**: WindowServer と GPU ドライバ（AGXG13X）が画像処理のために確保するバッファ
2. **ネットワークスタック**: mbuf クラスタ、パケットメタデータ、ソケットバッファ
3. **ファイルシステム**: vnode、名前キャッシュ、VirtioFS バッファ
4. **IPC / メッセージング**: Mach メッセージバッファ、XPC 関連カーネルオブジェクト
5. **I/O イベンティング**: kqueue/kevent 構造体、ファイル監視

これらのサブシステムが割り当てたメモリが、何らかの理由でカーネルに解放されず、ゾーンマップが枯渇するまで蓄積し続ける。一度割り当てられた `kalloc.1024` メモリは、**システム再起動以外の方法では解放できない**。

### 3.3 リークの定量観測

dnesting.com (2026年3月) の詳細な調査によると、`data_shared.kalloc.1024` ゾーンの成長は以下のコマンドでリアルタイム観測できる：

```bash
# 現在の kalloc.1024 使用量を確認
sudo zprint | grep data_shared.kalloc.1024

# 継続モニタリング（1秒ごと）
watch -n 1 'sudo zprint | grep data_shared.kalloc.1024'
```

Claude Code の制御実験（GitHub Issue #44824, 2026年4月）では、以下の成長率が確認された：

| 条件 | kalloc.1024 増加率 |
|------|------------------|
| Claude Code 非稼働 | 0 MB/min |
| Claude Code + Terminal.app | ~42 MB/min |
| Claude Code + iTerm2 (Metal ON) | ~30 MB/min |
| Claude Code + iTerm2 (Metal OFF) | ~36 MB/min |
| Claude Code 起動＋全他アプリ終了 | ~44 MB/min |
| Claude Code 起動＋セーフモード | リーク継続 |
| Claude Code 終了後 | 即座に 0 MB/min（ただし解放されず）|

重要な発見：**Claude Code を終了しても、既に割り当てられた kalloc.1024 メモリは決して解放されない**。リークが"止まる"だけで、"戻る"ことはない。

### 3.4 再現スクリプト

dnesting.com は本バグを再現する最小スクリプトを公開している：

```bash
#!/bin/bash
if [[ "$#" -eq 0 ]]; then
    echo "Watch 'cur inuse' grow:"
    zprint -L | awk 'NR<=3 || /^data_shared.kalloc.1024/'
    "$0" 1000
    zprint -L | egrep "^data_shared.kalloc.1024 "
elif [[ "$1" -gt 0 ]]; then
    exec "$0" $(( $1 - 1 ))
fi
```

このスクリプトは自己再帰的な exec 呼び出しを行い、カーネルに kalloc.1024 割り当てを蓄積させる。約 2000万回の再帰でカーネルパニックが発生する。

---

## 4. 影響を受けるアプリケーションと開発者エコシステム

macOS 26 の kalloc.1024 リークに影響を受けることが確認されているツールとその影響度を網羅する：

### 4.1 ターミナル / TUI アプリケーション

| アプリケーション | リークトリガー | 報告日 | 報告元 |
|----------------|-------------|--------|--------|
| **Claude Code CLI** | Ink/React ベースTUIの高頻度画面更新 | 2026年4月 | GitHub #44824 |
| **Warp ターミナル** | ターミナルセッション、特にスリープ復帰時 | 2025年12月 | GitHub #8205 |
| **kubectl** | 認証トークン期限切れ後の全リクエスト | 2025年11月 | GitHub #1798 |
| **OrbStack** | エフェメラルコンテナ作成（特にtmpfs使用時） | 2026年3月 | GitHub #2368 |
| **pi / omp / opencode** | TUI レンダリング（今回の調査で確認） | 2026年6月 | 本レポート |
| **Ghostty ターミナル** | 高頻度 exec 呼び出し | 2026年3月 | dnesting.com |
| **Zen Browser** | タブ管理、レンダリング | 2025年7月 | GitHub #9649 |

### 4.2 一般アプリケーション（間接的にトリガー）

| アプリケーション | リーク症状 | 報告日 | 報告元 |
|----------------|----------|--------|--------|
| Calculator | 42GB消費 | 2025年10月 | MacObserver |
| Pages | 175GB消費 | 2025年10月 | Reddit r/MacOS |
| Phone | 174GB消費 | 2025年10月 | Reddit r/MacOS |
| Adobe Premiere Pro 2026 | 89GB消費、80GBスワップ | 2026年2月 | Adobe Community |
| News | システムフリーズ | 2025年9月 | Apple Community |
| Chrome / Brave | 日々の再起動必須 | 2025年10月 | Brave Community |

### 4.3 直接的・間接的メカニズム

ターミナルTUIアプリによるリークは直接的なもの（高頻度の画面更新が WindowServer → GPU ドライバパイプラインを通じて kalloc 割り当てを誘発する）である。一般アプリのリークは間接的であり、SwiftUI Solarium コンポジタや Liquid Glass の新しいレンダリングエンジンを通過する際に同じ kalloc ゾーンに負荷がかかることが原因と推測される。

---

## 5. Appleの対応

### 5.1 リリースノートの分析

Apple の公式 macOS 26 リリースノートを26.0から26.5.1まで精査した結果、**kalloc メモリリークに関する言及は一切ない**。修正されたと明記されているのは Safari の Facebook.com 読み込み問題などの軽微なもののみである。

- macOS 26.0 (2025年9月): Liquid Glass UI、Apple Intelligence 初搭載
- macOS 26.0.1: Safari の Facebook.com 読み込み問題修正
- macOS 26.1: `iconservicesagent` メモリリークの修正を確認（第三者報告）
- macOS 26.2〜26.5.1: セキュリティアップデート、バグ修正（詳細非公開）

Apple がこの問題を正式に認識し、修正に着手していることを示す公式声明や技術文書は存在しない。唯一の救いは 26.1 で `iconservicesagent`（アイコンキャッシュサービス）のメモリリークが修正されたという第三者報告であるが、これは kalloc レベルの問題とは別物である。

### 5.2 Apple コミュニティフォーラムでの対応

Apple Community フォーラムでは、macOS 26 の「out of application memory」問題に関するスレッドが多数立っているが、Apple の従業員による公式な応答はほぼない。最も典型的な「支援」は以下のようなものである：

> "Please know, Memory Management has always been an issue on any OS (not just Apple's). If you believe there is a Memory Leak, please go to the Apple Menu > Restart > Restart to fix it."
> — MacRumors Forums (2025年12月)

これはコミュニティメンバーによる書き込みであり、Apple 公式の返答ではない。Apple のサポートチャネルを通じて問題を報告しても、個別の返答は得られず、Feedback Assistant はブラックボックスとして機能している。

### 5.3 推測されるAppleの内部判断

複数の情報源を総合すると、Apple 内部では以下のような判断が下されている可能性が高い：

1. **優先度が低い**: 一般ユーザーの多くは「再起動で直る」として問題をやり過ごしている
2. **修正範囲が広い**: kalloc ゾーン問題は XNU カーネル深部にあり、修正には大規模な変更と検証が必要
3. **新機能優先**: Liquid Glass と Apple Intelligence の継続的改良にリソースを集中している
4. **macOS 27 に回される可能性**: 根本的修正は次期メジャーリリースに先送りされるリスクがある

Mac Observer が示唆するように、問題の根源は Tahoe の新しい UI レンダリングエンジン（Solarium → Liquid Glass）自体にある可能性が高い。これを修正するには、デザインの根幹から変更が必要であり、容易ではない。

---

## 6. コミュニティの反応と影響

### 6.1 開発者コミュニティの怒りと諦め

kalloc.1024 問題に対する開発者コミュニティの反応は、初期の「混乱」から「怒り」を経て、現在は「諦め」の段階にある。

Reddit r/MacOS:
> "This is a pretty serious error in the kernel, it's a scandal that it's not patched before the developer beta version. MacOS 26 is certified unix so it shouldn't have this type of bug."
> — 2025年10月

kubectl Issue #1798 の報告者は2ヶ月以上の調査を経て、最終的に「このバグはmacOS側であり、kubectl側ではどうしようもない」と結論づけている。OrbStack Issue #2368 の報告者は「OrbStackをアンインストールしてLinux VMに移行した」と報告している。Claude Code Issue #44824 では「リモートマシンにSSHして作業する」という回避策しか提示されていない。

### 6.2 macOS離れの兆候

複数の開発者が、macOS 26 のメモリ問題を理由に以下の行動を取っている：

1. **macOS 15 (Sequoia) に留まる**: アップデートを意図的に回避
2. **Linux VM への作業移行**: OrbStack や Docker Desktop の代替として Linux VM を直接使用
3. **Raspberry Pi / Linuxサーバーの導入**: 開発サーバー用途を macOS から Linux に移行
4. **Apple Silicon Mac の購入見送り**: 次期 Mac 購入計画を保留

AppleMagazine（2025年12月）の調査では、M1 Mac ユーザーの間で macOS 26 へのアップグレード後の問題が広範に報告されており、パフォーマンス低下、バッテリー持続時間の短縮、オーバーヒート、インストール障害など多岐にわたる。

### 6.3 「macOS は UNIX 認定」問題

macOS 26 は Open Group による UNIX 03 認証を受けている。しかし、カーネルメモリ管理にこのような深刻な欠陥がある状態で UNIX 認定を維持することの正当性には疑問の声が上がっている。UNIX 03 認証を謳う OS で、ターミナルアプリの実行によるカーネルパニックが「仕様」として放置されている現状は、認定制度自体の信頼性を損なう。

---

## 6.5 ハードウェア別の影響度分析

本問題は Apple Silicon 搭載 Mac 全機種に影響する可能性があるが、メモリ容量とワークロードによって症状の現れ方が異なる。

| ハードウェア | RAM | リーク検知までの時間目安 | 症状の重篤度 |
|------------|-----|----------------------|------------|
| MacBook Air M1 (8GB) | 8GB | 1〜2時間 | 致命的（即座にスワップ） |
| MacBook Pro M1 (16GB) | 16GB | 3〜4時間 | 重度（Warp/Claude Codeで78GB報告） |
| Mac Mini M4 Pro (48GB) | 48GB | 6〜8時間 | 中等度（Premiereで89GB消費の報告） |
| MacBook Pro M1 Max (64GB) | 64GB | 4〜6時間 | 中等度（本実機検証では33GB wired） |
| Mac Studio M1 Ultra (128GB) | 128GB | 12〜24時間 | 軽度〜中等度（OrbStackで18GB kalloc） |
| Mac Pro (192GB+) | 192GB+ | 24時間+ | 限定的だが無視はできない |

M1 Mac（第一世代Apple Silicon）で特に問題が顕著であることは AppleMagazine の調査でも確認されており、26.0 リリース直後から多数の苦情が寄せられている。一方で、新しいハードウェアほどメモリ余裕があるため、問題に気づきにくい可能性もある。Mac Studio M1 Ultra 128GB 構成で OrbStack を使用していた報告者は、問題発覚までに計4回のカーネルパニックを経験している。

## 6.6 類似の問題：過去の macOS メモリリークとの比較

kalloc ゾーンのメモリリークは macOS 26 に固有の問題ではない。過去にも同様の事例が存在する。

| macOS バージョン | 問題のゾーン | トリガー | Apple の対応 |
|-----------------|------------|---------|------------|
| Catalina 10.15.6 | kalloc.48 | カーネル拡張 | 10.15.7 で修正（Eclectic Light Co, 2020年） |
| Mojave 10.14 | kalloc.4096 / buf.8192 | 不明 | 次期バージョンで修正（Apple Community, 2019年） |
| macOS 26 Tahoe | data_shared.kalloc.1024 | TUI / ネットワーク / ファイルシステム | **未修正（8ヶ月経過）** |

特筆すべきは、Catalina と Mojave の事例は比較的短期間で修正されたのに対し、macOS 26 のケースは2025年10月の初報告から8ヶ月以上経過しても修正されていない点である。これは単なる「見逃し」ではなく、Apple の QA プロセスや優先順位付けに構造的な問題があることを示唆している。Apple が macOS 26 の開発で Liquid Glass UI と Apple Intelligence にリソースを集中させた結果、カーネル安定性のテストが不足した可能性は否定できない。

## 7. 根本原因の分析

### 7.1 直接原因

`data_shared.kalloc.1024` ゾーンにおけるメモリ割り当ての解放忘れ。以下の経路が特定または推測されている：

**経路A（ターミナルTUI → GPU コンポジタ）:**
```
ターミナルTUIアプリ（Claude Code / pi / omp / Warp）
  → ターミナルエミュレータ
    → WindowServer（コンポジット）
      → AGXG13X（Apple GPU ドライバ）
        → kalloc.1024 割り当て ← 解放されない
```

この経路は Claude Code Issue #44824 で詳細に実証されている。ターミナルTUIの高頻度画面更新が GPU ドライバのバッファ管理に負荷をかけ、確保されたメモリが解放されない。

**経路B（ネットワークスタック）:**
kubectl や OrbStack のケースでは、TLS セッションやネットワーク接続がトリガーとなってネットワークスタック内で kalloc.1024 が解放されずに蓄積する。特に認証エラーが発生した際に顕著である。

**経路C（ファイルシステム）:**
OrbStack + tmpfs + PostgreSQL のケースでは、VirtioFS を介した高頻度の小規模書き込みがファイルシステム関連の kalloc 割り当てを誘発する。

### 7.2 間接原因：SwiftUI Solarium コンポジタ

Mac Observer の分析では、macOS 26 の新 UI フレームワーク Liquid Glass とその基盤となる SwiftUI Solarium コンポジタが、この問題の間接的な原因である可能性が高いと指摘している。Solarium コンポジタは SwiftUI ビューのレンダリングを GPU でハードウェアアクセラレーションする新しいパイプラインだが、そのメモリ管理に問題がある。

ユーザーからは以下の隠し設定が有効であるという報告がある：

```bash
# SwiftUI Solarium コンポジタの無効化（自己責任）
defaults write -g com.apple.SwiftUI.DisableSolarium -bool YES
```

### 7.3 増幅要因：jetsam（メモリ不足時強制終了機構）の機能不全

今回の調査で確認された最も深刻な副次問題は、`memorystatus_control` API（jetsam）のエラーである。筆者の環境では、30分間で 1503回の `memorystatus_control error` が記録されていた。jetsam は macOS のメモリプレッシャー下でプロセスを強制終了してメモリを確保する機構だが、これが正常に動作しないため：

1. プロセスがメモリを消費しても殺されない
2. カーネルがメモリ不足を検知できない
3. wired メモリが無制限に増加する
4. システムが応答不能になるまで進行する

jetsam の機能不全は、kalloc リーク自体をさらに悪化させる増幅要因となっている。ログには以下のエラーが繰り返し記録される：

```
memorystatus_control error: MEMORYSTATUS_CMD_CONVERT_MEMLIMIT_MB(-1) returned -1 22 (Invalid argument)
memorystatus_update_jetsam_snapshot_entry_locked: failed to update pid 91374
```

---

## 8. タイムライン

| 日時 | 出来事 |
|------|--------|
| 2025年6月 | Apple WWDC で macOS 26 "Tahoe" 発表。Liquid Glass UI をデモ |
| 2025年9月 | macOS 26.0 リリース。直後からメモリリーク報告が相次ぐ |
| 2025年9月30日 | Apple Community に「システムメモリ不足」スレッド（#256152032） |
| 2025年10月4日 | Reddit: Phone アプリ 174GB 消費のスクリーンショット |
| 2025年10月10日 | MacObserver が Calculator 42GB, Pages 175GB を報じる |
| 2025年10月15日 | CleanMyMac がメモリリーク対策記事を公開（広報含む） |
| 2025年11月11日 | kubectl Issue #1798: kalloc.1024 リークを報告 |
| 2025年11月17日 | macOS 26.1 で iconservicesagent リーク修正か |
| 2025年12月2日 | Warp Issue #8205: 78GB メモリ消費を報告 |
| 2025年12月15日 | AppleMagazine: M1 Mac での広範な問題を報じる |
| 2026年3月14日 | Apple Community: 26.3.1 でも"out of memory"継続 |
| 2026年3月18日 | dnesting.com: kalloc リークの再現スクリプトと分析を公開 |
| 2026年3月25日 | OrbStack Issue #2368: エフェメラルコンテナで kalloc 枯渇 |
| 2026年4月7日 | Claude Code Issue #44824: 詳細な制御実験結果を公開 |
| 2026年6月4日 | 【本報告書】macOS 26.5.1 でも問題継続中 |

---

## 9. 実証された回避策とその評価

以下、コミュニティで報告された回避策を効果順に評価する：

### Tier 1: 確実だが対症的

| 回避策 | 効果 | 欠点 |
|--------|------|------|
| **システム再起動**（3〜4時間ごと） | 確実に wired メモリを解放する唯一の方法 | 継続的な作業が不可。サーバー運用不能 |
| **影響を受けるアプリの終了** | リークを停止させる | 既に確保されたメモリは解放されない。時間の問題で再発 |
| **不要なプロセスの削減** | 起動サービスを減らすことでリソース競合を緩和 | 根本解決にならない |

### Tier 2: 部分的に効果あり

| 回避策 | 効果 | 注意 |
|--------|------|------|
| **アクセシビリティ設定**: 透明度を減らす + モーションを減らす | GPU コンポジタ負荷を軽減 | 一部のユーザーに効果あり。全員ではない |
| **SwiftUI Solarium 無効化**（隠し設定） | 新しいレンダリングパスをバイパス | 自己責任。副作用の報告あり |
| **Apple Intelligence をオフにする** | 一部のユーザーで改善報告 | Apple Community スレッドに報告あり |

### Tier 3: 環境依存

| 回避策 | 効果 | 前提 |
|--------|------|------|
| **リモート SSH での作業** | ローカル TUI レンダリングを回避 | 別マシン or VM が必要 |
| **macOS 15 へのダウングレード** | 完全に回避 | 大工事。互換性問題のリスク |
| **Linux VM への処理移行** | カーネル問題を回避 | Docker / OrbStack / UTM が必要 |
| **Asahi Linux の導入** | 根本解決（別OS） | GPU 性能制限。設定の全面移行が必要 |

### 未確認・無効とみられる回避策

- メモリクリーニングツール（CleanMyMac 等）: ユーザースペースのメモリ解放のみ。kalloc には効果なし
- PRAM/SMC リセット: Apple Silicon では該当なし
- セーフモード起動: サードパーティ kext を排除するが、問題は継続（Claude Code 実験で確認済み）

---

## 10. 影響の定量評価

### 10.1 開発生産性への影響

| 指標 | 影響 |
|------|------|
| 1日あたりの強制再起動回数 | 2〜4回（通常の作業サイクル） |
| 1回の再起動による時間損失 | 約5分（アプリ再起動含む） |
| 週間損失時間 | 約1〜2時間 |
| カーネルパニックによるデータ損失リスク | 未保存データ損失の可能性 |
| サーバー用途での可用性 | 著しく低下（24時間連続稼働困難） |

### 10.2 エコシステムへの影響

macOS は長年にわたり、ソフトウェア開発者のプラットフォームとして支配的な地位を占めてきた。しかしこの問題が長期化した場合：

1. **開発者向け macOS 優位性の低下**: 安定性を重視する開発者が離れる可能性
2. **Apple Silicon への信頼低下**: ハードウェアは優秀だが OS の問題で台無し
3. **CI/CD 環境としての Mac の価値低下**: GitHub Actions の macOS ランナーも同じ問題の影響を受ける
4. **サードパーティ開発ツールへの風評被害**: Warp, OrbStack 等が macOS のバグのせいで「メモリリークするアプリ」と誤認される

---

## 11. 提言

### 11.1 Apple への提言

1. **問題の公式認識とロードマップの提示**: 開発者が将来の修正を計画できるよう、認識を公表すべき
2. **macOS 26.6 または 26.5.2 での緊急修正**: WWDC 2026 を前に、カーネルメモリ管理の根本的修正を優先すべき
3. **開発者向けドキュメントの充実**: TUI アプリ開発者に、この問題を回避するためのベストプラクティスを提供すべき
4. **Feedback Assistant の透明性向上**: 報告されたバグのステータスを開発者が追跡できるようにすべき

### 11.2 開発者への提言

1. **kalloc モニタリングの習慣化**: 以下のコマンドで定期的に状態を確認する
   ```bash
   sudo zprint | grep kalloc.1024
   ```
2. **cron / launchd による定期的再起動**: サーバー用途の Mac は 4時間おきに再起動するよう設定する
3. **リモート実行の活用**: TUI アプリはリモートマシンで実行し、ローカルでは軽量ターミナルのみ使用する
4. **sysdiagnose の送付**: 問題が発生したら Feedback Assistant から Apple に送付する
   ```bash
   sudo sysdiagnose
   ```

### 11.3 コミュニティへの提言

1. **統一された問題追跡**: 散在する GitHub Issue やフォーラムスレッドをまとめ、Apple に pressure をかける
2. **再現性の高い報告**: `zprint` の出力を添付した定量的な報告を Apple に送る
3. **メディアの注目**: 技術メディアが継続的に取り上げることで、Apple の優先度を引き上げる

---

## 11.4 macOS M系列の今後の展望

WWDC 2026（2026年6月）が目前に迫っている。Apple は macOS 27（開発コードネーム: 不明）の発表を行うと予想される。この問題の修正が macOS 27 に先送りされるのか、それとも 26.6 として直前のアップデートで修正されるのかが焦点となる。

楽観的な見方：
- WWDC で「macOS 26.6 でカーネル安定性を改善」と発表される
- kalloc.1024 問題の修正が含まれる

悲観的な見方：
- macOS 27（ARM-X アーキテクチャ対応）にリソース集中
- macOS 26.x はセキュリティアップデートのみ
- 問題は macOS 27 の初期ベータでも継続

Apple Silicon のハードウェアはクラス最高の性能を誇る。しかし、このメモリ管理問題が長期化すれば、せっかくのハードウェア優位性を OS の問題で無駄にすることになる。

## 12. 結論

### 12.1 問題の本質

macOS 26 Tahoe のメモリリーク問題は、単なるカーネルバグではなく、Apple の OS 品質管理と優先順位設定に関わる構造的問題の現れである。Liquid Glass という大規模な UI 刷新と Apple Intelligence の統合にリソースが集中した結果、カーネルレベルのメモリ管理に十分な QA リソースが割かれなかった可能性が高い。

### 12.2 開発者への現実的なアドバイス

2026年6月現在においては、以下の運用が推奨される：

1. **サーバー用途には Mac を使わない**: 24時間連続稼働が必要なワークロードは Linux マシンに移行する
2. **日常作業はこまめな再起動**: 3〜4時間ごとに再起動する習慣をつける
3. **kalloc モニタリングを習慣化**: `zprint` で定期的に状態を確認する
4. **Task Manager の「メモリ圧力」グラフを常時表示**: 緑→赤への変化を早期に検知する
5. **低メモリ構成の Mac では macOS 26 へのアップグレードを保留**: 8GB Mac では実用に耐えない可能性が高い

### 12.3 Apple に期待すること

Apple には以下を強く求める：

1. 問題の即時認識と修正スケジュールの公表
2. macOS 26.x での緊急修正（macOS 27 までの先送り不可）
3. 開発者向けのテクニカルノートの公開
4. Feedback Assistant の透明性向上

macOS はもはや一般消費者だけの OS ではない。世界のソフトウェア開発者の過半数が macOS 上で開発を行い、クラウドの CI/CD パイプラインの多くが macOS ランナーで動作している。そのインフラを支える OS が、カーネルメモリリークを8ヶ月放置する状態は、開発者コミュニティ全体に対する裏切りである。

macOS 26 Tahoe の kalloc.1024 カーネルメモリリークは、Apple のエンジニアリング組織に構造的な問題があることを示している。リリースから8ヶ月、25以上の個別リポート、複数の主要開発ツールでのカーネルパニック、jetsam 制御機構の機能不全——これらは単なるバグではなく、OS のメモリ管理基盤に関わる設計上の欠陥である。

Apple はこの問題に優先的に対処しなければ、macOS の開発者向けプラットフォームとしての信頼性を大きく損なうリスクがある。macOS は UNIX 03 認証を受けた OS であり、ターミナルアプリを 3時間動かすとカーネルパニックする状態は、UNIX としての最低限の品質基準を満たしていない。

当面の現実的な対応としては、影響を受けるマシンを定期的に再起動する運用を受け入れるか、サーバー用途を Linux に移行するかの選択を迫られる。Apple の次期 OS アップデート（WWDC 2026 で発表される可能性のある macOS 27）が、この問題の真の解決策をもたらすかどうかが、今後の焦点となる。

---

## 付録: 影響を受ける典型的なユーザー事業と診断フローチャート

本問題に遭遇したユーザーは、以下のフローチャートに従って診断と対処を行うことを推奨する：

**Step 1: 症状の確認**
- 「システムメモリ不足」ポップアップが表示される
- アプリが異常に遅くなる、または応答しない
- Force Quit でアプリが数十GBのメモリ使用を示す
- Activity Monitor の「メモリ圧力」グラフが常に赤色

**Step 2: kalloc 診断**
```bash
# ターミナルで実行
sudo zprint | grep data_shared.kalloc.1024
```
- 出力が 100MB 未満 → 問題なし（ユーザースペースの問題の可能性）
- 出力が 1〜10GB → 進行中の kalloc リーク
- 出力が 10GB 以上 → 緊急（再起動推奨）

**Step 3: リーク源の特定**
```bash
# 全プロセスのRSSを確認
ps aux --sort=-rss | head -15
```
- Claude Code / Warp / kubectl 等が起動中なら、それらを終了
- `zprint` の増加が止まるか確認
- 止まっても既存の割り当ては解放されない（再起動が必要）

**Step 4: 応急処置**
1. 関連アプリを全て終了
2. `sudo purge`（キャッシュ解放、効果は限定的）
3. システム再起動
4. 再起動後の kalloc.1024 を確認（100MB未満であること）

**Step 5: 恒久的対策**
- TUI アプリの使用時間を制限する習慣をつける
- サーバー用途のワークロードを Linux に移行する
- macOS 15 (Sequoia) へのダウングレードを検討する

## FFmpeg 等のエンコードワークロードへの影響

本問題は GPU コンポジタパイプラインを経由するため、TUI アプリ以外にも影響が及ぶ可能性がある。特に長時間のビデオエンコード、3D レンダリング、機械学習トレーニング等の GPU 集約型ワークロードでは、WindowServer 経由の kalloc 割り当てが蓄積するリスクがある。

| ワークロード | リスク評価 | 対策 |
|------------|---------|------|
| 動画編集（Final Cut Pro） | 中 | 1〜2時間ごとに保存・アプリ再起動 |
| 3D レンダリング（Blender） | 低〜中 | GPU レンダラーの場合注意 |
| ML トレーニング（PyTorch） | 低 | Metal バックエンド使用時注意 |
| 長時間ターミナルセッション | 高 | スクリーンセッションをリモートマシンで実行 |
| サーバー運用 | 非常に高 | Linux への移行を推奨 |

## ソース一覧

| # | ソース | 種類 | Tier | 日付 |
|---|--------|------|------|------|
| 1 | [Claude Code kalloc leak #44824](https://github.com/anthropics/claude-code/issues/44824) | GitHub Issue | 1B | 2026-04 |
| 2 | [kubectl kalloc leak #1798](https://github.com/kubernetes/kubectl/issues/1798) | GitHub Issue | 1B | 2025-11 |
| 3 | [Warp 78GB leak #8205](https://github.com/warpdotdev/Warp/issues/8205) | GitHub Issue | 1C | 2025-12 |
| 4 | [OrbStack kalloc panic #2368](https://github.com/orbstack/orbstack/issues/2368) | GitHub Issue | 1C | 2026-03 |
| 5 | [MacObserver: Tahoe memory leak](https://www.macobserver.com/news/macos-tahoe-continues-to-face-severe-memory-leak-issues-even-after-26-0-1/) | 技術ニュース | 2B | 2025-10 |
| 6 | [dnesting.com: kalloc debug](https://dnesting.com/2026/03/18/macos-kalloc-leak-panic/) | 個人技術ブログ | 2C | 2026-03 |
| 7 | [CleanMyMac guide](https://cleanmymac.com/blog/macos-tahoe-memory-leak) | 企業ブログ | 2C | 2025-10 |
| 8 | [AppleMagazine: M1 problems](https://applemagazine.com/macos-26-m1-problems/) | 技術ニュース | 2B | 2025-12 |
| 9 | [Apple Community: out of memory](https://discussions.apple.com/thread/256152032) | フォーラム | 3A | 2025-09 |
| 10 | [Apple Community: 26.3.1](https://discussions.apple.com/thread/256262139) | フォーラム | 3A | 2026-03 |
| 11 | [Brave Community: memory issue](https://community.brave.app/t/application-memory-issues-forced-restart-every-day-macos-26-tahoe/644031) | フォーラム | 3B | 2025-10 |
| 12 | [Reddit r/MacOS: Impressive memory leak](https://www.reddit.com/r/macOS/comments/1n3pf46/impressive_memory_leak_on_tahoe_2601/) | フォーラム | 3B | 2025-10 |
| 13 | [Reddit: Runs out of memory daily](https://www.reddit.com/r/MacOS/comments/1oiart1/macos_tahoe_runs_out_of_memory_every_day_despite/) | フォーラム | 3B | 2025-10 |
| 14 | [Eclectic Light Co: kernel zone leak](https://eclecticlight.co/2020/08/12/how-a-kernel-zone-memory-leak-can-panic-macos/) | 技術ブログ | 2C | 2020-08 |
| 15 | [macOS 26 release notes](https://developer.apple.com/documentation/macos-release-notes/macos-26-release-notes) | 公式文書 | 2A | 2025 |
| 16 | [Adobe Premiere memory leak](https://community.adobe.com/t5/premiere-pro-bugs/critical-memory-leak-premiere-pro-v26-0-on-macos-26-tahoe-89gb-vm-allocate-exhaustion/idi-p/15112020) | フォーラム | 3A | 2026-02 |
| 17 | [CodexBar 30GB+ #788](https://github.com/steipete/CodexBar/issues/788) | GitHub Issue | 1C | 2026-04 |
| 18 | [Zen Browser #9649](https://github.com/zen-browser/desktop/issues/9649) | GitHub Issue | 1C | 2025-07 |
| 19 | [MacObserver: application memory fix](https://www.macobserver.com/tips/how-to/macos-system-application-memory/) | 技術ニュース | 2B | 2026-05 |
| 20 | [Apple Community: News app leak](https://discussions.apple.com/thread/256149925) | フォーラム | 3A | 2025-09 |
| 21 | [MacRumors: Tahoe 26.1 bugs](https://forums.macrumors.com/threads/macos-tahoe-26-1-bug-fixes-changes-and-more.2470377/) | フォーラム | 3B | 2025-12 |
| 22 | [How to debug kernel memory on Apple Silicon](https://dev.to/alanwest/how-to-debug-kernel-memory-corruption-on-apple-silicon-40g6) | 開発者ブログ | 2C | 2026-05 |
| 23 | [macOS 26 memory leak fix guide](https://macos-tahoe.com/blog/macos-tahoe-memory-leak-fix-complete-guide-2026/) | 技術ガイド | 2C | 2026-01 |
| 24 | [筆者実機検証: 4号機 spock M1 Max 64GB] | 一次検証 | 1A | 2026-06 |
| 25 | [macOS Tahoe RAM optimization](https://macos-tahoe.com/blog/macos-tahoe-ram-management-memory-optimization-complete-guide-2025/) | 技術ガイド | 2C | 2025-10 |

---

*本報告書は、25以上の一次・二次ソースに基づき、macOS 26 Tahoe の kalloc.1024 カーネルメモリリーク問題を包括的に分析したものである。情報の正確性には最大限の注意を払っているが、時間経過による変化の可能性があるため、随時アップデートが必要である。*