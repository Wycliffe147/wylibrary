const APP_VERSION = 'v11.1';
const app = document.getElementById("app");

// Capture deep-link flag immediately - before the hash is replaced by navigation.
// window.location.hash changes as soon as the app routes to the folder view, so we
// must snapshot it here, at the very top of the script, before any routing runs.
window.__arrivedViaFileDeepLink = window.location.hash.startsWith('#/file/');

let currentCategory = null;
let currentPath = "";
let pendingHighlightId = null;   // set by deep links (#/file/<id>); consumed after the folder renders

// ─── Client-Side Catalog Manager ─────────────────────────────────────────────

let catalogPromise = null;
let catalog = [];
let catalogByPath = new Map();   // normalized path -> catalog entry (has .id once add-ids.mjs has run)

async function getCatalog() {
    if (catalog && catalog.length > 0) return catalog;
    if (!catalogPromise) {
        catalogPromise = fetch('/files-index.json')
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const etag = res.headers.get('etag');
                if (etag) {
                    try { localStorage.setItem('wylibrary_catalog_etag', etag); } catch (e) {}
                }
                return res.json();
            })
            .then(data => {
                catalog = Array.isArray(data) ? data : [];
                catalogByPath = new Map(catalog.map(f => [normalizePath(f.path), f]));
                try { localStorage.setItem('wylibrary_catalog_count', String(catalog.length)); } catch (e) {}
                // Online: make sure saved offline copies still match the library
                // (handles renamed / moved / replaced / deleted files).
                if (navigator.onLine && window.WyOffline) WyOffline.reconcile(catalog);
                return catalog;
            })
            .catch(err => {
                console.error('Failed to load /files-index.json:', err);
                catalogPromise = null;
                return [];
            });
    }
    return catalogPromise;
}

// Start loading the catalog in the background immediately
getCatalog();

function normalizePath(p) {
    return (p || "").replace(/\\/g, "/");
}

function getCategoryStats(allFiles, category) {
    const cleanCat = category.replace(/^\/+|\/+$/g, "");
    const prefix = cleanCat + "/";
    const matching = allFiles.filter(f => {
        const p = normalizePath(f.path);
        return p === cleanCat || p.startsWith(prefix);
    });
    const total = matching.length;
    const size = matching.reduce((sum, f) => sum + (f.size || 0), 0);
    return { total, size };
}

function getFolderContents(allFiles, category, subFolder = "") {
    const cleanSub = subFolder.replace(/^\/+|\/+$/g, "");
    const normalizedRequestPath = (category + (cleanSub ? "/" + cleanSub : "")).replace(/\\/g, "/");
    const currentPrefix = normalizedRequestPath.endsWith("/") ? normalizedRequestPath : normalizedRequestPath + "/";

    const filteredFiles = allFiles.filter(f => {
        const p = normalizePath(f.path);
        return p.startsWith(currentPrefix);
    });

    const folderMap = new Map();
    const files = [];

    filteredFiles.forEach(f => {
        const filePath = normalizePath(f.path);
        const relativeToCurrent = filePath.substring(currentPrefix.length);
        const parts = relativeToCurrent.split("/");

        if (parts.length > 1) {
            const folderName = parts[0];
            folderMap.set(folderName, (folderMap.get(folderName) || 0) + 1);
        } else {
            files.push({ name: f.name || parts[0], size: f.size || 0, path: filePath });
        }
    });

    const folders = Array.from(folderMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));

    files.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));

    return { folders, files };
}

function getRecursiveFiles(allFiles, category, folderPath = "") {
    const cleanSub = folderPath.replace(/^\/+|\/+$/g, "");
    const normalizedRequestPath = (category + (cleanSub ? "/" + cleanSub : "")).replace(/\\/g, "/");
    const prefix = normalizedRequestPath.endsWith("/") ? normalizedRequestPath : normalizedRequestPath + "/";

    return allFiles
        .filter(f => normalizePath(f.path).startsWith(prefix))
        .map(f => ({
            name: f.name || normalizePath(f.path).split("/").pop(),
            path: normalizePath(f.path),
            size: f.size || 0
        }));
}

function searchCatalog(allFiles, category, subFolder = "", query = "") {
    const cleanSub = subFolder.replace(/^\/+|\/+$/g, "");
    const normalizedRequestPath = (category + (cleanSub ? "/" + cleanSub : "")).replace(/\\/g, "/");
    const prefix = normalizedRequestPath.endsWith("/") ? normalizedRequestPath : normalizedRequestPath + "/";
    const lowerQ = query.trim().toLowerCase();

    if (!lowerQ) return [];

    return allFiles
        .filter(f => {
            const filePath = normalizePath(f.path);
            const matchesPath = filePath.startsWith(prefix);
            const matchesQuery = (f.name || filePath.split("/").pop()).toLowerCase().includes(lowerQ);
            return matchesPath && matchesQuery;
        })
        .map(f => ({
            name: f.name || normalizePath(f.path).split("/").pop(),
            path: normalizePath(f.path),
            size: f.size || 0
        }))
        .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));
}

// ─── Dark Mode ───────────────────────────────────────────────────────────────

function initDarkMode() {
    const saved = localStorage.getItem("darkMode");

    // Only add dark class if explicitly saved as "true"
    if (saved === "true") {
        document.documentElement.classList.add("dark");
    }

    const btn = document.getElementById("darkModeToggle");
    if (btn) updateToggleIcon(btn);
}

function updateToggleIcon(btn) {
    const isDark = document.documentElement.classList.contains("dark");
    btn.textContent = isDark ? "☀️" : "🌙";
    btn.title = isDark ? "Switch to light mode" : "Switch to dark mode";
}

function toggleDarkMode() {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("darkMode", isDark);
    const btn = document.getElementById("darkModeToggle");
    if (btn) updateToggleIcon(btn);
}

