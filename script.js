// =========================================================
// FIREBASE YARDIMCILARI — Kullanıcı sistemi kaldırıldı, stub
// =========================================================
function _fbGetUser()          { return null; }
function _fbSafePath(u)        { return ''; }
function _fbSetPref()          {}
function _fbLoadPrefs(cb)      { if (cb) cb(null); }
function _fbApplyPrefs()       {}

// =========================================================
// DEĞİŞKENLER VE DOM ELEMENTLERİ
// =========================================================
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page-section');
const sectionTitle = document.getElementById('sectionTitle');
const hamburgerBtn = document.getElementById('hamburgerBtn');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const mainContent = document.querySelector('.main-content');

// =========================================================
// 1. MENÜ GEÇİŞ SİSTEMİ (Tıklama ve Klavye Desteği)
// =========================================================
/* Harici bağlantılı menü öğesi (data-href): sayfa değiştirmez, adresi yeni sekmede açar */
function mgOpenHref(el) {
    var url = el.getAttribute('data-href');
    if (!url) return;
    var a = document.createElement('a');
    a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer';
    a.style.cssText = 'position:fixed;width:0;height:0;opacity:0;pointer-events:none;left:-9999px;';
    document.body.appendChild(a); a.click();
    setTimeout(function () { if (a.parentNode) a.parentNode.removeChild(a); }, 500);
    /* açık menüleri kapat */
    var sb = document.getElementById('sidebar'), ov = document.getElementById('sidebarOverlay');
    if (sb) sb.classList.remove('mobile-open');
    if (ov) ov.classList.remove('active');
    var bnOv = document.getElementById('mgBnOverlay');
    if (bnOv && bnOv.classList.contains('bn-visible')) bnOv.click();
}
/* Alt menüdeki "Daha Fazla" panelinde data-href'li düğmeler */
document.addEventListener('click', function (e) {
    var el = e.target.closest ? e.target.closest('.mg-bn-panel-item[data-href]') : null;
    if (el) { e.preventDefault(); mgOpenHref(el); }
});

function activateMenu(item) {
    if (item.hasAttribute('data-href')) { mgOpenHref(item); return; }
    if (item.id === 'installAppBtn') return;

    navItems.forEach(nav => {
        if (nav.id !== 'installAppBtn') nav.classList.remove('active');
    });
    item.classList.add('active');

    const title = item.getAttribute('data-title');
    if (sectionTitle) sectionTitle.textContent = title;

    const targetId = item.getAttribute('data-target');
    pages.forEach(page => {
        if (page.id === targetId) {
            page.classList.add('active');
        } else {
            page.classList.remove('active');
        }
    });

    if (window.innerWidth <= 992 && sidebar && sidebarOverlay) {
        sidebar.classList.remove('mobile-open');
        sidebarOverlay.classList.remove('active');
        if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'false');
    }
}

navItems.forEach(item => {
    item.addEventListener('click', () => activateMenu(item));
    item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            activateMenu(item);
        }
    });
});

// ── Sidebar Menü Arama ──
(function() {
    var sidebarSearchInp = document.getElementById('mgSidebarSearch');
    if (!sidebarSearchInp) return;
    sidebarSearchInp.addEventListener('input', function() {
        var q = this.value.trim().toLowerCase();
        navItems.forEach(function(item) {
            if (item.id === 'installAppBtn') return;
            var title = (item.getAttribute('data-title') || item.querySelector('.nav-text')?.textContent || '').toLowerCase();
            item.classList.toggle('mg-hidden', q !== '' && title.indexOf(q) === -1);
        });
    });
    sidebarSearchInp.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') { this.value = ''; this.dispatchEvent(new Event('input')); }
    });
})();

// =========================================================
// 2. SİDEBAR KONTROLLERİ (Mobil & Masaüstü)
// =========================================================
function toggleSidebar() {
    if (window.innerWidth > 992) {
        sidebar.classList.toggle('collapsed');
    } else {
        const isOpen = sidebar.classList.toggle('mobile-open');
        sidebarOverlay.classList.toggle('active');
        if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', isOpen);
    }
}

if (hamburgerBtn) hamburgerBtn.addEventListener('click', toggleSidebar);

if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', () => {
        sidebar.classList.remove('mobile-open');
        sidebarOverlay.classList.remove('active');
        if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'false');
    });
}

window.addEventListener('resize', () => {
    if (window.innerWidth > 992 && sidebar && sidebarOverlay) {
        sidebar.classList.remove('mobile-open');
        sidebarOverlay.classList.remove('active');
        if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'false');
    }
});

// =========================================================
// 3. AYARLAR: TEMA VE YAZI BOYUTU
// =========================================================
const themeSwitch = document.getElementById('themeSwitch');
const savedTheme = localStorage.getItem('mugol-theme') || 'light';

document.documentElement.setAttribute('data-theme', savedTheme);
if (themeSwitch) themeSwitch.checked = savedTheme === 'dark';

if (themeSwitch) {
    themeSwitch.addEventListener('change', (e) => {
        const theme = e.target.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('mugol-theme', theme);
        _fbSetPref('theme', theme);
    });
}

// ── Açılış Müziği Toggle ──
const musicSwitch = document.getElementById('musicSwitch');
if (musicSwitch) {
    musicSwitch.checked = localStorage.getItem('mugol-acilis-muzik') !== 'kapali';
    musicSwitch.addEventListener('change', (e) => {
        localStorage.setItem('mugol-acilis-muzik', e.target.checked ? 'acik' : 'kapali');
    });
}

const fontBtns = document.querySelectorAll('.font-btn');

// Kaydedilmiş yazı boyutunu uygula
(function() {
    var savedSize = localStorage.getItem('mugol-font-size');
    if (savedSize) {
        document.documentElement.style.setProperty('--base-font-size', savedSize);
        fontBtns.forEach(b => {
            b.classList.toggle('active', b.getAttribute('data-size') === savedSize);
        });
    }
})();

fontBtns.forEach(btn => {
    const applyFont = () => {
        fontBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const newSize = btn.getAttribute('data-size');
        document.documentElement.style.setProperty('--base-font-size', newSize);
        localStorage.setItem('mugol-font-size', newSize);
    };
    btn.addEventListener('click', applyFont);
    btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            applyFont();
        }
    });
});

// =========================================================
// 4. TARİH VE SAAT FONKSİYONU
// =========================================================
function updateDateTime() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    const timeEl = document.getElementById('timeDisplay');
    const secEl  = document.getElementById('secondDisplay');
    if (timeEl) timeEl.textContent = h + ':' + m;
    if (secEl)  secEl.textContent  = ':' + s;

    const options = { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' };
    const dateString = now.toLocaleDateString('tr-TR', options);
    const dateEl = document.getElementById('dateDisplay');
    if (dateEl && dateEl.textContent !== dateString) dateEl.textContent = dateString;
}
setInterval(updateDateTime, 1000);
updateDateTime();

// =========================================================
// 5. GELİŞMİŞ İLETİŞİM FORMU
// =========================================================
const contactForm = document.getElementById('contactForm');
const charCountEl = document.getElementById('charCount');
const msgTextarea = document.getElementById('contact-message');

if (msgTextarea && charCountEl) {
    msgTextarea.addEventListener('input', function () {
        const len = this.value.length;
        charCountEl.textContent = len + ' / 500';
        charCountEl.style.color = len > 450 ? '#ef4444' : len > 350 ? '#f59e0b' : 'var(--text-muted)';
    });
}

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('contact-name').value.trim();
        const email = document.getElementById('contact-email').value.trim();
        const category = document.getElementById('contact-category').value;
        const message = document.getElementById('contact-message').value.trim();

        const subject = category + ' – ' + name;
        const body = message
            + '\n\n──────────────────\nGönderen: ' + name
            + '\nE-posta: ' + email
            + '\nKategori: ' + category
            + '\nTarih: ' + new Date().toLocaleString('tr-TR');

        const mailtoLink = 'mailto:mugol.education.help@gmail.com?subject='
            + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);

        window.location.href = mailtoLink;

        contactForm.style.display = 'none';
        const successEl = document.getElementById('formSuccess');
        if (successEl) successEl.style.display = 'block';
    });
}

window.resetContactForm = function() {
    const successEl = document.getElementById('formSuccess');
    if (successEl) successEl.style.display = 'none';
    if (contactForm) {
        contactForm.reset();
        contactForm.style.display = 'flex';
        if (charCountEl) {
            charCountEl.textContent = '0 / 500';
            charCountEl.style.color = 'var(--text-muted)';
        }
    }
}

// =========================================================
// 6. YÖNLENDİRME TOAST (POP-UP ENGELLEYİCİ ÇÖZÜMLÜ)
// =========================================================
let toastTimer = null;
let toastCountdown = null;
let pendingUrl = null;

const toast = document.getElementById('redirect-toast');
const toastAppName = document.getElementById('toast-app-name');
const toastCountEl = document.getElementById('toast-countdown');
const toastRing = document.getElementById('toast-ring');
const toastCancelBtn = document.getElementById('toast-cancel-btn');
const CIRCUMFERENCE = 2 * Math.PI * 14;

function cancelToast() {
    if (toastTimer) clearTimeout(toastTimer);
    if (toastCountdown) clearInterval(toastCountdown);
    if (toast) toast.classList.remove('show');
    pendingUrl = null;
}

if (toastCancelBtn) toastCancelBtn.addEventListener('click', cancelToast);

function showRedirectToast(appName, url, logoSrc) {
    if (url) _mgOpenUrl(url, appName, logoSrc);
}

document.querySelectorAll('.app-card').forEach(card => {
    card.addEventListener('click', function (e) {
        e.preventDefault();
        const appName = this.querySelector('.app-info h3')?.textContent || 'Uygulama';
        const url = this.getAttribute('href');
        const logoSrc = this.querySelector('.app-icon-img')?.src || '';
        showRedirectToast(appName, url, logoSrc);
    });
});

document.querySelectorAll('.tumuu-tile').forEach(tile => {
    tile.addEventListener('click', function (e) {
        e.preventDefault();
        const appName = this.querySelector('.tumuu-label')?.textContent || 'Uygulama';
        const url = this.getAttribute('href');
        const logoSrc = this.querySelector('.tumuu-icon')?.src || '';
        showRedirectToast(appName, url, logoSrc);
    });
});

