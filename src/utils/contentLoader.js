// src/utils/contentLoader.js
// The one place the app fetches content. Today it uses the catalogue's local
// dynamic imports; when content moves to Firestore, only this file changes.

const cache = new Map();

export async function loadContent(entry) {
  if (!entry || typeof entry.load !== 'function') {
    throw new Error(`No loader for content: ${entry && entry.id}`);
  }
  if (!cache.has(entry.id)) {
    const promise = entry.load().then((mod) => mod.default || mod);
    cache.set(entry.id, promise);
    promise.catch(() => cache.delete(entry.id)); // allow retry after a failed load
  }
  return cache.get(entry.id);
}
