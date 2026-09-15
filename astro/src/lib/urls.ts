import type { Locale } from './posts';

// Substitui astro:i18n (getRelativeLocaleUrl): o roteamento nativo do
// Astro 7.3.2 tem um bug conhecido (github.com/withastro/astro/issues/16386)
// onde uma rota cujo path começa com um locale configurado colide
// incorretamente com a rota do idioma padrão, descartando o prefixo.
// Implementação manual simples evita depender dessa feature.
export function localeUrl(locale: Locale, path: string): string {
  const prefix = locale === 'en' ? '' : `/${locale}`;
  return `${prefix}${path}`;
}
