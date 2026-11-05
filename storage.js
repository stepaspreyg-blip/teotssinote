/*
 * TeotssiNote storage adapter.
 * The app only calls window.TeotStorage.load/save; when Supabase is configured,
 * these methods can be replaced with authenticated cloud implementations.
 * IndexedDB stores image data. This is local-only and NOT cross-device sync.
 */
(function () {
  const DATABASE = 'teotssinote-prototype-db';
  const STORE = 'documents';
  const RECORD = 'application-state-v1';
  let connection;
  let fallback = false;
  function open() {
    if (connection) return connection;
    connection = new Promise((resolve, reject) => {
      if (!window.indexedDB) return reject(new Error('IndexedDB unavailable'));
      const req = indexedDB.open(DATABASE, 1);
      req.onupgradeneeded = () => req.result.createObjectStore(STORE);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return connection;
  }
  async function indexed(mode, value) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, mode);
      const req = mode === 'readonly' ? tx.objectStore(STORE).get(RECORD) : tx.objectStore(STORE).put(value, RECORD);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
      tx.onerror = () => reject(tx.error);
    });
  }
  window.TeotStorage = {
    type: 'local-indexeddb',
    async load() {
      try { return await indexed('readonly'); }
      catch (err) {
        console.warn('IndexedDB disabled, localStorage fallback', err);
        fallback = true;
        try { return JSON.parse(localStorage.getItem(RECORD) || 'null'); } catch (_) { return null; }
      }
    },
    async save(data) {
      if (!fallback) {
        try { return await indexed('readwrite', data); }
        catch (err) { console.warn('IndexedDB failed', err); fallback = true; }
      }
      localStorage.setItem(RECORD, JSON.stringify(data));
    },
    isLocalOnly: () => true
  };
})();
