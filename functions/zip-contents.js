import AdmZip from "adm-zip";

export async function onRequest(context) {
    const { searchParams } = new URL(context.request.url);
    const file = searchParams.get('file');

    if (!file) {
        return new Response("File parameter required", { status: 400 });
    }

    const cleanPath = file.split("/")
        .map(part => encodeURIComponent(part))
        .join("/");

    const sourceUrl = `https://media.githubusercontent.com/media/Wycliffe147/e-library-media/main/${cleanPath}`;

    try {
        const response = await fetch(sourceUrl);
        if (!response.ok) {
            return new Response(`Failed to fetch ZIP from GitHub: ${response.statusText}`, { status: response.status });
        }

        const buffer = await response.arrayBuffer();
        const zip = new AdmZip(Buffer.from(buffer));
        const entries = zip.getEntries().map(entry => ({
            name: entry.entryName,
            isDirectory: entry.isDirectory,
            size: entry.header.size
        }));

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
