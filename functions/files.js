import allFiles from "../files-index.json" assert { type: "json" };

export async function onRequest(context) {
    const { searchParams } = new URL(context.request.url);
    const category = searchParams.get('category');
    const subpath = searchParams.get('subpath') || "";
    const count = searchParams.get('count') === "true";
    const recursive = searchParams.get('recursive') === "true";

    if (!category) {
        return new Response(JSON.stringify({ error: "Category required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
        });
    }

    // Normalize path to category/subpath
    const normalizedRequestPath = (category + (subpath ? "/" + subpath : "")).replace(/\\/g, "/");

    // Filter files that belong to this category and subpath
    const filteredFiles = allFiles.filter(f => f.path.replace(/\\/g, "/").startsWith(normalizedRequestPath));

    if (count) {
        const totalSize = filteredFiles.reduce((sum, f) => sum + (f.size || 0), 0);
        return new Response(JSON.stringify({ total: filteredFiles.length, size: totalSize }), {
            headers: { "Content-Type": "application/json" }
        });
    }

    if (recursive) {
        return new Response(JSON.stringify({ 
            files: filteredFiles.map(f => f.path),
            filesWithInfo: filteredFiles 
        }), {
            headers: { "Content-Type": "application/json" }
        });
    }

    // For non-recursive view, we simulate folder structure
    const folders = new Set();
    const files = [];

    const currentPath = normalizedRequestPath.endsWith("/") ? normalizedRequestPath : normalizedRequestPath + "/";

    filteredFiles.forEach(f => {
        const filePath = f.path.replace(/\\/g, "/");
        if (filePath === normalizedRequestPath) return;

        const relativeToCurrent = filePath.substring(currentPath.length);
        const parts = relativeToCurrent.split("/");

        if (parts.length > 1) {
            folders.add(parts[0]);
        } else {
            files.push({ name: f.name, size: f.size });
        }
    });

    const folderList = Array.from(folders).map(name => ({
        name,
        count: filteredFiles.filter(f => f.path.replace(/\\/g, "/").includes(`${currentPath}${name}/`)).length
    }));

    return new Response(JSON.stringify({ folders: folderList, files }), {
        headers: { "Content-Type": "application/json" }
    });
}
