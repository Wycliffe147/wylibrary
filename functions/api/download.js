import allFiles from "../../files-index.json" assert { type: "json" };

const BUCKET_URLS = {
    1: 'https://media1.wylibrary.org',
    2: 'https://pub-de3a22d4e4324e8ba9a0690313176f71.r2.dev'
};

function getBucketForFile(filePath) {
    const entry = allFiles.find(f => f.path === filePath);
    if (entry && entry.bucket) {
        return entry.bucket;
    }
    // Fallback based on category if bucket property not present
    return filePath.startsWith('Books/') ? 1 : 2;
}

export async function onRequest(context) {
    const { searchParams } = new URL(context.request.url);
    const file = searchParams.get('file');
    const mode = searchParams.get('mode');

    if (!file) {
        return new Response('File parameter required', { status: 400 });
    }

    const cleanPath = file.split('/')
        .map(part => encodeURIComponent(part))
        .join('/');

    const bucketId = getBucketForFile(file);
    const baseUrl = BUCKET_URLS[bucketId] || BUCKET_URLS[1];
    const sourceUrl = `${baseUrl}/${cleanPath}`;

    // For download mode: stream with Content-Disposition: attachment so mobile and desktop browsers save the file directly
    if (mode === 'download') {
        const fileName = file.split('/').pop();
        const r2Res = await fetch(sourceUrl);
        if (!r2Res.ok) {
            return new Response(`Failed to fetch file: ${r2Res.statusText}`, { status: r2Res.status });
        }

        const headers = new Headers();
        headers.set('Content-Type', r2Res.headers.get('content-type') || 'application/octet-stream');
        if (r2Res.headers.has('content-length')) {
            headers.set('Content-Length', r2Res.headers.get('content-length'));
        }
        headers.set('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"; filename*=UTF-8''${encodeURIComponent(fileName)}`);
        headers.set('Cache-Control', 'public, max-age=86400');

        return new Response(r2Res.body, {
            status: 200,
            headers: headers
        });
    }

    // Default: 302 redirect for direct streaming/viewing
    return Response.redirect(sourceUrl, 302);
}
