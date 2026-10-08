import { useEffect, useState } from 'react';
import data from './site.json';
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

  const page = doc.pages.find((p) => p.slug === path) ?? doc.pages[0];

  useEffect(() => {
    document.title = page.seo.title || doc.metadata.businessName;
    setMeta('description', page.seo.description);
    setMeta('og:title', document.title, 'property');
    setMeta('og:description', page.seo.description, 'property');
  }, [page]);

  return <SiteRenderer doc={doc} page={page} basePath={BASE} />;
}
