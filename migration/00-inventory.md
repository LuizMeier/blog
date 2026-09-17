# Fase 0 — Inventário (Jekyll/Chirpy → Astro)

> Documento de trabalho da migração. Gerado a partir do conteúdo real do repositório e do site em produção (blog.lmeier.net) em 2026-09-15. Serve de fonte de verdade para as fases 1-4 do [plano de modernização](../README.md#migração-astro) — schema de Content Collections, redirects e verificação final.

## 1. Front matter — campos em uso

Campos observados nos 16 posts (`_posts/en/*.md`, `_posts/pt-BR/*.md`):

| Campo | Obrigatório hoje | Observação |
|---|---|---|
| `title` | sim | string |
| `author` | sim no conteúdo atual, mas opcional no schema Zod (`.default('Luiz Meier')`, já que 100% dos posts são do mesmo autor) | sempre "Luiz Meier", mas com grafias inconsistentes: `"Luiz Meier"`, `Luiz Meier` (sem aspas), `"Luiz Meier "` (espaço sobrando em 1 post pt-BR) |
| `date` | sim | formatos inconsistentes: `"YYYY-MM-DD HH:MM:SS"`, `YYYY-MM-DD` (sem aspas), `"YYYY-MM-DD"`, `"YYYY-MM-DD HH:MM:SS +0000"` |
| `categories` | sim | array, hoje já **unificado em inglês** nos dois idiomas (ver seção 3) |
| `tags` | sim | array, mesma unificação |
| `description` | sim | string, usada em meta description / SEO |
| `lang` | sim | `en` ou `pt-BR` — redundante com a pasta, mas o tema usa este campo |
| `image` | quase sempre | path relativo, ex. `assets/img/slug/cover.png` |
| `layout` | sim | sempre `post` (alguns arquivos têm `layout:\tpost` com tab em vez de espaço) |
| `redirect_from` | 9 de 16 posts | string única ou array — ver seção 4, é crítico para a migração |
| `mermaid` | 2 de 16 posts | boolean, ativa renderização de diagramas Mermaid (só no post MCP-DNS) |

**Ação para o schema Zod do Astro:** normalizar `date` para ISO 8601 e `author` para string única (`"Luiz Meier"`) na migração de conteúdo — o schema deve validar e rejeitar as variantes atuais, não perpetuá-las.

**Chave de vínculo entre idiomas:** os 16 posts formam 8 pares com **nome de arquivo idêntico** entre `_posts/en/` e `_posts/pt-BR/` (confirmado via diff). Uso o nome do arquivo (sem data) como `translationId` no schema — é a única chave estável disponível hoje, já que não há campo explícito para isso.

**Divergência real encontrada:** o par `monitoring-palo-alto-firewalls-using-api` tem datas diferentes entre idiomas (en: 2024-12-19, pt-BR: 2024-12-27) — não é erro de dado, é intencional (confirmado nas datas de publicação reais no Medium). Manter as duas datas na migração.

## 2. URLs — estrutura atual

Confirmado via `_config.yml` (`permalinks`, `polyglot.lang_prefix: true`, `polyglot.default_lang: en`) e validado ao vivo contra `blog.lmeier.net`:

- Posts (en, idioma padrão, sem prefixo): `/posts/{slug-do-nome-do-arquivo}/`
- Posts (pt-BR, com prefixo): `/pt-BR/posts/{slug-do-nome-do-arquivo}/`
- Tags: `/tags/{tag}/` — mesmo padrão, sem prefixo observado para o conteúdo atual
- Categorias: `/categories/{categoria}/` — idem
- Tabs: `/about/`, `/archives/`, `/categories/`, `/tags/` (+ variante `/pt-BR/about/` para a versão traduzida da página Sobre)

**Importante:** o slug da URL vem do **nome do arquivo**, não do campo `title` do front matter. Isso foi confirmado cruzando os links reais que os posts no Medium fazem de volta para o blog (ver seção 5) — inclusive um caso onde o link do Medium usa um slug antigo, hoje preservado só via `redirect_from`.

## 3. Taxonomia (categorias e tags)

Boa notícia: **já está unificada em inglês** entre os dois idiomas — os posts pt-BR usam os mesmos valores de `categories`/`tags` que os posts en (não são traduzidos por post). Não há decisão de "unificar taxonomia" pendente.

- Categorias únicas (16 posts): `AI, API, Automation, Backstage, CCTV, Cloud, Cluster Shared Volumes, DDI, DNS, DevOps, Hardware, MCP, Monitoring, NGFW, Palo Alto, Python, Zabbix`
- Tags únicas (16 posts): `AI, API, Authentication, Automation, Azure DevOps, Backstage, CCTV, CI/CD Pipelines, Cluster Shared Volumes, Custom Scripts, DDI, DNS, Hardware, Identity Provider, Infoblox, Intelbras, LLD, MCP, Microsoft Entra ID, Monitoring, NGFW, Palo Alto, Powershell, Python, Zabbix`

**Achado à parte, sem ação necessária na migração:** o `sitemap.xml` ao vivo hoje lista páginas de tag/categoria em português que não correspondem a nenhum post atual — `/categories/automação/`, `/categories/cftv/`, `/categories/monitoramento/`, `/tags/autenticação/`, `/tags/automação/`, `/tags/monitoramento/`, `/tags/scripts-personalizados/`, e uma claramente esquecida: **`/tags/automacao_temp/`**. São resíduos de uma taxonomia antiga (antes da unificação em inglês) que o deploy atual não limpou. Como o site novo é gerado do zero a partir do conteúdo atual, essas páginas simplesmente não existirão — não há posts ou backlinks conhecidos apontando para elas, então não entram na tabela de redirects.

**Achado à parte, mais relevante:** o `sitemap.xml` ao vivo **não lista nenhuma página em pt-BR** — nem posts, nem tags, nem categorias, nem `/pt-BR/about/`. Só o conteúdo em inglês está sendo submetido ao Google hoje. Isso é uma falha de SEO pré-existente, não causada pela migração — vale corrigir no site novo (sitemap Astro deve cobrir os dois idiomas) independente de qualquer decisão sobre o motivador visual.

## 4. Tabela de redirects (URL antiga → URL atual)

Todas as entradas vêm de `redirect_from` no front matter de cada post — precisam de regra 301 equivalente no `_redirects` do Cloudflare (Workers static assets).

| URL antiga | URL atual |
|---|---|
| `/posts/creating-your-own-custom-lld-in-zabbix-en/` | `/posts/creating-your-own-custom-lld-in-zabbix/` |
| `/posts/criando-seu-proprio-lld-personalizado-no-zabbix-pt-BR/` | `/posts/creating-your-own-custom-lld-in-zabbix/` |
| `/pt-BR/posts/criando-seu-proprio-lld-personalizado-no-zabbix-pt-BR/` | `/pt-BR/posts/creating-your-own-custom-lld-in-zabbix/` |
| `/posts/como-recuperei-uma-camera-cftv-brickada/` | `/posts/how-i-recovered-a-bricked-cctv-camera/` |
| `/pt-BR/posts/como-recuperei-uma-camera-cftv-brickada/` | `/pt-BR/posts/how-i-recovered-a-bricked-cctv-camera/` |
| `/posts/fortinet-vs-palo-alto-automatizando-balanceamento-de-carga/` | `/posts/fortinet-vs--palo-alto--automating-load-balancing/` |
| `/pt-BR/posts/fortinet-vs-palo-alto-automatizando-balanceamento-de-carga/` | `/pt-BR/posts/fortinet-vs--palo-alto--automating-load-balancing/` |
| `/posts/authentication-backstage-entra-id-en/` | `/posts/authentication-backstage-entra-id/` |
| `/pt-BR/posts/autenticacao-backstage-entra-id-pt-BR/` | `/pt-BR/posts/authentication-backstage-entra-id/` |
| `/posts/integrating-backstage-azure-devops-en/` | `/posts/integrating-backstage-azure-devops/` |
| `/posts/integrando-backstage-azure-devops-pt-BR/` (com e sem barra final) | `/pt-BR/posts/integrating-backstage-azure-devops/` |
| `/pt-BR/posts/integrando-backstage-azure-devops-pt-BR/` | `/pt-BR/posts/integrating-backstage-azure-devops/` |
| **`/pt-BR/posts/usando-api-para-monitorar-ipsec-da-palo-alto/`** | `/pt-BR/posts/monitoring-palo-alto-firewalls-using-api/` |

A entrada em negrito é a que o Medium referencia ativamente hoje (ver seção 5) — prioridade alta de teste manual antes do go-live.

## 5. Links externos confirmados (Medium)

Seu Medium está em **`medium.lmeier.net`** (domínio customizado) — não `medium.com/LuizMeier`, que não tem posts publicados. 5 dos 16 posts foram cross-postados lá (10 URLs no Medium, 4 pares + verificação extra).

**Atualização pós-deploy: os 10 links foram verificados um a um contra o domínio em produção** (não só 3 por amostragem, como na Fase 0) — 2 dos 10 posts do Medium têm links de volta duplicados (uma referência cruzada para outro post dentro do texto, além do link principal), totalizando 12 URLs reais testadas:

| URL referenciada pelo Medium | Resultado antes da correção | Causa |
|---|---|---|
| `/posts/how-i-built-my-first-mcp-for-dns-operations/` | 200 (já atual) | — |
| `/pt-BR/posts/how-i-built-my-first-mcp-for-dns-operations/` | 200 (já atual) | — |
| `/pt-BR/posts/usando-api-para-monitorar-ipsec-da-palo-alto/` | 301 correto | coberta desde a Fase 0 |
| `/posts/integrating-backstage-azure-devops-en/` | 301 correto | coberta desde a Fase 0 |
| `/posts/integrando-backstage-azure-devops-pt-BR/` | 301 correto | coberta desde a Fase 0 |
| `/posts/authentication-backstage-entra-id-en/` (com barra) | 301 correto | coberta desde a Fase 0 |
| `/posts/monitoring-palo-alto-firewalls-using-api/` | 200 (já atual) | — |
| **`/posts/authentication-backstage-entra-id-en` (sem barra)** | **404** | referência cruzada dentro do post de Azure DevOps, nunca mapeada — Cloudflare `_redirects` faz match exato, sem/com barra são paths diferentes |
| **`/posts/autenticacao-backstage-entra-id-pt-BR/` (sem prefixo `/pt-BR/`)** | **404** | afeta 2 links reais (principal do post Entra ID pt-BR + referência cruzada dentro do post Azure DevOps pt-BR). O `redirect_from` original do Jekyll só cobria a variante *com* prefixo `/pt-BR/` — esse link provavelmente **já estava quebrado no site atual também**, não é regressão da migração |
| **`/posts/fortinet-vs-palo-alto-automatizando-balanceamento-de-carga/`** | **301 para URL errada** | redirecionava um post em português para a versão em **inglês** — erro meu na tabela original da Fase 0 |
| **`/posts/fortinet-vs-palo-alto-automating-load-balancing/` (hífen simples)** | **404** | o slug atual usa hífen duplo (`fortinet-vs--palo-alto--automating-load-balancing`); essa variante nunca foi cadastrada |

As 4 falhas foram corrigidas em `astro/public/_redirects` — e, por segurança, toda entrada da tabela agora existe em duas versões (com e sem barra final), já que se provou ser uma causa real de 404, não só teórica. Validado de novo: build copia as 56 linhas para `dist/_redirects` corretamente.

**Não migrados no Medium** (sem risco de link externo): Zabbix Custom LLD, Monitoring Cluster Shared Volumes, CCTV Camera Recovery.

## 6. Fase 1 — decisões técnicas e uma pegadinha real do Astro

Roteamento, SEO/hreflang e RSS implementados em `astro/src/`. Duas decisões que vale registrar para quem mexer nisso depois:

**Sem adapter Cloudflare.** O scaffold inicial da Fase 0 incluía `@astrojs/cloudflare`, pensando em consistência com o deploy alvo. Removido: o site é 100% estático (sem KV, Images, D1 ou SSR sob demanda), e o adapter tenta subir um runtime local (`workerd`) tanto no `astro dev` quanto no `astro build`, que não expõe a porta corretamente dentro do container Docker. Cloudflare Pages aceita HTML estático puro direto da pasta `dist/`, sem precisar de adapter nenhum — só adicionar de volta se um dia o site precisar de SSR real.

**Sem `i18n` nativo do Astro (`astro:i18n`).** Motivo real, encontrado por baixo de duas horas de investigação: o **glob loader das Content Collections normaliza o `id` do arquivo para minúsculo** — um arquivo em `src/content/posts/pt-BR/algum-slug.md` vira `id: "pt-br/algum-slug"` (minúsculo), não `"pt-BR/algum-slug"`. O código de detecção de idioma (`localeFromId` em `src/lib/posts.ts`) comparava contra `pt-BR/` com maiúscula e nunca batia, então `getStaticPaths()` da rota pt-BR sempre recebia uma lista vazia. Isso se manifestou de formas enganosas — conflito de rotas durante o build, prefixo de URL descartado, 404 mesmo com a rota "encontrada" — que pareciam apontar para bugs no roteamento i18n do Astro (chegou a ser reproduzido um comportamento idêntico a um issue aberto no GitHub do Astro, #16386). A causa raiz não tinha relação com isso; era a comparação de case. A correção foi trivial (`.toLowerCase()` na comparação); o `i18n` nativo do Astro e o helper `getRelativeLocaleUrl` foram removidos porque já não eram necessários, e um helper manual (`src/lib/urls.ts`, `localeUrl(locale, path)`) faz o mesmo com bem menos superfície de comportamento a confiar.

**Lição para a Fase 3 (migração dos 16 posts reais):** qualquer código que compare o idioma a partir do path/id de um arquivo de conteúdo precisa ser case-insensitive, ou usar sempre minúsculo internamente. Os arquivos de conteúdo em si continuam podendo ficar em pastas `en/` e `pt-BR/` no disco — é só o `id` derivado pelo Astro que vem normalizado.

## 7. Fase 2 — visual e uma segunda pegadinha de ambiente Docker

Protótipo em `astro/src/`, com 3 posts reais migrados como fixture de validação (`how-i-built-my-first-mcp-for-dns-operations` en+pt-BR, `creating-your-own-custom-lld-in-zabbix` en) — escolhidos por cobrirem casos variados: diagramas Mermaid, blocos de código em três linguagens, várias imagens embutidas, blockquotes, listas. Migração completa dos 16 posts continua sendo Fase 3.

**Paleta e tipografia**, baseadas na estrutura real de tokens do tema AstroPaper (`--color-background/foreground/accent/muted/border`, confirmados no repo oficial), com os valores de cor substituídos por uma paleta mais sóbria — o accent original do AstroPaper é um laranja vibrante (`#ff6b01`), trocado por um teal dessaturado. Tipografia: **Google Sans Code** (monoespaçada, a mesma do AstroPaper) para títulos, navegação e código; **IBM Plex Sans** para o corpo do texto — o AstroPaper usa a monoespaçada para tudo, o que arriscaria legibilidade nos tutoriais longos deste blog.

**Tema claro/escuro**: escuro como padrão (pedido explícito), com alternância manual persistida em `localStorage`. Diagramas Mermaid renderizados no cliente (`public/scripts/mermaid.js`, via CDN) respeitando o tema ativo.

**Escopo reduzido nesta fase:** páginas de tag/categoria individuais (`/tags/{tag}/`) ficam como página de índice simples (lista de badges, sem drill-down) — implementar o drill-down faz parte da Fase 3, junto com a migração completa de conteúdo.

**Achado de ambiente, não de código:** o Astro grava o PID do processo de dev em `.astro/dev.json` para detectar uma segunda instância já rodando. Como cada container Docker reinicia a numeração de PID do zero, um container recriado frequentemente "colide" por coincidência com o PID salvo de uma execução anterior, e o Astro recusa subir — sem erro visível, a porta simplesmente não responde (sintoma: `curl` trava ou dá connection reset). Isso explica boa parte da instabilidade enfrentada ao iterar nesta sessão. Corrigido de forma permanente em `docker/docker-compose.yml`: o comando do serviço `astro` agora remove esse arquivo antes de cada `npm run dev`.

## 8. CI/CD — qualidade em PR; deploy via Cloudflare Workers (static assets)

Deploy **não** é feito por um workflow do GitHub Actions — é a build nativa conectada ao Git da Cloudflare (configurada no dashboard, não no repositório) que builda e publica a cada push em `main`. Cheguei a criar um workflow próprio duas vezes, em duas direções erradas diferentes:

1. Primeiro um workflow com `wrangler pages deploy` via Actions — removido por duplicar o que a build nativa já faz de graça (incluindo preview automático por PR).
2. Depois recomendei o fluxo "legacy" do Cloudflare Pages sem checar a posição atual da própria Cloudflare — errado. A orientação oficial deles desde a unificação Workers/Pages é: **"you should start with Workers"** para projetos novos. Pages não está desativado (continua funcionando, recebe correção de bug), mas todo investimento em feature nova (deployments graduais, observability, etc.) vai para Workers daqui pra frente. Corrigido para o caminho que a Cloudflare recomenda hoje: **Workers com static assets**, não Pages.

**Isso não reintroduz o problema do adapter da Fase 1.** Aquele problema era o `@astrojs/cloudflare` (adapter do Astro) tentando emular um runtime SSR (`workerd`) dentro do `astro dev`/`astro build`. A config de deploy abaixo é outra coisa: só um binding de assets estáticos apontando para `dist/`, sem nenhum código de Worker, sem adapter no Astro, sem afetar em nada o build/dev do site — usada apenas no momento do deploy.

**`astro/wrangler.jsonc`** — config mínima:
```json
{ "name": "blog-lmeier", "compatibility_date": "2026-09-17", "assets": { "directory": "./dist" } }
```
Validado localmente com `npx wrangler deploy --dry-run`: leu os 467 arquivos de `dist/`, "No bindings found" (esperado, é só assets), sem erro.

**Configuração do lado Cloudflare** (dashboard → Workers & Pages → Create application → Connect to Git → repositório `LuizMeier/blog`):
- Project name: `blog-lmeier`
- Build command: `npm run build`
- Deploy command: `npx wrangler deploy` (pré-preenchido)
- Path (diretório do monorepo onde fica o `wrangler.jsonc`): `astro`
- "Builds for non-production branches" habilitado: dá preview automático por PR, equivalente ao que o Pages dava de graça

Cada PR ganha automaticamente uma URL de preview própria.

**O que fica do lado GitHub Actions** (checks de qualidade, gate antes do merge — não deploy):
- **`.github/workflows/astro-ci.yml`** — dispara em `pull_request`, filtrado por `paths: astro/**`. Roda `astro check` (type-check), `npm run build`, e `linkinator` contra o build para pegar links internos quebrados. Complementa o preview deploy do Cloudflare: um valida que o código está correto, o outro te dá uma URL pra olhar o resultado.
- **`dependabot.yml`** — nova entrada `npm` com `directory: "/astro"`; sem isso o Dependabot nunca abriria PR para as dependências do projeto novo.
- **Workflows do Jekyll** (`html-proofer.yaml`, `pages-deploy.yml`) ganharam `astro/**` e `migration/**` no `paths-ignore` — evita builds do Jekyll disparados à toa por commits que só tocam o projeto novo.
- **`markdown-lint.yaml`** — corrigido um bug pré-existente (glob `_posts/*.md` sem `**`, nunca pegava os posts que ficam em subpastas `en/`/`pt-BR/`) e adicionado o novo caminho de conteúdo.
- **`post-review.yaml`** (revisão de posts via IA) — path do trigger estendido para cobrir `astro/src/content/posts/**/*.md`.

**Achado durante a validação:** `medium.lmeier.net` retorna 403 para requisições automatizadas (bloqueio anti-bot do Medium), mesmo sendo um link válido — confirmado manualmente. O `linkinator` no CI ignora esse domínio explicitamente para não gerar falso positivo a cada PR.

## 9. Pendência sua, do lado Cloudflare

Conectar o repositório no dashboard da Cloudflare (Workers & Pages → Create application → Connect to Git) com a configuração da seção 8. Nada a configurar no GitHub para isso — sem secrets.

**Cloudflare Web Analytics**: habilitado via o toggle nativo do projeto (dashboard → projeto → Web Analytics → Enable), não por script no código — mesmo raciocínio da decisão de deploy: preferir a ferramenta nativa da Cloudflare a manter mais uma peça própria para atualizar. Google Analytics continua via código (`astro/src/components/Analytics.astro`) para preservar o histórico de dados já existente; os dois convivem sem conflito. Como essa configuração vive só no dashboard, não no repositório, fica registrada aqui para não se perder: domínio a associar é `blog.lmeier.net` (só mostra tráfego real depois do corte de DNS da Fase 4).

## 10. Fase 3 completa — paridade de conteúdo e features

Os 16 posts reais estão migrados (`astro/src/content/posts/`), com páginas de tag/categoria individuais, giscus, analytics, busca e a tabela de redirects — ver o commit `b54bf18` para o detalhamento de cada peça. Duas coisas vale registrar aqui:

**Busca (Pagefind) só existe no build de produção.** Ela indexa o HTML já gerado (`pagefind --site dist`, rodando depois do `astro build`), então não há nada para buscar em `astro dev`. Para testar localmente, é preciso `npm run build && npm run preview` (porta 4322, mapeada no `docker-compose.yml` só para isso).

**Giscus valida com a discussão real** — abrir um post no ambiente local já carrega os comentários/reações reais do repositório `luizmeier/giscus`, porque giscus não depende da origem de onde o embed é servido, só do `mapping: pathname` da página. Ou seja: cuidado ao testar localmente em paths que já têm comentários reais — qualquer comentário postado durante testes é real e público.

## 11. Próximo passo

Fase 3 concluída de ponta a ponta: conteúdo, taxonomia, comentários, analytics, busca e redirects. Falta: (a) você conectar o repositório no Cloudflare Workers (seção 9) se ainda não fez; (b) revisão sua do resultado; (c) Fase 4 — corte para produção (checklist de SEO, corte de DNS, desligar o GitHub Pages e os workflows do Jekyll).
