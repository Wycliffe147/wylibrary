/* Wylibrary — "Save for offline" storage.
 *
 * Saved files live in their own Cache Storage bucket (never touched by app
 * updates) under a key built from the file's stable ID, NOT its path. Details
 * about each saved file (id, current path, name, size, status) live in
 * IndexedDB. Because the key is the ID, renaming or moving a file in the
 * library never orphans a saved copy: reconcile() simply updates the path.
 */
(function (global) {
    'use strict';

    var BUCKET = 'wylibrary-user-documents';
    var DB_NAME = 'wylibrary-offline';
    var STORE = 'docs';
    var KEY_PREFIX = '/_saved/';

    function norm(p) { return (p || '').replace(/\\/g, '/'); }
    function keyFor(id) { return KEY_PREFIX + encodeURIComponent(id); }

    // ── Pure logic (unit-tested in Node) ─────────────────────────────────────

    /**
     * Decide what happened to each saved doc given the latest catalog.
     * Catalog entries look like { id?, path, name?, size?, version? }.
     * When the catalog has no ids yet, the path acts as the id.
     * Returns a list of { id, newId, path, name, status } where status is
     *   'ok' | 'outdated' | 'removed'.
     */
    function planReconcile(savedDocs, catalog) {
        var byId = new Map();
        var byPath = new Map();
        (catalog || []).forEach(function (e) {
            var p = norm(e.path);
            byPath.set(p, e);
            if (e.id) byId.set(e.id, e);
        });

        return (savedDocs || []).map(function (doc) {
            var entry = byId.get(doc.id) || byPath.get(norm(doc.path));
            if (!entry) {
                return { id: doc.id, newId: doc.id, path: doc.path, name: doc.name, status: 'removed' };
            }
            var newId = entry.id || doc.id;
            var path = norm(entry.path);
            var name = entry.name || path.split('/').pop();
            var status = 'ok';
            if (entry.size != null && doc.size != null && entry.size !== doc.size) status = 'outdated';
            if (entry.version && doc.version && entry.version !== doc.version) status = 'outdated';
            return { id: doc.id, newId: newId, path: path, name: name, status: status };
        });
    }

    // ── IndexedDB helpers ────────────────────────────────────────────────────

    var dbPromise = null;
    function openDb() {
        if (!dbPromise) {
            dbPromise = new Promise(function (resolve, reject) {
                var req = indexedDB.open(DB_NAME, 1);
                req.onupgradeneeded = function () {
                    req.result.createObjectStore(STORE, { keyPath: 'id' });
                };
                req.onsuccess = function () { resolve(req.result); };
                req.onerror = function () { dbPromise = null; reject(req.error); };
            });
        }
        return dbPromise;
    }

    function tx(mode, fn) {
        return openDb().then(function (db) {
            return new Promise(function (resolve, reject) {
                var t = db.transaction(STORE, mode);
                var request = fn(t.objectStore(STORE));
                t.oncomplete = function () { resolve(request ? request.result : undefined); };
                t.onerror = function () { reject(t.error); };
                t.onabort = function () { reject(t.error); };
            });
        });
    }

    // ── State ────────────────────────────────────────────────────────────────

    var saved = new Map();      // id -> doc
    var readyPromise = null;

    function supported() {
        return typeof caches !== 'undefined' && typeof indexedDB !== 'undefined';
    }

    function changed() {
        try { global.dispatchEvent(new CustomEvent('wyoffline:changed')); } catch (e) { /* ignore */ }
    }

    function ready() {
        if (!readyPromise) {
            readyPromise = !supported()
                ? Promise.resolve()
                : tx('readonly', function (s) { return s.getAll(); })
                    .then(function (docs) {
                        saved = new Map((docs || []).map(function (d) { return [d.id, d]; }));
                    })
                    .catch(function (e) { console.warn('Offline store unavailable:', e); });
        }
        return readyPromise;
    }

    function get(id) { return saved.get(id) || null; }

    function find(id, path) {
        if (id && saved.has(id)) return saved.get(id);
        var p = norm(path);
        var hit = null;
        saved.forEach(function (d) { if (!hit && norm(d.path) === p) hit = d; });
        return hit;
    }

    function list() {
        return Array.from(saved.values()).sort(function (a, b) {
            return norm(a.path).localeCompare(norm(b.path), undefined, { numeric: true, sensitivity: 'base' });
        });
    }

    function count() { return saved.size; }

    // ── Save / remove ────────────────────────────────────────────────────────

    function resolveSource(entry) {
        var ext = (entry.name || entry.path || '').split('.').pop().toLowerCase();
        // Same-origin proxy: streams the file through Pages, so it never needs R2 CORS headers.
        var fallback = '/api/download?file=' + encodeURIComponent(entry.path) + '&mode=download';
        if (ext !== 'pdf') return Promise.resolve([fallback]);
        // PDFs: use the direct storage URL, the same one the PDF viewer uses.
        return fetch('/api/pdf-url?file=' + encodeURIComponent(entry.path))
            .then(function (r) { return r.ok ? r.json() : null; })
            .then(function (d) { return (d && d.url) ? [d.url, fallback] : [fallback]; })
            .catch(function () { return [fallback]; });
    }

    // Try each source in order. A direct storage URL can fail with a bare
    // "Failed to fetch" (missing CORS header, stale CDN copy); the same-origin
    // proxy is the safety net.
    function fetchFirstWorking(urls) {
        var lastErr = null;
        return urls.reduce(function (chain, url) {
            return chain.catch(function () {
                return fetch(url).then(function (res) {
                    if (!res.ok) throw new Error('Could not download the file (' + res.status + ').');
                    return res;
                });
            });
        }, Promise.reject(null)).catch(function (err) {
            throw err || new Error('Could not download the file.');
        });
    }

    function guessType(name) {
        var ext = (name || '').split('.').pop().toLowerCase();
        var map = {
            pdf: 'application/pdf', doc: 'application/msword',
            docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            xls: 'application/vnd.ms-excel',
            xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ppt: 'application/vnd.ms-powerpoint',
            pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        };
        return map[ext] || 'application/octet-stream';
    }

    function checkQuota(neededBytes) {
        if (!neededBytes || !navigator.storage || !navigator.storage.estimate) return Promise.resolve();
        return navigator.storage.estimate().then(function (est) {
            if (est && est.quota && (est.quota - (est.usage || 0)) < neededBytes * 1.1) {
                throw new Error('Not enough free storage on this device.');
            }
        });
    }

    /**
     * entry: { id, path, name, size, version }
     * onProgress(fraction 0..1) is optional.
     */
    function save(entry, onProgress) {
        if (!supported()) return Promise.reject(new Error('Offline saving is not supported in this browser.'));
        var id = entry.id;
        var key = keyFor(id);
        // Updating an existing copy? Write beside it and swap on success, so a
        // failed update can never destroy the good copy the user already has.
        var replacing = saved.has(id);
        var writeKey = replacing ? key + '~new' : key;
        var cache;

        return ready()
            .then(function () { return checkQuota(entry.size); })
            .then(function () {
                if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(function () {});
                return Promise.all([caches.open(BUCKET), resolveSource(entry)]);
            })
            .then(function (r) {
                cache = r[0];
                return fetchFirstWorking(r[1]);
            })
            .then(function (res) {
                var lenHeader = Number(res.headers.get('Content-Length')) || 0;
                var encoded = !!res.headers.get('Content-Encoding');
                var total = lenHeader || entry.size || 0;
                var received = 0;
                var type = res.headers.get('Content-Type');
                if (!type || type === 'application/octet-stream') type = guessType(entry.name);
                var headers = new Headers({ 'Content-Type': type });

                var body = res.body;
                if (body && typeof TransformStream !== 'undefined' && body.pipeThrough) {
                    // Stream straight to disk (no big in-memory copy) while counting bytes.
                    var counter = new TransformStream({
                        transform: function (chunk, ctl) {
                            received += chunk.byteLength;
                            if (onProgress && total) onProgress(Math.min(received / total, 1));
                            ctl.enqueue(chunk);
                        }
                    });
                    return cache.put(writeKey, new Response(body.pipeThrough(counter), { headers: headers }))
                        .then(function () { return { lenHeader: lenHeader, encoded: encoded }; });
                }
                return res.blob().then(function (blob) {
                    return cache.put(writeKey, new Response(blob, { headers: headers }))
                        .then(function () { return { lenHeader: lenHeader, encoded: encoded }; });
                });
            })
            .then(function (meta) {
                // Verify the copy is complete before we call it saved.
                return cache.match(writeKey).then(function (r) { return r.blob(); }).then(function (blob) {
                    if (meta.lenHeader && !meta.encoded && blob.size !== meta.lenHeader) {
                        throw new Error('Download was incomplete. Please try again.');
                    }
                    if (!blob.size) throw new Error('Downloaded file was empty.');
                    return blob.size;
                });
            })
            .then(function (bytes) {
                if (!replacing) return bytes;
                return cache.match(writeKey).then(function (r) { return cache.put(key, r); })
                    .then(function () { return cache.delete(writeKey); })
                    .then(function () { return bytes; });
            })
            .then(function (bytes) {
                var doc = {
                    id: id,
                    path: norm(entry.path),
                    name: entry.name || norm(entry.path).split('/').pop(),
                    size: entry.size != null ? entry.size : bytes,
                    bytes: bytes,
                    version: entry.version || null,
                    savedAt: Date.now(),
                    status: 'ok'
                };
                return tx('readwrite', function (s) { return s.put(doc); }).then(function () {
                    saved.set(id, doc);
                    changed();
                    return doc;
                });
            })
            .catch(function (err) {
                // Never leave a half-written copy behind (the old good copy, if any, is untouched).
                if (cache) cache.delete(writeKey).catch(function () {});
                throw err;
            });
    }

    function remove(id) {
        return ready().then(function () {
            return caches.open(BUCKET);
        }).then(function (cache) {
            return cache.delete(keyFor(id));
        }).then(function () {
            return tx('readwrite', function (s) { return s.delete(id); });
        }).then(function () {
            saved.delete(id);
            changed();
        });
    }

    // ── Reading a saved copy ─────────────────────────────────────────────────

    function getBlob(id) {
        return caches.open(BUCKET).then(function (c) { return c.match(keyFor(id)); })
            .then(function (res) {
                if (!res) throw new Error('Saved copy not found.');
                return res.blob();
            });
    }

    function getBlobUrl(id) {
        return getBlob(id).then(function (b) { return URL.createObjectURL(b); });
    }

    function exportFile(id, name) {
        return getBlob(id).then(function (blob) {
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = name || 'document';
            document.body.appendChild(a);
            a.click();
            a.remove();
            setTimeout(function () { URL.revokeObjectURL(url); }, 60000);
        });
    }

    // ── Reconcile against the latest catalog ─────────────────────────────────

    function rekey(oldId, newId) {
        if (oldId === newId) return Promise.resolve();
        return caches.open(BUCKET).then(function (cache) {
            return cache.match(keyFor(oldId)).then(function (res) {
                if (!res) return;
                return cache.put(keyFor(newId), res).then(function () { return cache.delete(keyFor(oldId)); });
            });
        });
    }

    function reconcile(catalog) {
        if (!supported() || !catalog || !catalog.length) return Promise.resolve(false);
        return ready().then(function () {
            var docs = Array.from(saved.values());
            var plan = planReconcile(docs, catalog);
            var byId = new Map(docs.map(function (d) { return [d.id, d]; }));
            var any = false;

            return plan.reduce(function (chain, step) {
                return chain.then(function () {
                    var doc = byId.get(step.id);
                    if (!doc) return;
                    var next = Object.assign({}, doc, {
                        id: step.newId, path: step.path, name: step.name, status: step.status
                    });
                    var same = next.id === doc.id && next.path === doc.path &&
                               next.name === doc.name && next.status === doc.status;
                    if (same) return;
                    any = true;
                    return rekey(doc.id, next.id).then(function () {
                        return tx('readwrite', function (s) {
                            if (next.id !== doc.id) s.delete(doc.id);
                            return s.put(next);
                        });
                    }).then(function () {
                        saved.delete(doc.id);
                        saved.set(next.id, next);
                    });
                });
            }, Promise.resolve()).then(function () {
                if (any) changed();
                return any;
            });
        }).catch(function (e) { console.warn('Offline reconcile failed:', e); return false; });
    }

    var api = {
        BUCKET: BUCKET,
        planReconcile: planReconcile,
        isSupported: supported,
        ready: ready,
        get: get,
        find: find,
        list: list,
        count: count,
        save: save,
        remove: remove,
        getBlobUrl: getBlobUrl,
        exportFile: exportFile,
        reconcile: reconcile
    };

    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    global.WyOffline = api;
})(typeof window !== 'undefined' ? window : globalThis);
