// One-time scraper for the Seventh-day Adventist Hymnal (1985) from hymnary.org.
// Output: public/hymns.json (flat array sorted by number).
// Usage: npm run scrape

import * as cheerio from 'cheerio';
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = resolve(__dirname, '..', 'public', 'hymns.json');
const BASE_URL = 'https://hymnary.org/hymnal/SDAH1985';
const PAGE_COUNT = 9; // pages 0..8 per the prompt
const PER_PAGE_MIN = 50; // warn if a page yields fewer than this
const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

async function fetchWithRetry(url, retries = 1) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    } catch (err) {
      if (attempt === retries) throw err;
      console.warn(`  retry ${attempt + 1} for ${url}: ${err.message}`);
      await new Promise((r) => setTimeout(r, 800));
    }
  }
}

function parseHymnsFromHtml(html, pageIndex) {
  const $ = cheerio.load(html);
  const hymns = [];
  $('tr.result-row').each((_, row) => {
    const tds = $(row).find('td');
    if (tds.length < 2) return;
    const numText = $(tds[0]).find('a').first().text().trim();
    const title = $(tds[1]).find('a').first().text().trim();
    const number = parseInt(numText, 10);
    if (!Number.isFinite(number) || !title) return;
    hymns.push({ number, title });
  });
  if (hymns.length < PER_PAGE_MIN) {
    console.warn(
      `  warning: page ${pageIndex} produced only ${hymns.length} hymns (expected >= ${PER_PAGE_MIN}).`
    );
  }
  return hymns;
}

async function main() {
  const all = [];
  for (let page = 0; page < PAGE_COUNT; page++) {
    const url = `${BASE_URL}?page=${page}`;
    process.stdout.write(`Fetching page ${page}... `);
    try {
      const html = await fetchWithRetry(url, 1);
      const hymns = parseHymnsFromHtml(html, page);
      console.log(`${hymns.length} hymns`);
      all.push(...hymns);
    } catch (err) {
      console.warn(`failed: ${err.message} (continuing)`);
    }
  }

  // Deduplicate by number, keep first occurrence; sort ascending.
  const byNumber = new Map();
  for (const h of all) if (!byNumber.has(h.number)) byNumber.set(h.number, h);
  const sorted = [...byNumber.values()].sort((a, b) => a.number - b.number);

  await mkdir(dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, JSON.stringify(sorted, null, 2) + '\n', 'utf8');
  console.log(`\nWrote ${sorted.length} hymns to ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error('Scraper failed:', err);
  process.exit(1);
});
