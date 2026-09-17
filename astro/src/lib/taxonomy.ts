import { getPostsByLocale, type Locale } from './posts';

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // remove acentos
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function groupBy(locale: Locale, field: 'categories' | 'tags') {
  const posts = await getPostsByLocale(locale);
  const map = new Map<string, { name: string; slug: string; posts: typeof posts }>();
  for (const post of posts) {
    for (const name of post.data[field]) {
      const slug = slugify(name);
      const entry = map.get(slug) ?? { name, slug, posts: [] };
      entry.posts.push(post);
      map.set(slug, entry);
    }
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export const getCategories = (locale: Locale) => groupBy(locale, 'categories');
export const getTags = (locale: Locale) => groupBy(locale, 'tags');
