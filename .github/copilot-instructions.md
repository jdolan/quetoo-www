# Quetoo Website — Copilot Instructions

## Overview

Static website for [quetoo.org](https://quetoo.org), built with [Hugo](https://gohugo.io). Deployed to GitHub Pages on every push to `main` via `.github/workflows/deploy.yml`. The site uses the `hugo` extended build (required for SCSS processing).

## Commands

```sh
hugo server          # Dev server with live reload at http://localhost:1313
hugo --minify        # Production build → ./public/
```

## Architecture

### Theme vs. project-level layouts

The custom theme lives in `themes/quetoo/`. Hugo's lookup order means files in the project-level `layouts/` directory **override** theme layouts for the same path. Use this to customize specific sections without touching the theme.

- `themes/quetoo/layouts/` — base templates, partials, shortcodes
- `layouts/news/`, `layouts/servers/`, `layouts/stats/` — project-level overrides for those sections

### Static assets

- `themes/quetoo/static/css/style.css` — global styles
- `themes/quetoo/static/css/stats.css` — shared by both `/servers/` and `/stats/` pages
- `themes/quetoo/static/js/main.js` — sitewide JS (nav toggle, tagline carousel, lightbox, download counter, A/B sliders)
- `static/js/servers.js` — server browser; fetches live data from `https://giblets.quetoo.org/api/servers`
- `static/js/stats.js` — leaderboard/player detail; fetches from `https://giblets.quetoo.org/api/stats` and `/api/options`

### CSS cache-busting

`hugo.toml` has a `cssVersion` param. In development, the stylesheet is fingerprinted with `now.Unix`; in production it uses the static `cssVersion` value. **Bump `cssVersion` in `hugo.toml` when making CSS changes** so browsers pick them up after deploy.

### Dynamic pages (Servers & Stats)

`/servers/` and `/stats/` are shell Hugo pages — the HTML template injects a `<div>` placeholder and loads a JS file that fetches from the `giblets.quetoo.org` API at runtime. There is no Hugo data file; all data is client-side.

## Key Conventions

### Shortcodes

Three custom shortcodes are defined in `themes/quetoo/layouts/shortcodes/`:

| Shortcode | Usage |
|---|---|
| `{{< ab-compare before="..." after="..." before-label="..." after-label="..." title="..." >}}` | Interactive drag-to-compare slider for two images |
| `{{< figure src="..." alt="..." >}}` | Lightbox-enabled image (uses `.gallery-item` + `data-full` for JS hook) |
| `{{< download-counter >}}` | Inline span that JS populates with cumulative GitHub release download count |

### Content front matter

News posts support `featured_image` (used for OG/Twitter card image). All pages support `description` (overrides the site-level description for SEO). Example:

```yaml
---
title: "Post Title"
description: "Used in meta tags"
date: 2026-05-22
featured_image: "/images/screenshots/quetoo057.jpg"
---
```

### Raw HTML in Markdown

`markup.goldmark.renderer.unsafe = true` is set in `hugo.toml`, so raw HTML is allowed directly in `.md` content files. This is intentional — news posts and doc pages use inline `<div>`, `<span>`, and class attributes for styling.

### Quetoo color codes

Server/player names from the API contain Quetoo color escape sequences (`^0`–`^9`). The `stripColors()` helper in `servers.js` strips them before display.

### Google Analytics

Only injected in production builds (`{{ if hugo.IsProduction }}`). It is never active during `hugo server`.
