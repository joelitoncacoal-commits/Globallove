import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import dotenv from 'dotenv';
import { COUNTRIES } from '../src/data/countries';
import { PAISES_DETALHES, CIDADES } from '../src/data/paises';
import { GUIAS } from '../src/data/guias';
import { slugifyCountry } from '../src/data/seoKeywords';

dotenv.config({ path: '.env.local' });
dotenv.config();

const ROOT_DIR = process.cwd();
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

const SITE_URL = String(process.env.VITE_SITE_URL || 'https://globallove.vercel.app')
  .trim()
  .replace(/\/+$/, '');

const BING_CODE = String(process.env.VITE_BING_VERIFICATION || '').trim();
const LASTMOD = new Date().toISOString().split('T')[0];

function buildStaticRoutes(): { route: string; priority: string; changefreq: string }[] {
  const routes: { route: string; priority: string; changefreq: string }[] = [
    { route: '/', priority: '1.0', changefreq: 'daily' },
    { route: '/mapa', priority: '0.9', changefreq: 'daily' },
    { route: '/mural', priority: '0.8', changefreq: 'daily' },
    { route: '/planos', priority: '0.8', changefreq: 'weekly' },
    { route: '/guias', priority: '0.9', changefreq: 'weekly' },
    { route: '/sobre', priority: '0.7', changefreq: 'monthly' },
    { route: '/seguranca', priority: '0.8', changefreq: 'monthly' },
    { route: '/privacidade', priority: '0.6', changefreq: 'monthly' },
    { route: '/termos', priority: '0.6', changefreq: 'monthly' },
    { route: '/contato', priority: '0.7', changefreq: 'monthly' },
    { route: '/en/dating', priority: '0.8', changefreq: 'weekly' },
    { route: '/es/citas', priority: '0.8', changefreq: 'weekly' },
    { route: '/fr/rencontre', priority: '0.8', changefreq: 'weekly' },
    { route: '/de/dating', priority: '0.8', changefreq: 'weekly' },
    { route: '/it/incontri', priority: '0.8', changefreq: 'weekly' },
    { route: '/ja/deai', priority: '0.8', changefreq: 'weekly' },
  ];

  const seen = new Set(routes.map((r) => r.route));

  for (const guia of GUIAS) {
    const r = `/guias/${guia.slug}`;
    if (!seen.has(r)) {
      seen.add(r);
      routes.push({ route: r, priority: '0.8', changefreq: 'weekly' });
    }
  }

  for (const cidade of CIDADES) {
    const r = `/cidade/${cidade.slug}`;
    if (!seen.has(r)) {
      seen.add(r);
      routes.push({ route: r, priority: '0.8', changefreq: 'weekly' });
    }
  }

  for (const pais of PAISES_DETALHES) {
    const r = `/pais/${pais.slug}`;
    if (!seen.has(r)) {
      seen.add(r);
      routes.push({ route: r, priority: '0.8', changefreq: 'weekly' });
    }
  }

  for (const country of COUNTRIES) {
    const slug = slugifyCountry(country.name);
    const r = `/pais/${slug}`;
    if (!seen.has(r)) {
      seen.add(r);
      routes.push({ route: r, priority: '0.7', changefreq: 'weekly' });
    }
  }

  return routes;
}

function generateSitemapXml(routes: { route: string; priority: string; changefreq: string }[]): string {
  const urlEntries = routes
    .map(({ route, priority, changefreq }) => {
      const loc = route === '/' ? `${SITE_URL}/` : `${SITE_URL}${route}`;
      return [
        '  <url>',
        `    <loc>${loc}</loc>`,
        `    <lastmod>${LASTMOD}</lastmod>`,
        `    <changefreq>${changefreq}</changefreq>`,
        `    <priority>${priority}</priority>`,
        '  </url>',
      ].join('\n');
    })
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urlEntries,
    '</urlset>',
    '',
  ].join('\n');
}

function generateRobotsTxt(): string {
  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /api/',
    'Disallow: /*?*',
    '',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    '',
  ].join('\n');
}

interface PlaywrightRoute {
  request: () => { url: () => string };
  continue: () => Promise<void>;
  abort: () => Promise<void>;
}

interface PlaywrightPage {
  route: (pattern: string, handler: (route: PlaywrightRoute) => Promise<void> | void) => Promise<void>;
  goto: (url: string, options?: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' }) => Promise<void>;
  waitForFunction: <Arg>(
    fn: (arg: Arg) => boolean,
    arg: Arg,
    options?: { timeout?: number }
  ) => Promise<void>;
  evaluate: <T>(fn: () => T) => Promise<T>;
  content: () => Promise<string>;
}

interface PlaywrightContext {
  newPage: () => Promise<PlaywrightPage>;
  close: () => Promise<void>;
}

interface PlaywrightBrowser {
  newContext: () => Promise<PlaywrightContext>;
  close: () => Promise<void>;
}

interface PlaywrightModule {
  chromium: {
    launch: (options?: { headless?: boolean }) => Promise<PlaywrightBrowser>;
  };
}

async function loadPlaywright(): Promise<PlaywrightModule> {
  const pkgName = 'playwright';
  try {
    return (await import(/* @vite-ignore */ pkgName)) as PlaywrightModule;
  } catch {
    const globalPwPath = '/usr/local/share/bun-global/node_modules/playwright/index.mjs';
    if (fs.existsSync(globalPwPath)) {
      return (await import(/* @vite-ignore */ globalPwPath)) as PlaywrightModule;
    }
    throw new Error('Playwright not found in local node_modules or global bun cache.');
  }
}

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
};

