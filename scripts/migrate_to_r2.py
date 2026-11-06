#!/usr/bin/env python3
import json
import mimetypes
import os
import sys
import time
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
import boto3
from botocore.config import Config

boto_config = Config(
    retries={'max_attempts': 5, 'mode': 'standard'},
    max_pool_connections=50
)

# Read credentials from environment variables (GitHub Actions secrets) or fallback
R2_KEY_1 = os.environ.get('R2_ACCESS_KEY_1', 'ceb8b1417204a36e20d9591a1afb2de5')
R2_SECRET_1 = os.environ.get('R2_SECRET_KEY_1', '43ff430da0ad6a850fceba71a689938baf03e0caef16dc91187d5d445de1a0af')

R2_KEY_2 = os.environ.get('R2_ACCESS_KEY_2', 'cb57c7560c068c9f425e361699706957')
R2_SECRET_2 = os.environ.get('R2_SECRET_KEY_2', '44887bd5319659f4fdc776fe0c14ae70b86a470e8d3c7dd6c545dd4d80ed59e6')

# Bucket 1: wylibrary-media-1 (Main Account)
b1 = boto3.client(
    's3',
    endpoint_url='https://c5703910f00b285b8660ec05372093f6.r2.cloudflarestorage.com',
    aws_access_key_id=R2_KEY_1,
    aws_secret_access_key=R2_SECRET_1,
    region_name='auto',
    config=boto_config
)

# Bucket 2: wylibrary-media-2 (Wy2 Account)
b2 = boto3.client(
    's3',
    endpoint_url='https://3fa01fb9f076d4ad7c4b47f985db6d3f.r2.cloudflarestorage.com',
    aws_access_key_id=R2_KEY_2,
    aws_secret_access_key=R2_SECRET_2,
    region_name='auto',
    config=boto_config
)

CLIENTS = {
    1: (b1, 'wylibrary-media-1'),
    2: (b2, 'wylibrary-media-2'),
}

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(SCRIPT_DIR)
INDEX_FILE = os.path.join(PROJECT_DIR, 'files-index.json')
STATE_FILE = os.path.join(SCRIPT_DIR, '.migration_state.json')

def get_target_bucket(path):
    if path.startswith('Books/'):
        return 1
    return 2

def get_content_type(path):
    mime, _ = mimetypes.guess_type(path)
    if mime:
        return mime
    if path.lower().endswith('.pdf'):
        return 'application/pdf'
    if path.lower().endswith('.zip'):
        return 'application/zip'
    return 'application/octet-stream'

def fetch_content(repo, file_path):
    clean_path = '/'.join(urllib.parse.quote(part) for part in file_path.split('/'))
    lfs_url = f"https://media.githubusercontent.com/media/Wycliffe147/{repo}/main/{clean_path}"
    req = urllib.request.Request(lfs_url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            return resp.read()
    except urllib.error.HTTPError as e:
        if e.code == 404:
            raw_url = f"https://raw.githubusercontent.com/Wycliffe147/{repo}/main/{clean_path}"
            req_raw = urllib.request.Request(raw_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req_raw, timeout=60) as resp_raw:
                return resp_raw.read()
        raise

def migrate_single_file(item, client, bucket_name, expected_size):
    path = item['path']
    repo = item.get('repo', 'e-library-media')
    content_type = get_content_type(path)

    # Check if file already exists in bucket with matching size
    try:
        head = client.head_object(Bucket=bucket_name, Key=path)
        if head.get('ContentLength') == expected_size:
            return True, "already_exists", expected_size
    except Exception:
        pass

    # Download from GitHub CDN and upload to R2
    data = fetch_content(repo, path)
    client.put_object(
        Bucket=bucket_name,
        Key=path,
        Body=data,
        ContentType=content_type
    )
    return True, "uploaded", len(data)

def main():
    with open(INDEX_FILE, 'r') as f:
        all_files = json.load(f)

    # In cloud runners we can use more threads (e.g. 16 workers)
    workers = 16
    completed_paths = set()
    if os.path.exists(STATE_FILE):
        try:
            with open(STATE_FILE, 'r') as sf:
                completed_paths = set(json.load(sf))
        except Exception:
            pass

    for item in all_files:
        item['bucket'] = get_target_bucket(item['path'])

    # Save updated files-index.json with bucket assignments
    with open(INDEX_FILE, 'w') as f:
        json.dump(all_files, f, indent=2)

    total_files = len(all_files)
    to_process = [item for item in all_files if item['path'] not in completed_paths]
    print(f"Total files: {total_files} | Already completed: {len(completed_paths)} | Remaining: {len(to_process)}")

    if not to_process:
        print("All files already migrated!")
        return

    success_count = len(completed_paths)
    uploaded_bytes = 0
    start_time = time.time()

    def process_item(item):
        bucket_id = item['bucket']
        client, bucket_name = CLIENTS[bucket_id]
        expected_size = item.get('size', 0)
        success, status, size = migrate_single_file(item, client, bucket_name, expected_size)
        return item['path'], success, status, size, bucket_id

    with ThreadPoolExecutor(max_workers=workers) as executor:
        futures = {executor.submit(process_item, item): item for item in to_process}
        for future in as_completed(futures):
            item = futures[future]
            try:
                path, success, status, size, bucket_id = future.result()
                if success:
                    completed_paths.add(path)
                    success_count += 1
                    if status == "uploaded":
                        uploaded_bytes += size
                    
                    percent = (success_count / total_files) * 100
                    status_label = "EXISTS" if status == "already_exists" else "DONE"
                    print(f"[{success_count}/{total_files}] ({percent:5.1f}%) [{status_label}] B{bucket_id} ({size/(1024*1024):5.2f} MB) {path}")
                    
                    if success_count % 50 == 0:
                        with open(STATE_FILE, 'w') as sf:
                            json.dump(list(completed_paths), sf)

            except Exception as e:
                print(f"[ERROR] Failed {item['path']}: {e}", file=sys.stderr)

    with open(STATE_FILE, 'w') as sf:
        json.dump(list(completed_paths), sf)

    print(f"\nMigration finished: {success_count}/{total_files} files processed successfully!")

if __name__ == '__main__':
    main()
