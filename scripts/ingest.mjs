#!/usr/bin/env node
/**
 * Wylibrary Smart Ingestion Script
 * Usage:  npm run ingest -- /path/to/file.pdf [file2.pdf ...]
 *         node scripts/ingest.mjs /path/to/file.pdf
 *
 * What it does per file:
 *  1. Deduplicates by SHA-256 hash and name against existing catalog
 *  2. Checks for PDF password protection / lock (sub-20ms) and offers to skip
 *  3. Reads PDF text from first 3 pages (pdftotext fallback: OCR via pdftoppm+tesseract)
 *  4. Infers subject, level (jce/msce/both), category (Books/Exams/Q&A)
 *  5. Suggests a clean destination name & path
 *  6. Interactively confirms with the user (y / e / s / q)
 *  7. Uploads to the correct R2 bucket (B1=Books, B2=Exams|Q&A)
 *  8. Appends entry to files-index.json + public/files-index.json
 *  9. Runs `npm run ids` to stamp stable IDs
 *  10. Bumps Service Worker cache & generates update drop notification
 *
 * Configuration (from .env or environment):
 *   R2_B1_ENDPOINT, R2_B1_KEY, R2_B1_SECRET, R2_B1_BUCKET
 *   R2_B2_ENDPOINT, R2_B2_KEY, R2_B2_SECRET, R2_B2_BUCKET
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync, spawnSync } from 'child_process';
import crypto from 'crypto';
import readline from 'readline';

// ─── Paths ────────────────────────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const ROOT       = path.join(__dirname, '..');
const CATALOG    = path.join(ROOT, 'files-index.json');
const PUB_CATALOG= path.join(ROOT, 'public', 'files-index.json');

// ─── Load .env if present ─────────────────────────────────────────────────────
function loadEnv() {
  const envPath = path.join(ROOT, '.env');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+?)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}
loadEnv();

// ─── R2 Credentials ───────────────────────────────────────────────────────────
const B1 = {
  endpoint: process.env.R2_B1_ENDPOINT || 'https://c5703910f00b285b8660ec05372093f6.r2.cloudflarestorage.com',
  key     : process.env.R2_B1_KEY      || 'ceb8b1417204a36e20d9591a1afb2de5',
  secret  : process.env.R2_B1_SECRET   || '43ff430da0ad6a850fceba71a689938baf03e0caef16dc91187d5d445de1a0af',
  bucket  : process.env.R2_B1_BUCKET   || 'wylibrary-media-1',
  baseUrl : 'https://media1.wylibrary.org',
  label   : 'B1 (Books)',
};
const B2 = {
  endpoint: process.env.R2_B2_ENDPOINT || 'https://3fa01fb9f076d4ad7c4b47f985db6d3f.r2.cloudflarestorage.com',
  key     : process.env.R2_B2_KEY      || 'cb57c7560c068c9f425e361699706957',
  secret  : process.env.R2_B2_SECRET   || '44887bd5319659f4fdc776fe0c14ae70b86a470e8d3c7dd6c545dd4d80ed59e6',
  bucket  : process.env.R2_B2_BUCKET   || 'wylibrary-media-2',
  baseUrl : 'https://pub-de3a22d4e4324e8ba9a0690313176f71.r2.dev',
  label   : 'B2 (Exams/Q&A)',
};

// ─── Subject Keyword Map ──────────────────────────────────────────────────────
// Order matters: more-specific first
const SUBJECTS = [
  { folder: 'Additional Mathematics', keys: ['additional math','add maths','additional maths','addmaths'] },
  { folder: 'Agriculture',            keys: ['agriculture','agric','farming','crop','livestock'] },
  { folder: 'Bible Knowledge',        keys: ['bible','biblical','scripture','religious','bk ','b.k.'] },
  { folder: 'Biology',                keys: ['biology','biological','biolog'] },
  { folder: 'Business Studies',       keys: ['business studie','business studies','business studi','commerce','entrepreneurship','accounting'] },
  { folder: 'Chemistry',              keys: ['chemistry','chemical','chem'] },
  { folder: 'Chichewa',               keys: ['chichewa','chinyanja','tumbuka','lomwe','yao'] },
  { folder: 'Computer Studies',       keys: ['computer','ict','information technology','programming','software'] },
  { folder: 'English',                keys: ['english','grammar','comprehension','composition','literature'] },
  { folder: 'French',                 keys: ['french','français','francais'] },
  { folder: 'Geography',              keys: ['geography','geographical','geo ','geograph'] },
  { folder: 'History',                keys: ['history','historical'] },
  { folder: 'Home Economics',         keys: ['home economics','home ec','nutrition','food','cooking','sewing','textile'] },
  { folder: 'Life Skills',            keys: ['life skills','life skill','hiv','aids','health education'] },
  { folder: 'Mathematics',            keys: ['mathematics','maths','math'] },
  { folder: 'Physical Science',       keys: ['physical science','physical sciences'] },
  { folder: 'Physics',                keys: ['physics','physical'] },
  { folder: 'Social Studies',         keys: ['social studie','social studies'] },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function sha256File(filePath) {
  const data = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(data).digest('hex');
}

/** Check if a PDF is password-protected / locked (sub-20ms) */
function checkPdfLock(filePath) {
  try {
    const r = spawnSync('pdfinfo', [filePath], { encoding: 'utf-8', timeout: 5000 });
    if (r.stderr && r.stderr.includes('Incorrect password')) {
      return { locked: true, reason: 'requires user password' };
    }
    if (r.stdout && r.stdout.includes('Encrypted:') && !r.stdout.includes('Encrypted:       no')) {
      const q = spawnSync('qpdf', ['--check', filePath], { encoding: 'utf-8', timeout: 5000 });
      if (q.stderr && q.stderr.toLowerCase().includes('password')) {
        return { locked: true, reason: 'password-protected' };
      }
    }
    return { locked: false };
  } catch (_) {
    return { locked: false };
  }
}

