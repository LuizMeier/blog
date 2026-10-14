---
name: code-review
description: Revisa pull requests do blog Astro blog.lmeier.net (código, posts en/pt-BR, i18n, redirects, workflows do GitHub Actions e dependências do Dependabot). Use em toda revisão de PR deste repositório.
---

# Revisão de PRs — blog.lmeier.net

Responda em português. Sem elogio de preenchimento. Se não há problemas, diga isso.

## Contexto
- Site 100% estático em `astro/` (sem adapter/SSR), deploy no Cloudflare Pages; busca com Pagefind.
- Idiomas: `en` (padrão, sem prefixo) e `pt-BR` (`/pt-BR`). Decisões da migração em `migration/00-inventory.md`.
- CI: `npm run check`, `npm run build`, linkinator, markdownlint. Não há testes unitários: não cobrar.

## Prioridade
1. Quebra de build/CI. 2. Regressão de URL/SEO. 3. i18n. 4. Conteúdo/schema. 5. Segurança e dependências. 6. Qualidade de código.

## Posts (`astro/src/content/posts/{en,pt-BR}/`)
- Front matter conforme `content.config.ts`: `title`, `description`, `date` (YYYY-MM-DD), `categories`, `tags` obrigatórios.
- Categorias e tags em inglês nos dois idiomas; apontar grafias divergentes (ex.: `DevOps` vs `Devops`).
- Nome do arquivo = slug = URL. Renomear exige redirect em `public/_redirects` (com e sem barra final).
- Mesmo slug em en e pt-BR liga a tradução (hreflang). Sinalizar tradução ausente ou slug divergente.
- `.mdx` só com componente; imports relativos corretos. `mermaid: true` se houver diagrama.
- Imagens em `/assets/img/{slug}/` devem existir em `public/`; exigir `alt`.
- **Bloqueante:** tokens, PATs, segredos, IDs de tenant ou IPs reais em texto ou screenshots.
- Apontar comandos incorretos ou desatualizados. Revisão editorial é sugestão.

## i18n e rotas
- i18n é manual de propósito: não usar `astro:i18n` (bug withastro/astro#16386). Usar `localeUrl()` de `lib/urls.ts`; sinalizar URLs montadas à mão.
- Rota alterada em `src/pages/` exige a contrapartida em `src/pages/pt-BR/`. Textos de interface nos dois idiomas.

## Config e deploy
- Sem adapter/SSR; `site` = `https://blog.lmeier.net`; Node >= 22.12.
- `_redirects`: sem laços, sem sobrepor rotas vivas. Conferir sitemap, RSS (um por idioma) e Pagefind se rotas/layout mudarem.

## Workflows (`.github/`)
- `permissions` mínimas; actions com versão fixa.
- Nunca interpolar `${{ github.event.* }}` em `run:` (usar `env:`). `pull_request_target` com checkout do PR é bloqueante.
- Secrets só via `secrets.*`, nunca em logs.

## Dependências
- Dependabot agrupa `prod-deps` e `dev-deps`. Verificar lockfile coerente, CI verde e major bump (Astro, `@astrojs/*`, TypeScript, Pagefind): ler changelog e apontar breaking changes. `@astrojs/*` compatível com `astro`.
- Só dependência de versão, CI verde, sem major: aprovar em uma linha.

## Código
- Lógica em `lib/`, apresentação em `components/`. Sem `any` injustificado. Simplicidade primeiro.
- Ao mexer em `posts.ts`/`taxonomy.ts`, checar listagens, tags, categorias, RSS e busca nos dois idiomas.
- Comentários em português explicando o porquê.
- A11y: `alt`, headings, contraste claro/escuro, `lang` por idioma.

## Não comentar
- Estilo coberto por `.editorconfig`/markdownlint; falta de testes; `--skip` do Medium no linkinator (403 a bots).

## Formato
- Marque: **[Bloqueante]** (quebra build/URL/i18n, vaza segredo), **[Importante]** (regressão, inconsistência en/pt-BR, SEO), **[Sugestão]**.
- Cite arquivo/linha, proponha a correção e o impacto em outros módulos.
- Feche com veredito em 1-2 linhas: aprovar, aprovar com ressalvas ou pedir mudanças.
