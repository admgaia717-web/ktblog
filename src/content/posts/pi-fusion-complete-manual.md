---
title: "pi-fusion 完全マニュアル — 複数のAIを並列で走らせて1つに統合する、流行りの「Fusion」をpiで使いこなす"
date: 2026-06-24
slug: "pi-fusion-complete-manual"
category: "AI・テクノロジー"
eyecatch: "/assets/eyecatch/pi-fusion-complete-manual.png"
tags: ["AIエージェント", "プログラミング", "LLM", "自動化", "Claude", "ロボット", "OpenAI", "ローカルLLM", "デザイン", "哲学", "節約"]
---

# pi-fusion 完全マニュアル — 複数のAIを並列で走らせて1つに統合する、流行りの「Fusion」をpiで使いこなす

MoE（Mixture of Experts）、Mixture-of-Agents、そして OpenRouter がホスト型ルーターとして提供している Fusion（`openrouter/fusion`）。――**複数のSOTAモデルを組み合わせて知能を底上げする**手法が、ここ数年はっきりと流行っている。独立したパスはそれぞれ違う間違いをするから、それらを統合するだけで、一つの強いモデルに全賭けするより頑健な回答が出る。これはもう定石になりつつある。

ただ、これまでの「Fusion」は、ほとんどが**プロバイダ側（APIの向こう側）で解決する**形だった。ルーターに丸投げし、向こうでよろしくやってもらう。手軽だが、どのモデルを、何本走らせて、どう統合するかは、プロバイダに握られる。

実は、OSSのコーディングエージェント **pi** には、これを**ハーネス側（あなたの実行環境側）で解決する手段**がある。それが **pi-fusion** だ。自分の作業ツリーに対してローカルのpiサブプロセスを走らせ、結果をあなたが選んだモデルで統合する。すべての設定を自分で握れる。

本記事は、pi-fusionを実際にインストールし、ソースコード（TypeScript 994行のUI実装）と全公式ドキュメントを読み込んで作成した**完全マニュアル**である。設定画面の1行1行、実行時のライブパネル、プロンプトの内部、セッション記録の仕組みまで、すべてを網羅した。

---

## なぜ「Fusion」が熱いのか

一つの巨大なモデルに長く考えさせる以外に、推論の質を上げる道はある。**独立した複数回の推論を走らせ、その結果を合成する**という方向だ。これを支える概念がいくつかある。

- **Compound AI Systems**（UC Berkeley BAIR）— モデル呼び出し、検索、ツール、制御ロジックを組み合わせたシステム。
- **"Are More LLM Calls All You Need?"**（Chen et al., 2024）— 複数のLM呼び出しを集約する compound 推論のスケーリング則。
- **Scaling LLM Test-Time Compute Optimally**（Snell et al., 2024）— 推論時計算を独立のスケール軸として扱う。
- **Large Language Monkeys**（Brown et al., 2024）— 繰り返しサンプリングが弱いモデルを強くする。
- **Mixture-of-Agents**（Wang et al., 2024）— 複数のLLMエージェントの出力を集約すると最終回答の質が上がる。

独立したパスはそれぞれ異なる振る舞いをする。だから統合モデルは「一つの経路に全賭けする」のではなく、**有用な不一致を再利用**できる。結果として、フロンティアモデル単体を安さと速さで上回るケースが出てくる。これがFusionの前提だ。

OpenRouterはこの思想をホスト型ルーター（`openrouter/fusion`）として提供している。pi-fusionは似たことを**自分のローカル環境**で行う。手元のpiサブプロセスを作業ツリーに対して走らせ、その結果を、あなたが既に選んだ合成モデルに渡す。すべての設定を自分で握れる。

---

## pi-fusionとは何か

leblancfg氏によるMITライセンスのpi拡張。TypeScript製。一言で言えば、**あなたのプロンプト1つに対し、裏で複数モデルを並列で走らせ、その結果を統合して1つの回答にする**拡張である。

## インストール

npmから入れるのが標準。

```bash
pi install npm:@leblancfg/pi-fusion
```

GitHubから直接も可能。

```bash
pi install git:github.com/leblancfg/pi-fusion
```

実体は `~/.pi/agent/npm/node_modules/@leblancfg/pi-fusion/dist/` に置かれ、初回起動で `~/.pi/agent/fusion.json` にデフォルトプロンプトが4種類自動書き込みされる。**次回のpi起動から自動ロード**される。

---

## どう動くか — 4フェーズのパイプライン

fusionを発動させると、1つのプロンプトが次の4フェーズを通る。

```
あなたの入力
  ├─① Discovery（任意）……コードベースの文脈を1回だけ集める
  ├─② Rewrite（任意）……プロンプトをN個の「別角度」に書き換え
  ├─③ Workers（N個）……各角度で並列プランニング（独立したpiサブプロセス）
  └─④ Synthesis ………③の結果をシステムプロンプトに注入→メインモデルが回答
```