function formatSize(bytes) {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// ─── Page Transitions ────────────────────────────────────────────────────────

function transitionOut() {
    return new Promise(resolve => {
        app.classList.add("page-exit");
        setTimeout(() => {
            app.classList.remove("page-exit");
            resolve();
        }, 220);
    });
}

function transitionIn() {
    app.classList.add("page-enter");
    // Force reflow
    void app.offsetWidth;
    app.classList.add("page-enter-active");
    setTimeout(() => {
        app.classList.remove("page-enter", "page-enter-active");
    }, 320);
}

async function navigateTo(renderFn, pageTitle) {
    await transitionOut();
    renderFn();
    transitionIn();

    // Track page view in Google Analytics
    if (typeof gtag === 'function') {
        gtag('event', 'page_view', {
            page_title: pageTitle || document.title,
            page_location: window.location.href,
            page_path: window.location.pathname + window.location.search + window.location.hash
        });
    }
}

// ─── Analytics helper ───────────────────────────────────────────────────────
// Central wrapper so we only need one gtag guard everywhere.
function trackEvent(eventName, params) {
    if (typeof gtag === 'function') {
        gtag('event', eventName, params);
    }
}

// ─── History / Routing ──────────────────────────────────────────────────────

function handleRouteFromUrl() {
    const hash = window.location.hash || "";
    if (hash.startsWith("#/saved")) {
        const sub = hash.replace(/^#\/saved\/?/, "").split("/").filter(Boolean).map(decodeURIComponent).join("/");
        loadSaved(false, sub);
    } else if (hash.startsWith("#/about")) {
        loadAbout(false);
    } else if (hash.startsWith("#/contact")) {
        loadRequest(false);
    } else if (hash.startsWith("#/practice")) {
        loadPractice(false);
    } else if (hash.startsWith("#/file/")) {
        // Deep link to one file: #/file/<id>  (id = stable catalog id, or the file path as a fallback)
        const key = hash.slice("#/file/".length).split(/[?/]/)[0];
        let decoded = "";
        try { decoded = decodeURIComponent(key); } catch (_) { /* malformed link */ }
        openSharedFile(decoded);
    } else if (hash.startsWith("#/folder/")) {
        const raw = hash.replace("#/folder/", "");
        const parts = raw.split("/");
        const category = decodeURIComponent(parts[0] || "");
        const subFolder = parts.slice(1).map(decodeURIComponent).join("/");
        if (category) {
            loadFolder(category, subFolder, false);
            return;
        }
        loadHome(false);
    } else {
        loadHome(false);
    }
}

window.addEventListener("popstate", () => {
    handleRouteFromUrl();
});
window.addEventListener("hashchange", () => {
    handleRouteFromUrl();
});

// ─── Skeletons ──────────────────────────────────────────────────────────────

function showHomeSkeleton() {
    app.innerHTML = `
        <div class="cards" id="homeCardsInApp">
            ${Array(4).fill(`
                <div>
                    <div class="card skeleton-home-card">
                        <div class="skeleton-cover skeleton-pulse"></div>
                        <div class="card-text">
                            <div class="skeleton-line skeleton-pulse" style="width:80%;height:14px"></div>
                            <div class="skeleton-line skeleton-pulse" style="width:50%;height:12px;margin-top:8px"></div>
                        </div>
                    </div>
                </div>
            `).join("")}
        </div>
    `;
}

function showFolderSkeleton() {
    app.innerHTML = `
        <div class="breadcrumb-container">
            <div class="skeleton-line skeleton-pulse" style="width:200px;height:16px"></div>
        </div>
        <div class="folder-meta">
            <div class="skeleton-line skeleton-pulse" style="width:100px;height:13px"></div>
        </div>
        <div class="search-container">
            <div class="skeleton-line skeleton-pulse" style="width:100%;height:38px;border-radius:6px"></div>
        </div>
        <div class="grid">
            ${Array(6).fill(`
                <div class="skeleton-file-card skeleton-pulse">
                    <div class="skeleton-line" style="width:70%;height:14px"></div>
                    <div class="skeleton-line" style="width:40%;height:12px;margin-top:10px"></div>
                </div>
            `).join("")}
        </div>
    `;
}

// ─── Home ───────────────────────────────────────────────────────────────────

async function loadHome(push = true) {
    currentCategory = null;
    currentPath = "";

    if (push) {
        history.pushState({ view: "home" }, "", "#/");
        await navigateTo(_renderHome, "Home - e-library");
    } else {
        _renderHome();
    }
}

function _renderHome() {
    showHomeSkeleton();

    const categories = [
        { id: "card1", category: "Books",  img: "https://raw.githubusercontent.com/Wycliffe147/e-library-media/main/images/Excel_Phy.png",   label: "Read books, pamphlets & notes" },
        { id: "card2", category: "Exams",  img: "https://raw.githubusercontent.com/Wycliffe147/e-library-media/main/images/MANEB_Maths.png", label: "See exam/test papers" },
        { id: "card4", category: "Zips",   img: "https://raw.githubusercontent.com/Wycliffe147/e-library-media/main/images/zips.png",         label: "Download zip packages" },
        { id: "card3", category: "Q&A",    img: "https://raw.githubusercontent.com/Wycliffe147/e-library-media/main/images/Q&A.png",          label: "Study questions & model answers" },
    ];

    app.innerHTML = `
        <a href="#/saved" id="savedLink" class="saved-link hidden">
            <span>📥 My saved books</span><span class="saved-count"></span>
        </a>
        <div class="cards" id="homeCardsInApp">
            ${categories.map(c => `
                <div id="${c.id}">
                    <a href="#" class="card" data-category="${c.category}">
                        <img class="cover" src="${c.img}" alt="cover"/>
                        <div class="card-text">
                            <p>${c.label}</p>
                            <span class="file-count" id="count-${c.category}">
                                <span class="skeleton-count skeleton-pulse"></span>
                            </span>
                        </div>
                    </a>
                </div>
            `).join("")}
        </div>
    `;

    document.querySelectorAll('.cards a').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            loadFolder(a.dataset.category);
        });
    });

    initSavedLink();

    // Compute library counts and size directly from client catalog
    getCatalog().then(allFiles => {
        let totalFiles = 0;
        let totalSize = 0;

        categories.forEach(({ category }) => {
            const stats = getCategoryStats(allFiles, category);
            const el = document.getElementById(`count-${category}`);
            if (el) el.textContent = `${stats.total} file${stats.total !== 1 ? "s" : ""}`;
            totalFiles += stats.total;
            totalSize += stats.size;
        });

        const totalEl = document.getElementById("total-books");
        if (totalEl) totalEl.textContent = totalFiles;

        const sizeEl = document.getElementById("total-size");
        if (sizeEl) sizeEl.textContent = formatSize(totalSize);
    }).catch(err => {
        console.error("Error computing home stats:", err);
    });
}

// ─── About ──────────────────────────────────────────────────────────────────

async function loadAbout(push = true) {
    if (push) {
        history.pushState({ view: "about" }, "", "#/about");
        await navigateTo(_renderAbout, "About - e-library");
    } else {
        _renderAbout();
    }
}

function _renderAbout() {
    app.innerHTML = `
        <section class="about-section">
            <div class="developer-card reveal">
                <h3>About the Developer</h3>
                <p>
                    Hi, I'm Wycliffe Mwanganda 👋, a student developer passionate about building
                    practical tech solutions for schools and any interested institutions.
                </p>
                <a href="https://wyport.vercel.app" target="_blank" class="dev-link">
                    Visit My Portfolio
                </a>
            </div>

            <div class="about-content">
                <h2>About This Project</h2>
                <p>
                    This e-library allows students to browse, search, and read educational resources online.
                </p>
                <div class="about-flex reveal">
                    <img src="https://raw.githubusercontent.com/Wycliffe147/e-library-media/main/images/about.png" alt="About image" class="about-image" />
                    <p>
                        "I think having this website is better than relying on WhatsApp groups alone
                        because documents have to be sent every time someone new wants them."
                    </p>
                </div>
                <p><button type="button" class="wn-link wn-link-about" data-wn-open>What’s new in ${APP_VERSION}</button></p>
                <div class="tech-stack">
                    <p><strong>Technologies:</strong> HTML5, CSS3, Modern JavaScript (ES6+), Node.js, Vercel Serverless Functions, GitHub API (for automation).</p>
                    <p><strong>Features:</strong> Single Page Application (SPA) navigation, real-time search, dark mode theme, ZIP file content preview, dynamic library statistics, automated "Last Updated" tracking, and a fully responsive mobile-first layout.</p>
                </div>
            </div>
        </section>
    `;
    activateScrollReveal();
}

// ─── Request ─────────────────────────────────────────────────────────────────

async function loadRequest(push = true) {
    if (push) {
        history.pushState({ view: "request" }, "", "#/contact");
        await navigateTo(_renderRequest, "Contact - e-library");
    } else {
        _renderRequest();
    }
}

function _renderRequest() {
    app.innerHTML = `
        <section class="contact-section">
            <h2>Contact Me</h2>

            <p>If you want a specific book, pamphlet, or exam paper added to the library, reach out:</p>
            <ul>
                <li>Email: <a href="mailto:wycliffemwanganda@gmail.com">Email me</a></li>
                <li>WhatsApp: <a href="https://wa.me/265984153455" target="_blank">Let's talk</a></li>
            </ul>
        </div>
    `;
}

// ─── Practice (Quiz) ─────────────────────────────────────────────────────────

async function loadPractice(push = true) {
    if (push) {
        history.pushState({ view: "practice" }, "", "#/practice");
        await navigateTo(_renderPractice, "Practice - e-library");
    } else {
        _renderPractice();
    }
}

async function _renderPractice() {
    app.innerHTML = `
        <div class="practice-container">
            <div id="quiz-header">
                <h2>Interactive Practice</h2>
                <p>Test your knowledge with these practice questions.</p>
            </div>
            <div id="quiz-app">
                <div class="skeleton-line skeleton-pulse" style="width:100%;height:100px;margin-bottom:20px"></div>
            </div>
        </div>
    `;

    try {
        const res = await fetch("/quiz-data.json");
        const questions = await res.json();
        initQuiz(questions);
    } catch (err) {
        document.getElementById("quiz-app").innerHTML = `<p class="error-text">Failed to load practice questions.</p>`;
    }
}

function initQuiz(questions) {
    const quizApp = document.getElementById("quiz-app");
    let currentIdx = 0;
    let score = 0;

    function scrollToQuiz() {
        const header = document.getElementById("quiz-header");
        if (header) {
            header.scrollIntoView({ behavior: 'smooth' });
        }
    }

    function renderQuestion() {
        if (currentIdx >= questions.length) {
            // Track quiz completion
            trackEvent('quiz_complete', {
                score: score,
                total: questions.length,
                percent: Math.round((score / questions.length) * 100)
            });
            quizApp.innerHTML = `
                <div class="quiz-results">
                    <h3>Practice Complete!</h3>
                    <p>Your score: <strong>${score} / ${questions.length}</strong></p>
                    <button class="btn-confirm" onclick="loadPractice()">Restart</button>
                    <button class="btn-cancel" onclick="loadHome()">Back Home</button>
                </div>
            `;
            scrollToQuiz();
            return;
        }

        const q = questions[currentIdx];
        quizApp.innerHTML = `
            <div class="quiz-card">
                <div class="quiz-meta">Topic: ${q.topic} | Question ${currentIdx + 1} of ${questions.length}</div>
                <div class="quiz-question">${q.question}</div>
                <div class="quiz-options">
                    ${q.options.map((opt, i) => `
                        <button class="quiz-option-btn" data-index="${i}">
                            <strong>${"ABCD"[i]}.</strong> ${opt}
                        </button>
                    `).join("")}
                </div>
                <div id="quiz-feedback" class="hidden"></div>
                <div class="quiz-source">Source: ${q.source || "Unknown"}</div>
                <button id="next-btn" class="btn-confirm hidden">Next Question</button>
            </div>
        `;

        scrollToQuiz();

        const btns = quizApp.querySelectorAll(".quiz-option-btn");
        const feedback = document.getElementById("quiz-feedback");
        const nextBtn = document.getElementById("next-btn");

        btns.forEach(btn => {
            btn.onclick = () => {
                const selectedIdx = parseInt(btn.dataset.index);
                const isCorrect = selectedIdx === q.answer;
                
                // Disable all buttons
                btns.forEach(b => b.disabled = true);
                
                // Highlight correct/incorrect
                btn.classList.add(isCorrect ? "correct" : "incorrect");
                btns[q.answer].classList.add("correct");

                if (isCorrect) score++;

                // Track each answer
                trackEvent('quiz_answer', {
                    question_index: currentIdx + 1,
                    topic: q.topic,
                    correct: isCorrect
                });

                feedback.innerHTML = `
                    <p class="${isCorrect ? 'text-correct' : 'text-incorrect'}">
                        ${isCorrect ? "<strong>Correct!</strong>" : "<strong>Incorrect.</strong>"}
                    </p>
                    <p class="explanation">${q.explanation}</p>
                `;
                feedback.classList.remove("hidden");
                nextBtn.classList.remove("hidden");
            };
        });

        nextBtn.onclick = () => {
            currentIdx++;
            renderQuestion();
        };
    }

    renderQuestion();
}

