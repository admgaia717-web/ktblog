---
title: "コミックの自動化の夢 — LoRAからStoryDiffusion、AnyTextまで、AI漫画生成技術の全史"
date: 2026-06-04
slug: コミックの自動化の夢-loraからstorydiffusion-anytextまで-ai漫画生成技術の全史
category: "note.com"
eyecatch: "/assets/eyecatch/n59e010e8f705.jpg"
---

# コミックの自動化の夢 — LoRAからStoryDiffusion、AnyTextまで、AI漫画生成技術の全史

> 出典: note.com / 2026-05-27

「漫画を機械に描かせる」。この夢は、漫画という表現形式が成立した瞬間から存在した。手塚治虫でさえ、アシスタントの量産体制を「人間ワークフロー」の究極形として追求した。しかし——本当の革命は、2022年、全く別の場所から始まった。

Stable Diffusionの公開である。誰もが無料で、プロンプトひとつで画像を生成できる時代が突然訪れた。そしてすぐに、誰もが同じ問いを立てた。

**「これで漫画、作れねえの？」**

答えは「ノー」だった。2022年終盤のStable Diffusionは、一枚の美麗なイラストを生成することはできても、同一キャラが複数コマに登場する「漫画」を生成することは不可能に等しかった。キャラの顔は毎回変わり、構図はバラバラ、吹き出しの文字は崩壊していた。

しかし——不可能を可能にしようとする人間の欲望は、決して止まらない。この2年半、技術は爆発的に進化した。一枚の絵から、連続する「物語」へ。その道のりを、今ここに記す。

## 第一章：2023年——LoRA、キャラ固定の夜明け

2023年初頭、Stable Diffusionコミュニティに衝撃が走った。LoRA（Low-Rank Adaptation）と呼ばれる技術が、画像生成モデルのファインチューニングを一変させたのだ。

LoRAの本質は単純だ。もともとは大規模言語モデルの効率的なファインチューニング手法として、Microsoftが2021年に発表した技術（Hu et al., ICLR 2022）だった。重み行列の更新量を低ランク行列の積で近似することで、数MBのファイルでモデルの振る舞いを劇的に変えられる。これを画像生成に応用したのが、kohya-ss氏が公開したLoRAトレーナー（sd-scripts）だ。

技術的なブレイクスルーはここにある。通常のDreamBoothによるファインチューニングでは2GB以上のモデルファイルが必要だった。LoRAなら20MBだ。しかも学習時間はRTX 4090で30分程度。画像20枚とキャプションさえあれば、特定キャラの顔、スタイル、ポーズをモデルに「刷り込む」ことができる。

これにより、Civitaiでは爆発的にLoRAが流通し始めた。「初音ミクの顔を固定するLoRA」「特定の画風を再現するLoRA」「ある漫画家のタッチを学習したLoRA」——すべてがエロコミュニティの需要に支えられていた。

【実用Tips】LoRA選びの黄金ルール

**環境：**ComfyUI + Kohya's LoRA Loader

1. Civitaiで「<キャラ名> Illustrious LoRA」と検索。ダウンロード数と★評価が信頼性の指標。

2. LoRAの重み（strength）は0.6〜0.9が推奨範囲。1.0を超えると破綻する。

3. 複数のLoRAを同時適用する場合は、合計strengthが1.8を超えないよう調整。

4. sd-scriptsで自作する場合の最小構成：学習画像20〜50枚、解像度768x768以上、学習ステップ1000〜2000、学習率1e-4。

## 第二章：2024年前半——IP-AdapterとControlNet、構図と作風の制御

LoRAでキャラは固定できるようになった。しかし——「このキャラを、この構図で、この背景で」という制御はまだ難しかった。プロンプトだけでは、細かい構図指定は不可能に近い。

ここで登場したのが、IP-Adapter（Tencent ARC、2023年8月公開、GitHub 7,000★）とControlNet（Stanford、2023年2月、GitHub 30,000★）である。

ControlNetは、画像のエッジ（Canny）、姿勢（OpenPose）、深度（Depth）などの条件を拡散プロセスに注入する。つまり「この写真と同じポーズで」という指示がプロンプトだけでなく、参照画像から直接与えられる。漫画制作においては「1コマ目は正面顔、2コマ目は横顔」といった構図制御が可能になった。

IP-Adapterはさらに一歩進んだ。参照画像の「作風」や「画風」そのものをプロンプトとして扱う。画像をCLIPイメージエンコーダで埋め込み、クロスアテンション層に直接注入する方式だ。学習不要で、1枚の参照画像から画風を転写できる。

これらの技術により、「キャラが固定できて、構図も指定できる」という状態が2024年前半に達成された。あとは——吹き出しの文字だけだった。

## 第三章：2024年後半——StoryDiffusion、自己注意機構の革命的抽象化

2024年5月2日。中国・南开大学（HVision-NKU）の研究チームがarXivに投稿した一本の論文が、AI漫画生成の風景を一変させた。

