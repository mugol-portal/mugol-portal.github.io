// --- DEĞİŞKENLER VE DOM ELEMENTLERİ ---
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page-section');
const sectionTitle = document.getElementById('sectionTitle');
const hamburgerBtn = document.getElementById('hamburgerBtn');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');

// --- 1. MENÜ GEÇİŞ SİSTEMİ (Tıklama ve Klavye Desteği) ---
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

// --- 2. SİDEBAR KONTROLLERİ ---
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

// --- 3. AYARLAR: TEMA VE YAZI BOYUTU ---
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

// --- 4. TARİH VE SAAT FONKSİYONU ---
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

// --- 5. GELİŞMİŞ İLETİŞİM FORMU ---
const contactForm = document.getElementById('contactForm');
const charCountEl = document.getElementById('charCount');
const msgTextarea = document.getElementById('contact-message');

if (msgTextarea && charCountEl) {
    msgTextarea.addEventListener('input', function () {
        const len = this.value.length;
        charCountEl.textContent = len + ' / 500';
        charCountEl.style.color = len > 450 ? '#FF5630' : len > 350 ? '#FFC107' : 'var(--text-muted)';
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

window.copyEmail = function() {
    const email = 'mugol.education.help@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
        const btn = document.getElementById('copyEmailBtn');
        if (btn) {
            const orig = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check" aria-hidden="true"></i> Kopyalandı!';
            btn.style.background = 'rgba(16, 185, 129, 0.1)';
            btn.style.borderColor = 'rgba(16, 185, 129, 0.3)';
            btn.style.color = '#10b981';
            setTimeout(() => {
                btn.innerHTML = orig;
                btn.style.background = '';
                btn.style.borderColor = '';
                btn.style.color = '';
            }, 2000);
        }
    }).catch(() => {
        const el = document.createElement('textarea');
        el.value = email;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    });
}

// --- 6. YÖNLENDİRME TOAST (POP-UP ENGELLEYİCİ ÇÖZÜMLÜ) ---
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

// --- 7. ANA SAYFA KATEGORİ KARTLARI ---
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

// --- 8. AÇILIŞ ANİMASYONU (SPLASH SCREEN) ---
(function () {
    if (sessionStorage.getItem('skipSplash')) {
        sessionStorage.removeItem('skipSplash');
        const splash = document.getElementById('splash-screen');
        if (splash) splash.style.display = 'none';
        return;
    }

    const particlesContainer = document.getElementById('splashParticles');
    if (particlesContainer) {
        for (let i = 0; i < 18; i++) {
            const p = document.createElement('div');
            p.className = 'splash-particle';
            const size = Math.random() * 6 + 3;
            p.style.cssText = `
                width:${size}px; height:${size}px;
                left:${Math.random() * 100}%;
                animation-duration:${Math.random() * 6 + 5}s;
                animation-delay:${Math.random() * 4}s;
            `;
            particlesContainer.appendChild(p);
        }
    }

    const bar = document.getElementById('splashProgressBar');
    const label = document.getElementById('splashProgressLabel');
    const splash = document.getElementById('splash-screen');
    const labels =['Yükleniyor...', 'Hazırlanıyor...', 'Neredeyse hazır...', 'Hoş geldiniz!'];
    let progress = 0;
    let labelIdx = 0;

    const interval = setInterval(() => {
        progress += Math.random() * 4 + 1.5;
        if (progress > 100) progress = 100;
        
        if (bar) {
            bar.style.width = progress + '%';
            bar.setAttribute('aria-valuenow', Math.round(progress));
        }
        
        const newLabelIdx = Math.min(Math.floor(progress / 33), labels.length - 1);
        if (newLabelIdx !== labelIdx) {
            labelIdx = newLabelIdx;
            if (label) label.textContent = labels[labelIdx];
        }
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                if (splash) splash.classList.add('hidden');
            }, 600);
        }
    }, 180);
})();

