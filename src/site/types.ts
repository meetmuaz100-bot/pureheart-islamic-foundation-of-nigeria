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

/** Logo kit generated from an uploaded logo (URLs). */
export interface BrandAssets {
  /** Logo for light backgrounds. */
  logo: string;
  /** White logo for dark backgrounds. */
  logoLight: string;
  /** Black logo. */
  logoDark: string;
  /** Square icon (transparent). */
  icon: string;
  favicon: { ico: string; png32: string; apple: string; png192: string; png512: string };
  width: number;
  height: number;
  colors: string[];
  /** Header logo height in px. */
  logoHeight: number;
}

export interface SiteMetadata {
  businessName: string;
  tagline?: string;
  siteUrl?: string;
  lang?: string;
  brand?: BrandAssets;
}

export type CollectionFieldType = 'text' | 'textarea' | 'image' | 'link' | 'icon' | 'date';

export interface CollectionField {
  key: string;
  label: string;
  type: CollectionFieldType;
}

export interface ContentEntry {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published';
  data: Props;
  /** Rich text HTML (blog posts). */
  body: string;
  position: number;
  publishedAt: string | null;
}

export interface ContentCollection {
  id: string;
  name: string;
  /** URL segment for blogs ("blog" -> /blog/<post-slug>). */
  slug: string;
  kind: 'blog' | 'custom';
  preset: string | null;
  fields: CollectionField[];
  titleField: string;
  entries: ContentEntry[];
}

/** A section shows a collection's entries instead of its inline cards. */
export interface SectionSource {
  collectionId: string;
  limit?: number;
  sort?: 'manual' | 'newest';
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
  /** CMS content. Stored in its own tables; attached when rendering/exporting. */
  content?: ContentCollection[];
}
