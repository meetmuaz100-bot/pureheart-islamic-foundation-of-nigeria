import type { ReactNode } from 'react';
import { BlogPost } from './components/Content';
import { resolveSection } from './content';
import { LinkBase } from './links';
import { REGISTRY } from './registry';
import { sectionStyle, themeVars } from './theme';
import type { ContentCollection, ContentEntry, Page, Section, SiteDoc } from './types';

export interface RendererHooks {
  /** Wraps each rendered section, e.g. to add selection chrome in the editor. */
  wrapSection?: (section: Section, node: ReactNode, where: 'header' | 'page' | 'footer') => ReactNode;
}

export function SectionView({ section: raw, doc, page, as = 'section' }: { section: Section; doc: SiteDoc; page?: Page; as?: 'section' | 'header' | 'footer' }) {
  // Sections bound to a CMS collection render the collection's entries.
  const { section } = resolveSection(raw, doc);
  const Component = REGISTRY[section.type];
  if (!Component) return null;
  const { style, tone } = sectionStyle(section.styles ?? {}, doc.design);
  const Tag = as;
  return (
    <Tag
      id={as === 'section' ? anchorFor(section, page) : undefined}
      className={`wf-section wf-s-${section.type} wf-v-${section.variant ?? 'default'} ${section.styles?.align === 'center' ? 'wf-align-center' : ''}`}
      data-tone={tone}
      style={style}
    >
      <Component section={section} doc={doc} page={page} />
    </Tag>
  );
}

/** The first section of each type gets the type as its anchor (e.g. "#about"). */
function anchorFor(section: Section, page?: Page): string | undefined {
  const first = page?.sections.find((s) => s.type === section.type);
  return first?.id === section.id ? section.type : undefined;
}

/**
 * basePath: where the site is served from, e.g. "/my-repo/" on GitHub Pages.
 * post: render a blog post page instead of `page`.
 */
export function SiteRenderer({ doc, page, post, hooks, basePath = '/' }: {
  doc: SiteDoc;
  page: Page;
  post?: { collection: ContentCollection; entry: ContentEntry };
  hooks?: RendererHooks;
  basePath?: string;
}) {
  const wrap = hooks?.wrapSection ?? ((_s: Section, n: ReactNode) => n);
  const { header, footer } = doc.globals;
  return (
    <LinkBase.Provider value={basePath}>
    <div className="wf-site" style={themeVars(doc.design)}>
      {!header.styles?.hidden && wrap(header, <SectionView section={header} doc={doc} page={page} as="header" />, 'header')}
      <main>
        {post ? <BlogPost doc={doc} collection={post.collection} entry={post.entry} /> : page.sections.map((s) =>
          s.styles?.hidden && !hooks ? null : (
            <div key={s.id} className={s.styles?.hidden ? 'wf-hidden-section' : undefined}>
              {wrap(s, <SectionView section={s} doc={doc} page={page} />, 'page')}
            </div>
          ),
        )}
      </main>
      {!footer.styles?.hidden && wrap(footer, <SectionView section={footer} doc={doc} page={page} as="footer" />, 'footer')}
    </div>
    </LinkBase.Provider>
  );
}