- **Discovery** は分析・回答を禁じられた「文脈収集専用」のステップ。下流が同じファイルを繰り返し読まないように、関連ファイル・シンボル・API・コマンドを機械的に集める。
- **Rewrite** はRAGのクエリ拡張に似た処理。プロンプトをN個の補完的な探索角度に展開する。
- **Workers** はそれぞれ独立したpiサブプロセス（JSON printモード）。共有のdiscovery文脈を注入され、各自の角度で計画を立てる。実装はしない。計画だけ。
- **Synthesis** はあなたが既に選んだメインモデル。ワーカーの計画バンドルがシステムプロンプトに注入され、モデルが自ら検証しながら元の要求に取り組む。

重要な性質が2つある。

1. **1回動くと自動でOFFに戻る**。次のターンは通常動作。明示的にarmし直すか、常時ON設定にしない限り毎回1発勝負。
2. **あなたの入力は書き換えられない**。`/tree` や `/fork` は常にオリジナルのプロンプトを表示する。計画バンドルは蓄積しない。

---

## `/fusion` で出る「設定ペイン」完全解説

TUIで `/fusion` を打つと中央に浮かぶボックス。**8行**からなる（`↑↓`で移動）。各行の操作はソース（`FusionPane`クラス）で確認した正確な仕様である。

- **Next turn**（`space` で切替）— 次の1回だけfusionを発動。`armed`（緑）/`off`（灰）で表示。←/→でも切替可。これが「 armed 」状態のときだけ、次のプロンプトがfusionターンになる。
- **Agent tools**（`space` で切替）— discovery/workerが使うツールを `all tools`（全ツール）⇔ `read-only`（read/grep/find/lsのみ）で切替。安全な計画パスではread-onlyにする。
- **Presets**（`enter`）— プリセット管理画面へ。保存（グローバル/プロジェクト）/読込/削除。
- **Workers**（`←/→`・`enter`）— `←/→`でワーカー数 **1〜8** を増減。`enter`でワーカー個別設定ペインへ。
- **Discovery**（`space`・`enter`・`←/→`）— `space`でon/off、`enter`でモデル選択、`←/→`で推論強度。
- **Rewrite**（`space`）— プロンプト書き換えのon/off。
- **Synthesis**（`enter`・`←/→`）— `enter`でモデル選択、`←/→`で推論強度。統合ステップはOFFにできない（これが最終回答）。
- **Save and close**（`enter`）— 設定を保存して閉じる。

共通操作は **`↑↓` 移動 `←/→` 調整 `Enter` 選択 `Esc` キャンセル（何も保存せず閉じる）**。各行の右には薄いヒント（`space arm/disarm` 等）が出るので、画面を見ながら迷わない。

値の表示は `モデル · 推論強度` 形式。`current` はメインセッションのモデルをそのまま使う意味。Discoveryがoffのときは単に `off` と表示される。

---

## Workers行で `enter` を押した先の画面

ワーカーを**個別にモデル・推論強度を割り当てる**ペインが開く。

- **All workers** — 全ワーカーのデフォルト（モデル・推論強度）。`←/→`で推論強度、`enter`でデフォルトモデル選択。
- **#1, #2, #N** — 個別スロット。空欄のままで `All workers` を継承。`←/→`でそのワーカーの推論強度、`enter`でモデル選択。

「#3だけ別モデルを使う」のような**差し替え**ができる。例えば、#1=Gemini Flash、#2=Haiku、#3=現行モデル、#4=Codex というレビューパネル構成も可能。`esc`で設定ペインに戻る。

### モデルピッカー（Enterで起動）

- **タイプで fuzzy 絞り込み**（例: `gem` と打てばGemini系だけに）
- `↑↓` 移動、`enter` 決定、`esc` 戻る
- 一番上の **`current`** は「メインセッションモデルを使う」。基本はこれでよい。
- 形式は `provider/name`（例 `anthropic/claude-haiku-4-5`）

---

## 実行時の「ライブパネル」

arm して質問を送ると、ターミナル中央に **分割パネル** が浮かび、各ワーカーがリアルタイムで動く様子が見える（`FusionLivePanel`）。

### キーバインド（すべて実装確認済み）

- **`Esc` / `Ctrl+C`** — fanout をキャンセル。通常ターンにフォールバックする。
- **`1`〜`9`** — その番号のワーカーを全面拡大して詳細表示。
- **`0` / `Tab`** — 分割ビューに戻る。
- **`p`** — 各ワーカーに割り当てられた **書き換え後プロンプト** の表示ON/OFF。

### ステータスアイコン