**「StoryDiffusion: Consistent Self-Attention for Long-Range Image and Video Generation」**。著者はYupeng Zhou、Daquan Zhou、Ming-Ming Cheng、Jiashi Feng、Qibin Hou。GitHubスター数は6,420。NeurIPS 2024でSpotlight採択（上位約3%）。

この論文の核心は、あまりにシンプルだ。

**「Self-AttentionのKeyとValueを、画像間で共有すればいい」**

通常の拡散モデルでは、画像AのSelf-Attention層は画像Aの情報だけを見る。画像Bも同様だ。StoryDiffusionは、画像AのKey/Valueを画像BのSelf-Attentionに注入する。これにより画像Bは「画像Aに登場したキャラの顔の特徴」を直接参照できる。つまり、キャラ一貫性がゼロショットで達成される——ファインチューニング不要で。

このアイデアが革新的だったのは、その抽象化のレベルの高さだ。「キャラを学習する（LoRA）」でも「画風を転写する（IP-Adapter）」でもなく、「注意機構そのものを拡張する」というアプローチ。各コマで注意機構が「前のコマのキャラを覚えている」状態を作り出す。これは人間の漫画家が「前のページ、描いたキャラの顔を思い出しながら次のコマを描く」認知プロセスに驚くほど似ている。

同時にこのチームはSemantic Motion Predictor（SMP）も発表した。圧縮画像の意味空間上でモーションを予測し、静止画シーケンスから動画を生成する。画像生成から動画生成へのスムーズな拡張を意図している。

【実用Tips】ComfyUI StoryDiffusionワークフロー

**必要なノード：**ComfyUI_StoryDiffusion（smthemex版、506★）

1. ComfyUI Manager → Install Custom Nodes → 「StoryDiffusion」で検索

2. 5つのプロンプトを用意（1コマ〜4コマ + オプション）

3. Consistent Self-Attentionを有効化。バッチサイズ=コマ数に設定。

4. 同一のLoRAを全コマに適用。キャラLoRA + スタイルLoRAの組み合わせが効果的。

5. ControlNet（OpenPose）で各コマのポーズを指定。任意だが、複数キャラが登場する場合は必須。

6. 生成。RTX 4090で4コマ約90秒。12GB VRAM推奨。

**コツ：**プロンプトの語尾を統一しろ。「同じキャラ」という暗黙の指示をSelf-Attentionに与えることになる。

## 第四章：2025年——AnyText、吹き出しの革命（ICLR 2024 Spotlight）

StoryDiffusionでキャラ一貫性は解決した。しかし——漫画において最も重要な要素が欠けていた。文字だ。

ここで登場するのがAnyText。Alibaba Group DAMO Academyが開発した、多言語テキスト生成モデル。論文はICLR 2024でSpotlight採択（上位5%未満）、GitHubスター数は4,848。

AnyText以前、画像内テキスト生成は絶望的だった。ControlNetにテキストを書かせると文字は崩れ、ノイズの塊になる。CLIPエンコーダのテキスト理解力に頼る方式では、フォントという概念自体がモデルに存在しなかったからだ。

AnyTextのアプローチは決定的に異なる。

**OCRエンコーダでグリフ（文字の形状）を直接潜在空間に入力する。**

仕組み：

① ユーザーがテキスト（「おい、待て！」）を入力。

② 指定フォントでテキストをレンダリングし、グリフ画像を生成。

③ OCRエンコーダがグリフ画像を特徴ベクトルに変換。

④ 拡散プロセスにこのベクトルを注入し、テキスト部分を正確にレンダリング。

⑤ 同時にテキスト位置を示すマスクを入力し、どこに書くかを指定。

なぜこれが日本語漫画にとって革命的だったか——AnyText以前、日本語の縦書きテキストを画像内に生成する方法は事実上存在しなかった。CLIPのテキストエンコーダは日本語の字形を学習していない。AnyTextのOCRエンコーダはフォントを経由して直接字形を扱うため、日本語・中国語・韓国語のCJKテキストを高い精度でレンダリングできる。

手法日本語テキスト精度（AnyText論文より）
ControlNet（従来）約37%
AnyText（v1）約65%
AnyText v2（2024年11月）約72%（フォント・色指定対応）

AnyText v2ではフォントファミリーの指定、テキスト色の指定が可能になった。ComfyUI統合はzmwv823/ComfyUI_Anytext（101★）により実現している。

【実用Tips】AnyTextで吹き出しテキスト生成

**前提：**ComfyUI + ComfyUI_Anytextノード

1. キャラ画像（吹き出しなし、白枠を想定した領域あり）を用意

2. AnyTextノードにテキストと位置マスクを入力

3. フォントは「Noto Sans JP」が最も安定。サイズは36〜48px推奨。

4. 縦書きは未対応。横書きの吹き出しデザインを前提とせよ。

