import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

config(); // load .env so GITHUB_TOKEN is available locally

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use a token if present — raises rate limit from 60 to 5,000 req/hr.
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const authHeaders = GITHUB_TOKEN
    ? { Authorization: `Bearer ${GITHUB_TOKEN}` }
    : {};

const outputFile = path.join(__dirname, 'files-index.json');

const MEDIA_USER = 'Wycliffe147';
const MEDIA_BRANCH = 'main';

// ─── ADD NEW REPOS HERE AS EACH ONE FILLS UP ──────────────────────────────────
// Files are served from whichever repo they were indexed from — order doesn't
// matter. Just create the new repo on GitHub with LFS enabled (same
// .gitattributes as e-library-media), push new files there, and add its name
// to this list, then redeploy.
const MEDIA_REPOS = [
    'e-library-media',
    'e-library-media-2',
    'e-library-media-3',
    'e-library-media-4',
    'e-library-media-5',
];
// ──────────────────────────────────────────────────────────────────────────────

// Limits how many pointer-file fetches run at once, so we don't hammer
// raw.githubusercontent.com with 2000+ simultaneous requests.
const CONCURRENCY = 20;

async function fetchJson(url) {
    const res = await fetch(url, { headers: authHeaders });
    if (!res.ok) {
        throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
    }
    return res.json();
}

// Git LFS pointer files look like:
//   version https://git-lfs.github.com/spec/v1
//   oid sha256:...
//   size 1399011
// Small text blobs (anything under a few hundred bytes) might be a pointer;
// fetch the raw content and pull the real size out of it. Anything that
// isn't a pointer (genuinely small files actually committed to the repo)
// just keeps its reported blob size.
async function getRealSize(blobSize, rawUrl) {
    if (blobSize > 0 && blobSize < 500) {
        try {
            const res = await fetch(rawUrl, { headers: authHeaders });
            if (res.ok) {
                const text = await res.text();
                if (text.includes('https://git-lfs.github.com/spec/')) {
                    const match = text.match(/size\s+(\d+)/);
                    if (match) {
                        return parseInt(match[1], 10);
                    }
                }
            }
        } catch (e) {
            // fall through to reported size if the fetch fails
        }
    }
    return blobSize;
}

async function mapWithConcurrency(items, limit, fn) {
    const results = new Array(items.length);
    let nextIndex = 0;

    async function worker() {
        while (true) {
            const current = nextIndex++;
            if (current >= items.length) return;
            results[current] = await fn(items[current], current);
        }
    }

    const workers = Array.from({ length: Math.min(limit, items.length) }, worker);
    await Promise.all(workers);
    return results;
}

async function buildIndexForRepo(repo) {
    console.log(`Fetching file tree from ${MEDIA_USER}/${repo}@${MEDIA_BRANCH}...`);

    const treeUrl = `https://api.github.com/repos/${MEDIA_USER}/${repo}/git/trees/${MEDIA_BRANCH}?recursive=1`;
    const tree = await fetchJson(treeUrl);

    if (tree.truncated) {
        console.warn(`Warning: tree for ${repo} was truncated by GitHub API; some files may be missing.`);
    }

    const blobs = (tree.tree || []).filter(item => item.type === 'blob' && item.path !== '.gitattributes');

    console.log(`  ${repo}: ${blobs.length} files. Resolving LFS sizes...`);

    const results = await mapWithConcurrency(blobs, CONCURRENCY, async (blob) => {
        const rawUrl = `https://raw.githubusercontent.com/${MEDIA_USER}/${repo}/${MEDIA_BRANCH}/${blob.path}`;
        const realSize = await getRealSize(blob.size, rawUrl);
        return {
            name: path.basename(blob.path),
            path: blob.path,
            size: realSize,
            repo,               // ← which bucket this file lives in
        };
    });

    return results;
}

async function buildIndex() {
    const allResults = [];
    const seenPaths = new Map(); // path → repo, for duplicate detection

    for (const repo of MEDIA_REPOS) {
        const entries = await buildIndexForRepo(repo);

        for (const entry of entries) {
            if (seenPaths.has(entry.path)) {
                // Same relative path exists in two repos — warn and keep the
                // first occurrence (earlier repo in MEDIA_REPOS wins).
                console.warn(
                    `Duplicate path "${entry.path}" found in both ` +
                    `"${seenPaths.get(entry.path)}" and "${entry.repo}". ` +
                    `Keeping the copy from "${seenPaths.get(entry.path)}".`
                );
            } else {
                seenPaths.set(entry.path, entry.repo);
                allResults.push(entry);
            }
        }
    }

    fs.writeFileSync(outputFile, JSON.stringify(allResults, null, 2));
    console.log(`\nIndex generated: ${allResults.length} files across ${MEDIA_REPOS.length} repo(s).`);
}

buildIndex().catch(err => {
    console.error('Failed to generate files-index.json:', err);
    // Write an empty index rather than leaving a stale/missing file, so the
    // site degrades to "0 files" instead of crashing the build.
    fs.writeFileSync(outputFile, JSON.stringify([], null, 2));
    process.exit(0);
});