// =========================================================
// 7. ANA SAYFA KATEGORİ KARTLARI YÖNLENDİRMESİ
// =========================================================
document.querySelectorAll('.category-card').forEach(catCard => {
    const triggerCat = () => {
        const targetId = catCard.getAttribute('data-target');
        const menuItem = document.querySelector('.nav-item[data-target="' + targetId + '"]');
        if (menuItem) menuItem.click();
    };
    catCard.addEventListener('click', triggerCat);
    catCard.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            triggerCat();
        }
    });
});

// =========================================================
// 8a. REKLAM KARTI CAROUSEL — MuGöl IQ / AI / OS (kaydırmalı + otomatik)
// =========================================================
(function () {
    const track = document.getElementById('mgAdTrack');
    const dotsWrap = document.getElementById('mgAdDots');
    if (!track || !dotsWrap) return;

    const cards = Array.from(track.children);
    const dots = Array.from(dotsWrap.children);
    let activeIdx = 0;
    let autoTimer = null;
    let isUserInteracting = false;

    function setActive(idx) {
        activeIdx = idx;
        dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    }

    function goTo(idx, smooth) {
        if (!cards[idx]) return;
        track.scrollTo({ left: cards[idx].offsetLeft - track.offsetLeft, behavior: smooth === false ? 'auto' : 'smooth' });
        setActive(idx);
    }

    function nextSlide() {
        const next = (activeIdx + 1) % cards.length;
        goTo(next);
    }

    function startAuto() {
        stopAuto();
        autoTimer = setInterval(() => {
            if (!isUserInteracting) nextSlide();
        }, 3500);
    }
    function stopAuto() {
        if (autoTimer) clearInterval(autoTimer);
        autoTimer = null;
    }

    // Kullanıcı elle kaydırınca aktif noktayı güncelle
    let scrollDebounce = null;
    track.addEventListener('scroll', function () {
        isUserInteracting = true;
        if (scrollDebounce) clearTimeout(scrollDebounce);
        scrollDebounce = setTimeout(function () {
            const trackLeft = track.scrollLeft;
            let closest = 0, closestDist = Infinity;
            cards.forEach((c, i) => {
                const dist = Math.abs(c.offsetLeft - track.offsetLeft - trackLeft);
                if (dist < closestDist) { closestDist = dist; closest = i; }
            });
            setActive(closest);
            isUserInteracting = false;
        }, 150);
    }, { passive: true });

    // Noktalara tıklayınca ilgili karta git
    dots.forEach((dot, i) => {
        dot.addEventListener('click', function () { goTo(i); });
    });

    // Sekme arka plana alındığında otomatik döngüyü durdur (performans)
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) stopAuto(); else startAuto();
    });

    // ── Dikey kaydırma önceliği: parmak dikey hareket ediyorsa yatay
    //    carousel'in dokunuşu yutmasını engelle, sayfa scroll'una bırak.
    (function () {
        let startX = 0, startY = 0, decided = false;

        // Varsayılan: dikey kaydırmaya öncelik ver (hafif/parmak ucu dokunuşlar dahil).
        // Net bir yatay hareket algılanana kadar tarayıcı sayfayı kaydırabilir.
        track.style.touchAction = 'pan-y';

        track.addEventListener('touchstart', function (e) {
            if (!e.touches || !e.touches[0]) return;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            decided = false;
            track.style.touchAction = 'pan-y';
        }, { passive: true });

        track.addEventListener('touchmove', function (e) {
            if (!e.touches || !e.touches[0]) return;
            const dx = e.touches[0].clientX - startX;
            const dy = e.touches[0].clientY - startY;
            if (!decided) {
                // Düşük eşik (3px): hafif/parmak ucu dokunuşlarda da erken karar verir.
                if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
                    decided = true;
                    // Yatay hareket dikeyden belirgin şekilde fazlaysa (1.2x pay) yatay kabul et.
                    if (Math.abs(dx) > Math.abs(dy) * 1.2) {
                        track.style.touchAction = 'pan-x';
                    }
                }
            }
        }, { passive: true });
    })();

    startAuto();
})();


(function () {
    const bar = document.getElementById('splashProgressBar');
    const label = document.getElementById('splashProgressLabel');
    const splash = document.getElementById('splash-screen');
    const splashVideo = document.getElementById('splashVideo');
    const splashLogoFallback = document.getElementById('splashLogoFallback');

    // ── AYARLAR ──────────────────────────────────────────────
    // Açılış süresini artık VİDEO belirler (mugol_acilis.mp4 şu an 15 sn).
    // Videoyu tekrar uzatıp kısaltırsan kodda hiçbir şey değiştirmen gerekmez.
    const SPLASH_VIDEO_RATE   = 1;     // 1 = normal hız (eskiden 0.6 idi; video uzatıldığı için kaldırıldı)
    const SPLASH_END_HOLD_MS  = 300;   // video bitince son karede bekleme
    const SPLASH_SAFETY_PAD_MS = 4000; // 'ended' hiç gelmezse güvenlik süresi
    const FALLBACK_MS         = 6500;  // video hiç oynamazsa kullanılacak süre (müzik süresi)

    const labels = ['Sistem Başlatılıyor...', 'Uygulamalar Hazırlanıyor...', 'Son Ayarlar...', 'Hoş Geldiniz!'];

    let closed = false;
    let videoFailed = false;
    let progressTimer = null;
    let safetyTimer = null;

    // ── Progress bar + etiket ──
    let labelIdx = -1;
    function setProgress(pct) {
        pct = Math.max(0, Math.min(pct, 100));
        if (bar) bar.style.width = pct + '%';
        const idx = Math.min(Math.floor(pct / 33), labels.length - 1);
        if (idx !== labelIdx) {
            labelIdx = idx;
            if (label) label.textContent = labels[idx];
        }
    }

    // ── Splash'i kapat (tek sefer) ──
    function closeSplash() {
        if (closed) return;
        closed = true;
        if (progressTimer) clearInterval(progressTimer);
        if (safetyTimer) clearTimeout(safetyTimer);
        if (bar) bar.style.width = '100%';
        if (label) label.textContent = 'Hoş Geldiniz!';
        setTimeout(() => {
            if (splash) {
                splash.style.opacity = '0';
                setTimeout(() => {
                    splash.classList.add('hidden');
                }, 400);
            }
        }, 200);
    }

    // ── Video ana saat: ilerleme = currentTime / duration ──
    function startVideoProgress() {
        if (progressTimer) clearInterval(progressTimer);
        progressTimer = setInterval(() => {
            const d = splashVideo.duration;
            if (d && isFinite(d)) {
                setProgress(Math.min((splashVideo.currentTime / d) * 100, 99));
            }
        }, 80);

        // Güvenlik: video takılırsa/ended gelmezse splash sonsuza kadar kalmasın
        if (safetyTimer) clearTimeout(safetyTimer);
        const d = splashVideo.duration;
        if (d && isFinite(d)) {
            const totalMs = (d / SPLASH_VIDEO_RATE) * 1000;
            safetyTimer = setTimeout(closeSplash, totalMs + SPLASH_SAFETY_PAD_MS);
        }
    }

    // ── Video oynatılamazsa: süreye dayalı ilerleme ile devam et ──
    function startFallbackProgress(totalMs) {
        if (closed) return;
        if (progressTimer) clearInterval(progressTimer);
        if (safetyTimer) clearTimeout(safetyTimer);
        const startTime = Date.now();
        progressTimer = setInterval(() => {
            const elapsed = Date.now() - startTime;
            setProgress(Math.min((elapsed / totalMs) * 100, 99));
            if (elapsed >= totalMs) closeSplash();
        }, 80);
    }

    function onVideoFailed() {
        if (videoFailed) return;
        videoFailed = true;
        if (splashVideo) splashVideo.style.display = 'none';
        if (splashLogoFallback) splashLogoFallback.style.display = 'flex';
        startFallbackProgress(FALLBACK_MS);
    }

    // ── Güncelleme URL'si varsa (mgUpdateBtn sonrası) ziyaret bayrağı zaten sessionStorage.clear ile silindi
    // _v parametresi varsa bu güncelleme reload'u → splash göster, bayrağı sıfırla
    const isUpdateReload = location.search.indexOf('_v=') !== -1;
    if (isUpdateReload) {
        sessionStorage.removeItem('mugol-portal-visited');
    }

    // ── Geri tuşuyla mı gelindi? (performance.navigation veya sessionStorage flag)
    const isBackNav = (
        !isUpdateReload && (
            (performance && performance.navigation && performance.navigation.type === 2) ||
            sessionStorage.getItem('mugol-portal-visited') === '1'
        )
    );

    // ── Geri tuşuyla gelindiyse splash'i atla
    if (isBackNav && !isUpdateReload) {
        if (splashVideo) { try { splashVideo.pause(); } catch (e) {} }
        if (splash) splash.classList.add('hidden');
        sessionStorage.setItem('mugol-portal-visited', '1');
        return;
    }

    // İlk ziyareti kaydet — sonraki geri tuşlarında splash gösterilmez
    sessionStorage.setItem('mugol-portal-visited', '1');

    // ── VİDEO KURULUMU ──
    if (splashVideo) {
        splashVideo.playbackRate = SPLASH_VIDEO_RATE;
        splashVideo.addEventListener('loadedmetadata', function () {
            splashVideo.playbackRate = SPLASH_VIDEO_RATE;
            if (!videoFailed) startVideoProgress();
        });
        // Metadata script çalışmadan önce yüklendiyse olay kaçmış olabilir
        if (splashVideo.readyState >= 1 && !videoFailed) {
            splashVideo.playbackRate = SPLASH_VIDEO_RATE;
            startVideoProgress();
        }
        splashVideo.addEventListener('error', onVideoFailed);
        // Video bitince son karede kısa bekle, sonra splash'i kapat
        splashVideo.addEventListener('ended', function () {
            splashVideo.style.opacity = '0.85';
            setProgress(100);
            setTimeout(closeSplash, SPLASH_END_HOLD_MS);
        });
        // Autoplay engeli vb. → fallback
        var videoPlayPromise = splashVideo.play();
        if (videoPlayPromise !== undefined) {
            videoPlayPromise.catch(onVideoFailed);
        }
    } else {
        // Video elementi hiç yoksa
        onVideoFailed();
    }

    // ── Açılış müziği (ayardan kapalıysa sessiz) ──
    // Müzik yalnızca eşlik eder; splash'in süresini artık video belirler.
    const musicEnabled = localStorage.getItem('mugol-acilis-muzik') !== 'kapali';
    const splashAudio = new Audio('media/mugol_acilis.mp3');
    splashAudio.preload = 'auto';
    if (!musicEnabled) { splashAudio.volume = 0; }

    // Video çalışmıyorsa (fallback) süreyi müzik uzunluğundan al
    splashAudio.addEventListener('loadedmetadata', function () {
        if (videoFailed && !closed && isFinite(splashAudio.duration)) {
            startFallbackProgress(splashAudio.duration * 1000);
        }
    });

    const playPromise = splashAudio.play();
    if (playPromise !== undefined) {
        // Tarayıcı müziği engellerse sessiz devam et — video yine akışı yönetir
        playPromise.catch(function () {});
    }
})();

