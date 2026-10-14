# Blog blog.lmeier.net — instruções gerais

Responda em português. Sem elogio de preenchimento. Se não há problemas, diga isso.
Para revisão de pull requests, use também a skill `code-review` (`.github/skills/code-review/SKILL.md`).

## Contexto
- Site 100% estático em `astro/` (Astro 7, sem adapter/SSR), deploy no Cloudflare Pages; busca com Pagefind.
- Idiomas: `en` (padrão, sem prefixo) e `pt-BR` (`/pt-BR`). Decisões da migração em `migration/00-inventory.md`.
- CI: `npm run check`, `npm run build`, linkinator, markdownlint. Não há testes unitários: não cobrar.

## Regras essenciais
- i18n é manual de propósito: não usar `astro:i18n` (bug withastro/astro#16386); usar `localeUrl()` de `lib/urls.ts`.
- Rota alterada em `src/pages/` exige a contrapartida em `src/pages/pt-BR/`.
- Nome do arquivo do post = slug = URL; renomear exige redirect em `public/_redirects`.
- Categorias e tags em inglês nos dois idiomas.
- Nunca expor tokens, PATs, segredos, IDs de tenant ou IPs reais em posts ou screenshots.
- Workflows: permissões mínimas; nunca interpolar `${{ github.event.* }}` em `run:`.
- Comentários de código em português; simplicidade primeiro.
