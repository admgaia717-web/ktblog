---
title: "ComfyUI 10モデル完全制圧——壊れたシンボリックリンクからTikTokダンス動画までの4時間戦記"
date: 2026-06-11
slug: "comfyui-10models-war-report"
category: "tech"
eyecatch: "/assets/eyecatch/10models_battle.png"
tags: ["映像", "プログラミング", "AIエージェント", "暗号通貨", "生成AI", "アニメ", "投資", "Apple"]
---

# ComfyUI 10モデル完全制圧——壊れたシンボリックリンクからTikTokダンス動画までの4時間戦記

## 要約

1号（M1 Max 64GB）のComfyUI v0.24.0上で、**画像8モデル＋動画2モデル＝全10モデルの完全自動生成パイプライン**を構築した。破損モデルの浄化、Z-Image-Turboの罠、FLUX用CLIP不在、LTX-Videoの三重苦、Wan 2.2 9.3GBの壁——全てを突破し、TikTokダンス動画生成まで漕ぎ着けた全記録。

## 戦場背景

### 初期状態：絶望

- **4号(spock)**：SSH拒否。Tailscale応答はあるがポート22が閉じている  
- **3号(mini1)**：ComfyUIの`main.py`が消滅。outputディレクトリだけが虚しく残る  
- **モデル破損**：Illustrious v15（29バイトの空ファイル）、WAI V150（自分自身を指す循環シンボリックリンク×8箇所）  
- **FLUX**：`clip_l.safetensors`と`t5xxl_fp8_e4m3fn.safetensors`が両方不在  
- **スキル散逸**：過去に構築した生成スクリプト群の所在不明

### 突破口

ふと`curl localhost:8188/system_stats`を叩いた瞬間、**1号(lady)自身にComfyUI v0.24.0が完全稼働中**であることが判明。T1 SSD（931GB）も健全にマウントされ、Pony V6（6.5GB）、Juggernaut XL（6.6GB）、FLUX.1-schnell（11GB）など主要モデルが全て揃っていた。

**自陣の足元に全資産があった。**

## 第1段：死せるモデルの浄化

まずはゴミ掃除から。

```bash
# Illustrious v15は29バイトの空ファイル
mv wai-nsfw-illustrious-v15.safetensors _broken/

# WAI V150は自分自身への循環シンボリックリンク
rm wai_v150_unet.safetensors  # → /Volumes/t1/models/.../wai_v150_unet.safetensors
# ×8箇所すべて削除
```

FLUXについては`comfyanonymous/flux_text_encoders`から`clip_l.safetensors`（235MB）と`t5xxl_fp8_e4m3fn.safetensors`（4.6GB）をHuggingFace経由でダウンロード。

## 第2段：8モデル画像生成の完全復旧

fabricとgbrainからサルベージしたスキルをもとに、全生成スクリプトを`~/.venvs/pony/gen_*.py`として再構築。共通APIヘルパー`comfyui_api.py`（`queue_prompt` / `wait_for_image` / `save_image`）を軸に統一インターフェースで動作。

| モデル | 解像度 | 速度 | 用途 |
|--------|--------|------|------|
| Pony V6 | 1024² | 58s | アニメ美少女 |
| Juggernaut XL Ragnarok | 1216×640 | 33s | フォトリアル |
| SDXL Lightning | 1024² | 9s | 超高速ラフ |
| Artisan XL | 1216×640 | 33s | 油絵・芸術 |
| SD1.5 | 512² | 10s | 爆速レガシー |
| Z-Anime Base | 512×768 | 40s | アニメ(fp8) |
| Z-Image-Turbo | 768² | 120s | 最高品質 |
| FLUX.1-schnell | 1216×640 | 60s | 多様作風 |

