// Baked paper tiles kept across page loads, in IndexedDB.
//
// One entry per page path: the latest bake of that page, under the
// fingerprint of everything it was drawn from (baked-background.js). A load
// whose fingerprint matches shows the stored tiles without drawing anything.
// Entries are evicted least recently used past LIMIT_BYTES.

const DATABASE = 'paper-bakes';
const VERSION = 1;
const LIMIT_BYTES = 256 * 1024 * 1024;

const request = (operation) => new Promise((resolve, reject) => {
  operation.onsuccess = () => resolve(operation.result);
  operation.onerror = () => reject(operation.error);
});

const finished = (transaction) => new Promise((resolve, reject) => {
  transaction.oncomplete = () => resolve();
  transaction.onerror = () => reject(transaction.error);
  transaction.onabort = () => reject(transaction.error ?? Error('Paper bake cache transaction aborted'));
});

// A 106-bit string hash (two 53-bit cyrb53 lanes). Fingerprints only need to
// tell bakes apart, not resist anyone constructing collisions.
export function fingerprint(text) {
  const lane = (seed) => {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0; i < text.length; i++) {
      const c = text.charCodeAt(i);
      h1 = Math.imul(h1 ^ c, 2654435761);
      h2 = Math.imul(h2 ^ c, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
  };
  return `${lane(1)}-${lane(2)}`;
}

export class BakeCache {
  constructor() {
    // Storage can be unavailable (private windows, blocked site data); the
    // page then bakes on every load, as it would on a first visit.
    this.database = new Promise((resolve) => {
      if (typeof indexedDB === 'undefined') return resolve(null);
      const open = indexedDB.open(DATABASE, VERSION);
      open.onupgradeneeded = () => {
        open.result.createObjectStore('meta');
        open.result.createObjectStore('tiles');
      };
      open.onsuccess = () => {
        const database = open.result;
        // Another page deleting or upgrading the database: let it.
        database.onversionchange = () => { database.close(); this.database = Promise.resolve(null); };
        resolve(database);
      };
      open.onerror = () => resolve(null);
      open.onblocked = () => resolve(null);
    });
  }

  available() {
    return this.database;
  }

  /** Stored tile blobs for `key` drawn from `signature`, or null. */
  async get(key, signature) {
    const database = await this.available();
    if (!database) return null;
    const transaction = database.transaction(['meta', 'tiles'], 'readwrite');
    const meta = await request(transaction.objectStore('meta').get(key));
    if (meta?.signature !== signature) {
      transaction.abort();
      return null;
    }
    const tiles = await request(transaction.objectStore('tiles').get(key));
    transaction.objectStore('meta').put({ ...meta, used: Date.now() }, key);
    await finished(transaction);
    if (!Array.isArray(tiles) || tiles.length !== meta.count) throw Error(`Paper bake cache entry for ${key} is incomplete`);
    return tiles;
  }

  async put(key, signature, tiles) {
    const database = await this.available();
    if (!database) return;
    const bytes = tiles.reduce((sum, blob) => sum + blob.size, 0);
    if (bytes > LIMIT_BYTES) return;
    const transaction = database.transaction(['meta', 'tiles'], 'readwrite');
    const metaStore = transaction.objectStore('meta'), tileStore = transaction.objectStore('tiles');
    metaStore.put({ signature, count: tiles.length, bytes, used: Date.now() }, key);
    tileStore.put(tiles, key);
    const [keys, metas] = await Promise.all([request(metaStore.getAllKeys()), request(metaStore.getAll())]);
    const entries = keys.map((name, i) => ({ name, ...metas[i] })).sort((a, b) => a.used - b.used);
    let total = entries.reduce((sum, entry) => sum + entry.bytes, 0);
    for (const entry of entries) {
      if (total <= LIMIT_BYTES) break;
      if (entry.name === key) continue;
      metaStore.delete(entry.name);
      tileStore.delete(entry.name);
      total -= entry.bytes;
    }
    await finished(transaction);
  }
}