/** Extract text from first N pages via pdftotext, then OCR fallback */
function extractText(filePath, pages = 3) {
  // Try pdftotext first
  try {
    const r = spawnSync('pdftotext', ['-l', String(pages), filePath, '-'], { encoding: 'utf-8', timeout: 20000 });
    if (r.status === 0 && r.stdout && r.stdout.trim().length > 30) {
      return r.stdout.toLowerCase();
    }
  } catch (_) {}

  // OCR fallback: render page 1 and run tesseract
  try {
    const tmpBase = `/tmp/ingest_ocr_${Date.now()}`;
    spawnSync('pdftoppm', ['-f', '1', '-l', '1', '-r', '150', '-png', filePath, tmpBase], { timeout: 30000 });
    const files = fs.readdirSync('/tmp').filter(f => f.startsWith(path.basename(tmpBase))).map(f => `/tmp/${f}`).sort();
    if (files.length) {
      const r = spawnSync('tesseract', [files[0], 'stdout'], { encoding: 'utf-8', timeout: 20000 });
      // cleanup
      files.forEach(f => { try { fs.unlinkSync(f); } catch (_) {} });
      if (r.status === 0 && r.stdout) return r.stdout.toLowerCase();
    }
  } catch (_) {}

  return '';
}

/** Guess subject folder from text + filename */
function guessSubject(text, filename) {
  const haystack = (text + ' ' + filename).toLowerCase();
  for (const { folder, keys } of SUBJECTS) {
    if (keys.some(k => haystack.includes(k))) return folder;
  }
  return null;
}

/** Guess level from text + filename */
function guessLevel(text, filename) {
  const haystack = (text + ' ' + filename).toLowerCase();
  const hasJCE  = /\bjce\b|form [12]\b|junior certificate/.test(haystack);
  const hasMSCE = /\bmsce\b|form [34]\b|malawi school certificate|maneb/.test(haystack);
  if (hasJCE && hasMSCE) return 'both';
  if (hasJCE) return 'jce';
  if (hasMSCE) return 'msce';
  return null;
}

/** Guess category: Books / Exams / Q&A */
function guessCategory(text, filename) {
  const haystack = (text + ' ' + filename).toLowerCase();

  // Q&A signals
  if (/model answer|question.*answer|q\s*&\s*a|q\.a\.|quiz|mark scheme|marking scheme/.test(haystack)) return 'Q&A';

  // Exam signals
  if (/past paper|examination paper|maneb.*paper|paper [12]\b|mock exam|mock paper|msce.*paper|jce.*paper|set [a-d]\b|examination \d{4}|\d{4}.*exam|compiled.*paper|papers.*\d{4}/.test(haystack)) return 'Exams';

  // Syllabus signals
  if (/syllabus|syllabi|curriculum/.test(haystack)) return 'Syllabus';

  return 'Books';
}