function debounce(fn, delay) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

function formatBytes(bytes, decimals = 1) {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

async function showZipContents(file, filePath) {
    const modal = document.createElement("div");
    modal.className = "zip-modal";
    modal.innerHTML = `
        <div class="zip-modal-content">
            <div class="zip-modal-header">
                <h3>Contents of ${file}</h3>
                <button class="close-zip-modal">&times;</button>
            </div>
            <div class="zip-modal-body">
                <div class="skeleton-line skeleton-pulse" style="width:100%;height:20px;margin-bottom:10px"></div>
                <div class="skeleton-line skeleton-pulse" style="width:90%;height:20px;margin-bottom:10px"></div>
                <div class="skeleton-line skeleton-pulse" style="width:95%;height:20px;margin-bottom:10px"></div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector(".close-zip-modal").onclick = () => {
        document.body.removeChild(modal);
    };

    modal.onclick = (e) => {
        if (e.target === modal) document.body.removeChild(modal);
    };

    try {
        const res = await fetch(`/api/zip-contents?file=${encodeURIComponent(filePath)}`);
        if (!res.ok) throw new Error("Failed to load contents");
        const entries = await res.json();

        const body = modal.querySelector(".zip-modal-body");
        if (entries.length === 0) {
            body.innerHTML = "<p>This ZIP file is empty.</p>";
        } else {
            body.innerHTML = `
                <ul class="zip-entry-list">
                    ${entries.map(entry => `
                        <li>
                            <span class="entry-name">${entry.isDirectory ? "📁" : "📄"} ${entry.name}</span>
                            ${!entry.isDirectory ? `<span class="entry-size">${formatBytes(entry.size)}</span>` : ""}
                        </li>
                    `).join("")}
                </ul>
            `;
        }
    } catch (err) {
        modal.querySelector(".zip-modal-body").innerHTML = `<p class="error-text">Error: ${err.message}</p>`;
    }
}

// ─── Render file card helper ─────────────────────────────────────────────────

function renderFileCard(file, filePath, isDownloads, size) {
    const ext = file.split(".").pop().toLowerCase();
    let icon = "📄";
    if (ext === "pdf") icon = "📕";
    else if (ext === "doc" || ext === "docx") icon = "📝";
    else if (ext === "xls" || ext === "xlsx") icon = "📊";
    else if (ext === "ppt" || ext === "pptx") icon = "📽️";
    else if (ext === "zip" || ext === "rar") icon = "🗜️";

    const cleanName = file.replace(/\.[^/.]+$/, "");
    const card = document.createElement("div");
    card.className = "file-card";

    // Stable id (survives renames/moves) once scripts/add-ids.mjs has been run;
    // until then the path doubles as the id.
    const catEntry = catalogByPath.get(normalizePath(filePath));
    const docId = (catEntry && catEntry.id) ? catEntry.id : normalizePath(filePath);
    card.dataset.docId = docId;

    let openUrl = `/api/download?file=${encodeURIComponent(filePath)}`;
    
    // Open PDFs in our built-in PDF.js viewer (works on all devices, no size limit).
    // Use Google Docs Viewer only for Office files (Word/Excel/PowerPoint).
    if (ext === "pdf") {
        openUrl = `/pdf-viewer?file=${encodeURIComponent(filePath)}&id=${encodeURIComponent(docId)}`;
    } else {
        const officeExts = ["doc", "docx", "xls", "xlsx", "ppt", "pptx"];
        if (officeExts.includes(ext)) {
            const absoluteUrl = window.location.origin + `/api/download?file=${encodeURIComponent(filePath)}`;
            openUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(absoluteUrl)}&embedded=true`;
        }
    }

    const sizeHTML = size ? `<span class="file-size" style="font-size: 0.8em; opacity: 0.7; margin-left: 5px;">(${formatBytes(size)})</span>` : '';

    const isZip = ext === "zip";

    if (isDownloads) {
        card.innerHTML = `
            <div class="file-top">
                <input type="checkbox" class="file-checkbox" value="${filePath}" data-size="${size || 0}" data-name="${file}">
                <span>${icon} ${cleanName} ${sizeHTML}</span>
            </div>
            <div class="file-actions">
                ${isZip ? `<button class="open-zip-btn" data-file="${file}" data-path="${filePath}">View Contents</button>` : ""}
                <a href="/api/download?file=${encodeURIComponent(filePath)}&mode=download" download="${file}">Download</a>
                <a href="#" class="share-link" onclick="event.preventDefault(); shareFile('${file.replace(/'/g, "\\'")}', '${filePath.replace(/'/g, "\\'")}')">Share</a>
            </div>
        `;
    } else {
        card.innerHTML = `
            <div class="file-top">
                <input type="checkbox" class="file-checkbox" value="${filePath}" data-size="${size || 0}" data-name="${file}">
                <span>${icon} ${cleanName} ${sizeHTML}</span>
            </div>
            <div class="file-actions">
                ${isZip ? 
                    `<button class="open-zip-btn" data-file="${file}" data-path="${filePath}">View Contents</button>` : 
                    `<a href="${openUrl}" class="open-link"${ext === "pdf" ? "" : ' target="_blank"'}>Open</a>`
                }
                <a href="/api/download?file=${encodeURIComponent(filePath)}&mode=download" download="${file}">Download</a>
                <a href="#" class="share-link" onclick="event.preventDefault(); shareFile('${file.replace(/'/g, "\\'")}', '${filePath.replace(/'/g, "\\'")}')">Share</a>
            </div>
        `;
    }

    const zipBtn = card.querySelector(".open-zip-btn");
    if (zipBtn) {
        zipBtn.onclick = () => showZipContents(file, filePath);
    }

    // Track single-file download clicks
    const downloadLink = card.querySelector('a[download]');
    if (downloadLink) {
        downloadLink.addEventListener('click', () => {
            trackEvent('file_download', {
                file_name: file,
                file_path: filePath,
                file_ext: file.split('.').pop().toLowerCase()
            });
        });
    }

    // Track "Open" clicks (PDF viewer / Office viewer)
    const openLink = card.querySelector('a.open-link');
    if (openLink) {
        openLink.addEventListener('click', () => {
            trackEvent('file_open', {
                file_name: file,
                file_path: filePath,
                file_ext: file.split('.').pop().toLowerCase()
            });
        });
    }

    // Offline saving (not offered for big ZIP packages)
    if (!isZip) {
        decorateFileCard(card, {
            id: docId,
            path: filePath,
            name: file,
            size: size || (catEntry && catEntry.size) || 0,
            version: (catEntry && (catEntry.etag || catEntry.version || catEntry.modified)) || null,
            ext
        });
    }

    return card;
}

// ─── Offline: "Save offline" buttons & My Saved Books ───────────────────────

function offlineAvailable() {
    return !!(window.WyOffline && WyOffline.isSupported());
}

function escapeHtmlText(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, ch =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
}

function showToast(message) {
    showUpdateSuccessToast(message);
}

// Anything marked .is-disabled (needs internet, not saved) explains itself instead of failing.
document.addEventListener("click", (e) => {
    const link = e.target.closest && e.target.closest("a.is-disabled");
    if (link) {
        e.preventDefault();
        e.stopPropagation();
        showToast("📡 Needs internet. Save books for offline while you're online.");
    }
}, true);

function decorateFileCard(card, info) {
    if (!offlineAvailable()) return;
    const actions = card.querySelector(".file-actions");
    if (!actions) return;

    card._docInfo = info;
    card.dataset.docId = info.id;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn-save-offline";
    actions.insertBefore(btn, actions.lastElementChild);   // Open, Download, Save offline, Share
    btn.addEventListener("click", () => onSaveButton(card, btn));

    // Offline + saved: hand over the saved copy instead of hitting the network.
    const exportSaved = (e) => {
        if (!navigator.onLine && WyOffline.get(info.id)) {
            e.preventDefault();
            WyOffline.exportFile(info.id, info.name).catch(err => showToast("⚠️ " + err.message));
        }
    };
    const dl = card.querySelector("a[download]");
    if (dl) dl.addEventListener("click", exportSaved);
    const open = card.querySelector('a.open-link');
    if (open && info.ext !== "pdf") open.addEventListener("click", exportSaved);

    WyOffline.ready().then(() => refreshFileCard(card));
}

