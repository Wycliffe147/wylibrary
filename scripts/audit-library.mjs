/**
 * Wylibrary Catalog Audit & Quality Rule Checker
 * Run: npm run audit
 *
 * Encodes all lessons learned from folder-by-folder cleanups to automatically
 * catch misplaced files, casing bugs, duplicate documents, and level classification issues.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const catalogPath = path.join(__dirname, '..', 'public', 'files-index.json');

const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));
console.log(`\n🔍 Auditing Wylibrary Catalog (${catalog.length} files)...\n`);

let issuesCount = 0;

function report(category, items) {
    if (items.length === 0) return;
    issuesCount += items.length;
    console.log(`⚠️  ${category} (${items.length} found):`);
    items.forEach(it => console.log(`   - ${it}`));
    console.log('');
}

// ─── 1. FOLDER CASING MISMATCHES ──────────────────────────────────────────
const folderMap = new Map();
const casingConflicts = [];
catalog.forEach(f => {
    const parts = (f.path || '').split('/');
    if (parts.length > 1) {
        const folder = `${parts[0]}/${parts[1]}`;
        const lower = folder.toLowerCase();
        if (folderMap.has(lower) && folderMap.get(lower) !== folder) {
            const pair = `"${folderMap.get(lower)}" vs "${folder}"`;
            if (!casingConflicts.includes(pair)) casingConflicts.push(pair);
        } else {
            folderMap.set(lower, folder);
        }
    }
});
report('Folder Casing Inconsistencies', casingConflicts);

// ─── 2. ZIPs IN BOOKS FOLDER ──────────────────────────────────────────────
const zipsInBooks = catalog
    .filter(f => f.path.startsWith('Books/') && f.path.toLowerCase().endsWith('.zip'))
    .map(f => f.path);
report('ZIP Files sitting in Books/ (belong in Zips/)', zipsInBooks);

// ─── 3. EXAMS MISTAKENLY IN BOOKS ─────────────────────────────────────────
// Exclude revision books or study text that legitimately discuss exams
const legitimateBookKeywords = /practical examination questions|study guide|revision booklet|syllabus/i;
const examRegex = /\b(MANEB|MOCK|PAPER\s*[123I]|PAST\s*PAPERS?|ANSWER_)\b/i;
const examsInBooks = catalog
    .filter(f => f.path.startsWith('Books/') && examRegex.test(f.name) && !legitimateBookKeywords.test(f.name))
    .map(f => f.path);
report('Exam Papers / Answers sitting inside Books/', examsInBooks);

// ─── 4. NON-CURRICULUM CHURCH SERMONS ─────────────────────────────────────
const sermonRegex = /\b(SERMON|SABBATH|CHURCH|STEWARDSHIP|PASTOR)\b/i;
const sermons = catalog
    .filter(f => sermonRegex.test(f.name) || sermonRegex.test(f.path))
    .map(f => f.path);
report('Potential Church Sermons / Non-Curriculum Files', sermons);

// ─── 5. CROSS-SUBJECT MISPLACEMENTS ───────────────────────────────────────
const subjectChecks = [
    { targetSubject: 'Agriculture', foreignSubject: 'Biology', pattern: /\bbiology\b/i },
    { targetSubject: 'History', foreignSubject: 'Geography', pattern: /\bgeography\b/i },
    { targetSubject: 'Chemistry', foreignSubject: 'Physics', pattern: /\bphysics\b/i }
];
const crossSubject = [];
catalog.forEach(f => {
    const parts = f.path.split('/');
    if (parts.length > 2) {
        const folder = parts[1];
        subjectChecks.forEach(sc => {
            if (folder.toLowerCase() === sc.targetSubject.toLowerCase() && sc.pattern.test(f.name)) {
                // Ignore combined subjects like "Physical Science" or "Biology & Agriculture"
                if (!/biology.*agriculture|agriculture.*biology|physical science/i.test(f.name)) {
                    crossSubject.push(`${f.path} (mentions ${sc.foreignSubject})`);
                }
            }
        });
    }
});
report('Possible Cross-Subject Misplacements', crossSubject);

// ─── 6. DUPLICATE FILE SUFFIXES ───────────────────────────────────────────
const dupSuffixRegex = /[-_]Copy|\(\d+\)\s*\(\d+\)|-1-1|_1_1/i;
const rawDuplicates = catalog
    .filter(f => dupSuffixRegex.test(f.name))
    .map(f => `${f.name} [${f.path}]`);
report('Raw Upload / Duplication Suffixes (e.g. -Copy, _1_1)', rawDuplicates);

// ─── 7. LEVEL FILTER AUDIT BY SUBJECT ────────────────────────────────────
function normalizePath(p) { return (p || '').replace(/\\/g, '/'); }
function getLevel(entry) {
    const explicit = String(entry.level || '').toLowerCase();
    if (explicit === 'jce' || explicit === 'msce' || explicit === 'both') return explicit;
    const name = entry.name || '';
    const path = normalizePath(entry.path);
    const text = (name + ' ' + path).replace(/[_.-]/g, ' ').toUpperCase();
    const parts = path.split('/');
    const subject = parts.length > 1 ? parts[1].trim().toLowerCase() : '';
    if (subject === 'additional mathematics' || subject === 'physical science') return 'msce';
    if (/\b1\s*(TO|-)\s*4\b|FORMS?\s*1\s*,\s*2\s*,\s*3\s*,\s*4/.test(text)) return 'both';
    const isJce = /\b(JCE|J C E|FORM\s*[12]|F[12]|FORM\s*(ONE|TWO)|BOOK\s*[12]|BK\s*[12]|JUNIOR)\b/.test(text);
    const isMsce = /\b(MSCE|M S C E|FORM\s*[34]|F[34]|FORM\s*(THREE|FOUR)|BOOK\s*[34]|BK\s*[34]|SENIOR|[34]\s*(&|\+|AND)\s*[34])\b/.test(text);
    if (isJce && !isMsce) return 'jce';
    if (isMsce && !isJce) return 'msce';
    return 'both';
}

console.log('📊 Level Classification Coverage per Subject:');
const byFolder = {};
catalog.forEach(f => {
    const parts = f.path.split('/');
    const key = parts.slice(0, 2).join('/');
    byFolder[key] = byFolder[key] || { total: 0, jce: 0, msce: 0, both: 0 };
    byFolder[key].total++;
    byFolder[key][getLevel(f)]++;
});

Object.entries(byFolder)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 10)
    .forEach(([fld, stats]) => {
        const classified = stats.jce + stats.msce;
        const pct = Math.round((classified / stats.total) * 100);
        console.log(`   ${fld.padEnd(28)} | Total: ${String(stats.total).padStart(3)} | JCE: ${String(stats.jce).padStart(3)} | MSCE: ${String(stats.msce).padStart(3)} | Classified: ${String(pct).padStart(3)}%`);
    });

console.log('\n────────────────────────────────────────────────────────');
if (issuesCount === 0) {
    console.log('✅ Catalog audit complete: Zero rule violations found!\n');
} else {
    console.log(`⚠️  Audit complete: Found ${issuesCount} item(s) to review or clean.\n`);
}
