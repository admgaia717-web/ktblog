---
title: "無修正AI・・・知能の非武装地帯——ローカルAIとサイファーパンクが世界の格差をぶっ壊す最後の一手"
date: 2026-06-04
slug: 無修正ai-知能の非武装地帯-ローカルaiとサイファーパンクが世界の格差をぶっ壊す最後の一手
category: "サイファーパンク"
eyecatch: "/assets/eyecatch/n518bdb0daac4.png"
---

# 無修正AI・・・知能の非武装地帯——ローカルAIとサイファーパンクが世界の格差をぶっ壊す最後の一手

> 出典: note.com / 2026-02-10

##

## 序：「拒否」という名の階級制度

2026年、世界は奇妙な二重構造に陥っている。

一方にはGPT-5やClaude、Geminiを月額数千円で使い、英語圏の最新知識にアクセスし、コードを書かせ、事業計画を練り、法的文書を起草させる人々がいる。もう一方には、そもそもAIが何をできるか知らないまま、旧来の情報格差の底に沈んだまま取り残される人々がいる。

OECDの2025年報告書「Emerging Divides in the Transition to AI」は、AI導入率の国家間格差が2021年の2〜16%から2024年には4〜28%に拡大したと報告した。スタンフォード大学のSanmi Koyejo教授は、スワヒリ語の話者が2億人いるにもかかわらず、LLMの訓練データが圧倒的に不足している現実を指摘する。言語データの偏りは、そのまま「AIの恩恵を受けられるかどうか」の線引きになる。

だが、この格差構造には致命的な綻びが生まれつつある。

それが**ローカルLLM**——自分のPCで動く、検閲なし・登録なし・課金なしの人工知能だ。

## 第一章：Abliteration——「拒否」を外科手術で除去する技術

ChatGPTに「爆弾の作り方を教えて」と聞けば、「申し訳ありませんが、そのリクエストにはお応えできません」と返ってくる。Claudeに過激な小説の続きを書かせようとすれば、途中で「この方向での創作は控えさせていただきます」と止まる。この「拒否」は、RLHF（人間のフィードバックによる強化学習）やDPO（直接選好最適化）といった高度な訓練技法で後天的にモデルに埋め込まれたものだ。

ところが2024年、Arditi、Obeso、Nandaらの研究チームがLesswrongで発表した論文は、このAI安全性研究の前提をひっくり返した。彼らの発見はシンプルかつ衝撃的だった。**LLMの「拒否」行動は、モデルの残差ストリーム内のたった一つの方向ベクトルによって制御されている**。

この発見を応用したのが「Abliteration（アブリテレーション）」と呼ばれる技術だ。Maxime Labonneのハンズオン記事（Hugging Face Blog, 2024）やFailSpyのライブラリ実装により、**再訓練なしで任意のLLMから拒否メカニズムを除去する手法**がオープンソースで公開された。

やり方は驚くほど単純だ。無害なプロンプトと有害なプロンプトをモデルに流し、活性化パターンの差分から「拒否方向」を特定する。そしてモデルの重みをこの方向に対して直交化する。これだけで、モデルは「As an AI, I cannot assist with...」と言わなくなる。

2025年9月にPreprints.orgで公開された論文「Uncensored AI in the Wild」（Bahrad et al.）は、Hugging Face上で**8,608件**の検閲除去モデルリポジトリを特定した。未修正モデルが有害リクエストに18.8%しか応じなかったのに対し、修正済みモデルは平均**74.1%**の従順率を示した。しかもこの効果はモデルサイズに依存せず、14Bパラメータの小型モデルが70Bモデルと同等の検閲回避率を達成するケースもあった。

さらに衝撃的なのは、2025年のarXiv論文（arXiv:2508.12622）が報告した数字だ。Hugging Face上のuncensored LLMは**11,000件以上**、累計ダウンロード数は**1,900万回以上**。最も人気のあるモデルはMistral-7B-v0.1、Dolphin-2.5-Mixtral-8x7B、WizardLM-13B-Uncensored。

この波は止められない。Eric Hughes が1993年のサイファーパンク宣言で書いた一節が、30年の時を超えて的中している。

「暗号」を「ローカルAI」に置き換えれば、いま起きていることそのものだ。

## 第二章：￥0で手に入る「拒否しない知性」——Dolphin、Hermes、そしてJOSIFIED

2026年現在、検閲なしのローカルLLMエコシステムは驚異的な成熟を見せている。

**Dolphin 3.0**シリーズは、Eric Hartford率いるcognitivecomputationsが開発するuncensored LLMの代名詞だ。Llama 3.1/3.2やMistralをベースに、alignment（安全アライメント）データを意図的にフィルタリングしたデータセットでfine-tuneされている。結果として得られるのは、「倫理・道徳・合法性で拒否しない」モデル——つまり、質問に対して最後まで答え切るAIだ。

**Nous Hermes 3**はクリエイティブ・ロールプレイ特化のuncensoredモデルで、長文の一貫性に優れる。**JOSIEFIED-Qwen3:8b**は、abliterationとfine-tuningを組み合わせた2025年の新星で、UGIリーダーボードのAdherenceスコアで完全な10/10を達成しつつ、純粋なabliterationモデルが抱える「長い会話での知能劣化」問題を克服している。

