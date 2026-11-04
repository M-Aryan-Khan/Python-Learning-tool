# Python Path

An interactive, front-end-only Python course for Edexcel International GCSE Computer Science (Paper 2, practical).
Students run **real Python** (CPython compiled to WebAssembly via Pyodide) inside the browser - no installs, no server-side code.

## Run it

Double-click `start.bat` (needs Python 3 on the teacher's PC), or run:

```
python -m http.server 8765
```

and open <http://localhost:8765>. The files can also be uploaded to any static host (GitHub Pages, Netlify, a school web server).
Opening `index.html` directly from the disk will **not** work, because browsers block web workers on `file://`.

Everything is bundled in `vendor/` (Python, editor, fonts), so it works offline after you serve it.

## What is inside

| Folder | Purpose |
|---|---|
| `content/` | The lessons (`m00.js` … `m13.js`), reference pages, planner map |
| `js/` | Engine (`pyrunner.py`, `pyworker.js`, `runner.js`) and UI (`ui.js`, `app.js`) |
| `tools/` | `verify.js` - runs every reference solution and example through real Python |
| `vendor/` | Pyodide, CodeMirror, IBM Plex fonts |

Progress and the students' code are stored in each browser's local storage (nothing is sent anywhere).

## Adding or editing lessons

Read `tools/CONTENT_GUIDE.md`, edit a file in `content/`, then run

```
node tools/verify.js
```

It fails if a model answer does not pass its own tests, if a starter already passes, or if an example crashes unexpectedly.

## SEO and link previews

After the first deploy (and whenever the address changes), tell the site its real address and rebuild:

```
node tools/build-seo.js https://your-site.vercel.app
```

This rewrites the meta tags in `index.html`, creates one crawlable page per lesson in `learn/`, and regenerates
`sitemap.xml`, `robots.txt` and `site.webmanifest`. Run `node tools/build-seo.js` again after editing lessons, then commit.
The share image is `og-image.png` (1200 x 630).
