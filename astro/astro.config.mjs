// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

import mdx from '@astrojs/mdx';

// https://astro.build/config
// Site 100% estático: nenhuma feature de runtime da Cloudflare (KV, Images,
// SSR sob demanda) é usada hoje, então não há adapter aqui de propósito —
// o Cloudflare Pages aceita HTML estático puro direto da pasta dist/, sem
// precisar rodar um Worker por trás.
//
// i18n é implementado manualmente (src/lib/urls.ts + estrutura de pastas em
// src/pages/), sem a config nativa `i18n` do Astro nem `astro:i18n`: a
// versão 7.3.2 tem um bug conhecido (github.com/withastro/astro/issues/16386)
// onde uma rota cujo path começa com um código de locale colide
// incorretamente com a rota do idioma padrão durante o build, descartando o
// prefixo — reproduzido e documentado em migration/00-inventory.md.
export default defineConfig({
  site: 'https://blog.lmeier.net',
  integrations: [sitemap(), mdx()]
});