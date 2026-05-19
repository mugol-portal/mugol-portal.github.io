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
function activateMenu(item) {
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
    const timeString = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    const timeEl = document.getElementById('timeDisplay');
    if (timeEl && timeEl.textContent !== timeString) timeEl.textContent = timeString;

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
// 8. AÇILIŞ ANİMASYONU (SPLASH SCREEN) VE SENKRONİZE GİRİŞ KONTROLÜ
// =========================================================
(function () {
    const bar = document.getElementById('splashProgressBar');
    const label = document.getElementById('splashProgressLabel');
    const splash = document.getElementById('splash-screen');

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
        if (splash) splash.classList.add('hidden');
        sessionStorage.setItem('mugol-portal-visited', '1');
        return;
    }

    // İlk ziyareti kaydet — sonraki geri tuşlarında splash gösterilmez
    sessionStorage.setItem('mugol-portal-visited', '1');

    const labels = ['Sistem Başlatılıyor...', 'Uygulamalar Hazırlanıyor...', 'Son Ayarlar...', 'Hoş Geldiniz!'];

    // ── Açılış müziğini çal
    const splashAudio = new Audio('mugol_acilis.mp3');
    splashAudio.preload = 'auto';

    // Splash'i kapatma fonksiyonu
    function closeSplash() {
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

    // Müzik süresiyle senkronize progress bar
    function startProgressWithAudio(duration) {
        let progress = 0;
        let labelIdx = 0;
        const totalMs = duration * 1000;
        const startTime = Date.now();

        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            progress = Math.min((elapsed / totalMs) * 100, 99);

            if (bar) bar.style.width = progress + '%';

            const newLabelIdx = Math.min(Math.floor(progress / 33), labels.length - 1);
            if (newLabelIdx !== labelIdx) {
                labelIdx = newLabelIdx;
                if (label) label.textContent = labels[labelIdx];
            }

            if (elapsed >= totalMs) {
                clearInterval(interval);
            }
        }, 80);
    }

    // Müzik yüklenince süresini al ve başlat
    splashAudio.addEventListener('loadedmetadata', function () {
        startProgressWithAudio(splashAudio.duration);
    });

    // Müzik bitince splash kapat
    splashAudio.addEventListener('ended', function () {
        closeSplash();
    });

    // Müzik yüklenemezse veya hata olursa eski davranışla devam et
    splashAudio.addEventListener('error', function () {
        let progress = 0;
        let labelIdx = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 4 + 2;
            if (progress > 100) progress = 100;
            if (bar) bar.style.width = progress + '%';
            const newLabelIdx = Math.min(Math.floor(progress / 33), labels.length - 1);
            if (newLabelIdx !== labelIdx) {
                labelIdx = newLabelIdx;
                if (label) label.textContent = labels[labelIdx];
            }
            if (progress >= 100) {
                clearInterval(interval);
                closeSplash();
            }
        }, 120);
    });

    // Müziği oynat
    const playPromise = splashAudio.play();
    if (playPromise !== undefined) {
        playPromise.catch(function () {
            // Tarayıcı autoplay'e izin vermezse: kullanıcı etkileşimi beklenmeden
            // eski ilerleme animasyonu ile devam et
            let progress = 0;
            let labelIdx = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 4 + 2;
                if (progress > 100) progress = 100;
                if (bar) bar.style.width = progress + '%';
                const newLabelIdx = Math.min(Math.floor(progress / 33), labels.length - 1);
                if (newLabelIdx !== labelIdx) {
                    labelIdx = newLabelIdx;
                    if (label) label.textContent = labels[labelIdx];
                }
                if (progress >= 100) {
                    clearInterval(interval);
                    closeSplash();
                }
            }, 120);
        });
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
// GEÇİŞ REKLAM MODALI — AdSense (ca-app-pub-1880946354382681/2331344971)
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