// --- 9. AŞAĞI ÇEKME YENİLE (PULL TO REFRESH) ---
(function () {
    const mainContent = document.querySelector('.main-content');
    const ptrIndicator = document.getElementById('ptr-indicator');
    const ptrLabel = document.getElementById('ptr-label');
    if (!mainContent || !ptrIndicator) return;

    let startY = 0;
    let currentY = 0;
    let pulling = false;
    let refreshing = false;
    const THRESHOLD = 80;
    const MAX_PULL = 120;

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

        const height = Math.min(diff * 0.6, 70);
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
            ptrIndicator.classList.remove('ready');
            const isEng = localStorage.getItem('mugol-lang') === 'en';
            if (ptrLabel) ptrLabel.textContent = isEng ? 'Refreshing...' : 'Yenileniyor...';
            ptrIndicator.style.height = '65px';

            setTimeout(() => {
                sessionStorage.setItem('skipSplash', '1');
                location.reload();
            }, 1000);
        } else {
            ptrIndicator.style.height = '0';
            ptrIndicator.classList.remove('visible', 'ready');
            refreshing = false;
        }
        startY = 0; currentY = 0;
    }, { passive: true });
})();

// --- 10. BİLDİRİM SİSTEMİ ---
const NOTIFICATIONS =[
    { id: 'n1', icon: '🚀', title: 'MuGöl PORTAL v1.0 Yayında!', body: 'Bildirim paneli, gelişmiş iletişim formu ve yeni kısayollar eklendi.', time: 'Az önce' },
    { id: 'n2', icon: '🔍', title: 'Hızlı Arama', body: 'Ctrl+K ile istediğiniz uygulamayı anında bulun.', time: '2 gün önce' },
    { id: 'n3', icon: '🎨', title: 'Renk Teması', body: 'Ayarlar sayfasından portal rengini kişiselleştirebilirsiniz.', time: '3 gün önce' },
];

let readNotifs = JSON.parse(localStorage.getItem('mugol-read-notifs') || '[]');

function renderNotifications() {
    const list = document.getElementById('notifList');
    const dot = document.getElementById('notifDot');
    if (!list) return;

    const unread = NOTIFICATIONS.filter(n => !readNotifs.includes(n.id));
    if (dot) dot.style.display = unread.length > 0 ? 'block' : 'none';

    if (NOTIFICATIONS.length === 0) {
        const isEng = localStorage.getItem('mugol-lang') === 'en';
        list.innerHTML = `<div style="padding:2rem;text-align:center;color:var(--text-muted);font-weight:800;font-size:1rem;">${isEng ? 'No notifications' : 'Bildirim yok'}</div>`;
        return;
    }

    list.innerHTML = NOTIFICATIONS.map(n => {
        const isRead = readNotifs.includes(n.id);
        return `<div data-notif-id="${n.id}" onclick="markNotifRead('${n.id}')" role="listitem" tabindex="0" style="
            padding:14px 18px; border-bottom:1px solid var(--border-color);
            cursor:pointer; transition:background 0.15s ease;
            background:${isRead ? 'transparent' : 'rgba(67,24,255,0.04)'};
            display:flex; gap:12px; align-items:flex-start;"
            onmouseenter="this.style.background='rgba(67,24,255,0.06)'"
            onmouseleave="this.style.background='${isRead ? 'transparent' : 'rgba(67,24,255,0.04)'}'">
            <div style="font-size:1.4rem; flex-shrink:0; line-height:1;" aria-hidden="true">${n.icon}</div>
            <div style="flex:1; min-width:0;">
                <div style="display:flex; align-items:center; justify-content:space-between; gap:8px; margin-bottom:3px;">
                    <span style="font-weight:${isRead ? 700 : 900}; font-size:1rem; color:var(--text-main);">${n.title}</span>
                    ${!isRead ? '<span style="width:8px;height:8px;background:var(--primary-color);border-radius:50%;flex-shrink:0;" aria-label="Okunmadı"></span>' : ''}
                </div>
                <div style="font-size:0.9rem; color:var(--text-muted); font-weight:600; line-height:1.5;">${n.body}</div>
                <div style="font-size:0.8rem; color:var(--text-muted); margin-top:4px; font-weight:800;">${n.time}</div>
            </div>
        </div>`;
    }).join('');
}