// DİĞER TÜM SCRIPT.JS FONKSİYONLARIN (Menü, Toast, PWA vb.) BURADA DEVAM ETMELİ...

// =========================================================
// 9. AŞAĞI ÇEKME YENİLE — DEVRE DIŞI

// =========================================================
// 10. BİLDİRİM SİSTEMİ
// =========================================================
const NOTIFICATIONS =[
    { id: 'n1', icon: '🚀', title: 'MuGöl PORTAL v1.0 Yayında!', body: 'Bildirim paneli ve yeni özellikler eklendi.', time: 'Az önce' },
    { id: 'n2', icon: '🔍', title: 'Hızlı Arama', body: 'Ctrl+K ile uygulamaları anında bulun.', time: '2 gün önce' }
];

let readNotifs = JSON.parse(localStorage.getItem('mugol-read-notifs') || '[]');

function renderNotifications() {
    const list = document.getElementById('notifList');
    const dot = document.getElementById('notifDot');
    if (!list) return;
    const unread = NOTIFICATIONS.filter(n => !readNotifs.includes(n.id));
    if (dot) dot.style.display = unread.length > 0 ? 'block' : 'none';
    list.innerHTML = NOTIFICATIONS.map(n => {
        const isRead = readNotifs.includes(n.id);
        return `<div onclick="markNotifRead('${n.id}')" style="padding:16px; border-bottom:1px solid var(--border-color); cursor:pointer; background:${isRead ? 'transparent' : 'rgba(67,24,255,0.03)'}; display:flex; gap:14px;">
            <div style="font-size:1.5rem;">${n.icon}</div>
            <div style="flex:1;">
                <div style="font-weight:900; color:var(--text-main);">${n.title}</div>
                <div style="font-size:0.9rem; color:var(--text-muted);">${n.body}</div>
            </div>
        </div>`;
    }).join('');
}

window.markNotifRead = function(id) {
    if (!readNotifs.includes(id)) {
        readNotifs.push(id);
        localStorage.setItem('mugol-read-notifs', JSON.stringify(readNotifs));
        _fbSetPref('readNotifs', readNotifs);
        renderNotifications();
    }
};

const notifBtn = document.getElementById('notifBtn');
const notifPanel = document.getElementById('notifPanel');
if (notifBtn) {
    notifBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = notifPanel.style.display !== 'none';
        notifPanel.style.display = isOpen ? 'none' : 'block';
        if (!isOpen) renderNotifications();
    });
}

// Tümünü okundu işaretle butonu
const notifMarkAll = document.getElementById('notifMarkAll');
if (notifMarkAll) {
    notifMarkAll.addEventListener('click', () => {
        readNotifs = NOTIFICATIONS.map(n => n.id);
        localStorage.setItem('mugol-read-notifs', JSON.stringify(readNotifs));
        _fbSetPref('readNotifs', readNotifs);
        renderNotifications();
    });
}

// Panel dışına tıklayınca kapat
document.addEventListener('click', (e) => {
    if (notifPanel && !notifPanel.contains(e.target) && e.target !== notifBtn) {
        notifPanel.style.display = 'none';
    }
});

// =========================================================
// 11. GLOBAL ARAMA (Ctrl+K)
// =========================================================
const searchModal = document.getElementById('searchModal');
const searchInput = document.getElementById('searchInput');
const searchIndex =[];

document.querySelectorAll('.app-card[href]').forEach(card => {
    searchIndex.push({
        name: card.querySelector('h3')?.textContent || '',
        img: card.querySelector('img')?.src || '',
        url: card.getAttribute('href')
    });
});

function openSearch() {
    if (searchModal) {
        searchModal.style.display = 'flex';
        searchInput.value = '';
        renderSearchResults('');
        setTimeout(() => searchInput.focus(), 100);
    }
}
window.closeSearch = () => { if(searchModal) searchModal.style.display = 'none'; };
if(document.getElementById('searchBtn')) document.getElementById('searchBtn').addEventListener('click', openSearch);

// FAB arama butonu da aynı modalı açsın
var mgFab = document.getElementById('mgFab');
if (mgFab) mgFab.addEventListener('click', openSearch);

function renderSearchResults(q) {
    var resultsEl = document.getElementById('searchResults');
    if (!resultsEl) return;
    var trimQ = (q || '').trim().toLowerCase();
    var list = trimQ
        ? searchIndex.filter(item => item.name.toLowerCase().indexOf(trimQ) !== -1)
        : searchIndex;
    if (list.length === 0) {
        resultsEl.innerHTML = '<div style="text-align:center;padding:30px;color:var(--text-muted);font-weight:700;">Sonuç bulunamadı.</div>';
        return;
    }
    resultsEl.innerHTML = list.map(item => `
        <div onclick="closeSearch();typeof openAppWithAd==='function'?openAppWithAd('${item.url}','${item.name.replace(/'/g,"\\'")}','${item.img}'):window.open('${item.url}','_blank','noopener,noreferrer')"
             style="display:flex;align-items:center;gap:14px;padding:12px 10px;border-radius:14px;cursor:pointer;transition:background .15s;"
             onmouseover="this.style.background='var(--bg-body)'" onmouseout="this.style.background='transparent'">
            ${item.img ? `<img src="${item.img}" alt="" style="width:36px;height:36px;border-radius:10px;object-fit:cover;border:1px solid var(--border-color);">` : `<div style="width:36px;height:36px;border-radius:10px;background:var(--bg-body);display:flex;align-items:center;justify-content:center;"><i class="fas fa-th-large" style="color:var(--primary-color);font-size:1rem;"></i></div>`}
            <span style="font-weight:800;color:var(--text-main);font-size:.95rem;">${item.name}</span>
            <i class="fas fa-arrow-right" style="margin-left:auto;color:var(--text-muted);font-size:.8rem;"></i>
        </div>`).join('');
}

if (searchInput) {
    searchInput.addEventListener('input', function() {
        renderSearchResults(this.value);
    });
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            var first = document.querySelector('#searchResults [onclick]');
            if (first) first.click();
        }
    });
}

document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
    if (e.key === 'Escape') closeSearch();
});

// =========================================================
// 12. RENK TEMASI VE AYARLAR
// =========================================================
const savedColor = localStorage.getItem('mugol-primary-color');
if (savedColor) document.documentElement.style.setProperty('--primary-color', savedColor);

// Kaydedilmiş rengi aktif swatch'a yansıt
(function() {
    var sc = localStorage.getItem('mugol-primary-color');
    if (sc) {
        document.querySelectorAll('.color-swatch').forEach(function(sw) {
            sw.classList.toggle('active', sw.getAttribute('data-color') === sc);
        });
    }
})();

document.querySelectorAll('.color-swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
        const color = swatch.getAttribute('data-color');
        document.documentElement.style.setProperty('--primary-color', color);
        localStorage.setItem('mugol-primary-color', color);
        _fbSetPref('color', color);
        // Aktif swatch'ı güncelle
        document.querySelectorAll('.color-swatch').forEach(sw => sw.classList.remove('active'));
        swatch.classList.add('active');
    });
});

// =========================================================
// 13. YUKARI KAYDIR VE DİL SİSTEMİ
// =========================================================
const scrollTopBtn = document.getElementById('scrollTopBtn');
if (mainContent && scrollTopBtn) {
    mainContent.addEventListener('scroll', () => { scrollTopBtn.classList.toggle('visible', mainContent.scrollTop > 300); });
    scrollTopBtn.addEventListener('click', () => { mainContent.scrollTo({ top: 0, behavior: 'smooth' }); });
}

const translations = {
    tr: { welcomeTitle: "Hoş Geldiniz! 👋", pullToRefresh: "Yenilemek için çekin" },
    en: { welcomeTitle: "Welcome! 👋", pullToRefresh: "Pull to refresh" }
};

function applyLanguage(lang) {
    const t = translations[lang];
    if (document.getElementById('welcomeTitle')) document.getElementById('welcomeTitle').textContent = t.welcomeTitle;
    // Dil butonlarını güncelle
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
    localStorage.setItem('mugol-lang', lang);
    _fbSetPref('lang', lang);
}

// Dil butonları click
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        applyLanguage(btn.getAttribute('data-lang'));
    });
});

const savedLang = localStorage.getItem('mugol-lang') || 'tr';
applyLanguage(savedLang);

// =========================================================
// 14. PWA YÜKLEME SİSTEMİ
// =========================================================
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); deferredPrompt = e;
    if (installAppBtn) installAppBtn.style.display = 'flex';
});

if (installAppBtn) {
    installAppBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        deferredPrompt = null;
        installAppBtn.style.display = 'none';
    });
}
// =========================================================
// PROFİL SAYFASI — KULLANICI BİLGİLERİ & ÇIKIŞ
// =========================================================

// --- Yardımcı: aktif kullanıcıyı döndür (kullanıcı sistemi yok) ---
function getActiveUser() { return ''; }

// --- Reklamsız kontrol (kullanıcıya bağlı değil, global) ---
function noadsKey()    { return 'mugol-noads'; }
function noadsKodKey() { return 'mugol-noads-kod'; }
function userHasNoads() {
    return localStorage.getItem('mugol-noads') === 'true';
}
function userNoadsKod() {
    return localStorage.getItem('mugol-noads-kod') || '';
}

// --- Yardımcı: Tarih formatla ---
function formatTarih(isoStr) {
    if (!isoStr) return '—';
    try {
        var d = new Date(isoStr);
        return d.toLocaleDateString('tr-TR', {day:'2-digit',month:'long',year:'numeric'});
    } catch(e) { return '—'; }
}

