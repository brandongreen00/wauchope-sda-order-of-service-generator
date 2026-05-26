# Order of Service Generator

A static web app that generates a printable A4 PDF Order of Service for the
Wauchope SDA church. Fill in the form (people, classes, songs, hymns, keys),
click **Generate PDF**, and download a landscape A4 PDF with the same content
mirrored left and right so the page can be cut down the middle for
distribution.

Runs entirely in the browser — no backend, no runtime API calls. The hymn list
for fuzzy-search is scraped once from hymnary.org and committed as a static
JSON asset.

## Stack

- Vite + React (JavaScript)
- [`@react-pdf/renderer`](https://react-pdf.org/) for true PDF generation with
  selectable text
- [Fuse.js](https://fusejs.io/) for fuzzy hymn-title search
- Node + cheerio for the one-time scraper
- GitHub Actions → GitHub Pages for deploy

## Local development

```bash
npm install
npm run dev
```

Then open the URL Vite prints (defaults to
`http://localhost:5173/wauchope-sda-order-of-service-generator/`).

## Building for production

```bash
npm run build      # outputs to dist/
npm run preview    # serves the built dist/ for sanity checking
```

## Re-scraping the hymn list

The Seventh-day Adventist Hymnal (1985) entries are already bundled at
`public/hymns.json`. To re-scrape:

```bash
npm run scrape
```

The scraper walks `https://adventisthymns.com/titles/[a-z]`, parses each
alphabetical listing, and writes a flat sorted array of `{ number, title }`
back to `public/hymns.json`. This source gives the canonical title for each
hymn (e.g. "It Is Well With My Soul" for #530) rather than a first-line
excerpt. Re-run only if adventisthymns.com changes its catalogue.

(Note: adventisthymns.com's `/numbers/<range>` pages only work for ranges
up to `500-599`; the `600+` ranges fall back to showing hymns 1-100, which
is why the scraper uses the alphabetical title index instead.)

## Deploying to GitHub Pages

Pushes to `main` trigger `.github/workflows/deploy.yml`, which builds and
deploys `dist/` via the official `actions/deploy-pages` workflow. In your
GitHub repo settings, set **Pages → Source** to **GitHub Actions** once.

### Changing the Pages subpath

If you fork or rename the repo, update the `base` in
[`vite.config.js`](./vite.config.js) so it matches the new repo name:

```js
export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/',
});
```

The site will then be live at
`https://<username>.github.io/your-repo-name/`.

## Notes on the PDF

- **Layout** matches the reference: A4 landscape, two identical halves split
  by a thin vertical divider, horizontal rules between sections within each
  half.
- **Hymn slots:** Invocational, Hymn (post-offering), Hymn (before sermon),
  Closing Hymn. The reference has four `Hymn:` lines, so the form has four
  fixed hymn rows in addition to the dynamic Praise & Worship list and the
  fixed Kids Song row.
- **Modulation** is rendered as `G → A` (Unicode arrow). The bundled
  Liberation Sans font is used because Helvetica (the built-in `@react-pdf/renderer`
  font) does not include `→`.

## Font license

[Liberation Sans](https://github.com/liberationfonts/liberation-fonts) is
included at `public/fonts/` under the SIL Open Font License 1.1. It is
metric-compatible with Arial/Helvetica.
