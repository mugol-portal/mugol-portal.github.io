// =========================================================
// DEĞİŞKENLER VE DOM ELEMENTLERİ
// =========================================================
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page-section');
const sectionTitle = document.getElementById('sectionTitle');
const hamburgerBtn = document.getElementById('hamburgerBtn');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');

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
    });
}

const fontBtns = document.querySelectorAll('.font-btn');
fontBtns.forEach(btn => {
    const applyFont = () => {
        fontBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const newSize = btn.getAttribute('data-size');
        document.documentElement.style.setProperty('--base-font-size', newSize);
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
    cancelToast();
    pendingUrl = url;

    if (toastAppName) toastAppName.textContent = appName;
    const toastLogo = document.getElementById('toast-app-logo');
    if (toastLogo) toastLogo.src = logoSrc || '';
    if (toastCountEl) toastCountEl.textContent = '3';
    
    if (toastRing) {
        toastRing.style.strokeDashoffset = 0;
        toastRing.style.transition = 'none';
    }
    if (toast) toast.classList.add('show');

    requestAnimationFrame(() => {
        if (toastRing) {
            toastRing.style.transition = 'stroke-dashoffset 3s linear';
            toastRing.style.strokeDashoffset = CIRCUMFERENCE;
        }
    });

    let count = 3;
    toastCountdown = setInterval(() => {
        count--;
        if (toastCountEl) toastCountEl.textContent = count > 0 ? count : '';
        if (count <= 0) clearInterval(toastCountdown);
    }, 1000);

    toastTimer = setTimeout(() => {
        if (toast) toast.classList.remove('show');
        if (pendingUrl) {
            window.location.href = pendingUrl;
        }
        pendingUrl = null;
    }, 3000);
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
    const labels =['Sistem Başlatılıyor...', 'Uygulamalar Hazırlanıyor...', 'Son Ayarlar...', 'Hoş Geldiniz!'];
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
            
            // DÜZELTME: Splash bitmeden 200ms önce Auth kontrolü yapılır
            // Böylece portal arayüzü asla görünmez (Flash sorunu çözüldü)
            if (typeof MugolAuth !== 'undefined') {
                MugolAuth.checkAuth();
            }

            setTimeout(() => {
                if (splash) {
                    splash.style.opacity = '0'; // Yumuşak geçiş
                    setTimeout(() => {
                        splash.classList.add('hidden');
                    }, 400);
                }
            }, 200);
        }
    }, 120);
})();

// DİĞER TÜM SCRIPT.JS FONKSİYONLARIN (Menü, Toast, PWA vb.) BURADA DEVAM ETMELİ...

// =========================================================
// 9. AŞAĞI ÇEKME YENİLE (PULL TO REFRESH)
// =========================================================
(function () {
    const mainContent = document.querySelector('.main-content');
    const ptrIndicator = document.getElementById('ptr-indicator');
    const ptrLabel = document.getElementById('ptr-label');
    if (!mainContent || !ptrIndicator) return;

    let startY = 0, currentY = 0, pulling = false, refreshing = false;
    const THRESHOLD = 80, MAX_PULL = 130;

    mainContent.addEventListener('touchstart', (e) => {
        if (mainContent.scrollTop > 0) return;
        startY = e.touches[0].clientY;
        pulling = true;
    }, { passive: true });

    mainContent.addEventListener('touchmove', (e) => {
        if (!pulling || refreshing) return;
        currentY = e.touches[0].clientY;
        const diff = Math.min(currentY - startY, MAX_PULL);
        if (diff <= 0) return;

        const height = Math.min(diff * 0.6, 75);
        ptrIndicator.style.height = height + 'px';
        ptrIndicator.classList.toggle('visible', diff > 20);
        ptrIndicator.classList.toggle('ready', diff >= THRESHOLD);

        if (ptrLabel) {
            const isEng = localStorage.getItem('mugol-lang') === 'en';
            ptrLabel.textContent = diff >= THRESHOLD 
                ? (isEng ? 'Release to refresh' : 'Bırakın, yenilensin') 
                : (isEng ? 'Pull to refresh' : 'Yenilemek için çekin');
        }
    }, { passive: true });

    mainContent.addEventListener('touchend', () => {
        if (!pulling || refreshing) return;
        pulling = false;
        const diff = currentY - startY;
        if (diff >= THRESHOLD) {
            refreshing = true;
            ptrIndicator.classList.add('refreshing');
            const isEng = localStorage.getItem('mugol-lang') === 'en';
            if (ptrLabel) ptrLabel.textContent = isEng ? 'Refreshing...' : 'Yenileniyor...';
            setTimeout(() => { location.reload(); }, 1000);
        } else {
            ptrIndicator.style.height = '0';
            ptrIndicator.classList.remove('visible', 'ready');
        }
    }, { passive: true });
})();

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
        localStorage.setItem('read-notifs', JSON.stringify(readNotifs));
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
        setTimeout(() => searchInput.focus(), 100);
    }
}
window.closeSearch = () => { if(searchModal) searchModal.style.display = 'none'; };
if(document.getElementById('searchBtn')) document.getElementById('searchBtn').addEventListener('click', openSearch);

document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
    if (e.key === 'Escape') closeSearch();
});

// =========================================================
// 12. RENK TEMASI VE AYARLAR
// =========================================================
const savedColor = localStorage.getItem('mugol-primary-color');
if (savedColor) document.documentElement.style.setProperty('--primary-color', savedColor);

document.querySelectorAll('.color-swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
        const color = swatch.getAttribute('data-color');
        document.documentElement.style.setProperty('--primary-color', color);
        localStorage.setItem('mugol-primary-color', color);
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
}

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