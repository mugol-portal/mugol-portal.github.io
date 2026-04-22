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
            window.open(pendingUrl, '_blank', 'noopener,noreferrer');
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

    // Oturum açıksa VEYA hatırlanan kullanıcı varsa splash'i tamamen atla
    const activeSession = sessionStorage.getItem('mugol-session');
    const rememberedUser = localStorage.getItem('mugol-remember-user');
    if (activeSession || rememberedUser) {
        // Yeni sekmede session yoksa localStorage'dan otomatik geri yükle
        if (rememberedUser && !activeSession) {
            sessionStorage.setItem('mugol-session', rememberedUser);
        }
        if (splash) splash.classList.add('hidden');
        if (typeof MugolAuth !== 'undefined') MugolAuth.checkAuth();
        return;
    }

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

// Tümünü okundu işaretle butonu
const notifMarkAll = document.getElementById('notifMarkAll');
if (notifMarkAll) {
    notifMarkAll.addEventListener('click', () => {
        readNotifs = NOTIFICATIONS.map(n => n.id);
        localStorage.setItem('mugol-read-notifs', JSON.stringify(readNotifs));
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
    // Dil butonlarını güncelle
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
    localStorage.setItem('mugol-lang', lang);
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

// --- Yardımcı: aktif kullanıcıyı döndür ---
function getActiveUser() {
    return sessionStorage.getItem('mugol-session') ||
           localStorage.getItem('mugol-remember-user') || '';
}

// --- Yardımcı: isim → avatar rengi ---
function avatarColor(name) {
    var palette = ['#6366f1','#ec4899','#f59e0b','#10b981','#3b82f6','#8b5cf6','#ef4444','#00b4d8'];
    return palette[(name ? name.length : 0) % palette.length];
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

// --- Profil UI'yı kullanıcı bilgileriyle doldur ---
function refreshProfilUI() {
    var user    = getActiveUser();
    var display = user || 'Misafir';
    var initial = display.charAt(0).toUpperCase();
    var color   = avatarColor(display);

    // Sidebar küçük avatar
    var sidebarAvatar = document.getElementById('sidebarProfilAvatar');
    if (sidebarAvatar) {
        sidebarAvatar.textContent = initial;
        sidebarAvatar.style.background = 'linear-gradient(135deg,' + color + ',#00d2ff)';
    }

    // Sidebar alt kart
    var sidebarProfileAvatar = document.querySelector('.sidebar-profile-avatar');
    if (sidebarProfileAvatar) sidebarProfileAvatar.textContent = initial;

    // Büyük avatar
    var bigAvatar = document.getElementById('profilAvatarBig');
    if (bigAvatar) { bigAvatar.textContent = initial; bigAvatar.style.background = 'linear-gradient(135deg,' + color + ',#00d2ff)'; }

    // Kullanıcı adı alanları
    var usernameEl = document.getElementById('profilUsername');
    if (usernameEl) usernameEl.textContent = display;
    var infoUsernameEl = document.getElementById('profilInfoUsername');
    if (infoUsernameEl) infoUsernameEl.textContent = display;

    // Rozet
    var badgeEl = document.getElementById('profilBadge');
    if (badgeEl) {
        if (display.startsWith('Misafir_') || display === 'Misafir') {
            badgeEl.innerHTML = '<i class="fas fa-bolt"></i> Misafir';
            badgeEl.style.cssText = 'background:rgba(255,171,0,0.2);border:1px solid rgba(255,171,0,0.35);color:#d97706;';
        } else {
            badgeEl.innerHTML = '<i class="fas fa-check-circle"></i> Kayıtlı Üye';
            badgeEl.style.cssText = '';
        }
    }

    // Katılım metni
    var joinedEl = document.getElementById('profilJoinedText');
    if (joinedEl) joinedEl.textContent = user ? 'MuGöl PORTAL üyesi' : 'Lütfen giriş yapın';

    // Üyelik tipi
    var noads = localStorage.getItem('mugol-noads') === 'true';
    var tipEl = document.getElementById('profilUyelikTipi');
    if (tipEl) {
        tipEl.innerHTML = noads
            ? 'Reklamsız Plan <span class="reklamlama-badge"><i class="fas fa-star"></i> Aktif</span>'
            : 'Ücretsiz Plan';
    }

    // Üyelik kodu input
    var aktifKod = localStorage.getItem('mugol-noads-kod');
    var koduInp  = document.getElementById('uyelikKoduInput');
    if (koduInp) {
        if (aktifKod) {
            koduInp.value = aktifKod;
            koduInp.disabled = true;
            koduInp.style.opacity = '0.6';
        } else {
            koduInp.disabled = false;
            koduInp.style.opacity = '1';
        }
    }
}

// --- Şifre göster/gizle ---
window.toggleProfilPass = function(id, btn) {
    var inp = document.getElementById(id);
    if (!inp) return;
    inp.type = inp.type === 'password' ? 'text' : 'password';
    var icon = btn.querySelector('i');
    if (icon) icon.className = inp.type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
};

// --- Şifre değiştir ---
window.changeProfilPassword = function() {
    var curPass = document.getElementById('profil-cur-pass');
    var newPass = document.getElementById('profil-new-pass');
    var msgEl   = document.getElementById('profil-pass-msg');
    if (!curPass || !newPass || !msgEl) return;

    var user = getActiveUser();
    if (!user) { showProfilMsg(msgEl, 'error', '⚠️ Oturum açık değil.'); return; }
    if (!curPass.value) { showProfilMsg(msgEl, 'error', '⚠️ Mevcut şifreyi girin.'); return; }
    if (!newPass.value || newPass.value.length < 6) {
        showProfilMsg(msgEl, 'error', '⚠️ Yeni şifre en az 6 karakter olmalı.'); return;
    }

    try {
        var users = JSON.parse(localStorage.getItem('mugol-users') || '{}');
        if (users[user] !== curPass.value) {
            showProfilMsg(msgEl, 'error', '❌ Mevcut şifre yanlış!'); return;
        }
        users[user] = newPass.value;
        localStorage.setItem('mugol-users', JSON.stringify(users));
        curPass.value = '';
        newPass.value = '';
        showProfilMsg(msgEl, 'success', '✅ Şifreniz başarıyla güncellendi!');
    } catch(e) {
        showProfilMsg(msgEl, 'error', '❌ Bir hata oluştu, tekrar deneyin.');
    }
};

// --- Çıkış yap ---
window.profilLogout = function() {
    sessionStorage.removeItem('mugol-session');
    var overlay = document.getElementById('auth-overlay');
    if (overlay) {
        overlay.classList.add('visible');
        if (window.MugolAuth) {
            MugolAuth.updateGreeting();
            MugolAuth.loadSavedAccounts();
        }
    }
    var homeNav = document.querySelector('.nav-item[data-target="page-anasayfa"]');
    if (homeNav) homeNav.click();
};

// --- Profil sayfası açıldığında güncelle ---
var _profilNavItem = document.querySelector('.nav-item[data-target="page-profil"]');
if (_profilNavItem) _profilNavItem.addEventListener('click', refreshProfilUI);

// İlk yükleme + auth animasyonundan sonra güncelle
refreshProfilUI();
setTimeout(refreshProfilUI, 1800);

// =========================================================
// ÜYELİK KODU & REKLAMSIZ SİSTEM
// =========================================================

var _NOADS_KODLAR = [
    'MG-X9K2-NOAD','MUGOL-7T4W-VIP','PORTAL-R3M-FREE',
    'MG2025-ZSQP','NOAD-MUGOL-88','PREMIUM-MG-KOD','GOLPINAR-NOAD',
];

function reklamlariGizle() {
    document.querySelectorAll('.adsense-banner-wrap, ins.adsbygoogle, #ad-transition-modal, #adblock-overlay').forEach(function(el) {
        el.style.setProperty('display','none','important');
    });
    var m = document.getElementById('ad-transition-modal');
    if (m) { m.style.setProperty('display','none','important'); m.classList.remove('visible'); }
}
if (localStorage.getItem('mugol-noads') === 'true') reklamlariGizle();

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
    if (localStorage.getItem('mugol-noads') === 'true') { goster('success','✅ Kod zaten aktif! Reklamlar kapalı.'); return; }
    var girilen = inp.value.trim().toUpperCase();
    if (!girilen) { goster('error','⚠️ Lütfen bir kod girin.'); return; }
    if (_NOADS_KODLAR.indexOf(girilen) !== -1) {
        localStorage.setItem('mugol-noads','true');
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
    var overlay = document.getElementById('adblock-overlay');
    if (overlay) overlay.classList.remove('visible');
};

// Geçiş reklamını geç / kapat
window.skipAd = function() {
    var modal = document.getElementById('ad-transition-modal');
    if (modal) {
        modal.classList.remove('visible');
        modal.style.display = 'none';
    }
    // Bekleyen URL varsa aç
    if (window._adPendingUrl) {
        window.open(window._adPendingUrl, '_blank', 'noopener,noreferrer');
        window._adPendingUrl = null;
    }
};

// Geçiş reklamı geri sayımı (reklamsız modda devre dışı kalır)
window.startAdCountdown = function(url, appName, logoSrc) {
    // Reklamsız mod aktifse direkt aç
    if (localStorage.getItem('mugol-noads') === 'true') {
        if (url) window.open(url, '_blank', 'noopener,noreferrer');
        return;
    }
    var modal = document.getElementById('ad-transition-modal');
    var ring  = document.getElementById('ad-ring');
    var secEl = document.getElementById('ad-sec');
    var skipBtn = document.getElementById('ad-skip-btn');
    var nameEl  = document.getElementById('ad-app-name-top');
    var logoEl  = document.getElementById('ad-app-logo');
    if (!modal) return;

    window._adPendingUrl = url || null;
    if (nameEl) nameEl.textContent = appName || 'Uygulama';
    if (logoEl) logoEl.src = logoSrc || '';
    if (skipBtn) { skipBtn.style.display = 'none'; skipBtn.classList.remove('show'); }

    var circumference = 2 * Math.PI * 13;
    if (ring) {
        ring.style.strokeDasharray = circumference;
        ring.style.strokeDashoffset = 0;
        ring.style.transition = 'none';
        requestAnimationFrame(function() {
            ring.style.transition = 'stroke-dashoffset 5s linear';
            ring.style.strokeDashoffset = circumference;
        });
    }

    modal.classList.add('visible');
    var bar = document.getElementById('ad-progress-bar');
    if (bar) { bar.style.transform = 'scaleX(1)'; bar.style.transition = 'none';
        requestAnimationFrame(function() {
            bar.style.transition = 'transform 5s linear';
            bar.style.transform = 'scaleX(0)';
        });
    }

    var count = 5;
    if (secEl) secEl.textContent = count;
    var timer = setInterval(function() {
        count--;
        if (secEl) secEl.textContent = count > 0 ? count : '';
        if (count <= 3 && skipBtn) { skipBtn.style.display = 'inline-flex'; skipBtn.classList.add('show'); }
        if (count <= 0) {
            clearInterval(timer);
            window.skipAd();
        }
    }, 1000);
};

// openAppWithAd: app-card click'lerinden çağrılabilir
window.openAppWithAd = function(url, appName, logoSrc) {
    if (localStorage.getItem('mugol-noads') === 'true') {
        window.open(url, '_blank', 'noopener,noreferrer');
    } else {
        window.startAdCountdown(url, appName, logoSrc);
    }
};
