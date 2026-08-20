import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';

export default defineConfig({
  // 2026-08-20 修正: tsurumai-nara.com は別サイト（つるまい自治協議会）。
  // 全記事 og:image が 404 になるため ktblog.pages.dev に戻した。
  site: 'https://ktblog.pages.dev',
  integrations: [tailwind(), mdx()],
  image: {
    domains: ['tsurumai-nara.com', 'files.catbox.moe']
  },
  build: {
    format: 'file'
  }
});
