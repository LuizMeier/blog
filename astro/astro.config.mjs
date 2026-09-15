// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://blog.lmeier.net',
  adapter: cloudflare({
    // site 100% estático (sem KV/Images/bindings) — desliga o runtime local
    // do Cloudflare (workerd/Miniflare) durante `astro dev`, que não expõe
    // a porta corretamente rodando dentro de um container Docker
    platformProxy: { enabled: false }
  }),
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