function refreshFileCard(card) {
    const info = card._docInfo;
    const btn = card.querySelector(".btn-save-offline");
    if (!info || !btn) return;

    const doc = WyOffline.get(info.id);
    const online = navigator.onLine;
    card.classList.toggle("is-saved", !!doc);

    // Offline and not saved: Open/Download can't work, so say so up front.
    card.querySelectorAll('.file-actions a[download], .file-actions a.open-link').forEach(a => {
        const block = !online && !doc;
        a.classList.toggle("is-disabled", block);
        a.setAttribute("aria-disabled", block ? "true" : "false");
        a.title = block ? "Needs internet. Save it for offline while online." : "";
    });

    if (btn.dataset.busy) return;
    if (doc && doc.status === "outdated") {
        btn.textContent = "Update";
        btn.dataset.mode = "update";
        btn.disabled = !online;
        btn.title = "A newer version is in the library. Tap to update your saved copy.";
    } else if (doc) {
        btn.textContent = "✓ Saved";
        btn.dataset.mode = "remove";
        btn.disabled = false;
        btn.title = "Tap to remove from offline storage";
    } else {
        btn.textContent = "Save offline";
        btn.dataset.mode = "save";
        btn.disabled = !online;
        btn.title = online ? "" : "Needs internet";
    }
}

function refreshAllFileCards() {
    document.querySelectorAll(".file-card").forEach(refreshFileCard);
}

async function onSaveButton(card, btn) {
    const info = card._docInfo;
    if (btn.dataset.mode === "remove") {
        if (!confirm(`Remove "${info.name}" from offline storage?`)) return;
        try { await WyOffline.remove(info.id); }
        catch (err) { showToast("⚠️ " + (err.message || "Could not remove it.")); }
        return;
    }

    btn.dataset.busy = "1";
    btn.disabled = true;
    btn.title = "Saving for offline…";
    btn.textContent = "0%";
    try {
        await WyOffline.save(info, p => { btn.textContent = `${Math.round(p * 100)}%`; });
        trackEvent("offline_save", { file_name: info.name, file_path: info.path });
    } catch (err) {
        showToast("⚠️ " + (err.message || "Could not save this file."));
    } finally {
        delete btn.dataset.busy;
        refreshFileCard(card);
    }
}

// Home: "My saved books" shortcut (only shown when something is saved)
function initSavedLink() {
    const link = document.getElementById("savedLink");
    if (!link) return;
    link.addEventListener("click", (e) => { e.preventDefault(); loadSaved(); });
    updateSavedLink();
}

function updateSavedLink() {
    const link = document.getElementById("savedLink");
    if (!link || !offlineAvailable()) return;
    WyOffline.ready().then(() => {
        const n = WyOffline.count();
        link.classList.toggle("hidden", n === 0);
        const c = link.querySelector(".saved-count");
        if (c) c.textContent = `${n} saved`;
    });
}

// Saved Books page (folders work like the library folders: tap to go in, breadcrumb to go back)
let savedPath = "";

async function loadSaved(push = true, subPath = "") {
    savedPath = subPath || "";
    if (push) {
        const hash = savedPath
            ? "#/saved/" + savedPath.split("/").map(encodeURIComponent).join("/")
            : "#/saved";
        history.pushState({ view: "saved", subPath: savedPath }, "", hash);
        await navigateTo(_renderSaved, "Saved books - e-library");
    } else {
        _renderSaved();
    }
}

async function _renderSaved() {
    currentCategory = null;
    currentPath = "";
    app.innerHTML = `
        <div class="breadcrumb-container" id="savedCrumbs"></div>
        <div class="folder-meta"><span class="folder-file-count" id="savedMeta"></span></div>
        <div class="search-container">
            <input type="text" id="searchInput" placeholder="Search saved books..." />
        </div>
        <div class="folder-actions-bar">
            <button id="downloadSelected">Download Selected</button>
            <span id="selectAllToggle" class="select-all-toggle">Select All</span>
        </div>
        <div class="grid" id="savedList"></div>
    `;
    if (offlineAvailable()) await WyOffline.ready();
    renderSavedList();
    initSavedSelection();

    const searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("input", () => renderSavedList());
    const trackSavedSearch = debounce((query) => {
        if (query.length < 2) return;
        trackEvent('search', { search_term: query, search_folder: "Saved books" });
    }, 1500);
    searchInput.addEventListener("input", () => trackSavedSearch(searchInput.value.trim()));
}

function renderSavedCrumbs() {
    const box = document.getElementById("savedCrumbs");
    if (!box) return;
    const parts = savedPath.split("/").filter(Boolean);
    let html = `<span class="breadcrumb" data-home="true">Home</span> / <span class="breadcrumb" data-path="">Saved books</span>`;
    let sofar = "";
    parts.forEach(p => {
        sofar = sofar ? `${sofar}/${p}` : p;
        html += ` / <span class="breadcrumb" data-path="${escapeHtmlText(sofar)}">${escapeHtmlText(p)}</span>`;
    });
    box.innerHTML = html;
    box.querySelectorAll(".breadcrumb").forEach(span => {
        span.addEventListener("click", () => {
            if (span.dataset.home) loadHome();
            else loadSaved(true, span.dataset.path || "");
        });
    });
}

function renderSavedList() {
    const list = document.getElementById("savedList");
    const meta = document.getElementById("savedMeta");
    if (!list) return;

    const docs = offlineAvailable() ? WyOffline.list() : [];
    const dirOf = d => normalizePath(d.path).split("/").filter(Boolean).slice(0, -1);

    // If the current folder has emptied out (e.g. last book removed), step up to one that has files
    while (savedPath && !docs.some(d => (dirOf(d).join("/") + "/").startsWith(savedPath + "/"))) {
        savedPath = savedPath.split("/").slice(0, -1).join("/");
        history.replaceState({ view: "saved", subPath: savedPath }, "",
            savedPath ? "#/saved/" + savedPath.split("/").map(encodeURIComponent).join("/") : "#/saved");
    }
    renderSavedCrumbs();

    const base = savedPath ? savedPath.split("/") : [];
    const inScope = docs.filter(d => {
        const dir = dirOf(d);
        return base.every((p, i) => dir[i] === p);
    });

    // Direct subfolders and files of the current folder
    const folders = new Map();   // name -> file count
    const files = [];
    inScope.forEach(d => {
        const dir = dirOf(d);
        if (dir.length === base.length) files.push(d);
        else folders.set(dir[base.length], (folders.get(dir[base.length]) || 0) + 1);
    });

    const total = inScope.reduce((sum, d) => sum + (d.bytes || d.size || 0), 0);
    if (meta) {
        if (!docs.length) meta.textContent = "Nothing saved yet";
        else if (folders.size && files.length) meta.textContent = `${folders.size} folder${folders.size !== 1 ? "s" : ""}, ${files.length} file${files.length !== 1 ? "s" : ""}`;
        else if (folders.size) meta.textContent = `${folders.size} folder${folders.size !== 1 ? "s" : ""} in this section`;
        else meta.textContent = `${files.length} file${files.length !== 1 ? "s" : ""} in this folder`;
        if (docs.length) meta.textContent += ` · ${formatBytes(total)} on this device`;
    }

    list.innerHTML = "";
    if (!docs.length) {
        list.innerHTML = `<p class="empty-state">No saved books yet. Tap “Save offline” on any file while you’re online and it will show up here.</p>`;
        return;
    }

    // Search: flat list of matching files in this folder (and below), like the library search
    const searchInput = document.getElementById("searchInput");
    const rawQuery = searchInput ? searchInput.value.trim() : "";
    if (rawQuery) {
        const words = rawQuery.toLowerCase().split(/\s+/);
        const hits = inScope.filter(d => {
            const hay = (d.name + " " + normalizePath(d.path)).toLowerCase();
            return words.every(w => hay.includes(w));
        });
        if (!hits.length) {
            list.innerHTML = `<p class="empty-state">No files found for "<strong>${escapeHtmlText(rawQuery)}</strong>" in this folder.</p>`;
            return;
        }
        hits.forEach(d => list.appendChild(buildSavedCard(d)));
        return;
    }

    [...folders.keys()]
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }))
        .forEach(name => {
            const n = folders.get(name);
            const card = document.createElement("div");
            card.className = "folder-card";
            card.innerHTML = `
                <div class="folder-top">
                    <input type="checkbox" class="folder-checkbox">
                    <span class="folder-name">📁 ${escapeHtmlText(name)}</span>
                </div>
                <span class="folder-count-badge">${n} file${n !== 1 ? "s" : ""}</span>
            `;
            const folderCb = card.querySelector(".folder-checkbox");
            folderCb.dataset.path = savedPath ? `${savedPath}/${name}` : name;
            folderCb.addEventListener("click", e => e.stopPropagation());   // don't open the folder
            card.addEventListener("click", () => loadSaved(true, savedPath ? `${savedPath}/${name}` : name));
            list.appendChild(card);
        });
    files.forEach(d => list.appendChild(buildSavedCard(d)));
    updateSavedSelectToggle();
}

