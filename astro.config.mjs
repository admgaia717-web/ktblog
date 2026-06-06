import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://tsurumai-nara.com',
  output: 'hybrid',
  integrations: [tailwind(), mdx()],
  image: {
    domains: ['tsurumai-nara.com', 'files.catbox.moe']
  },
  build: {
    format: 'file'
  },
  // Cloudflare Pages adapter を導入。
  // 目的: SPA mode (Dashboard 有効化) を Pages Function で上書きする。
  // なぜ必要か: これまで _redirects / 404.html / _worker.js / public/functions/[[path]].js
  // のいずれも Cloudflare Pages の Dashboard で有効化された SPA mode に上書きされた。
  // Astro の @astrojs/cloudflare adapter 経由の Pages Function だけが確実に優先される。
  // output: 'hybrid' でデフォルトは静的 build、Pages Function が有効化される。
  adapter: cloudflare({
    mode: 'directory',
    runtime: { mode: 'local' }
  })
});
