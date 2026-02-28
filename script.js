// --- DEĞİŞKENLER VE DOM ELEMENTLERİ ---
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page-section');
const sectionTitle = document.getElementById('sectionTitle');
const hamburgerBtn = document.getElementById('hamburgerBtn');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');

// --- 1. MENÜ GEÇİŞ SİSTEMİ ---
navItems.forEach(item => {
    item.addEventListener('click', () => {
        // Eğer "Uygulamayı İndir" butonuna tıklandıysa sayfa geçişi yapma
        if(item.id === 'installPwaBtn') return;

        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');

        const title = item.getAttribute('data-title');
        sectionTitle.textContent = title;

        const targetId = item.getAttribute('data-target');
        pages.forEach(page => {
            if (page.id === targetId) {
                page.classList.add('active');
            } else {
                page.classList.remove('active');
            }
        });

        if (window.innerWidth <= 992) {
            sidebar.classList.remove('mobile-open');
            sidebarOverlay.classList.remove('active');
        }
    });
});

// --- 2. SİDEBAR KONTROLLERİ ---
hamburgerBtn.addEventListener('click', () => {
    if (window.innerWidth > 992) {
        sidebar.classList.toggle('collapsed');
    } else {
        sidebar.classList.toggle('mobile-open');
        sidebarOverlay.classList.toggle('active');
    }
});

sidebarOverlay.addEventListener('click', () => {
    sidebar.classList.remove('mobile-open');
    sidebarOverlay.classList.remove('active');
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 992) {
        sidebar.classList.remove('mobile-open');
        sidebarOverlay.classList.remove('active');
    }
});

// --- 3. AYARLAR: TEMA VE YAZI BOYUTU ---
const themeSwitch = document.getElementById('themeSwitch');

const savedTheme = localStorage.getItem('mugol-theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
themeSwitch.checked = savedTheme === 'dark';

themeSwitch.addEventListener('change', (e) => {
    const theme = e.target.checked ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('mugol-theme', theme);
});

const fontBtns = document.querySelectorAll('.font-btn');
fontBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        fontBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const newSize = btn.getAttribute('data-size');
        document.documentElement.style.setProperty('--base-font-size', newSize);
    });
});

// --- 4. TARİH VE SAAT FONKSİYONU ---
function updateDateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    const timeEl = document.getElementById('timeDisplay');
    if (timeEl) timeEl.textContent = timeString;

    const options = { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' };
    const dateString = now.toLocaleDateString('tr-TR', options);
    const dateEl = document.getElementById('dateDisplay');
    if (dateEl) dateEl.textContent = dateString;
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
        charCountEl.style.color = len > 450 ? '#FF5630' : len > 350 ? '#FFAB00' : 'var(--text-muted)';
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

function resetContactForm() {
    const successEl = document.getElementById('formSuccess');
    if (successEl) successEl.style.display = 'none';
    if (contactForm) {
        contactForm.reset();
        contactForm.style.display = 'flex';
        if (charCountEl) charCountEl.textContent = '0 / 500';
    }
}

function copyEmail() {
    const email = 'mugol.education.help@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
        const btn = document.getElementById('copyEmailBtn');
        if (btn) {
            const orig = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Kopyalandı!';
            btn.style.background = 'rgba(0,135,90,0.1)';
            btn.style.borderColor = 'rgba(0,135,90,0.3)';
            btn.style.color = '#00875A';
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

// --- 6. YÖNLENDİRME TOAST (3 SANİYE GERİ SAYIM + İPTAL) ---
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
    toast.classList.remove('show');
    pendingUrl = null;
}

if(toastCancelBtn) toastCancelBtn.addEventListener('click', cancelToast);

function showRedirectToast(appName, url, logoSrc) {
    if (toastTimer) clearTimeout(toastTimer);
    if (toastCountdown) clearInterval(toastCountdown);
    pendingUrl = url;

    toastAppName.textContent = appName;
    const toastLogo = document.getElementById('toast-app-logo');
    if (toastLogo) { toastLogo.src = logoSrc || ''; }
    toastCountEl.textContent = '3';
    if (toastRing) {
        toastRing.style.strokeDashoffset = 0;
        toastRing.style.transition = 'none';
    }
    toast.classList.add('show');

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
        toast.classList.remove('show');
        if (pendingUrl) window.open(pendingUrl, '_blank');
        pendingUrl = null;
    }, 3000);
}

// Tüm app-card'lara tıklamayı yakala
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
    catCard.addEventListener('click', function () {
        const targetId = this.getAttribute('data-target');
        const menuItem = document.querySelector('.nav-item[data-target="' + targetId + '"]');
        if (menuItem) menuItem.click();
    });
});

