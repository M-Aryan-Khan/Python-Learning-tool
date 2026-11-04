#!/usr/bin/env node
/* Generates everything search engines and link previews need:
 *   - the SEO block in index.html (title, description, Open Graph, Twitter card, JSON-LD, icons)
 *   - one crawlable page per lesson at  learn/<lesson-id>/index.html  (own title, description, share card,
 *     links to the previous/next lesson; real visitors are sent straight on to the interactive lesson)
 *   - sitemap.xml, robots.txt, site.webmanifest
 *
 *   node tools/build-seo.js https://your-site.vercel.app      (first time, or when the address changes)
 *   node tools/build-seo.js                                    (after editing lessons: re-uses tools/site.json)
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const siteFile = path.join(__dirname, 'site.json');
let site = { url: 'https://YOUR-SITE.vercel.app' };
try { site = JSON.parse(fs.readFileSync(siteFile, 'utf8')); } catch (e) { /* first run */ }
if (process.argv[2]) site.url = process.argv[2].replace(/\/+$/, '');
fs.writeFileSync(siteFile, JSON.stringify(site, null, 2) + '\n');
const SITE = site.url;
const placeholder = /YOUR-SITE/.test(SITE);

const AUTHOR = 'Sir Aryan';
const BRAND = 'Python Path';
const SCHOOL = 'Beacon Light Academy';
const HOME_TITLE = `${BRAND} · By ${AUTHOR}`;
const HOME_DESC = `Free interactive Python course for Edexcel IGCSE Computer Science Paper 2: animated lessons, exercises and past-paper practice. By ${AUTHOR}, for ${SCHOOL}.`;
const KEYWORDS = 'learn Python, Python for beginners, Edexcel International GCSE Computer Science, IGCSE Python, Paper 2 practical, Python lessons, Python exercises, past paper practice, Year 10 computer science, Beacon Light Academy';
const IMG = `${SITE}/og-image.png`;
const today = new Date().toISOString().slice(0, 10);

/* ---------- load the course ---------- */
const ctx = vm.createContext({ console });
ctx.window = ctx;
vm.runInContext(fs.readFileSync(path.join(root, 'js', 'core.js'), 'utf8'), ctx);
fs.readdirSync(path.join(root, 'content')).filter((f) => f.endsWith('.js')).sort().forEach((f) => vm.runInContext(fs.readFileSync(path.join(root, 'content', f), 'utf8'), ctx, { filename: f }));
const PP = ctx.PP;
const all = PP.allLessons();

/* ---------- helpers ---------- */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const plain = (s) => String(s || '').replace(/`([^`]*)`/g, '$1').replace(/\*\*([^*]+)\*\*/g, '$1').replace(/<[^>]+>/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const clip = (s, n) => (s.length <= n ? s : s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…');
const isoDuration = (t) => { const m = /(\d+)\s*min/.exec(t || ''); return m ? `PT${m[1]}M` : undefined; };
const url = (id) => `${SITE}/learn/${id}/`;

function head({ title, desc, canonical, type, jsonld, extra }) {
  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="keywords" content="${esc(KEYWORDS)}">
<meta name="author" content="${esc(AUTHOR)}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
<meta name="theme-color" content="#ffffff">
<meta name="color-scheme" content="light dark">
<link rel="canonical" href="${canonical}">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta property="og:site_name" content="${esc(BRAND)}">
<meta property="og:locale" content="en_GB">
<meta property="og:type" content="${type || 'website'}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${IMG}">
<meta property="og:image:secure_url" content="${IMG}">
<meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Learn Python by Sir Aryan: specially crafted for ${esc(SCHOOL)}. A code editor showing a Python loop and its output.">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${IMG}">
<meta name="twitter:image:alt" content="Learn Python by Sir Aryan: specially crafted for ${esc(SCHOOL)}.">
${extra || ''}<script type="application/ld+json">${JSON.stringify(jsonld)}</script>`;
}

const person = { '@type': 'Person', name: AUTHOR };
const courseNode = {
  '@type': 'Course',
  '@id': `${SITE}/#course`,
  name: `Learn Python: ${BRAND}`,
  description: HOME_DESC,
  url: `${SITE}/`,
  inLanguage: 'en-GB',
  isAccessibleForFree: true,
  educationalLevel: 'Edexcel International GCSE (Year 10 and 11)',
  teaches: 'Python programming, algorithms, data representation, text files, testing and debugging',
  about: ['Python', 'Computer Science', 'Programming'],
  audience: { '@type': 'EducationalAudience', educationalRole: 'student', audienceType: `Students at ${SCHOOL}` },
  provider: person,
  author: person,
  image: IMG,
  hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', courseWorkload: 'Self-paced' },
};

