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

    if (!file) {
        return new Response('File parameter required', { status: 400 });
    }

    const cleanPath = file.split('/')
        .map(part => encodeURIComponent(part))
        .join('/');

    const bucketId = getBucketForFile(file);
    const baseUrl = BUCKET_URLS[bucketId] || BUCKET_URLS[1];
    const sourceUrl = `${baseUrl}/${cleanPath}`;

    // Perform a 302 redirect directly to Cloudflare R2
    return Response.redirect(sourceUrl, 302);
}
