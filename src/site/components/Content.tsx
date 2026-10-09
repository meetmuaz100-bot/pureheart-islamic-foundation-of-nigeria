import type { CSSProperties } from 'react';
import { formatDate, postPath, visibleEntries } from '../content';
import { Button, Eyebrow, Img, Text, useEdit } from '../edit';
import { useResolveHref } from '../links';
import type { ContentCollection, ContentEntry, SiteDoc } from '../types';
import type { SectionProps } from './shared';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Item = Record<string, any>;

function Head({ p, center }: { p: Item; center?: boolean }) {
  const edit = useEdit();
  if (!p.eyebrow && !p.heading && !p.intro && !edit) return null;
  return (
    <header className={`wf-head ${center ? 'wf-center' : ''}`}>
      <Eyebrow value={p.eyebrow} />
      <Text path="heading" value={p.heading} as="h2" className="wf-h2" optional />
      <Text path="intro" value={p.intro} as="p" className="wf-lead" optional />
    </header>
  );
}

export function Cards({ section }: SectionProps) {
  const p = section.props;
  const list = section.variant === 'list';
  return (
    <div className="wf-container">
      <Head p={p} center={section.styles.align === 'center'} />
      <div className={list ? 'wf-cards-list' : 'wf-cards'}>
        {(p.items ?? []).map((it: Item, i: number) => (
          <article key={i} className="wf-card">
            <Img path={`items.${i}.image`} value={it.image} className="wf-card-img" />
            <div className="wf-card-body">
              <Text path={`items.${i}.meta`} value={it.meta} as="p" className="wf-card-meta" optional />
              <Text path={`items.${i}.title`} value={it.title} as="h3" className="wf-h3" />
              <Text path={`items.${i}.description`} value={it.description} as="p" className="wf-muted" optional />
              <Button path={`items.${i}.link`} value={it.link} kind="ghost" className="wf-card-link" />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function PostCard({ post, lang }: { post: Item; lang?: string }) {
  const href = useResolveHref();
  return (
    <article className="wf-post-card">
      <a href={href(post.href)} className="wf-post-card-link" aria-label={post.title} />
      {post.cover?.url ? <Img path="" value={post.cover} className="wf-post-cover" /> : null}
      <div className="wf-post-body">
        <p className="wf-card-meta">{formatDate(post.date, lang)}{post.author ? ` · ${post.author}` : ''}</p>
        <h3 className="wf-h3">{post.title}</h3>
        {post.excerpt ? <p className="wf-muted">{post.excerpt}</p> : null}
      </div>
    </article>
  );
}

export function BlogList({ section, doc }: SectionProps) {
  const p = section.props;
  const edit = useEdit();
  const posts: Item[] = p.posts ?? [];
  return (
    <div className="wf-container">
      <Head p={p} center={section.styles.align === 'center'} />
      {posts.length ? (
        <div className={section.variant === 'list' ? 'wf-posts-list' : 'wf-posts'}>
          {posts.map((post, i) => <PostCard key={i} post={post} lang={doc.metadata.lang} />)}
        </div>
      ) : edit ? (
        <p className="wf-muted wf-empty-note">No published posts yet. Write one in the Content tab.</p>
      ) : null}
    </div>
  );
}

/** Full page for a single blog post. */
export function BlogPost({ doc, collection, entry }: { doc: SiteDoc; collection: ContentCollection; entry: ContentEntry }) {
  const href = useResolveHref();
  const d = entry.data;
  const more = visibleEntries(collection).filter((e) => e.id !== entry.id).slice(0, 3);
  const tags: string[] = String(d.tags ?? '').split(',').map((t) => t.trim()).filter(Boolean);
  return (
    <>
      <article className="wf-section wf-post" data-tone="light">
        <div className="wf-container wf-post-container">
          <a href={href(`/${collection.slug}`)} className="wf-post-back">← {collection.name}</a>
          <h1 className="wf-h1 wf-post-title">{d.title || entry.title}</h1>
          <p className="wf-card-meta">{formatDate(entry.publishedAt, doc.metadata.lang)}{d.author ? ` · ${d.author}` : ''}</p>
          {d.excerpt ? <p className="wf-lead">{d.excerpt}</p> : null}
        </div>
        {d.cover?.url ? (
          <div className="wf-container wf-post-cover-wrap"><Img path="" value={d.cover} className="wf-post-hero" /></div>
        ) : null}
        <div className="wf-container wf-post-container">
          <div className="wf-prose" dangerouslySetInnerHTML={{ __html: entry.body }} />
          {tags.length ? <ul className="wf-tags">{tags.map((t) => <li key={t}>{t}</li>)}</ul> : null}
        </div>
      </article>
      {more.length ? (
        <section className="wf-section wf-s-blogList" data-tone="light" style={{ background: 'var(--wf-surface)', '--wf-pad': 'var(--wf-section-y)' } as CSSProperties}>
          <div className="wf-container">
            <header className="wf-head"><h2 className="wf-h2">More articles</h2></header>
            <div className="wf-posts">
              {more.map((e) => (
                <PostCard key={e.id} lang={doc.metadata.lang} post={{ ...e.data, title: e.data.title ?? e.title, href: postPath(collection, e), date: e.publishedAt }} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
