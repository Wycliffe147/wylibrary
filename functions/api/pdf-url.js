const BUCKET_URLS = {
    1: 'https://media1.wylibrary.org',
    2: 'https://pub-de3a22d4e4324e8ba9a0690313176f71.r2.dev'
};

export async function onRequest(context) {
    const { searchParams } = new URL(context.request.url);
    const file = searchParams.get('file');

    if (!file) {
        return new Response(JSON.stringify({ error: 'File parameter required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const bucketId = file.startsWith('Books/') ? 1 : 2;
    const baseUrl = BUCKET_URLS[bucketId] || BUCKET_URLS[1];
    const cleanPath = file.split('/').map(part => encodeURIComponent(part)).join('/');
    
    // Append version to bypass stale CDN edge caches that were saved before CORS was added
    const url = `${baseUrl}/${cleanPath}?v=r2_cors_1`;

    return new Response(JSON.stringify({ url }), {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-store'
        }
    });
}