function startDistServer(rawIndexHtml: string): Promise<{ server: http.Server; origin: string }> {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const urlPath = (req.url || '/').split('?')[0];
      const filePath = path.join(DIST_DIR, urlPath);

      if (
        urlPath !== '/' &&
        fs.existsSync(filePath) &&
        fs.statSync(filePath).isFile()
      ) {
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
        fs.createReadStream(filePath).pipe(res);
        return;
      }

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(rawIndexHtml);
    });

    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address();
      if (!addr || typeof addr === 'string') {
        reject(new Error('Failed to bind prerender HTTP server'));
        return;
      }
      resolve({ server, origin: `http://127.0.0.1:${addr.port}` });
    });
  });
}

async function main() {
  if (!fs.existsSync(DIST_DIR)) {
    throw new Error('dist/ directory not found. Run `vite build` before prerendering.');
  }

  const rawIndexPath = path.join(DIST_DIR, 'index.html');
  const rawIndexHtml = fs.readFileSync(rawIndexPath, 'utf-8');
  const routes = buildStaticRoutes();

  // 1. Write sitemap.xml & robots.txt & verification files
  const sitemapXml = generateSitemapXml(routes);
  const robotsTxt = generateRobotsTxt();

  for (const dir of [ROOT_DIR, PUBLIC_DIR, DIST_DIR]) {
    if (fs.existsSync(dir)) {
      fs.writeFileSync(path.join(dir, 'sitemap.xml'), sitemapXml, 'utf-8');
      fs.writeFileSync(path.join(dir, 'robots.txt'), robotsTxt, 'utf-8');
    }
  }

  const googleVerificationPath = path.join(ROOT_DIR, 'google434d2ea4851af8ae.html');
  if (fs.existsSync(googleVerificationPath)) {
    fs.copyFileSync(googleVerificationPath, path.join(DIST_DIR, 'google434d2ea4851af8ae.html'));
  }

  if (BING_CODE) {
    const bingXml = `<?xml version="1.0"?>\n<users>\n\t<user>${BING_CODE}</user>\n</users>\n`;
    fs.writeFileSync(path.join(DIST_DIR, 'BingSiteAuth.xml'), bingXml, 'utf-8');
    fs.writeFileSync(path.join(PUBLIC_DIR, 'BingSiteAuth.xml'), bingXml, 'utf-8');
  }

  // 2. Launch static server + Playwright Chromium worker pool
  const { server, origin } = await startDistServer(rawIndexHtml);
  const pw = await loadPlaywright();
  const browser = await pw.chromium.launch({ headless: true });

  const CONCURRENCY = 8;
  const results = new Map<string, string>();
  const titlesSeen = new Map<string, string>();
  let cursor = 0;

  try {
    const workers = Array.from({ length: CONCURRENCY }, async () => {
      const context = await browser.newContext();
      const page = await context.newPage();

      await page.route('**/*', (route: PlaywrightRoute) => {
        const url = route.request().url();
        if (url.startsWith(origin)) {
          return route.continue();
        }
        return route.abort();
      });

      while (cursor < routes.length) {
        const idx = cursor++;
        const { route } = routes[idx];
        const targetUrl = `${origin}${route}`;

        await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
        await page.waitForFunction(
          (expectedPath: string) => {
            const root = document.getElementById('root');
            const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '';
            const expectedSuffix = expectedPath === '/' ? '/' : expectedPath;
            return (
              Boolean(root && root.children.length > 0) &&
              document.title.length > 5 &&
              canonical.endsWith(expectedSuffix)
            );
          },
          route,
          { timeout: 10000 }
        );

        const metrics = await page.evaluate(() => ({
          title: document.title,
          linksCount: document.querySelectorAll('a[href]').length,
          canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '',
        }));

        if (metrics.linksCount < 25) {
          throw new Error(
            `Prerender gate failed for ${route}: only ${metrics.linksCount} <a href> links found (minimum 25 required).`
          );
        }

        if (!metrics.canonical.startsWith(SITE_URL) || metrics.canonical.includes('?')) {
          throw new Error(
            `Prerender canonical failed for ${route}: got "${metrics.canonical}".`
          );
        }

        if (titlesSeen.has(metrics.title) && titlesSeen.get(metrics.title) !== route) {
          throw new Error(
            `Duplicate <title> "${metrics.title}" on ${route} and ${titlesSeen.get(metrics.title)}`
          );
        }
        titlesSeen.set(metrics.title, route);

        const html = await page.content();
        results.set(route, html);
      }

      await context.close();
    });

    await Promise.all(workers);
  } finally {
    await browser.close();
    server.close();
  }

  // 3. Flush pre-rendered HTML files into dist/
  for (const [route, html] of results.entries()) {
    const outFile =
      route === '/'
        ? path.join(DIST_DIR, 'index.html')
        : path.join(DIST_DIR, route.replace(/^\//, ''), 'index.html');
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    fs.writeFileSync(outFile, html, 'utf-8');
  }

  console.log(
    `Prerendered ${results.size} static routes into dist/ (SITE_URL=${SITE_URL}, sitemap URLs=${routes.length}).`
  );
}

main().catch((err) => {
  console.error('Prerender error:', err);
  process.exit(1);
});
