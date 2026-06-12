/**
 * tags.ts — 記事本文からタグを抽出し、カテゴリを内容ベースで判定するユーティリティ
 */

export interface TagRule {
  tag: string;
  patterns: RegExp[];
  weight?: number;
}

// タグ抽出ルール（本文・タイトルに出現したら付与）
export const TAG_RULES: TagRule[] = [
  // AI・テクノロジー
  { tag: 'LLM', patterns: [/\bLLM\b/i, /大規模言語モデル/] },
  { tag: 'AIエージェント', patterns: [/AIエージェント/, /自律エージェント/, /マルチエージェント/, /Oh My Pi/, /OMP/, /Hermes Agent/, /OpenClaw/, /Pi Agent/, /coding agent/i] },
  { tag: '生成AI', patterns: [/生成AI/, /生成系AI/, /Generative AI/i, /画像生成/, /Stable Diffusion/, /Midjourney/, /DALL·E/, /DALL-E/, /Civitai/, /LoRA/] },
  { tag: 'Claude', patterns: [/\bClaude\b/, /Claude Code/, /Claude 3/, /Claude 4/] },
  { tag: 'OpenAI', patterns: [/\bOpenAI\b/, /\bGPT-?\d/i, /ChatGPT/] },
  { tag: 'ローカルLLM', patterns: [/ローカルLLM/, /ローカル.*LLM/, /ollama/i, /Ollama/, /llama\.cpp/, /vllm/i, /lm-studio/i] },
  { tag: 'プログラミング', patterns: [/プログラミング/, /コーディング/, /GitHub/, /git/i, /VS Code/, /Cursor/, /Python/, /TypeScript/, /JavaScript/, /Astro/, /Next\.js/, /React/] },
  { tag: 'ロボット', patterns: [/ロボット/, /Unitree/, /四足歩行/, /ドローン/, /ラジコン/, /RC/, /Arduino/, /ESP32/, /Raspberry Pi/, /電子工作/, /3Dプリンタ/] },
  { tag: 'Apple', patterns: [/Apple/, /Mac/, /iPhone/, /iPad/, /Apple Silicon/, /M1 Max/, /M2 Max/, /M3 Max/, /M4/, /macOS/] },
  { tag: 'セキュリティ', patterns: [/セキュリティ/, /暗号化/, /プライバシー/, /匿名/, /サイバー/, /ハッキング/, /脆弱性/] },

  // サイファーパンク・経済
  { tag: 'Bitcoin', patterns: [/ビットコイン/, /Bitcoin/, /BTC/, /サトシ/] },
  { tag: 'Monero', patterns: [/Monero/, /モネロ/, /XMR/] },
  { tag: '暗号通貨', patterns: [/暗号通貨/, /クリプト/, /仮想通貨/, /ブロックチェーン/, /DeFi/, /Solana/, /Ethereum/, /KuCoin/] },
  { tag: '自由市場', patterns: [/自由市場/, /メルカリ/, /中古市場/, /P2P/, /オフグリッド/] },

  // 創作・文化
  { tag: '小説', patterns: [/小説/, /ファンタジー/, /\bSF\b/, /パラレルワールド/, /並行世界/] },
  { tag: '音楽', patterns: [/音楽/, /Spotify/, /ボカロ/, /初音ミク/, /楽器/, /作曲/] },
  { tag: 'アニメ', patterns: [/アニメ/, /ジブリ/, /宮崎駿/, /アイシールド21/] },
  { tag: '映像', patterns: [/映像/, /動画/, /YouTube/, /映画/, /Peertube/, /配信/] },
  { tag: 'デザイン', patterns: [/デザイン/, /タイポグラフィ/, /\bUI\b/, /\bUX\b/, /カラー/] },
  { tag: 'ゲーム', patterns: [/ゲーム/, /ゲーム開発/, /Minecraft/, /RPG/] },

  // 哲学・思想
  { tag: '哲学', patterns: [/哲学/, /思想/, /尼采/, /ソクラテス/, /仏教/, /禅/, /公案/, /菩薩/] },
  { tag: 'サイファーパンク', patterns: [/サイファーパンク/, /暗号技術/, /自己主権/, /検閲フリー/] },
  { tag: 'AGI', patterns: [/\bAGI\b/, /人工知能/, /汎用人工知能/, /特異点/] },

  // ライフスタイル
  { tag: '薬草', patterns: [/薬草/, /大麻/, /シロシビン/, /マジックマッシュルーム/, /ケシ/, /自家栽培/, /PFtek/] },
  { tag: '料理', patterns: [/料理/, /レシピ/] },
  { tag: '健康', patterns: [/健康/, /医療/, /DNA/, /遺伝子/] },
  { tag: 'DIY', patterns: [/DIY/, /自作/, /家庭菜園/, /園芸/, /農業/, /スマート農業/] },
  { tag: '防災', patterns: [/防災/, /サバイバル/, /地震/, /地下シェルター/, /防衛/] },
  { tag: '奈良', patterns: [/奈良/, /多聞山/, /信貴山/, /大和/, /寺子屋/] },
  { tag: 'ペット', patterns: [/猫/, /犬/, /ペット/, /動物/] },

  // お金・経済
  { tag: '投資', patterns: [/投資/, /資産/, /金融/, /株/, /FIRE/, /副業/, /収入/] },
  { tag: '節約', patterns: [/節約/, /コスパ/, /格安/] },

  // 執筆・メディア
  { tag: '執筆', patterns: [/執筆/, /ライティング/, /文章/, /メディア/] },
];

// カテゴリ判定ルール（本文ベースのスコアリング）
export interface CategoryRule {
  name: string;
  patterns: RegExp[];
  weight?: number;
}

