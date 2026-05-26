// One-time scraper for the Seventh-day Adventist Hymnal (1985) from adventisthymns.com.
// This source uses the canonical hymn TITLE (e.g. "It Is Well With My Soul")
// rather than the first-line excerpt used by hymnary.org.
//
// Note: the /numbers/<range> listing pages on adventisthymns.com only return
// content for ranges 1-99 .. 500-599; ranges 600+ fall back to showing hymns
// 1-100. We instead walk /titles/[a-z], which indexes the full 695-hymn
// catalogue. The hymn number is recovered from the /lyrics/<NNN>-<slug> URL.
//
// Output: public/hymns.json (flat array sorted by number).
// Usage: npm run scrape

import * as cheerio from 'cheerio';
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = resolve(__dirname, '..', 'public', 'hymns.json');
const BASE_URL = 'https://adventisthymns.com/titles';
const LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('');
const EXPECTED_TOTAL_MIN = 600; // sanity threshold for the full scrape
const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

async function fetchWithRetry(url, retries = 1) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': USER_AGENT },
        redirect: 'follow',
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    } catch (err) {
      if (attempt === retries) throw err;
      console.warn(`  retry ${attempt + 1} for ${url}: ${err.message}`);
      await new Promise((r) => setTimeout(r, 800));
    }
  }
}

function parseHymnsFromHtml(html) {
  const $ = cheerio.load(html);
  const hymns = [];
  $('h2.post__title a').each((_, a) => {
    const href = $(a).attr('href') || '';
    // URL shape: https://adventisthymns.com/lyrics/<NNN>-<slug>
    const m = href.match(/\/lyrics\/(\d+)-/);
    if (!m) return;
    const number = parseInt(m[1], 10);
    const title = $(a).text().trim();
    if (!Number.isFinite(number) || !title) return;
    hymns.push({ number, title });
  });
  return hymns;
}

async function main() {
  const all = [];
  for (const letter of LETTERS) {
    const url = `${BASE_URL}/${letter}`;
    process.stdout.write(`Fetching /titles/${letter}... `);
    try {
      const html = await fetchWithRetry(url, 1);
      const hymns = parseHymnsFromHtml(html);
      console.log(`${hymns.length} hymns`);
      all.push(...hymns);
    } catch (err) {
      console.warn(`failed: ${err.message} (continuing)`);
    }
  }

  const byNumber = new Map();
  for (const h of all) if (!byNumber.has(h.number)) byNumber.set(h.number, h);
  const sorted = [...byNumber.values()].sort((a, b) => a.number - b.number);

  if (sorted.length < EXPECTED_TOTAL_MIN) {
    console.warn(
      `\nwarning: only ${sorted.length} unique hymns (expected >= ${EXPECTED_TOTAL_MIN}). Site layout may have changed.`
    );
  }

  await mkdir(dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, JSON.stringify(sorted, null, 2) + '\n', 'utf8');
  console.log(`\nWrote ${sorted.length} hymns to ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error('Scraper failed:', err);
  process.exit(1);
});
