// https://astro.build/config
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import compress from 'astro-compress';
import { defineConfig } from 'astro/config';
import rehypeExternalLinks from 'rehype-external-links';
import { serializeSitemap, shouldIndexPage } from './sitemap.mjs';
import node from '@astrojs/node';
import auth from "auth-astro";
import { defineConfig } from 'astro/config';


// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: "standalone"
  }),
  markdown: {
    shikiConfig: {
      theme: 'dracula'
    },
    rehypePlugins: [[rehypeExternalLinks, {
      target: '_blank',
      rel: function (element) {
        const href = element.properties.href;
        const whiteListedStarts = ['/', '#', 'mailto:', 'https://github.com/kamranahmedse', 'https://thenewstack.io', 'https://cs.fyi', 'https://roadmap.sh'];
        if (whiteListedStarts.some(start => href.startsWith(start))) {
          return [];
        }
        return 'noopener noreferrer nofollow';
      }
    }]]
  },
  build: {
    format: 'file'
  },
  integrations: [tailwind({
    config: {
      applyBaseStyles: false
    }
  }), sitemap({
    filter: shouldIndexPage,
    serialize: serializeSitemap
  }), compress({
    css: false,
    js: false
  }), preact(), auth(),]
});
