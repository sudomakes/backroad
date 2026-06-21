import type { BackroadConfig } from '@backroad/core';
import express from 'express';
import formidable from 'formidable';
import { createSessionManager } from './sessions/session-manager';
import { inferMimeType } from './mime';

type SessionManager = ReturnType<typeof createSessionManager>;

/**
 * Build the express Router that carries every Backroad HTTP route: the better-
 * auth handler, the health probe, static assets, the upload sink, the on-demand
 * download endpoint and the SPA fallback. Kept separate from build.ts so the
 * HTTP surface is one cohesive unit, independent of the Socket.IO wiring and the
 * mountable-handler plumbing.
 */
export const createBackroadRouter = ({
  authConfig,
  publicDir,
  sessionManager,
  renderIndexHtml,
}: {
  authConfig: NonNullable<BackroadConfig>['auth'] | undefined;
  publicDir: string;
  sessionManager: SessionManager;
  renderIndexHtml: () => string;
}): express.Router => {
  const router = express.Router();

  // Mount better-auth handler BEFORE any body parser / static handler so the
  // raw request body reaches better-auth. Loaded lazily so users without auth
  // never need to install better-auth.
  if (authConfig) {
    const { toNodeHandler } =
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('better-auth/node') as typeof import('better-auth/node');
    router.all('/api/auth/*', toNodeHandler(authConfig.instance));
  }

  // Tiny readiness probe — handy for Docker/orchestrator health checks and
  // used by Playwright's webServer wait in CI.
  router.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  router.use(express.static(publicDir, { index: false }));

  router.post('/api/uploads', (req, res) => {
    const form = formidable({});
    form.parse<'sessionId' | 'id', 'files'>(req, (err, fields, files) => {
      if (err) {
        return res.status(400).json({ error: 'invalid upload payload' });
      }
      const sessionId = fields.sessionId?.[0];
      const id = fields.id?.[0];
      if (!sessionId || !id) {
        return res.status(400).json({ error: 'sessionId and id are required' });
      }
      const session = sessionManager.getSession(sessionId);
      if (!session) {
        return res.status(404).json({ error: 'session not found' });
      }
      const value = files.files || [];
      session.setValue(id, value);
      return res.json(value);
    });
  });

  // On-demand download for br.downloadButton. The payload lives in session
  // state (never in the component tree), so it crosses the wire only when the
  // user actually clicks — streamed here with an attachment disposition.
  router.get('/api/download/:sessionId/:id', async (req, res) => {
    const session = sessionManager.getSession(req.params.sessionId);
    const download = session?.getDownload(req.params.id);
    if (!download) {
      return res.status(404).json({ error: 'download not found' });
    }
    let content: string | Uint8Array;
    try {
      content = await download.data();
    } catch (err) {
      console.error('download_button payload failed to generate', err);
      return res.status(500).json({ error: 'failed to generate download' });
    }
    const filename = download.filename ?? 'download';
    res.setHeader('Content-Type', download.mime ?? inferMimeType(filename));
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(filename)}"`
    );
    return res.send(
      typeof content === 'string' || Buffer.isBuffer(content)
        ? content
        : Buffer.from(content)
    );
  });

  // SPA fallback — serve the (base-path-patched) index.html for non-API GETs.
  // Unknown /api/* paths must 404 as API misses, not get the SPA document.
  router.get('*', (req, res) => {
    if (req.path === '/api' || req.path.startsWith('/api/')) {
      return res.status(404).json({ error: 'not found' });
    }
    res.setHeader('Content-Type', 'text/html');
    return res.send(renderIndexHtml());
  });

  return router;
};