// --- 8. AÇILIŞ ANİMASYONU ---
(function () {
    if (sessionStorage.getItem('skipSplash')) {
        sessionStorage.removeItem('skipSplash');
        const splash = document.getElementById('splash-screen');
        if (splash) { splash.style.display = 'none'; }
        return;
    }

    const particlesContainer = document.getElementById('splashParticles');
    if (particlesContainer) {
        for (let i = 0; i < 18; i++) {
            const p = document.createElement('div');
            p.className = 'splash-particle';
            const size = Math.random() * 6 + 3;
            p.style.cssText =[
                'width:' + size + 'px',
                'height:' + size + 'px',
                'left:' + Math.random() * 100 + '%',
                'animation-duration:' + (Math.random() * 6 + 5) + 's',
                'animation-delay:' + (Math.random() * 4) + 's',
            ].join(';');
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
        if (bar) bar.style.width = progress + '%';
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

        if (diff >= THRESHOLD) {
            ptrLabel.textContent = 'Bırakın, yenilensin';
        } else {
            ptrLabel.textContent = 'Yenilemek için çekin';
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
            ptrLabel.textContent = 'Yenileniyor...';
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
    { id: 'n1', icon: '🚀', title: 'MuGöl PORTAL v16 Yayında!', body: 'Bildirim paneli, gelişmiş iletişim formu ve yeni kısayollar eklendi.', time: 'Az önce' },
    { id: 'n2', icon: '🔍', title: 'Hızlı Arama', body: 'Ctrl+K ile istediğiniz uygulamayı anında bulun.', time: '2 gün önce' },
    { id: 'n3', icon: '🎨', title: 'Renk Teması', body: 'Ayarlar sayfasından portal rengini kişiselleştirebilirsiniz.', time: '3 gün önce' },
];

let readNotifs = JSON.parse(localStorage.getItem('mugol-read-notifs') || '[]');

function renderNotifications() {
    const list = document.getElementById('notifList');
    const dot = document.getElementById('notifDot');
    if (!list) return;

    const unread = NOTIFICATIONS.filter(n => !readNotifs.includes(n.id));
    if(dot) dot.style.display = unread.length > 0 ? 'block' : 'none';

    if (NOTIFICATIONS.length === 0) {
        list.innerHTML = '<div style="padding:2rem;text-align:center;color:var(--text-muted);font-weight:700;font-size:0.9rem;">Bildirim yok</div>';
        return;
    }

    list.innerHTML = NOTIFICATIONS.map(n => {
        const isRead = readNotifs.includes(n.id);
        return `<div data-notif-id="${n.id}" onclick="markNotifRead('${n.id}')" style="
            padding:14px 18px; border-bottom:1px solid var(--border-color);
            cursor:pointer; transition:background 0.15s ease;
            background:${isRead ? 'transparent' : 'rgba(67,24,255,0.04)'};
            display:flex; gap:12px; align-items:flex-start;"
            onmouseenter="this.style.background='rgba(67,24,255,0.06)'"
            onmouseleave="this.style.background='${isRead ? 'transparent' : 'rgba(67,24,255,0.04)'}'">
            <div style="font-size:1.4rem; flex-shrink:0; line-height:1;">${n.icon}</div>
            <div style="flex:1; min-width:0;">
                <div style="display:flex; align-items:center; justify-content:space-between; gap:8px; margin-bottom:3px;">
                    <span style="font-weight:${isRead ? 700 : 800}; font-size:0.88rem; color:var(--text-main);">${n.title}</span>
                    ${!isRead ? '<span style="width:8px;height:8px;background:var(--primary-color);border-radius:50%;flex-shrink:0;"></span>' : ''}
                </div>
                <div style="font-size:0.78rem; color:var(--text-muted); line-height:1.5; font-weight:600;">${n.body}</div>
                <div style="font-size:0.72rem; color:var(--text-muted); margin-top:4px; font-weight:700;">${n.time}</div>
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
}

const notifBtn = document.getElementById('notifBtn');
const notifPanel = document.getElementById('notifPanel');

if(notifBtn && notifPanel) {
    notifBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = notifPanel.style.display !== 'none';
        notifPanel.style.display = isOpen ? 'none' : 'block';
        if (!isOpen) renderNotifications();
    });

    const markAllBtn = document.getElementById('notifMarkAll');
    if(markAllBtn) {
        markAllBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            NOTIFICATIONS.forEach(n => { if (!readNotifs.includes(n.id)) readNotifs.push(n.id); });
            localStorage.setItem('mugol-read-notifs', JSON.stringify(readNotifs));
            renderNotifications();
        });
    }

    document.addEventListener('click', (e) => {
        if (!notifPanel.contains(e.target) && e.target !== notifBtn) {
            notifPanel.style.display = 'none';
        }
    });

    renderNotifications();
}

// --- 11. GLOBAL ARAMA ---
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

const searchBtn = document.getElementById('searchBtn');
if(searchBtn) searchBtn.addEventListener('click', openSearch);

function openSearch() {
    if(searchModal && searchInput) {
        searchModal.style.display = 'flex';
        searchInput.value = '';
        renderSearchResults('');
        setTimeout(() => searchInput.focus(), 50);
    }
}

window.closeSearch = function() {
    if(searchModal) searchModal.style.display = 'none';
}

if(searchModal) {
    searchModal.addEventListener('click', function (e) {
        if (e.target === searchModal) closeSearch();
    });
}

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeSearch();
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        if(hamburgerBtn) hamburgerBtn.click();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        const homeMenu = document.querySelector('.nav-item[data-target="page-anasayfa"]');
        if (homeMenu) homeMenu.click();
    }
});

if(searchInput) {
    searchInput.addEventListener('input', function () {
        renderSearchResults(this.value.trim().toLowerCase());
    });
}

function renderSearchResults(query) {
    const container = document.getElementById('searchResults');
    if(!container) return;
    
    const results = query === '' ? searchIndex.slice(0, 8) : searchIndex.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.desc.toLowerCase().includes(query) ||
        item.tag.toLowerCase().includes(query)
    );

    if (results.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:2rem;color:var(--text-muted);font-weight:700;">Sonuç bulunamadı</div>';
        return;
    }

    container.innerHTML = results.map(item => `
        <div class="search-result-item" data-url="${item.url}" data-name="${item.name}" data-img="${item.img}"
            style="display:flex;align-items:center;gap:14px;padding:11px 10px;border-radius:12px;cursor:pointer;transition:background 0.2s ease;">
            <img src="${item.img}" style="width:42px;height:42px;border-radius:10px;object-fit:cover;background:var(--bg-body);flex-shrink:0;"
                onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=4318ff&color=fff'">
            <div style="flex:1;min-width:0;">
                <div style="font-weight:800;font-size:0.95rem;color:var(--text-main);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${item.name}</div>
                <div style="font-size:0.78rem;color:var(--text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:600;">${item.desc}</div>
            </div>
            <span style="font-size:0.68rem;font-weight:800;color:var(--text-muted);background:var(--bg-body);padding:3px 10px;border-radius:20px;border:1px solid var(--border-color);flex-shrink:0;">${item.category || item.tag}</span>
        </div>
    `).join('');

    container.querySelectorAll('.search-result-item').forEach(el => {
        el.addEventListener('mouseenter', () => el.style.background = 'rgba(67,24,255,0.06)');
        el.addEventListener('mouseleave', () => el.style.background = 'transparent');
        el.addEventListener('click', () => {
            closeSearch();
            showRedirectToast(el.dataset.name, el.dataset.url, el.dataset.img);
        });
    });
}

const isMac = navigator.platform.toLowerCase().includes('mac');
if (searchInput) searchInput.placeholder = 'Uygulama ara... (' + (isMac ? '⌘' : 'Ctrl') + '+K)';

// --- 12. RENK TEMASI ---
const savedColor = localStorage.getItem('mugol-primary-color');
if (savedColor) {
    document.documentElement.style.setProperty('--primary-color', savedColor);
    document.querySelectorAll('.color-swatch').forEach(s => {
        s.classList.toggle('active', s.getAttribute('data-color') === savedColor);
    });
}

document.querySelectorAll('.color-swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
        const color = swatch.getAttribute('data-color');
        document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
        document.documentElement.style.setProperty('--primary-color', color);
        localStorage.setItem('mugol-primary-color', color);
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

// --- 14. COUNT-UP ANİMASYONU (Hakkında sayfası) ---
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
            const targets = [14, 3, 2025];
            const suffixes = ['', '', ''];
            statEls.forEach((el, i) => {
                const t = parseInt(el.textContent) || targets[i];
                animateCountUp(el, t, suffixes[i]);
            });
            countUpDone = true;
        }, 300);
    });
}

// --- 15. SERVICE WORKER KAYDI (PWA) ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js', { scope: './' })
            .then((registration) => {
                console.log('✅ Service Worker kayıt başarılı:', registration);
            })
            .catch((err) => {
                console.log('❌ Service Worker kayıt hatası:', err);
            });
    });
}

// --- 16. PWA UYGULAMA İNDİR (INSTALL PROMPT) ---
let deferredPrompt;
const installBtn = document.getElementById('installPwaBtn');

window.addEventListener('beforeinstallprompt', (e) => {
    // Tarayıcının varsayılan "Ana ekrana ekle" çubuğunu otomatik göstermesini engelle
    e.preventDefault();
    // Prompt'u daha sonra "İndir" butonuna tıklanınca göstermek üzere değişkene kaydet
    deferredPrompt = e;
});

if (installBtn) {
    installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
            // Kullanıcıya yükleme popup'ını (prompt) göster
            deferredPrompt.prompt();
            // Kullanıcının kabul edip etmediğini bekle ve sonucu al
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`PWA Kurulum sonucu: ${outcome}`);
            
            // Prompt sadece bir kez gösterilebilir, işlemi sıfırla
            deferredPrompt = null;
        } else {
            // Eğer deferredPrompt yoksa (PWA zaten kuruluysa, desteklenmiyorsa veya iOS ise)
            alert('Tarayıcınız otomatik indirmeyi desteklemiyor veya uygulama zaten cihazınıza yüklü.\n\n(Eğer iPhone/Safari kullanıyorsanız: Alt kısımdaki "Paylaş" ikonuna tıklayıp "Ana Ekrana Ekle" seçeneğini seçerek yükleyebilirsiniz.)');
        }
    });
}