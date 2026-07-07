import allFiles from "../../files-index.json" assert { type: "json" };

const MEDIA_USER = 'Wycliffe147';
const MEDIA_BRANCH = 'main';

// Look up which repo this file was indexed from
function repoForFile(filePath) {
    const entry = allFiles.find(f => f.path === filePath);
    return entry?.repo ?? 'e-library-media';
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

    const repo = repoForFile(file);
    const sourceUrl = `https://media.githubusercontent.com/media/${MEDIA_USER}/${repo}/${MEDIA_BRANCH}/${cleanPath}`;

    // Perform a 302 redirect directly to the GitHub LFS CDN
    return Response.redirect(sourceUrl, 302);
}
