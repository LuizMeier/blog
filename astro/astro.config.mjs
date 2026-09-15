// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://blog.lmeier.net',
  adapter: cloudflare(),
  integrations: [sitemap()],
  i18n: {
    locales: ['en', 'pt-BR'],
    defaultLocale: 'en',
    routing: {
      // mantém o padrão atual: en sem prefixo, pt-BR com prefixo /pt-BR/
      prefixDefaultLocale: false
    }
  }
});