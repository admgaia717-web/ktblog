#!/usr/bin/env python3
"""
dump.sqlからKTBLOGの記事を抽出してMarkdownファイルに変換する
"""

import re
import os
from pathlib import Path
from datetime import datetime

# 出力ディレクトリ
POSTS_DIR = Path("src/content/posts")
POSTS_DIR.mkdir(parents=True, exist_ok=True)

# 既存ファイルを削除
for f in POSTS_DIR.glob("*.md"):
    f.unlink()

# dump.sqlを読み込む
with open("dump.sql", "r", encoding="utf-8") as f:
    content = f.read()

# INSERT INTO "posts" VALUES(...) を抽出
pattern = r"INSERT INTO \"posts\" VALUES\((\d+),'([^']*)','([^']*)','((?:[^']|'')*)','((?:[^']|'')*)','((?:[^']|'')*)','([^']*)','([^']*)','([^']*)','([^']*)','([^']*)','([^']*)','([^']*)','([^']*)','([^']*)','([^']*)'\);"

matches = re.finditer(pattern, content, re.MULTILINE)

def escape_yaml(s):
    """YAML文字列内の特殊文字をエスケープ"""
    return s.replace('\\', '\\\\').replace('"', '\\"')

count = 0
seen_slugs = set()
for match in matches:
    id_num = match.group(1)
    title = match.group(2)
    slug = match.group(3)
    markdown = match.group(4).replace("''", "'")
    status = match.group(8)
    note_url = match.group(9)
    substack_url = match.group(10)
    created_at = match.group(13)
    eyecatch = match.group(7)
    category = match.group(16)
    
    # publishedとready記事を処理
    if status not in ["published", "ready"]:
        continue
    
    # ファイル名を生成（スラグベース）
    safe_slug = re.sub(r'[^\w\-]', '-', slug).strip('-')
    if not safe_slug:
        safe_slug = f"post-{id_num}"
    
    # 重複スラグを回避
    if safe_slug in seen_slugs:
        safe_slug = f"{safe_slug}-{id_num}"
    seen_slugs.add(safe_slug)
    
    # created_atをパース
    try:
        date = datetime.strptime(created_at, "%Y-%m-%d %H:%M:%S")
        date_str = date.strftime("%Y-%m-%d")
    except:
        date_str = "2026-06-03"
    
    # エスケープ処理
    safe_title = escape_yaml(title)
    safe_category = escape_yaml(category) if category else ""
    safe_eyecatch = escape_yaml(eyecatch) if eyecatch else ""
    safe_note_url = escape_yaml(note_url) if note_url else ""
    safe_substack_url = escape_yaml(substack_url) if substack_url else ""
    
    # フロントマターを生成
    frontmatter = f"""---
title: "{safe_title}"
date: {date_str}
slug: {safe_slug}
"""
    
    if safe_category:
        frontmatter += f'category: "{safe_category}"\n'
    
    if safe_eyecatch:
        frontmatter += f'eyecatch: "{safe_eyecatch}"\n'
    
    if safe_note_url:
        frontmatter += f'note_url: "{safe_note_url}"\n'
    
    if safe_substack_url:
        frontmatter += f'substack_url: "{safe_substack_url}"\n'
    
    frontmatter += "---\n\n"
    
    # Markdownファイルを書き込む
    md_content = frontmatter + markdown
    output_path = POSTS_DIR / f"{safe_slug}.md"
    
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(md_content)
    
    count += 1

print(f"完了: {count}件の記事を抽出しました")