// ─── Saved Books: multi-select (checkboxes on files and folders) ─────────────

function updateSavedSelectToggle() {
    const toggle = document.getElementById("selectAllToggle");
    if (!toggle) return;
    const boxes = document.querySelectorAll("#savedList .file-checkbox, #savedList .folder-checkbox");
    const allChecked = boxes.length > 0 && Array.from(boxes).every(cb => cb.checked);
    toggle.textContent = allChecked ? "Deselect All" : "Select All";
}

function initSavedSelection() {
    const list = document.getElementById("savedList");
    const toggle = document.getElementById("selectAllToggle");
    const btn = document.getElementById("downloadSelected");
    if (!list || !toggle || !btn) return;

    list.addEventListener("change", e => {
        if (e.target.classList.contains("file-checkbox") || e.target.classList.contains("folder-checkbox")) {
            updateSavedSelectToggle();
        }
    });

    toggle.addEventListener("click", () => {
        const boxes = list.querySelectorAll(".file-checkbox, .folder-checkbox");
        const allChecked = Array.from(boxes).every(cb => cb.checked);
        boxes.forEach(cb => { cb.checked = !allChecked; });
        updateSavedSelectToggle();
    });

    btn.addEventListener("click", () => {
        const docs = offlineAvailable() ? WyOffline.list() : [];
        const dirOf = d => normalizePath(d.path).split("/").filter(Boolean).slice(0, -1).join("/");

        const picked = new Map();   // id -> doc (dedupes a file picked directly and via its folder)
        list.querySelectorAll(".file-checkbox:checked").forEach(cb => {
            const d = docs.find(x => x.id === cb.dataset.id);
            if (d) picked.set(d.id, d);
        });
        list.querySelectorAll(".folder-checkbox:checked").forEach(cb => {
            const prefix = cb.dataset.path;
            docs.forEach(d => {
                const dir = dirOf(d);
                if (dir === prefix || dir.startsWith(prefix + "/")) picked.set(d.id, d);
            });
        });

        if (!picked.size) return alert("No items selected");
        const items = Array.from(picked.values());
        const total = items.reduce((sum, d) => sum + (d.bytes || d.size || 0), 0);
        if (!confirm(`Download ${items.length} saved file${items.length !== 1 ? "s" : ""} (${formatBytes(total)})?`)) return;

        trackEvent('batch_download', { file_count: items.length, folder: "Saved books" });
        items.forEach((d, i) => {
            setTimeout(() => {
                WyOffline.exportFile(d.id, d.name).catch(err => showToast("⚠️ " + err.message));
            }, i * 800);
        });
    });
}

function buildSavedCard(d) {
    const ext = d.name.split(".").pop().toLowerCase();
    const icon = ext === "pdf" ? "📕" : (["zip", "rar"].includes(ext) ? "🗜️" : "📄");
    const cleanName = d.name.replace(/\.[^/.]+$/, "");
    const folder = normalizePath(d.path).split("/").slice(0, -1).join(" / ");
    const badge = d.status === "removed"
        ? `<div class="saved-badge warn">No longer in the library. Your copy still works.</div>`
        : d.status === "outdated"
            ? `<div class="saved-badge info">A newer version is available. Open the folder to update.</div>`
            : "";
    const viewerUrl = `/pdf-viewer?file=${encodeURIComponent(d.path)}&id=${encodeURIComponent(d.id)}`;

    const card = document.createElement("div");
    card.className = "file-card is-saved";
    card.innerHTML = `
        <div class="file-top"><input type="checkbox" class="file-checkbox"><span>${icon} ${escapeHtmlText(cleanName)} <span class="file-size" style="font-size:0.8em;opacity:0.7;margin-left:5px;">(${formatBytes(d.bytes || d.size)})</span></span></div>
        <div class="saved-folder">📁 ${escapeHtmlText(folder || "Library")}</div>
        ${badge}
        <div class="file-actions">
            ${ext === "pdf"
                ? `<a href="${viewerUrl}" class="open-link">Open</a>`
                : `<a href="#" class="saved-open open-link" target="_blank">Open</a>`}
            <a href="#" download class="saved-export">Download</a>
            <button type="button" class="btn-remove-saved">Remove</button>
        </div>
    `;

    const fileCb = card.querySelector(".file-checkbox");
    fileCb.dataset.id = d.id;
    fileCb.dataset.name = d.name;
    const doExport = (e) => {
        e.preventDefault();
        WyOffline.exportFile(d.id, d.name).catch(err => showToast("⚠️ " + err.message));
    };
    card.querySelector(".saved-export").addEventListener("click", doExport);
    const openOther = card.querySelector(".saved-open");
    if (openOther) openOther.addEventListener("click", doExport);
    card.querySelector(".btn-remove-saved").addEventListener("click", async () => {
        if (!confirm(`Remove "${d.name}" from offline storage?`)) return;
        try { await WyOffline.remove(d.id); }
        catch (err) { showToast("⚠️ " + (err.message || "Could not remove it.")); }
    });
    return card;
}

// Pill shown while offline: says "Offline"; tap it to see how many saved books are available
let offlinePillTimer = null;

function refreshOfflineBanner() {
    const banner = document.getElementById("offlineBanner");
    if (!banner || navigator.onLine) return;
    clearTimeout(offlinePillTimer);
    banner.innerHTML = `<span role="button" tabindex="0">Offline</span>`;
}

function toggleOfflinePill() {
    const banner = document.getElementById("offlineBanner");
    const pill = banner && banner.querySelector("span");
    if (!pill || navigator.onLine) return;

    if (pill.dataset.expanded) {            // tap again: collapse
        refreshOfflineBanner();
        return;
    }
    const show = (n) => {
        if (navigator.onLine) return;
        pill.dataset.expanded = "1";
        pill.textContent = n > 0
            ? `${n} saved book${n !== 1 ? "s" : ""} available offline`
            : "No saved books yet";
        clearTimeout(offlinePillTimer);
        offlinePillTimer = setTimeout(refreshOfflineBanner, 4000);
    };
    if (offlineAvailable()) WyOffline.ready().then(() => show(WyOffline.count()));
    else show(0);
}

document.addEventListener("click", (e) => {
    if (e.target.closest && e.target.closest("#offlineBanner span")) toggleOfflinePill();
});
document.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && e.target.closest && e.target.closest("#offlineBanner span")) {
        e.preventDefault();
        toggleOfflinePill();
    }
});

window.addEventListener("online", refreshAllFileCards);
window.addEventListener("offline", refreshAllFileCards);
window.addEventListener("wyoffline:changed", () => {
    refreshAllFileCards();
    updateSavedLink();
    refreshOfflineBanner();
    if (document.getElementById("savedList")) renderSavedList();
});

// ─── Load Folder ─────────────────────────────────────────────────────────────

async function loadFolder(category, subFolder = "", push = true) {
    currentCategory = category;
    currentPath = subFolder;

    if (push) {
        const hash = subFolder 
            ? `#/folder/${encodeURIComponent(category)}/${encodeURIComponent(subFolder)}`
            : `#/folder/${encodeURIComponent(category)}`;
        history.pushState({ view: "folder", category, subFolder }, "", hash);
        const folderTitle = subFolder ? `${category} > ${subFolder}` : category;
        await navigateTo(() => _renderFolder(category, subFolder), `${folderTitle} - e-library`);
    } else {
        await _renderFolder(category, subFolder);
    }
}

