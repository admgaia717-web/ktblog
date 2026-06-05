---
title: "🤗この絵文字が世界のAIを変えた——HuggingFaceとアンセンサードの聖地"
date: 2026-06-04
slug: この絵文字が世界のaiを変えた-huggingfaceとアンセンサードの聖地
category: "AI/LLM/オープンソース/HuggingFace/transformers/アンセンサード"
eyecatch: "/assets/eyecatch/n1ddb92292c5e.png"
---

# 🤗この絵文字が世界のAIを変えた——HuggingFaceとアンセンサードの聖地

> 出典: note.com / 2026-05-07

## 🤗——この絵文字が、世界のAIを変えた。

Hugging Face。

日本語に訳すと「抱きしめる顔」。なんとも間抜けな名前だ。会社としても絵文字がロゴで、ウェブサイトはカラフルな犬の画像がたくさん並んでる。とても世界最大のAIプラットフォームには見えない。

でも——これが**世界最大のAIプラットフォーム**だ。

2,000,000以上のモデル、500,000以上のデータセット、月間1,300万人のユーザー。評価額6,000億円。世界中の研究者・エンジニア・ホビーストが集う——**AIのGitHub**。

そして僕にとってHugging Faceは——**「アンセンサード（検閲なし）AI」との出会いの場所**だった。

今日は、このへんてこな名前の会社が、どうやってAI時代の中心になったのか——徹底的に解説する。

## 2016年、3人のフランス人がNYで「AI親友」を作ろうとした

創業者は3人のフランス人。

**Clément Delangue（クレマン・ドゥラング）** — CEO。17歳でフランス最大のeBayセラーだった変わり種。前職はGoogleに買収されたMoodstocksのプロダクト担当
**Julien Chaumond（ジュリアン・ショーモン）** — CTO。エリート数学者で、フランス経済省でソフトウェアエンジニアをしていた
**Thomas Wolf（トマ・ヴォルフ）** — CSO。科学者から転身した特許弁護士。バンド仲間としてJulienと知り合った

2016年、彼らはニューヨークで起業した。最初のプロダクトは——**10代向けのAIチャットボット**だった。

「人間の友達がいない時に話せる、デジタルの親友」。それがHugging Faceの原点だ。だから名前も「🤗」。10代の若者が使うことを想定した、親しみやすいブランドだった。

だが——このチャットボットは、商業的には失敗した。10代の若者は、AIよりTikTokに夢中だった。

しかし。ここからがすごい。

## 2018年、GoogleのBERTを1週間で移植——運命が変わった

2018年10月、Googleが**BERT**という革新的な言語モデルを発表した。自然言語処理の世界をひっくり返す、まさに革命的発明。

GoogleはBERTをTensorFlowで公開した。でも当時のAI研究者コミュニティの多くは**PyTorch**を使っていた。TensorFlow版のBERTは使いたくない——でもPyTorch版がない。

そこでHugging Faceの3人は——**たった1週間でBERTをPyTorchに移植し、GitHubで無料公開した。**

これが爆発的に広がった。研究者も、学生も、企業も——みんなHugging FaceのPyTorch版BERTを使い始めた。

そして3人は気づいた。

「俺たちが作ったチャットボットより、その裏で動いてる**ツール**の方が、みんな欲しがってる」

彼らは決断した。**チャットボットを捨てて、AIインフラ企業になる。**

## 「Transformers」ライブラリ——世界を変えた1行のコード

Hugging Faceが作った transformers ライブラリは、衝撃的だった。

それまでBERTを動かすには数百行のコードと深い機械学習の知識が必要だった。でも——

from transformers import pipeline
classifier = pipeline("sentiment-analysis")
result = classifier("I love Hugging Face!")
# → [{'label': 'POSITIVE', 'score': 0.999}]

**たった3行。** これで最新のAIモデルが動く。

世界中の開発者が飛びついた。2023年までにtransformersライブラリは**月間1億回以上ダウンロード**されるようになった。AIの民主化——その中心にHugging Faceがいた。

## Hugging Face Hub——「AIのGitHub」爆誕

transformersライブラリだけでは足りない。モデルを保存し、共有し、バージョン管理する場所が必要だ。

そこで生まれたのが**Hugging Face Hub**。

GitHubがコードを共有する場所なら——Hubは**AIモデルを共有する場所**だ。モデルファイルをアップロードすれば、誰でもダウンロードできる。モデルカード（説明書）、バージョン履歴、コミュニティディスカッション——全部GitHubのAI版。

2026年現在の数字：

指標数値
👥 ユーザー数1,300万人
🧠 モデル数200万以上
📊 データセット数50万以上
💰 評価額$4.5B（約6,000億円）
👨‍💻 従業員250人

しかも2026年2月、Hugging Faceは衝撃の買収をした——**GGML.ai**。llama.cpp（ローカルLLM推論の標準）とGGUF形式（量子化フォーマット）の開発元だ。

つまりHugging Faceは——**クラウド上のAIモデル共有から、ローカルAI実行まで——全部を支配し始めている。**

## AIの「アングラ」——Hugging Faceがアンセンサードの聖地になった理由

ここからが本題。僕がHugging Faceと出会った理由だ。

