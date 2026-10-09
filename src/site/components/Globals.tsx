import { Button, Img, Text } from '../edit';
import { useResolveHref } from '../links';
import type { LinkValue, Page, SiteDoc } from '../types';
import type { SectionProps } from './shared';

function navLinks(links: LinkValue[] | undefined, pages: Page[]): LinkValue[] {
  if (links && links.length) return links;
  return pages.map((p) => ({ label: p.name, href: p.slug }));
}

/**
 * The site logo. A logo image set on the section wins; otherwise the brand
 * logo kit is used, switching to the white version on dark sections.
 */
function Logo({ props, doc, scale = 1 }: { props: SectionProps['section']['props']; doc: SiteDoc; scale?: number }) {
  const href = useResolveHref();
  const brand = doc.metadata.brand;
  const name = doc.metadata.businessName || props.logoText;
  let content;
  if (props.logoImage?.url) {
    content = <Img path="logoImage" value={props.logoImage} className="wf-logo-img" />;
  } else if (brand?.logo) {
    const h = Math.round((brand.logoHeight || 40) * scale);
    const w = Math.round((brand.width / brand.height) * h);
    content = (
      <span className="wf-brand-logo" style={{ height: h }}>
        <img src={brand.logo} alt={name} width={w} height={h} className="wf-logo-on-light" />
        <img src={brand.logoLight} alt={name} width={w} height={h} className="wf-logo-on-dark" />
      </span>
    );
  } else {
    content = <Text path="logoText" value={props.logoText} />;
  }
  return <a href={href('/')} className="wf-logo" aria-label={brand?.logo ? name : undefined}>{content}</a>;
}

export function Navbar({ section, doc, page }: SectionProps) {
  const href = useResolveHref();
  const p = section.props;
  const links = navLinks(p.links, doc.pages);
  const isCustom = Boolean(p.links?.length);
  const linkEls = links.map((l, i) => (
    <a key={i} href={href(l.href)} className="wf-nav-link" aria-current={page?.slug === l.href ? 'page' : undefined}>
      {isCustom ? <Text path={`links.${i}.label`} value={l.label} /> : l.label}
    </a>
  ));
  return (
    <div className="wf-container wf-nav-inner">
      <Logo props={p} doc={doc} />
      <nav className="wf-nav-links" aria-label="Main">{linkEls}</nav>
      <div className="wf-nav-cta"><Button path="cta" value={p.cta} /></div>
      <details className="wf-nav-mobile">
        <summary aria-label="Open menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
        </summary>
        <nav className="wf-nav-mobile-panel" aria-label="Mobile">
          {linkEls}
          <Button path="cta" value={p.cta} />
        </nav>
      </details>
    </div>
  );
}

export function Footer({ section, doc }: SectionProps) {
  const href = useResolveHref();
  const p = section.props;
  const links = navLinks(p.links, doc.pages);
  const isCustom = Boolean(p.links?.length);
  const year = new Date().getFullYear();
  return (
    <div className="wf-container">
      <div className="wf-footer-top">
        <div className="wf-footer-brand">
          <Logo props={p} doc={doc} scale={0.85} />
          <Text path="tagline" value={p.tagline} as="p" className="wf-muted" optional />
        </div>
        <nav className="wf-footer-links" aria-label="Footer">
          {links.map((l, i) => (
            <a key={i} href={href(l.href)}>{isCustom ? <Text path={`links.${i}.label`} value={l.label} /> : l.label}</a>
          ))}
        </nav>
        {p.social?.length ? (
          <div className="wf-footer-links">
            {p.social.map((s: LinkValue, i: number) => (
              <a key={i} href={s.href} target="_blank" rel="noreferrer"><Text path={`social.${i}.label`} value={s.label} /></a>
            ))}
          </div>
        ) : null}
      </div>
      <div className="wf-footer-bottom wf-muted">
        <Text path="legal" value={p.legal || `© ${year} ${doc.metadata.businessName}. All rights reserved.`} />
      </div>
    </div>
  );
}
