import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPostsByLocale, slugFromId } from '../lib/posts';

export async function GET(context: APIContext) {
  const posts = await getPostsByLocale('en');
  return rss({
    title: 'Luiz Meier',
    description: 'Exploring Tech, One Packet at a Time',
    site: context.site!,
    items: posts.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.date,
      link: `/posts/${slugFromId(entry.id)}/`
    }))
  });
}
