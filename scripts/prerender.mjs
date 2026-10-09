// Post-build step: one HTML file per page and blog post (correct
// <title>/description without JS), a 404 fallback, robots.txt, sitemap.xml
// and an RSS feed for the blog. SITE_URL is set by the
// GitHub Pages workflow; otherwise metadata.siteUrl from site.json is used.
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const doc = JSON.parse(readFileSync('src/site.json', 'utf8'));
const template = readFileSync('dist/index.html', 'utf8');
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const siteUrl = (process.env.SITE_URL || doc.metadata?.siteUrl || '').replace(/\/+$/, '');

function withMeta(html, { title, desc, url, image }) {
  let out = html
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${desc}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${title}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${desc}$2`)
    .replace(/\s*<link rel="canonical"[^>]*>/, '');
  if (url) out = out.replace('</head>', `  <link rel="canonical" href="${esc(url)}" />\n  </head>`);
  if (image) out = out.replace(/\s*<meta property="og:image"[^>]*>/, '').replace('</head>', `  <meta property="og:image" content="${esc(image)}" />\n  </head>`);
  return out;
}

const home = doc.pages.find((p) => p.slug === '/') ?? doc.pages[0];
writeFileSync('dist/index.html', withMeta(template, {
  title: esc(home.seo?.title || doc.metadata.businessName),
  desc: esc(home.seo?.description || ''),
  url: siteUrl ? `${siteUrl}/` : '',
}));

for (const page of doc.pages) {
  if (page === home) continue;
  const dir = join('dist', page.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), withMeta(template, {
    title: esc(page.seo?.title || page.name),
    desc: esc(page.seo?.description || ''),
    url: siteUrl ? `${siteUrl}${page.slug}` : '',
  }));
}

// Blog posts: published entries of the blog collection.
const blog = (doc.content ?? []).find((c) => c.kind === 'blog');
const now = Date.now();
const posts = blog
  ? blog.entries
      .filter((e) => e.status === 'published' && (!e.publishedAt || Date.parse(e.publishedAt) <= now))
      .sort((a, b) => Date.parse(b.publishedAt ?? 0) - Date.parse(a.publishedAt ?? 0))
  : [];
const postPath = (e) => `/${blog.slug}/${e.slug}`;
for (const e of posts) {
  const dir = join('dist', blog.slug, e.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), withMeta(template, {
    title: esc(e.data?.seoTitle || e.title),
    desc: esc(e.data?.seoDescription || e.data?.excerpt || ''),
    url: siteUrl ? `${siteUrl}${postPath(e)}` : '',
    image: e.data?.cover?.url || '',
  }));
}
if (blog && siteUrl && posts.length) {
  const items = posts.map((e) => `    <item>
      <title>${esc(e.title)}</title>
      <link>${esc(siteUrl + postPath(e))}</link>
      <guid>${esc(siteUrl + postPath(e))}</guid>
      ${e.publishedAt ? `<pubDate>${new Date(e.publishedAt).toUTCString()}</pubDate>` : ''}
      <description>${esc(e.data?.excerpt || '')}</description>
    </item>`).join('\n');
  writeFileSync('dist/rss.xml', `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${esc(doc.metadata.businessName)} — ${esc(blog.name)}</title>
    <link>${esc(siteUrl)}/${blog.slug}</link>
    <description>${esc(doc.metadata.tagline || '')}</description>
${items}
  </channel>
</rss>
`);
}

// Unknown paths still load the app (GitHub Pages serves 404.html).
copyFileSync('dist/index.html', 'dist/404.html');

writeFileSync('dist/robots.txt', `User-agent: *\nAllow: /\n${siteUrl ? `Sitemap: ${siteUrl}/sitemap.xml\n` : ''}`);
if (siteUrl) {
  const urls = [
    ...doc.pages.map((p) => `  <url><loc>${esc(siteUrl + (p.slug === '/' ? '/' : p.slug))}</loc></url>`),
    ...posts.map((e) => `  <url><loc>${esc(siteUrl + postPath(e))}</loc>${e.publishedAt ? `<lastmod>${e.publishedAt.slice(0, 10)}</lastmod>` : ''}</url>`),
  ].join('\n');
  writeFileSync('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
}
console.log('Prerendered', doc.pages.length, 'pages and', posts.length, 'posts', siteUrl ? `for ${siteUrl}` : '');
