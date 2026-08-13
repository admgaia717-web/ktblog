---
title: "【83】AIに記憶を渡す戦い——13基盤を一次情報で比較したら5つの艦隊に分かれていた"
date: 2026-08-13
category: "AI・エージェント"
tags: ["AI", "エージェント", "メモリー", "LLM", "Agent Memory", "投資", "プログラミング", "ロボット", "AIエージェント", "生成AI", "OpenAI", "Apple"]
eyecatch: "/Users/kt/Desktop/artisan_gen/artisan_f68ab465.png"
---
テンセントが5月にMITで公開した「TencentDB Agent Memory」を調べた。調べれば調べるほど、これは単なるベクトルDBの上位互換ではなく、エージェントの記憶基盤を巡る戦争が始まっていることが見えてきた。

一次情報（GitHub、公式docs、arXiv論文）だけを使い、2026年8月14日時点で比較可能な13のプロジェクトを横断調査した。結論から言うと、この領域はすでに5つの系統に分かれている。

## なぜ「記憶」が問題なのか

LLMは文脈窓（context window）の中でしか覚えられない。会話が長くなれば忘れる。セッションを閉じれば消える。つまり、人間で言えば「海馬」がない状態だ。

これを解決する素朴なアプローチは「要約→Embedding→Vector DB→類似検索」だ。古くからある。だが2026年、この構造では限界に来ている。理由は3つある。

第一に、エージェントが長時間働くようになった。Web検索、ターミナルログ、コンパイル結果、ツール出力を全部コンテキストに詰め込むと数十万tokenになる。検索の精度以前に、何を入れるかの設計が問われている。

第二に、一人のAIの記憶ではなく、複数エージェントが継承する組織記憶が求められている。Agentを替えても、モデルを替えても、記憶資産は残る必要がある。

第三に、記憶の量だけではなく種類が増えた。会話の事実、ユーザーの好み、成功した作業手順（Skill）、文書知識、コードの構造（CodeGraph）——これらを一つの体系で扱いたい。

## 5つの艦隊

13プロジェクトを整理すると、明確な5系統に分かれた。

**① Personal Memory（個人記憶）**

Mem0とSupermemory。会話から事実を抽出し、ユーザープロファイルを構築する。Connector（Drive、Gmail、Notion）で外部データを取り込み、RAGと記憶を同一検索面で扱う。導入しやすさと統合の広さでは最も成熟している。

**② Cognitive Memory（認知記憶）**

HindsightとLetta。Hindsightは4つの論理ネットワーク（World＝事実、Experience＝経験、Opinion＝意見、Observation＝観察）と3つの操作（retain／recall／reflect）で構成される認知アーキテクチャで、10M token級のBEAMベンチマークで公開ベストの64.1%を報告している。Letta（旧MemGPT）はエージェント自身にcore/archival memoryを読み書きさせるstateful agent harnessで、検索APIではなくエージェントランタイムそのものだ。

**③ Temporal / Knowledge Graph（時間・知識グラフ）**

Graphiti / ZepとCognee。「2025年にGoogleに勤めていたが2026年にOpenAIに移った」という事実を、片方を消すのではなく有効期間付きのグラフとして管理する。bi-temporal（事実の有効時間とシステム記録時間）の厳密さではGraphitiが最も明示的だ。

**④ Memory OS（記憶OS）**

MemOSとEverOS。MemOSはMemCube抽象でplaintext / activation / parametricの3形態の記憶を管理し、ローカルpluginでSkill進化まで扱う。EverOSはMarkdownを真正源（source of truth）とし、`cat memory.md`、`vim memory.md`、`git diff`できる。人間が直接読める記憶設計では最も徹底している。

**⑤ Context / Agent Organization OS（コンテキスト・組織OS）**

TencentDB Agent MemoryとOpenViking。この系統が2026年最も伸びている。

TencentDB Agent Memoryは、会話の記憶だけではなく、Skill、Wiki（文書知識）、CodeGraph（コードのsymbol・call関係・影響範囲）を4種の第一級資産として扱う。会話をL0 Conversation → L1 Atom → L2 Scenario → L3 Core/Personaに階層蒸留し、通常はL2/L3だけを読ませて細かい事実が必要なときだけL1/L0に降りる設計だ。

さらに`private` / `team` / `restricted` / `agent`というACLで、どの記憶を誰が・どのAgentが使えるかを資産単位で管理できる。Agentを交換しても記憶資産は残る。

OpenViking（ByteDance/Volcengine系）はこれを「Context Database」と呼び、`viking://`仮想ファイルシステムとして扱う。Agentが`ls`、`tree`、`find`する感覚で記憶を探索し、各ファイルをL0概要（約100 token）→L1詳細（約2k）→L2原文と階層的に読む。検索経路が残るので「AIがなぜこの記憶を取得したのか」を人間が追跡できる。

## 総合ランキング（一次情報監査スコア）

6軸100点（記憶品質25、資産統合20、チーム/ACL15、ローカル可搬性15、実装成熟度15、可観測性/ガバナンス10）で機械集計した。ただし、これは「同一ハードウェアで再実行した性能順位」ではなく、公式一次情報で確認できる機能・再現性・運用品質の監査点である。

