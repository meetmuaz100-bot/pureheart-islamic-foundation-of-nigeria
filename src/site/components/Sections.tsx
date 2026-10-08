import { Button, Eyebrow, Img, Paragraphs, Text, useEdit } from '../edit';
import { Icon } from '../icons';
import type { SectionProps } from './shared';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Item = Record<string, any>;

function SectionHead({ p, center }: { p: Item; center?: boolean }) {
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

export function Hero({ section }: SectionProps) {
  const edit = useEdit();
  const p = section.props;
  const v = section.variant ?? 'split';
  const copy = (
    <div className="wf-hero-copy">
      <Eyebrow value={p.eyebrow} />
      <Text path="headline" value={p.headline} as="h1" className="wf-h1" />
      <Text path="subheadline" value={p.subheadline} as="p" className="wf-lead" optional />
      <div className="wf-actions">
        <Button path="primaryCta" value={p.primaryCta} />
        <Button path="secondaryCta" value={p.secondaryCta} kind="secondary" />
      </div>
    </div>
  );
  if (v === 'fullbleed') {
    return (
      <div className="wf-hero-full">
        <Img path="image" value={p.image} className="wf-hero-bg" />
        <div className="wf-hero-overlay" />
        <div className="wf-container wf-hero-full-inner">{copy}</div>
      </div>
    );
  }
  if (v === 'centered') {
    return (
      <div className="wf-container wf-hero-centered">
        {copy}
        {p.image?.url || edit ? <Img path="image" value={p.image} className="wf-hero-wide" /> : null}
      </div>
    );
  }
  return (
    <div className="wf-container wf-hero-split">
      {copy}
      <Img path="image" value={p.image} className="wf-hero-img" />
    </div>
  );
}

export function Highlights({ section }: SectionProps) {
  const p = section.props;
  return (
    <div className="wf-container wf-highlights">
      <Text path="heading" value={p.heading} as="p" className="wf-highlights-label" optional />
      <ul>
        {(p.items ?? []).map((it: Item, i: number) => (
          <li key={i}><Text path={`items.${i}.text`} value={it.text} /></li>
        ))}
      </ul>
    </div>
  );
}

export function Features({ section }: SectionProps) {
  const p = section.props;
  const v = section.variant ?? 'cards';
  return (
    <div className="wf-container">
      <SectionHead p={p} center={section.styles.align === 'center'} />
      <div className={`wf-features wf-features-${v}`}>
        {(p.items ?? []).map((it: Item, i: number) => (
          <article key={i} className="wf-feature">
            {v === 'imageCards' ? <Img path={`items.${i}.image`} value={it.image} className="wf-feature-img" /> : (
              <span className="wf-icon-badge"><Icon name={it.icon} /></span>
            )}
            <div>
              <Text path={`items.${i}.title`} value={it.title} as="h3" className="wf-h3" />
              <Text path={`items.${i}.description`} value={it.description} as="p" className="wf-muted" optional />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function About({ section }: SectionProps) {
  const p = section.props;
  const v = section.variant ?? 'imageRight';
  return (
    <div className={`wf-container wf-about ${v === 'imageLeft' ? 'wf-about-left' : ''}`}>
      <div className="wf-about-copy">
        <Eyebrow value={p.eyebrow} />
        <Text path="heading" value={p.heading} as="h2" className="wf-h2" />
        <Paragraphs path="body" value={p.body} className="wf-body" />
        {p.bullets?.length ? (
          <ul className="wf-checks">
            {p.bullets.map((b: Item, i: number) => (
              <li key={i}><Icon name="check" size={18} /><Text path={`bullets.${i}.text`} value={b.text} /></li>
            ))}
          </ul>
        ) : null}
        <div className="wf-actions"><Button path="cta" value={p.cta} kind="secondary" /></div>
      </div>
      <Img path="image" value={p.image} className="wf-about-img" />
    </div>
  );
}

export function Stats({ section }: SectionProps) {
  const p = section.props;
  return (
    <div className="wf-container">
      <Text path="heading" value={p.heading} as="h2" className="wf-h2 wf-center" optional />
      <dl className="wf-stats">
        {(p.items ?? []).map((it: Item, i: number) => (
          <div key={i}>
            <Text path={`items.${i}.value`} value={it.value} as="dt" className="wf-stat-value" />
            <Text path={`items.${i}.label`} value={it.label} as="dd" className="wf-muted" />
          </div>
        ))}
      </dl>
    </div>
  );
}

export function Steps({ section }: SectionProps) {
  const p = section.props;
  return (
    <div className="wf-container">
      <SectionHead p={p} center={section.styles.align === 'center'} />
      <ol className="wf-steps">
        {(p.items ?? []).map((it: Item, i: number) => (
          <li key={i}>
            <span className="wf-step-num">{String(i + 1).padStart(2, '0')}</span>
            <Text path={`items.${i}.title`} value={it.title} as="h3" className="wf-h3" />
            <Text path={`items.${i}.description`} value={it.description} as="p" className="wf-muted" optional />
          </li>
        ))}
      </ol>
    </div>
  );
}

export function Team({ section }: SectionProps) {
  const p = section.props;
  return (
    <div className="wf-container">
      <SectionHead p={p} center={section.styles.align === 'center'} />
      <div className="wf-team">
        {(p.members ?? []).map((m: Item, i: number) => (
          <article key={i} className="wf-member">
            <Img path={`members.${i}.image`} value={m.image} className="wf-member-img" />
            <Text path={`members.${i}.name`} value={m.name} as="h3" className="wf-h3" />
            <Text path={`members.${i}.role`} value={m.role} as="p" className="wf-member-role" />
            <Text path={`members.${i}.bio`} value={m.bio} as="p" className="wf-muted" optional />
          </article>
        ))}
      </div>
    </div>
  );
}

export function Testimonials({ section }: SectionProps) {
  const p = section.props;
  const single = section.variant === 'single';
  const items: Item[] = single ? (p.items ?? []).slice(0, 1) : p.items ?? [];
  return (
    <div className="wf-container">
      <SectionHead p={p} center />
      <div className={single ? 'wf-quote-single' : 'wf-quotes'}>
        {items.map((it, i) => (
          <figure key={i} className="wf-quote">
            <blockquote><Text path={`items.${i}.quote`} value={it.quote} as="p" /></blockquote>
            <figcaption>
              <Text path={`items.${i}.name`} value={it.name} as="strong" />
              <Text path={`items.${i}.role`} value={it.role} as="span" className="wf-muted" optional />
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

export function Pricing({ section }: SectionProps) {
  const p = section.props;
  return (
    <div className="wf-container">
      <SectionHead p={p} center />
      <div className="wf-plans">
        {(p.plans ?? []).map((plan: Item, i: number) => (
          <article key={i} className={`wf-plan ${plan.featured ? 'wf-plan-featured' : ''}`}>
            <Text path={`plans.${i}.name`} value={plan.name} as="h3" className="wf-h3" />
            <Text path={`plans.${i}.description`} value={plan.description} as="p" className="wf-muted" optional />
            <p className="wf-price">
              <Text path={`plans.${i}.price`} value={plan.price} />
              <Text path={`plans.${i}.period`} value={plan.period} className="wf-muted wf-period" optional />
            </p>
            <ul className="wf-checks">
              {String(plan.features ?? '').split('\n').filter(Boolean).map((f, j) => (
                <li key={j}><Icon name="check" size={18} /><span>{f}</span></li>
              ))}
            </ul>
            <Button path={`plans.${i}.cta`} value={plan.cta} kind={plan.featured ? 'primary' : 'secondary'} className="wf-btn-block" />
          </article>
        ))}
      </div>
    </div>
  );
}

export function Faq({ section }: SectionProps) {
  const p = section.props;
  const two = section.variant === 'twoColumn';
  const edit = useEdit();
  return (
    <div className={`wf-container ${two ? 'wf-faq-two' : 'wf-narrow'}`}>
      <SectionHead p={p} center={!two} />
      <div className="wf-faq">
        {(p.items ?? []).map((it: Item, i: number) => (
          <details key={i} open={Boolean(edit) || undefined}>
            <summary><Text path={`items.${i}.question`} value={it.question} /></summary>
            <Text path={`items.${i}.answer`} value={it.answer} as="p" className="wf-muted" />
          </details>
        ))}
      </div>
    </div>
  );
}

export function Gallery({ section }: SectionProps) {
  const p = section.props;
  return (
    <div className="wf-container">
      <SectionHead p={p} center={section.styles.align === 'center'} />
      <div className={`wf-gallery wf-gallery-${section.variant ?? 'grid'}`}>
        {(p.images ?? []).map((it: Item, i: number) => (
          <figure key={i}>
            <Img path={`images.${i}.image`} value={it.image} />
            <Text path={`images.${i}.caption`} value={it.caption} as="figcaption" className="wf-muted" optional />
          </figure>
        ))}
      </div>
    </div>
  );
}

export function Menu({ section }: SectionProps) {
  const p = section.props;
  const items: Item[] = p.items ?? [];
  const categories = Array.from(new Set(items.map((it) => it.category || 'Menu')));
  return (
    <div className="wf-container">
      <SectionHead p={p} center />
      <div className="wf-menu">
        {categories.map((cat) => (
          <div key={cat} className="wf-menu-cat">
            <h3 className="wf-h3 wf-menu-cat-title">{cat}</h3>
            {items.map((it, i) => it.category === cat || (!it.category && cat === 'Menu') ? (
              <div key={i} className="wf-menu-item">
                <div className="wf-menu-row">
                  <Text path={`items.${i}.name`} value={it.name} as="span" className="wf-menu-name" />
                  <span className="wf-menu-dots" />
                  <Text path={`items.${i}.price`} value={it.price} as="span" className="wf-menu-price" optional />
                </div>
                <Text path={`items.${i}.description`} value={it.description} as="p" className="wf-muted" optional />
              </div>
            ) : null)}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Content({ section }: SectionProps) {
  const p = section.props;
  return (
    <div className="wf-container wf-narrow">
      <Eyebrow value={p.eyebrow} />
      <Text path="heading" value={p.heading} as="h2" className="wf-h2" optional />
      <Paragraphs path="body" value={p.body} className="wf-body" />
    </div>
  );
}

export function Cta({ section }: SectionProps) {
  const p = section.props;
  const split = section.variant === 'split';
  return (
    <div className={`wf-container ${split ? 'wf-cta-split' : 'wf-cta-banner'}`}>
      <div>
        <Text path="heading" value={p.heading} as="h2" className="wf-h2" />
        <Text path="body" value={p.body} as="p" className="wf-lead" optional />
      </div>
      <div className="wf-actions">
        <Button path="primaryCta" value={p.primaryCta} />
        <Button path="secondaryCta" value={p.secondaryCta} kind="secondary" />
      </div>
    </div>
  );
}

export function Contact({ section }: SectionProps) {
  const p = section.props;
  const id = section.id.slice(0, 6);
  const action = p.formAction || (p.email ? `mailto:${p.email}` : undefined);
  return (
    <div className="wf-container wf-contact">
      <div>
        <Eyebrow value={p.eyebrow} />
        <Text path="heading" value={p.heading} as="h2" className="wf-h2" />
        <Text path="intro" value={p.intro} as="p" className="wf-lead" optional />
        <dl className="wf-contact-list">
          {p.email ? <div><dt>Email</dt><dd><a href={`mailto:${p.email}`}><Text path="email" value={p.email} /></a></dd></div> : null}
          {p.phone ? <div><dt>Phone</dt><dd><a href={`tel:${String(p.phone).replace(/\s/g, '')}`}><Text path="phone" value={p.phone} /></a></dd></div> : null}
          {p.address ? <div><dt>Address</dt><dd><Text path="address" value={p.address} className="wf-prewrap" /></dd></div> : null}
          {p.hours ? <div><dt>Hours</dt><dd><Text path="hours" value={p.hours} className="wf-prewrap" /></dd></div> : null}
        </dl>
      </div>
      {p.formEnabled ? (
        <form className="wf-form" action={action} method="post" encType={p.formAction ? undefined : 'text/plain'}>
          <label htmlFor={`${id}-name`}>Name</label>
          <input id={`${id}-name`} name="name" autoComplete="name" required />
          <label htmlFor={`${id}-email`}>Email</label>
          <input id={`${id}-email`} name="email" type="email" autoComplete="email" required />
          <label htmlFor={`${id}-msg`}>Message</label>
          <textarea id={`${id}-msg`} name="message" rows={5} required />
          <button type="submit" className="wf-btn wf-btn-primary">{p.submitLabel || 'Send'}</button>
        </form>
      ) : null}
    </div>
  );
}
