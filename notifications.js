// ╔══════════════════════════════════════════════════════════════╗
// ║          MuGöl PORTAL — BİLDİRİM SİSTEMİ (notifications.js)  ║
// ╚══════════════════════════════════════════════════════════════╝
//
//  • Uygulama HER açıldığında (splash bittikten sonra) resimli bildirim çıkar.
//  • Aynı bildirim, sağ üstteki bildirim kutusunda (zil) da görünür.
//  • Resim "bildirim" klasöründen gelir. Dosya adı farklıysa sadece
//    aşağıdaki LAUNCH_IMAGE satırını değiştirin.
//
// ── AYARLAR ──────────────────────────────────────────────────

var MG_LAUNCH_IMAGE = 'bildirim/bildirim.png';   // ← klasör/dosya adı

// ── Diğer (resimsiz) bildirimler ─────────────────────────────
//  id     : benzersiz kimlik        icon : emoji
//  title  : başlık                  body : metin       time : zaman etiketi
//  type   : info | success | warning | error
//  link   : (ops.) tıklanınca açılacak URL
//  popup  : true → bir kez mesaj kutusunda çıkar
//  image  : (ops.) resim yolu, örn. 'bildirim/yeni.jpg'

window.MG_NOTIFICATIONS = [
    {
        id: 'n1',
        icon: '🚀',
        title: 'MuGöl PORTAL v9.0.0 Yayında!',
        body: 'Yeni tasarım, güncelleme animasyonu ve gelişmiş bildirim sistemi eklendi.',
        time: 'Az önce',
        type: 'success',
        popup: true
    },
    {
        id: 'n2',
        icon: '🔍',
        title: 'Hızlı Arama',
        body: 'Ctrl+K kısayoluyla tüm uygulamaları anında arayabilirsiniz.',
        time: '2 gün önce',
        type: 'info',
        popup: false
    },
    {
        id: 'n3',
        icon: '🔄',
        title: 'Güncelleme Butonu',
        body: 'Ayarlar\'daki "Güncelleme Yap" butonu ile önbelleği temizleyip en son sürümü alabilirsiniz.',
        time: '3 gün önce',
        type: 'info',
        popup: false
    }
];

// ─────────────────────────────────────────────────────────────
// AŞAĞIYI DEĞİŞTİRMEYİN — Sistem Kodu
// ─────────────────────────────────────────────────────────────

