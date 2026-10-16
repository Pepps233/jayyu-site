import { getCollection, type CollectionEntry } from 'astro:content';

export const BLOG_LANGUAGES = ['en', 'zh'] as const;

export type BlogLanguage = (typeof BLOG_LANGUAGES)[number];
export type BlogPostEntry = CollectionEntry<'blog'>;
export type BlogTranslationMap = Partial<Record<BlogLanguage, BlogPostEntry>>;

export interface BlogPostGroup {
  slug: string;
  defaultLanguage: BlogLanguage;
  defaultPost: BlogPostEntry;
  translations: BlogTranslationMap;
  languages: BlogLanguage[];
}

export interface BlogLanguageMeta {
  language: BlogLanguage;
  label: string;
  title: string;
  description: string;
  entry: BlogPostEntry;
}

export const BLOG_LANGUAGE_LABELS: Record<BlogLanguage, string> = {
  en: 'English',
  zh: '中文',
};

const languageSet = new Set<string>(BLOG_LANGUAGES);

function isBlogLanguage(value: unknown): value is BlogLanguage {
  return typeof value === 'string' && languageSet.has(value);
}

export function getPostLanguage(post: BlogPostEntry): BlogLanguage {
  return isBlogLanguage(post.data.language) ? post.data.language : 'en';
}

export function getPostDefaultLanguage(post: BlogPostEntry): BlogLanguage {
  return isBlogLanguage(post.data.defaultLanguage) ? post.data.defaultLanguage : getPostLanguage(post);
}

export function getPostSlug(post: BlogPostEntry): string {
  const rawSlug = post.data.translationKey || post.id.replace(/\.(en|zh)$/i, '');
  return rawSlug.replace(/^\/+|\/+$/g, '').toLowerCase();
}

export function getPostHref(group: BlogPostGroup): string {
  return `/blog/${group.slug}/`;
}

export function getBlogLanguageMeta(group: BlogPostGroup): BlogLanguageMeta[] {
  return group.languages
    .map((language) => {
      const entry = group.translations[language];

      if (!entry) {
        return null;
      }

      return {
        language,
        label: BLOG_LANGUAGE_LABELS[language],
        title: entry.data.title,
        description: entry.data.description,
        entry,
      };
    })
    .filter((item): item is BlogLanguageMeta => Boolean(item));
}

export async function getBlogPostGroups(): Promise<BlogPostGroup[]> {
  const posts = await getCollection('blog');
  const groups = new Map<
    string,
    {
      defaultLanguage?: BlogLanguage;
      translations: BlogTranslationMap;
    }
  >();

  for (const post of posts) {
    const slug = getPostSlug(post);
    const language = getPostLanguage(post);
    const existing = groups.get(slug) ?? { translations: {} };

    existing.defaultLanguage = existing.defaultLanguage ?? getPostDefaultLanguage(post);
    existing.translations[language] = post;
    groups.set(slug, existing);
  }

  return [...groups.entries()]
    .map(([slug, group]) => {
      const languages = BLOG_LANGUAGES.filter((language) => Boolean(group.translations[language]));
      const defaultLanguage = group.defaultLanguage ?? languages[0] ?? 'en';
      const defaultPost =
        group.translations[defaultLanguage] ??
        group.translations.en ??
        group.translations.zh ??
        posts[0];

      return {
        slug,
        defaultLanguage,
        defaultPost,
        translations: group.translations,
        languages,
      };
    })
    .filter((group): group is BlogPostGroup => Boolean(group.defaultPost))
    .sort((a, b) => +b.defaultPost.data.pubDate - +a.defaultPost.data.pubDate);
}