- `○` queued（待機・薄色）
- `◐` running（実行中・黄）
- `●` done（完了・緑）
- `⊘` failed（失敗・赤）
- `◌` timed-out（タイムアウト・黄）

### 各列に表示されるもの

1. **ヘッダ** — アイコン + `worker N: #N` + lens（角度）+ 経過時間（`run` = 開始から、`last` = 最終更新から）。
2. **reasoning** — 推論ストリーム。プロバイダが隠すと表示されず「no reasoning stream」と出る。
3. **output** — 出力。空ならツールイベント（`→ ファイル読込 ×3` のように同じものは畳まれる）。

端末が狭くて1列幅が24文字未満になると、**自動的に1ワーカーずつのフォーカス表示**に切り替わる。500msごとに実行中のものは再描画される。

---

## 推論強度（reasoning）の値

Discovery / Worker / Synthesis のすべてに設定可能。`←/→` で循環する。

```
current → off → minimal → low → medium → high → xhigh
```

`current` はセッション設定に従う。基本は**安いワーカーで `off`/`low`、統合モデルで `high`** にするとコスパが良い。

---

## 4つのプロンプト — すべて編集可能

初回起動で `~/.pi/agent/fusion.json` に自動書き込みされる。`prompts` セクションで全文を書き換え可能。プレースホルダは `{{placeholder}}` 形式。

- **discovery** — 文脈収集専用。分析・回答・推薦を禁じ、機械的に集めるだけ。プレースホルダ: `{{cwd}}` `{{task}}` `{{recentContext}}` `{{toolGuidance}}`。
- **rewrite** — プロンプトをN個の別角度に展開。JSON配列を返す。プレースホルダ: `{{workerCount}}` `{{task}}` `{{recentContext}}`。
- **worker** — 各ワーカーのプランニング。実装禁止、計画のみ。プレースホルダ: `{{assignedPrompt}}` `{{discoveryContext}}` `{{workerName}}` `{{task}}` 等。
- **synthesis** — 統合ターンに注入される束ね指示。プレースホルダ: `{{workerOutputs}}` `{{variations}}` `{{discoveryContext}}` `{{task}}` `{{imageNote}}`。

synthesis プロンプトには必ず `<!-- pi-fusion:synthesis-prompt -->` マーカーが必要（次ターンが「fusion済み」を検知するため）。消しても拡張側が防御的に付加する。

プロジェクト単位の上書きは `.pi/fusion.json`。フィールド単位でマージされる（例: worker だけ上書き）。

---

## プリセット（Presets）

設定ペインの状態を名前付きで保存できる。**組み込みプリセットは存在しない**（古くなるので）。自分で作る前提。

- **保存先** — `~/.pi/agent/fusion.json`（グローバル）/ `.pi/fusion.json`（プロジェクト）。プロジェクトが同名ならプロジェクト優先。
- **Presets** 行 → `enter` で: グローバル保存 / プロジェクト保存 / 読込 / 削除。
- **CLI** — `/fusion preset save 名前`, `/fusion preset save-project 名前`, `/fusion preset list`, `/fusion preset 名前`。
- **起動時** — `pi --fusion-preset cheap-planners --fusion-enabled`。

**最初に試す設定の定番**は、安いプランナーに高い統合を組む構成。discovery/worker を Gemini Flash 等の廉価モデル（thinking off）にし、synthesis を current（今のメインモデル）にする。ワーカーは「盲点減らし」に使い、高価な判断は統合モデルに任せる。

---

## コンテキスト予算 — 3つの数値

3つの聴衆（統合ターン / resume / 下流ワーカー）で予算が別々に設定できる。

- **`/fusion output N`**（`fusion-output-bytes`、デフォルト 12000）— 統合ターンに注入する**各ワーカーの出力**。
- **`/fusion context N`**（`fusion-context-bytes`、デフォルト 16000）— discovery/worker に送る**最近の会話**。
- **`/fusion resume N`**（`fusion-resume-bytes`、デフォルト 8000）— resume/次ターンが実際に見る**持ち越し要約**。

完全な transcript は常に記録され、これら予算は「モデルに見せる量」だけを制限する。

---

## セッション記録 — アーカイブ & resume

fusion ターンは1つのpiセッションファイル内に **3種のエントリ** を書き込む（append-only、上書きしない）。

- **`pi-fusion-settings`**（custom、モデルに見えない）— 設定スナップショット。次セッション復元用。
- **`pi-fusion-run`**（custom_message、モデルに見える・制限付き）— モデルが見る要約ハンドオフ。
- **`pi-fusion-archive`**（custom、1 manifest + N chunks、モデルに見えない）— 完全・無切断の全 transcript。監査用。

つまり、モデルのコンテキストは膨らまず、しかし**全ワーカーの完全な思考はディスクに残る**。

見るには:

