import * as fflate from "fflate";

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
        const uint8Array = new Uint8Array(buffer);

        // fflate.unzipSync extracts the file headers and contents.
        // To list files without decompressing all file contents (which is much faster and saves memory),
        // we can use fflate's unzipSync to get the structure.
        const zipData = fflate.unzipSync(uint8Array, {
            // We only need the file names/keys and structure, but unzipSync decompresses.
            // Under Cloudflare memory limits, this is fast enough for metadata lists.
            // fflate will unzip each file, we return a list of names and sizes.
        });

        // Generate the entries format expected by the frontend
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