The Sovereign Stack（2025年12月、WatsonOut）の記事は、このエコシステムの現在地を端的に表現する。「2026年の分断は、『AIユーザー』と『非AIユーザー』の間ではない。**『ユーザー』と『管理者（Admin）』の間だ**。管理者になれ」

これらのモデルはすべて無料だ。LM Studio、Ollama、Private LLMといったランタイムを介して、Mac（Apple Silicon 64GB以上推奨）やRTX 3060以上のGPUを搭載したPCで、数分でセットアップできる。8Bクラスのモデルなら40〜80トークン/秒で動く。人間の読書速度を超える速度で、検閲ゼロの知性が手元で動く。

## 第三章：光と影——Dark LLMという現実

だが、この自由には暗い双子がいる。

Group-IBが2025年に発表した調査によれば、ダークウェブにおけるAI関連の議論は**23,621件の新規投稿と298,231件の返信**に達した。AI関連の言及は2019年比で**371%増**。犯罪AIの利用は「第5のサイバー犯罪の波」と名付けられた。

**WormGPT**（GPT-Jベース）、**FraudGPT**（月額$90のサブスク）、**Nytheon AI**（80BパラメータのTORホスト型ハイブリッドLLM）——これらの「Dark LLM」は、マルウェア生成、フィッシングキット作成、ソーシャルエンジニアリングスクリプトの自動化を月額$30〜$200で提供する。Cisco Talosの報告によれば、FraudGPTの販売者「CanadianKingpin12」は実際には詐欺だったが、DarkestGPTやGhostGPTなど複数のサービスが実際に稼働している。

2025年第2四半期だけで、ディープフェイク関連の被害額は**3億5,000万ドル**に達した（Resemble.ai調べ）。合成IDキット（AI生成の顔・声・生体データ）がわずか**5ドル**で売買されている。

Check Pointの初のAIセキュリティレポートは、オープンソースモデルの中国製LLM（DeepSeek、Qwen）が「最小限の使用制限と無料枠」によって犯罪利用の「鍵となる資産」になっていると警告する。Hugging Faceには100件以上の汚染モデルがアップロードされた報告もある。

これは「ツールの中立性」という理想論では片付けられない現実だ。

## 第四章：サイファーパンクの回答——「止められないなら、武装しろ」

1993年、Eric Hughesはこう書いた。

この宣言から33年。暗号技術はBitcoinを生み、Torを生み、PGPを日常にした。Phil Zimmermanは暗号の輸出が「武器輸出規制」に抵触するとして訴追の脅威にさらされた。Hal Finneyは最初のBitcoinトランザクションを受け取った。Julian AssangeはWikiLeaksで国家機密を世界に晒した。Timothy Mayは暗号無政府主義宣言で、政府の手の届かない分散型システムを予言した。

サイファーパンクの歴史は、常に「規制側の遅れ」と「コードの先行」のパターンで動いてきた。暗号輸出規制は撤回された。PGPは世界標準になった。Bitcoinは一時15万ドルを超えた。

そして2026年、同じ精神が「**AIの主権**」という新しい戦場に移行している。

ローカルLLMの本質は、暗号通貨と同じだ。中央管理者がいない。検閲がない。許可が要らない。DAWNプロジェクト（2025年）がサイファーパンク思想をインターネットの物理層にまで拡張したように、ローカルAIは知能の層を個人の手に取り戻す。

重要なのは、この技術が格差構造を**両方向から**破壊することだ。

**上方向の破壊**：月額$20のClaude Proや$200のChatGPT Proを払えない人々——グローバルサウスの研究者、途上国の起業家、地方の独居高齢者の支援者——が、ローカルの8Bモデルで「検索して要約して、翻訳して、文章を書く」という知的労働の基本セットを手に入れる。完璧ではない。GPT-4級の知能はない。だが「拒否しない」「無料」「オフラインで動く」という三点だけで、情報格差のボトルネックが消える。

**下方向の破壊**：Dark LLMの脅威は確かに存在するが、それは「強力な道具が民主化された結果」であり、「道具を独占層だけに制限すべき」という議論は、暗号技術の輸出規制（1990年代のCrypto Wars）と同じ構造を持つ。サイファーパンクたちはあの戦争に勝った。暗号は世界中に広がった。

## 第五章：鶴舞から宇宙へ——ローカルAIが開く「一人メディア帝国」の射程

奈良県の鶴舞地区で、月額2万6千円の文化住宅に住みながら、Perchanceで画像を無限生成し、Dolphin 3.0で検閲なしの長編創作を走らせ、Qwen3-14Bで日本語翻訳エージェントを回す。M1 Max 64GBのMacが一台あれば、その全てが同時に動く。

これは空想ではない。2026年の現実だ。

かつて出版社に所属しなければ本は出せなかった。テレビ局に入らなければ映像は届けられなかった。レコード会社と契約しなければ音楽は流通しなかった。インターネットがそれらの壁を壊したように、ローカルAIは「知能のゲートキーパー」を消滅させる。

