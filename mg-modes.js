/* MuGöl — Görünüm modu (mobil / tablet / masaüstü) */
(function () {
    'use strict';
    var KEY = 'mugol-view-mode', MODES = ['mobile', 'tablet', 'desktop'];
    var root = document.documentElement;

    function stored() { try { var m = localStorage.getItem(KEY); return MODES.indexOf(m) > -1 ? m : null; } catch (e) { return null; } }
    function auto() { var w = window.innerWidth; return w <= 700 ? 'mobile' : (w <= 1024 ? 'tablet' : 'desktop'); }

    function apply(mode, save) {
        MODES.forEach(function (m) { root.classList.remove('mg-mode-' + m); });
        root.classList.add('mg-mode-' + mode);
        if (save) { try { localStorage.setItem(KEY, mode); } catch (e) {} }

        var sb = document.getElementById('sidebar');
        var ov = document.getElementById('sidebarOverlay');
        if (sb) {
            sb.classList.remove('mobile-open');
            if (mode === 'tablet') sb.classList.add('collapsed'); else sb.classList.remove('collapsed');
        }
        if (ov) ov.classList.remove('active');

        document.querySelectorAll('.mg-mode-btn').forEach(function (b) {
            var on = b.getAttribute('data-mode') === mode;
            b.classList.toggle('active', on);
            b.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
    }

    function init() {
        apply(stored() || auto(), false);
        document.querySelectorAll('.mg-mode-btn').forEach(function (b) {
            b.addEventListener('click', function () { apply(b.getAttribute('data-mode'), true); });
        });
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