(function () {
    'use strict';

    var LAUNCH_ID = 'launch-image';

    function esc(s) {
        if (window.mgEsc) return window.mgEsc(s);
        return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    var TYPE_COLORS = {
        info:    { border: '#4318ff', bg: 'rgba(67,24,255,0.06)',  icon: '#4318ff' },
        success: { border: '#10b981', bg: 'rgba(16,185,129,0.06)', icon: '#10b981' },
        warning: { border: '#f59e0b', bg: 'rgba(245,158,11,0.06)', icon: '#f59e0b' },
        error:   { border: '#ef4444', bg: 'rgba(239,68,68,0.06)',  icon: '#ef4444' }
    };
    function typeColor(t) { return TYPE_COLORS[t] || TYPE_COLORS.info; }

    /* ── localStorage ── */
    var READ_KEY = 'mugol-read-notifs', POPUP_KEY = 'mugol-seen-popups';
    function load(k) { try { return JSON.parse(localStorage.getItem(k) || '[]'); } catch (e) { return []; } }
    function save(k, a) { try { localStorage.setItem(k, JSON.stringify(a)); } catch (e) {} }

    /* ── Her açılışta gelen resimli bildirim ── */
    var launchNotif = {
        id: LAUNCH_ID,
        icon: '🔔',
        title: 'MuGöl PORTAL',
        body: '',
        time: 'Az önce',
        type: 'info',
        image: MG_LAUNCH_IMAGE,
        popup: true,
        always: true            // her açılışta tekrar gösterilir
    };
    var launchReady = false;    // resim yüklendi mi?

    /* Her açılışta "okunmadı" olarak başlasın */
    save(READ_KEY, load(READ_KEY).filter(function (id) { return id !== LAUNCH_ID; }));

    function allNotifs() {
        var list = (window.MG_NOTIFICATIONS || []).slice();
        if (launchReady) list.unshift(launchNotif);
        return list;
    }

    /* ── Panel ── */
    function render() {
        var list = document.getElementById('notifList');
        var dot = document.getElementById('notifDot');
        if (!list) return;

        var notifs = allNotifs();
        var readArr = load(READ_KEY);
        var unread = notifs.filter(function (n) { return readArr.indexOf(n.id) === -1; });
        if (dot) dot.style.display = unread.length ? 'block' : 'none';

        if (!notifs.length) {
            list.innerHTML = '<div style="padding:24px;text-align:center;color:var(--text-muted);font-weight:700;font-size:.9rem;">Henüz bildirim yok.</div>';
            return;
        }

        list.innerHTML = notifs.map(function (n) {
            var isRead = readArr.indexOf(n.id) !== -1;
            var c = typeColor(n.type);
            var img = n.image
                ? '<img src="' + esc(n.image) + '" alt="' + esc(n.title) + '" loading="lazy" ' +
                  'style="display:block;width:100%;height:auto;object-fit:contain;border-radius:12px;margin-top:8px;' +
                  'border:1px solid var(--border-color);" onerror="this.style.display=\'none\'">'
                : '';
            return (
                '<div data-nid="' + esc(n.id) + '" role="listitem" style="padding:14px 16px;border-bottom:1px solid var(--border-color);cursor:pointer;' +
                'background:' + (isRead ? 'transparent' : c.bg) + ';display:flex;gap:13px;align-items:flex-start;' +
                'border-left:3px solid ' + (isRead ? 'transparent' : c.border) + ';transition:background .15s;">' +
                    '<div style="font-size:1.4rem;line-height:1.2;flex-shrink:0;">' + esc(n.icon) + '</div>' +
                    '<div style="flex:1;min-width:0;">' +
                        '<div style="font-weight:900;color:var(--text-main);font-size:.9rem;margin-bottom:3px;">' + esc(n.title) + '</div>' +
                        (n.body ? '<div style="font-size:.83rem;color:var(--text-muted);line-height:1.5;font-weight:600;">' + esc(n.body) + '</div>' : '') +
                        img +
                        '<div style="font-size:.75rem;color:var(--text-muted);margin-top:5px;opacity:.7;font-weight:700;">' + esc(n.time) + '</div>' +
                    '</div>' +
                    (!isRead ? '<div style="width:8px;height:8px;border-radius:50%;background:' + c.icon + ';flex-shrink:0;margin-top:5px;"></div>' : '') +
                '</div>'
            );
        }).join('');

        list.querySelectorAll('[data-nid]').forEach(function (el) {
            el.addEventListener('click', function () {
                var id = el.getAttribute('data-nid');
                window.MG_markRead(id);
                var n = allNotifs().filter(function (x) { return x.id === id; })[0];
                if (n && n.image) { closePanel(); buildPopup(n, true); }
                else if (n && n.link) window.open(n.link, '_blank', 'noopener');
            });
        });
    }
    window.MG_renderNotifications = render;

    window.MG_markRead = function (id) {
        var a = load(READ_KEY);
        if (a.indexOf(id) === -1) { a.push(id); save(READ_KEY, a); }
        render();
    };
    window.MG_markAllRead = function () {
        save(READ_KEY, allNotifs().map(function (n) { return n.id; }));
        render();
    };
    /* eski adlarla uyumluluk */
    window.markNotifRead = window.MG_markRead;
    window.renderNotifications = render;

    /* ── Panel aç/kapa ── */
    function panel() { return document.getElementById('notifPanel'); }
    function closePanel() {
        var p = panel(), b = document.getElementById('notifBtn');
        if (p) p.style.display = 'none';
        if (b) b.setAttribute('aria-expanded', 'false');
    }
    function bindPanel() {
        var btn = document.getElementById('notifBtn');
        var markAll = document.getElementById('notifMarkAll');
        if (btn) btn.addEventListener('click', function (e) {
            e.stopPropagation();
            var p = panel();
            if (!p) return;
            var open = p.style.display !== 'none';
            p.style.display = open ? 'none' : 'block';
            btn.setAttribute('aria-expanded', open ? 'false' : 'true');
            if (!open) render();
        });
        if (markAll) markAll.addEventListener('click', function () { window.MG_markAllRead(); });
        document.addEventListener('click', function (e) {
            var p = panel(), b = document.getElementById('notifBtn');
            if (p && !p.contains(e.target) && (!b || !b.contains(e.target))) closePanel();
        });
    }

    /* ── Açılış mesaj kutusu (popup) ── */
    function ensureKeyframes() {
        if (document.getElementById('mg-popup-keyframes')) return;
        var s = document.createElement('style');
        s.id = 'mg-popup-keyframes';
        s.textContent =
            '@keyframes mgPopupBgIn{from{opacity:0}to{opacity:1}}' +
            '@keyframes mgPopupBgOut{from{opacity:1}to{opacity:0}}' +
            '@keyframes mgPopupCardIn{from{opacity:0;transform:translateY(24px) scale(.93)}to{opacity:1;transform:translateY(0) scale(1)}}' +
            '@keyframes mgPopupCardOut{from{opacity:1;transform:scale(1)}to{opacity:0;transform:scale(.93)}}';
        document.head.appendChild(s);
    }


    /* ── Resmi tam ekran büyüt (dokununca yakınlaş, kaydır / çimdikle) ── */
    function closeZoom() {
        var z = document.getElementById('mg-zoom-overlay');
        if (z && z.parentNode) z.parentNode.removeChild(z);
    }
    function openZoom(src, alt) {
        if (document.getElementById('mg-zoom-overlay')) return;
        var z = document.createElement('div');
        z.id = 'mg-zoom-overlay';
        z.style.cssText = 'position:fixed;inset:0;z-index:999995;background:rgba(0,0,0,.94);display:flex;flex-direction:column;animation:mgPopupBgIn .2s ease both;';
        z.innerHTML =
            '<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;color:#fff;font-weight:800;font-size:.85rem;font-family:\'Nunito\',sans-serif;">' +
                '<span style="opacity:.8;">Yakınlaştırmak için dokunun · çimdikleyin</span>' +
                '<button id="mg-zoom-close" aria-label="Kapat" style="width:38px;height:38px;border-radius:12px;border:none;background:rgba(255,255,255,.16);color:#fff;font-size:1.1rem;cursor:pointer;">✕</button>' +
            '</div>' +
            '<div id="mg-zoom-scroll" style="flex:1;overflow:auto;touch-action:pan-x pan-y pinch-zoom;-webkit-overflow-scrolling:touch;display:flex;">' +
                '<img id="mg-zoom-img" src="' + esc(src) + '" alt="' + esc(alt) + '" style="margin:auto;width:100%;max-width:none;height:auto;max-height:none;object-fit:contain;cursor:zoom-in;">' +
            '</div>';
        document.body.appendChild(z);
        var img = z.querySelector('#mg-zoom-img'), zoomed = false;
        img.addEventListener('click', function () {
            zoomed = !zoomed;
            img.style.width = zoomed ? '230%' : '100%';
            img.style.cursor = zoomed ? 'zoom-out' : 'zoom-in';
        });
        z.querySelector('#mg-zoom-close').addEventListener('click', closeZoom);
    }

    function buildPopup(notif, manual) {
        if (document.getElementById('mg-notif-popup-overlay')) return;
        ensureKeyframes();
        var c = typeColor(notif.type);
        var hasImg = !!notif.image;

        var overlay = document.createElement('div');
        overlay.id = 'mg-notif-popup-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', 'Bildirim');
        overlay.style.cssText =
            'position:fixed;inset:0;z-index:999990;display:flex;align-items:center;justify-content:center;padding:20px;' +
            'background:rgba(0,0,0,.6);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);animation:mgPopupBgIn .3s ease both;';

        var card = document.createElement('div');
        card.style.cssText =
            'position:relative;background:var(--bg-card,#fff);border-radius:24px;width:' + (hasImg ? 'min(94vw,720px)' : 'min(92vw,420px)') + ';max-height:92vh;overflow:auto;' +
            'box-shadow:0 28px 64px rgba(0,0,0,.22),0 8px 20px rgba(0,0,0,.1);border:1px solid var(--border-color,rgba(0,0,0,.08));' +
            'animation:mgPopupCardIn .35s cubic-bezier(.34,1.56,.64,1) both;animation-delay:.05s;';

        var closeStyle =
            'width:32px;height:32px;border-radius:10px;border:1px solid var(--border-color,rgba(0,0,0,.1));' +
            'background:var(--bg-body,#f3f5f9);color:var(--text-muted,#94a3b8);cursor:pointer;font-size:1.1rem;' +
            'display:flex;align-items:center;justify-content:center;flex-shrink:0;font-family:inherit;';

        var html = '';
        if (hasImg) {
            /* Resimli bildirim: üst bant + sürükleme çubuğu + başlık + resim */
            html +=
                '<div style="height:5px;background:linear-gradient(90deg,' + c.border + ',#00d2ff);"></div>' +
                '<div id="mg-popup-head" style="touch-action:none;cursor:grab;">' +
                    '<div style="width:42px;height:4px;border-radius:4px;background:var(--border-color,rgba(0,0,0,.15));margin:9px auto 0;opacity:.8;"></div>' +
                    '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 14px 12px 18px;">' +
                        '<div style="display:flex;align-items:center;gap:11px;min-width:0;">' +
                            '<div style="width:40px;height:40px;border-radius:13px;background:linear-gradient(135deg,' + c.border + ',#00d2ff);display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0;box-shadow:0 4px 12px ' + c.border + '40;">' + esc(notif.icon) + '</div>' +
                            '<div style="min-width:0;">' +
                                '<div style="display:flex;align-items:center;gap:8px;">' +
                                    '<span style="font-size:.95rem;font-weight:900;color:var(--text-main,#0f172a);line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + esc(notif.title) + '</span>' +
                                    '<span style="font-size:.6rem;font-weight:900;letter-spacing:.5px;color:#fff;background:#FF5630;padding:2px 7px;border-radius:20px;flex-shrink:0;">YENİ</span>' +
                                '</div>' +
                                '<div style="font-size:.74rem;color:var(--text-muted,#94a3b8);font-weight:700;">' + esc(notif.time) + '</div>' +
                            '</div>' +
                        '</div>' +
                        '<button id="mg-popup-close" aria-label="Kapat" style="' + closeStyle + '">✕</button>' +
                    '</div>' +
                '</div>' +
                '<div style="padding:0 12px;position:relative;">' +
                    '<img id="mg-popup-img" src="' + esc(notif.image) + '" alt="' + esc(notif.title) + '" style="display:block;width:auto;max-width:100%;max-height:62vh;margin:0 auto;border-radius:16px;cursor:zoom-in;opacity:0;transition:opacity .45s ease;' +
                    'border:1px solid var(--border-color,rgba(0,0,0,.08));box-shadow:0 6px 20px rgba(0,0,0,.08);">' +
                    '<div id="mg-popup-zoombadge" aria-hidden="true" style="position:absolute;right:22px;bottom:10px;width:34px;height:34px;border-radius:50%;background:rgba(0,0,0,.55);color:#fff;' +
                    'display:flex;align-items:center;justify-content:center;font-size:1rem;pointer-events:none;backdrop-filter:blur(4px);">⤢</div>' +
                '</div>' +
                (notif.body ? '<p style="font-size:.9rem;color:var(--text-muted,#64748b);font-weight:600;line-height:1.6;margin:12px 20px 0;">' + esc(notif.body) + '</p>' : '');
        } else {
            html +=
                '<div style="height:5px;background:linear-gradient(90deg,' + c.border + ',#00d2ff);"></div>' +
                '<div style="padding:24px 24px 4px;">' +
                    '<div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:16px;">' +
                        '<div style="display:flex;align-items:center;gap:12px;">' +
                            '<div style="width:48px;height:48px;border-radius:15px;background:' + c.bg + ';border:1.5px solid ' + c.border + '33;display:flex;align-items:center;justify-content:center;font-size:1.6rem;flex-shrink:0;">' + esc(notif.icon) + '</div>' +
                            '<div>' +
                                '<div style="font-size:.72rem;font-weight:900;text-transform:uppercase;letter-spacing:.6px;color:' + c.icon + ';margin-bottom:3px;">' +
                                (notif.type === 'success' ? '✓ Başarı' : notif.type === 'warning' ? '⚠ Uyarı' : notif.type === 'error' ? '✕ Hata' : 'ℹ Bildirim') + '</div>' +
                                '<div style="font-size:.75rem;color:var(--text-muted,#94a3b8);font-weight:700;">' + esc(notif.time) + '</div>' +
                            '</div>' +
                        '</div>' +
                        '<button id="mg-popup-close" aria-label="Kapat" style="' + closeStyle + '">✕</button>' +
                    '</div>' +
                    '<h2 style="font-size:1.1rem;font-weight:900;color:var(--text-main,#0f172a);margin:0 0 8px;line-height:1.35;">' + esc(notif.title) + '</h2>' +
                    '<p style="font-size:.9rem;color:var(--text-muted,#64748b);font-weight:600;line-height:1.6;margin:0 0 4px;">' + esc(notif.body) + '</p>' +
                '</div>';
        }
        html +=
            '<div style="display:flex;gap:10px;padding:14px 20px 20px;">' +
                (notif.link
                    ? '<a href="' + esc(notif.link) + '" target="_blank" rel="noopener" style="flex:1;padding:12px 0;border-radius:14px;text-align:center;' +
                      'background:linear-gradient(135deg,' + c.border + ',#00d2ff);color:#fff;font-size:.9rem;font-weight:800;text-decoration:none;' +
                      'font-family:\'Nunito\',sans-serif;box-shadow:0 4px 14px ' + c.border + '44;">↗ İncele</a>'
                    : '') +
                (hasImg && navigator.share
                    ? '<button id="mg-popup-share" aria-label="Paylaş" style="width:50px;flex:none;padding:0;border-radius:14px;border:1.5px solid var(--border-color,rgba(0,0,0,.1));' +
                      'background:transparent;color:var(--text-main,#0f172a);font-size:1.15rem;cursor:pointer;">📤</button>'
                    : '') +
                (hasImg
                    ? '<button id="mg-popup-zoom" style="flex:1;padding:12px 0;border-radius:14px;border:1.5px solid var(--border-color,rgba(0,0,0,.1));' +
                      'background:transparent;color:var(--text-main,#0f172a);font-size:.9rem;font-weight:800;cursor:pointer;font-family:\'Nunito\',sans-serif;">🔍 Büyüt</button>'
                    : '') +
                '<button id="mg-popup-ok" style="flex:1;padding:12px 0;border-radius:14px;border:none;' +
                'background:linear-gradient(135deg,' + c.border + ',#00d2ff);color:#fff;font-size:.9rem;font-weight:800;cursor:pointer;' +
                'font-family:\'Nunito\',sans-serif;box-shadow:0 4px 14px ' + c.border + '44;">Tamam</button>' +
            '</div>';

        card.innerHTML = html;
        overlay.appendChild(card);
        document.body.appendChild(overlay);

        /* Arka plan kaydırmasını kilitle */
        var prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        /* Giriş animasyonu bitince transform serbest kalsın (sürükleme için) */
        card.addEventListener('animationend', function () { card.style.animation = 'none'; }, { once: true });
        try { if (!manual && navigator.vibrate) navigator.vibrate(12); } catch (e) {}

        function finish() {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prevOverflow;
            if (!notif.always) {
                var seen = load(POPUP_KEY);
                if (seen.indexOf(notif.id) === -1) { seen.push(notif.id); save(POPUP_KEY, seen); }
            }
            window.MG_markRead(notif.id);
            overlay.style.animation = 'mgPopupBgOut .2s ease forwards';
            card.style.animation = 'mgPopupCardOut .2s ease forwards';
            setTimeout(function () {
                if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
                if (!manual) setTimeout(showNext, 300);
            }, 220);
        }
        function onKey(e) {
            if (e.key !== 'Escape') return;
            if (document.getElementById('mg-zoom-overlay')) { closeZoom(); return; }
            finish();
        }
        var imgEl = card.querySelector('#mg-popup-img');
        var zoomBtn = card.querySelector('#mg-popup-zoom');
        if (imgEl) {
            imgEl.addEventListener('click', function () { openZoom(notif.image, notif.title); });
            if (imgEl.complete) imgEl.style.opacity = '1';
            imgEl.addEventListener('load', function () { imgEl.style.opacity = '1'; });
            imgEl.addEventListener('error', function () { imgEl.style.opacity = '1'; });
        }

        /* Başlığı aşağı sürükleyerek kapat (mobil) */
        var head = card.querySelector('#mg-popup-head');
        if (head) {
            var startY = null, dy = 0;
            head.addEventListener('touchstart', function (e) { startY = e.touches[0].clientY; dy = 0; card.style.transition = 'none'; }, { passive: true });
            head.addEventListener('touchmove', function (e) {
                if (startY === null) return;
                dy = Math.max(0, e.touches[0].clientY - startY);
                card.style.transform = 'translateY(' + dy + 'px)';
                overlay.style.opacity = String(Math.max(.25, 1 - dy / 400));
            }, { passive: true });
            head.addEventListener('touchend', function () {
                if (startY === null) return;
                startY = null;
                if (dy > 90) { finish(); return; }
                card.style.transition = 'transform .25s ease';
                card.style.transform = 'translateY(0)';
                overlay.style.opacity = '1';
            });
        }

        /* Paylaş: önce resim dosyası, olmazsa bağlantı */
        var shareBtn = card.querySelector('#mg-popup-share');
        if (shareBtn) shareBtn.addEventListener('click', function () {
            var shareData = { title: notif.title, text: notif.title, url: location.href };
            fetch(notif.image).then(function (r) { return r.blob(); }).then(function (blob) {
                var f = new File([blob], 'mugol-bildirim.' + ((blob.type || 'image/png').split('/')[1] || 'png'), { type: blob.type || 'image/png' });
                if (navigator.canShare && navigator.canShare({ files: [f] })) return navigator.share({ files: [f], title: notif.title });
                return navigator.share(shareData);
            }).catch(function () { try { navigator.share(shareData); } catch (e) {} });
        });
        if (zoomBtn) zoomBtn.addEventListener('click', function () { openZoom(notif.image, notif.title); });

        var closeBtn = card.querySelector('#mg-popup-close');
        var okBtn = card.querySelector('#mg-popup-ok');
        if (closeBtn) closeBtn.addEventListener('click', finish);
        if (okBtn) okBtn.addEventListener('click', finish);
        overlay.addEventListener('click', function (e) { if (e.target === overlay) finish(); });
        document.addEventListener('keydown', onKey);
    }

    /* Sıradaki popup: önce açılış resmi (her seferinde), sonra görülmemişler */
    var launchShown = false;
    function showNext() {
        if (launchReady && !launchShown) { launchShown = true; buildPopup(launchNotif); return; }
        var seen = load(POPUP_KEY), list = window.MG_NOTIFICATIONS || [];
        for (var i = 0; i < list.length; i++) {
            if (list[i].popup && seen.indexOf(list[i].id) === -1) { buildPopup(list[i]); return; }
        }
    }

    /* Splash bitince başlat */
    function waitForSplash() {
        var started = false;
        function go() { if (started) return; started = true; setTimeout(showNext, 650); }
        var splash = document.getElementById('splash-screen');
        if (!splash || splash.classList.contains('hidden')) { go(); return; }
        var mo = new MutationObserver(function () {
            if (splash.classList.contains('hidden')) { mo.disconnect(); go(); }
        });
        mo.observe(splash, { attributes: true });
        setTimeout(function () { mo.disconnect(); go(); }, 12000);   /* güvenlik */
    }

    function init() {
        bindPanel();
        render();
        /* Resmi önceden yükle; bulunamazsa bildirim hiç gösterilmez */
        var probe = new Image();
        probe.onload = function () { launchReady = true; render(); waitForSplash(); };
        probe.onerror = function () { launchReady = false; render(); waitForSplash(); };
        probe.src = MG_LAUNCH_IMAGE;
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