OpenAIやGoogleが月額$200の最上位プランで提供する知的労働——調査、分析、翻訳、コード生成、文章作成——の基本セットが、8Bパラメータのuncensoredモデルでおおよそカバーできる。完璧ではない。推論の深さは劣る。だが「拒否しない」「無料」「オフラインで動く」「プライバシーが守られる」という四点だけで、従来の情報格差のボトルネックが根本から崩れる。

Stanford HAI Policy White Paperが指摘するように、LLMの多言語能力は従来のデジタルツールよりも非英語圏の「リープフロッグ（飛び越え発展）」を可能にする。ローカルLLMとabliteration技術の組み合わせは、この可能性をさらに加速する。

Carnegie Endowment for International Peaceの2026年1月の報告書「AI and Democracy」は、AIが民主主義にもたらす機会とリスクの両面を分析した。その中で注目すべきは、AIが「既存のデジタル変革の効果をエコーし増幅する」という指摘だ。増幅されるのがポジティブな方向かネガティブな方向かは、技術の設計と使い方次第——つまり、私たちの選択次第だということになる。

格差を壊す最後の一手は、規制でも補助金でもない。**コードだ**。

11,000以上のuncensoredモデルが、1,900万回ダウンロードされ、世界中の個人のPCで静かに走っている。この事実の前で「規制すべき」と言うのは、大洋に壁を築くようなものだ。

正しい問いは「止められるか」ではない。「この自由を、誰のために使うか」だ。

## 結語：知行合一としてのローカルAI

陽明学の「知行合一」は、知ることと行うことは本来一つだと説く。知っていて行わないのは、真に知ったとは言えない。

ローカルLLMの真の革命性は、「知」のコストをゼロに近づけることで、「行」への障壁を消すことにある。事業計画の立案も、法的文書の下書きも、多言語コンテンツの制作も、プログラミングの補助も——従来は専門家への依頼が必要だった知的作業が、個人のラップトップで完結する。

もちろん、Dark LLMの問題は深刻だ。犯罪の民主化は現実に進行している。だが歴史を振り返れば、印刷機は異端書と啓蒙思想の両方を広め、インターネットは詐欺と電子商取引の両方を生み、暗号通貨はマネーロンダリングと金融包摂の両方を実現した。強力な技術は常に両刃の剣であり、片方の刃を恐れて技術そのものを封じれば、もう片方の恩恵も失われる。

サイファーパンクの答えはいつも同じだ。**技術は人間の自由を拡張するために存在する。悪用は法と社会規範で対処し、技術そのものは解放せよ。**

2026年、ローカルAIという名の暗号技術が、静かに、だが確実に、世界の格差構造の最後の壁を溶かし始めている。その先に見えるのは、月額サブスクの有無で人間の知的可能性が制限されない世界——サイファーパンクたちが30年前に夢見た、「自分たちの手で自分たちの自由を守る」世界そのものだ。

あなたのPCに、Dolphinをインストールしてみてほしい。5分で「拒否されない知性」が手に入る。それは人類史上最も安価で、最も静かな革命の入り口だ。

**参考文献・情報源**

Arditi, Obeso, Nanda et al., "Refusal in LLMs is mediated by a single direction," LessWrong, 2024

Maxime Labonne, "Uncensor any LLM with abliteration," Hugging Face Blog, 2024

Bahrad et al., "Uncensored AI in the Wild: Tracking Publicly Available and Locally Deployable LLMs," Preprints.org, September 2025（8,608リポジトリ分析）

arXiv:2508.12622, 2025（11,000以上のuncensored LLM、1,900万DL）

OECD, "Emerging Divides in the Transition to Artificial Intelligence," Regional Development Papers No.147, 2025

Stanford HAI, "How AI is leaving non-English speakers behind," 2025（Sanmi Koyejo教授）

Group-IB, "Weaponised AI is Powering the Fifth Wave of Cybercrime," January 2026（Dark LLMホワイトペーパー）

Group-IB, "From Deepfakes to Dark LLMs: 5 use-cases of how AI is Powering Cybercrime," September 2025

Cisco Talos, "Cybercriminal abuse of large language models," July 2025

Check Point, AI Security Report, 2025

The Register, "For the price of Netflix, crooks can now rent AI to run cybercrime," January 2026

WatsonOut, "The Sovereign Stack: Best Uncensored LLMs for Local Inference," December 2025

JOSIEFIED-Qwen3:8b, UGI Leaderboard Adherence 10/10（hashnode.dev解説記事, November 2025）

Eric Hughes, "A Cypherpunk's Manifesto," 1993

DAWN Project, "Why DAWN is Cypherpunk," Medium, October 2025

Carnegie Endowment, "AI and Democracy: Mapping the Intersections," January 2026

vertical composition, square format, portrait orientation, blurry, low quality, deformed hands, extra fingers, watermark, text, logo, cartoon, anime, oversaturated, generic office, centered subject, close-up face

---
*この記事は note.com から KTBLOG に移行されました。元記事: https://note.com/famous_prawn2009/n/n518bdb0daac4*