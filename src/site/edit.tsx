import { createContext, useContext, type ElementType, type FocusEvent, type KeyboardEvent } from 'react';
import { useResolveHref } from './links';
import type { ImageValue, LinkValue } from './types';

/**
 * Editing hooks. In the editor a provider supplies these so text becomes
 * editable in place; in an exported site there is no provider and the
 * primitives below render plain HTML.
 */
export interface EditApi {
  sectionId: string;
  setText: (path: string, value: string) => void;
  pickImage: (path: string) => void;
  /** Paths that can't be edited inline (e.g. cards that come from a CMS collection). */
  isLocked?: (path: string) => boolean;
}

export const EditContext = createContext<EditApi | null>(null);

export function useEdit() {
  return useContext(EditContext);
}

interface TextProps {
  path: string;
  value?: string;
  as?: ElementType;
  className?: string;
  /** Render nothing when the value is empty (outside the editor). */
  optional?: boolean;
  placeholder?: string;
}

export function Text({ path, value, as: Tag = 'span', className, optional, placeholder }: TextProps) {
  const ctx = useEdit();
  const edit = ctx?.isLocked?.(path) ? null : ctx;
  if (!edit) {
    if (optional && !value) return null;
    return <Tag className={className}>{value}</Tag>;
  }
  if (optional && !value) return null;
  return (
    <Tag
      className={`${className ?? ''} wf-editable`}
      contentEditable
      suppressContentEditableWarning
      data-placeholder={placeholder ?? 'Type here'}
      onBlur={(e: FocusEvent<HTMLElement>) => {
        const next = e.currentTarget.innerText.replace(/\n{3,}/g, '\n\n').trim();
        if (next !== (value ?? '')) edit.setText(path, next);
      }}
      onKeyDown={(e: KeyboardEvent<HTMLElement>) => {
        if (e.key === 'Escape') (e.currentTarget as HTMLElement).blur();
      }}
    >
      {value}
    </Tag>
  );
}

/** Paragraph text: blank lines become separate <p> elements. */
export function Paragraphs({ path, value, className }: { path: string; value?: string; className?: string }) {
  const ctx = useEdit();
  const edit = ctx?.isLocked?.(path) ? null : ctx;
  if (edit) return <Text path={path} value={value} as="div" className={`${className ?? ''} wf-prewrap`} />;
  if (!value) return null;
  return (
    <div className={className}>
      {value.split(/\n\s*\n/).map((p, i) => <p key={i}>{p}</p>)}
    </div>
  );
}

export function Img({ path, value, className, sizes }: { path: string; value?: ImageValue; className?: string; sizes?: string }) {
  const ctx = useEdit();
  const edit = !path || ctx?.isLocked?.(path) ? null : ctx;
  const pos = value ? `${value.focalX ?? 50}% ${value.focalY ?? 50}%` : undefined;
  const content = value?.url ? (
    <img src={value.url} alt={value.alt ?? ''} loading="lazy" decoding="async" sizes={sizes} style={{ objectPosition: pos }} />
  ) : (
    <div className="wf-img-ph" aria-hidden="true">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="M21 16l-5-5L5 20" /></svg>
    </div>
  );
  if (!edit) return <div className={`wf-img ${className ?? ''}`}>{content}</div>;
  return (
    <div
      className={`wf-img wf-img-edit ${className ?? ''}`}
      onClick={(e) => { e.stopPropagation(); edit.pickImage(path); }}
      title="Click to change image"
    >
      {content}
      <span className="wf-img-edit-badge">Change image</span>
    </div>
  );
}

interface ButtonProps {
  path: string;
  value?: LinkValue;
  kind?: 'primary' | 'secondary' | 'ghost';
  className?: string;
}

export function Button({ path, value, kind = 'primary', className }: ButtonProps) {
  const resolve = useResolveHref();
  if (!value?.label) return null;
  return (
    <a href={resolve(value?.href) || '#'} className={`wf-btn wf-btn-${kind} ${className ?? ''}`}>
      <Text path={`${path}.label`} value={value?.label} />
    </a>
  );
}

export function Eyebrow({ path = 'eyebrow', value }: { path?: string; value?: string }) {
  return <Text path={path} value={value} as="p" className="wf-eyebrow" optional />;
}
