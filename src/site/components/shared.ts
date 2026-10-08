import type { Page, Section, SiteDoc } from '../types';

export interface SectionProps {
  section: Section;
  doc: SiteDoc;
  page?: Page;
}
