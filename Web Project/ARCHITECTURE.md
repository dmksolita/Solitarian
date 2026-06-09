# Architecture — Off-Brand Co.

## Project Overview

A fun, lighthearted internal company website. Content is short articles about office life and general workplace nonsense.

**Vibe:** playful, informal, slightly cheeky — think internal meme page, not corporate intranet.

---

## Repository Layout

```
/                              ← repo root
 .github/workflows/         ← CI/CD (deploys from Web Project/)
 Web Project/               ← the Eleventy site (all build work happens here)
   ├── eleventy.config.js
   ├── package.json
   ├── ARCHITECTURE.md
   ├── HTML_TEMPLATE/images/ copied to assets/images/ at build time  
   └── src/
 agents/                    ← agent persona definitions (not built)
 IAC/                       ← infrastructure-as-code (planned)
 notes.md                   ← product pipeline / roadmap
```

**All npm commands must be run from `Web Project/`.**

---

## Technology

| Concern | Choice |
|---------|--------|
| SSG | Eleventy (11ty) v2 |
| Template language | Nunjucks |
| CSS base | [Stellar by HTML5 UP](https://html5up.net/stellar) (`stellar.css`) |
| CSS overrides | Vanilla CSS (`override.css`) |
| JS | Minimal vanilla JS (no framework) |
| Source dir | `src/` |
| Output dir | `_site/` |
| Hosting | GitHub Pages |

---

## Directory Structure

```
Web Project/src/
 _data/
   ├── site.json            ← global site metadata + nav links
   ├── events.json          ← calendar events (date format: DD/MM/YY)
   ├── categories.json      ← event categories { id, name, color }
   └── menu.js              ← async: fetches canteen menu from API at build time
 _includes/
   ├── layouts/
   │   ├── base.njk         ← root HTML shell (all pages inherit from this)
 home.njk         ← homepage layout   │   ├─
   │   └── post.njk         ← article layout
   └── partials/
       ├── header.njk
       ├── nav.njk
       ├── footer.njk
       └── card.njk         ← reusable content card
 assets/
   └── css/
       ├── stellar.css      ← base theme (do not edit)
       ├── override.css     ← brand overrides — the only place to add/change styles
       ├── noscript.css     ← styles applied when JS is disabled
       ├── fontawesome-all.min.css
       ├── _canteen.css     ← canteen page styles (not auto-imported; loaded inline)
       ├── _calendar.css    ← calendar page styles (not auto-imported; loaded inline)
       └── main.css         ← legacy entry point (not loaded by base.njk)
 content/
   └── posts/               ← general articles (.md)
       └── index.njk        ← posts listing page
 index.njk                ← homepage
 calendar.njk             ← standalone calendar page
 canteen.njk              ← standalone canteen menu page
 404.njk                  ← 404 error page
 CNAME                    ← custom domain (passthrough)
 robots.txt               ← (passthrough)
```

---

## Collections

| Collection key | Glob | Description |
|----------------|------|-------------|
| `posts` | `src/content/posts/**/*.md` | General articles, newest first |
| `latest` | `src/content/**/*.md` | 5 most recent items across all content |

---

## Front Matter Schema

### All content (required)
```yaml
title: string           # Page/post title
description: string     # 120–160 chars, used in meta + cards
layout: layouts/post.njk
date: YYYY-MM-DD
tags: [posts]
```

### Posts (additional required)
```yaml
author: string
```

---

## CSS Architecture

Only two stylesheets are loaded by `base.njk`:
1. `stellar.css` — the Stellar HTML5UP base theme (read-only)
2. `override.css` — all brand and component overrides go here

The `_canteen.css` and `_calendar.css` partials exist for organisational purposes and are loaded by their respective standalone pages. `main.css` is a legacy file and is not active.

**Orange accent:** `#f26419` (hover: `#d4540e`)

---

## Conventions

- All URLs lowercase, hyphen-separated. Content filenames become URLs.
- Dates ISO 8601 (`YYYY-MM-DD`) in front matter; events use `DD/MM/YY`.
- Images: explicit `width`/`height`, `loading="lazy"` on all non-hero images.
- `onerror="this.setAttribute('data-hidden','');this.style.display='none'"` on all `<img>` tags to silently hide broken images.
- No `!important` except in `override.css` where it's needed to beat Stellar specificity.
- Mobile-first CSS (`min-width` breakpoints).
- Nav changes go in `src/_data/site.json`, not template files.
