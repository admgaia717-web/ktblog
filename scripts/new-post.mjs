#!/usr/bin/env node
/**
 * new-post — エージェント用記事作成スクリプト
 *
 * 使い方 (対話的):
 *   node scripts/new-post.mjs
 *
 * 使い方 (CLIフラグ):
 *   node scripts/new-post.mjs \
 *     --title "記事タイトル" \
 *     --date 2026-06-11 \
 *     --category "AI・テクノロジー" \
 *     --eyecatch "/assets/eyecatch/n12345.png" \
 *     --excerpt "記事の要約" \
 *     --file /tmp/article.md
 *
 *   --file を省略すると stdin から本文を読み取る。
 *   --date を省略すると今日の日付を使用。
 *   --dry-run で実際のファイル作成をスキップ。
 *
 * 出力:
 *   src/content/posts/{slug}.md
 */

import fs from 'fs';
import path from 'path';
import { createInterface } from 'readline';

const POSTS_DIR = path.resolve('src/content/posts');

function slugify(str) {
  return str
    .normalize('NFKC')
    .trim()
    .toLowerCase()
    .replace(/[/\\:;&$@%"'<>#{}|^~`\[\]]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseArgs() {
  const args = process.argv.slice(2);
  const flags = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2);
      if (key === 'dry-run') { flags.dryRun = true; continue; }
      const val = args[++i];
      if (val !== undefined) flags[key] = val;
    }
  }
  return flags;
}

function escapeYaml(s) {
  if (!s) return '';
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function makeFrontmatter({ title, date, category, eyecatch, excerpt, noteUrl, substackUrl }) {
  const lines = ['---'];
  lines.push(`title: "${escapeYaml(title)}"`);
  lines.push(`date: ${date}`);
  if (category) lines.push(`category: "${escapeYaml(category)}"`);
  if (eyecatch) lines.push(`eyecatch: "${escapeYaml(eyecatch)}"`);
  if (excerpt) lines.push(`excerpt: "${escapeYaml(excerpt)}"`);
  if (noteUrl) lines.push(`note_url: "${escapeYaml(noteUrl)}"`);
  if (substackUrl) lines.push(`substack_url: "${escapeYaml(substackUrl)}"`);
  lines.push('---\n');
  return lines.join('\n');
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

async function prompt(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => {
    rl.question(question, answer => { rl.close(); resolve(answer.trim()); });
  });
}

async function interactive() {
  console.log('=== KTBLOG 新規記事作成 ===\n');
  const title = await prompt('タイトル: ');
  if (!title) { console.error('エラー: タイトルは必須です'); process.exit(1); }
  const date = (await prompt(`日付 (${todayStr()}): `)) || todayStr();
  const category = await prompt('カテゴリ: ');
  const eyecatch = await prompt('アイキャッチ画像パス: ');
  const excerpt = await prompt('要約: ');
  console.log('\n--- 本文を入力 (Ctrl+D で終了) ---');
  const bodyLines = [];
  const rl = createInterface({ input: process.stdin });
  for await (const line of rl) bodyLines.push(line);
  const body = bodyLines.join('\n').trim();
  if (!body) { console.error('エラー: 本文が空です'); process.exit(1); }

  return { title, date, category, eyecatch, excerpt, body };
}

async function main() {
  fs.mkdirSync(POSTS_DIR, { recursive: true });

  const flags = parseArgs();
  let title, date, category, eyecatch, excerpt, body, noteUrl, substackUrl;

  const useCli = flags.title !== undefined;

  if (useCli) {
    title = flags.title;
    date = flags.date || todayStr();
    category = flags.category || '';
    eyecatch = flags.eyecatch || '';
    excerpt = flags.excerpt || '';
    noteUrl = flags['note-url'] || '';
    substackUrl = flags['substack-url'] || '';

    if (flags.file) {
      body = fs.readFileSync(flags.file, 'utf-8').trim();
    } else {
      const chunks = [];
      process.stdin.setEncoding('utf-8');
      for await (const chunk of process.stdin) chunks.push(chunk);
      body = chunks.join('').trim();
    }
  } else if (process.stdin.isTTY) {
    const answers = await interactive();
    title = answers.title;
    date = answers.date;
    category = answers.category;
    eyecatch = answers.eyecatch;
    excerpt = answers.excerpt;
    body = answers.body;
  } else {
    const chunks = [];
    process.stdin.setEncoding('utf-8');
    for await (const chunk of process.stdin) chunks.push(chunk);
    body = chunks.join('').trim();

    const firstLine = body.split('\n')[0];
    title = firstLine.replace(/^#\s*/, '').trim() || '無題';
    date = todayStr();
  }

  if (!body) { console.error('エラー: 本文が空です'); process.exit(1); }

  const slug = slugify(title);
  const filename = `${slug}.md`;
  const filepath = path.join(POSTS_DIR, filename);

  const frontmatter = makeFrontmatter({ title, date, category, eyecatch, excerpt, noteUrl, substackUrl });
  const content = frontmatter + body + '\n';

  if (flags.dryRun) {
    console.log('=== DRY RUN ===');
    console.log(`ファイル: ${filepath}`);
    console.log(content);
    return;
  }

  if (fs.existsSync(filepath)) {
    console.error(`警告: 既存ファイルを上書きします -> ${filename}`);
  }

  fs.writeFileSync(filepath, content, 'utf-8');
  console.log(`\n✓ 記事を作成しました: ${filepath}`);
  console.log(`  URL: /post/${slug}/`);
}

main().catch(err => { console.error(err); process.exit(1); });