| 順位 | プロジェクト | 記憶 | 資産 | ACL | Local | 成熟 | 観測 | 計 | Stars |
|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | TencentDB Agent Memory | 17 | 20 | 15 | 12 | 14 | 10 | **88** | 21.2k |
| 2 | Honcho | 25 | 12 | 15 | 10 | 15 | 10 | **87** | 6.6k |
| 3 | OpenViking | 20 | 16 | 10 | 13 | 15 | 10 | **84** | 28.4k |
| 4 | Mem0 | 23 | 12 | 8 | 13 | 17 | 10 | **83** | 63.2k |
| 5 | EverOS | 20 | 20 | 5 | 14 | 15 | 9 | **83** | 12.0k |
| 6 | MemOS | 19 | 16 | 10 | 13 | 14 | 8 | **80** | 10.7k |
| 7 | Supermemory | 20 | 14 | 8 | 13 | 15 | 10 | **80** | 28.9k |
| 8 | Cognee | 18 | 13 | 7 | 14 | 16 | 10 | **78** | 30.0k |
| 9 | Graphiti / Zep | 22 | 10 | 7 | 12 | 15 | 11 | **77** | 29.9k |
| 10 | Letta | 18 | 15 | 8 | 12 | 12 | 10 | **75** | 24.2k |
| 11 | Hindsight | 23 | 9 | 5 | 13 | 13 | 8 | **71** | 19.9k |
| 12 | LangMem | 10 | 13 | 5 | 12 | 11 | 5 | **56** | 1.6k |
| 13 | MemoryOS | 19 | 6 | 3 | 13 | 7 | 1 | **49** | 1.6k |

（Starsは2026-08-14確認値。参考値であり、採用・品質の代理ではない）

## ベンチマークの数字は鵜呑みにするな

ここが重要だ。各社のLongMemEvalスコアを一列に並べて「1位は誰か」を決めることはできない。条件が違うからだ。

SupermemoryのLongMemEval「95%」はRecall@15の独自集計で、session単位で履歴を投入するvendor runだ。Hindsightの「94.6%」は公開artifact付きの現行Agent Memory Benchmark値だが、論文の旧条件では83.6%〜91.4%と幅がある。Mem0の「94.4%」はmanaged platform版の自己申告であり、README自体が「OSS版は方向性は似るが同一の数値ではない」と明記している。

Zepについても「論文の71.2%」と「現行Zepの90.2%」は矛盾ではなく、世代と条件の違いだ。CogneeのBEAM 10M「0.67」は1会話20問に対するin-sample routingで、著者自身がexploratoryと明記しているため、Hindsightの64.1%と順位比較してはいけない。

どの数字も自己申告だ。比較するなら、同じモデル、同じjudge、同じデータセット版、同じtop-k、同じハードウェアを固定して再実行するしかない。

## TencentDB Agent Memoryは何が新しいのか

改めて確認すると、TencentDB Agent Memoryの核心は3つだ。

**階層蒸留**: L0会話を非同期でL1原子事実→L2シナリオ→L3ペルソナへ抽象化する。通常はL2/L3だけを読ませる。これは素朴なVector DBの検索とは構造が違う。

**4種資産の統合**: 会話記憶、Skill（バージョン・リソース・発火条件・実行手順・検証ルール付き）、Wiki、CodeGraph（コードのsymbol・caller/callee・影響範囲）を同じMemory Hubで扱う。記憶が経験になり、経験が手順になる。

**チームACL**: `private` / `team` / `restricted` / `agent`で、資産ごとに誰が使えるかを決める。Agentを交換しても、モデルを交換しても、記憶資産は残る。

ただし弱点もある。v2.0.0安定版がある一方、README先頭はTeam Memory Betaと明記する。Memory Assetの自動ルーティングは開発途上で手動Bindingが残る。PersonaMem「48%→76%」はリポジトリに再現harness/resultsディレクトリの記載がなく、READMEの単独主張として扱うべきだ。

## 5つの方向性、5つの選び方

1個だけ選べと言われたら、今のところTencentDB Agent Memory（総合88点）。ただし新しく、枯れていない。

用途別ならこうなる。

- **組織の共有脳を作りたい** → TencentDB Agent Memory、MemOS、OpenViking
- **1体のエージェントを長期間育てたい** → MemOS、Hindsight
- **数百万tokenを正確に思い出させたい** → Hindsight
- **5分でMemoryを付けたい** → Mem0、Supermemory
- **完全ローカル・人間が読める記憶** → EverOS、OpenViking
- **厳密な時系列・組織履歴** → Graphiti / Zep
- **エージェント自身に記憶を管理させたい** → Letta

## Hermes環境との接続

Hermes Agentは8つの外部記憶プロバイダープラグイン（Honcho、OpenViking、Mem0、Hindsight、Holographic、RetainDB、ByteRover、Supermemory）を同梱している。TencentDB Agent Memoryも公式v1/v2プラグインを提供し、MemOSはローカルpluginでHermesを直接サポートする。

つまり、「記憶＋Skill＋Wiki」を連動させる構造は、HermesのSkills + MEMORY.md + gbrain構成と方向が近い。TencentやMemOSがこれを一つのMemory Hubに統合し始めたと見ることができる。

## この先

エージェントの記憶は「Vector DBに放り込んで検索する」時代を抜けた。階層化、資産統合、チーム共有、ローカル可搬性、人間可読性——どの軸を重視するかで選ぶべきものが違う。

そしてこの領域は速い。TencentDB Agent Memoryは4月公開、8月にv2。OpenVikingは1月公開、8月に28k stars。半年前の情報はすでに古い。

次にやるべきは、TencentDB Agent Memory、MemOS、OpenVikingの3つをM1 Max上にローカル構築し、Hermesへ実際に接続して、同じ会話で比較することだ。ベンチマークの数字ではなく、自分の環境でどう動くか。それが唯一の確かな判断材料になる。

---

*この記事は2026-08-14時点の公式GitHub、公式docs/blog、arXiv論文のみを一次情報として使用した。ベンチマーク値は各開発元の自己申告であり、本記事では再実行していない。*

（2026-08-14・ケイティ）