window.markNotifRead = function(id) {
    if (!readNotifs.includes(id)) {
        readNotifs.push(id);
        localStorage.setItem('mugol-read-notifs', JSON.stringify(readNotifs));
        renderNotifications();
    }
};

const notifBtn = document.getElementById('notifBtn');
const notifPanel = document.getElementById('notifPanel');

if (notifBtn && notifPanel) {
    notifBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = notifPanel.style.display !== 'none';
        notifPanel.style.display = isOpen ? 'none' : 'block';
        notifBtn.setAttribute('aria-expanded', !isOpen);
        if (!isOpen) renderNotifications();
    });

    const notifMarkAll = document.getElementById('notifMarkAll');
    if (notifMarkAll) {
        notifMarkAll.addEventListener('click', (e) => {
            e.stopPropagation();
            NOTIFICATIONS.forEach(n => { if (!readNotifs.includes(n.id)) readNotifs.push(n.id); });
            localStorage.setItem('mugol-read-notifs', JSON.stringify(readNotifs));
            renderNotifications();
        });
    }

    document.addEventListener('click', (e) => {
        if (!notifPanel.contains(e.target) && e.target !== notifBtn) {
            notifPanel.style.display = 'none';
            notifBtn.setAttribute('aria-expanded', 'false');
        }
    });
}

renderNotifications();

// --- 11. GLOBAL ARAMA (Debounce Desteği ile) ---
const searchModal = document.getElementById('searchModal');
const searchInput = document.getElementById('searchInput');
const searchIndex =[];

document.querySelectorAll('.page-section .app-card[href]').forEach(card => {
    const page = card.closest('.page-section');
    const menuItem = page ? document.querySelector('.nav-item[data-target="' + page.id + '"]') : null;
    searchIndex.push({
        name: card.querySelector('.app-info h3')?.textContent || '',
        desc: card.querySelector('.app-desc')?.textContent || '',
        tag: card.querySelector('.app-tag')?.textContent || '',
        img: card.querySelector('.app-icon-img')?.src || '',
        url: card.getAttribute('href'),
        category: menuItem ? menuItem.querySelector('.nav-text')?.textContent : '',
    });
});

if (document.getElementById('searchBtn')) {
    document.getElementById('searchBtn').addEventListener('click', openSearch);
}

function openSearch() {
    if (searchModal) {
        searchModal.style.display = 'flex';
        searchInput.value = '';
        renderSearchResults('');
        setTimeout(() => searchInput.focus(), 100);
    }
}

window.closeSearch = function() {
    if (searchModal) searchModal.style.display = 'none';
};

if (searchModal) {
    searchModal.addEventListener('click', function (e) {
        if (e.target === searchModal) closeSearch();
    });
}

