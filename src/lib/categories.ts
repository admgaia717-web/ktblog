import type { CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

export interface CategoryGroup {
  name: string;
  posts: Post[];
}

const CATEGORY_MAP: Record<string, string> = {
  'note.com': 'ノート・記録',
  'お金': 'お金・経済',
};

const GROUP_PATTERNS: { name: string; patterns: RegExp[] }[] = [
  {
    name: 'AI・テクノロジー',
    patterns: [
      /^AI\b/i,
      /LLM/,
      /生成AI/,
      /ロボット/,
      /エージェント/,
      /テクノロジー/,
      /Civitai/,
      /OpenClaw/,
      /Ollama/,
      /HuggingFace/,
      /transformers/,
      /StableDiffusion/,
      /abliteration/,
      /アンセンサード/,
      /無修正/,
      /無検閲/,
      /素体/,
      /OSS/,
      /オープンソース/,
      /Github/,
      /GitHub/,
      /プログラミング/,
      /自動化/,
      /セルフホスト/,
      /セキュリティ/,
      /ダークウェブ/,
      /Mac/,
      /RaspberryPi/,
      /arduino/,
      /esp32/,
      /ROS/,
      /IoT/,
      /電子工作/,
      /3Dプリンタ/,
      /3Dプリンター/,
      /Immich/,
      /OMP/,
      /OpenStinger/,
      /OpenRouter/,
      /Pi/,
      /Tailscale/,
      /Spotify/,
      /メモリ/,
      /エンジニアリング/,
      /設計思想/,
      /icloud/,
      /スケーラビリティ/,
      /データ/,
      /プラットフォーム/,
      /モデル/,
      /コード/,
      /ダウンロード/,
      /NSFW/,
      /マックスフィールド/,
      /自由市場/,
      /メッシュネット/,
      /情報戦/,
      /検閲/,
      /サイファーパンク/,
      /Mercury/,
      /UI-TARS/,
      /RTX/,
      /Unitree/,
      /Bonsai/,
      /AGI太郎/,
      /AGI/,
      /DMT/,
      /Dash/,
      /ClaudeCode/,
      /Claude/,
    ],
  },
  {
    name: '創作・文化',
    patterns: [
      /創作/,
      /エッセイ/,
      /音楽/,
      /ボカロ/,
      /初音ミク/,
      /ジブリ/,
      /アニメ/,
      /宮崎駿/,
      /小説/,
      /文学/,
      /吾輩は猫/,
      /夏目漱石/,
      /パロディ/,
      /アイアンマン/,
      /稚暉君/,
      /イラスト/,
      /写真/,
      /映像/,
      /動画/,
      /プラットフォーム/,
      /peertube/,
      /Glaze/,
      /Nightshade/,
      /クリエイター/,
      /クリエイティブ/,
      /表現の自由/,
      /デジタル菩薩/,
      /芸術/,
      /美術/,
      /デザイン/,
      /映画/,
      /ゲーム/,
      /VTuber/,
      /YouTube/,
      /Podcast/,
      /ラジオ/,
    ],
  },
  {
    name: '哲学・思想',
    patterns: [
      /哲学/,
      /仏教/,
      /禅/,
      /自己啓発/,
      /心理学/,
      /信仰/,
      /精神/,
      /東洋/,
      /閑話休題/,
      /ロデム/,
      /魂/,
      /人生/,
      /信念/,
      /万葉集/,
      /公案/,
      /日本人/,
      /ヤマト/,
      /エゴ/,
      /菩薩/,
      /暗号技術/,
      /技術倫理/,
      /倫理/,
      /未来/,
      /中学生/,
      /自己/,
      /人間/,
      /社会/,
      /コスト/,
      /知能/,
      /14歳/,
      /パラレルワールド/,
      /艦隊/,
    ],
  },
  {
    name: 'お金・経済',
    patterns: [
      /お金/,
      /ビットコイン/,
      /bitcoin/,
      /ブロックチェーン/,
      /暗号通貨/,
      /クリプト/,
      /サトシ/,
      /Monero/,
      /メルカリ/,
      /中古市場/,
      /価格/,
      /リサーチ/,
      /無料/,
      /ターミナル/,
      /おっさん/,
      /メモ/,
      /KuCoin/,
      /金融/,
      /投資/,
      /資産/,
      /経済/,
      /市場/,
      /決済/,
      /マネー/,
      /フリーランス/,
      /副業/,
      /収入/,
    ],
  },
  {
    name: 'ライフスタイル',
    patterns: [
      /防災/,
      /地震/,
      /奈良/,
      /OSINT/,
      /WorldMonitor/,
      /薬草/,
      /シロシビン/,
      /マジックマッシュルーム/,
      /Psilocybe/,
      /PFtek/,
      /崩壊後医学/,
      /サバイバル/,
      /食/,
      /料理/,
      /レシピ/,
      /健康/,
      /医療/,
      /運動/,
      /旅行/,
      /散歩/,
      /観光/,
      /風景/,
      /自然/,
      /植物/,
      /動物/,
      /ペット/,
      /猫/,
      /犬/,
      /日常/,
      /生活/,
      /家庭/,
      /掃除/,
      /整理/,
      /収納/,
      /インテリア/,
      /DIY/,
      /園芸/,
      /農業/,
      /スマート農業/,
      /自炊/,
      /節約/,
    ],
  },
];

export function getGroupName(category: string | undefined): string {
  if (!category) return 'その他';

  const mapped = CATEGORY_MAP[category];
  if (mapped) return mapped;

  for (const group of GROUP_PATTERNS) {
    for (const pattern of group.patterns) {
      if (pattern.test(category)) {
        return group.name;
      }
    }
  }

  return 'その他';
}

export function groupPostsByCategory(posts: Post[]): CategoryGroup[] {
  const groups: Record<string, Post[]> = {};

  for (const post of posts) {
    const groupName = getGroupName(post.data.category);
    if (!groups[groupName]) groups[groupName] = [];
    groups[groupName].push(post);
  }

  return Object.entries(groups)
    .map(([name, groupPosts]) => ({
      name,
      posts: groupPosts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf()),
    }))
    .sort((a, b) => b.posts.length - a.posts.length);
}
