// The structured website model. This folder (src/site) is self-contained and
// is copied verbatim into exported projects, so it may only depend on React.

export interface ImageValue {
  url: string;
  alt: string;
  /** Search query used to source the image (kept so it can be re-searched). */
  query?: string;
  credit?: string;
  creditUrl?: string;
  /** Object-position focal point, 0-100. */
  focalX?: number;
  focalY?: number;
}

export interface LinkValue {
  label: string;
  href: string;
}

export interface DesignSystem {
  colors: {
    primary: string;
    primaryText: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    muted: string;
    border: string;
    dark: string;
    darkText: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    headingWeight: number;
    /** Multiplier applied to heading sizes. */
    scale: number;
    headingCase: 'none' | 'uppercase';
  };
  spacing: {
    /** Vertical section padding in px (desktop). */
    section: number;
    /** Max content width in px. */
    container: number;
  };
  radius: {
    base: number;
    button: number;
  };
  shadows: {
    level: 'none' | 'soft' | 'strong';
  };
}

export type SectionBackground = 'default' | 'surface' | 'primary' | 'dark' | (string & {});

export interface SectionStyles {
  background?: SectionBackground;
  paddingY?: 'compact' | 'normal' | 'spacious';
  align?: 'left' | 'center';
  hidden?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Props = Record<string, any>;

export interface Section {
  id: string;
  type: string;
  variant?: string;
  props: Props;
  styles: SectionStyles;
}

export interface PageSeo {
  title: string;
  description: string;
  ogImage?: string;
}

export interface Page {
  id: string;
  name: string;
  slug: string; // "/" for home, "/about" etc.
  seo: PageSeo;
  sections: Section[];
}

export interface SiteMetadata {
  businessName: string;
  tagline?: string;
  siteUrl?: string;
  lang?: string;
}

export interface SiteDoc {
  name: string;
  metadata: SiteMetadata;
  design: DesignSystem;
  globals: {
    header: Section;
    footer: Section;
  };
  pages: Page[];
}
