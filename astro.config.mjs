import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://tsurumai-nara.com',
  integrations: [tailwind(), mdx()],
  image: {
    domains: ['tsurumai-nara.com', 'files.catbox.moe']
  },
  build: {
    format: 'file'
  }
});
