import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPostsByLocale, slugFromId } from '../../lib/posts';

export async function GET(context: APIContext) {
  const posts = await getPostsByLocale('pt-BR');
  return rss({
    title: 'Luiz Meier',
    description: 'Explorando tecnologia, um pacote de cada vez',
    site: context.site!,
    items: posts.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.date,
      link: `/pt-BR/posts/${slugFromId(entry.id)}/`
    }))
  });
}