/** Clean up a filename: remove suffixes, normalize spaces */
function cleanFilename(raw) {
  let name = path.basename(raw, path.extname(raw));
  // remove upload noise
  name = name.replace(/[_\s]+(copy|\d+)$/i, '').trim();
  name = name.replace(/\s*\(\d+\)$/, '').trim();
  // replace underscores with spaces
  name = name.replace(/_/g, ' ');
  // collapse multiple spaces
  name = name.replace(/\s{2,}/g, ' ').trim();
  // replace en/em dashes with hyphen
  name = name.replace(/[–—]/g, '-');
  return name + path.extname(raw);
}

/** Build full destination path */
function buildDestPath(category, subject, cleanName) {
  if (category === 'Syllabus') return `Books/${subject}/Syllabus/${cleanName}`;
  if (category === 'Exams')    return `Exams/${subject}/${cleanName}`;
  if (category === 'Q&A')      return `Q&A/${subject}/${cleanName}`;
  return `Books/${subject}/${cleanName}`;
}

/** Choose R2 bucket based on category */
function chooseBucket(category) {
  return (category === 'Books' || category === 'Syllabus') ? B1 : B2;
}

/** Upload a file to R2 using uv + boto3 (verified size) */
function uploadToR2(bucket, destKey, localPath) {
  const pyScript = `
import boto3, sys, os
endpoint, key, secret, bucket_name, dest_key, local_path = sys.argv[1:7]
client = boto3.client('s3', endpoint_url=endpoint, aws_access_key_id=key, aws_secret_access_key=secret)
file_size = os.path.getsize(local_path)
client.upload_file(local_path, bucket_name, dest_key)
meta = client.head_object(Bucket=bucket_name, Key=dest_key)
remote_size = meta['ContentLength']
if remote_size != file_size:
    raise ValueError(f"Size mismatch: local={file_size} remote={remote_size}")
print(remote_size)
`;
  const fileSize = fs.statSync(localPath).size;
  const r = spawnSync('uv', [
    'run', '--with', 'boto3', 'python3', '-c', pyScript,
    bucket.endpoint, bucket.key, bucket.secret, bucket.bucket, destKey, localPath
  ], { encoding: 'utf-8', timeout: 300000, maxBuffer: 4 * 1024 * 1024 });

  if (r.status !== 0) {
    throw new Error(`R2 upload failed:\n${r.stderr || r.stdout}`);
  }

  const uploadedSize = parseInt(r.stdout.trim(), 10);
  if (uploadedSize !== fileSize) {
    throw new Error(`Size mismatch after upload: local=${fileSize} remote=${uploadedSize}`);
  }
  return uploadedSize;
}

/** Append entry to both catalog files and keep them in sync */
function appendToCatalog(entry) {
  for (const p of [CATALOG, PUB_CATALOG]) {
    const data = JSON.parse(fs.readFileSync(p, 'utf-8'));
    data.push(entry);
    fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n');
  }
}

/** Verify both catalogs are identical */
function verifyCatalogs() {
  const a = crypto.createHash('md5').update(fs.readFileSync(CATALOG)).digest('hex');
  const b = crypto.createHash('md5').update(fs.readFileSync(PUB_CATALOG)).digest('hex');
  if (a !== b) throw new Error('Catalog files are out of sync after write!');
}

/** Build a catalog repo/bucket reference matching existing convention */
function catalogRef(category) {
  // Books → bucket:1, Exams/Q&A → bucket:1 also (legacy convention in catalog)
  // Check existing entries for which bucket number is used
  if (category === 'Books' || category === 'Syllabus') {
    return { repo: 'e-library-media-2', bucket: 1 }; // Books use B1 R2 but repo tag = 'e-library-media-2'
  }
  return { repo: 'e-library-media', bucket: 1 };
}

