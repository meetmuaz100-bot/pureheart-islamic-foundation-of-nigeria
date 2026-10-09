import { useEffect, useState } from 'react';
import data from './site.json';
import { resolveRoute } from './site/content';
import { SiteRenderer } from './site/SiteRenderer';
import type { SiteDoc } from './site/types';

const doc = data as SiteDoc;
// Where the site is served from: "/" at a domain root, "/my-repo/" on GitHub Pages.
const BASE = import.meta.env.BASE_URL;
const BASE_PREFIX = BASE.replace(/\/+$/, '');

function currentPath() {
  let p = window.location.pathname;
  if (BASE_PREFIX && p.startsWith(BASE_PREFIX)) p = p.slice(BASE_PREFIX.length);
  p = p.replace(/\/+$/, '');
  return p === '' ? '/' : p;
}

function setMeta(name: string, content: string, attr = 'name') {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.content = content;
}

export default function App() {
  const [path, setPath] = useState(currentPath);

  useEffect(() => {
    const onPop = () => setPath(currentPath());
    // Client-side navigation for internal links.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a');
      const href = a?.getAttribute('href');
      if (!a || !href || !href.startsWith('/') || href.startsWith('//') || a.target || e.metaKey || e.ctrlKey) return;
      e.preventDefault();
      window.history.pushState({}, '', href);
      setPath(currentPath());
      window.scrollTo(0, 0);
    };
    window.addEventListener('popstate', onPop);
    document.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('popstate', onPop);
      document.removeEventListener('click', onClick);
    };
  }, []);

  // A page ("/about") or a blog post ("/blog/my-post").
  const route = resolveRoute(doc, path);
  const page = route.kind === 'page' ? route.page : doc.pages[0];
  const post = route.kind === 'post' ? { collection: route.collection, entry: route.entry } : undefined;
  const title = post ? post.entry.data.seoTitle || post.entry.title : page.seo.title || doc.metadata.businessName;
  const description = post ? post.entry.data.seoDescription || post.entry.data.excerpt || '' : page.seo.description;

  useEffect(() => {
    document.title = title;
    setMeta('description', description);
    setMeta('og:title', title, 'property');
    setMeta('og:description', description, 'property');
  }, [title, description]);

  return <SiteRenderer doc={doc} page={page} post={post} basePath={BASE} />;
}
