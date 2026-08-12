/* ============================================================================
   set-domain.js — run this ONCE, after you know your final domain.

     node set-domain.js your-domain.com

   It does the three things that cannot be done until a domain exists:
     1. writes sitemap.xml with real absolute URLs
     2. adds the Sitemap: line to robots.txt
     3. adds og:url + og:image to every page and upgrades the Twitter card
        to summary_large_image

   Safe to run again if you change domains — it overwrites cleanly.
   ========================================================================== */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

const PAGES = [
  { file: 'index.html',      loc: '/',                priority: '1.0' },
  { file: 'capture.html',    loc: '/capture.html',    priority: '0.8' },
  { file: 'reviewping.html', loc: '/reviewping.html', priority: '0.8' },
  { file: 'comeback.html',   loc: '/comeback.html',   priority: '0.8' },
  { file: 'pricing.html',    loc: '/pricing.html',    priority: '0.9' },
  { file: 'industries.html', loc: '/industries.html', priority: '0.7' },
  { file: 'contact.html',    loc: '/contact.html',    priority: '0.9' },
  { file: 'privacy.html',    loc: '/privacy.html',    priority: '0.3' },
  // 404.html is deliberately excluded — it is noindex and must not be crawled.
];

const raw = process.argv[2];
if (!raw) {
  console.error('\nUsage:  node set-domain.js your-domain.com\n');
  process.exit(1);
}

const origin = 'https://' + String(raw).replace(/^https?:\/\//i, '').replace(/\/+$/, '');
const today = new Date().toISOString().slice(0, 10);

/* -- 1 · sitemap.xml ------------------------------------------------------ */
const sitemap =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  PAGES.map(p =>
    '  <url>\n' +
    `    <loc>${origin}${p.loc}</loc>\n` +
    `    <lastmod>${today}</lastmod>\n` +
    `    <priority>${p.priority}</priority>\n` +
    '  </url>\n'
  ).join('') +
  '</urlset>\n';

fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap, 'utf8');
console.log(`sitemap.xml written (${PAGES.length} urls)`);

/* -- 2 · robots.txt ------------------------------------------------------- */
fs.writeFileSync(
  path.join(ROOT, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`,
  'utf8'
);
console.log('robots.txt updated');

/* -- 3 · og:url + og:image per page --------------------------------------- */
let n = 0;
for (const p of PAGES.concat([{ file: '404.html', loc: '/404.html' }])) {
  const file = path.join(ROOT, p.file);
  if (!fs.existsSync(file)) { console.log(`  skip (missing): ${p.file}`); continue; }

  let html = fs.readFileSync(file, 'utf8');

  // drop the "add these later" instructional comment
  html = html.replace(/<!-- Social preview\.[\s\S]*?-->\n/, '');

  // remove any previously stamped tags so re-running is idempotent
  html = html.replace(/<meta property="og:url"[^>]*>\n?/g, '');
  html = html.replace(/<meta property="og:image"[^>]*>\n?/g, '');

  const tags =
    `<meta property="og:url" content="${origin}${p.loc}">\n` +
    `<meta property="og:image" content="${origin}/og.png">\n`;

  html = html.replace(
    /(<meta property="og:site_name"[^>]*>\n)/,
    `$1${tags}`
  );

  // a real image means the big card is now appropriate
  html = html.replace(
    '<meta name="twitter:card" content="summary">',
    '<meta name="twitter:card" content="summary_large_image">'
  );

  fs.writeFileSync(file, html, 'utf8');
  n++;
}
console.log(`og:url + og:image stamped into ${n} pages`);

console.log(`\nDone. Origin set to ${origin}`);
console.log('Remember to add an og.png (1200x630) to the project root,');
console.log('otherwise the social card will show a broken image.\n');
