---
title: "AIに「顔」を与える——3DプリンタとLLMで知能を持った顔を作る"
date: 2026-06-04
slug: aiに-顔-を与える-3dプリンタとllmで知能を持った顔を作る
category: "AI/ロボット/LLM/3Dプリンタ/アニマトロニクス/EyeMech"
eyecatch: "/assets/eyecatch/n28f2d90f2b8f.png"
---

# AIに「顔」を与える——3DプリンタとLLMで知能を持った顔を作る

> 出典: note.com / 2026-05-06

## この眼球は、あなたの顔を追いかける——AIに「顔」を与える試み

これを見てほしい。

【動画】Will Cogley 「Making my face-tracking eyemech untethered」

[https://www.youtube.com/watch?v=-TQieebvRzE](https://www.youtube.com/watch?v=-TQieebvRzE)

3Dプリンタで出力した眼球機構「EyeMech ε3.4」。内蔵カメラが人の顔を検出し、ケーブルなしで眼球が追従する。価格は$128.97のキット。50万回再生。

作者のWill Cogleyは、アニマトロニクスのDIYシーンで知られるエンジニアだ。彼の作る「目」は不気味なほど本物に近い。そして今——これに**AIの知能**を載せる時が来ている。

## 「顔」とは何か

人間の顔は、単なる筋肉と骨と皮膚の集合ではない。それは**「そこに心がある」と感じさせる装置**だ。

目が動き、眉が上がり、口元が緩む。これらの微細な動きの組み合わせが「表情」になる。そして表情は「感情」を伝える。

今のAIはテキストを生成できる。音声で話せる。画像も作れる。

しかし——**AIに「顔」はない。**

ChatGPTもClaudeもGeminiも、すべて画面の中の文字列だ。そこに「対面している」感覚はない。

## 3DプリンタとLLMの融合

Will CogleyのEyeMechに、ローカルLLMを接続したらどうなるか。

顔認識カメラが「誰が前にいるか」を判別
LLMがその人に合わせた会話を生成
音声合成が自然な声で話す
眼球機構が相手の目を見つめ、表情に合わせて動く

これが実現すれば、AIは初めて**物理的な「顔」**を持つことになる。

技術的には、全部揃っている：

要素技術コスト
🖨 顔の機構EyeMech ε3.4（3Dプリント）$129
👁 顔認識OpenCV + MediaPipe無料
🧠 AI頭脳Ollama + wasserstein-deep無料
🗣 音声合成VOICEVOX / Style-Bert-VITS2無料
🎮 制御基板Raspberry Pi 5 / ESP32$60〜
👂 音声認識Whisper（ローカル）無料

**合計 $200以下で、知能を持った顔が作れる。**

## 不気味の谷を越える

問題は「不気味の谷」——人間に近すぎると逆に不快になる現象だ。

しかし2026年、AIによる表情生成は驚くほど進化している。StyleGANで生成した顔は本物と見分けがつかない。VASA-1は1枚の写真から自然な表情アニメーションを生成する。

ならば——物理的な顔機構に、AIが生成した表情をリアルタイムで投影すればどうか。

これはSFではない。今、実際に作れる。

## なぜ「顔」が必要なのか

AIアシスタントが声だけで応答する時代は終わりつつある。

人間は相手の顔を見て、信頼するかどうかを0.1秒で判断する。表情から嘘を見抜く。目線で意図を読む。これらはすべて、テキストや音声だけでは不可能なコミュニケーションだ。

AIに「顔」を与えることは、AIを**「道具」から「存在」に変える**行為である。

それは不気味かもしれない。でも——最初の電話も、最初のテレビも、最初のインターネットも、みんな不気味だった。

## 次の一手

EyeMechキットを注文した。Raspberry PiにOllamaを載せて、whisperで音声認識、VOICEVOXで音声合成。顔認識はMediaPipe。

目標は「KTを見ると『おかえりなさい』と言い、目が追いかけるマシン」。

不気味の谷の向こう側で、会おう。

*参考:*

*EyeMech ε3.4: https://nmrobots.com/products/eyemech-ε3-4*
*Will Cogley: https://youtube.com/@WillCogley*
*Ollama: https://ollama.com*
*VOICEVOX: https://voicevox.hiroshiba.jp*

---
*この記事は note.com から KTBLOG に移行されました。元記事: https://note.com/famous_prawn2009/n/n28f2d90f2b8f*