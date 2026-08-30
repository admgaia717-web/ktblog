---
title: "replicate-field-manual"
date: 2026-08-30
category: "テクノロジー"
excerpt: "GPUを持たず最新AIモデルを試す。Replicateの使い方総まとめ。"
---
# Replicate 徹底マニュアル —— 玄関先で AI 厨房を借りる方法

スタバのカウンターで思う。あの鉄のエスプレッソマシン、うちにも欲しい。でも家庭用じゃなく本物を。現実に戻ると、お前の Mac にそんな GPU はないし、積んでも電気代と风扇で家がゴリラになる。

AI モデルも同じ。FLUX で描きたい、DeepSeek で読ませたい、動画モデルで 10 秒欲しい。でも自分で動かすにはマシンを買うかクラウド GPU を借りて環境を組むか、「厨房を自分で持つ」覚悟がいる。

Replicate はその覚悟を捨てる店だ。「モデルは俺たちが厨房に置いとくから、お前は URL を叩いて注文だけしてけ」。

## 何者か

オープンな AI モデルの「デパート兼厨房」。三万種類以上のモデルが並び、それぞれに動かす API が最初から用意されている。Hugging Face が倉庫なら、Replicate は隣でコンロが燃えてる厨房。

## トークン

replicate.com でアカウント作成（GitHub 可）。設定から API tokens で Create token。`r8_` から始まる文字列が厨房の入場券。`export REPLICATE_API_TOKEN=r8_xxx` を `~/.zshrc` に書く。見せてはいけない。

## 3行で呼ぶ

```python
import replicate
output = replicate.run("black-forest-labs/flux-schnell",
  input={"prompt": "an iguana on the beach, pointillism"})
with open("output.png","wb") as f: f.write(output[0].read())
```

これで海辺のイグアナが落ちてくる。URL を input に渡せば多モーダルも同じ書き方。

## 裏側

`replicate.run()` は裏で「予測（prediction）」ジョブを作り、完了までブロックする。本番は非同期 `predictions.create()` ＋ webhook が鉄則。コールドスタート（GPU 温め）も課金される罠あり。

## 自前モデル公開

Cog という魔法の箱で環境を設定ファイル 1 つに書けば、`cog build` → `cog push` で Docker 化して Replicate に公開できる。

## 値段

GPU の秒数で課金。T4 は 1 秒 0.000225 ドル（約 0.81 ドル/時）、A100 80GB は 0.0014 ドル（約 5.04 ドル/時）、H100 は 0.001525 ドル（約 5.49 ドル/時）。FLUX Schnell は画像 1000 枚で 3 ドル。コールドスタートで 1 回の値段が約 3 倍に跳ねるから注意。

## まとめ

GPU を持たず最新モデルを試したい人、自作モデルを URL で渡したい人におすすめ。本番トラフィックを安く捌くなら専用 GPU の方が結局安い場合も。便利さに値段が乗ってる店だ。

詳細は note 本編へ：https://note.com/keity717/n/n348a10af15ce
