import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const distDir = path.join(__dirname, 'dist');
const isProduction = process.env.NODE_ENV === 'production' || fs.existsSync(distDir);

app.use(express.json());

// Health check endpoint for Cloud Run
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    name: 'GlobalLove.com',
    timestamp: new Date().toISOString(),
  });
});

async function startServer() {
  if (isProduction && fs.existsSync(distDir)) {
    // Serve pre-rendered directory index.html for static SEO routes first
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api/')) {
        next();
        return;
      }

      const cleanPath = req.path.replace(/\/+$/, '') || '/';
      const prerenderedFile =
        cleanPath === '/'
          ? path.join(distDir, 'index.html')
          : path.join(distDir, cleanPath.replace(/^\//, ''), 'index.html');

      if (fs.existsSync(prerenderedFile)) {
        res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400');
        res.sendFile(prerenderedFile);
        return;
      }

      next();
    });

    // Serve production static assets from dist
    app.use(express.static(distDir, { index: 'index.html' }));

    // SPA fallback for logged-in / dynamic client routes
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  } else {
    // In development mode, mount Vite middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GlobalLove.com server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