document.addEventListener('keydown', function (e) {
    if (searchModal && searchModal.style.display === 'flex' && e.key === 'Escape') {
        closeSearch();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { 
        e.preventDefault(); 
        openSearch(); 
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        if (hamburgerBtn) hamburgerBtn.click();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        const homeMenu = document.querySelector('.nav-item[data-target="page-anasayfa"]');
        if (homeMenu) homeMenu.click();
    }
});

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

if (searchInput) {
    searchInput.addEventListener('input', debounce(function () {
        renderSearchResults(this.value.trim().toLowerCase());
    }, 250));
}

function renderSearchResults(query) {
    const container = document.getElementById('searchResults');
    if (!container) return;

    const results = query === '' ? searchIndex.slice(0, 8) : searchIndex.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.desc.toLowerCase().includes(query) ||
        item.tag.toLowerCase().includes(query)
    );

    if (results.length === 0) {
        const isEng = localStorage.getItem('mugol-lang') === 'en';
        container.innerHTML = `<div style="text-align:center;padding:2rem;color:var(--text-muted);font-weight:800;font-size:1.05rem;">${isEng ? 'No results found' : 'Sonuç bulunamadı'}</div>`;
        return;
    }

    container.innerHTML = results.map(item => `
        <div class="search-result-item" role="option" tabindex="0" data-url="${item.url}" data-name="${item.name}" data-img="${item.img}"
            style="display:flex;align-items:center;gap:14px;padding:12px 10px;border-radius:12px;cursor:pointer;transition:background 0.2s ease;">
            <img src="${item.img}" alt="" style="width:46px;height:46px;border-radius:10px;object-fit:cover;background:var(--bg-body);flex-shrink:0;"
                onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=4318ff&color=fff&rounded=true&bold=true'">
            <div style="flex:1;min-width:0;">
                <div style="font-weight:900;font-size:1.05rem;color:var(--text-main);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${item.name}</div>
                <div style="font-size:0.9rem;font-weight:700;color:var(--text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${item.desc}</div>
            </div>
            <span style="font-size:0.8rem;font-weight:900;color:var(--text-muted);background:var(--bg-body);padding:4px 12px;border-radius:20px;border:1px solid var(--border-color);flex-shrink:0;">${item.category || item.tag}</span>
        </div>
    `).join('');

    container.querySelectorAll('.search-result-item').forEach(el => {
        const triggerItem = () => {
            closeSearch();
            showRedirectToast(el.dataset.name, el.dataset.url, el.dataset.img);
        };
        el.addEventListener('mouseenter', () => el.style.background = 'rgba(67,24,255,0.06)');
        el.addEventListener('mouseleave', () => el.style.background = 'transparent');
        el.addEventListener('click', triggerItem);
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                triggerItem();
            }
        });
    });
}

// --- 12. RENK TEMASI ---
const savedColor = localStorage.getItem('mugol-primary-color');
if (savedColor) {
    document.documentElement.style.setProperty('--primary-color', savedColor);
    document.querySelectorAll('.color-swatch').forEach(s => {
        s.classList.toggle('active', s.getAttribute('data-color') === savedColor);
    });
}

document.querySelectorAll('.color-swatch').forEach(swatch => {
    const applyColor = () => {
        const color = swatch.getAttribute('data-color');
        document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
        document.documentElement.style.setProperty('--primary-color', color);
        localStorage.setItem('mugol-primary-color', color);
    };
    swatch.addEventListener('click', applyColor);
    swatch.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            applyColor();
        }
    });
});

// --- 13. YUKARI KAYDIR BUTONU ---
const scrollTopBtn = document.getElementById('scrollTopBtn');
const mainContent = document.querySelector('.main-content');
if (mainContent && scrollTopBtn) {
    mainContent.addEventListener('scroll', () => {
        scrollTopBtn.classList.toggle('visible', mainContent.scrollTop > 300);
    });
    scrollTopBtn.addEventListener('click', () => {
        mainContent.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// --- 14. COUNT-UP ANİMASYONU ---
function animateCountUp(el, target, suffix) {
    let start = 0;
    const duration = 1200;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            start = target;
            clearInterval(timer);
        }
        el.textContent = Math.floor(start) + (suffix || '');
        el.setAttribute('aria-label', Math.floor(start));
        el.classList.add('counting');
        setTimeout(() => el.classList.remove('counting'), 400);
    }, step);
}

const aboutMenuItem = document.querySelector('.nav-item[data-target="page-hakkinda"]');
let countUpDone = false;
if (aboutMenuItem) {
    aboutMenuItem.addEventListener('click', () => {
        if (countUpDone) return;
        setTimeout(() => {
            const statEls = document.querySelectorAll('.stat-item strong');
            const targets =[17, 4, 2025]; 
            const suffixes =['', '', ''];
            statEls.forEach((el, i) => {
                const t = parseInt(el.textContent) || targets[i];
                animateCountUp(el, t, suffixes[i]);
            });
            countUpDone = true;
        }, 300);
    });
}

// --- 15. SERVICE WORKER & PWA UYGULAMA İNDİRME SİSTEMİ ---
let deferredPrompt;
const installAppBtn = document.getElementById('installAppBtn');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installAppBtn) {
        installAppBtn.style.display = 'flex';
    }
});

