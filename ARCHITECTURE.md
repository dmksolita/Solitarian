# Architecture — Off-Brand Co.

## Project Overview
A fun, lighthearted, off-brand company website. Content includes short articles loosely related
to workplace life: a foosball scoreboard, friday bar reviews, and general office nonsense.

**Vibe:** playful, informal, slightly cheeky — think internal meme page, not corporate intranet.

---

## Technology
| Concern | Choice |
|---------|--------|
| SSG | Eleventy (11ty) v2 |
| Template language | Nunjucks |
| CSS | Vanilla CSS with custom properties |
| JS | Minimal vanilla JS (no framework) |
| Source dir | `src/` |
| Output dir | `_site/` |

---

## Directory Structure

```
/
├── eleventy.config.js
├── package.json
├── .gitignore
├── ARCHITECTURE.md
├── agents/                      ← agent definitions (not built)
└── src/
    ├── _data/
    │   └── site.json            ← global site metadata + nav
    ├── _includes/
    │   ├── layouts/
    │   │   ├── base.njk         ← root HTML shell
    │   │   ├── home.njk         ← homepage layout
    │   │   ├── post.njk         ← article layout
    │   │   ├── foosball.njk     ← foosball entry layout
    │   │   └── friday-bar.njk   ← bar review layout
    │   └── partials/
    │       ├── header.njk
    │       ├── footer.njk
    │       ├── nav.njk
    │       └── card.njk         ← reusable content card
    ├── content/
    │   ├── posts/               ← general articles (.md)
    │   ├── foosball/            ← match results (.md)
    │   └── friday-bar/          ← bar reviews (.md)
    ├── assets/
    │   ├── css/
    │   │   ├── main.css         ← entry point (imports all partials)
    │   │   ├── _tokens.css      ← design tokens
    │   │   ├── _reset.css
    │   │   ├── _layout.css
    │   │   ├── _components.css
    │   │   └── _utilities.css
    │   ├── js/
    │   │   └── main.js
    │   └── images/
    └── index.njk                ← homepage
```

---

## Collections

| Collection key | Glob | Description |
|----------------|------|-------------|
| `posts` | `src/content/posts/**/*.md` | General articles, newest first |
| `foosball` | `src/content/foosball/**/*.md` | Match results, newest first |
| `fridayBar` | `src/content/friday-bar/**/*.md` | Bar reviews, newest first |
| `latest` | `src/content/**/*.md` | 5 most recent items across all types |

---

## Front Matter Schema

### All content (required)
```yaml
title: string           # Page/post title
description: string     # 120–160 chars, used in meta + cards
layout: string          # layouts/post.njk | layouts/foosball.njk | layouts/friday-bar.njk
date: YYYY-MM-DD
tags: [string]          # always include the content-type tag: posts | foosball | friday-bar
```

### Posts (additional)
```yaml
author: string
```

### Foosball (additional)
```yaml
home_team: string
away_team: string
home_score: number
away_score: number
mvp: string             # optional
```

### Friday Bar (additional)
```yaml
venue: string
rating: number          # 1–5
visited: YYYY-MM-DD
```

---

## Design Tokens (brief for Style Engineer)
- **Background:** near-white `#f9f7f4`
- **Text:** near-black `#1a1a1a`
- **Accent:** orange `#f26419`
- **Accent hover:** darker orange `#d4540e`
- **Font:** system-ui stack (no external font load)
- **Spacing scale:** 4px base, multiples of 4

---

## Conventions
- All URLs lowercase, hyphen-separated
- Dates ISO 8601 (`YYYY-MM-DD`)
- Images: explicit `width`/`height`, `loading="lazy"` on all non-hero images
- No `!important` except in utilities
- Mobile-first CSS (`min-width` breakpoints)
