import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Schema derivado do inventário de front matter do blog atual
// (migration/00-inventory.md, seção 1). Datas e nomes de autor são
// normalizados aqui em vez de aceitar as variantes inconsistentes
// que existem hoje no Jekyll.
//
// Convenção de arquivos: en/{slug}.md e pt-BR/{slug}.md, com o mesmo
// {slug} nos dois idiomas para vincular o par de traduções (usado para
// gerar hreflang e o seletor de idioma). {slug} é o nome do arquivo sem
// prefixo de data e vira a URL final (/posts/{slug}/ em en,
// /pt-BR/posts/{slug}/ em pt-BR), igual ao site atual.
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    author: z.string().default('Luiz Meier'),
    categories: z.array(z.string()),
    tags: z.array(z.string()),
    image: z.string().optional(),
    mermaid: z.boolean().default(false),
    draft: z.boolean().default(false)
  })
});

export const collections = { posts };