if (installAppBtn) {
    const triggerInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`PWA Yükleme Sonucu: ${outcome}`);
        deferredPrompt = null;
        installAppBtn.style.display = 'none';
        
        if (window.innerWidth <= 992 && sidebar && sidebarOverlay) {
            sidebar.classList.remove('mobile-open');
            sidebarOverlay.classList.remove('active');
            if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'false');
        }
    };
    
    installAppBtn.addEventListener('click', triggerInstall);
    installAppBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            triggerInstall();
        }
    });
}

window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    console.log('PWA başarıyla yüklendi!');
    if (installAppBtn) {
        installAppBtn.style.display = 'none';
    }
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js', { scope: '/' })
            .then((registration) => console.log('✅ Service Worker kayıt başarılı:', registration))
            .catch((err) => console.log('❌ Service Worker kayıt hatası:', err));
    });
}

// =========================================================
// 16. ÇOKLU DİL MOTORU (TR / EN DESTEĞİ)
// =========================================================

const translations = {
    tr: {
        menu:["Ana Sayfa", "Günlük", "Eğitim", "Araçlar", "Eğlence", "Ayarlar", "İletişim", "Hakkında", "Gizlilik"],
        installBtn: "Uygulamayı İndir",
        welcomeTitle: "Hoş Geldiniz! 👋",
        welcomeDesc: "MuGöl PORTAL sistemine giriş yaptınız.",
        searchPlaceholder: "Uygulama ara...",
        openBtn: "Aç",
        contactTitle: "Bize Ulaşın",
        contactDesc: "Fikirleriniz, önerileriniz veya destek talepleriniz bizim için çok değerli. Formu doldurarak doğrudan ekibimize mesaj gönderebilirsiniz.",
        email: "E-Posta",
        settings: {
            lang: { title: "Sistem Dili", desc: "Platformun varsayılan dilini seçin." },
            theme: { title: "Karanlık Mod", desc: "Göz yorgunluğunu azaltmak için arayüzü koyu renklerle kullanın." },
            font: { title: "Yazı Boyutu", desc: "Tüm platformdaki metin boyutlarını ihtiyacınıza göre ayarlayın." },
            color: { title: "Renk Teması", desc: "Portal'ın vurgu rengini kişiselleştirin." },
            version: { title: "Sistem Sürümü", desc: "MuGöl PORTAL'ın mevcut lisanslı ve güncel sürüm bilgisi." },
            shortcut: { title: "Klavye Kısayolları", desc: "Portali daha hızlı kullanmak için kısayolları öğrenin." }
        },
        pullToRefresh: "Yenilemek için çekin"
    },
    en: {
        menu:["Home", "Daily", "Education", "Tools", "Entertainment", "Settings", "Contact", "About", "Privacy"],
        installBtn: "Download App",
        welcomeTitle: "Welcome! 👋",
        welcomeDesc: "You have successfully logged into MuGöl PORTAL.",
        searchPlaceholder: "Search app...",
        openBtn: "Open",
        contactTitle: "Contact Us",
        contactDesc: "Your ideas, suggestions, or support requests are very valuable to us. You can send a direct message to our team by filling out the form.",
        email: "Email",
        settings: {
            lang: { title: "System Language", desc: "Choose the default language for the platform." },
            theme: { title: "Dark Mode", desc: "Use a dark interface to reduce eye strain." },
            font: { title: "Font Size", desc: "Adjust text sizes across the platform to your needs." },
            color: { title: "Color Theme", desc: "Personalize the portal's accent color." },
            version: { title: "System Version", desc: "Current licensed and updated version of MuGöl PORTAL." },
            shortcut: { title: "Keyboard Shortcuts", desc: "Learn the shortcuts to use the portal faster." }
        },
        pullToRefresh: "Pull to refresh"
    }
};

