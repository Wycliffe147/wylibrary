import * as fflate from "fflate";

const BUCKET_URLS = {
    1: 'https://media1.wylibrary.org',
    2: 'https://pub-de3a22d4e4324e8ba9a0690313176f71.r2.dev'
};

export async function onRequest(context) {
    const { searchParams } = new URL(context.request.url);
    const file = searchParams.get('file');

    if (!file) {
        return new Response("File parameter required", { status: 400 });
    }

    const cleanPath = file.split("/")
        .map(part => encodeURIComponent(part))
        .join("/");

    // Zips live in Bucket 2
    const sourceUrl = `${BUCKET_URLS[2]}/${cleanPath}`;

    try {
        const response = await fetch(sourceUrl);
        if (!response.ok) {
            return new Response(`Failed to fetch ZIP from storage: ${response.statusText}`, { status: response.status });
        }

        const buffer = await response.arrayBuffer();
        const uint8Array = new Uint8Array(buffer);

        const zipData = fflate.unzipSync(uint8Array, {});

        const entries = Object.keys(zipData).map(name => {
            const isDirectory = name.endsWith("/");
            const data = zipData[name];
            return {
                name: name,
                isDirectory: isDirectory,
                size: isDirectory ? 0 : data.length
            };
        });

        return new Response(JSON.stringify(entries), {
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "public, max-age=86400, s-maxage=86400"
            }
        });
    } catch (error) {
        console.error("ZIP processing error:", error);
        return new Response("Error reading ZIP contents. It might be too large or corrupted.", { status: 500 });
    }
}
