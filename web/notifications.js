// ╔══════════════════════════════════════════════════════════════╗
// ║          MuGöl PORTAL — BİLDİRİM SİSTEMİ                    ║
// ║  Bu dosyayı düzenleyerek bildirimleri yönetebilirsiniz.      ║
// ╚══════════════════════════════════════════════════════════════╝
//
// ── BİLDİRİM EKLEME REHBERİ ──────────────────────────────────
//
//  Her bildirim şu alanlardan oluşur:
//
//  id       : Benzersiz kimlik (string). Okunan bildirimi takip eder.
//             Her yeni bildirim için farklı bir id verin (n3, n4, ...).
//
//  icon     : Emoji veya Font Awesome class (örn: "🔔" veya "fa-bell").
//             Emoji önerilir — daha geniş destek.
//
//  title    : Bildirim başlığı (kısa ve net olsun).
//
//  body     : Bildirim açıklama metni.
//
//  time     : Zaman etiketi (örn: "Az önce", "1 saat önce", "3 Mayıs").
//
//  type     : Bildirim tipi — kartın sol kenarlık rengini belirler.
//             Seçenekler: "info" | "success" | "warning" | "error"
//             Belirtilmezse varsayılan "info" kullanılır.
//
//  link     : (İsteğe bağlı) Tıklandığında açılacak URL.
//             Belirtilmezse sadece okundu işaretlenir.
//
//  popup    : true → Splash sonrası mesaj kutusunda gösterilir.
//             false veya belirtilmezse → Sadece bildirim panelinde görünür.
//
// ── ÖRNEK ────────────────────────────────────────────────────
//
//  {
//    id: 'n5',
//    icon: '⚡',
//    title: 'Yeni Özellik: Karanlık Mod',
//    body: 'Ayarlar > Karanlık Mod ile göz yorgunluğunu azaltın.',
//    time: '10 Mayıs',
//    type: 'success',
//    popup: true
//  },
//
// ─────────────────────────────────────────────────────────────

window.MG_NOTIFICATIONS = [

    // ── Mevcut Bildirimler ────────────────────────────────────

    {
        id: 'n1',
        icon: '🚀',
        title: 'MuGöl PORTAL v3.0 Yayında!',
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
        body: 'Ayarlar'daki "Güncelleme Yap" butonu ile önbelleği temizleyip en son sürümü alabilirsiniz.',
        time: '3 gün önce',
        type: 'info',
        popup: false
    },

    // ── Yeni bildirim eklemek için buraya kopyalayın ──────────
    //
    // {
    //     id: 'n4',
    //     icon: '🎉',
    //     title: 'Bildirim Başlığı',
    //     body: 'Bildirim açıklama metni buraya gelir.',
    //     time: 'Az önce',
    //     type: 'info',   // info | success | warning | error
    //     popup: true     // true = splash sonrası mesaj kutusunda çıksın
    // },

];

// ─────────────────────────────────────────────────────────────
// AŞAĞIYI DEĞİŞTİRMEYİN — Sistem Kodu
// ─────────────────────────────────────────────────────────────

