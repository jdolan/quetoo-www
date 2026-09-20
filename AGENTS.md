# AGENTS.md

Guidance for coding agents working in this repository. See [README.md](README.md) for the human
oriented introduction.

## What this is

A [Hugo](https://gohugo.io) static site for [quetoo.org](https://quetoo.org). There is no build
tooling beyond Hugo itself — no npm, no bundler, no SCSS. CSS and JS are hand written and served as
authored.

```sh
hugo server     # live reload at http://localhost:1313
hugo --minify   # production build into ./public/
```

Pushes to `main` deploy to GitHub Pages via `.github/workflows/deploy.yml`. There is no test suite;
verifying a change means building the site and looking at the affected page.

## Where things live

- `content/` — all page content, as Markdown with YAML front matter.
- `themes/quetoo/layouts/` — the base templates, partials and shortcodes.
- `themes/quetoo/static/` — `css/style.css`, `css/stats.css`, `js/main.js`, logo, hero, screenshots.
- `layouts/` — project level overrides. Hugo's lookup order means a template here wins over the
  theme template at the same path. `layouts/news/`, `layouts/servers/` and `layouts/stats/` override
  their sections this way.
- `static/` — copied to the site root untouched: `js/servers.js`, `js/stats.js`, icons, screenshots,
  `CNAME`.
- `public/` and `resources/` — build output. These are gitignored and MUST NOT be edited; changes
  there are silently discarded on the next build.

When customizing a single section, prefer adding an override under `layouts/` over editing the
theme, so the theme stays generic.

## Conventions

### Bump `cssVersion` after CSS changes

`themes/quetoo/layouts/_default/baseof.html` fingerprints the stylesheet with `now.Unix` in
development and with the `cssVersion` param from `hugo.toml` in production. Any change to a `.css`
file MUST be accompanied by an increment of `cssVersion`, or deployed visitors keep the cached
stylesheet.

### Front matter

Every page SHOULD set `description`; it overrides the site level description in the SEO partial and
is used for meta and OpenGraph tags. News posts SHOULD also set `featured_image` for the social card.

```yaml
---
title: "Post Title"
description: "Used in meta tags"
date: 2026-05-22
featured_image: "/images/screenshots/quetoo057.jpg"
---
```

### Raw HTML in Markdown

`markup.goldmark.renderer.unsafe = true` is set deliberately. News posts and doc pages use inline
`<div>`, `<span>` and class attributes for layout, and that is the expected style here — do not
rewrite it into shortcodes unless asked.

### Shortcodes

| Shortcode | Purpose |
|---|---|
| `{{< figure src="..." alt="..." float="..." >}}` | Lightbox enabled image; `float` is optional |
| `{{< ab-compare before="..." after="..." before-label="..." after-label="..." title="..." >}}` | Drag to compare slider for two images |
| `{{< download-counter >}}` | Cumulative GitHub release download count, filled in by `main.js` |
| `{{< placeholder type="..." id="..." caption="..." >}}` | Visible TODO marker for missing art |

### Client rendered pages

`/servers/` and `/stats/` are shells. Their templates emit a container and load a script that
fetches from `https://giblets.quetoo.org/api/servers`, `/api/stats` and `/api/options` at runtime.
There is no Hugo data file behind them, and they render empty without the live API.

Names coming back from that API contain Quetoo color escapes (`^0`–`^9`). Anything that displays an
API supplied name MUST pass it through `stripColors()` in `static/js/servers.js` first.

`main.js` separately calls the GitHub releases API to total up download counts.

### Analytics

Google Analytics is injected only under `hugo.IsProduction`, so it never runs during `hugo server`.
Keep it that way.

## Style

- Match the surrounding code. Templates use two space indentation; CSS and JS follow the existing
  files.
- Text files MUST end with a newline.
- Prose on the site is informal and a little irreverent. Read a neighboring page before writing new
  copy, and do not flatten the voice into marketing filler.
- No emojis in code or commit messages. Site copy already uses a few deliberately; leave them alone.

## Commits

- The subject MUST be imperative, 100 characters or fewer, with no trailing period.
- Commits SHOULD be atomic — one logical change each.
- Build artifacts under `public/` MUST NOT be committed.