/* ---------- 1. index.html ---------- */
const homeBlock = head({
  title: HOME_TITLE, desc: HOME_DESC, canonical: `${SITE}/`,
  jsonld: { '@context': 'https://schema.org', '@graph': [
    { '@type': 'WebSite', '@id': `${SITE}/#website`, url: `${SITE}/`, name: BRAND, description: HOME_DESC, inLanguage: 'en-GB', publisher: person },
    courseNode,
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: BRAND, item: `${SITE}/` }] },
  ] },
});
const noscript = `<noscript>
<div style="max-width:720px;margin:48px auto;padding:0 20px;font-family:system-ui,sans-serif;line-height:1.6">
<h1>${esc(BRAND)} · By ${esc(AUTHOR)}</h1>
<p>${esc(HOME_DESC)}</p>
<p><strong>JavaScript is needed</strong> to run Python in the browser. Please turn it on and reload this page.</p>
<h2>Modules</h2>
<ul>${PP.modules.map((m) => `<li><strong>${esc(m.title)}</strong>: ${esc(m.blurb)}<ul>${m.lessons.map((l) => `<li><a href="/learn/${l.id}/">${esc(l.title)}</a></li>`).join('')}</ul></li>`).join('')}</ul>
</div>
</noscript>`;
let idx = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
idx = idx.replace(/<title>[\s\S]*?<\/title>/, '<!--SEO-->\n<!--/SEO-->');
if (!/<!--SEO-->/.test(idx)) throw new Error('could not place SEO markers in index.html');
idx = idx.replace(/<!--SEO-->[\s\S]*?<!--\/SEO-->/, `<!--SEO-->\n${homeBlock}\n<!--/SEO-->`);
// remove the plain meta tags we now emit inside the block (avoid duplicates)
idx = idx.replace(/<meta charset="utf-8">\s*<meta name="viewport"[^>]*>\s*<meta name="theme-color"[^>]*>\s*(?=<!--SEO-->)/, '');
idx = idx.replace(/<noscript>[\s\S]*?<\/noscript>\s*/g, '');
idx = idx.replace(/<body>/, `<body>\n${noscript}`);
if (!/<meta charset/.test(idx)) idx = idx.replace('<head>', '<head>');
fs.writeFileSync(path.join(root, 'index.html'), idx);

/* ---------- 2. one page per lesson ---------- */
const lessonCss = `
@media (prefers-color-scheme: dark){body{background:#14171a;color:#e8e9eb}.top{border-color:#2a2f35}.top a{color:#e8e9eb}.eb,a{color:#5ab9c5}.lede{color:#b5bac1}.meta,.top small{color:#868d97}.pn{border-color:#2a2f35}.btn{background:#1f7f8c;color:#fff}}
body{margin:0;background:#fff;color:#16181c;font:16px/1.65 "IBM Plex Sans",system-ui,sans-serif}
.w{max-width:760px;margin:0 auto;padding:36px 22px 80px}
.top{border-bottom:1px solid #e2e3e0;padding:14px 22px;font-family:"IBM Plex Serif",Georgia,serif;font-weight:600;font-size:19px}
.top a{color:#16181c;text-decoration:none}.top small{font:400 13px "IBM Plex Sans",sans-serif;color:#7b818b;margin-left:10px}
.eb{font-size:12.5px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#0e5a63}
h1{font-family:"IBM Plex Serif",Georgia,serif;font-size:34px;line-height:1.2;margin:10px 0 8px}
h2{font-family:"IBM Plex Serif",Georgia,serif;font-size:21px;margin:34px 0 8px}
.lede{font-size:18px;color:#494e56}
.btn{display:inline-block;background:#0e5a63;color:#fff;padding:11px 22px;border-radius:6px;text-decoration:none;font-weight:500;margin:18px 0}
ul{padding-left:22px}a{color:#0e5a63}
.pn{display:flex;justify-content:space-between;gap:16px;margin-top:46px;padding-top:22px;border-top:1px solid #e2e3e0;flex-wrap:wrap}
.meta{color:#7b818b;font-size:14px}`;

