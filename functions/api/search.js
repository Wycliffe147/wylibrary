import allFiles from "../../files-index.json" assert { type: "json" };

export async function onRequest(context) {
    const { searchParams } = new URL(context.request.url);
    const category = searchParams.get('category');
    const query = searchParams.get('query');
    const subpath = searchParams.get('subpath') || "";

    if (!category || !query) {
        return new Response(JSON.stringify({ error: "Missing parameters" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
        });
    }

    const normalizedRequestPath = (category + (subpath ? "/" + subpath : "")).replace(/\\/g, "/");

    // Filter by path AND query
    const results = allFiles.filter(f => {
        const filePath = f.path.replace(/\\/g, "/");
        const matchesPath = filePath.startsWith(normalizedRequestPath);
        const matchesQuery = f.name.toLowerCase().includes(query.toLowerCase());
        return matchesPath && matchesQuery;
    });

    return new Response(JSON.stringify(results), {
        headers: { "Content-Type": "application/json" }
    });
}