// --- Yardımcı: profil mesaj kutusu ---
function showProfilMsg(el, type, text) {
    if (!el) return;
    el.style.display = 'block';
    el.style.padding  = '10px 14px';
    el.style.borderRadius = '12px';
    el.style.fontWeight = '700';
    el.style.fontSize = '0.9rem';
    el.style.marginTop = '10px';
    if (type === 'success') {
        el.style.background = 'rgba(16,185,129,0.12)';
        el.style.border = '1px solid rgba(16,185,129,0.3)';
        el.style.color = '#10b981';
    } else {
        el.style.background = 'rgba(239,68,68,0.10)';
        el.style.border = '1px solid rgba(239,68,68,0.25)';
        el.style.color = '#ef4444';
    }
    el.textContent = text;
    clearTimeout(el._msgTimer);
    el._msgTimer = setTimeout(function() { el.style.display = 'none'; }, 3500);
}

// --- Profil UI'yı doldur (kullanıcı sistemi yok) ---
function refreshProfilUI() {
    var noads = userHasNoads('__global__');

    // Sidebar
    var sidebarPlan = document.getElementById('sidebarProfilePlan');
    if (sidebarPlan) {
        sidebarPlan.innerHTML = noads
            ? '<i class="fas fa-star" style="color:#f59e0b;font-size:0.65rem;"></i> Reklamsız Plan'
            : 'Sürüm 2.0.0';
        sidebarPlan.style.color = noads ? '#f59e0b' : '';
    }

    // Üyelik tipi
    var tipEl = document.getElementById('profilUyelikTipi');
    if (tipEl) {
        tipEl.innerHTML = noads
            ? 'Reklamsız Plan <span class="reklamlama-badge"><i class="fas fa-star"></i> Aktif</span>'
            : 'Ücretsiz Plan';
    }

    // Rozet
    var badgeEl = document.getElementById('profilBadge');
    if (badgeEl) {
        if (noads) {
            badgeEl.innerHTML = '<i class="fas fa-star"></i> Premium Üye';
            badgeEl.style.cssText = 'background:rgba(245,158,11,0.15);border:1px solid rgba(245,158,11,0.35);color:#d97706;';
        } else {
            badgeEl.innerHTML = '<i class="fas fa-user"></i> Kullanıcı';
            badgeEl.style.cssText = '';
        }
    }

    // Profil içeriğini her zaman göster (giriş daveti gizle)
    var girisPanel  = document.getElementById('profil-giris-daveti');
    var icerikPanel = document.getElementById('profil-icerik');
    if (girisPanel)  girisPanel.style.display = 'none';
    if (icerikPanel) icerikPanel.style.display = '';

    // Üyelik kodu input + iptal butonu
    var aktifKod = localStorage.getItem('mugol-noads-kod') || '';
    var koduInp  = document.getElementById('uyelikKoduInput');
    var kodIptalBtn = document.getElementById('uyelikKoduIptalBtn');
    if (koduInp) {
        if (aktifKod) {
            koduInp.value = aktifKod;
            koduInp.disabled = true;
            koduInp.style.opacity = '0.6';
        } else {
            koduInp.value = '';
            koduInp.disabled = false;
            koduInp.style.opacity = '1';
        }
    }
    if (kodIptalBtn) {
        kodIptalBtn.style.display = aktifKod ? 'inline-flex' : 'none';
    }
}

// --- Çıkış yap (kullanıcı sistemi yok — ana sayfaya döner) ---
window.profilLogout = function() {
    var homeNav = document.querySelector('.nav-item[data-target="page-anasayfa"]');
    if (homeNav) homeNav.click();
};

// --- Üyelik kodunu iptal et ---
window.uyelikKoduIptal = function() {
    localStorage.removeItem('mugol-noads');
    localStorage.removeItem('mugol-noads-kod');
    refreshProfilUI();
    var msg = document.getElementById('uyelikKoduMsg');
    if (msg) {
        msg.style.cssText = 'display:block;padding:10px 14px;border-radius:12px;font-weight:700;font-size:0.9rem;margin-top:10px;background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.3);color:#10b981;';
        msg.textContent = '✅ Üyelik kodu kaldırıldı.';
        setTimeout(function(){ msg.style.display = 'none'; }, 3000);
    }
};

// --- Profil sayfası açıldığında güncelle ---
function _bindProfilNav() {
    var _profilNavItem = document.querySelector('.nav-item[data-target="page-profil"]');
    if (_profilNavItem) _profilNavItem.addEventListener('click', refreshProfilUI);
    refreshProfilUI();
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _bindProfilNav);
} else {
    _bindProfilNav();
}

// =========================================================
// ÜYELİK KODU & REKLAMSIZ SİSTEM
// =========================================================

var _NOADS_KODLAR = [
    'MG-X9K2-NOAD','MUGOL-7T4W-VIP','PORTAL-R3M-FREE',
    'MG2025-ZSQP','NOAD-MUGOL-88','PREMIUM-MG-KOD','GOLPINAR-NOAD',
];

function reklamlariGizle() {
    // Reklamlar kaldırıldı
}
if (userHasNoads()) reklamlariGizle();

window.uyelikKoduKontrol = function() {
    var inp = document.getElementById('uyelikKoduInput');
    var msg = document.getElementById('uyelikKoduMsg');
    if (!inp || !msg) return;
    function goster(tip, yazi) {
        msg.style.cssText = 'display:block;padding:10px 14px;border-radius:12px;font-weight:700;font-size:0.9rem;margin-top:10px;' +
            (tip === 'success'
                ? 'background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.3);color:#10b981;'
                : 'background:rgba(239,68,68,0.10);border:1px solid rgba(239,68,68,0.25);color:#ef4444;');
        msg.textContent = yazi;
    }
    if (userHasNoads()) { goster('success','✅ Kod zaten aktif! Reklamlar kapalı.'); return; }
    var girilen = inp.value.trim().toUpperCase();
    if (!girilen) { goster('error','⚠️ Lütfen bir kod girin.'); return; }
    if (_NOADS_KODLAR.indexOf(girilen) !== -1) {
        localStorage.setItem('mugol-noads', 'true');
        localStorage.setItem('mugol-noads-kod', girilen);
        reklamlariGizle();
        refreshProfilUI();
        inp.disabled = true; inp.style.opacity = '0.6';
        goster('success','🎉 Tebrikler! Kod aktive edildi. Artık reklamsız deneyim yaşıyorsunuz!');
    } else {
        goster('error','❌ Geçersiz kod. Lütfen doğru kodu girin.');
        inp.value = ''; inp.focus();
    }
};

document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && document.activeElement && document.activeElement.id === 'uyelikKoduInput') {
        window.uyelikKoduKontrol();
    }
});

// =========================================================
// EKSİK GLOBAL FONKSİYONLAR — onclick="..." çağrıları için
// =========================================================

// Adblock uyarı overlay'ini kapat
window.closeAdblockWarning = function() {
    // Adblock overlay kaldırıldı
};