5. 吹き出し枠（白塗りつぶし）を先にInpaintで生成し、その上からAnyTextでテキストを乗せるのが最も安定したワークフロー。

## 第五章：ComfyUI——58,000スターの統合プラットフォーム

ここまでの技術——LoRA、ControlNet、IP-Adapter、StoryDiffusion、AnyText——を統合するプラットフォームが必要だった。それがComfyUI（GitHub 58,000★）である。

ComfyUIの本質は、ノードベースのワークフローエディタを通じて拡散モデルのパイプラインを視覚的に構築できる点にある。Stable Diffusionの内部構造（VAEエンコーダ/デコーダ、CLIPテキストエンコーダ、UNetノイズ予測器、スケジューラ）がすべてノードとして可視化され、それらをワイヤリングすることで任意のカスタムパイプラインが構築できる。

なぜ58,000ものスターを集めたか——それは、モジュール性にある。LoRAローダー、ControlNetアプリケーター、カスタムノード——すべてがプラグインとして追加できる。StoryDiffusionも、AnyTextも、カスタムノードとしてComfyUIに統合されている。ユーザーは一つのUI上でキャラ一貫性、構図制御、テキスト生成をシームレスに連携できる。

「ワンクリックで漫画が生成できる」段階にはまだ達していない。しかし——ComfyUI上に適切なワークフローを構築すれば、5分で4コマ＋吹き出しテキストまで生成できる。職人芸ではあるが、確実に実用域に入っている。

## 第六章：エンドツーエンド——Comic-Diffusionと未来

ここまで個別技術を論じてきたが、2025年から2026年にかけて、これらを統合する試みが加速している。

**Comic-Diffusion**（GitHub 3,500★）は、エンドツーエンドの漫画生成パイプラインを提供する。キャラ一貫性、コマ割りレイアウト、テキスト生成、ページ構成——これらを単一のワークフローに統合している。ただし学習ベースの統合であり、ゼロショットでの柔軟性はStoryDiffusionに劣る。

より現実的なアプローチは、ComfyUI上で個別技術をワークフローとして統合することだ。現在Civitaiでは、完成された漫画生成ワークフローが数十種類公開されている。

今後のロードマップに欠けているピース：

・吹き出し自動検出・配置（現在は手動でマスクを描く必要がある）

・縦書きテキスト対応（AnyText未対応。日本語漫画では致命的）

・スクリーントーン自動生成（漫画家の技量が最も顕著に出る領域）

・1クリックパブリッシュ（note.comやpixivへの直接投稿）

これらのギャップは、おそらく半年から1年以内に埋まるだろう。技術進化の速度と、それを駆動する「欲望」の強さを考えれば。

## 終章：2026年の戦場

2022年のStable Diffusionから2026年の今。この4年間で、AI漫画生成の技術は「不可能」から「職人芸」に変わった。

LoRA（20MBのファイル）でキャラは固定できる。ControlNet＋OpenPoseで構図を指定できる。StoryDiffusionのConsistent Self-Attentionでコマ間の一貫性を保証できる。AnyTextで吹き出しに日本語テキストを入れられる。ComfyUIがそれらを統合する。

あとは——「ユーザーがクリックするだけ」のUXが完成すれば、この領域は爆発する。そして、そのUXを最初に実装するのは、最も強い動機を持ったコミュニティだろう。

それが誰かは、もう言うまでもない。

📝 参考文献

・Hu et al. "LoRA: Low-Rank Adaptation of Large Language Models" ICLR 2022. arXiv:2106.09685

・Zhang et al. "Adding Conditional Control to Text-to-Image Diffusion Models" (ControlNet) ICCV 2023. arXiv:2302.05543 / GitHub: lllyasviel/ControlNet (30,000★)

・Ye et al. "IP-Adapter: Text Compatible Image Prompt Adapter for Text-to-Image Diffusion Models" 2023. GitHub: tencent-ailab/IP-Adapter (7,000★)

・Zhou et al. "StoryDiffusion: Consistent Self-Attention for Long-Range Image and Video Generation" NeurIPS 2024 (Spotlight). arXiv:2405.01434 / GitHub: HVision-NKU/StoryDiffusion (6,420★)

・Tuo et al. "AnyText: Multilingual Visual Text Generation and Editing" ICLR 2024 (Spotlight). arXiv:2311.03054 / GitHub: tyxsspa/AnyText (4,848★)

・Tuo et al. "AnyText v2" arXiv:2411.15245 / GitHub: tyxsspa/AnyText2

・Comfy-Diffusion/ComfyUI (58,000★) — ノードベース拡散モデルGUI

・kohya-ss/sd-scripts — LoRAトレーナー

・smthemex/ComfyUI_StoryDiffusion (506★)

・zmwv823/ComfyUI_Anytext (101★)

・Comic-Diffusion GitHub (3,500★)

---
*この記事は note.com から KTBLOG に移行されました。元記事: https://note.com/famous_prawn2009/n/n59e010e8f705*