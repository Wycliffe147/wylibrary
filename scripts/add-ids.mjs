#!/usr/bin/env node
/**
 * Adds a stable `id` to every entry in files-index.json.
 *
 * Run it AFTER `node generate-index.js` (and after any rename/move/delete):
 *
 *     node scripts/add-ids.mjs
 *
 * How ids stay stable
 *   1. Same path as last time          -> keeps its id (content may have changed;
 *                                          the app detects that through `size`).
 *   2. Path vanished, a new path appears with the same file name + size
 *                                       -> treated as a MOVE, keeps the id.
 *   3. Path vanished, exactly one new path appears with the same size
 *      (and nothing else matches)       -> treated as a RENAME, keeps the id.
 *   4. Anything else                    -> brand-new id.
 *   Ids of deleted files are retired and never reused.
 *
 * The id history lives in public/id-map.json. COMMIT IT, otherwise the next run
 * can't tell a rename from "one file deleted, another added".
 */
import fs from 'node:fs';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const norm = (p) => (p || '').replace(/\\/g, '/');
const baseName = (p) => norm(p).split('/').pop().toLowerCase();

/**
 * Pure function so it can be tested.
 * entries: [{ path, name?, size? }]   oldMap: { [id]: { path, name, size } }
 * Returns { ids: Map<path,id>, map, stats }
 */
export function assignIds(entries, oldMap = {}) {
    const stats = { kept: 0, moved: 0, renamed: 0, added: 0, removed: 0 };
    const ids = new Map();           // normalized path -> id
    const usedIds = new Set();

    const oldByPath = new Map();
    for (const [id, rec] of Object.entries(oldMap)) oldByPath.set(norm(rec.path), id);

    const newPaths = new Set(entries.map((e) => norm(e.path)));

    // 1. Same path -> same id
    const unmatched = [];
    for (const e of entries) {
        const p = norm(e.path);
        const id = oldByPath.get(p);
        if (id && !usedIds.has(id)) {
            ids.set(p, id);
            usedIds.add(id);
            stats.kept++;
        } else {
            unmatched.push(e);
        }
    }

    // Orphans: old ids whose path no longer exists
    const orphans = Object.entries(oldMap)
        .filter(([id, rec]) => !usedIds.has(id) && !newPaths.has(norm(rec.path)))
        .map(([id, rec]) => ({ id, ...rec }));

    const claim = (entry, orphan, kind) => {
        ids.set(norm(entry.path), orphan.id);
        usedIds.add(orphan.id);
        orphans.splice(orphans.indexOf(orphan), 1);
        stats[kind]++;
    };

    // 2. Move: same file name + same size (unique on both sides)
    const key = (name, size) => `${(name || '').toLowerCase()}|${size ?? ''}`;
    const pending = [];
    for (const e of unmatched) {
        const k = key(baseName(e.path), e.size);
        const sameNewCount = unmatched.filter((u) => key(baseName(u.path), u.size) === k).length;
        const cands = orphans.filter((o) => key(baseName(o.path), o.size) === k);
        if (e.size && cands.length === 1 && sameNewCount === 1) claim(e, cands[0], 'moved');
        else pending.push(e);
    }

    // 3. Rename: unique size match on both sides
    const stillNew = [];
    for (const e of pending) {
        if (!e.size) { stillNew.push(e); continue; }
        const sameNewCount = pending.filter((u) => u.size === e.size).length;
        const cands = orphans.filter((o) => o.size === e.size);
        if (cands.length === 1 && sameNewCount === 1) claim(e, cands[0], 'renamed');
        else stillNew.push(e);
    }

    // 4. New ids
    for (const e of stillNew) {
        const p = norm(e.path);
        let id = 'f' + crypto.createHash('sha1').update(p).digest('hex').slice(0, 9);
        let n = 0;
        while (usedIds.has(id) || oldMap[id]) {
            id = 'f' + crypto.createHash('sha1').update(p + '#' + (++n)).digest('hex').slice(0, 9);
        }
        ids.set(p, id);
        usedIds.add(id);
        stats.added++;
    }

    stats.removed = orphans.length;

    const map = {};
    for (const e of entries) {
        const p = norm(e.path);
        map[ids.get(p)] = { path: p, name: e.name || p.split('/').pop(), size: e.size ?? null };
    }
    return { ids, map, stats };
}

function readJson(file) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJsonLike(file, data, originalRaw) {
    const pretty = /\n/.test(originalRaw.trim());
    fs.writeFileSync(file, JSON.stringify(data, null, pretty ? 2 : 0) + (pretty ? '\n' : ''));
}

function main() {
    const args = process.argv.slice(2);
    const candidates = args.length ? args : ['public/files-index.json', 'files-index.json'];
    const files = candidates.filter((f) => fs.existsSync(f));
    if (!files.length) {
        console.error('No files-index.json found. Run generate-index.js first.');
        process.exit(1);
    }

    const MAP_PATH = 'public/id-map.json';
    const oldMap = fs.existsSync(MAP_PATH) ? readJson(MAP_PATH) : {};

    const primaryRaw = fs.readFileSync(files[0], 'utf8');
    const primary = JSON.parse(primaryRaw);
    if (!Array.isArray(primary)) {
        console.error(`${files[0]} is not an array of entries.`);
        process.exit(1);
    }

    const { ids, map, stats } = assignIds(primary, oldMap);

    for (const f of files) {
        const raw = fs.readFileSync(f, 'utf8');
        const data = JSON.parse(raw);
        for (const e of data) e.id = ids.get(norm(e.path)) ?? e.id;
        writeJsonLike(f, data, raw);
        console.log(`Updated ${f} (${data.length} entries)`);
    }

    fs.mkdirSync('public', { recursive: true });
    fs.writeFileSync(MAP_PATH, JSON.stringify(map, null, 1) + '\n');
    console.log(`Wrote ${MAP_PATH}`);
    console.log(
        `ids: ${stats.kept} kept, ${stats.moved} moved, ${stats.renamed} renamed, ` +
        `${stats.added} new, ${stats.removed} removed`
    );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