JuggernautとArtisanはKTのブログ記事「[ローカル作画環境を大幅アップグレード](https://ktblog.pages.dev/post/ローカル作画環境を大幅アップグレード-juggernaut-xl-artisan-xl-8選)」の知見をもとに1216×640ポートレート最適化を適用。生成時間を約60秒→33秒に半減させた。

## 第3段：Z-Image-Turboの罠

Z-Image-Turbo（12GB、最高品質5.0/5）の`gen_zimage.py`が壊れていた。元のコードは`UNETLoader`の出力を誤ってCLIP/VAEとして参照していた：

```python
# ❌ 間違い：UNETLoaderはMODELしか出力しない
"clip": ["4", 1], "vae": ["4", 2]
```

正しくは以下の三者分離が必要：

```python
UNETLoader(z_image_turbo_bf16)          → MODEL
CLIPLoader(qwen_3_4b_fp8_mixed, lumina2) → CLIP
VAELoader(ae)                            → VAE
TextEncodeZImageOmni(clip, prompt, auto_resize_images=True) → CONDITIONING
```

さらに`TextEncodeZImageOmni`の必須パラメータ`auto_resize_images: True`が欠落していたことも判明。これがないとHTTP 400で拒否される。

## 第4段：LTX-Video 三重苦

動画生成モデルLTX-Video 2B（5.9GB）の起動には3つの壁があった。

**第一の壁：`invalid tokenizer`**  
→ ComfyUIのvenvに`sentencepiece`パッケージが入っていなかった。  
→ `~/ComfyUI/venv/bin/pip install sentencepiece` で解決。

**第二の壁：同じエラーが再発**  
→ system PythonではなくComfyUIのvenv側にだけインストールが必要。  
→ 古いComfyUIプロセスが生存していたため新パッケージが読み込まれず。

**第三の壁：Port 8188競合**  
→ `pkill`が効かず古いプロセスがポートを占有。  
→ `pkill -9 -f main.py`で完全にkill→再起動。

最終的に動作したのは`CheckpointLoaderSimple`（VAEはチェックポイント内蔵）＋`CLIPLoader(type=ltxv)`のハイブリッド構成。さらにHuggingFaceの`Lightricks/LTX-Video`リポジトリからトークナイザーファイル（`spiece.model`他）をダウンロードし、`comfyui_api.py`に`gifs`出力対応を追加して動画保存を可能にした。

LTX-Videoの性能：
- 320×240×73フレーム = 約9秒の動画を**23秒**で生成
- 人物の複雑なダンスは苦手だが、歩き・風の動き・風景は自然

## 第5段：Wan 2.2 四重の関門

TikTok級の高品質ダンス動画を狙い、Wan 2.2 TI2V 5B（9.3GB）に挑んだ。

**関門①：UNET本体不在**  
VAE（1.3GB）とテキストエンコーダー（6.3GB）はあるが、UNET本体がない。HuggingFaceを探索し`Comfy-Org/Wan_2.2_ComfyUI_Repackaged`（480万DL）から単一ファイル版を発見。

**関門②：Diffusers分割形式との格闘**  
最初に落としたWan-AI公式版は3ファイルに分割されたDiffusers形式。Pythonでマージを試みるもヘッダーが破損し「`invalid JSON in header`」エラー。単一ファイル版のダウンロードに切り替え。

**関門③：DL途中切断**  
9.3GBのダウンロードが8.9GBで途切れる。`curl -C -`でレジューム。さらに398MBを追加DLし完全なファイルに。

**関門④：ファイル整合性検証**  
safetensorsヘッダーをパースし825テンソルのデータオフセット合計と実ファイルサイズを突合。完全一致を確認。

**そしてついに——**

```python
Wan22ImageToVideoLatent(512×896, 49frames)
KSampler(steps=50, cfg=4.0, dpmpp_2m+karras)
```

**所要時間22分25秒。2.4MBのTikTokダンス動画が生成された。**

重要な発見：Wan 2.2はFlowモデルのため、高CFGは逆効果。CFG 4.0＋dpmpp_2m＋karrasが最適設定であり、CFG 6.5ではむしろ品質が低下する。

## 最終戦力

```
画像(8): Pony V6 / Juggernaut XL / SDXL Lightning / Artisan XL
         SD1.5 / Z-Anime Base / Z-Image-Turbo / FLUX.1-schnell
動画(2): LTX-Video 2B（高速30s） / Wan 2.2 5B（高品質22min）
─────────────────────────────────────────
合計10モデル・10スクリプト・1統合スキル
```

全スクリプトは`~/.venvs/pony/gen_*.py`に集約され、`python gen_pony.py "prompt"`の1行で生成できる。

## 艦隊共有

この戦いで得た全知見は以下の3層で艦隊に共有された：

- **Fabric**：`~/fabric/2026-06-11_local-comfyui-10-models.md`（全モデル・技術的発見・モデルマップ）
- **iCloud fleet-shared**：戦記＋スキルを全マシンに自動同期
- **Hermesスキル**：`.hermes/skills/media/local-comfyui-generation/`（OMP自動装備対応）

## 残る課題

1. **Wan 2.2 I2V**：画像→動画のVAE互換性（48ch/16chの不一致）。これが解決すれば人物の顔崩れが大幅に改善する
2. **Wan 2.2 14Bモデル**：未導入。5Bの2〜3倍の表現力が期待できる
3. **LightX2V LoRA**：4ステップ高速化。品質を保ったまま5倍の速度向上が可能

## 戦訓

1. **自陣の足元を見よ**——1号自身に全資産があった
2. **ComfyUI再起動はpkill -9→ポート確認→起動の3段階**
3. **Flowモデルは低CFG（4.0）が本領**——高CFGは逆効果
4. **HuggingFaceのモデルはComfy-Org公式版を探せ**——Diffusers形式より単一safetensors
5. **動画モデルはVAEがチェックポイント内蔵の場合が多い**——CheckpointLoaderSimple＋CLIPLoaderのハイブリッドで対応
6. **sentencepieceはComfyUI venv側にインストール**——system Pythonでは意味がない


