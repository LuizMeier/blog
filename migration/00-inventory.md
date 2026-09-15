# Fase 0 — Inventário (Jekyll/Chirpy → Astro)

> Documento de trabalho da migração. Gerado a partir do conteúdo real do repositório e do site em produção (blog.lmeier.net) em 2026-09-15. Serve de fonte de verdade para as fases 1-4 do [plano de modernização](../README.md#migração-astro) — schema de Content Collections, redirects e verificação final.

## 1. Front matter — campos em uso

Campos observados nos 16 posts (`_posts/en/*.md`, `_posts/pt-BR/*.md`):

| Campo | Obrigatório hoje | Observação |
|---|---|---|
| `title` | sim | string |
| `author` | sim | sempre "Luiz Meier", mas com grafias inconsistentes: `"Luiz Meier"`, `Luiz Meier` (sem aspas), `"Luiz Meier "` (espaço sobrando em 1 post pt-BR) |
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

Todas as entradas vêm de `redirect_from` no front matter de cada post — precisam de regra 301 equivalente no `_redirects` do Cloudflare Pages.

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

Seu Medium está em **`medium.lmeier.net`** (domínio customizado) — não `medium.com/LuizMeier`, que não tem posts publicados. 5 dos 16 posts foram cross-postados lá (10 URLs no Medium, 4 pares + verificação extra), cada um com um link de volta para uma URL específica do blog, confirmado inspecionando os links reais de 3 amostras:

| Post | URL referenciada pelo Medium | Status |
|---|---|---|
| How I built my first MCP for DNS operations (en) | `/posts/how-i-built-my-first-mcp-for-dns-operations/` | é a URL atual |
| Como construí meu primeiro MCP... (pt-BR) | `/pt-BR/posts/how-i-built-my-first-mcp-for-dns-operations/` | é a URL atual |
| Usando API para Monitorar IPSec da Palo Alto (pt-BR) | `/pt-BR/posts/usando-api-para-monitorar-ipsec-da-palo-alto/` | **URL antiga — só funciona via redirect hoje** |

Os outros 7 links (Integrating/Integrando Backstage Azure DevOps, Authentication/Autenticação Backstage Entra ID, Fortinet vs Palo Alto en/pt-BR) não foram abertos individualmente, mas seguem o mesmo padrão de link único por post — cobertos pela tabela de redirects da seção 4, que já inclui todas as variantes antigas desses mesmos posts.

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

## 8. Próximo passo

Fase 2 (protótipo) pronta para revisão visual. Após aprovação: Fase 3 — migração dos 16 posts reais, páginas de tag/categoria completas, giscus, Pagefind, tabela de redirects aplicada.
