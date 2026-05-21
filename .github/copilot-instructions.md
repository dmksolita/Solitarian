# Copilot Instructions — Off-Brand Co.

A playful, informal Eleventy (11ty) v2 site. **Vibe:** internal meme page, not corporate intranet.

## Commands

```bash
npm start        # dev server with live-reload at http://localhost:8080
npm run build    # static build → _site/
```

No test or lint commands exist.

## Architecture

Eleventy v2 SSG with Nunjucks templates. Source in `src/`, output in `_site/`.

**Layout chain:** content `.md` files reference a layout in front matter (e.g. `layouts/post.njk`), which itself has `layout: layouts/base.njk` in its own front matter. `base.njk` is the root HTML shell. All layout files live in `src/_includes/layouts/`.

**CSS:** The site uses the [Stellar HTML5UP theme](https://html5up.net/stellar) (`stellar.css`) as the base. Brand overrides — orange accent colour, component-specific tweaks — go in `override.css`. The custom CSS partials (`_tokens.css`, `main.css`, etc.) are **not loaded** by `base.njk`; `stellar.css` + `override.css` are the only active stylesheets.

**Filters defined in `eleventy.config.js`:**
- `readableDate` / `isoDate` — format JS Date objects
- `thisMonthGrid` / `nextMonthGrid` / `monthGrid` — build calendar week-grid structures for the calendar page
- `parseEventDate` / `todayISO` — helpers for event date handling

**Global data:**
- `src/_data/site.json` — site title, description, URL, and nav links. Adding a nav item here adds it everywhere.
- `src/_data/events.json` — calendar events. **Date format is `DD/MM/YY`** (not ISO), parsed by `parseEventDateStr` in the config.

**Collections** (all defined in `eleventy.config.js`, sorted newest-first):
| Key | Source glob | Tag |
|-----|-------------|-----|
| `posts` | `src/content/posts/**/*.md` | `posts` |
| `foosball` | `src/content/foosball/**/*.md` | `foosball` |
| `fridayBar` | `src/content/friday-bar/**/*.md` | `friday-bar` |
| `latest` | `src/content/**/*.md` | — (top 5 across all types) |

The `agents/` directory contains agent persona definitions (markdown). It is **not part of the Eleventy build** — Eleventy never processes it.

## Content Front Matter

All content files require these fields:

```yaml
title: string
description: string      # 120–160 chars, used in meta and cards
layout: string           # layouts/post.njk | layouts/foosball.njk | layouts/friday-bar.njk
date: YYYY-MM-DD
tags: [posts]            # must match the collection: posts | foosball | friday-bar
```

Additional fields by type:

**Posts** — `author: string`

**Foosball:**
```yaml
home_team: string
away_team: string
home_score: number
away_score: number
mvp: string              # optional
```

**Friday Bar:**
```yaml
venue: string
rating: number           # 1–5
visited: YYYY-MM-DD
```

## Key Conventions

- **URLs:** lowercase, hyphen-separated. Content filenames become URLs.
- **Dates:** ISO 8601 (`YYYY-MM-DD`) in front matter. Events in `events.json` use `DD/MM/YY`.
- **CSS changes:** edit `override.css` for brand/component overrides on top of Stellar. Don't add new `@import`s to `base.njk` without a good reason.
- **Orange accent:** `#f26419` (hover: `#d4540e`) — defined in `_tokens.css` and hardcoded in `override.css`.
- **No `!important`** except in `override.css` where it's needed to beat Stellar's specificity.
- **Mobile-first CSS** using `min-width` breakpoints.
- **Images:** explicit `width`/`height`, `loading="lazy"` on all non-hero images.
- **Nav changes:** update `src/_data/site.json`, not any template file.
- **Passthrough copies:** `src/assets/` is copied as-is. `HTML_TEMPLATE/images/` is copied to `assets/images/`.
