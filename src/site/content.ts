import type { ContentCollection, ContentEntry, Page, Section, SectionSource, SiteDoc } from './types';

/** Which prop holds the cards for each section type that can show a collection. */
export const LIST_KEYS: Record<string, string> = {
  features: 'items',
  team: 'members',
  testimonials: 'items',
  gallery: 'images',
  menu: 'items',
  faq: 'items',
  cards: 'items',
  blogList: 'posts',
};

export function findCollection(doc: SiteDoc, id: string | undefined): ContentCollection | undefined {
  return id ? doc.content?.find((c) => c.id === id) : undefined;
}

export function blogCollection(doc: SiteDoc): ContentCollection | undefined {
  return doc.content?.find((c) => c.kind === 'blog');
}

/** Published entries in display order (blogs newest first). */
export function visibleEntries(collection: ContentCollection, sort?: SectionSource['sort']): ContentEntry[] {
  const now = Date.now();
  const list = collection.entries.filter((e) => e.status === 'published' && (!e.publishedAt || new Date(e.publishedAt).getTime() <= now));
  const newest = sort === 'newest' || (sort !== 'manual' && collection.kind === 'blog');
  return [...list].sort((a, b) =>
    newest ? new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime() : a.position - b.position,
  );
}

export function postPath(collection: ContentCollection, entry: ContentEntry) {
  return `/${collection.slug}/${entry.slug}`;
}

/**
 * Returns the section to render: if it shows a collection, its card list is
 * replaced by the collection's entries. Inline cards stay as the fallback
 * when the collection is missing (e.g. in a template or duplicated site).
 */
export function resolveSection(section: Section, doc: SiteDoc): { section: Section; collection?: ContentCollection } {
  const source = section.props.source as SectionSource | undefined;
  const key = LIST_KEYS[section.type];
  // Blog post lists default to the website's blog.
  const collection = findCollection(doc, source?.collectionId) ?? (section.type === 'blogList' ? blogCollection(doc) : undefined);
  if (!key || !collection) return { section };
  let entries = visibleEntries(collection, source?.sort);
  if (source?.limit) entries = entries.slice(0, source.limit);
  const items = entries.map((e) =>
    collection.kind === 'blog'
      ? { ...e.data, title: e.data.title ?? e.title, href: postPath(collection, e), date: e.publishedAt }
      : { ...e.data },
  );
  return { section: { ...section, props: { ...section.props, [key]: items } }, collection };
}

export type Route =
  | { kind: 'page'; page: Page }
  | { kind: 'post'; collection: ContentCollection; entry: ContentEntry };

/** Resolves a path ("/about", "/blog/my-post") to a page or a blog post. */
export function resolveRoute(doc: SiteDoc, path: string): Route {
  const page = doc.pages.find((p) => p.slug === path);
  if (page) return { kind: 'page', page };
  const [, first, second] = path.split('/');
  if (first && second) {
    const collection = doc.content?.find((c) => c.kind === 'blog' && c.slug === first);
    const entry = collection && visibleEntries(collection).find((e) => e.slug === second);
    if (collection && entry) return { kind: 'post', collection, entry };
  }
  return { kind: 'page', page: doc.pages[0] };
}

export function formatDate(iso: string | null | undefined, lang = 'en') {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString(lang, { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return '';
  }
}