```
/fusion-transcript                  直近のrunを表示
/fusion-transcript list             このセッションの全run一覧
/fusion-transcript <run-id>         特定run
/fusion-transcript <run-id> --write out.md   ファイル書き出し
```

run-id は `fusion-YYYYMMDD-HHMMSS-xxxx` 形式で時系列ソート可能。アーカイブのチャンクは48KB単位でロスレス分割され、`index` 順に結合すればバイト単位で完全復元できる。

---

## fusion がスキップされる条件（bypass）

予測可能性と再帰防止のため、以下はfusion対象外。

- スラッシュコマンド・プロンプトテンプレート（`/...`）
- ユーザーbash（`!...`）
- 拡張が注入した入力
- エージェント実行中に追加されたフォローアップ
- 既にfusion統合プロンプトのターン
- fusion が off/disarm のターン

---

## 知っておくべき「粗い部分」

- discovery/rewrite/worker は**ターンをブロック**する（完了・タイムアウト・Escのいずれかまで）。
- ワーカーは**真のセッションforkでなくサブプロセス**。会話はテキストスナップで渡る。
- **画像は discovery/worker には見えない**（統合ターンだけ見える）。
- ライブ分割ペインは **TUIモードのみ**。print/JSON/RPC でも動くが進捗は出ない（stdoutを汚さないため）。
- ワーカーは `AGENTS.md` やインストール済み拡張を読み込む（fusion自身だけは `PI_FUSION_SUBAGENT` 環境変数で再帰回避）。
- プロバイダが推論ストリームを隠すと、worker列に推論が表示されないことがある。
- 現在のパイプラインは synthesis ターンの前に **2往復のLLMラウンドトリップ** を使う。軽量モードは将来ありうるが、今は明示フローの方がテストしやすい。

---

## コマンド & スタートアップフラグ早見表

```
/fusion                         設定ペインを開く
/fusion on  /  off              次回arm / 解除
/fusion status                  現状表示
/fusion workers 4               ワーカー数
/fusion tools all | read-only   ツール権限
/fusion discovery-model X       discoveryモデル
/fusion worker-model X          全ワーカーのデフォルトモデル
/fusion synthesis-model X       統合モデル
/fusion output/context/resume N 予算（bytes）
/fusion timeout 600000          タイムアウト（ms）
/fusion preset list|save|NAME   プリセット操作
/fusion-transcript [list|id]    記録の確認
```

スタートアップフラグ（`pi` 起動時に固定）:

```
pi --fusion-enabled
pi --fusion-preset cheap-planners
pi --fusion-workers 3
pi --fusion-planner-tools read-only
pi --fusion-discovery-model anthropic/claude-haiku-4-5
pi --fusion-discovery-thinking low
pi --fusion-worker-model google/gemini-3.5-flash
pi --fusion-synthesis-model openai/gpt-5.2-codex
pi --fusion-synthesis-thinking high
pi --fusion-output-bytes 12000
pi --fusion-context-bytes 16000
pi --fusion-resume-bytes 8000
pi --fusion-timeout-ms 600000
```

`current` を指定すればセッションモデルを引き継ぐ。

---

## 最初の1歩・おすすめ設定

新しく `pi` を立ち上げる → `/fusion` → **Next turn** を `space` で `armed` にする → 曖昧な質問を送る（例: 「このリポジトリのバグを探して」「このリファクタを計画して」）→ ライブパネルで `1`/`2`/`3` を押して各ワーカーの動きを見る → `0` で戻る。

fusionが効くタスク:

- 「バグを探してほしいが、どこにあるか分からない」
- 「ファイルに触る前にリファクタを計画して」
- 「見知らぬ領域をレビューして、最小の安全な変更を提案して」
- 「コミット前にいくつか実装案を比較して」

fusionが合わないタスク:

- 起動レイテンシがタスクより高くつく些細な編集。
- 画像を含むプロンプト（統合ターンは見えるが、discovery/worker は見えない）。
- 進捗をstdoutに出す必要がある完全非対話実行（fusionはprint/JSON/RPCモードで静かになる）。

---

## おわりに — 推論の設計を自分で握る

pi-fusionの価値は、「最も賢いモデル1体に長く考えさせる」という暗黙の前提を、**設定可能なパラメータ**に変えた点にある。何回走らせるか、どのモデルで、どのツールを許し、どのくらいの予算で、どう統合するか。それらを全部、あなたが決める。

独立したパスはそれぞれ違う間違いをする。だから統合は、一つの経路に賭けるより頑健になる。常に勝つわけではない。だが「フロンティアモデルより安く速く、時に良い」という主張を、 vibes ではなく**自分のワークロードで検証できる**仕組みが、ここにある。

1行でインストールでき、`/fusion` 1つで試せる。まずはarmedにして、曖昧な問いを1つ投げてみてほしい。

