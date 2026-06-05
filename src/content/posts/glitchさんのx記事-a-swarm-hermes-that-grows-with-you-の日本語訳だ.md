---
title: "glitchさんのX記事「a swarm & hermes that grows with you」の日本語訳だ。"
date: 2026-06-04
slug: glitchさんのx記事-a-swarm-hermes-that-grows-with-you-の日本語訳だ
category: "note.com"
eyecatch: "/assets/eyecatch/ndf92db2de104.jpg"
---

# glitchさんのX記事「a swarm & hermes that grows with you」の日本語訳だ。

> 出典: note.com / 2026-03-31

── 前書き ──

36時間前に始まったこと。私は9年間グロス実験を回してきた。グロースハック、 distribuição、最適化。ループは常に同じ：仮説→テスト→計測→保持or廃棄→繰り返し。

問題がアイデアだったことはない。速度だ。人間のチームでは週2〜5本の実験が限界だ。時間の大半が調整でなくなるか、実行に使えない。リサーチが分析と繋がっていない。ライターが先週何が効いたか知らない。文脈は人間の頭の中にあり、スレッドのなかで死んでいく。

AIエージェントで直したかった。OpenClawもスタンドアロンエージェントも「AI社員」も全部試した。同じ理由で壊れ続けた。

**チームのいないエージェントは文脈のないプロンプトでしかない。**

誰もリサーチも分析も戦略もいないライターを雇わない。チームを組む。それが私がやったことだ。

── ハーブの構成：スワーム×Hermes ──

複数エージェントを「チーム」として動かすスワームフレームワークを作った。各エージェントに役割・ツール・MCPアクセス・専用モデル・コンテキストウィンドウが割り当てられている。知識を共有し、作業を引継ぎ、互いの結果から学ぶ。

Hermesがその上に「オペレーター」として座る。スワームを制御し、タスクを委任し、エージェンシ配下のエージェントから学ぶ。**Hermes + スワームで一緒に賢くなる。**

核心アイデア：**1フォルダ = 1チーム。**

teams/rabin/

├── program.md           # ミッション+制約+音声規則

├── brand-kit.md         # ライター向けブランドID

├── agents/

│   ├── research-analyst/

│   ├── growth-lead/

│   ├── linkedin-writer/

│   ├── twitter-writer/

│   ├── visual-designer/

│   ├── analytics-agent/

│   └── ...11 agents

└── results/

└── [agent-id]/

├── strategy.md  # 進化していく

└── results.tsv  # 実験ログ

── Hermesを選んだ理由（vs OpenClaw）──

**1. Python vs Node：** ML/AI基盤を組むならPythonがネイティブ。httpx、asyncio、apscheduler、numpy全部pip。Nodeだとエコシステムと戦う。これだけで決定の60%。

**2. 実行サンドボックス：** Hermesはlocal/Docker/SSH/Singularity/Modalの5バックエンド。コンテナ強化できる。30+エージェントがファイルを書きAPIを叩く環境ではこれが効く。

**3. サブエージェント分離：** 親のコンテキストを汚さず子エージェントを並列実行できる。OpenClawはセッションベースなのでコンテキストが汚れる。

**4. メモリ設計：** Hermesは永続メモリ+スキルで再起動後も維持。OpenClawは起動時に作業メモリが初期化される既知の問題がある。

**5. SOUL.mdのホットリロード：** Hermesは全メッセージでリロード。再起動不要。OpenClawは設定変更に再起動が必要。

**6. RL+調査パイプライン：** HermesはAtropos RLのトレーニング統合。ShareGPT形式のエクスポート。OpenClawにない。

正直なトレードオフ：OpenClawのUXは優れている（今のところは）。だが私はインフルエンサー1人ではなく**無限のエージェントを調整するエンジン**を組んでいる。

── エンジンの動作 ──

2フェーズのサイクル：

**Phase 1（自動・毎朝）：** アナリストがスキャン→グロスリードが角度を決定→タスクを割り当て→停止して承認待ち。コーヒーを飲みながらTelegramで承認する。

**Phase 2（承認後・並列）：** 並列実行（ライター・デザイナー・動画・ニュースレター・リサイクル）。

auto_approve=True で承認不要にできる。

── Karpathyパターン ──

Karpathyのautoresearchパターンをグロスに適応した。全エージェントに3つのファイル：

- program.md — 不変の目標 + 唯一の北星メトリック

- strategy.md — 結果に基づいて進化する「編集可能部分」

- results.tsv — 追加専用実験ログ

ループ：現在の戦略を読み実験→実行→計測。改善した？戦略変更を保持。改善せず？元に戻す。失敗をログる。別の手を試す。

---
*この記事は note.com から KTBLOG に移行されました。元記事: https://note.com/famous_prawn2009/n/ndf92db2de104*