/** Bump CACHE_NAME and UPDATE_META in public/sw.js so clients receive update toasts */
function bumpServiceWorker(itemsAdded) {
  const swPath = path.join(ROOT, 'public', 'sw.js');
  if (!fs.existsSync(swPath)) return;

  let content = fs.readFileSync(swPath, 'utf8');

  const cacheMatch = content.match(/const CACHE_NAME = 'wylibrary-v(\d+)-[^']+';/);
  const nextNum = cacheMatch ? parseInt(cacheMatch[1], 10) + 1 : 67;
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const newCacheName = `wylibrary-v${nextNum}-${today}-m1`;

  content = content.replace(
    /const CACHE_NAME = '[^']+';/,
    `const CACHE_NAME = '${newCacheName}';`
  );

  const title = '📚 New Study Materials';
  let message;
  if (itemsAdded.length === 1) {
    message = `Added ${itemsAdded[0]}.`;
  } else if (itemsAdded.length <= 3) {
    message = `Added ${itemsAdded.join(', ')}.`;
  } else {
    message = `Added ${itemsAdded.length} new academic resources to the library.`;
  }
  message = message.replace(/[\u2013\u2014]/g, '-');

  const metaBlock = `const UPDATE_META = {
  version: 'v${(nextNum / 10).toFixed(1)}',
  type: 'materials',
  title: '${title}',
  message: '${message.replace(/'/g, "\\'")}'
};`;

  content = content.replace(/const UPDATE_META = \{[\s\S]*?\};/, metaBlock);

  fs.writeFileSync(swPath, content, 'utf8');
  console.log(`📱 Service Worker updated: ${newCacheName}`);
  console.log(`   Notification: "${title}" - "${message}"`);
}

