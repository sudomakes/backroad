/**
 * Generic blob cache backed by IndexedDB.
 *
 * The store is per-origin, so it is shared across every docs page. We use it to
 * persist the WebContainer **npm store** (npm's content-addressed package cache)
 * between runs: each install reuses every package any sandbox has downloaded
 * before — regardless of its dependency set — and writes back anything new. Over
 * time the store converges so no page hits the network to resolve or download
 * again; only the (cheap, offline) extract+link step runs per sandbox.
 *
 * Every helper swallows its own errors (quota, private-mode): caching is purely
 * an optimization and must never fail a run.
 */
const DB_NAME = 'backroad-sandbox';
const DB_VERSION = 2;
const STORE_NAME = 'blobs';
// v1 kept a per-dependency-set node_modules snapshot here; superseded by the
// shared npm store, so it's dropped on upgrade to reclaim the space.
const LEGACY_STORE = 'node-modules-snapshots';

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
      if (db.objectStoreNames.contains(LEGACY_STORE)) {
        db.deleteObjectStore(LEGACY_STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function loadBlob(key: string): Promise<Uint8Array | null> {
  try {
    const db = await openDb();
    return await new Promise<Uint8Array | null>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get(key);
      req.onsuccess = () => resolve((req.result as Uint8Array) ?? null);
      req.onerror = () => reject(req.error);
      tx.oncomplete = () => db.close();
    });
  } catch {
    return null;
  }
}

export async function saveBlob(key: string, data: Uint8Array): Promise<void> {
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put(data, key);
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // best-effort; ignore quota / availability errors
  }
}
