# blog.lmeier.net

Site pessoal de Luiz Meier — Astro, bilíngue (en / pt-BR), deploy no Cloudflare Workers (static assets).

Migrado de Jekyll/Chirpy; o histórico completo da migração (decisões, pegadinhas, tabela de redirects) está em [`migration/00-inventory.md`](../migration/00-inventory.md).

## Estrutura do projeto

```text
astro/
├── public/
│   ├── _redirects          # redirects 301 (URLs antigas do Jekyll/Medium)
│   └── assets/img/         # imagens dos posts
├── src/
│   ├── content/posts/
│   │   ├── en/              # posts em inglês
│   │   └── pt-BR/           # posts em português
│   ├── content.config.ts    # schema Zod dos posts
│   ├── components/
│   ├── layouts/
│   │   ├── Base.astro       # layout raiz: head, hreflang, header/footer
│   │   └── PostLayout.astro # layout de post individual
│   ├── lib/
│   │   ├── urls.ts          # helper manual de URL por locale (não usa astro:i18n — ver comentário no arquivo)
│   │   ├── posts.ts
│   │   └── taxonomy.ts
│   └── pages/
│       ├── (rotas em inglês, raiz)
│       └── pt-BR/           # espelho das rotas em português
```

Cada post existe em dois arquivos com o mesmo `{slug}` (`en/{slug}.md` e `pt-BR/{slug}.md`), usados para vincular as traduções (seletor de idioma e `hreflang`).

## Desenvolvimento

Todo o desenvolvimento roda em Docker (ver `docker/docker-compose.yml` na raiz do repo), não há instalação local esperada:

```sh
docker compose -f docker/docker-compose.yml up astro
```

Site disponível em `localhost:4321`. Busca (Pagefind) só funciona no build de produção — para testar localmente, `npm run build && npm run preview` (porta 4322).

## Comandos

| Comando            | Ação                                                 |
| :------------------ | :---------------------------------------------------- |
| `npm run dev`        | Sobe o dev server em `localhost:4321`                  |
| `npm run build`      | Build de produção em `./dist/` (inclui indexação do Pagefind) |
| `npm run preview`    | Serve o build de produção localmente                   |
| `npm run check`      | Type-check (`astro check`)                             |

## Deploy

Cloudflare Workers (static assets), disparado automaticamente a cada commit em `main` via integração nativa Git da Cloudflare — não há workflow de deploy no GitHub Actions. Configuração em [`wrangler.jsonc`](./wrangler.jsonc).

O GitHub Actions (`.github/workflows/astro-ci.yml`) cuida só do gate de qualidade em PR: type-check, build e checagem de links quebrados.
