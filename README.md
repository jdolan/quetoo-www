# quetoo.org

The source for [quetoo.org](https://quetoo.org), the website for [Quetoo](https://github.com/jdolan/quetoo) —
a free, open source arena first person shooter for Linux, macOS and Windows.

The site is a static [Hugo](https://gohugo.io) build. Every push to `main` is built and published to
GitHub Pages by [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

## Requirements

- [Hugo extended](https://gohugo.io/installation/), a recent release (`brew install hugo`)

## Running locally

```sh
hugo server     # live reload at http://localhost:1313
hugo --minify   # production build into ./public/
```

`public/` and `resources/` are build output and are not tracked in git.

## Layout

| Path | Contents |
|---|---|
| `content/` | Markdown for every page: news posts, docs, media galleries, downloads |
| `themes/quetoo/` | The site's theme — templates, partials, shortcodes, CSS, JS, images |
| `layouts/` | Project level template overrides that take precedence over the theme |
| `static/` | Files copied verbatim to the site root: screenshots, icons, `servers.js`, `stats.js` |
| `hugo.toml` | Site config: menu, social links, taglines, analytics ID |

The `/servers/` and `/stats/` pages are client rendered. They ship an empty container and fetch live
data from the Quetoo API at `https://giblets.quetoo.org` in the browser, so they show nothing useful
until that API responds.

## Contributing

Edits to prose and news posts are just Markdown in `content/`. After changing any CSS, bump the
`cssVersion` param in `hugo.toml` so returning visitors get the new stylesheet.

Working with a coding agent? See [AGENTS.md](AGENTS.md).
