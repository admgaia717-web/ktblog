# Pros Phonics 26字 ジェスチャー・パッケージ（最終統合版）

- 親タスク: t_dc78faab（26字分解 成果物の検品・最終統合）
- ソース動画: `prosphonics_method_full.mp4`（980秒・1080p・youtube bYJFlGa7sO4）第1周 実演（26.9〜205.0秒 実測区間）
- 対象: プロス・ランゲージセンター フォニックス教材（26字 a〜z・lowercase）
- 統合・検品: ピョ・チス（第5中隊 検品官）2026-09-04

## 成果物一覧

| ファイル | 内容 | 正本性 |
|---|---|---|
| `gestures.json` | 26字の機械可読マスタ（スキーマ `pros-lc.gestures/1`）。字別に start/end・clip・音(call/ipa/observed_times)・正本/実測アクションと判定(match 13 / partial 10 / mismatch 3)・キャラ・食べ物・カード意匠判定 | 正本（テンプレート消費用） |
| `clip_windows_measured.json` | 26字の実測区間（start/end）＋クリップ窓（clip_start/clip_end）。0.5秒刻みカードクロップ＋L2差分の二重検証で確定 | **タイムスタンプ正本** |
| `clips/a.mp4 〜 z.mp4` | 字別切り出しクリップ 26本（6.2〜10.9秒・h264 CRF18＋aac 128k・フレーム正確リエンコード・音声付き） | 正本 |
| `action_breakdown.md` | story_diff.md（正本アクション）× 動画実演の26字突合表。アクション判定 ○13/△10/×3（h,m,s）、カード意匠判定 16一致/8不一致/2不明瞭、特命3字（f○・s×・v○）、motion-control 注記付き | 正本（突合表） |
| `action_breakdown_raw.md` | ジェスチャー コマ撮り解析の生データ（各区間5-6フレーム・0.5秒境界検証・v2との差分表） | 参考資料（raw） |
| `gesture_timestamps_v2.md` | タイムスタンプ v2（1秒精度・t_336894bf の成果物） | **履歴**（下記注意参照） |

## 使い方

1. **テンプレート/アプリから消費するとき** → `gestures.json` を読む。スキーマ `pros-lc.gestures/1`、26レコード（a〜z昇順・欠落重複なし）。検証は `t_aa2b3468/validate_gestures.py`（ALL OK）・消費シミュレーションは `t_aa2b3468/smoke_consume.py` を参照。
2. **タイムスタンプが必要なとき** → `clip_windows_measured.json` を使う。`gestures.json` の start/end と完全一致（26/26 照合済み）。
3. **クリップを再生/配信するとき** → `clips/<字>.mp4`。窓は実測区間の前後±1秒マージン付き（`clip_windows_measured.json` の clip_start/clip_end）。a のクリップはバイト相 35.5-37.5 を含む窓、z は暗転手前 205.0 で終端。
4. **motion-control / 撮影参照のとき** → `action_breakdown.md` を読む。出演者は**鏡像**（視聴者から見て「右手」= 先生の左手、R/L を反転して参照）。b・c の動画運びは参照採用済みだが**デザイン・食べ物の差し替えは不可**。

## 注意点（必読）

1. **`gesture_timestamps_v2.md` は第1周で最大7秒ずれている**（f〜u帯で約4〜7秒早い、k→l −7.0秒、y→z +5.3秒遅い）。**タイミングには使わないこと**。履歴として残してあるのみ。正本は `clip_windows_measured.json`。
2. **アクション不一致3字（h・m・s）**: 動画は音/字形の身体化（h=息、m=生地patting、s=S字トレース）で、正本（story_diff.md merged版）と別系統。採否は 9/10 蜂谷さん「お話し通り」照合で確定する。確定後は `t_aa2b3468/gen_gestures.py` の OBSERVED を更新して gestures.json を再生成する。
3. **カード意匠不一致8字（b, c, i, j, k, l, s, u）**: 動画カードの食べ物が正本キャラ（例: b=キャベツ vs 正本ブロッコリ）と別。k は無地。字形フォルムは流用可・食べ物は正本キャラに寄せる（story_diff.md 文字表記列の設計思想どおり）。
4. **`sound.observed_times` は whisper-small の word タイムスタンプ**（クリップ内相対秒）。推定精度分の粗さがあるため、テンプレ音声指示に使う場合はクリップ再生で微調整推奨。
5. **l→m 間は 0.3秒の区切り差がある**（l end=115.7 / m start=116.0）。白フラッシュ（115.5-116.5）にめくりが隠れるための中間値で、measured JSON・clips・gestures.json の3者が同じ値で一貫。不整合ではない。
6. **v=4.0/x=3.0/y=2.0 等の5秒未満字** は動画上の実在長（v2 §5）。現クリップはマージン延長で全26本が6.2秒以上を確保済み。
7. 優先順位は「お話し通り ＞ wiki正本（merged版）＞ メソッド動画」（オ課長指示・action_breakdown.md §5）。b・c で差分が出たため t_95c471e2（生成パラメータ承認済み）への影響確認は未着手のまま。

## 検品結果（t_680f8b49）

- 機械チェック `check_deliverables.py`: 存在・非空・形式チェック 全ファイル OK（clips 26本含む ffprobe 再生可）。README.md 追加で expect 全項目一致。
  - naming NG 表記（`gestures.json` 等）は**想定内**: カード指定の成果物名（前例 t_a85c1307/notes-checker-naming.md・生成物ではなく仕様書類・データファイルは命名規約対象外）。詳細は `notes-checker-naming.md`。
- `gestures.json`: JSON パース・スキーマ・26字 a〜z 昇順・必須キー・判定値・verdict 集計（meta と一致）・observed_times 非空を自作チェッカーで検証 → 全項目 OK。`t_aa2b3468/validate_gestures.py` ALL OK（再実行）。
- タイムスタンプ正本性: gestures.json の start/end ≡ clip_windows_measured.json（26/26 完全一致）・区間連続（l→m の 0.3秒中間値を除き端点一致・W1 合計 178.1秒 = 26.9→205.0）。
- クリップ実体: 26本 ffprobe 再生可・6.2〜10.9秒・実測窓（clip_end − clip_start）と ±0.6秒以内で一致。
- 境界抜き打ち再確認（本検品・0.06秒精度フレーム抽出＋カードクロップ目視）: f→g（75.4=f/76.0=g → 境界 75.7 ✓）・k→l（105.7=k 無地/106.3=l ネギ → 106.0 ✓）・y→z（199.5=y 山芋/200.1=z ズッキーニ → 199.8 ✓）。
- 突合表: §1 に26行×7列、判定集計（○13/△10/×3・特命 f○/s×/v○）と gestures.json の verdict 分布が一致。§6 のセルフチェック項目も実データと突き合わせて OK。
- 著作権: ソースは教材動画（社内利用前提・出典明記済み）。歌詞・書籍の丸写しなし。
- 秘密情報・個人情報: なし。
