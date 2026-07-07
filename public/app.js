const app = document.getElementById("app");

let currentCategory = null;
let currentPath = "";

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

// ─── History / Routing ──────────────────────────────────────────────────────

window.addEventListener("popstate", e => {
    const state = e.state;
    if (!state || state.view === "home") {
        navigateTo(() => loadHome(false), "Home - e-library");
    } else if (state.view === "about") {
        navigateTo(() => loadAbout(false), "About - e-library");
    } else if (state.view === "request") {
        navigateTo(() => loadRequest(false), "Contact - e-library");
    } else if (state.view === "practice") {
        navigateTo(() => loadPractice(false), "Practice - e-library");
    } else if (state.view === "folder") {
        const folderTitle = state.subFolder ? `${state.category} > ${state.subFolder}` : state.category;
        navigateTo(() => loadFolder(state.category, state.subFolder, false), `${folderTitle} - e-library`);
    }
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
        history.pushState({ view: "home" }, "");
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

    // Fetch counts in parallel
    let totalFiles = 0;
    let totalSize = 0;
    let countsFetched = 0;

    categories.forEach(async ({ category }) => {
        try {
            const res = await fetch(`/api/files?category=${encodeURIComponent(category)}&count=true`);
            const data = await res.json();
            const el = document.getElementById(`count-${category}`);
            if (el) el.textContent = `${data.total} file${data.total !== 1 ? "s" : ""}`;
            
            totalFiles += data.total;
            totalSize += (data.size || 0);
        } catch {
            const el = document.getElementById(`count-${category}`);
            if (el) el.textContent = "";
        } finally {
            countsFetched++;
            if (countsFetched === categories.length) {
                const totalEl = document.getElementById("total-books");
                if (totalEl) totalEl.textContent = totalFiles;

                const sizeEl = document.getElementById("total-size");
                if (sizeEl) sizeEl.textContent = formatSize(totalSize);
            }
        }
    });
}

// ─── About ──────────────────────────────────────────────────────────────────

async function loadAbout(push = true) {
    if (push) {
        history.pushState({ view: "about" }, "");
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
        history.pushState({ view: "request" }, "");
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
        history.pushState({ view: "practice" }, "");
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

    let openUrl = `/api/download?file=${encodeURIComponent(filePath)}`;
    
    // Use Google Docs Viewer for Office files to allow in-browser viewing
    const officeExts = ["doc", "docx", "xls", "xlsx", "ppt", "pptx"];
    if (officeExts.includes(ext)) {
        const absoluteUrl = window.location.origin + openUrl;
        openUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(absoluteUrl)}&embedded=true`;
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
                <a href="#" onclick="event.preventDefault(); shareFile('${file.replace(/'/g, "\\'")}', '${filePath.replace(/'/g, "\\'")}')">Share</a>
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
                    `<a href="${openUrl}" target="_blank">Open</a>`
                }
                <a href="/api/download?file=${encodeURIComponent(filePath)}&mode=download" download="${file}">Download</a>
                <a href="#" onclick="event.preventDefault(); shareFile('${file.replace(/'/g, "\\'")}', '${filePath.replace(/'/g, "\\'")}')">Share</a>
            </div>
        `;
    }

    const zipBtn = card.querySelector(".open-zip-btn");
    if (zipBtn) {
        zipBtn.onclick = () => showZipContents(file, filePath);
    }

    return card;
}

// ─── Load Folder ─────────────────────────────────────────────────────────────

async function loadFolder(category, subFolder = "", push = true) {
    currentCategory = category;
    currentPath = subFolder;

    if (push) {
        history.pushState({ view: "folder", category, subFolder }, "");
        const folderTitle = subFolder ? `${category} > ${subFolder}` : category;
        await navigateTo(() => _renderFolder(category, subFolder), `${folderTitle} - e-library`);
    } else {
        _renderFolder(category, subFolder);
    }
}

async function _renderFolder(category, subFolder) {
    showFolderSkeleton();

    const res = await fetch(
        `/api/files?category=${encodeURIComponent(category)}&subpath=${encodeURIComponent(subFolder)}`
    );
    const data = await res.json();

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
    const totalFiles = data.files.length;

    app.innerHTML = `
        <div class="breadcrumb-container">${breadcrumbHTML}</div>
        <div class="folder-meta">
            <span class="folder-file-count">${totalFiles} file${totalFiles !== 1 ? "s" : ""} in this folder</span>
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
            const filePath = `${category}/${currentPath ? currentPath + '/' : ''}${file.name}`;
            grid.appendChild(renderFileCard(file.name, filePath, isDownloads, file.size));
        });

        if (folders.length === 0 && files.length === 0) {
            grid.innerHTML = `<p class="empty-state">No files here yet.</p>`;
        }
    }

    renderFolderContents(data.folders, data.files);
    updateSelectAllToggleText();

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
            let allFiles = [...selectedFiles];

            for (const folderCb of selectedFolders) {
                const folderPath = folderCb.dataset.path;
                const folderName = folderCb.dataset.name;
                // Fetch recursively to get all files AND their sizes
                const res = await fetch(`/api/files?category=${encodeURIComponent(category)}&subpath=${encodeURIComponent(folderPath)}&recursive=true`);
                const data = await res.json();
                
                if (data.filesWithInfo) {
                    // Assuming API returns an array of {name, path, size}
                    allFiles = allFiles.concat(data.filesWithInfo.map(f => ({
                        path: f.path,
                        name: f.name,
                        size: f.size || 0
                    })));
                } else if (data.files) {
                    // Fallback if API only returns paths
                    allFiles = allFiles.concat(data.files.map(path => ({
                        path: path,
                        name: path.split("/").pop(),
                        size: 0
                    })));
                }
            }

            // Remove duplicates based on path
            const uniqueFiles = [];
            const seenPaths = new Set();
            for (const f of allFiles) {
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

    // ─── Search (debounced, scoped to current folder) ───────────────────────
    const searchInput = document.getElementById("searchInput");

    const handleSearch = debounce(async () => {
        const query = searchInput.value.trim();

        if (!query) {
            renderFolderContents(data.folders, data.files);
            return;
        }

        grid.innerHTML = `
            ${Array(4).fill(`
                <div class="skeleton-file-card skeleton-pulse">
                    <div class="skeleton-line" style="width:65%;height:14px"></div>
                    <div class="skeleton-line" style="width:35%;height:12px;margin-top:10px"></div>
                </div>
            `).join("")}
        `;

        try {
            const res = await fetch(
                `/api/search?category=${encodeURIComponent(currentCategory)}&query=${encodeURIComponent(query)}&subpath=${encodeURIComponent(currentPath)}`
            );
            const results = await res.json();

            grid.innerHTML = "";

            if (results.length === 0) {
                grid.innerHTML = `<p class="empty-state">No files found for "<strong>${query}</strong>" in this folder.</p>`;
                return;
            }

            results.forEach(item => {
                grid.appendChild(renderFileCard(item.name, item.path, isDownloads, item.size));
            });
        } catch {
            grid.innerHTML = `<p class="empty-state">Search failed. Please try again.</p>`;
        }
    }, 350);

    searchInput.addEventListener("input", handleSearch);
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

async function shareFile(name, path) {
    const url = `${window.location.origin}/api/download?file=${encodeURIComponent(path)}&mode=download`;
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
            alert("Link copied to clipboard!");
        }
    } catch (err) {
        if (err.name !== 'AbortError') {
            console.error("Error sharing file:", err);
        }
    }
}

// ─── Initial load ─────────────────────────────────────────────────────────────

let deferredPrompt;

window.addEventListener("DOMContentLoaded", () => {
    // Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('Service Worker registered', reg))
            .catch(err => console.log('Service Worker registration failed', err));
    }

    // PWA Install Logic
    const installModal = document.getElementById('installModal');
    const modalInstallNow = document.getElementById('modalInstallNow');
    const modalMaybeLater = document.getElementById('modalMaybeLater');

    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome from automatically showing the prompt
        e.preventDefault();
        // Stash the event
        deferredPrompt = e;
        // Show our custom modal
        if (installModal) installModal.classList.remove('hidden');
    });

    if (modalInstallNow) {
        modalInstallNow.addEventListener('click', async () => {
            if (!deferredPrompt) return;
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response to the install prompt: ${outcome}`);
            deferredPrompt = null;
            if (installModal) installModal.classList.add('hidden');
        });
    }

    if (modalMaybeLater) {
        modalMaybeLater.addEventListener('click', () => {
            if (installModal) installModal.classList.add('hidden');
        });
    }

    window.addEventListener('appinstalled', (evt) => {
        console.log('e-library was installed');
        if (installModal) installModal.classList.add('hidden');
    });

    updateLastUpdated();
    history.replaceState({ view: "home" }, "");

    // Wire up dark mode toggle button
    const toggleBtn = document.getElementById("darkModeToggle");
    if (toggleBtn) toggleBtn.addEventListener("click", toggleDarkMode);

    initDarkMode();
    initMagicNav();
    loadHome(false);
});
