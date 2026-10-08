# PureHeart Islamic Foundation of Nigeria

This website was generated with Website Factory.

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The output in `dist/` is a static site. Every push to the default branch is
published to GitHub Pages by `.github/workflows/deploy.yml`. It can also be
deployed to Vercel, Netlify, Cloudflare Pages or any static host.

## Structure

- `src/site.json`: the website content and design system
- `src/site/`: the React components that render it
- `src/App.tsx`: routing and page metadata