// =========================================================
// GEÇİŞ REKLAM MODALI — AdSense (ca-pub-1880946354382681/2331344971)
// Tüm uygulama geçişlerinde gösterilir. noads aktifse atlanır.
// =========================================================
(function() {
    'use strict';

    var AD_CLIENT  = 'ca-pub-1880946354382681';
    var AD_SLOT    = '2331344971';
    var AD_DELAY   = 5;   // reklamın gösterim süresi (saniye)
    var _adTimer   = null;
    var _adInterval= null;

    /* --- Modal HTML'i oluştur ve body'e ekle --- */
    function _buildAdModal() {
        if (document.getElementById('mg-interstitial-overlay')) return;

        var overlay = document.createElement('div');
        overlay.id = 'mg-interstitial-overlay';
        overlay.style.cssText = [
            'display:none;position:fixed;inset:0;z-index:99999;',
            'background:rgba(0,0,0,0.82);backdrop-filter:blur(6px);',
            '-webkit-backdrop-filter:blur(6px);',
            'align-items:center;justify-content:center;'
        ].join('');

        overlay.innerHTML = [
            '<div id="mg-interstitial-box" style="',
            'background:var(--bg-card,#fff);border-radius:24px;',
            'width:min(92vw,420px);padding:0;overflow:hidden;',
            'box-shadow:0 32px 80px rgba(0,0,0,0.45);',
            'display:flex;flex-direction:column;',
            'animation:mgAdFadeIn .35s cubic-bezier(.25,.8,.25,1) both;">',

            /* Başlık */
            '<div style="',
            'background:linear-gradient(135deg,#4318ff,#6366f1);',
            'padding:14px 20px;display:flex;align-items:center;gap:10px;">',
            /* ← Geri butonu */
            '<button onclick="window.mgCloseInterstitial()" style="',
            'background:rgba(255,255,255,.18);border:none;border-radius:50%;',
            'width:32px;height:32px;display:flex;align-items:center;justify-content:center;',
            'color:#fff;font-size:1.1rem;cursor:pointer;flex-shrink:0;padding:0;',
            'font-family:inherit;line-height:1;" aria-label="Geri">&#8592;</button>',
            '<span id="mg-ad-logo" style="font-size:1.6rem;"></span>',
            '<div style="flex:1;">',
            '<div style="color:#fff;font-weight:900;font-size:1rem;line-height:1.2;" id="mg-ad-appname">Uygulama Açılıyor</div>',
            '<div style="color:rgba(255,255,255,.7);font-size:.78rem;margin-top:2px;">Lütfen reklamı izleyin</div>',
            '</div>',
            '<div id="mg-ad-skip-wrap" style="',
            'background:rgba(255,255,255,.18);border-radius:50px;',
            'padding:6px 14px;color:#fff;font-weight:800;font-size:.85rem;',
            'cursor:default;white-space:nowrap;user-select:none;" id="mg-ad-timer-badge">',
            '<span id="mg-ad-sec">' + AD_DELAY + '</span>s</div>',
            '</div>',

            /* Reklam alanı */
            '<div style="padding:16px;background:var(--bg-body,#f3f5f9);">',
            '<ins class="adsbygoogle mg-interstitial-ins"',
            ' style="display:block;width:100%;min-height:250px;"',
            ' data-ad-client="' + AD_CLIENT + '"',
            ' data-ad-slot="' + AD_SLOT + '"',
            ' data-ad-format="auto"',
            ' data-full-width-responsive="true"></ins>',
            '</div>',

            /* Alt bölüm */
            '<div style="padding:14px 20px;display:flex;align-items:center;justify-content:space-between;gap:10px;">',
            '<span style="font-size:.75rem;color:var(--text-muted,#64748b);">Reklam · MuGöl PORTAL</span>',
            '<button id="mg-ad-skip-btn" disabled style="',
            'padding:9px 22px;border-radius:50px;border:none;',
            'background:linear-gradient(135deg,#4318ff,#6366f1);',
            'color:#fff;font-weight:800;font-size:.88rem;cursor:not-allowed;',
            'font-family:inherit;opacity:.45;transition:all .25s;" ',
            'onclick="window.mgSkipInterstitial()">Geç →</button>',
            '</div>',

            '</div>',

            '<style>',
            '@keyframes mgAdFadeIn{from{opacity:0;transform:scale(.93) translateY(20px)}to{opacity:1;transform:none}}',
            '</style>'
        ].join('');

        document.body.appendChild(overlay);
    }

    /* --- Reklamı yükle (push) --- */
    function _pushAd() {
        try {
            var ins = document.querySelector('.mg-interstitial-ins');
            if (ins && !ins.dataset.adsbygoogleStatus) {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            }
        } catch(e) {}
    }

    /* --- Modalı göster --- */
    function _showInterstitial(url, appName, logoSrc) {
        _buildAdModal();

        /* Başlık bilgilerini doldur */
        var nameEl = document.getElementById('mg-ad-appname');
        var logoEl = document.getElementById('mg-ad-logo');
        if (nameEl) nameEl.textContent = appName || 'Uygulama';
        if (logoEl) logoEl.textContent = logoSrc ? '' : '🚀';

        /* Logo resimse göster */
        if (logoSrc && logoEl) {
            logoEl.innerHTML = '<img src="' + logoSrc + '" style="width:32px;height:32px;border-radius:8px;object-fit:cover;" onerror="this.parentNode.textContent=\'🚀\'">';
        }

        /* Geç butonunu sıfırla */
        var skipBtn = document.getElementById('mg-ad-skip-btn');
        var secEl   = document.getElementById('mg-ad-sec');
        if (skipBtn) { skipBtn.disabled = true; skipBtn.style.opacity = '.45'; skipBtn.style.cursor = 'not-allowed'; }
        if (secEl)   secEl.textContent = AD_DELAY;

        /* Bekleyen URL'yi kaydet */
        window._mgAdPendingUrl = url;

        /* Modalı göster */
        var overlay = document.getElementById('mg-interstitial-overlay');
        if (overlay) { overlay.style.display = 'flex'; }

        /* AdSense reklamını yükle */
        _pushAd();

        /* Geri sayım — otomatik geçmez, sadece "Geç" aktif olur */
        _startCountdown();

        /* Android geri tuşu: modalı kapat, URL'ye gitme */
        history.pushState({ mgAd: true }, '');
        window._mgBackHandler = function(e) {
            var overlay = document.getElementById('mg-interstitial-overlay');
            if (overlay && overlay.style.display !== 'none') {
                window.mgCloseInterstitial();
            }
        };
        window.addEventListener('popstate', window._mgBackHandler);
    }

    /* --- Modalı kapat ve uygulamayı aç --- */
    window.mgSkipInterstitial = function() {
        if (_adInterval) clearInterval(_adInterval);
        if (_adTimer)    clearTimeout(_adTimer);

        /* Geri tuşu listener'ını temizle */
        if (window._mgBackHandler) {
            window.removeEventListener('popstate', window._mgBackHandler);
            window._mgBackHandler = null;
        }

        var overlay = document.getElementById('mg-interstitial-overlay');
        if (overlay) overlay.style.display = 'none';

        var url = window._mgAdPendingUrl;
        window._mgAdPendingUrl = null;
        if (url) _mgOpenUrlDirect(url);
    };

    /* --- Modalı kapat, URL'ye gitme (geri tuşu) --- */
    window.mgCloseInterstitial = function() {
        if (_adInterval) clearInterval(_adInterval);
        if (_adTimer)    clearTimeout(_adTimer);

        if (window._mgBackHandler) {
            window.removeEventListener('popstate', window._mgBackHandler);
            window._mgBackHandler = null;
        }

        var overlay = document.getElementById('mg-interstitial-overlay');
        if (overlay) overlay.style.display = 'none';
        window._mgAdPendingUrl = null;
    };

    /* --- Yardımcı: URL'yi aç — TWA/WebView'da aynı pencerede, tarayıcıda yeni sekme --- */
    function _mgOpenUrlDirect(url) {
        if (!url) return;
        /* TWA / Capacitor: location.href ile aynı WebView'da aç (popup engeli yok) */
        var isApp = window.matchMedia('(display-mode: standalone)').matches
                 || window.matchMedia('(display-mode: fullscreen)').matches
                 || (typeof Capacitor !== 'undefined')
                 || (document.referrer || '').indexOf('android-app://') === 0;
        if (isApp) {
            window.location.href = url;
        } else {
            /* Normal web tarayıcısı: yeni sekme */
            var _a = document.createElement('a');
            _a.href = url;
            _a.target = '_blank';
            _a.rel = 'noopener noreferrer';
            _a.style.cssText = 'position:fixed;width:0;height:0;opacity:0;pointer-events:none;left:-9999px;';
            document.body.appendChild(_a);
            _a.click();
            setTimeout(function() { if (_a.parentNode) _a.parentNode.removeChild(_a); }, 500);
        }
    }

    /* ─── Geri sayım: süre bitince sadece "Geç" aktif olur, otomatik geçmez ─── */
    function _startCountdown(onDone) {
        var secEl  = document.getElementById('mg-ad-sec');
        var skipBtn= document.getElementById('mg-ad-skip-btn');
        var left   = AD_DELAY;

        if (_adInterval) clearInterval(_adInterval);
        if (_adTimer)    clearTimeout(_adTimer);

        _adInterval = setInterval(function() {
            left--;
            if (secEl) secEl.textContent = left;
            if (left <= 0) {
                clearInterval(_adInterval);
                /* Süre doldu → sadece "Geç" butonunu aktif et, otomatik geçme */
                if (skipBtn) {
                    skipBtn.disabled = false;
                    skipBtn.style.cursor  = 'pointer';
                    skipBtn.style.opacity = '1';
                }
                var badge = document.getElementById('mg-ad-skip-wrap');
                if (badge) badge.textContent = '✓ Geçebilirsiniz';
            }
        }, 1000);
        /* _adTimer intentionally NOT set — kullanıcı "Geç" e basana kadar bekle */
    }

    /* ─── TWA / Uygulama mı, Web tarayıcı mı? ─── */
    function _isInTWA() {
        return window.matchMedia('(display-mode: standalone)').matches
            || window.matchMedia('(display-mode: fullscreen)').matches
            || (typeof Capacitor !== 'undefined')
            || (document.referrer || '').indexOf('android-app://') === 0;
    }

    /* ─── Ana geçiş fonksiyonu ─────────────────────────────── */
    /* TWA'da AdMob kendi halleder → direkt geç                */
    /* Web tarayıcıda → 5sn AdSense modalı göster             */
    function _mgOpenUrl(url, appName, logoSrc) {
        if (!url) return;
        /* Geçiş reklamı devre dışı — direkt geç */
        _mgOpenUrlDirect(url);
    }

    /* Global olarak yayınla */
    window._mgOpenUrl = _mgOpenUrl;

    /* --- Eski skipAd / startAdCountdown uyumluluğu --- */
    window.skipAd = function() { window.mgSkipInterstitial(); };
    window.startAdCountdown = function(url, appName, logoSrc) { _mgOpenUrl(url, appName, logoSrc); };
    window.openAppWithAd    = function(url, appName, logoSrc) { _mgOpenUrl(url, appName, logoSrc); };

})();