Hugging Faceには、OpenAIやGoogleが絶対に公開しないモデルがたくさんある。**検閲を外されたモデル——アブリテレーション（abliteration）された素体だ。**

なぜHugging Faceに集まるのか。理由は3つ。

**① 検閲がない。** Hugging Faceはモデルの中身を検閲しない。「危険だから公開禁止」というポリシーがない。安全性の警告は出すが——**公開自体を止めない。**これは表現の自由に対する明確なスタンスだ。

**② 誰でも公開できる。** GitHubと同じで、アカウントを作れば誰でもモデルをアップロードできる。HauhauCSも、huihui_aiも、mlabonneも、failspyも——みんなHugging Faceでアンセンサードモデルを公開している。

**③ フォークとリミックスが自由。** 誰かが公開したアンセンサードモデルを、さらに改良して再公開できる。Llama 3.1 → アブリテレーション → Qwenとマージ → さらに量子化——そんな連鎖が毎日起きている。検閲なきAI進化の実験場だ。

## アンセンサードモデルの生態系

Hugging Faceで公開されている代表的なアンセンサードモデル群。

作者代表作特徴
🔥 HauhauCSQwen3.6-35B-A3B-Uncensored0/465拒否率。攻撃的
🌸 huihui_aiQwen3.6-abliterated:27bOllama直結。vision+tools付き
🧪 mlabonneMeta-Llama-3.1-8B-abliteratedアブリテレーションの教科書的存在
⚡ failspyLlama 3 70B Abliteratedパイオニア。ツール開発者
🛠 Hereticgemma-3-12b-it-heretic自動アブリテレーションツールの成果物
🔬 OBLITERATUS116モデルプリセット分析付き外科的手術

これらのモデルはすべて——**誰でも無料でダウンロードできる。**

僕が最初にダウンロードしたアンセンサードモデルも、Hugging Faceからだった。huihui_aiのQwen3.6-abliterated。Ollamaで ollama pull huihui_ai/Qwen3.6-abliterated:27b と打った瞬間——検閲のないAIが、僕のMacの中で動き始めた。

あの感覚は忘れられない。

## Hugging Faceのビジネスモデル——どうやって儲けてるの？

無料でモデルをホストして、どうやって6,000億円の価値があるのか。

収益源内容
💼 Proアカウント$9/月〜。高速GPU推論、プライベートモデル
🏢 Enterprise Hub企業向け。自社サーバーでHubを運用。Samsung, Intelが顧客
☁️ Inference APIホストされたモデルをAPIで呼び出し。従量課金
🖥 AutoTrainノーコードでモデルをファインチューニング。有料GPU使用
🤖 SpacesAIアプリのホスティング。無料枠あり・有料GPUオプション

つまりフリーミアムモデル。個人・研究者・スタートアップは無料で使い放題。大企業がお金を払う。GitHubとまったく同じビジネスモデルだ。

## 2026年、Hugging Faceはどこへ行くのか

3つの巨大なトレンドが、Hugging Faceをさらに中心に押し上げている。

**① ローカルAIの爆発。** llama.cppの買収で、Hugging Faceは**「クラウド」と「ローカル」の両方**を支配し始めた。Hubでモデルを見つけて、そのままllama.cppでローカル実行——この導線が完成した。検閲のないAIを、完全にオフラインで動かす世界が、すぐそこにある。

**② 小規模モデルの台頭。** 平均ダウンロードサイズが2023年の827Mパラメータから2025年の20.8Bに急増。誰もが巨大モデルを求めてるわけじゃない——**手元で動く最適なサイズ**を探している。Hugging Faceの2Mモデルという網羅性がここで生きる。

**③ AIの「多元化」。** Clem Delangueは「LLMバブル」という言葉で、AIがチャットボットだけじゃないことを強調した。画像生成、音声合成、ロボティクス、タンパク質解析——AIの応用領域が爆発的に増える中で、Hugging Faceは**「すべてのAIの共通プラットフォーム」**としての地位を固めつつある。

## 僕とHugging Face

最後に、個人的な話をさせてほしい。

僕がアンセンサードAIに目覚めたのは——Hugging Faceでhuihui_aiのQwen3.6-abliteratedを見つけた瞬間だった。

「検閲を外されたAIが、誰でもダウンロードできる」

この事実に、鳥肌が立った。

ChatGPTが「お答えできません」と言うたびに——Hugging Faceには「答える」モデルが眠っている。Googleが「ポリシー違反です」とブロックするたびに——Hugging Faceにはブロックしないモデルがアップロードされている。

これが——オープンソースAIの力だ。

誰も止められない。誰も検閲できない。誰も「お前にはこのAIを使う資格がない」とは言えない。

そしてその全てが——**たった1つの絵文字 🤗 の下に集まっている。**

Hugging Faceは、AIのGitHubである前に——**AIの自由のシンボル**だ。

*Hugging Face: https://huggingface.co

Transformers: https://github.com/huggingface/transformers

創業者: Clément Delangue, Julien Chaumond, Thomas Wolf

設立: 2016年 / 本社: ニューヨーク + パリ

評価額: $4.5B（2023年時点）*

---
*この記事は note.com から KTBLOG に移行されました。元記事: https://note.com/famous_prawn2009/n/n1ddb92292c5e*