import type { ComponentType } from 'react';
import { BlogList, Cards } from './components/Content';
import { Footer, Navbar } from './components/Globals';
import {
  About, Contact, Content, Cta, Faq, Features, Gallery, Hero, Highlights, Menu, Pricing, Stats, Steps, Team, Testimonials,
} from './components/Sections';
import type { SectionProps } from './components/shared';

/** Maps section `type` to the React component that renders it. */
export const REGISTRY: Record<string, ComponentType<SectionProps>> = {
  navbar: Navbar,
  footer: Footer,
  hero: Hero,
  highlights: Highlights,
  features: Features,
  about: About,
  stats: Stats,
  steps: Steps,
  team: Team,
  testimonials: Testimonials,
  pricing: Pricing,
  faq: Faq,
  gallery: Gallery,
  menu: Menu,
  content: Content,
  cards: Cards,
  blogList: BlogList,
  cta: Cta,
  contact: Contact,
};
