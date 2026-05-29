# Solitarian 🎉

> The unofficial, completely unauthorised company website for Solita Denmark.

A lighthearted internal site featuring office articles, a team calendar, and a live canteen menu. Think internal meme page, not corporate intranet.

**Live site:** [solitarian.dk](https://solitarian.dk)

---

## Table of Contents

- [License](#license)
- [About](#about)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Adding Content](#adding-content)
- [Deployment](#deployment)

---

## License

### Project code

Copyright © Solita Denmark. All rights reserved.

This software and its source code are the exclusive property of **Solita Denmark**. No part of this codebase may be used, copied, modified, merged, published, distributed, sublicensed, or sold — in whole or in part — without **express written permission** from Solita Denmark.

For enquiries, contact the maintainers via the internal Slack or raise a GitHub issue.

### Stellar HTML5 UP theme

The CSS base (`stellar.css` and associated assets) is sourced from [Stellar by HTML5 UP](https://html5up.net/stellar) and is licensed under the [Creative Commons Attribution 3.0 License](https://html5up.net/license). Attribution: **HTML5 UP** (html5up.net · @ajlkn).
ribution: **HTML5 UP** (html5up.net · @ajlkn).

---

## About

Solitarian is a static site built with [Eleventy (11ty) v2](https://www.11ty.dev/). It is maintained by volunteers at Solita Denmark and rebuilt nightly to reflect the latest canteen menu and upcoming events.

---

## Tech Stack

| Concern | Choice |
|---------|--------|
| Static site generator | [Eleventy v2](https://www.11ty.dev/) |
| Template language | Nunjucks |
| CSS base | [Stellar by HTML5 UP](https://html5up.net/stellar) (CCA 3.0) |
| Brand overrides | Vanilla CSS (`override.css`) |
| JavaScript | Minimal vanilla JS (no framework) |
| Hosting | GitHub Pages |
| CI/CD | GitHub Actions |

---

## Getting Started

**Prerequisites:** Node.js 20+

```bash
# Install dependencies
npm install

# Start the dev server (live-reload at http://localhost:8080)
npm start

# Build the static site to _site/
npm run build
```

---

## Adding Content

### Posts (articles)

Create a new file under `src/content/posts/my-post-title.md`:

```yaml
---
title: My Post Title
description: A 120–160 character summary shown in cards and meta tags.
layout: layouts/post.njk
date: YYYY-MM-DD
tags: [posts]
author: Your Name
---

Post body goes here.
```

### Calendar events

Add an entry to `src/_data/events.json`. Dates use `DD/MM/YY` format:

```json
{ "date": "25/12/26", "title": "Christmas Party 🎄", "category": "party" }
```

Available categories are defined in `src/_data/categories.json`.

### Nav links

Edit `src/_data/site.json` — changes propagate to every page automatically.

---

## Deployment

Deployments are handled by GitHub Actions and require no manual steps.

| Trigger | What happens |
|---------|-------------|
| Push to `main` | Full build + deploy to GitHub Pages |
| Nightly at 01:00 UTC | Scheduled rebuild to pick up fresh canteen menu data |
| Manual dispatch | Run from the **Actions** tab in GitHub |

The canteen menu is fetched at build time from the Off-Brand API (`canteenApiUrl` in `src/_data/site.json`). If the API is unavailable, the canteen page shows a graceful "no menu" state.

---