// =========================================================
// 15. MuGöl GAMES ENTEGRASYONU
//     MuGöl PORTAL içinde MuGöl GAMES oyunlarını gösterir.
//     Oyunlar yeni sekmede https://mugol-portal.github.io/Mugol.games/
//     adresinde açılır. Veri bu dosyada tanımlıdır — harici
//     bir dosyaya bağımlılık yoktur.
// =========================================================
(function () {
    'use strict';

    // -----------------------------------------------------------
    // OYUN VERİTABANI
    // Yeni oyun eklemek için sadece bu diziye satır ekleyin.
    // url: MuGöl GAMES'teki dosya adı (tam URL aşağıda üretilir)
    // -----------------------------------------------------------
    var GAMES_BASE_URL = 'https://mugol-portal.github.io/Mugol.games/';

    var MUGOL_GAMES = [
        { id: 'ok_labirenti',  title: 'Ok Labirenti',      catId: 'puzzle',     catName: 'Zeka',       desc: 'Okları takip ederek doğru çıkışı bul!',                  icon: '🏹', url: 'ok_labirenti.html',     color1: '#6c63ff', color2: '#22d3ae', badge: 'YENİ'    },
        { id: 'tas_kirma',     title: '3D Stack Ball',      catId: 'action',     catName: 'Aksiyon',    desc: 'Ekrana basılı tut, kuleyi yık, öfke modunu aç!',         icon: '💥', url: 'tas-kirma.html',        color1: '#ff0844', color2: '#ffb199', badge: 'YENİ'    },
        { id: 'hokey',         title: 'Neon Masa Hokeyi',   catId: 'action',     catName: 'Aksiyon',    desc: 'Neon ışıklar altında yapay zekaya karşı kapış!',         icon: '🏒', url: 'masa-hokeyi.html',       color1: '#d900ff', color2: '#00ffff', badge: 'POPÜLER' },
        { id: 'kelime_puz',    title: 'Kelime Puzzle',      catId: 'puzzle',     catName: 'Bulmaca',    desc: 'Kozmik uzayda kelimeleri bul, zekanı test et!',          icon: '🔠', url: 'kelime_puzzle.html',    color1: '#6366f1', color2: '#8b5cf6'                  },
        { id: '2048',          title: '2048 Pro',            catId: 'puzzle',     catName: 'Zeka',       desc: 'Sayıları birleştir, 2048\'e ulaş!',                      icon: '🔢', url: '2048.html',             color1: '#f59e0b', color2: '#fbbf24'                  },
        { id: 'enerji',        title: 'Enerji Tüpleri',     catId: 'strategy',   catName: 'Strateji',   desc: 'Tüpleri bağla, enerjiyi akıt!',                          icon: '⚡', url: 'enerji-toplari.html',   color1: '#eab308', color2: '#fde047'                  },
        { id: 'kuantum',       title: 'Kuantum Kalkanı',    catId: 'action',     catName: 'Aksiyon',    desc: 'Kalkanını yönet, düşmanları savuş!',                     icon: '🛡️', url: 'kuantum-kalkani.html',  color1: '#06b6d4', color2: '#67e8f9'                  },
        { id: 'word_master',   title: 'Word Master',         catId: 'puzzle',     catName: 'Eğitim',     desc: 'Gizli kelimeleri bul, siber dünyanın hakimi ol!',        icon: 'W',  url: 'word-master.html',      color1: '#7c3aed', color2: '#c084fc', isText: true    },
        { id: 'ucak',          title: 'Uçak Simülasyonu',   catId: 'simulation', catName: 'Simülasyon', desc: '3D kokpite geç, gökyüzünü fethet!',                      icon: '✈️', url: 'ucak-simulasyonu.html', color1: '#0284c7', color2: '#38bdf8'                  },
        { id: 'block',         title: 'Block Legend',        catId: 'puzzle',     catName: 'Bulmaca',    desc: 'Blokları yerleştir, kombolar yap!',                      icon: '🧩', url: 'block-puzzle.html',     color1: '#d946ef', color2: '#f472b6'                  },
        { id: 'ninja',         title: 'Fruit Ninja',         catId: 'action',     catName: 'Aksiyon',    desc: 'Bıçaklarını bile, meyveleri kes.',                       icon: '🍉', url: 'fruit-ninja.html',      color1: '#ef4444', color2: '#fca5a5'                  },
        { id: 'flappy',        title: 'Flappy Bird',         catId: 'action',     catName: 'Beceri',     desc: 'Boruların arasından geç ve rekoru kır.',                 icon: '🐦', url: 'flappy-bird.html',      color1: '#f59e0b', color2: '#fcd34d'                  },
        { id: 'space',         title: 'Space Shooter',       catId: 'action',     catName: 'Uzay',       desc: 'Galaksiyi düşman istilasından kurtar!',                  icon: '🚀', url: 'space-shooter.html',    color1: '#3b82f6', color2: '#93c5fd'                  },
        { id: 'stack',         title: 'Stack Tower',         catId: 'puzzle',     catName: 'Zeka',       desc: 'Blokları üst üste diz, kule inşa et.',                   icon: '🏗️', url: 'stack-tower.html',      color1: '#10b981', color2: '#6ee7b7'                  },
        { id: 'bubble',        title: 'Bubble Shooter',      catId: 'puzzle',     catName: 'Bulmaca',    desc: 'Aynı renk topları eşleştir ve patlat.',                  icon: '🔮', url: 'bubble.html',           color1: '#8b5cf6', color2: '#c4b5fd'                  },
        { id: 'memory',        title: 'Hafıza Kartları',     catId: 'puzzle',     catName: 'Zeka',       desc: 'Kartları eşleştir, hafızanı zorla.',                     icon: '🃏', url: 'kart-eslestirme.html',  color1: '#14b8a6', color2: '#5eead4'                  },
        { id: 'snake',         title: 'Yılan Oyunu',         catId: 'action',     catName: 'Klasik',     desc: 'Klasik efsane! Yemi ye, uza.',                           icon: '🐍', url: 'yilan-oyunu.html',      color1: '#22c55e', color2: '#86efac'                  },
        { id: 'race',          title: 'Araba Yarışı',        catId: 'action',     catName: 'Yarış',      desc: 'Trafikte makas at, rekor kır.',                          icon: '🏎️', url: 'araba.html',            color1: '#ef4444', color2: '#f87171'                  },
        { id: 'kelime_ust',    title: 'Kelime Üstadı',       catId: 'puzzle',     catName: 'Kelime',     desc: 'Harfleri birleştir, kelime türet.',                      icon: '🔡', url: 'kelime-ustadi.html',    color1: '#f97316', color2: '#fdba74'                  },
        { id: 'dama',          title: 'Dama Oyunu',          catId: 'strategy',   catName: 'Strateji',   desc: 'Türk daması kurallarıyla rakibini alt et.',              icon: '⚫', url: 'turk-damasi.html',      color1: '#64748b', color2: '#cbd5e1'                  },
        { id: 'kizma',         title: 'Kızma Birader',       catId: 'strategy',   catName: 'Klasik',     desc: 'Zarlarını at, piyonlarını eve ulaştır.',                 icon: '🎲', url: 'kizma-birader.html',    color1: '#eab308', color2: '#fde047'                  },
        { id: 'mugolyoner',    title: 'MuGölyoner',          catId: 'puzzle',     catName: 'Bilgi',      desc: 'Kim Milyoner Olmak İster tarzı bilgi yarışması!',        icon: '💰', url: 'mugolyoner.html',       color1: '#ffaa00', color2: '#00d4ff', badge: 'YENİ'    },
        { id: 'adam_asmaca',   title: 'Adam Asmaca',         catId: 'puzzle',     catName: 'Kelime',     desc: 'Harfleri tahmin et, adamı kurtar!',                      icon: '🪢', url: 'adam-asmaca.html',      color1: '#1e293b', color2: '#38bdf8', badge: 'YENİ'    }
    ];

    var MUGOL_GAMES_CATS = {
        'action':     { name: 'Aksiyon',        icon: '⚡', color: '#ef4444' },
        'puzzle':     { name: 'Zeka & Bulmaca', icon: '🧠', color: '#a855f7' },
        'strategy':   { name: 'Strateji',       icon: '♟️', color: '#eab308' },
        'simulation': { name: 'Simülasyon',     icon: '✈️', color: '#0ea5e9' }
    };

    // -----------------------------------------------------------
    // CSS — bir kere DOM'a eklenir
    // -----------------------------------------------------------
    function _injectStyles() {
        if (document.getElementById('mugol-games-styles')) return;
        var style = document.createElement('style');
        style.id = 'mugol-games-styles';
        style.textContent = [
            '.mg-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:14px;}',
            '.mg-card{background:var(--bg-card,rgba(24,24,27,.65));border-radius:18px;overflow:hidden;',
            'cursor:pointer;border:1px solid rgba(255,255,255,.06);transition:transform .3s,box-shadow .3s;',
            'position:relative;-webkit-tap-highlight-color:transparent;}',
            '.mg-card:hover{transform:translateY(-6px);box-shadow:0 14px 30px rgba(0,0,0,.4);}',
            '.mg-card:active{transform:translateY(-2px) scale(.97);}',
            '.mg-thumb{height:90px;display:flex;align-items:center;justify-content:center;}',
            '.mg-info{padding:10px 10px 12px;}',
            '.mg-title{font-size:.88rem;font-weight:700;color:var(--text-main,#f8fafc);',
            'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:3px;}',
            '.mg-cat{font-size:.72rem;font-weight:600;text-transform:uppercase;letter-spacing:.4px;}',
            '.mg-badge{position:absolute;top:8px;left:8px;background:#f43f5e;color:#fff;',
            'font-size:.6rem;font-weight:800;padding:3px 8px;border-radius:8px;letter-spacing:.8px;}',
            '.mg-filter-wrap{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;}',
            '.mg-cat-btn{background:rgba(255,255,255,.04);color:var(--text-sub,#94a3b8);',
            'border:1px solid rgba(255,255,255,.07);padding:7px 14px;border-radius:20px;',
            'font-size:.82rem;font-weight:600;cursor:pointer;transition:all .25s;white-space:nowrap;',
            'font-family:inherit;}',
            '.mg-cat-btn:hover{background:rgba(255,255,255,.1);color:var(--text-main,#f8fafc);}',
            '.mg-cat-btn.active{background:var(--primary,#3b82f6);border-color:var(--primary,#3b82f6);color:#fff;}',
            '.mg-search{width:100%;padding:12px 16px 12px 44px;border-radius:16px;',
            'border:1px solid rgba(255,255,255,.08);background:rgba(0,0,0,.35);color:var(--text-main,#f8fafc);',
            'font-size:.95rem;box-sizing:border-box;outline:none;font-family:inherit;margin-bottom:14px;}',
            '.mg-search:focus{border-color:rgba(59,130,246,.6);}',
            '.mg-search-wrap{position:relative;}',
            '.mg-search-wrap i{position:absolute;left:16px;top:50%;transform:translateY(-50%);',
            'color:var(--text-sub,#94a3b8);pointer-events:none;}',
            '.mg-header-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;}',
            '.mg-section-title{font-size:1.1rem;font-weight:800;color:var(--text-main,#f8fafc);',
            'display:flex;align-items:center;gap:10px;}',
            '.mg-section-title::before{content:"";display:block;width:4px;height:20px;',
            'background:var(--primary,#3b82f6);border-radius:4px;}',
            '.mg-count{font-size:.85rem;color:var(--text-sub,#94a3b8);}',
            '.mg-empty{grid-column:1/-1;text-align:center;padding:40px 20px;color:var(--text-sub,#94a3b8);}',
            '.mg-open-btn{display:inline-flex;align-items:center;gap:8px;margin-top:20px;',
            'background:var(--primary,#3b82f6);color:#fff;border:none;padding:12px 24px;',
            'border-radius:30px;font-weight:700;font-size:.9rem;cursor:pointer;font-family:inherit;',
            'transition:all .25s;text-decoration:none;}',
            '.mg-open-btn:hover{opacity:.85;transform:translateY(-2px);}',
            '.mg-banner{background:linear-gradient(135deg,rgba(59,130,246,.12),rgba(138,43,226,.08));',
            'border:1px solid rgba(255,255,255,.08);border-radius:20px;padding:20px;margin-bottom:24px;',
            'display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;}',
            '.mg-banner-text h3{font-size:1rem;font-weight:800;color:var(--text-main,#f8fafc);margin-bottom:4px;}',
            '.mg-banner-text p{font-size:.83rem;color:var(--text-sub,#94a3b8);}'
        ].join('');
        document.head.appendChild(style);
    }

    // -----------------------------------------------------------
    // KAT FİLTRE BUTONLARI
    // -----------------------------------------------------------
    function _buildFilters(containerId, activeCat) {
        var wrap = document.getElementById(containerId);
        if (!wrap) return;
        var html = '<button class="mg-cat-btn' + (activeCat === 'all' ? ' active' : '') +
                   '" onclick="_mgFilter(this,\'all\')">Tümü (' + MUGOL_GAMES.length + ')</button>';
        Object.keys(MUGOL_GAMES_CATS).forEach(function (id) {
            var cat = MUGOL_GAMES_CATS[id];
            var cnt = MUGOL_GAMES.filter(function (g) { return g.catId === id; }).length;
            html += '<button class="mg-cat-btn' + (activeCat === id ? ' active' : '') +
                    '" onclick="_mgFilter(this,\'' + id + '\')">' +
                    cat.icon + ' ' + cat.name + ' (' + cnt + ')</button>';
        });
        wrap.innerHTML = html;
    }

    // -----------------------------------------------------------
    // OYUN KARTLARI
    // -----------------------------------------------------------
    function _buildCard(game) {
        var fullUrl  = GAMES_BASE_URL + game.url;
        var iconSt   = game.isText
            ? 'font-family:"Outfit",sans-serif;font-weight:900;font-size:2rem;color:#fff;'
            : 'font-size:2.2rem;';
        var badgeHTML = game.badge ? '<div class="mg-badge">' + game.badge + '</div>' : '';
        // Portal'da openAppWithAd varsa onu kullan, yoksa yeni sekme
        var clickHandler = 'typeof openAppWithAd==="function"?' +
            'openAppWithAd(\'' + fullUrl + '\',\'' + game.title.replace(/'/g, "\\'") + '\',\'\')' +
            ':window.open(\'' + fullUrl + '\',\'_blank\',\'noopener,noreferrer\')';
        return '<div class="mg-card" onclick="' + clickHandler + '" title="' + game.desc.replace(/"/g, '&quot;') + '">' +
                    badgeHTML +
                    '<div class="mg-thumb" style="background:linear-gradient(135deg,' + game.color1 + ',' + game.color2 + ');">' +
                        '<span style="' + iconSt + '">' + game.icon + '</span>' +
                    '</div>' +
                    '<div class="mg-info">' +
                        '<div class="mg-title">' + game.title + '</div>' +
                        '<div class="mg-cat" style="color:' + game.color2 + '">' + game.catName + '</div>' +
                    '</div>' +
               '</div>';
    }

    // -----------------------------------------------------------
    // GRID RENDER
    // -----------------------------------------------------------
    function _render(gridId, countId, searchQ, catFilter) {
        var grid = document.getElementById(gridId);
        if (!grid) return;
        var list = MUGOL_GAMES;
        if (catFilter && catFilter !== 'all') {
            list = list.filter(function (g) { return g.catId === catFilter; });
        }
        if (searchQ) {
            var q = searchQ.toLowerCase();
            list = list.filter(function (g) {
                return g.title.toLowerCase().indexOf(q) !== -1 ||
                       g.catName.toLowerCase().indexOf(q) !== -1;
            });
        }
        var countEl = document.getElementById(countId);
        if (countEl) countEl.textContent = list.length + ' Oyun';
        if (list.length === 0) {
            grid.innerHTML = '<div class="mg-empty"><i class="fa-regular fa-face-frown" style="font-size:2rem;opacity:.4;display:block;margin-bottom:10px;"></i>Oyun bulunamadı.</div>';
            return;
        }
        grid.innerHTML = list.map(_buildCard).join('');
    }

    // -----------------------------------------------------------
    // GLOBAL CALLBACK'LER (onclick'ten çağrılır)
    // -----------------------------------------------------------
    window._mgFilter = function (btn, catId) {
        // Hangi panel içindeyiz bul
        var wrap = btn.closest ? btn.closest('.mg-filter-wrap') : btn.parentNode;
        if (wrap) {
            wrap.querySelectorAll('.mg-cat-btn').forEach(function (b) { b.classList.remove('active'); });
        }
        btn.classList.add('active');
        // Aynı konteynerin data-gridid'ini oku
        var panel = wrap ? (wrap.closest ? wrap.closest('[data-mg-panel]') : null) : null;
        var gridId  = panel ? panel.getAttribute('data-mg-grid')  : 'mgGamesGrid';
        var countId = panel ? panel.getAttribute('data-mg-count') : 'mgGamesCount';
        var searchId = panel ? panel.getAttribute('data-mg-search') : 'mgGamesSearch';
        var sq = document.getElementById(searchId);
        _render(gridId, countId, sq ? sq.value.trim() : '', catId);
    };

    // -----------------------------------------------------------
    // PANEL BAŞLATICI — id="page-oyunlar" veya data-mg-panel
    // -----------------------------------------------------------
    function _initPanel(panel) {
        _injectStyles();
        var gridId   = panel.getAttribute('data-mg-grid')   || 'mgGamesGrid';
        var countId  = panel.getAttribute('data-mg-count')  || 'mgGamesCount';
        var filterId = panel.getAttribute('data-mg-filter') || 'mgGamesFilter';
        var searchId = panel.getAttribute('data-mg-search') || 'mgGamesSearch';

        // Filtreler
        _buildFilters(filterId, 'all');

        // İlk render
        _render(gridId, countId, '', 'all');

        // Arama bağlantısı
        var inp = document.getElementById(searchId);
        if (inp && !inp._mgBound) {
            inp._mgBound = true;
            inp.addEventListener('input', function () {
                var activeCat = 'all';
                var fw = document.getElementById(filterId);
                if (fw) {
                    var ab = fw.querySelector('.mg-cat-btn.active');
                    if (ab) activeCat = ab.getAttribute('onclick').match(/'([^']+)'\)$/)[1];
                }
                _render(gridId, countId, this.value.trim(), activeCat);
            });
        }
    }

    // -----------------------------------------------------------
    // NAV CLICK İZLEYİCİ — "page-oyunlar" sekmesi açılınca çalışır
    // -----------------------------------------------------------
    function _watchNav() {
        document.querySelectorAll('.nav-item[data-target]').forEach(function (item) {
            item.addEventListener('click', function () {
                var targetId = item.getAttribute('data-target');
                setTimeout(function () {
                    var page = document.getElementById(targetId);
                    if (page && (page.hasAttribute('data-mg-panel') || targetId === 'page-oyunlar')) {
                        if (!page._mgInited) {
                            page._mgInited = true;
                            _initPanel(page);
                        }
                    }
                }, 60);
            });
        });
    }

    // -----------------------------------------------------------
    // BAŞLANGIÇ
    // -----------------------------------------------------------
    function _boot() {
        _watchNav();
        // Sayfa yüklendiğinde "page-oyunlar" zaten aktifse hemen başlat
        var activePage = document.querySelector('.page-section.active[id="page-oyunlar"], [data-mg-panel].page-section.active');
        if (activePage && !activePage._mgInited) {
            activePage._mgInited = true;
            _initPanel(activePage);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', _boot);
    } else {
        _boot();
    }

})();


// ════════════════════════════════════════════════════════════
// BİLDİRİMLER (eski notifications.js) — bildirim eklemek için aşağıdaki liste
// ════════════════════════════════════════════════════════════
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
        body: 'Ayarlar\'daki "Güncelleme Yap" butonu ile önbelleği temizleyip en son sürümü alabilirsiniz.',
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


// ════════════════════════════════════════════════════════════
// GÖRÜNÜM MODLARI — Mobil / Tablet / Masaüstü (eski mg-modes.js)
// ════════════════════════════════════════════════════════════
/* MuGöl — Görünüm modu (mobil / tablet / masaüstü)
   Tarayıcıdan ilk girişte "Mobil mi, Tarayıcı mı?" diye sorar (seçim hatırlanır). */
(function () {
    'use strict';
    var KEY = 'mugol-layout-mode', MODES = ['mobile', 'tablet', 'desktop'];
    var root = document.documentElement;

    function stored() { try { var m = localStorage.getItem(KEY); return MODES.indexOf(m) > -1 ? m : null; } catch (e) { return null; } }

    /* Android uygulaması (TWA) ya da ana ekrana eklenmiş PWA mı? */
    function isApp() {
        try {
            if ((document.referrer || '').indexOf('android-app://') === 0) return true;
            if (window.navigator.standalone === true) return true;
            var q = ['standalone', 'fullscreen', 'minimal-ui'];
            for (var i = 0; i < q.length; i++) if (window.matchMedia('(display-mode: ' + q[i] + ')').matches) return true;
        } catch (e) {}
        return false;
    }
    function auto() {
        if (isApp()) return 'mobile';
        var w = window.innerWidth; return w <= 700 ? 'mobile' : (w <= 1024 ? 'tablet' : 'desktop');
    }

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

    /* ── Giriş sorusu: yalnızca tarayıcıda, seçim yapılmamışsa ── */
    function askView() {
        if (isApp() || stored() || document.getElementById('mgViewAsk')) return;
        if (/bot|crawl|spider|lighthouse|slurp|facebookexternalhit/i.test(navigator.userAgent || '')) return;
        var small = window.innerWidth <= 700;
        var box = document.createElement('div');
        box.id = 'mgViewAsk';
        box.setAttribute('role', 'dialog');
        box.setAttribute('aria-modal', 'true');
        box.setAttribute('aria-labelledby', 'mgViewAskTitle');
        box.innerHTML =
            '<div class="mg-va-card">' +
              '<div class="mg-va-title" id="mgViewAskTitle">MuGöl PORTAL\'a hoş geldiniz</div>' +
              '<div class="mg-va-sub">Hangi görünümle devam etmek istersiniz?</div>' +
              '<button type="button" class="mg-va-btn' + (small ? ' rec' : '') + '" data-mode="mobile">' +
                '<span class="mg-va-ico">&#128241;</span><span><b>Mobil</b><small>Alt menülü, uygulama gibi görünüm</small></span></button>' +
              '<button type="button" class="mg-va-btn' + (small ? '' : ' rec') + '" data-mode="desktop">' +
                '<span class="mg-va-ico">&#128421;&#65039;</span><span><b>Tarayıcı</b><small>Sol menülü, geniş ekran görünümü</small></span></button>' +
              '<div class="mg-va-note">Seçiminizi daha sonra Ayarlar &rsaquo; Görünüm Modu bölümünden değiştirebilirsiniz.</div>' +
            '</div>';
        box.addEventListener('click', function (e) {
            var b = e.target.closest ? e.target.closest('.mg-va-btn') : null;
            if (!b) return;
            apply(b.getAttribute('data-mode'), true);
            box.classList.add('closing');
            setTimeout(function () { if (box.parentNode) box.parentNode.removeChild(box); }, 250);
        });
        (document.body || document.documentElement).appendChild(box);
    }

    function init() {
        apply(stored() || auto(), false);
        document.querySelectorAll('.mg-mode-btn').forEach(function (b) {
            b.addEventListener('click', function () { apply(b.getAttribute('data-mode'), true); });
        });
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
    askView();   /* açılış ekranının da üstünde, hemen göster */
})();


// ════════════════════════════════════════════════════════════
// SORU SOR — "Muhammet'e sor" penceresi (e-posta ile mesaj)
// ════════════════════════════════════════════════════════════
(function () {
    'use strict';
    var TO = 'muhammete.soru.sor@gmail.com';
    var MAX = 1000;
    var NAME_KEY = 'mugol-user-name';
    var CHIPS = [
        { k: 'soru',       e: '❓', t: 'Soru',        s: 'Merhaba Muhammet, MuGöl PORTAL ile ilgili bir sorum var: ' },
        { k: 'öneri',      e: '💡', t: 'Öneri',       s: 'Merhaba Muhammet, MuGöl PORTAL için bir önerim var: ' },
        { k: 'hata bildirimi', e: '🐛', t: 'Hata bildir', s: 'Merhaba Muhammet, MuGöl PORTAL\'da bir hata buldum: ' },
        { k: 'iş birliği', e: '🤝', t: 'İş birliği',  s: 'Merhaba Muhammet, seninle iş birliği yapmak isterim: ' },
        { k: 'tanışma',    e: '👋', t: 'Tanışalım',   s: 'Merhaba Muhammet, tanışmak istedim! ' }
    ];
    var box = null, lastFocus = null, kind = 'mesaj', starter = '', rec = null;

    var SVG_CHAT = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.6-.8L3 21l1.9-5.2A8.4 8.4 0 1 1 21 11.5z"/><circle cx="8.5" cy="11.5" r=".6" fill="#fff"/><circle cx="12" cy="11.5" r=".6" fill="#fff"/><circle cx="15.5" cy="11.5" r=".6" fill="#fff"/></svg>';
    var SVG_X = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg>';
    var SVG_SEND = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>';

    function getName() { try { return (localStorage.getItem(NAME_KEY) || ''); } catch (e) { return ''; } }
    function saveName(n) {
        try { if (n) localStorage.setItem(NAME_KEY, n); else localStorage.removeItem(NAME_KEY); } catch (e) {}
        try { window.dispatchEvent(new Event('mg-name')); } catch (e) {}
    }
    function $(sel) { return box.querySelector(sel); }

    function subjectText() {
        var n = $('#mgAskName').value.trim();
        return 'MuGöl PORTAL\'dan ' + kind + (n ? ' - ' + n : '');
    }
    function refreshSubject() { $('#mgAskSubj').textContent = 'Konu: ' + subjectText(); }
    function refreshSend() { $('#mgAskSend').disabled = $('#mgAskMsg').value.trim().length < 3; }

    function build() {
        var chips = CHIPS.map(function (c, i) {
            return '<button type="button" class="mg-ask-chip" data-i="' + i + '"><span aria-hidden="true">' + c.e + '</span> ' + c.t + '</button>';
        }).join('');
        box = document.createElement('div');
        box.id = 'mgAskBox';
        box.setAttribute('role', 'dialog');
        box.setAttribute('aria-modal', 'true');
        box.setAttribute('aria-labelledby', 'mgAskTitle');
        box.innerHTML =
            '<div class="mg-ask-card">' +
              '<i class="mg-ask-strip"></i>' +
              '<button type="button" class="mg-ask-x" aria-label="Kapat">' + SVG_X + '</button>' +
              '<div class="mg-ask-form">' +
                '<div class="mg-ask-head"><div class="mg-ask-ico">' + SVG_CHAT + '</div>' +
                  '<div><div class="mg-ask-title" id="mgAskTitle">Muhammet\'e sor</div>' +
                  '<div class="mg-ask-sub">Merak ettiğini yaz; mesajın e-posta olarak Muhammet\'e ulaşsın.</div></div></div>' +
                '<div class="mg-ask-lab caps">Hızlı başlangıç</div>' +
                '<div class="mg-ask-chips">' + chips + '</div>' +
                '<label class="mg-ask-lab" for="mgAskName">Adın</label>' +
                '<input type="text" class="mg-ask-name" id="mgAskName" maxlength="60" placeholder="Adın (isteğe bağlı)" autocomplete="given-name">' +
                '<label class="mg-ask-lab" for="mgAskMsg">Sorun veya mesajın</label>' +
                '<textarea id="mgAskMsg" class="mg-ask-msg" maxlength="' + MAX + '" rows="4" placeholder="Merhaba Muhammet, ..."></textarea>' +
                '<button type="button" class="mg-ask-voice" id="mgAskVoice" hidden><span aria-hidden="true">🎤</span> <span class="mg-ask-voice-t">Sesle yaz</span></button>' +
                '<div class="mg-ask-count" id="mgAskCount">0/' + MAX + '</div>' +
                '<div class="mg-ask-subj" id="mgAskSubj"></div>' +
                '<div class="mg-ask-actions">' +
                  '<button type="button" class="mg-ask-copy" id="mgAskCopy">Kopyala</button>' +
                  '<button type="button" class="mg-ask-send" id="mgAskSend" disabled>Mesajı gönder ' + SVG_SEND + '</button>' +
                '</div>' +
              '</div>' +
              '<div class="mg-ask-done" id="mgAskDone" hidden>' +
                '<div class="mg-ask-ico">' + SVG_CHAT + '</div>' +
                '<div class="mg-ask-title">E-posta uygulaman açıldı</div>' +
                '<div class="mg-ask-sub">Mesajın hazır. Orada <b>Gönder</b>\'e basarak Muhammet\'e ulaştırabilirsin.<br>Açılmadıysa şu adrese yazabilirsin:<br><a href="mailto:' + TO + '">' + TO + '</a></div>' +
                '<button type="button" class="mg-ask-send mg-ask-close">Tamam</button>' +
              '</div>' +
            '</div>';
        document.body.appendChild(box);

        var msg = $('#mgAskMsg'), name = $('#mgAskName');
        msg.addEventListener('input', function () { $('#mgAskCount').textContent = msg.value.length + '/' + MAX; refreshSend(); });
        name.addEventListener('input', refreshSubject);
        $('#mgAskSend').addEventListener('click', submit);
        $('#mgAskCopy').addEventListener('click', copy);
        box.addEventListener('click', function (e) {
            if (e.target === box || e.target.closest('.mg-ask-x') || e.target.closest('.mg-ask-close')) { close(); return; }
            var chip = e.target.closest('.mg-ask-chip');
            if (chip) pickChip(+chip.getAttribute('data-i'));
        });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && box && box.classList.contains('open')) close(); });
        initVoice();
    }

    function pickChip(i) {
        var c = CHIPS[i], msg = $('#mgAskMsg');
        box.querySelectorAll('.mg-ask-chip').forEach(function (b) { b.classList.toggle('on', +b.getAttribute('data-i') === i); });
        kind = c.k;
        if (!msg.value.trim() || msg.value === starter) { msg.value = c.s; }
        starter = c.s;
        $('#mgAskCount').textContent = msg.value.length + '/' + MAX;
        refreshSubject(); refreshSend();
        msg.focus();
        try { msg.setSelectionRange(msg.value.length, msg.value.length); } catch (e) {}
    }

    /* ── Sesle yaz (tarayıcı destekliyorsa) ── */
    function initVoice() {
        var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        var btn = $('#mgAskVoice');
        if (!SR) return;
        btn.hidden = false;
        btn.addEventListener('click', function () {
            if (rec) { try { rec.stop(); } catch (e) {} return; }
            var msg = $('#mgAskMsg'), base = msg.value;
            rec = new SR();
            rec.lang = 'tr-TR'; rec.interimResults = true; rec.continuous = false;
            rec.onresult = function (ev) {
                var t = '';
                for (var i = 0; i < ev.results.length; i++) t += ev.results[i][0].transcript;
                msg.value = (base + (base && !/\s$/.test(base) ? ' ' : '') + t).slice(0, MAX);
                $('#mgAskCount').textContent = msg.value.length + '/' + MAX; refreshSend();
            };
            var end = function () { rec = null; btn.classList.remove('live'); btn.querySelector('.mg-ask-voice-t').textContent = 'Sesle yaz'; };
            rec.onend = end; rec.onerror = end;
            btn.classList.add('live'); btn.querySelector('.mg-ask-voice-t').textContent = 'Dinliyorum...';
            try { rec.start(); } catch (e) { end(); }
        });
    }

    function composeBody(msg, name) {
        return msg + '\n\n──────────────────' + (name ? '\nGönderen: ' + name : '')
             + '\nGönderildiği yer: MuGöl PORTAL\nTarih: ' + new Date().toLocaleString('tr-TR');
    }
    function mailtoUrl(name, msg, k) {
        var subject = 'MuGöl PORTAL\'dan ' + (k || 'mesaj') + (name ? ' - ' + name : '');
        return 'mailto:' + TO + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(composeBody(msg, name));
    }
    window.mgAskMailto = mailtoUrl;

    function copy() {
        var name = $('#mgAskName').value.trim(), msg = $('#mgAskMsg').value.trim();
        if (!msg) return;
        var text = msg + (name ? '\n\n— ' + name : '');
        var done = function () {
            var b = $('#mgAskCopy'); b.textContent = 'Kopyalandı ✓';
            setTimeout(function () { b.textContent = 'Kopyala'; }, 1600);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); });
        } else { fallbackCopy(text); done(); }
    }
    function fallbackCopy(text) {
        var t = document.createElement('textarea'); t.value = text; t.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0;';
        document.body.appendChild(t); t.select(); try { document.execCommand('copy'); } catch (e) {} document.body.removeChild(t);
    }

    function open() {
        if (!box) build();
        lastFocus = document.activeElement;
        box.querySelector('.mg-ask-form').hidden = false;
        $('#mgAskDone').hidden = true;
        var nm = $('#mgAskName'); if (!nm.value) nm.value = getName();
        refreshSubject(); refreshSend();
        box.classList.add('open');
        setTimeout(function () { var m = $('#mgAskMsg'); if (m) m.focus(); }, 80);
    }
    function close() {
        if (!box) return;
        if (rec) { try { rec.stop(); } catch (e) {} }
        box.classList.remove('open');
        if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) {} }
    }
    function submit() {
        var name = $('#mgAskName').value.trim(), msg = $('#mgAskMsg').value.trim();
        if (msg.length < 3) return;
        saveName(name);
        window.location.href = mailtoUrl(name, msg, kind);
        box.querySelector('.mg-ask-form').hidden = true;
        $('#mgAskDone').hidden = false;
        $('#mgAskMsg').value = ''; starter = ''; kind = 'mesaj';
        box.querySelectorAll('.mg-ask-chip').forEach(function (b) { b.classList.remove('on'); });
        $('#mgAskCount').textContent = '0/' + MAX; refreshSend();
    }

    document.addEventListener('click', function (e) {
        if (e.target.closest && e.target.closest('#mgAskBtn')) { e.preventDefault(); open(); }
    });
})();
