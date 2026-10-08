import { createContext, useContext } from 'react';

/**
 * Base path the site is served from, e.g. "/my-repo/" on GitHub Pages.
 * Internal links ("/about") are prefixed with it.
 */
export const LinkBase = createContext('/');

export function useResolveHref() {
  const base = useContext(LinkBase).replace(/\/+$/, '');
  return (href?: string) => (href && href.startsWith('/') && !href.startsWith('//') ? `${base}${href}` || '/' : href);
}