async function _renderFolder(category, subFolder) {
    showFolderSkeleton();

    const allFiles = await getCatalog();
    const data = getFolderContents(allFiles, category, subFolder);

    const breadcrumbParts = ["Home", category, ...subFolder.split("/").filter(Boolean)];
    let breadcrumbHTML = "";
    let pathSoFar = "";

    breadcrumbParts.forEach((part, index) => {
        if (index === 0) breadcrumbHTML += `<span class="breadcrumb" data-home="true">${part}</span>`;
        else if (index === 1) breadcrumbHTML += ` / <span class="breadcrumb" data-path="">${part}</span>`;
        else {
            pathSoFar += "/" + part;
            breadcrumbHTML += ` / <span class="breadcrumb" data-path="${pathSoFar.slice(1)}">${part}</span>`;
        }
    });

    const isDownloads = category === "Zips";
    let folderMetaText = `${data.files.length} file${data.files.length !== 1 ? "s" : ""} in this folder`;
    if (data.folders.length > 0 && data.files.length === 0) {
        folderMetaText = `${data.folders.length} folder${data.folders.length !== 1 ? "s" : ""} in this section`;
    } else if (data.folders.length > 0 && data.files.length > 0) {
        folderMetaText = `${data.folders.length} folder${data.folders.length !== 1 ? "s" : ""}, ${data.files.length} file${data.files.length !== 1 ? "s" : ""}`;
    }

    app.innerHTML = `
        <div class="breadcrumb-container">${breadcrumbHTML}</div>
        <div class="folder-meta">
            <span class="folder-file-count">${folderMetaText}</span>
        </div>
        <div class="search-container">
            <input type="text" id="searchInput" placeholder="Search in this folder..." />
        </div>
        <div class="folder-actions-bar">
            <button id="downloadSelected">Download Selected</button>
            <span id="selectAllToggle" class="select-all-toggle">Select All</span>
        </div>
        <div class="grid"></div>
    `;

    const selectAllToggle = document.getElementById("selectAllToggle");
    
    function updateSelectAllToggleText() {
        if (!selectAllToggle) return;
        const allCheckboxes = document.querySelectorAll(".file-checkbox, .folder-checkbox");
        const allChecked = Array.from(allCheckboxes).every(cb => cb.checked);
        selectAllToggle.textContent = allChecked && allCheckboxes.length > 0 ? "Deselect All" : "Select All";
    }

    selectAllToggle.addEventListener("click", () => {
        const allCheckboxes = document.querySelectorAll(".file-checkbox, .folder-checkbox");
        const allChecked = Array.from(allCheckboxes).every(cb => cb.checked);
        
        allCheckboxes.forEach(cb => {
            cb.checked = !allChecked;
        });
        updateSelectAllToggleText();
    });

    document.querySelectorAll(".breadcrumb").forEach(span => {
        span.addEventListener("click", e => {
            if (e.target.dataset.home) loadHome();
            else loadFolder(category, e.target.dataset.path || "");
        });
    });

    const grid = document.querySelector(".grid");

    grid.addEventListener("change", (e) => {
        if (e.target.classList.contains("file-checkbox") || e.target.classList.contains("folder-checkbox")) {
            updateSelectAllToggleText();
        }
    });

    function renderFolderContents(folders, files) {
        grid.innerHTML = "";

        folders.forEach(folder => {
            const card = document.createElement("div");
            card.className = "folder-card";
            const folderPath = currentPath ? `${currentPath}/${folder.name}` : folder.name;
            
            card.innerHTML = `
                <div class="folder-top">
                    <input type="checkbox" class="folder-checkbox" data-path="${folderPath}" data-name="${folder.name}">
                    <span class="folder-name">📁 ${folder.name}</span>
                </div>
                <span class="folder-count-badge">${folder.count} file${folder.count !== 1 ? "s" : ""}</span>
            `;
            
            // Prevent checkbox click from opening the folder
            const checkbox = card.querySelector(".folder-checkbox");
            checkbox.addEventListener("click", e => e.stopPropagation());

            card.addEventListener("click", () => {
                loadFolder(category, folderPath);
            });
            grid.appendChild(card);
        });

        files.forEach(file => {
            const filePath = file.path || `${category}/${currentPath ? currentPath + '/' : ''}${file.name}`;
            grid.appendChild(renderFileCard(file.name, filePath, isDownloads, file.size));
        });

        if (folders.length === 0 && files.length === 0) {
            grid.innerHTML = `<p class="empty-state">No files here yet.</p>`;
        }
    }

    renderFolderContents(data.folders, data.files);
    updateSelectAllToggleText();
    applyPendingHighlight();

    document.getElementById("downloadSelected").addEventListener("click", async () => {
        const selectedFiles = Array.from(document.querySelectorAll(".file-checkbox:checked")).map(cb => ({
            path: cb.value,
            name: cb.dataset.name,
            size: parseInt(cb.dataset.size) || 0
        }));
        const selectedFolders = Array.from(document.querySelectorAll(".folder-checkbox:checked"));

        if (!selectedFiles.length && !selectedFolders.length) return alert("No items selected");

        const btn = document.getElementById("downloadSelected");
        const originalText = btn.textContent;
        btn.textContent = "Preparing...";
        btn.disabled = true;

        try {
            let allSelectedFiles = [...selectedFiles];

            for (const folderCb of selectedFolders) {
                const folderPath = folderCb.dataset.path;
                const folderFiles = getRecursiveFiles(allFiles, category, folderPath);
                allSelectedFiles = allSelectedFiles.concat(folderFiles);
            }

            // Remove duplicates based on path
            const uniqueFiles = [];
            const seenPaths = new Set();
            for (const f of allSelectedFiles) {
                if (!seenPaths.has(f.path)) {
                    seenPaths.add(f.path);
                    uniqueFiles.push(f);
                }
            }

            if (uniqueFiles.length === 0) {
                alert("No files found to download.");
                return;
            }

            showDownloadConfirmation(uniqueFiles);

        } catch (err) {
            console.error(err);
            alert("Error preparing download.");
        } finally {
            btn.textContent = originalText;
            btn.disabled = false;
        }
    });

    function showDownloadConfirmation(files) {
        const totalSize = files.reduce((acc, f) => acc + f.size, 0);
        const count = files.length;

        const modal = document.createElement("div");
        modal.className = "confirm-modal";
        modal.innerHTML = `
            <div class="confirm-modal-content">
                <div class="confirm-modal-header">
                    <h3>Confirm Download</h3>
                    <button class="close-confirm-modal">&times;</button>
                </div>
                <div class="confirm-modal-body">
                    <p>You are about to download <strong>${count}</strong> item${count !== 1 ? 's' : ''}.</p>
                    <div class="confirm-item-list-container">
                        <ul class="confirm-item-list">
                            ${files.map(f => `
                                <li>
                                    <span class="entry-name">${f.name}</span>
                                    <span class="entry-size">${formatBytes(f.size)}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                    <div class="confirm-summary">
                        <span>Total Size: <strong>${formatBytes(totalSize)}</strong></span>
                    </div>
                </div>
                <div class="confirm-modal-footer">
                    <button class="btn-cancel">Cancel</button>
                    <button class="btn-confirm">Download Now</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const closeModal = () => document.body.removeChild(modal);

        modal.querySelector(".close-confirm-modal").onclick = closeModal;
        modal.querySelector(".btn-cancel").onclick = closeModal;
        
        modal.querySelector(".btn-confirm").onclick = () => {
            closeModal();
            triggerBatchDownload(files.map(f => f.path));
        };

        // Close on outside click
        modal.onclick = (e) => {
            if (e.target === modal) closeModal();
        };
    }

    function triggerBatchDownload(paths) {
            // Track the batch download as one event
            trackEvent('batch_download', {
                file_count: paths.length,
                folder: subFolder || category
            });
            paths.forEach((filePath, index) => {
                setTimeout(() => {
                    const filename = filePath.split("/").pop();
                    const link = document.createElement("a");
                    link.href = `/api/download?file=${encodeURIComponent(filePath)}&mode=download`;
                    link.download = filename;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }, index * 800);
            });
        }

    // ─── Search (Instant client-side search, scoped to current folder) ──────────
    const searchInput = document.getElementById("searchInput");

    const handleSearch = () => {
        const query = searchInput.value.trim();

        if (!query) {
            renderFolderContents(data.folders, data.files);
            updateSelectAllToggleText();
            return;
        }

        const results = searchCatalog(allFiles, category, subFolder, query);

        grid.innerHTML = "";

        if (results.length === 0) {
            grid.innerHTML = `<p class="empty-state">No files found for "<strong>${query}</strong>" in this folder.</p>`;
            updateSelectAllToggleText();
            return;
        }

        results.forEach(item => {
            grid.appendChild(renderFileCard(item.name, item.path, isDownloads, item.size));
        });
        updateSelectAllToggleText();
    };

    searchInput.addEventListener("input", handleSearch);

    // Track search queries (debounced - fires 1.5 s after user stops typing)
    const trackSearch = debounce((query) => {
        if (query.length < 2) return;
        trackEvent('search', {
            search_term: query,
            search_folder: subFolder || category
        });
    }, 1500);
    searchInput.addEventListener("input", () => trackSearch(searchInput.value.trim()));
}

// ─── Scroll reveal ───────────────────────────────────────────────────────────

function activateScrollReveal() {
    const reveals = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target); // Stop watching once revealed
            }
        });
    }, { 
        threshold: 0, // Trigger as soon as the first pixel enters
        rootMargin: "0px" // No delay
    });

    reveals.forEach(el => observer.observe(el));
}

// ─── Magic Nav ───────────────────────────────────────────────────────────────

function initMagicNav() {
    const header = document.querySelector(".header");
    const magicNav = document.getElementById("magicNav");
    const navScrim = document.getElementById("navScrim");
    const circle = document.querySelector(".magic-nav-circle");
    const topBtn = document.getElementById("ribbonBackToTop");

    if (!header || !magicNav) return;

    let headerVisible = true;
    let lastScroll = window.scrollY;
    let idleTimer;

    // Detect when header scrolls out of view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            headerVisible = entry.isIntersecting;
            updateNavVisibility();
        });
    }, { 
        threshold: 0,
        rootMargin: "-20px 0px 0px 0px"
    });

    observer.observe(header);

    function updateNavVisibility() {
        const currentScroll = window.scrollY;
        const scrollingUp = currentScroll < lastScroll;
        const atBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 10;
        
        if (!headerVisible && (scrollingUp || atBottom)) {
            magicNav.classList.remove("hidden");
            magicNav.classList.add("visible");
        } else {
            magicNav.classList.add("hidden");
            magicNav.classList.remove("visible");
            closeNav();
        }
        lastScroll = currentScroll;
    }

    function closeNav() {
        magicNav.classList.remove("expanded");
        if (navScrim) navScrim.classList.remove("visible");
    }

    function toggleNav() {
        const isExpanded = magicNav.classList.toggle("expanded");
        if (navScrim) {
            if (isExpanded) navScrim.classList.add("visible");
            else navScrim.classList.remove("visible");
        }
        resetIdleTimer();
    }

    function resetIdleTimer() {
        magicNav.classList.remove("idle");
        clearTimeout(idleTimer);
        if (!magicNav.classList.contains("expanded") && !magicNav.classList.contains("hidden")) {
            idleTimer = setTimeout(() => {
                magicNav.classList.add("idle");
            }, 3000);
        }
    }

    window.addEventListener("scroll", () => {
        updateNavVisibility();
        resetIdleTimer();
    }, { passive: true });

    circle.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleNav();
    });

    if (navScrim) {
        navScrim.addEventListener("click", closeNav);
    }

    if (topBtn) {
        topBtn.addEventListener("click", (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
            closeNav();
        });
    }

    document.addEventListener("click", (e) => {
        if (!magicNav.contains(e.target)) {
            closeNav();
        }
    });

    window.addEventListener("touchstart", resetIdleTimer, { passive: true });
    window.addEventListener("mousemove", resetIdleTimer, { passive: true });
}