function applyLanguage(lang) {
    const t = translations[lang];

    // 1. Sol Menü ve Sayfa Üst Başlığını Değiştirme
    const navItems = document.querySelectorAll('.nav-menu .nav-item:not(#installAppBtn)');
    navItems.forEach((item, index) => {
        const textEl = item.querySelector('.nav-text');
        if (textEl && t.menu[index]) {
            textEl.textContent = t.menu[index];
            item.setAttribute('data-title', t.menu[index]);
            
            // Eğer aktif menüyse sayfa başlığını da hemen güncelle
            if (item.classList.contains('active')) {
                const secTitle = document.getElementById('sectionTitle');
                if (secTitle) secTitle.textContent = t.menu[index];
            }
        }
    });

    // Uygulamayı İndir Butonu
    const installText = document.querySelector('#installAppBtn .nav-text');
    if (installText) installText.textContent = t.installBtn;

    // 2. Ana Sayfa Karşılama Alanı
    const welcomeH1 = document.querySelector('.welcome-text h1');
    if (welcomeH1) welcomeH1.textContent = t.welcomeTitle;
    const welcomeP = document.querySelector('.welcome-text p');
    if (welcomeP) welcomeP.textContent = t.welcomeDesc;

    // 3. İletişim Formu Sayfası
    const contactH3 = document.querySelector('.contact-left h3');
    if (contactH3) contactH3.textContent = t.contactTitle;
    const contactP = document.querySelector('.contact-left p');
    if (contactP) contactP.textContent = t.contactDesc;
    const emailPill = document.querySelector('.lang-email');
    if (emailPill) emailPill.textContent = t.email;

    // 4. Ayarlar Sayfası Metinleri
    const langT = document.getElementById('langTitle');
    const langD = document.getElementById('langDesc');
    if (langT) langT.textContent = t.settings.lang.title;
    if (langD) langD.textContent = t.settings.lang.desc;

    // Ayarlardaki diğer elemanları ikonları üzerinden hatasız bulup çeviriyoruz
    const updateSetting = (iconClass, key) => {
        const icon = document.querySelector(`.setting-item i.${iconClass}`);
        if (icon && icon.nextElementSibling) {
            const h4 = icon.nextElementSibling.querySelector('h4');
            const p = icon.nextElementSibling.querySelector('p');
            if (h4) h4.textContent = t.settings[key].title;
            if (p) p.textContent = t.settings[key].desc;
        }
    };
    updateSetting('fa-moon', 'theme');
    updateSetting('fa-text-height', 'font');
    updateSetting('fa-palette', 'color');
    updateSetting('fa-code-branch', 'version');
    updateSetting('fa-keyboard', 'shortcut');

    // 5. Arama Kutusu Placeholder
    const searchInp = document.getElementById('searchInput');
    if (searchInp) {
        const isMac = navigator.platform.toLowerCase().includes('mac');
        searchInp.placeholder = t.searchPlaceholder + ' (' + (isMac ? '⌘' : 'Ctrl') + '+K)';
    }

    // 6. Kartlardaki "Aç" Butonları
    document.querySelectorAll('.launch-btn .btn-label').forEach(el => el.textContent = t.openBtn);

    // 7. Aşağı Çekerek Yenile
    const ptrLabel = document.getElementById('ptr-label');
    if (ptrLabel && ptrLabel.textContent !== 'Yenileniyor...' && ptrLabel.textContent !== 'Refreshing...' && ptrLabel.textContent !== 'Bırakın, yenilensin' && ptrLabel.textContent !== 'Release to refresh') {
        ptrLabel.textContent = t.pullToRefresh;
    }
}

// ==========================================
// DİL SEÇİCİ BAŞLATMA VE HAFIZA SİSTEMİ
// ==========================================
const savedLang = localStorage.getItem('mugol-lang') || 'tr';
const langBtns = document.querySelectorAll('.lang-btn');

function updateLangButtons(activeLang) {
    langBtns.forEach(btn => {
        if (btn.getAttribute('data-lang') === activeLang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Butonlara tıklandığında dili değiştir ve LocalStorage'a kaydet
langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const selectedLang = btn.getAttribute('data-lang');
        localStorage.setItem('mugol-lang', selectedLang); 
        updateLangButtons(selectedLang);
        applyLanguage(selectedLang);
    });
});

// Sayfa yüklendiğinde hafızadaki dili otomatik uygula
updateLangButtons(savedLang);
applyLanguage(savedLang);