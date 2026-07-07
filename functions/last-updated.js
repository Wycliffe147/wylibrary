export async function onRequest(context) {
    const user = "Wycliffe147";
    const repo = "e-library"; // Make sure to update this if you change repository names
    const branch = "main";

    const url = `https://api.github.com/repos/${user}/${repo}/commits/${branch}`;

    const headers = {
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "Wycliffe-eLibrary-CloudflareWorker"
    };

    // Environment variables in Cloudflare Pages are on context.env
    if (context.env.GITHUB_TOKEN) {
        headers["Authorization"] = `token ${context.env.GITHUB_TOKEN}`;
    }

    try {
        const response = await fetch(url, { headers });
        if (!response.ok) {
            return new Response(JSON.stringify({ error: "Failed to fetch commit info" }), {
                status: response.status,
                headers: { "Content-Type": "application/json" }
            });
        }

        const data = await response.json();
        const date = data.commit.committer.date;

        return new Response(JSON.stringify({ date }), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