// ─── Footer Stats ─────────────────────────────────────────────────────────────

async function updateLastUpdated() {
    const el = document.getElementById("last-updated");
    if (!el) return;

    try {
        const response = await fetch("/api/last-updated");
        const data = await response.json();
        
        if (data && data.date) {
            const date = new Date(data.date);
            const now = new Date();

            const isSameDay = (a, b) =>
                a.getFullYear() === b.getFullYear() &&
                a.getMonth() === b.getMonth() &&
                a.getDate() === b.getDate();

            const yesterday = new Date(now);
            yesterday.setDate(now.getDate() - 1);

            let datePart;
            if (isSameDay(date, now)) {
                datePart = "Today";
            } else if (isSameDay(date, yesterday)) {
                datePart = "Yesterday";
            } else {
                const day = date.toLocaleDateString('en-US', { day: 'numeric' });
                const month = date.toLocaleDateString('en-US', { month: 'short' });
                const year = date.toLocaleDateString('en-US', { year: 'numeric' });
                datePart = `${day} ${month} ${year}`;
            }

            const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
            el.textContent = `${datePart}, ${time}`;
        } else {
            throw new Error("Invalid response");
        }
    } catch (err) {
        console.error("Error fetching last update:", err);
        el.textContent = "Recently";
    }
}

async function shareSite() {
    const shareData = {
        title: "Wycliffe's e-library",
        text: "Check out Wycliffe's e-library for academic resources, books, and exam papers!",
        url: window.location.origin
    };

    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            await navigator.clipboard.writeText(window.location.origin);
            alert("Link copied to clipboard!");
        }
    } catch (err) {
        console.error("Error sharing:", err);
    }
}

// In-app link to one file. Uses the stable catalog id so the link keeps working
// after the file is renamed or moved; falls back to the path if ids aren't built yet.
function fileDeepLink(path) {
    const entry = catalogByPath.get(normalizePath(path));
    const key = (entry && entry.id) ? entry.id : normalizePath(path);
    return `${window.location.origin}/#/file/${encodeURIComponent(key)}`;
}

// Open a shared deep link: go to the file's folder, scroll to its card and highlight it.
async function openSharedFile(key) {
    const all = await getCatalog();

    if (!all.length) {
        history.replaceState({ view: "home" }, "", "#/");
        await loadHome(false);
        showToast("📡 Couldn't load the library. Check your connection and try again.");
        return;
    }

    const entry = key && (all.find(f => f.id === key) || catalogByPath.get(normalizePath(key)));
    const parts = entry ? normalizePath(entry.path).split("/").filter(Boolean) : [];

    if (!entry || parts.length < 2) {
        history.replaceState({ view: "home" }, "", "#/");
        await loadHome(false);
        showToast("That file is no longer available. Here's the full library.");
        return;
    }

    const category = parts[0];
    const subFolder = parts.slice(1, -1).join("/");
    const hash = subFolder
        ? `#/folder/${encodeURIComponent(category)}/${encodeURIComponent(subFolder)}`
        : `#/folder/${encodeURIComponent(category)}`;

    pendingHighlightId = entry.id || normalizePath(entry.path);
    // Replace (not push) so Back leaves the app instead of bouncing through the deep link,
    // and a refresh shows the plain folder without re-running the highlight.
    history.replaceState({ view: "folder", category, subFolder }, "", hash);
    await loadFolder(category, subFolder, false);
}

function applyPendingHighlight() {
    if (!pendingHighlightId) return;
    const id = pendingHighlightId;
    pendingHighlightId = null;

    function doHighlight() {
        const card = Array.from(document.querySelectorAll(".file-card"))
            .find(c => c.dataset.docId === id);
        if (!card) return;

        const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        card.setAttribute("tabindex", "-1");
        card.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
        try { card.focus({ preventScroll: true }); } catch (_) {}
        card.classList.add("shared-highlight");
        setTimeout(() => card.classList.remove("shared-highlight"), 6000);
        trackEvent("shared_file_opened", { file_id: id });
    }

    // Wait until splash screen has cleared if visible on cold load
    const splash = document.getElementById('splash');
    if (splash && !document.documentElement.classList.contains('no-splash')) {
        let attempts = 0;
        const interval = setInterval(() => {
            attempts++;
            if (!document.getElementById('splash') || splash.classList.contains('out') || attempts > 25) {
                clearInterval(interval);
                setTimeout(doHighlight, 300);
            }
        }, 100);
    } else {
        setTimeout(doHighlight, 120);
    }
}

async function shareFile(name, path) {
    const url = fileDeepLink(path);
    const shareData = {
        title: name,
        text: `Check out this resource from Wycliffe's e-library: ${name}`,
        url: url
    };

    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            await navigator.clipboard.writeText(url);
            showToast("🔗 Link copied to clipboard!");
        }
        trackEvent("file_share", { file_name: name, file_path: path });
    } catch (err) {
        if (err.name !== 'AbortError') {
            console.error("Error sharing file:", err);
            showToast("⚠️ Couldn't share the link. Please try again.");
        }
    }
}

// ─── Initial load ─────────────────────────────────────────────────────────────

let deferredPrompt;

function showInstallModal() {
    // Don't interrupt a deep-link arrival - the user came to see a specific file.
    // Use the flag captured at script start; by now the hash may already be the folder URL.
    if (window.__arrivedViaFileDeepLink) return;
    const installModal = document.getElementById('installModal');
    if (installModal) installModal.classList.remove('hidden');
}

function hideInstallModal() {
    const installModal = document.getElementById('installModal');
    if (installModal) installModal.classList.add('hidden');
}

// IMPORTANT: beforeinstallprompt must be registered as early as possible,
// before DOMContentLoaded, because Chrome can fire it very early on fast loads.
(function setupInstallPrompt() {
    // Don't show if already running as installed PWA
    if (window.matchMedia('(display-mode: standalone)').matches
        || window.navigator.standalone === true) return;

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;

        // Wait for DOM to be ready before showing modal, then add small UX delay
        const show = () => setTimeout(() => showInstallModal(), 2500);
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', show, { once: true });
        } else {
            show();
        }
    });
})();

// ─── Offline & Update Notification Architecture ──────────────────────────────

let isHeaderVisible = true;
let pendingFlip = null; // 'offline' | 'online' | null
let flipTimeout = null;
const ORIGINAL_TITLE = "Wycliffe's e-library";

function flipTitleTo(newText, durationMs = 3500) {
    const titleEl = document.getElementById("siteTitle");
    if (!titleEl) return;
    if (flipTimeout) clearTimeout(flipTimeout);

    titleEl.classList.add("is-flipping");
    setTimeout(() => {
        titleEl.textContent = newText;
        titleEl.classList.remove("is-flipping");

        flipTimeout = setTimeout(() => {
            titleEl.classList.add("is-flipping");
            setTimeout(() => {
                titleEl.textContent = ORIGINAL_TITLE;
                titleEl.classList.remove("is-flipping");
            }, 220);
        }, durationMs);
    }, 220);
}

function triggerOfflineFlip() {
    if (isHeaderVisible) {
        flipTitleTo("📡 Offline Mode", 3500);
        pendingFlip = null;
    } else {
        pendingFlip = 'offline';
    }
}

function triggerOnlineFlip() {
    if (isHeaderVisible) {
        flipTitleTo("🟢 Back Online", 2500);
        pendingFlip = null;
    } else {
        pendingFlip = 'online';
    }
}

function initHeaderObserver() {
    const headerTop = document.querySelector(".header-top");
    if (!headerTop) return;

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isHeaderVisible = entry.isIntersecting;
                if (isHeaderVisible && pendingFlip) {
                    if (pendingFlip === 'offline') flipTitleTo("📡 Offline Mode", 3500);
                    else if (pendingFlip === 'online') flipTitleTo("🟢 Back Online", 2500);
                    pendingFlip = null;
                }
            });
        }, { threshold: 0.15 });
        observer.observe(headerTop);
    }

    const badge = document.getElementById("offlineBadge");
    if (badge) {
        badge.addEventListener("click", () => {
            flipTitleTo("📡 Offline Mode", 3500);
        });
    }
}

