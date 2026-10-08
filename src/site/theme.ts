import type { CSSProperties } from 'react';
import type { DesignSystem, SectionStyles } from './types';

const SHADOWS = {
  none: 'none',
  soft: '0 1px 2px rgb(0 0 0 / 0.04), 0 8px 24px -8px rgb(0 0 0 / 0.10)',
  strong: '0 2px 4px rgb(0 0 0 / 0.06), 0 20px 48px -12px rgb(0 0 0 / 0.25)',
};

const SERIF = ['Playfair Display', 'DM Serif Display', 'Cormorant Garamond', 'Fraunces', 'Libre Baskerville', 'Lora', 'EB Garamond'];

const fontStack = (font: string) => `"${font}", ${SERIF.includes(font) ? 'Georgia, serif' : 'system-ui, sans-serif'}`;

/** Design tokens become CSS custom properties on the site root. */
export function themeVars(d: DesignSystem): CSSProperties {
  return {
    '--wf-primary': d.colors.primary,
    '--wf-primary-text': d.colors.primaryText,
    '--wf-accent': d.colors.accent,
    '--wf-bg': d.colors.background,
    '--wf-surface': d.colors.surface,
    '--wf-text': d.colors.text,
    '--wf-muted': d.colors.muted,
    '--wf-border': d.colors.border,
    '--wf-dark': d.colors.dark,
    '--wf-dark-text': d.colors.darkText,
    '--wf-font-heading': fontStack(d.typography.headingFont),
    '--wf-font-body': fontStack(d.typography.bodyFont),
    '--wf-heading-weight': String(d.typography.headingWeight),
    '--wf-scale': String(d.typography.scale),
    '--wf-heading-case': d.typography.headingCase,
    '--wf-section-y': `${d.spacing.section}px`,
    '--wf-container': `${d.spacing.container}px`,
    '--wf-radius': `${d.radius.base}px`,
    '--wf-radius-btn': `${d.radius.button}px`,
    '--wf-shadow': SHADOWS[d.shadows.level] ?? SHADOWS.soft,
  } as CSSProperties;
}

export function fontsHref(d: DesignSystem): string {
  const families = Array.from(new Set([d.typography.headingFont, d.typography.bodyFont]));
  const q = families
    .map((f) => `family=${f.replace(/ /g, '+')}:wght@400;500;600;700`)
    .join('&');
  return `https://fonts.googleapis.com/css2?${q}&display=swap`;
}

function luminance(hex: string): number {
  const m = hex.replace('#', '').match(/^([0-9a-f]{6}|[0-9a-f]{3})$/i);
  if (!m) return 1;
  let h = m[1];
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(h.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export const isDark = (hex: string) => luminance(hex) < 0.4;

/**
 * Resolves a section's background into inline CSS vars. Dark backgrounds flip
 * the text/muted/border tokens so every component stays readable.
 */
export function sectionStyle(styles: SectionStyles, d: DesignSystem): { style: CSSProperties; tone: 'light' | 'dark' } {
  const bg = styles.background ?? 'default';
  let color: string;
  switch (bg) {
    case 'default': color = d.colors.background; break;
    case 'surface': color = d.colors.surface; break;
    case 'primary': color = d.colors.primary; break;
    case 'dark': color = d.colors.dark; break;
    default: color = bg;
  }
  const tone = isDark(color) ? 'dark' : 'light';
  const pad = { compact: 0.6, normal: 1, spacious: 1.4 }[styles.paddingY ?? 'normal'];
  const style: Record<string, string> = {
    '--wf-section-bg': color,
    '--wf-pad': `calc(var(--wf-section-y) * ${pad})`,
  };
  if (tone === 'dark' && isDark(color) !== isDark(d.colors.background)) {
    const fg = bg === 'primary' ? d.colors.primaryText : d.colors.darkText;
    style['--wf-text'] = fg;
    style['--wf-muted'] = `color-mix(in srgb, ${fg} 72%, transparent)`;
    style['--wf-border'] = `color-mix(in srgb, ${fg} 18%, transparent)`;
    style['--wf-surface'] = `color-mix(in srgb, ${fg} 7%, transparent)`;
  } else if (tone === 'light' && isDark(d.colors.background)) {
    style['--wf-text'] = '#111111';
    style['--wf-muted'] = '#555555';
    style['--wf-border'] = 'rgb(0 0 0 / 0.12)';
  }
  // Buttons on a primary-coloured section use the inverted pair so they stay visible.
  if (bg === 'primary') {
    style['--wf-primary'] = d.colors.primaryText;
    style['--wf-primary-text'] = d.colors.primary;
  }
  return { style: style as CSSProperties, tone };
}