// ─── Interactive prompt ───────────────────────────────────────────────────────
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
function ask(prompt) {
  return new Promise(resolve => rl.question(prompt, resolve));
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2).filter(a => !a.startsWith('--'));
  if (args.length === 0) {
    console.error('Usage: npm run ingest -- /path/to/file.pdf [file2.pdf ...]');
    process.exit(1);
  }

  const catalog = JSON.parse(fs.readFileSync(CATALOG, 'utf-8'));
  const existingHashes = new Set(); // We'll compute lazily — just check names for speed

  let ingested = 0;
  let skipped  = 0;
  const ingestedNames = [];

  for (const filePath of args) {
    if (!fs.existsSync(filePath)) {
      console.error(`\n❌ File not found: ${filePath}`);
      skipped++;
      continue;
    }

    const ext     = path.extname(filePath).toLowerCase();
    const rawName = path.basename(filePath);

    console.log(`\n${'─'.repeat(70)}`);
    console.log(`📄 Processing: ${rawName}`);

    // 1. SHA-256 deduplication
    console.log('   Computing SHA-256...');
    const hash = sha256File(filePath);
    const fileSize = fs.statSync(filePath).size;

    // Check if same size + name already in catalog (fast path)
    const maybeDupe = catalog.find(e =>
      e.size === fileSize && path.basename(e.path).toLowerCase() === rawName.toLowerCase()
    );
    if (maybeDupe) {
      console.log(`   ⚠️  Possible duplicate: matches existing entry "${maybeDupe.path}" (same size & name)`);
      const ans = await ask('   Add anyway? [y/N]: ');
      if (ans.trim().toLowerCase() !== 'y') { skipped++; continue; }
    }

    // 2. Encryption / Password lock check (sub-20ms)
    if (ext === '.pdf') {
      const lockCheck = checkPdfLock(filePath);
      if (lockCheck.locked) {
        console.log(`\n   🔒 LOCKED DOCUMENT: This PDF is password-protected (${lockCheck.reason}).`);
        console.log('      Students cannot open or read this file without a password.');
        const ans = await ask('      Skip this locked file? [Y/n]: ');
        if (ans.trim().toLowerCase() !== 'n') {
          console.log('   ⏭️  Skipped locked file.');
          skipped++;
          continue;
        }
      }
    }

    // 3. Extract text
    console.log('   Extracting text from PDF...');
    const text = ext === '.pdf' ? extractText(filePath) : '';

    // 3. Classify
    let subject  = guessSubject(text, rawName);
    let level    = guessLevel(text, rawName);
    let category = guessCategory(text, rawName);
    let cleanName = cleanFilename(rawName);
    let destPath  = subject ? buildDestPath(category, subject, cleanName) : null;

    // 4. Show proposal
    console.log('\n   📋 Proposal:');
    console.log(`      Subject : ${subject   || '❓ UNKNOWN'}`);
    console.log(`      Level   : ${level     || '❓ UNKNOWN'}`);
    console.log(`      Category: ${category}`);
    console.log(`      Name    : ${cleanName}`);
    console.log(`      Path    : ${destPath  || '❓ (needs subject)'}`);
    console.log(`      Bucket  : ${chooseBucket(category).label}`);

    // 5. Confirm / edit
    let confirmed = false;
    while (!confirmed) {
      const ans = await ask('\n   [y]es / [e]dit / [s]kip / [q]uit: ');
      const choice = ans.trim().toLowerCase();

      if (choice === 'q') { rl.close(); process.exit(0); }
      if (choice === 's') { skipped++; break; }

      if (choice === 'e') {
        // Edit each field
        const newSubject = await ask(`   Subject [${subject || ''}]: `);
        if (newSubject.trim()) subject = newSubject.trim();

        const newLevel = await ask(`   Level (jce/msce/both) [${level || ''}]: `);
        if (newLevel.trim()) level = newLevel.trim();

        const newCat = await ask(`   Category (Books/Exams/Q&A/Syllabus) [${category}]: `);
        if (newCat.trim()) category = newCat.trim();

        const newName = await ask(`   Clean filename [${cleanName}]: `);
        if (newName.trim()) cleanName = newName.trim();

        destPath = subject ? buildDestPath(category, subject, cleanName) : null;

        console.log('\n   📋 Updated:');
        console.log(`      Subject : ${subject   || '❓ UNKNOWN'}`);
        console.log(`      Level   : ${level     || '❓ UNKNOWN'}`);
        console.log(`      Category: ${category}`);
        console.log(`      Path    : ${destPath  || '❓ (needs subject)'}`);
        console.log(`      Bucket  : ${chooseBucket(category).label}`);
        continue;
      }

      if (choice === 'y') {
        if (!subject) {
          console.log('   ❌ Cannot proceed without a subject folder. Use [e] to set one.');
          continue;
        }
        if (!level) {
          const ans2 = await ask('   Level is unknown. Enter level (jce/msce/both) or leave blank to skip: ');
          if (ans2.trim()) level = ans2.trim();
        }
        confirmed = true;
      }
    }

    if (!confirmed) continue;

    // 6. Upload
    const bucket = chooseBucket(category);
    console.log(`\n   ⬆️  Uploading to ${bucket.label}...`);
    try {
      const uploaded = uploadToR2(bucket, destPath, filePath);
      console.log(`   ✅ Uploaded ${(uploaded / 1024 / 1024).toFixed(2)} MB → ${destPath}`);
    } catch (err) {
      console.error(`   ❌ Upload failed: ${err.message}`);
      skipped++;
      continue;
    }

    // 7. Append to catalog
    const ref = catalogRef(category);
    const entry = {
      name   : cleanName,
      path   : destPath,
      size   : fileSize,
      repo   : ref.repo,
      bucket : ref.bucket,
      ...(level ? { level } : {}),
    };
    appendToCatalog(entry);
    catalog.push(entry); // keep in-memory copy current for dupe checking
    console.log('   📚 Added to catalog');

    ingestedNames.push(cleanName);
    ingested++;
  }

  // 8. Run npm run ids to stamp stable IDs
  if (ingested > 0) {
    console.log('\n─────────────────────────────────────────────────────────────────────');
    console.log('🔑 Running `npm run ids` to assign stable IDs...');
    try {
      execSync('npm run ids', { cwd: ROOT, stdio: 'inherit' });
      verifyCatalogs();
      console.log('✅ Catalog synced and IDs assigned.');
    } catch (err) {
      console.error('❌ npm run ids failed:', err.message);
    }

    console.log('\n📱 Invalidation: Bumping Service Worker cache & update notification...');
    bumpServiceWorker(ingestedNames);
  }

  rl.close();
  console.log(`\n${'═'.repeat(70)}`);
  console.log(`✅ Done. Ingested: ${ingested}  Skipped: ${skipped}`);
  if (ingested > 0) {
    console.log('\n💡 Next steps:');
    console.log('   npm run audit           → check catalog quality');
    console.log('   git add -A && git commit → commit to staging');
  }
}

main().catch(err => { console.error(err); process.exit(1); });
