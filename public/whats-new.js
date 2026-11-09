// Wylibrary "What's new in v11.1" guide.
// Vanilla JS, no dependencies. Shows once after the upgrade, and can be re-opened
// from the footer or About page (any element with data-wn-open).
(function () {
    'use strict';

    var VERSION = 'v11.1';
    var SEEN_KEY = 'wy_seen_v11_1_guide';

    // rgb = accent for that card (same palette as the launch bookshelf).
    var SLIDES = [
        {
            rgb: '37,99,235',
            title: '📥 Save for Offline',
            text: 'Save books, exams, and notes directly to your device and read them without using internet data.',
            art: '<div class="wn-real-card">' +
                 '<div class="wn-real-file-top"><span class="wn-real-icon">📄</span><span class="wn-real-title">Mathematics_Paper_1.pdf <span class="wn-real-size">(2.4 MB)</span></span></div>' +
                 '<div class="wn-real-actions">' +
                 '<span class="wn-real-btn open">Open</span>' +
                 '<span class="wn-real-btn download">Download</span>' +
                 '<span class="wn-real-btn saved">✓ Saved</span>' +
                 '<span class="wn-real-btn share">Share</span>' +
                 '</div></div>'
        },
        {
            rgb: '22,163,74',
            title: '📂 Organized Saved Books',
            text: 'Browse your offline collection by folder, search inside it, and tick the checkboxes to Download Selected in one go.',
            art: '<div class="wn-mock wn-list">' +
                 '<div class="wn-row"><i class="wn-cb on"></i>📂 Physics</div>' +
                 '<div class="wn-row"><i class="wn-cb on"></i>📂 Mathematics</div>' +
                 '<div class="wn-row"><i class="wn-cb"></i>📂 Notes</div>' +
                 '<div class="wn-dl">Download Selected (2)</div></div>'
        },
        {
            rgb: '245,158,11',
            title: '📡 Offline Awareness',
            text: 'An amber pill appears at the top when offline. Tap it to see how many books are saved, and look for the 📡 badge on the logo.',
            art: '<div class="wn-offline-scene">' +
                 '<div class="wn-real-pill"><span>Offline · 12 saved books</span></div>' +
                 '<div class="wn-real-header">' +
                 '<div class="wn-real-logo-box">' +
                 '<img class="logo-light" src="https://raw.githubusercontent.com/Wycliffe147/e-library-media/main/images/logo.png" alt="Logo" onerror="this.style.display=\'none\'"/>' +
                 '<img class="logo-dark" src="https://raw.githubusercontent.com/Wycliffe147/e-library-media/main/images/logo-dark.png" alt="Logo" onerror="this.style.display=\'none\'"/>' +
                 '<span class="wn-real-logo-badge">📡</span>' +
                 '</div>' +
                 '<span class="wn-real-header-title">Wycliffe’s e-library</span>' +
                 '</div></div>'
        },
        {
            rgb: '147,51,234',
            title: '📚 Fast & Light',
            text: 'A smooth bookshelf animation when the app launches, and a layout tuned for phones so everything stays quick and easy to tap.',
            art: '<div class="wn-shelf"><div class="wn-books">' +
                 '<i style="--c:#2563eb;--h:46px"></i><i style="--c:#16a34a;--h:58px"></i>' +
                 '<i style="--c:#f59e0b;--h:42px"></i><i style="--c:#9333ea;--h:54px"></i>' +
                 '<i style="--c:#2563eb;--h:50px"></i><i style="--c:#ef4444;--h:60px"></i></div>' +
                 '<div class="wn-plank"></div></div>'
        }
    ];

    var root = null, view = null, track = null, btnBack = null, btnNext = null, spineBox = null;
    var idx = 0, isOpen = false, lastFocus = null, touchX = null, touchY = null;

    function getSeen() {
        try { return localStorage.getItem(SEEN_KEY) === '1'; } catch (e) { return false; }
    }
    function setSeen() {
        try { localStorage.setItem(SEEN_KEY, '1'); } catch (e) {}
    }
    function track_(name, params) {
        try { if (typeof trackEvent === 'function') trackEvent(name, params); } catch (e) {}
    }
    function reduceMotion() {
        return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function build() {
        var slides = '', spines = '';
        SLIDES.forEach(function (s, i) {
            slides += '<section class="wn-slide" style="--rgb:' + s.rgb + '" role="group" aria-roledescription="slide" ' +
                      'aria-label="' + (i + 1) + ' of ' + SLIDES.length + '">' +
                      '<div class="wn-art" aria-hidden="true">' + s.art + '</div>' +
                      '<h3>' + s.title + '</h3><p>' + s.text + '</p></section>';
            spines += '<button type="button" class="wn-spine" style="--rgb:' + s.rgb + '" data-i="' + i +
                      '" aria-label="Go to card ' + (i + 1) + ' of ' + SLIDES.length + '"></button>';
        });

        root = document.createElement('div');
        root.className = 'wn-overlay';
        root.innerHTML =
            '<div class="wn-card" role="dialog" aria-modal="true" aria-labelledby="wnTitle">' +
              '<div class="wn-head"><h2 id="wnTitle">What’s new in ' + VERSION + '</h2>' +
                '<button type="button" class="wn-close" aria-label="Close">✕</button></div>' +
              '<div class="wn-view" aria-live="polite"><div class="wn-track">' + slides + '</div></div>' +
              '<div class="wn-foot">' +
                '<button type="button" class="wn-btn wn-back">Back</button>' +
                '<div class="wn-spines">' + spines + '</div>' +
                '<button type="button" class="wn-btn wn-next">Next</button>' +
              '</div>' +
            '</div>';

        view = root.querySelector('.wn-view');
        track = root.querySelector('.wn-track');
        btnBack = root.querySelector('.wn-back');
        btnNext = root.querySelector('.wn-next');
        spineBox = root.querySelector('.wn-spines');

        // Tap on the dark backdrop closes; taps inside the card do not.
        root.addEventListener('click', function (e) { if (e.target === root) close(); });
        root.querySelector('.wn-close').addEventListener('click', close);
        btnBack.addEventListener('click', function () { go(idx - 1); });
        btnNext.addEventListener('click', function () {
            if (idx >= SLIDES.length - 1) close(true); else go(idx + 1);
        });
        spineBox.addEventListener('click', function (e) {
            var b = e.target.closest('.wn-spine');
            if (b) go(Number(b.getAttribute('data-i')));
        });

        // Swipe left/right.
        view.addEventListener('touchstart', function (e) {
            var t = e.touches[0]; touchX = t.clientX; touchY = t.clientY;
        }, { passive: true });
        view.addEventListener('touchend', function (e) {
            if (touchX === null) return;
            var t = e.changedTouches[0], dx = t.clientX - touchX, dy = t.clientY - touchY;
            touchX = touchY = null;
            if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) go(idx + (dx < 0 ? 1 : -1));
        }, { passive: true });
    }

    function go(n) {
        if (n < 0 || n > SLIDES.length - 1) return;
        idx = n;
        track.style.transform = 'translateX(' + (-100 * idx) + '%)';
        view.scrollTop = 0;

        Array.prototype.forEach.call(track.children, function (el, i) {
            el.setAttribute('aria-hidden', i === idx ? 'false' : 'true');
        });
        Array.prototype.forEach.call(spineBox.children, function (el, i) {
            if (i === idx) el.setAttribute('aria-current', 'true'); else el.removeAttribute('aria-current');
        });
        btnBack.classList.toggle('wn-off', idx === 0);
        btnBack.tabIndex = idx === 0 ? -1 : 0;
        btnNext.textContent = idx === SLIDES.length - 1 ? 'Done' : 'Next';
    }

    function focusables() {
        return Array.prototype.filter.call(
            root.querySelectorAll('button'),
            function (b) { return !b.disabled && b.tabIndex !== -1 && b.offsetParent !== null; }
        );
    }

    function onKey(e) {
        if (!isOpen) return;
        if (e.key === 'Escape') { e.preventDefault(); close(); }
        else if (e.key === 'ArrowRight') { go(idx + 1); }
        else if (e.key === 'ArrowLeft') { go(idx - 1); }
        else if (e.key === 'Tab') {
            var f = focusables();
            if (!f.length) return;
            var first = f[0], last = f[f.length - 1];
            if (!root.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
            else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
    }

    function open(opts) {
        if (isOpen) return;
        opts = opts || {};
        if (!root) build();
        lastFocus = document.activeElement;
        document.body.appendChild(root);
        document.documentElement.classList.add('wn-lock');
        isOpen = true;
        idx = 0;
        track.style.transition = 'none';
        go(0);
        void track.offsetWidth;            // apply the reset before animations come back
        track.style.transition = '';
        document.addEventListener('keydown', onKey);
        requestAnimationFrame(function () {
            root.classList.add('wn-show');
            btnNext.focus();
        });
        if (opts.auto) setSeen();
        track_('whats_new_open', { version: VERSION, auto: !!opts.auto });
    }

    function close(done) {
        if (!isOpen) return;
        isOpen = false;
        setSeen();
        document.removeEventListener('keydown', onKey);
        document.documentElement.classList.remove('wn-lock');
        root.classList.remove('wn-show');
        var el = root;
        function remove() { if (el.parentNode) el.parentNode.removeChild(el); }
        if (reduceMotion()) remove(); else setTimeout(remove, 220);
        if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) {} }
        track_(done === true ? 'whats_new_done' : 'whats_new_closed', { version: VERSION, card: idx + 1 });
    }

    // ── Auto-show, once, after the launch splash and the install prompt are out of the way ──
    function splashActive() {
        var el = document.getElementById('splash');
        if (!el || document.documentElement.classList.contains('no-splash')) return false;
        var cs = window.getComputedStyle(el);
        return !(cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0);
    }
    function installModalOpen() {
        var m = document.getElementById('installModal');
        return !!m && !m.classList.contains('hidden');
    }
    function autoOpen() {
        if (getSeen()) return;
        var started = Date.now();
        (function wait() {
            var blocked = splashActive() || installModalOpen();
            if (blocked && Date.now() - started < 8000) { setTimeout(wait, 400); return; }
            if (installModalOpen()) return;   // still busy: try again on the next visit
            open({ auto: true });
        })();
    }

    // Any element with data-wn-open re-opens the guide (footer link, About page).
    document.addEventListener('click', function (e) {
        var t = e.target.closest && e.target.closest('[data-wn-open]');
        if (t) { e.preventDefault(); open({ auto: false }); }
    });

    window.openWhatsNew = function () { open({ auto: false }); };

    if (document.readyState === 'complete') setTimeout(autoOpen, 1200);
    else window.addEventListener('load', function () { setTimeout(autoOpen, 1200); });
})();