function updateOnlineStatus(isInitial = false) {
    const headerTop = document.querySelector(".header-top");
    const isOnline = navigator.onLine;

    if (!isOnline) {
        if (headerTop) headerTop.classList.add("is-offline");
        if (isInitial) {
            // Give reader 1.5s to read original title first
            setTimeout(() => triggerOfflineFlip(), 1500);
        } else {
            triggerOfflineFlip();
        }
    } else {
        if (headerTop && headerTop.classList.contains("is-offline")) {
            headerTop.classList.remove("is-offline");
            triggerOnlineFlip();
        }
    }

    // Refresh file card buttons state (grey out unsaved files when offline)
    document.querySelectorAll(".file-card").forEach(refreshFileCard);

    // Refresh offline banner if present
    const banner = document.getElementById("offlineBanner");
    if (banner) {
        if (!isOnline) {
            banner.style.display = "flex";
            banner.classList.remove("hidden", "back-online");
            refreshOfflineBanner();
        } else {
            banner.classList.add("hidden");
            banner.style.display = "none";
        }
    }
}

window.addEventListener("online", () => updateOnlineStatus(false));
window.addEventListener("offline", () => updateOnlineStatus(false));

function checkVersionHandshake() {
    try {
        const pending = localStorage.getItem("wylibrary_pending_version");
        const updateType = localStorage.getItem("wylibrary_pending_update_type") || "all";
        if (pending) {
            localStorage.removeItem("wylibrary_pending_version");
            localStorage.removeItem("wylibrary_pending_update_type");

            let msg = `✅ Updated successfully to ${APP_VERSION}!`;
            if (updateType === "materials") {
                msg = "✅ Library updated with fresh study materials!";
            } else if (updateType === "features") {
                msg = `✅ Updated successfully to ${APP_VERSION}!`;
            } else if (updateType === "all") {
                msg = "✅ Updated successfully with new materials & features!";
            }
            showUpdateSuccessToast(msg);
        }
    } catch (e) {
        console.warn("Version handshake check failed:", e);
    }
}

function showUpdateSuccessToast(message) {
    const existing = document.getElementById("updateSuccessToast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.id = "updateSuccessToast";
    toast.className = "update-success-toast";
    toast.innerHTML = `<span>${message}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
        if (toast && toast.parentNode) toast.remove();
    }, 3800);
}

async function resolveUpdateInfo(waitingWorker) {
    let meta = { type: "auto", title: "", message: "", version: "" };
    if (waitingWorker) {
        try {
            const msgPromise = new Promise((resolve) => {
                const channel = new MessageChannel();
                const timeout = setTimeout(() => resolve(null), 1200);
                channel.port1.onmessage = (e) => {
                    clearTimeout(timeout);
                    resolve(e.data && e.data.meta ? e.data.meta : null);
                };
                waitingWorker.postMessage({ type: "GET_UPDATE_META" }, [channel.port2]);
            });
            const received = await msgPromise;
            if (received) meta = Object.assign(meta, received);
        } catch (e) {
            console.warn("Could not query worker update meta:", e);
        }
    }

    // 1. Explicit custom title provided
    if (meta.title) {
        let icon = "⚡";
        if (meta.type === "materials") icon = "📚";
        else if (meta.type === "all") icon = "🚀";
        return {
            type: meta.type || "all",
            icon: meta.icon || icon,
            title: meta.title,
            message: meta.message || "Tap to update now"
        };
    }

    // 2. Explicit manual type override
    if (meta.type === "materials") {
        return {
            type: "materials",
            icon: "📚",
            title: "New Study Materials",
            message: meta.message || "New past papers & books ready to explore"
        };
    }
    if (meta.type === "features") {
        return {
            type: "features",
            icon: "⚡",
            title: "New Features Ready",
            message: meta.message || "App improvements & fixes ready"
        };
    }
    if (meta.type === "all") {
        return {
            type: "all",
            icon: "🚀",
            title: "Update Available",
            message: meta.message || "New study materials & features ready"
        };
    }

    // 3. Automatic detection ('auto'):
    let materialsChanged = false;
    let featuresChanged = false;

    // Check version difference
    if (meta.version && meta.version !== APP_VERSION) {
        featuresChanged = true;
    }

    // Check if catalog has changed via HEAD request to /files-index.json
    try {
        const headRes = await fetch("/files-index.json", { method: "HEAD", cache: "no-store" });
        if (headRes.ok) {
            const newEtag = headRes.headers.get("etag");
            const storedEtag = localStorage.getItem("wylibrary_catalog_etag");
            if (storedEtag && newEtag && storedEtag !== newEtag) {
                materialsChanged = true;
            }
        }
    } catch (e) {
        // Fallback if HEAD check fails
    }

    if (materialsChanged && !featuresChanged) {
        return {
            type: "materials",
            icon: "📚",
            title: "New Study Materials",
            message: meta.message || "New past papers & books ready to explore"
        };
    }

    if (featuresChanged && !materialsChanged) {
        return {
            type: "features",
            icon: "⚡",
            title: "New Features Ready",
            message: meta.message || "App improvements & fixes ready"
        };
    }

    // Default when both changed or unknown
    return {
        type: "all",
        icon: "⚡",
        title: "Update Available",
        message: meta.message || "New materials & features ready"
    };
}

async function showUpdatePrompt(waitingWorker) {
    if (document.getElementById("updateToast")) return;

    const info = await resolveUpdateInfo(waitingWorker);
    if (document.getElementById("updateToast")) return;

    const toast = document.createElement("div");
    toast.id = "updateToast";
    toast.className = "update-toast";
    toast.innerHTML = `
        <div class="update-toast-content">
            <span class="update-icon">${info.icon}</span>
            <div class="update-text">
                <strong>${escapeHtmlText(info.title)}</strong>
                <span>${escapeHtmlText(info.message)}</span>
            </div>
        </div>
        <button id="btnApplyUpdate" class="btn-update-now">Update</button>
        <button id="btnDismissUpdate" class="btn-update-dismiss" aria-label="Dismiss">✕</button>
    `;
    document.body.appendChild(toast);

    document.getElementById("btnApplyUpdate").addEventListener("click", () => {
        try {
            localStorage.setItem("wylibrary_pending_version", APP_VERSION);
            localStorage.setItem("wylibrary_pending_update_type", info.type || "all");
        } catch (e) {}
        // Flag that this reload is user-initiated - controllerchange listener
        // checks this so it doesn't auto-reload on every fresh SW install.
        window.__swUpdateRequested = true;
        waitingWorker.postMessage({ type: "SKIP_WAITING" });
        toast.remove();
    });

    document.getElementById("btnDismissUpdate").addEventListener("click", () => {
        toast.remove();
    });
}

function initServiceWorker() {
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' })
        .then(reg => {
            console.log('Service Worker registered', reg);

            if (reg.waiting) {
                showUpdatePrompt(reg.waiting);
            }

            reg.addEventListener('updatefound', () => {
                const newWorker = reg.installing;
                if (!newWorker) return;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        showUpdatePrompt(newWorker);
                    }
                });
            });

            reg.update().catch(() => {});
        })
        .catch(err => console.log('Service Worker registration failed', err));

    // Only reload when the user explicitly clicked "Update" (sets __swUpdateRequested).
    // Without this guard, clients.claim() on first SW install triggers controllerchange
    // and causes a double-load / auto-refresh on every fresh page open.
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (window.__swUpdateRequested) {
            window.location.reload();
        }
    });
}

window.addEventListener("DOMContentLoaded", () => {
    initServiceWorker();
    initHeaderObserver();
    updateOnlineStatus(true);
    checkVersionHandshake();

    // PWA Install Button Logic
    const modalInstallNow = document.getElementById('modalInstallNow');
    const modalMaybeLater = document.getElementById('modalMaybeLater');

    if (modalInstallNow) {
        modalInstallNow.addEventListener('click', async () => {
            if (!deferredPrompt) return;
            hideInstallModal();
            trackEvent('pwa_install_prompt_shown', { action: 'install_now_clicked' });
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response to the install prompt: ${outcome}`);
            trackEvent('pwa_install_outcome', { outcome });
            deferredPrompt = null;
        });
    }

    if (modalMaybeLater) {
        modalMaybeLater.addEventListener('click', () => {
            // Just hide - no cooldown. Will show again next visit when
            // Chrome fires beforeinstallprompt again.
            hideInstallModal();
            trackEvent('pwa_install_prompt_shown', { action: 'maybe_later' });
        });
    }

    window.addEventListener('appinstalled', () => {
        console.log('e-library was installed');
        hideInstallModal();
        trackEvent('pwa_installed', {});
        deferredPrompt = null;
    });

    updateLastUpdated();

    // Wire up dark mode toggle button
    const toggleBtn = document.getElementById("darkModeToggle");
    if (toggleBtn) toggleBtn.addEventListener("click", toggleDarkMode);

    initDarkMode();
    initMagicNav();
    handleRouteFromUrl();
});
