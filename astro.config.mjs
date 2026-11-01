// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import rehypeBlogLinks from './src/lib/rehype-blog-links.mjs';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// https://astro.build/config
export default defineConfig({
  site: 'https://jayyu.dev/',
  devToolbar: {
    enabled: false,
  },
  integrations: [mdx(), sitemap()],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex, rehypeBlogLinks],
    remarkRehype: {
      // Request text presentation so footnote arrows do not render as emoji.
      footnoteBackContent: '\u21A9\uFE0E',
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