export const CONTENT_CATEGORY_RULES: CategoryRule[] = [
  {
    name: 'AI・テクノロジー',
    patterns: [
      /\bAI\b/, /\bLLM\b/i, /生成AI/, /エージェント/, /Oh My Pi/, /OMP/, /Hermes/, /OpenClaw/,
      /Claude/, /OpenAI/, /GPT/, /ChatGPT/, /Ollama/, /HuggingFace/, /GitHub/, /プログラミング/,
      /自動化/, /セキュリティ/, /Mac/, /RaspberryPi/, /Arduino/, /ESP32/, /3Dプリンタ/,
      /電子工作/, /データ/, /コード/, /検閲/, /サイファーパンク.*技術/, /UI-TARS/, /RTX/,
      /Cloudflare/, /Vercel/, /Netlify/, /Astro/, /Tailwind/, /TypeScript/, /Python/, /API/,
    ],
  },
  {
    name: '創作・文化',
    patterns: [
      /創作/, /エッセイ/, /音楽/, /ボカロ/, /初音ミク/, /ジブリ/, /アニメ/, /宮崎駿/,
      /小説/, /文学/, /パロディ/, /イラスト/, /写真/, /映像/, /動画/, /YouTube/,
      /クリエイター/, /クリエイティブ/, /芸術/, /美術/, /デザイン/, /映画/, /ゲーム/,
      /Podcast/, /ラジオ/, /VTuber/, /Peertube/, /表現の自由/, /デジタル菩薩/,
    ],
  },
  {
    name: '哲学・思想',
    patterns: [
      /哲学/, /仏教/, /禅/, /自己啓発/, /心理学/, /信仰/, /精神/, /東洋/, /魂/,
      /人生/, /信念/, /万葉集/, /公案/, /日本人/, /ヤマト/, /エゴ/, /菩薩/,
      /技術倫理/, /倫理/, /未来/, /自己/, /人間/, /社会/, /知能/, /パラレルワールド/,
      /艦隊/, /考察/, /思想/, /問い/, /意味/,
    ],
  },
  {
    name: 'お金・経済',
    patterns: [
      /お金/, /ビットコイン/, /bitcoin/, /ブロックチェーン/, /暗号通貨/, /クリプト/,
      /サトシ/, /Monero/, /メルカリ/, /中古市場/, /価格/, /リサーチ/, /金融/, /投資/,
      /資産/, /経済/, /市場/, /決済/, /マネー/, /フリーランス/, /副業/, /収入/,
      /無料/, /コスト/, /節約/, /格安/, /FIRE/,
    ],
  },
  {
    name: 'ライフスタイル',
    patterns: [
      /防災/, /地震/, /奈良/, /薬草/, /シロシビン/, /マジックマッシュルーム/, /サバイバル/,
      /食/, /料理/, /レシピ/, /健康/, /医療/, /運動/, /旅行/, /散歩/, /観光/, /風景/,
      /自然/, /植物/, /動物/, /ペット/, /猫/, /犬/, /日常/, /生活/, /家庭/, /掃除/,
      /整理/, /収納/, /インテリア/, /DIY/, /園芸/, /農業/, /自炊/, /節約/, /大麻/, /ケシ/,
    ],
  },
];

/**
 * テキストからタグを抽出（重複排除、最大10件）
 */
export function extractTags(text: string, existingTags: string[] = [], maxTags = 10): string[] {
  const matched = new Set(existingTags.map((t) => t.toLowerCase()));
  const scored: { tag: string; count: number; weight: number }[] = [];

  for (const rule of TAG_RULES) {
    let count = 0;
    const weight = rule.weight ?? 1;
    for (const pattern of rule.patterns) {
      const matches = text.match(new RegExp(pattern, 'gi'));
      if (matches) count += matches.length;
    }
    if (count > 0 && !matched.has(rule.tag.toLowerCase())) {
      scored.push({ tag: rule.tag, count, weight });
    }
  }

  scored.sort((a, b) => b.count * b.weight - a.count * a.weight);
  const top = scored.slice(0, maxTags).map((s) => s.tag);
  return [...existingTags, ...top];
}

/**
 * テキストをカテゴリごとにスコアリング
 */
export function scoreCategories(text: string): { name: string; score: number }[] {
  const scores = CONTENT_CATEGORY_RULES.map((rule) => {
    let score = 0;
    for (const pattern of rule.patterns) {
      const matches = text.match(new RegExp(pattern, 'gi'));
      if (matches) score += matches.length;
    }
    return { name: rule.name, score };
  });
  return scores.sort((a, b) => b.score - a.score);
}

/**
 * 既存カテゴリ + 本文スコアから最適な表示カテゴリを決定
 */
export function decideCategory(frontmatterCategory: string | undefined, bodyText: string): string {
  // 明示的なカテゴリがあればそれを優先しつつ、マッピングのみ適用
  const CATEGORY_MAP: Record<string, string> = {
    'note.com': 'ノート・記録',
    'お金': 'お金・経済',
  };
  const base = frontmatterCategory ? CATEGORY_MAP[frontmatterCategory] ?? frontmatterCategory : '';

  // 本文スコアが高い場合のみ上書き提案（最低でも2点以上差が必要）
  const scores = scoreCategories(bodyText);
  const top = scores[0];
  if (top && top.score >= 3) {
    // 既存カテゴリが空 or 「その他」の場合は本文ベースを採用
    if (!base || base === 'その他') return top.name;
    // 既存カテゴリも上位に入っていれば維持
    if (scores.find((s) => s.name === base && s.score >= top.score * 0.5)) return base;
    return top.name;
  }
  return base || 'その他';
}
