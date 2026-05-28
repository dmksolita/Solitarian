# Copilot Instructions — Off-Brand Co.

A playful, informal Eleventy (11ty) v2 site. **Vibe:** internal meme page, not corporate intranet.

## Agent Personas

The `agents/` directory contains specialist persona definitions for this project. **Before making any change, read the relevant agent file and apply its constraints and conventions.** Match the task to the agent:

| Task type | Agent file |
|-----------|-----------|
| `eleventy.config.js`, CI/CD, npm scripts | `agents/build-engineer.md` |
| Nunjucks layouts and partials | `agents/template-engineer.md` |
| Markdown content, front matter, `site.json` | `agents/content-author.md` |
| CSS, design tokens, `override.css` | `agents/style-engineer.md` |
| `_data/` files, API fetching | `agents/data-engineer.md` |
| Project structure, collections, config | `agents/architect.md` |
| Accessibility, SEO, HTML validity | `agents/qa-reviewer.md` |
| Favicons, OG images, SVG icons | `agents/asset-designer.md` |

For tasks spanning multiple agents, apply each relevant persona in turn.

## Commands

```bash
npm start        # dev server with live-reload at http://localhost:8080
npm run build    # static build → _site/
```

No test or lint commands exist. Deployed to GitHub Pages automatically on push to `main`.

## Architecture

Eleventy v2 SSG with Nunjucks templates. Source in `src/`, output in `_site/`.

**Layout chain:** content `.md` files reference a layout in front matter (e.g. `layouts/post.njk`), which itself has `layout: layouts/base.njk` in its own front matter. `base.njk` is the root HTML shell. All layout files live in `src/_includes/layouts/`.

**CSS:** The site uses the [Stellar HTML5UP theme](https://html5up.net/stellar) (`stellar.css`) as the base. Brand overrides — orange accent colour, component-specific tweaks — go in `override.css`. The custom CSS partials (`_tokens.css`, `main.css`, etc.) are **not loaded** by `base.njk`; `stellar.css` + `override.css` are the only active stylesheets.

**Filters defined in `eleventy.config.js`:**
- `readableDate` / `isoDate` — format JS Date objects
- `thisMonthGrid` / `nextMonthGrid` / `monthGrid` — build calendar week-grid structures for the calendar page
- `parseEventDate` / `todayISO` — helpers for event date handling
- `getCategoryColor(categories, id)` — looks up a category color by id from `categories.json`
- `menuDayInfo(dateStr)` — parses a `DD/MM/YY` date string into `{ iso, slug, dayName, displayDate }`

**Global data (`src/_data/`):**
- `site.json` — site title, description, URL, nav links, and `canteenApiUrl`. Adding a nav item here adds it everywhere.
- `events.json` — calendar events. **Date format is `DD/MM/YY`** (not ISO), parsed by `parseEventDateStr` in the config.
- `categories.json` — event categories with `{ id, name, color }`. Used by the calendar and `getCategoryColor` filter.
- `menu.js` — **async JS data file** that fetches the weekly canteen menu from `canteenApiUrl` at build time. Falls back to `[]` on failure so the canteen page degrades gracefully. Accepts both a bare array and envelope shapes (`{ menu, items, data }`).

**Collections** (defined in `eleventy.config.js`, sorted newest-first):
| Key | Source glob | Notes |
|-----|-------------|-------|
| `posts` | `src/content/posts/**/*.md` | General articles |
| `latest` | `src/content/**/*.md` | Top 5 across all content types |

The `agents/` directory contains agent persona definitions (markdown). It is **not part of the Eleventy build** — Eleventy never processes it.

## Content Front Matter

All content files require these fields:

```yaml
title: string
description: string      # 120–160 chars, used in meta and cards
layout: layouts/post.njk
date: YYYY-MM-DD
tags: [posts]
```

Posts also require: `author: string`

## Key Conventions

- **URLs:** lowercase, hyphen-separated. Content filenames become URLs.
- **Dates:** ISO 8601 (`YYYY-MM-DD`) in front matter. Events in `events.json` use `DD/MM/YY`.
- **CSS changes:** edit `override.css` for brand/component overrides on top of Stellar. Don't add new `@import`s to `base.njk` without a good reason.
- **Orange accent:** `#f26419` (hover: `#d4540e`) — defined in `_tokens.css` and hardcoded in `override.css`.
- **No `!important`** except in `override.css` where it's needed to beat Stellar's specificity.
- **Mobile-first CSS** using `min-width` breakpoints.
- **Images:** explicit `width`/`height`, `loading="lazy"` on all non-hero images. Use `onerror="this.setAttribute('data-hidden','');this.style.display='none'"` to hide broken images silently.
- **Nav changes:** update `src/_data/site.json`, not any template file.
- **Passthrough copies:** `src/assets/` is copied as-is. `HTML_TEMPLATE/images/` is copied to `assets/images/`.
- **Standalone pages** (calendar, canteen) use `layout: layouts/base.njk` directly and are not part of any collection.
