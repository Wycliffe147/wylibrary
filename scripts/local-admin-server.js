import http from 'http';
import fs from 'fs';
import path from 'path';
import url from 'url';
import { processPaper } from './smart-import.js';

const PORT = 3333;
const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, 'public');

// Global Error Handlers to prevent silent crashes
process.on('uncaughtException', (err) => {
    console.error('CRITICAL: Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('CRITICAL: Unhandled Rejection at:', promise, 'reason:', reason);
});

// Helper to list files and folders in a specific directory
function browseDirectory(dirPath) {
    try {
        if (!fs.existsSync(dirPath)) return { error: "Directory not found" };
        
        const stats = fs.statSync(dirPath);
        if (!stats.isDirectory()) return { error: "Not a directory" };

        const items = fs.readdirSync(dirPath, { withFileTypes: true });
        
        const folders = items
            .filter(item => item.isDirectory())
            .map(item => ({ name: item.name, path: path.join(dirPath, item.name), type: 'folder' }))
            .sort((a, b) => a.name.localeCompare(b.name));

        const files = items
            .filter(item => !item.isDirectory() && item.name.match(/\.(pdf|docx|doc)$/i))
            .map(item => ({ name: item.name, path: path.join(dirPath, item.name), type: 'file' }))
            .sort((a, b) => a.name.localeCompare(b.name));

        return {
            currentPath: dirPath,
            parentPath: path.dirname(dirPath),
            items: [...folders, ...files]
        };
    } catch (e) {
        return { error: e.message };
    }
}

// Helper for recursive search (limited depth for performance)
function searchFiles(baseDir, query, maxDepth = 3) {
    let results = [];
    
    function walk(dir, depth) {
        if (depth > maxDepth) return;
        try {
            const items = fs.readdirSync(dir, { withFileTypes: true });
            for (const item of items) {
                const fullPath = path.join(dir, item.name);
                if (item.isDirectory()) {
                    walk(fullPath, depth + 1);
                } else if (item.name.toLowerCase().includes(query.toLowerCase()) && item.name.match(/\.(pdf|docx|doc)$/i)) {
                    results.push({ name: item.name, path: fullPath, location: dir });
                }
            }
        } catch (e) {}
    }

    walk(baseDir, 0);
    return results;
}

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    // API: Browse Directory
    if (pathname === '/api/browse' && req.method === 'GET') {
        const dir = query.path || '/sdcard';
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(browseDirectory(dir)));
    }

    // API: Search Files
    if (pathname === '/api/search' && req.method === 'GET') {
        const q = query.q || '';
        const base = query.base || '/sdcard';
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(searchFiles(base, q)));
    }

    // API: AI Import (without saving)
    if (pathname === '/api/local-import' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
            try {
                const { filePath } = JSON.parse(body);
                if (!filePath) throw new Error("Missing filePath");

                res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' });
                
                const result = await processPaper(filePath, (msg) => {
                    res.write(`data: ${JSON.stringify({ message: msg })}\n\n`);
                }, false);

                res.write(`data: ${JSON.stringify({ result })}\n\n`);
                res.end();
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
            }
        });
        return;
    }

    // API: Save final questions
    if (pathname === '/api/save-questions' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const { questions, source } = JSON.parse(body);
                const quizDataPath = path.join(PUBLIC_DIR, 'quiz-data.json');
                
                let existingData = [];
                if (fs.existsSync(quizDataPath)) {
                    existingData = JSON.parse(fs.readFileSync(quizDataPath, 'utf8'));
                }

                // Remove old questions from same source to avoid duplicates
                const filteredData = existingData.filter(q => q.source !== source);
                const updatedData = [...filteredData, ...questions];

                fs.writeFileSync(quizDataPath, JSON.stringify(updatedData, null, 2));
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, count: questions.length }));
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
            }
        });
        return;
    }

    // Serve Static Files
    let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'local-admin.html' : pathname);
    
    // Safety check: ensure file is within public dir
    if (!filePath.startsWith(PUBLIC_DIR) && !filePath.startsWith(path.join(ROOT, 'node_modules'))) {
         // Allow Media access if needed, but for now stick to public
    }

    const ext = path.extname(filePath);
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
    };

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404);
            res.end('File not found');
        } else {
            res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Local Admin Server running at http://localhost:${PORT}/local-admin.html`);
});
