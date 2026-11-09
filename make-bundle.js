#!/usr/bin/env node
/**
 * make-bundle.js — Wylibrary Claude.ai Context Bundle Generator
 *
 * Produces:
 *   1. wylibrary-bundle.zip  → ZIP archive of core codebase for Claude.ai Project knowledge
 *   2. wylibrary-bundle.txt  → Single structured text file ready to upload directly into chat
 *
 * Run with:
 *   npm run bundle
 *   (or node make-bundle.js)
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = __dirname;

const FILES = [
  // Documentation & guidelines
  'AGENTS.md',
  'ROADMAP.md',
  'package.json',

  // Core HTML & Shell
  'public/index.html',
  'public/pdf-viewer.html',
  'public/manifest.json',
  'public/_headers',

  // Core App logic & Service Worker
  'public/app.js',
  'public/offline-store.js',
  'public/sw.js',
  'public/quiz-data.json',

  // Cloudflare Pages API Functions
  'functions/api/pdf-url.js',
  'functions/api/download.js',
  'functions/api/files.js',
  'functions/api/search.js',
  'functions/api/last-updated.js',
  'functions/api/zip-contents.js',

  // Build & Utility scripts
  'scripts/add-ids.mjs',

  // CSS Stylesheets
  'public/styles/base.css',
  'public/styles/layout.css',
  'public/styles/components.css',
  'public/styles/navigation.css',
  'public/styles/modals.css',
  'public/styles/practice.css',
  'public/styles/dark-mode.css',
];

const SKIP = new Set([
  'files-index.json', // 575 KB generated catalog - too bulky for context
  'package-lock.json',
]);

function getFileContent(rel, branch) {
  if (branch) {
    try {
      return execSync(`git show ${branch}:${rel}`, { cwd: root, stdio: ['pipe', 'pipe', 'ignore'] }).toString('utf8');
    } catch {
      return null;
    }
  }
  const fullPath = path.join(root, rel);
  if (!fs.existsSync(fullPath)) return null;
  return fs.readFileSync(fullPath, 'utf8');
}

function buildTextBundle(fileList, outFileName, branch) {
  const SEP = '='.repeat(80);
  let out = '';
  let totalBytes = 0;
  let includedCount = 0;
  let skippedCount = 0;

  out += `${SEP}\n`;
  out += `  WYCLIFFE'S E-LIBRARY (WYLIBRARY.ORG) — CODEBASE CONTEXT BUNDLE\n`;
  out += `  Generated: ${new Date().toLocaleString('en-GB', { timeZone: 'Africa/Blantyre' })} CAT\n`;
  out += `  Source   : ${branch ? `Branch: ${branch}` : 'Current Working Tree'}\n`;
  out += `  Purpose  : Claude.ai Context / Architecture Review\n`;
  out += `  Stack    : Vanilla JS, CSS3, Cloudflare Pages Functions, Cloudflare R2, PWA Service Worker\n`;
  out += `  Live URL : https://wylibrary.org | Staging: https://staging.wylibrary.pages.dev\n`;
  out += `${SEP}\n\n`;

  out += `TABLE OF CONTENTS\n`;
  out += '-'.repeat(40) + '\n';
  fileList.forEach((rel, i) => {
    const content = getFileContent(rel, branch);
    out += `  ${String(i + 1).padStart(2, ' ')}. ${rel}${content !== null ? '' : '  [NOT FOUND — SKIPPED]'}\n`;
  });
  out += '\n' + SEP + '\n\n';

  for (const rel of fileList) {
    if (SKIP.has(path.basename(rel))) {
      skippedCount++;
      continue;
    }
    const content = getFileContent(rel, branch);
    if (content === null) {
      skippedCount++;
      continue;
    }

    const lines = content.split('\n').length;
    const bytes = Buffer.byteLength(content, 'utf8');

    out += `${SEP}\n`;
    out += `FILE: ${rel}\n`;
    out += `SIZE: ${(bytes / 1024).toFixed(1)} KB  |  LINES: ${lines}\n`;
    out += `${SEP}\n`;
    out += content;
    if (!content.endsWith('\n')) out += '\n';
    out += '\n';

    totalBytes += bytes;
    includedCount++;
  }

  out += `${SEP}\n`;
  out += `END OF WYCLIFFE'S E-LIBRARY BUNDLE\n`;
  out += `Files included : ${includedCount}\n`;
  out += `Files skipped  : ${skippedCount}\n`;
  out += `Total source   : ${(totalBytes / 1024).toFixed(1)} KB\n`;
  const bundleKB = (Buffer.byteLength(out, 'utf8') / 1024).toFixed(1);
  out += `Bundle size    : ${bundleKB} KB\n`;
  out += `${SEP}\n`;

  const outFile = path.join(root, outFileName);
  fs.writeFileSync(outFile, out, 'utf8');
  return { outFileName, bundleKB, includedCount };
}

function buildZipBundle(fileList, outZipName, branch) {
  const outPath = path.join(root, outZipName);
  if (fs.existsSync(outPath)) fs.unlinkSync(outPath);

  if (branch) {
    // Collect existing files in the given git branch
    const existing = fileList.filter(rel => {
      try {
        execSync(`git cat-file -e ${branch}:${rel}`, { cwd: root, stdio: ['pipe', 'pipe', 'ignore'] });
        return !SKIP.has(path.basename(rel));
      } catch {
        return false;
      }
    });
    execSync(`git archive ${branch} ${existing.map(f => `"${f}"`).join(' ')} -o "${outPath}"`, { cwd: root });
    const stat = fs.statSync(outPath);
    return { outFileName: outZipName, zipKB: (stat.size / 1024).toFixed(1), totalFiles: existing.length };
  }

  const existingFiles = fileList.filter(rel => fs.existsSync(path.join(root, rel)) && !SKIP.has(path.basename(rel)));
  execSync(`zip -q "${outPath}" ${existingFiles.map(f => `"${f}"`).join(' ')}`, { cwd: root });
  const stat = fs.statSync(outPath);
  return { outFileName: outZipName, zipKB: (stat.size / 1024).toFixed(1), totalFiles: existingFiles.length };
}

async function run() {
  const args = process.argv.slice(2);
  let branch = null;
  if (args.includes('staging') || args.includes('--staging')) branch = 'staging';
  else if (args.includes('main') || args.includes('--main')) branch = 'main';

  const sourceDesc = branch ? `branch "${branch}"` : 'current working tree';
  console.log(`🚀 Generating Wylibrary bundle from ${sourceDesc} for Claude.ai...\n`);

  const zipRes = buildZipBundle(FILES, 'wylibrary-bundle.zip', branch);
  console.log(`📦  ${zipRes.outFileName.padEnd(26)} | ${zipRes.zipKB.padStart(6)} KB | ${zipRes.totalFiles} files (ZIP archive - recommended!)`);

  const txtRes = buildTextBundle(FILES, 'wylibrary-bundle.txt', branch);
  console.log(`📄  ${txtRes.outFileName.padEnd(26)} | ${txtRes.bundleKB.padStart(6)} KB | ${txtRes.includedCount} files (Single text bundle)`);

  console.log('\n💡 Ready to upload:');
  console.log(`   1. ZIP : ${path.join(root, 'wylibrary-bundle.zip')}`);
  console.log(`   2. TXT : ${path.join(root, 'wylibrary-bundle.txt')}\n`);
}

run().catch(console.error);
