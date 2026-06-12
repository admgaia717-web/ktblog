#!/usr/bin/env node
/**
 * analyze-content.mjs — 記事の内容を読み取ってタグ付与 & 検索インデックス生成
 *
 * 使い方:
 *   node scripts/analyze-content.mjs           # インデックス生成 + タグ付与（--apply がないと dry-run）
 *   node scripts/analyze-content.mjs --apply   # 実際に front-matter に tags を書き戻す
 *   node scripts/analyze-content.mjs --index-only  # インデックスのみ生成
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(ROOT, 'src/content/posts');
const PUBLIC_DIR = path.join(ROOT, 'public');

// src/lib/tags.ts を再利用するため、ビルド済みは不要。ルールを直接読む。
// 注意: このスクリプトと src/lib/tags.ts は同じルールを使うこと。
const TAG_RULES = [
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
  { tag: 'Bitcoin', patterns: [/ビットコイン/, /Bitcoin/, /BTC/, /サトシ/] },
  { tag: 'Monero', patterns: [/Monero/, /モネロ/, /XMR/] },
  { tag: '暗号通貨', patterns: [/暗号通貨/, /クリプト/, /仮想通貨/, /ブロックチェーン/, /DeFi/, /Solana/, /Ethereum/, /KuCoin/] },
  { tag: '自由市場', patterns: [/自由市場/, /メルカリ/, /中古市場/, /\bP2P\b/, /オフグリッド/] },
  { tag: '小説', patterns: [/小説/, /ファンタジー/, /\bSF\b/, /パラレルワールド/, /並行世界/] },
  { tag: '音楽', patterns: [/音楽/, /Spotify/, /ボカロ/, /初音ミク/, /楽器/, /作曲/] },
  { tag: 'アニメ', patterns: [/アニメ/, /ジブリ/, /宮崎駿/, /アイシールド21/] },
  { tag: '映像', patterns: [/映像/, /動画/, /YouTube/, /映画/, /Peertube/, /配信/] },
  { tag: 'デザイン', patterns: [/デザイン/, /タイポグラフィ/, /\bUI\b/, /\bUX\b/, /カラー/] },
  { tag: 'ゲーム', patterns: [/ゲーム/, /ゲーム開発/, /Minecraft/, /RPG/] },
  { tag: '哲学', patterns: [/哲学/, /思想/, /尼采/, /ソクラテス/, /仏教/, /禅/, /公案/, /菩薩/] },
  { tag: 'サイファーパンク', patterns: [/サイファーパンク/, /暗号技術/, /自己主権/, /検閲フリー/] },
  { tag: 'AGI', patterns: [/\bAGI\b/, /人工知能/, /汎用人工知能/, /特異点/] },
  { tag: '薬草', patterns: [/薬草/, /大麻/, /シロシビン/, /マジックマッシュルーム/, /ケシ/, /自家栽培/, /PFtek/] },
  { tag: '料理', patterns: [/料理/, /レシピ/] },
  { tag: '健康', patterns: [/健康/, /医療/, /DNA/, /遺伝子/] },
  { tag: 'DIY', patterns: [/DIY/, /自作/, /家庭菜園/, /園芸/, /農業/, /スマート農業/] },
  { tag: '防災', patterns: [/防災/, /サバイバル/, /地震/, /地下シェルター/, /防衛/] },
  { tag: '奈良', patterns: [/奈良/, /多聞山/, /信貴山/, /大和/, /寺子屋/] },
  { tag: 'ペット', patterns: [/猫/, /犬/, /ペット/, /動物/] },
  { tag: '投資', patterns: [/投資/, /資産/, /金融/, /株/, /FIRE/, /副業/, /収入/] },
  { tag: '節約', patterns: [/節約/, /コスパ/, /格安/] },
  { tag: '執筆', patterns: [/執筆/, /ライティング/, /文章/, /メディア/] },
];

const CATEGORY_RULES = [
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

function parseArgs() {
  const args = process.argv.slice(2);
  return {
    apply: args.includes('--apply'),
    indexOnly: args.includes('--index-only'),
    verbose: args.includes('--verbose'),
  };
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: content };
  const raw = match[1];
  const body = match[2];
  const data = {};
  for (const line of raw.split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    // ダブルクォート除去
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    }
    // 配列
    if (value.startsWith('[') && value.endsWith(']')) {
      try {
        data[key] = JSON.parse(value.replace(/'/g, '"'));
        continue;
      } catch {
        data[key] = value.slice(1, -1).split(',').map((s) => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
        continue;
      }
    }
    data[key] = value;
  }
  return { data, body };
}

function escapeYaml(s) {
  if (!s) return '';
  return String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function stringifyFrontmatter(data) {
  const lines = ['---'];
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue;
    if (key === 'date') {
      // date は YAML date としてクォートなし
      lines.push(`${key}: ${value}`);
    } else if (Array.isArray(value)) {
      if (value.length === 0) continue;
      lines.push(`${key}: [${value.map((v) => `"${escapeYaml(v)}"`).join(', ')}]`);
    } else {
      lines.push(`${key}: "${escapeYaml(value)}"`);
    }
  }
  lines.push('---\n');
  return lines.join('\n');
}

function normalizeText(text) {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#*`>|\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractTags(text, existingTags = [], maxTags = 10) {
  const matched = new Set(existingTags.map((t) => String(t).toLowerCase()));
  const scored = [];
  for (const rule of TAG_RULES) {
    let count = 0;
    for (const pattern of rule.patterns) {
      const matches = text.match(new RegExp(pattern, 'gi'));
      if (matches) count += matches.length;
    }
    if (count > 0 && !matched.has(rule.tag.toLowerCase())) {
      scored.push({ tag: rule.tag, count });
    }
  }
  scored.sort((a, b) => b.count - a.count);
  const top = scored.slice(0, maxTags).map((s) => s.tag);
  return [...existingTags, ...top];
}

function decideCategory(frontmatterCategory, bodyText) {
  const CATEGORY_MAP = { 'note.com': 'ノート・記録', 'お金': 'お金・経済' };
  const base = frontmatterCategory ? CATEGORY_MAP[frontmatterCategory] ?? frontmatterCategory : '';
  const scores = CATEGORY_RULES.map((rule) => {
    let score = 0;
    for (const pattern of rule.patterns) {
      const matches = bodyText.match(new RegExp(pattern, 'gi'));
      if (matches) score += matches.length;
    }
    return { name: rule.name, score };
  }).sort((a, b) => b.score - a.score);
  const top = scores[0];
  if (top && top.score >= 3) {
    if (!base || base === 'その他') return top.name;
    if (scores.find((s) => s.name === base && s.score >= top.score * 0.5)) return base;
    return top.name;
  }
  return base || 'その他';
}

async function main() {
  const args = parseArgs();
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'));
  console.log(`記事数: ${files.length}`);

  const searchIndex = [];
  const tagCounts = {};
  const categoryCounts = {};
  let updatedCount = 0;

  for (const file of files) {
    const filepath = path.join(POSTS_DIR, file);
    const raw = fs.readFileSync(filepath, 'utf-8');
    const { data, body } = parseFrontmatter(raw);
    const normalizedBody = normalizeText(body);
    // category は既にカテゴリ分類で使うので、タグ抽出には含めない（note.com などの移行元が支配的になりすぎるのを防ぐ）
    const textForAnalysis = `${data.title || ''} ${data.excerpt || ''} ${normalizedBody}`;

    const slug = file.replace(/\.md$/, '');
    const existingTags = Array.isArray(data.tags) ? data.tags : [];
    const extractedTags = extractTags(textForAnalysis, existingTags, 10);
    const category = decideCategory(data.category, textForAnalysis);

    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    for (const tag of extractedTags) {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    }

    // タグを front-matter に書き戻す（date 形式の違いなども同時に正規化）
    const newData = { ...data, tags: extractedTags };
    const newFrontmatter = stringifyFrontmatter(newData);
    const oldFrontmatterMatch = raw.match(/^---\n([\s\S]*?)\n---\n?/);
    const oldFrontmatter = oldFrontmatterMatch ? oldFrontmatterMatch[0] : '';

    if (!args.indexOnly && newFrontmatter !== oldFrontmatter) {
      if (args.apply) {
        const newContent = newFrontmatter + body + '\n';
        fs.writeFileSync(filepath, newContent, 'utf-8');
        updatedCount++;
      } else if (args.verbose) {
        console.log(`[DRY-RUN] ${file}: tags=${JSON.stringify(extractedTags)}`);
      }
    }

    searchIndex.push({
      slug,
      title: data.title || slug,
      category,
      tags: extractedTags,
      excerpt: data.excerpt || normalizedBody.slice(0, 200).replace(/\s+/g, ' ') + '…',
      date: data.date || '',
      body: normalizedBody.slice(0, 30000), // 超長文はカット
    });
  }

  if (!args.apply && !args.indexOnly) {
    console.log(`\n[DRY-RUN] --apply を付けると ${files.length} 件のタグを更新します`);
  } else if (args.apply) {
    console.log(`\nタグ更新: ${updatedCount} 件`);
  }

  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  fs.writeFileSync(path.join(PUBLIC_DIR, 'search-index.json'), JSON.stringify(searchIndex, null, 0), 'utf-8');
  fs.writeFileSync(path.join(PUBLIC_DIR, 'tags.json'), JSON.stringify(tagCounts, null, 2), 'utf-8');

  console.log('\nカテゴリ分布:');
  Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([name, count]) => console.log(`  ${name}: ${count}`));

  console.log('\nトップタグ:');
  Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .forEach(([tag, count]) => console.log(`  ${tag}: ${count}`));

  console.log(`\n✓ public/search-index.json (${searchIndex.length} 件)`);
  console.log(`✓ public/tags.json (${Object.keys(tagCounts).length} タグ)`);
}

main().catch((err) => { console.error(err); process.exit(1); });
