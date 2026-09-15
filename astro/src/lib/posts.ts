import { getCollection, type CollectionEntry } from 'astro:content';

export type Locale = 'en' | 'pt-BR';

// O glob loader usa o path relativo (sem extensão) como id, ex.
// "en/creating-your-own-custom-lld-in-zabbix". O primeiro segmento é o
// idioma; o resto é o slug que vira a URL e vincula o par de traduções
// (ver src/content/posts convenção em migration/00-inventory.md).
//
// O loader normaliza o id para minúsculo (pasta "pt-BR/" no disco vira
// id "pt-br/..."), por isso a comparação abaixo é case-insensitive — o
// valor "pt-BR" continua sendo o Locale canônico usado no resto do código
// (URLs, atributo lang, etc.).
export function localeFromId(id: string): Locale {
  return id.toLowerCase().startsWith('pt-br/') ? 'pt-BR' : 'en';
}

export function slugFromId(id: string): string {
  return id.split('/').slice(1).join('/');
}

export async function getPostsByLocale(locale: Locale) {
  const all = await getCollection('posts');
  return all
    .filter((entry) => localeFromId(entry.id) === locale && !entry.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getPostBySlug(locale: Locale, slug: string) {
  const posts = await getPostsByLocale(locale);
  return posts.find((entry) => slugFromId(entry.id) === slug) ?? null;
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'en' ? 'pt-BR' : 'en';
}

export async function getTranslation(entry: CollectionEntry<'posts'>) {
  const slug = slugFromId(entry.id);
  const locale = otherLocale(localeFromId(entry.id));
  return getPostBySlug(locale, slug);
}