(function () {
    'use strict';

    /* Tip → renk eşleşmesi */
    var TYPE_COLORS = {
        info:    { border: '#4318ff', bg: 'rgba(67,24,255,0.06)',  icon: '#4318ff' },
        success: { border: '#10b981', bg: 'rgba(16,185,129,0.06)', icon: '#10b981' },
        warning: { border: '#f59e0b', bg: 'rgba(245,158,11,0.06)', icon: '#f59e0b' },
        error:   { border: '#ef4444', bg: 'rgba(239,68,68,0.06)',  icon: '#ef4444' }
    };

    function typeColor(type) {
        return TYPE_COLORS[type] || TYPE_COLORS.info;
    }

    /* localStorage yardımcıları */
    var READ_KEY = 'mugol-read-notifs';
    function getRead()     { try { return JSON.parse(localStorage.getItem(READ_KEY) || '[]'); } catch(e) { return []; } }
    function saveRead(arr) { try { localStorage.setItem(READ_KEY, JSON.stringify(arr)); } catch(e) {} }

    /* ── Bildirim panelini render et (mevcut script.js ile entegre) ── */
    function renderNotifications() {
        var list = document.getElementById('notifList');
        var dot  = document.getElementById('notifDot');
        if (!list) return;

        var notifs = window.MG_NOTIFICATIONS || [];
        var readArr = getRead();
        var unread  = notifs.filter(function(n) { return !readArr.includes(n.id); });

        if (dot) dot.style.display = unread.length > 0 ? 'block' : 'none';

        if (!notifs.length) {
            list.innerHTML = '<div style="padding:24px;text-align:center;color:var(--text-muted);font-weight:700;font-size:.9rem;">Henüz bildirim yok.</div>';
            return;
        }

        list.innerHTML = notifs.map(function(n) {
            var isRead = readArr.includes(n.id);
            var c = typeColor(n.type);
            return (
                '<div onclick="window.MG_markRead(\'' + n.id + '\')" ' +
                'style="padding:14px 16px;border-bottom:1px solid var(--border-color);cursor:pointer;' +
                'background:' + (isRead ? 'transparent' : c.bg) + ';' +
                'display:flex;gap:13px;align-items:flex-start;' +
                'border-left:3px solid ' + (isRead ? 'transparent' : c.border) + ';' +
                'transition:background .15s;">' +
                    '<div style="font-size:1.4rem;line-height:1.2;flex-shrink:0;">' + n.icon + '</div>' +
                    '<div style="flex:1;min-width:0;">' +
                        '<div style="font-weight:900;color:var(--text-main);font-size:.9rem;margin-bottom:3px;">' + n.title + '</div>' +
                        '<div style="font-size:.83rem;color:var(--text-muted);line-height:1.5;font-weight:600;">' + n.body + '</div>' +
                        '<div style="font-size:.75rem;color:var(--text-muted);margin-top:5px;opacity:.7;font-weight:700;">' + n.time + '</div>' +
                    '</div>' +
                    (!isRead ? '<div style="width:8px;height:8px;border-radius:50%;background:' + c.icon + ';flex-shrink:0;margin-top:5px;"></div>' : '') +
                '</div>'
            );
        }).join('');
    }
    window.MG_renderNotifications = renderNotifications;

    /* ── Bildirim okundu işaretle ── */
    window.MG_markRead = function(id) {
        var readArr = getRead();
        if (!readArr.includes(id)) {
            readArr.push(id);
            saveRead(readArr);
            if (typeof _fbSetPref === 'function') _fbSetPref('readNotifs', readArr);
        }
        renderNotifications();
    };

    /* ── Tümünü okundu işaretle ── */
    window.MG_markAllRead = function() {
        var all = (window.MG_NOTIFICATIONS || []).map(function(n) { return n.id; });
        saveRead(all);
        if (typeof _fbSetPref === 'function') _fbSetPref('readNotifs', all);
        renderNotifications();
    };

    /* ─────────────────────────────────────────────────────────
       SPLASH SONRASI POPUP MESAJ KUTUSU
    ───────────────────────────────────────────────────────── */
    var POPUP_KEY = 'mugol-seen-popups';

    function getSeenPopups()       { try { return JSON.parse(localStorage.getItem(POPUP_KEY) || '[]'); } catch(e) { return []; } }
    function saveSeenPopup(id)     { var arr = getSeenPopups(); if (!arr.includes(id)) { arr.push(id); try { localStorage.setItem(POPUP_KEY, JSON.stringify(arr)); } catch(e) {} } }

    function buildPopup(notif) {
        var c = typeColor(notif.type);
        var overlay = document.createElement('div');
        overlay.id = 'mg-notif-popup-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', 'Bildirim');
        overlay.style.cssText = [
            'position:fixed;inset:0;z-index:999990;',
            'display:flex;align-items:center;justify-content:center;padding:20px;',
            'background:rgba(0,0,0,.55);backdrop-filter:blur(8px);',
            '-webkit-backdrop-filter:blur(8px);',
            'animation:mgPopupBgIn .3s ease both;'
        ].join('');

        var card = document.createElement('div');
        card.style.cssText = [
            'background:var(--bg-card,#fff);border-radius:24px;',
            'width:min(92vw,420px);overflow:hidden;',
            'box-shadow:0 28px 64px rgba(0,0,0,.22),0 8px 20px rgba(0,0,0,.1);',
            'border:1px solid var(--border-color,rgba(0,0,0,.08));',
            'animation:mgPopupCardIn .35s cubic-bezier(.34,1.56,.64,1) both;',
            'animation-delay:.05s;'
        ].join('');

        /* Üst renkli bant */
        var band = document.createElement('div');
        band.style.cssText = [
            'height:5px;',
            'background:linear-gradient(90deg,' + c.border + ',',
            (notif.type === 'success' ? '#00d2ff' : notif.type === 'warning' ? '#ef4444' : notif.type === 'error' ? '#f59e0b' : '#00d2ff') + ');'
        ].join('');

        /* İçerik */
        var body = document.createElement('div');
        body.style.cssText = 'padding:24px 24px 20px;';
        body.innerHTML = [
            /* İkon + kapat */
            '<div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:16px;">',
                '<div style="display:flex;align-items:center;gap:12px;">',
                    '<div style="width:48px;height:48px;border-radius:15px;',
                    'background:' + c.bg + ';border:1.5px solid ' + c.border + '33;',
                    'display:flex;align-items:center;justify-content:center;font-size:1.6rem;flex-shrink:0;">',
                    notif.icon,
                    '</div>',
                    '<div>',
                        '<div style="font-size:.72rem;font-weight:900;text-transform:uppercase;letter-spacing:.6px;',
                        'color:' + c.icon + ';margin-bottom:3px;">',
                        (notif.type === 'success' ? '✓ Başarı' : notif.type === 'warning' ? '⚠ Uyarı' : notif.type === 'error' ? '✕ Hata' : 'ℹ Bildirim'),
                        '</div>',
                        '<div style="font-size:.75rem;color:var(--text-muted,#94a3b8);font-weight:700;">' + notif.time + '</div>',
                    '</div>',
                '</div>',
                '<button id="mg-popup-close" aria-label="Kapat" style="',
                'width:32px;height:32px;border-radius:10px;border:1px solid var(--border-color,rgba(0,0,0,.1));',
                'background:var(--bg-body,#f3f5f9);color:var(--text-muted,#94a3b8);',
                'cursor:pointer;font-size:1.1rem;display:flex;align-items:center;justify-content:center;',
                'transition:background .15s,transform .15s;flex-shrink:0;',
                'font-family:inherit;">✕</button>',
            '</div>',
            /* Başlık + metin */
            '<h2 style="font-size:1.1rem;font-weight:900;color:var(--text-main,#0f172a);margin:0 0 8px;line-height:1.35;">',
            notif.title,
            '</h2>',
            '<p style="font-size:.9rem;color:var(--text-muted,#64748b);font-weight:600;line-height:1.6;margin:0 0 20px;">',
            notif.body,
            '</p>',
            /* Butonlar */
            '<div style="display:flex;gap:10px;">',
                (notif.link
                    ? '<a href="' + notif.link + '" target="_blank" rel="noopener" id="mg-popup-cta" style="' +
                      'flex:1;padding:12px 0;border-radius:14px;border:none;text-align:center;' +
                      'background:linear-gradient(135deg,' + c.border + ',#00d2ff);' +
                      'color:#fff;font-size:.9rem;font-weight:800;cursor:pointer;text-decoration:none;' +
                      'font-family:\'Nunito\',sans-serif;display:flex;align-items:center;justify-content:center;gap:8px;' +
                      'box-shadow:0 4px 14px ' + c.border + '44;">↗ İncele</a>'
                    : ''),
                '<button id="mg-popup-ok" style="' +
                'flex:1;padding:12px 0;border-radius:14px;' +
                'border:1.5px solid var(--border-color,rgba(0,0,0,.1));' +
                'background:transparent;color:var(--text-main,#0f172a);' +
                'font-size:.9rem;font-weight:800;cursor:pointer;font-family:\'Nunito\',sans-serif;' +
                'transition:background .15s;">Tamam, Anladım</button>',
            '</div>'
        ].join('');

        card.appendChild(band);
        card.appendChild(body);
        overlay.appendChild(card);

        /* Stil enjekte */
        if (!document.getElementById('mg-popup-keyframes')) {
            var s = document.createElement('style');
            s.id = 'mg-popup-keyframes';
            s.textContent = [
                '@keyframes mgPopupBgIn{from{opacity:0}to{opacity:1}}',
                '@keyframes mgPopupBgOut{from{opacity:1}to{opacity:0}}',
                '@keyframes mgPopupCardIn{from{opacity:0;transform:translateY(24px) scale(.93)}to{opacity:1;transform:translateY(0) scale(1)}}',
                '@keyframes mgPopupCardOut{from{opacity:1;transform:scale(1)}to{opacity:0;transform:scale(.93)}}',
            ].join('');
            document.head.appendChild(s);
        }

        function closePopup() {
            overlay.style.animation = 'mgPopupBgOut .2s ease forwards';
            card.style.animation    = 'mgPopupCardOut .2s ease forwards';
            setTimeout(function() {
                if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
                /* Sonraki okunmamış popup var mı kontrol et */
                setTimeout(showNextPopup, 300);
            }, 220);
        }

        document.body.appendChild(overlay);

        /* Kapat butonu */
        var closeBtn = document.getElementById('mg-popup-close');
        var okBtn    = document.getElementById('mg-popup-ok');
        if (closeBtn) closeBtn.addEventListener('click', function() { saveSeenPopup(notif.id); window.MG_markRead(notif.id); closePopup(); });
        if (okBtn)    okBtn.addEventListener('click',    function() { saveSeenPopup(notif.id); window.MG_markRead(notif.id); closePopup(); });

        /* Overlay dışı tıkla */
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) { saveSeenPopup(notif.id); window.MG_markRead(notif.id); closePopup(); }
        });

        /* ESC ile kapat */
        function onKey(e) {
            if (e.key === 'Escape') { saveSeenPopup(notif.id); window.MG_markRead(notif.id); closePopup(); document.removeEventListener('keydown', onKey); }
        }
        document.addEventListener('keydown', onKey);
    }

    /* Sıradaki gösterilmemiş popup'ı bul ve göster */
    function showNextPopup() {
        var notifs  = window.MG_NOTIFICATIONS || [];
        var seen    = getSeenPopups();
        var next    = null;
        for (var i = 0; i < notifs.length; i++) {
            var n = notifs[i];
            if (n.popup && !seen.includes(n.id)) { next = n; break; }
        }
        if (next) buildPopup(next);
    }

    /* ── Splash bitince popup'ı başlat ── */
    function waitForSplash() {
        var splash = document.getElementById('splash-screen');
        if (!splash) { setTimeout(showNextPopup, 800); return; }

        /* MutationObserver: splash 'hidden' class alınca tetikle */
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(m) {
                if (m.type === 'attributes' && m.attributeName === 'class') {
                    if (splash.classList.contains('hidden')) {
                        observer.disconnect();
                        /* Kısa bekleme — sayfa tam görünür olsun */
                        setTimeout(showNextPopup, 650);
                    }
                }
            });
        });

        /* Splash zaten hidden ise hemen göster */
        if (splash.classList.contains('hidden')) {
            setTimeout(showNextPopup, 650);
        } else {
            observer.observe(splash, { attributes: true });
        }
    }

    /* ── script.js'teki mevcut bildirim sistemine entegre ── */
    /* script.js NOTIFICATIONS ve renderNotifications'ı override et */
    function patchScriptJS() {
        /* Mevcut NOTIFICATIONS varsa yok say — MG_NOTIFICATIONS kullan */
        if (typeof window.NOTIFICATIONS !== 'undefined') {
            try { window.NOTIFICATIONS = window.MG_NOTIFICATIONS; } catch(e) {}
        }
        /* Mevcut renderNotifications varsa override et */
        if (typeof window.renderNotifications === 'function') {
            window.renderNotifications = renderNotifications;
        }
        /* markNotifRead'i güncelle */
        if (typeof window.markNotifRead === 'function') {
            window.markNotifRead = window.MG_markRead;
        }
        /* Tümünü okundu butonu */
        var markAllBtn = document.getElementById('notifMarkAll');
        if (markAllBtn) {
            markAllBtn.onclick = function() { window.MG_markAllRead(); };
        }
        /* Bildirim butonunu render et */
        renderNotifications();
    }

    /* DOM hazır olunca başlat */
    function init() {
        patchScriptJS();
        waitForSplash();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        /* script.js tam yüklenmemiş olabilir, kısa gecikme */
        setTimeout(init, 50);
    }

})();
