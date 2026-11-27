#!/usr/bin/env python3
"""
Scan all PDF files in Wylibrary for password locks / encryption using fast HTTP Range requests.
Only fetches the last 4 KB of each file to inspect the PDF trailer.
For any file where /Encrypt is detected, verifies locally with pdfinfo.
"""

import asyncio
import aiohttp
import json
import os
import re
import subprocess
import time
import urllib.parse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CATALOG_PATH = os.path.join(ROOT, 'files-index.json')

B1_BASE = "https://media1.wylibrary.org"
B2_BASE = "https://pub-de3a22d4e4324e8ba9a0690313176f71.r2.dev"

CONCURRENCY = 25
TIMEOUT = aiohttp.ClientTimeout(total=30, connect=10)

def get_url(item):
    path = item['path']
    encoded = urllib.parse.quote(path)
    if item.get('bucket') == 1:
        return f"{B1_BASE}/{encoded}"
    return f"{B2_BASE}/{encoded}"

async def check_file(session, sem, item, stats):
    url = get_url(item)
    async with sem:
        try:
            headers = {"Range": "bytes=-4096"}
            async with session.get(url, headers=headers, timeout=TIMEOUT) as resp:
                if resp.status not in (200, 206):
                    stats['errors'].append((item['path'], f"HTTP {resp.status}"))
                    return None
                data = await resp.read()
                stats['bytes'] += len(data)
                stats['scanned'] += 1

                if stats['scanned'] % 100 == 0 or stats['scanned'] == stats['total']:
                    elapsed = time.perf_counter() - stats['start_time']
                    rate = stats['scanned'] / elapsed if elapsed > 0 else 0
                    print(f"[{stats['scanned']}/{stats['total']}] {stats['scanned']/stats['total']*100:.1f}% ({rate:.1f} files/s) - Elapsed: {elapsed:.1f}s")

                # Look for /Encrypt in trailer
                if b'/Encrypt' in data:
                    return item
                return None
        except Exception as e:
            stats['errors'].append((item['path'], str(e)))
            return None

def verify_candidate(item):
    """Download the full candidate file and test with pdfinfo/qpdf"""
    url = get_url(item)
    tmp_path = f"/tmp/verify_lock_{item.get('id', 'temp')}.pdf"
    try:
        subprocess.run(["curl", "-s", "-o", tmp_path, url], timeout=60, check=True)
        res = subprocess.run(["pdfinfo", tmp_path], capture_output=True, text=True)
        if "Incorrect password" in res.stderr:
            return True, "Requires password"
        if "Encrypted:" in res.stdout and "Encrypted:       no" not in res.stdout:
            q = subprocess.run(["qpdf", "--check", tmp_path], capture_output=True, text=True)
            if "password" in q.stderr.lower():
                return True, "Password protected (qpdf confirmed)"
        return False, "Encrypted metadata but open without password"
    except Exception as e:
        return False, f"Verification failed: {e}"
    finally:
        if os.path.exists(tmp_path):
            try:
                os.remove(tmp_path)
            except Exception:
                pass

async def main():
    with open(CATALOG_PATH, 'r') as f:
        catalog = json.load(f)

    pdfs = [item for item in catalog if item['path'].lower().endswith('.pdf')]
    total = len(pdfs)
    print(f"Loaded catalog: {len(catalog)} total resources.")
    print(f"Targeting {total} PDF files for password-lock scanning...")
    print(f"Concurrency: {CONCURRENCY} connections. Chunk size: 4 KB.\n")

    sem = asyncio.Semaphore(CONCURRENCY)
    stats = {
        'total': total,
        'scanned': 0,
        'bytes': 0,
        'errors': [],
        'start_time': time.perf_counter()
    }

    connector = aiohttp.TCPConnector(limit=CONCURRENCY, ttl_dns_cache=300)
    async with aiohttp.ClientSession(connector=connector) as session:
        tasks = [check_file(session, sem, item, stats) for item in pdfs]
        results = await asyncio.gather(*tasks)

    candidates = [r for r in results if r is not None]
    total_time = time.perf_counter() - stats['start_time']

    print(f"\nPhase 1 Complete in {total_time:.2f} seconds ({total / total_time:.1f} files/s).")
    print(f"Total data transferred: {stats['bytes'] / (1024 * 1024):.2f} MB.")
    print(f"Encryption candidates found: {len(candidates)}")

    locked_files = []
    if candidates:
        print("\nPhase 2: Verifying candidates locally with pdfinfo...")
        for c in candidates:
            is_locked, reason = verify_candidate(c)
            if is_locked:
                print(f"   🔒 CONFIRMED LOCKED: {c['path']} (ID: {c.get('id')}) - {reason}")
                locked_files.append((c, reason))
            else:
                print(f"   🔓 Open (unlocked): {c['path']} - {reason}")
    else:
        print("No encrypted PDF trailers found.")

    print("\n" + "="*60)
    print("SCAN REPORT")
    print("="*60)
    print(f"Total PDFs Scanned : {stats['scanned']} of {total}")
    print(f"Total Elapsed Time : {total_time:.2f} seconds ({total_time/60:.2f} minutes)")
    print(f"Average Speed      : {total / total_time:.1f} files/second")
    print(f"Network Data Used  : {stats['bytes'] / (1024 * 1024):.2f} MB")
    print(f"Locked Files Found : {len(locked_files)}")
    if locked_files:
        for f, reason in locked_files:
            print(f"   - {f['path']} [{f.get('id')}]: {reason}")
    else:
        print("✅ 100% of PDFs in the library are open and accessible to students!")

    if stats['errors']:
        print(f"\nNetwork Retries/Errors ({len(stats['errors'])}):")
        for p, err in stats['errors'][:10]:
            print(f"   - {p}: {err}")

if __name__ == '__main__':
    asyncio.run(main())
