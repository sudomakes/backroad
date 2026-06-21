import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Build a renderer for the SPA entry document. index.html is read once and
 * patched per request to carry the mount path: the asset bundle is built with
 * relative URLs (vite base: './'), so a runtime <base href> +
 * window.__BACKROAD_BASE__ is what lets one prebuilt bundle serve from any
 * sub-path.
 */
export const createIndexHtmlRenderer = (publicDir: string, basePath: string) => {
  let indexHtmlRaw: string | undefined;
  return () => {
    if (indexHtmlRaw === undefined) {
      indexHtmlRaw = readFileSync(join(publicDir, 'index.html'), 'utf-8');
    }
    const baseHref = basePath ? `${basePath}/` : '/';
    const inject =
      `<base href="${baseHref}" />` +
      `<script>window.__BACKROAD_BASE__=${JSON.stringify(basePath)};</script>`;
    // Drop any build-time <base> tag, then inject ours right after <head>.
    return indexHtmlRaw
      .replace(/<base\b[^>]*>/i, '')
      .replace(/<head([^>]*)>/i, `<head$1>${inject}`);
  };
};
