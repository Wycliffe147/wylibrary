/* Wylibrary splash: dismisses itself after ~1.5s, tap to skip, once per session.
   Never blocks the app: the app loads underneath the overlay. */
(function () {
    'use strict';
    var el = document.getElementById('splash');
    if (!el) return;
    if (document.documentElement.classList.contains('no-splash')) { el.remove(); return; }

    try { sessionStorage.setItem('wy_splash', '1'); } catch (e) {}

    var done = false;
    function dismiss() {
        if (done) return;
        done = true;
        el.classList.add('out');
        setTimeout(function () { el.remove(); }, 300);
    }
    el.addEventListener('click', dismiss);
    el.addEventListener('touchstart', dismiss, { passive: true });
    document.addEventListener('keydown', dismiss, { once: true });
    setTimeout(dismiss, 1500);       // normal finish
    window.addEventListener('load', function () { setTimeout(dismiss, 2500); }); // safety net

    // Something useful on screen while it plays.
    var status = document.getElementById('splashStatus');
    function say(text) {
        if (!status || done) return;
        status.textContent = text;
        status.classList.add('show');
    }
    function plural(n, w) { return n + ' ' + w + (n === 1 ? '' : 's'); }

    if (!navigator.onLine) {
        var finish = function () {
            var n = (window.WyOffline && WyOffline.count) ? WyOffline.count() : 0;
            say(n ? '📡 Offline · ' + plural(n, 'book') + ' saved on this phone' : '📡 You are offline');
        };
        if (window.WyOffline && WyOffline.ready) WyOffline.ready().then(finish, finish); else finish();
    } else if (typeof getCatalog === 'function') {
        var timer = setTimeout(function () { say('Free books & past papers'); }, 900);
        getCatalog().then(function (files) {
            clearTimeout(timer);
            say(files && files.length ? plural(files.length, 'file') + ' available' : 'Free books & past papers');
        });
    }
})();
