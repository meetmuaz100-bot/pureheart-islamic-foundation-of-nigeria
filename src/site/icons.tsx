// Small inline icon set (stroke icons on a 24px grid) so exported sites need
// no icon dependency. Names match ICONS in the component catalog.
const PATHS: Record<string, string[]> = {
  scale: ['M12 3v18', 'M5 21h14', 'M3 7h18', 'M6 7l-3 7a3 3 0 0 0 6 0z', 'M18 7l-3 7a3 3 0 0 0 6 0z'],
  briefcase: ['M3 7h18v13H3z', 'M8 7V4h8v3', 'M3 13h18'],
  shield: ['M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z', 'M9 12l2 2 4-4'],
  lightbulb: ['M9 18h6', 'M10 21h4', 'M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z'],
  users: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M22 21v-2a4 4 0 0 0-3-3.9', 'M16 3.1a4 4 0 0 1 0 7.8'],
  chart: ['M3 3v18h18', 'M7 15l4-4 3 3 6-6'],
  globe: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M3 12h18', 'M12 3a14 14 0 0 1 0 18', 'M12 3a14 14 0 0 0 0 18'],
  heart: ['M12 20s-7-4.5-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.5-9 9-9 9z'],
  star: ['M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z'],
  clock: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M12 7v5l3 2'],
  check: ['M20 6L9 17l-5-5'],
  home: ['M3 11l9-8 9 8', 'M5 10v10h14V10', 'M10 20v-6h4v6'],
  leaf: ['M5 21c0-9 5-15 16-16-1 11-7 16-16 16z', 'M5 21l8-8'],
  coffee: ['M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z', 'M17 10h2a2 2 0 0 1 0 4h-2', 'M8 2v3', 'M12 2v3'],
  camera: ['M3 8h4l2-3h6l2 3h4v12H3z', 'M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'],
  pen: ['M16 3l5 5L8 21H3v-5z', 'M13 6l5 5'],
  phone: ['M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z'],
  zap: ['M13 2L4 14h7l-1 8 9-12h-7z'],
  lock: ['M5 11h14v10H5z', 'M8 11V7a4 4 0 0 1 8 0v4'],
  layers: ['M12 3l9 5-9 5-9-5z', 'M3 13l9 5 9-5'],
  map: ['M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z', 'M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z'],
  tool: ['M14.7 6.3a4 4 0 0 0 5 5L21 13l-8 8-3-3 8-8-1.3-1.3a4 4 0 0 0-5-5L13 5z', 'M3 21l6-6'],
  book: ['M4 4h7a3 3 0 0 1 3 3v14a2 2 0 0 0-2-2H4z', 'M20 4h-6v17a2 2 0 0 1 2-2h4z'],
  award: ['M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12z', 'M8.5 13.5L7 22l5-3 5 3-1.5-8.5'],
};

export function Icon({ name, size = 24 }: { name?: string; size?: number }) {
  const paths = PATHS[name ?? ''] ?? PATHS.star;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths.map((d) => <path key={d} d={d} />)}
    </svg>
  );
}