fs.rmSync(path.join(root, 'learn'), { recursive: true, force: true });
all.forEach(({ m, l }, i) => {
  const intro = plain(l.intro || l.summary || '');
  const desc = clip(`${l.title}: ${plain(l.summary || '')}. ${intro}`.replace(/\.\./g, '.'), 152);
  const title = `${l.title} · By ${AUTHOR}`;
  const heads = l.blocks.filter((b) => b.t === 'h' || b.t === 'h2').map((b) => plain(b.text)).filter(Boolean);
  const counts = { exercise: 0, predict: 0, quiz: 0 };
  l.blocks.forEach((b) => { if (counts[b.t] !== undefined) counts[b.t]++; });
  const prev = all[i - 1], next = all[i + 1];
  const canonical = url(l.id);
  const app = `/#/learn/${l.id}`;
  const jsonld = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'LearningResource', '@id': `${canonical}#lesson`, name: l.title, description: desc, url: canonical, inLanguage: 'en-GB', learningResourceType: 'Lesson', educationalLevel: 'Edexcel International GCSE', teaches: l.summary || l.title, timeRequired: isoDuration(l.time), isAccessibleForFree: true, author: person, isPartOf: { '@id': `${SITE}/#course` }, image: IMG },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: BRAND, item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: m.title, item: `${SITE}/learn/${m.lessons[0].id}/` },
      { '@type': 'ListItem', position: 3, name: l.title, item: canonical }] },
  ] };
  const html = `<!doctype html>
<html lang="en-GB">
<head>
${head({ title, desc, canonical, type: 'article', jsonld, extra: '<link rel="stylesheet" href="/vendor/fonts/fonts.css">\n' })}
<style>${lessonCss}</style>
</head>
<body>
<div class="top"><a href="/">${esc(BRAND)}</a><small>By ${esc(AUTHOR)} · for ${esc(SCHOOL)}</small></div>
<main class="w">
<div class="eb">Module ${String(PP.modules.indexOf(m)).padStart(2, '0')} · ${esc(m.title)}</div>
<h1>${esc(l.title)}</h1>
<p class="lede">${esc(intro)}</p>
<p class="meta">${[l.time, l.book && 'Textbook ' + l.book, l.exam && 'Exam: ' + l.exam].filter(Boolean).map(esc).join(' · ')}</p>
<a class="btn" id="open" href="${app}">Open the interactive lesson</a>
${heads.length ? `<h2>In this lesson</h2>\n<ul>${heads.map((h2) => `<li>${esc(h2)}</li>`).join('')}</ul>` : ''}
<p class="meta">${counts.exercise} coding exercises · ${counts.predict} predict-the-output tasks · ${counts.quiz} quick checks. Run real Python right in your browser.</p>
<nav class="pn" aria-label="Lessons">
${prev ? `<a href="/learn/${prev.l.id}/">← ${esc(prev.l.title)}</a>` : '<span></span>'}
<a href="/">All lessons</a>
${next ? `<a href="/learn/${next.l.id}/">${esc(next.l.title)} →</a>` : '<span></span>'}
</nav>
</main>
<script>if(!/bot|crawl|spider|slurp|facebookexternalhit|whatsapp|telegram|preview|embed|linkedin|twitter|discord|slack|google|bing|yandex|baidu|duckduck/i.test(navigator.userAgent)){location.replace(${JSON.stringify(app)});}</script>
</body>
</html>
`;
  const dir = path.join(root, 'learn', l.id);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
});

/* ---------- 3. sitemap, robots, manifest ---------- */
const urls = [{ loc: `${SITE}/`, pri: '1.0' }].concat(all.map(({ l }) => ({ loc: url(l.id), pri: '0.8' })));
fs.writeFileSync(path.join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>${u.pri}</priority></url>`).join('\n')}\n</urlset>\n`);
fs.writeFileSync(path.join(root, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /tools/\nDisallow: /vendor/pyodide/\n\nSitemap: ${SITE}/sitemap.xml\n`);
fs.writeFileSync(path.join(root, 'site.webmanifest'), JSON.stringify({
  name: `${BRAND} by ${AUTHOR}`, short_name: BRAND, description: HOME_DESC, start_url: '/', scope: '/', display: 'standalone',
  background_color: '#ffffff', theme_color: '#0e5a63', lang: 'en-GB',
  icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }],
}, null, 2) + '\n');

console.log(`SEO files written for ${SITE}`);
console.log(`  index.html head block, ${all.length} lesson pages in learn/, sitemap.xml (${urls.length} URLs), robots.txt, site.webmanifest`);
if (placeholder) console.log('\n  !! The address is still a placeholder. After your first deploy run:\n     node tools/build-seo.js https://YOUR-REAL-ADDRESS.vercel.app');
