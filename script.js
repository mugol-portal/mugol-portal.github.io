window.mgEsc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

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
};

// ── Hazır metinler (geri bildirim / iletişim formu) ──
(function () {
    var box = document.getElementById('contactTemplates');
    var ta  = document.getElementById('contact-message');
    var sel = document.getElementById('contact-category');
    if (!box || !ta) return;

    var TPL = {
        oneri:    { cat: '💡 Öneri',          text: 'Merhaba, MuGöl PORTAL için bir önerim var: ' },
        ozellik:  { cat: '💡 Öneri',          text: 'Merhaba, portalda şu özelliğin olmasını çok isterim: ' },
        hata:     { cat: '🐛 Hata Bildirimi', text: 'Merhaba, bir hata ile karşılaştım.\nNerede: \nNe oldu: \nCihaz / tarayıcı: ' },
        destek:   { cat: '🆘 Destek Talebi',  text: 'Merhaba, yardıma ihtiyacım var. Sorunum şu: ' },
        is:       { cat: '🤝 İş Birliği',     text: 'Merhaba, sizinle iş birliği yapmak istiyorum. Teklifim: ' },
        tesekkur: { cat: '💬 Diğer',          text: 'Merhaba, MuGöl PORTAL için teşekkür etmek istedim. ' }
    };
    var lastTpl = '';   // mesaja en son eklenen şablon metni

    function setActive(key) {
        box.querySelectorAll('.ct-chip').forEach(function (b) {
            b.classList.toggle('on', b.getAttribute('data-tpl') === key);
        });
    }

    box.addEventListener('click', function (e) {
        var b = e.target.closest ? e.target.closest('.ct-chip') : null;
        if (!b) return;
        var key = b.getAttribute('data-tpl');
        var t = TPL[key];
        if (!t) return;

        var cur = ta.value;
        var max = parseInt(ta.getAttribute('maxlength'), 10) || 500;
        // Boşsa ya da yalnızca önceki hazır metin varsa değiştir; kullanıcı yazdıysa altına ekle
        var replace = (!cur.trim() || cur === lastTpl);
        var next = replace ? t.text : cur.replace(/\s+$/, '') + '\n\n' + t.text;
        ta.value = next.slice(0, max);
        lastTpl = replace ? ta.value : '';

        if (sel) sel.value = t.cat;
        setActive(key);
        ta.dispatchEvent(new Event('input', { bubbles: true }));   // karakter sayacı güncellensin
        ta.focus();
        try { ta.setSelectionRange(ta.value.length, ta.value.length); } catch (err) {}
    });

    // Kullanıcı metni değiştirince "seçili" vurgusu kalksın
    ta.addEventListener('input', function () {
        if (this.value !== lastTpl) { setActive(''); }
    });

    // Form sıfırlanınca da temizle
    var origReset = window.resetContactForm;
    window.resetContactForm = function () {
        if (typeof origReset === 'function') origReset();
        lastTpl = ''; setActive('');
    };
})();

// =========================================================
// 6. YÖNLENDİRME TOAST (POP-UP ENGELLEYİCİ ÇÖZÜMLÜ)
// =========================================================

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



(function () {
    const bar = document.getElementById('splashProgressBar');
    const label = document.getElementById('splashProgressLabel');
    const splash = document.getElementById('splash-screen');
    const splashVideo = document.getElementById('splashVideo');
    const splashLogoFallback = document.getElementById('splashLogoFallback');

    // ── AYARLAR ──────────────────────────────────────────────
    // Açılış süresini VİDEO belirler (mugol_acilis.mp4 = 15 sn).
    // Videoyu tekrar uzatıp kısaltırsan kodda hiçbir şey değiştirmen gerekmez.
    // VİDEO ve MÜZİK birlikte SPLASH_TARGET_SEC saniyede biter. Hız, dosya süresinden otomatik hesaplanır
    // (15 sn → 3.75x). Müzik tonu bozulmadan (preservesPitch) hızlandırılır.
    const SPLASH_TARGET_SEC   = 6;   // açılış animasyonu süresi (saniye)
    let   SPLASH_VIDEO_RATE   = 15 / SPLASH_TARGET_SEC;   // metadata gelince gerçek süreye göre yeniden hesaplanır
    const SPLASH_END_HOLD_MS  = 100;   // video bitince son karede bekleme
    const SPLASH_SAFETY_PAD_MS = 2000; // 'ended' hiç gelmezse güvenlik süresi
    const FALLBACK_MS         = SPLASH_TARGET_SEC * 1000;  // video hiç oynamazsa kullanılacak süre

    const labels = ['Başlatılıyor', 'Uygulamalar hazırlanıyor', 'Son ayarlar yapılıyor', 'Hoş geldiniz'];

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

    // Video kapandıktan sonra bellekte/decoder'da kalmasın (düşük donanımlı telefonlarda kasma yapıyordu)
    function releaseSplashVideo() {
        if (!splashVideo) return;
        try { splashVideo.pause(); splashVideo.removeAttribute('src'); splashVideo.load(); } catch (e) {}
    }

    // ── Splash'i kapat (tek sefer) ──
    function closeSplash() {
        if (closed) return;
        closed = true;
        if (progressTimer) clearInterval(progressTimer);
        if (safetyTimer) clearTimeout(safetyTimer);
        if (bar) bar.style.width = '100%';
        if (label) label.textContent = labels[labels.length - 1];
        setTimeout(() => {
            if (splash) {
                splash.style.opacity = '0';
                setTimeout(() => {
                    splash.classList.add('hidden');
                    releaseSplashVideo();
                }, 450);
            }
        }, 100);
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
        releaseSplashVideo();
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
            if (isFinite(splashVideo.duration) && splashVideo.duration > 0) SPLASH_VIDEO_RATE = splashVideo.duration / SPLASH_TARGET_SEC;
            splashVideo.playbackRate = SPLASH_VIDEO_RATE;
            if (!videoFailed) startVideoProgress();
        });
        // Metadata script çalışmadan önce yüklendiyse olay kaçmış olabilir
        if (splashVideo.readyState >= 1 && !videoFailed) {
            if (isFinite(splashVideo.duration) && splashVideo.duration > 0) SPLASH_VIDEO_RATE = splashVideo.duration / SPLASH_TARGET_SEC;
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
})();

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
        <div class="mg-search-item" data-url="${mgEsc(item.url)}" data-name="${mgEsc(item.name)}" data-img="${mgEsc(item.img)}"
             style="display:flex;align-items:center;gap:14px;padding:12px 10px;border-radius:14px;cursor:pointer;transition:background .15s;">
            ${item.img ? `<img src="${mgEsc(item.img)}" alt="" style="width:36px;height:36px;border-radius:10px;object-fit:cover;border:1px solid var(--border-color);">` : `<div style="width:36px;height:36px;border-radius:10px;background:var(--bg-body);display:flex;align-items:center;justify-content:center;"><i class="fas fa-th-large" style="color:var(--primary-color);font-size:1rem;"></i></div>`}
            <span style="font-weight:800;color:var(--text-main);font-size:.95rem;">${mgEsc(item.name)}</span>
            <i class="fas fa-arrow-right" style="margin-left:auto;color:var(--text-muted);font-size:.8rem;"></i>
        </div>`).join('');
    resultsEl.querySelectorAll('.mg-search-item').forEach(function (el) {
        el.addEventListener('click', function () {
            var u = el.dataset.url || '', n = el.dataset.name || '', i = el.dataset.img || '';
            if (/^\s*(javascript|data|vbscript):/i.test(u)) return;
            closeSearch();
            if (typeof openAppWithAd === 'function') openAppWithAd(u, n, i);
            else window.open(u, '_blank', 'noopener,noreferrer');
        });
    });
}

if (searchInput) {
    searchInput.addEventListener('input', function() {
        renderSearchResults(this.value);
    });
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            var first = document.querySelector('#searchResults .mg-search-item');
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
        // Aktif swatch'ı güncelle
        document.querySelectorAll('.color-swatch').forEach(sw => sw.classList.remove('active'));
        swatch.classList.add('active');
    });
});

// =========================================================
// 13. YUKARI KAYDIR VE DİL SİSTEMİ
// =========================================================

const translations = {
    tr: { welcomeTitle: "Hoş Geldiniz! 👋", pullToRefresh: "Yenilemek için çekin" },
    en: { welcomeTitle: "Welcome! 👋", pullToRefresh: "Pull to refresh" }
};

function applyLanguage(lang) {
    const t = translations[lang];
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
            : 'Sürüm 9.0.0';
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

    // Profil içeriğini her zaman göster
    var icerikPanel = document.getElementById('profil-icerik');
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
            logoEl.innerHTML = '<img src="' + mgEsc(logoSrc) + '" style="width:32px;height:32px;border-radius:8px;object-fit:cover;" onerror="this.parentNode.textContent=\'🚀\'">';
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


// (Bildirim sistemi artık ayrı dosyada: notifications.js)


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

    function init() {
        apply(stored() || auto(), false);
        document.querySelectorAll('.mg-mode-btn').forEach(function (b) {
            b.addEventListener('click', function () { apply(b.getAttribute('data-mode'), true); });
        });
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();


/* ═════════════ GÜNÜN SÖZÜ (MuGöl Edebiyat · data_quotes.js) ═════════════ */
(function () {
    var textEl = document.getElementById('mgQuoteText');
    if (!textEl) return;
    var authorEl = document.getElementById('mgQuoteAuthor');
    var bookEl = document.getElementById('mgQuoteBook');
    var SRC = 'https://mugol-portal.github.io/mugol.-edebiyat/data_quotes.js';
    var CACHE = 'mg-quotes-cache-v1';
    var fallback = [
        { authorName: 'Sabahattin Ali', text: 'Dünyada hayatın bir tek manası varsa o da sevmektir.', book: 'Kürk Mantolu Madonna' },
        { authorName: 'Fyodor Dostoyevski', text: 'Her insan, herkesin önünde, her şeyden sorumludur.', book: 'Karamazov Kardeşler' },
        { authorName: 'Oğuz Atay', text: 'Kelimeler albayım, bazı anlamlara gelmiyor.', book: 'Tehlikeli Oyunlar' },
        { authorName: 'Nazım Hikmet Ran', text: 'Yaşamak şakaya gelmez, büyük bir ciddiyetle yaşayacaksın.', book: 'Yaşamaya Dair' },
        { authorName: 'Cemal Süreya', text: 'Hayat kısa, kuşlar uçuyor.', book: 'Sevda Sözleri' },
        { authorName: 'Oscar Wilde', text: 'Sanat, hayatı taklit etmez; hayat sanatı taklit eder.', book: 'Sanat Üzerine Denemeler' }
    ];
    function dayNum() { var d = new Date(); return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000); }
    function render(list) {
        if (!list || !list.length) return;
        var q = list[dayNum() % list.length];
        if (!q || !q.text) return;
        textEl.textContent = q.text;
        if (authorEl) authorEl.textContent = q.authorName || q.author || '';
        if (bookEl) { bookEl.textContent = q.book || ''; bookEl.style.display = q.book ? '' : 'none'; }
    }
    var cached = null;
    try { cached = JSON.parse(localStorage.getItem(CACHE) || 'null'); } catch (e) {}
    render(cached && cached.length ? cached : fallback);
    /* Edebiyat verisini arka planda çek (CORS gerekmez); başarısız olursa mevcut söz kalır */
    try {
        var s = document.createElement('script');
        s.src = SRC; s.async = true;
        s.onload = function () {
            try {
                if (typeof localQuotesData !== 'undefined' && localQuotesData.length) {
                    render(localQuotesData);
                    try { localStorage.setItem(CACHE, JSON.stringify(localQuotesData)); } catch (e) {}
                }
            } catch (e) {}
        };
        s.onerror = function () {};
        document.head.appendChild(s);
    } catch (e) {}
})();


/* ═════════════ GÜNÜN HADİSİ (MuGöl İmsak Vakti · sozler.json) ═════════════ */
(function () {
    var textEl = document.getElementById('mgHadithText');
    if (!textEl) return;
    var srcEl = document.getElementById('mgHadithSource');
    var SRC = 'https://mugol-portal.github.io/mugol.imsak-vakti/sozler.json';
    var CACHE = 'mg-hadith-cache-v1';
    var fallback = [
        { text: 'Sizin en hayırlınız, Kur\'an\'ı öğrenen ve öğretendir.', source: 'Hadis-i Şerif (Buhari)' },
        { text: 'Allah sizin ne dış görünüşünüze ne de mallarınıza bakar. O sadece sizin kalplerinize ve işlerinize bakar.', source: 'Hadis-i Şerif (Müslim)' },
        { text: 'Namaz dinin direğidir, kim onu terk ederse dinini yıkmış olur.', source: 'Hadis-i Şerif (Tirmizi)' }
    ];
    function dayNum() { var d = new Date(); return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000); }
    function onlyHadith(arr) {
        return (arr || []).filter(function (x) { return x && x.text && /hadis/i.test(x.source || ''); });
    }
    function render(list) {
        list = onlyHadith(list);
        if (!list.length) return false;
        var q = list[(dayNum() + 7) % list.length];
        textEl.textContent = q.text;
        if (srcEl) srcEl.textContent = (q.source || 'Hadis-i Şerif').replace(/^Hadis-i Şerif\s*/i, '').replace(/[()]/g, '') || 'Hadis-i Şerif';
        return true;
    }
    var cached = null;
    try { cached = JSON.parse(localStorage.getItem(CACHE) || 'null'); } catch (e) {}
    if (!render(cached)) render(fallback);
    try {
        fetch(SRC, { cache: 'no-cache' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (data) {
            if (data && render(data)) { try { localStorage.setItem(CACHE, JSON.stringify(onlyHadith(data))); } catch (e) {} }
        }).catch(function () {});
    } catch (e) {}
})();


/* ═════════════ GÜNÜN SORUSU (MuGöl Bilgin · mugol-bilgin/sorular) — mesaj kutusu + seri ═════════════ */
(function () {
    var card = document.getElementById('mgSoruCard');
    var textEl = document.getElementById('mgSoruText');
    if (!card || !textEl) return;
    var catEl = document.getElementById('mgSoruCat');
    var streakEl = document.getElementById('mgSoruStreak');
    var API = 'https://api.github.com/repos/mugol-portal/mugol-bilgin/contents/sorular';
    var BASE = 'https://mugol-portal.github.io/mugol-bilgin/';
    var CACHE = 'mg-soru-cache-v2', STATE = 'mg-soru-state-v1';
    var LETTERS = ['A', 'B', 'C', 'D', 'E'];
    var fallback = [
        { text: 'Dünyanın en büyük okyanusu hangisidir?', cat: 'Genel Kültür', opts: ['Atlas Okyanusu', 'Hint Okyanusu', 'Pasifik Okyanusu', 'Arktik Okyanusu'], ans: 2 },
        { text: 'Türkiye Cumhuriyeti hangi yıl ilan edilmiştir?', cat: 'Tarih', opts: ['1920', '1923', '1919', '1938'], ans: 1 },
        { text: 'Işığın boşluktaki hızı yaklaşık kaç km/sn\'dir?', cat: 'Fizik', opts: ['150.000', '300.000', '30.000', '3.000.000'], ans: 1 }
    ];
    var QKEYS = ['soru', 'question', 'soruMetni', 'soru_metni', 'q', 'sorusu', 'text', 'metin', 'baslik', 'title'];
    var CKEYS = ['kategori', 'category', 'konu', 'ders', 'topic'];
    var OKEYS = ['secenekler', 'seçenekler', 'options', 'siklar', 'şıklar', 'choices', 'cevaplar', 'answers'];
    var AKEYS = ['dogru', 'doğru', 'cevap', 'dogruCevap', 'dogru_cevap', 'dogruSecenek', 'dogru_secenek', 'dogruSik', 'dogru_sik', 'answer', 'correct', 'correctAnswer', 'correct_answer', 'dogruIndex', 'correctIndex'];

    function dayNum() { var d = new Date(); return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000); }
    function today() { var d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
    function pick(o, keys) { for (var i = 0; i < keys.length; i++) { var v = o[keys[i]]; if (typeof v === 'string' && v.trim()) return v.trim(); } return ''; }

    /* ── şık / doğru cevap ayrıştırma ── */
    function getOpts(o) {
        var arr = null, list = [];
        OKEYS.forEach(function (k) { if (!arr && o[k]) arr = o[k]; });
        if (Array.isArray(arr)) {
            list = arr.map(function (x) { return typeof x === 'string' || typeof x === 'number' ? String(x) : (x && (x.text || x.metin || x.secenek || x.label || x.value)) || ''; });
        } else if (arr && typeof arr === 'object') {
            Object.keys(arr).sort().forEach(function (k) { list.push(String(arr[k])); });
        }
        if (!list.length) ['a', 'b', 'c', 'd', 'e'].forEach(function (l) { var v = o[l] != null ? o[l] : o[l.toUpperCase()]; if (v != null && v !== '') list.push(String(v)); });
        return list.filter(function (s) { return s.trim(); }).slice(0, 5);
    }
    function getAns(o, opts) {
        var v, k = '';
        for (var i = 0; i < AKEYS.length; i++) { var x = o[AKEYS[i]]; if (x !== undefined && x !== null && x !== '') { v = x; k = AKEYS[i]; break; } }
        if (v === undefined || !opts.length) return -1;
        if (typeof v === 'string' && /^\d+$/.test(v.trim())) v = parseInt(v, 10);
        if (typeof v === 'number') {
            if (/index|idx/i.test(k) || v === 0) return v < opts.length ? v : -1;
            return v >= 1 && v <= opts.length ? v - 1 : -1;
        }
        var s = String(v).trim(), low = s.toLowerCase();
        for (var j = 0; j < opts.length; j++) { if (opts[j].trim().toLowerCase() === low) return j; }
        if (/^[a-e]$/i.test(s)) { var li = s.toUpperCase().charCodeAt(0) - 65; return li < opts.length ? li : -1; }
        return -1;
    }
    function collect(node, out, depth, fileCat) {
        if (!node || depth > 5) return;
        if (Array.isArray(node)) { node.forEach(function (n) { collect(n, out, depth + 1, fileCat); }); return; }
        if (typeof node !== 'object') return;
        var q = pick(node, QKEYS);
        if (q.length > 8) { var opts = getOpts(node); out.push({ text: q, cat: pick(node, CKEYS) || fileCat || '', opts: opts, ans: getAns(node, opts) }); return; }
        Object.keys(node).forEach(function (k) { collect(node[k], out, depth + 1, fileCat); });
    }

    /* ── cevap durumu + seri ── */
    function load() { try { return JSON.parse(localStorage.getItem(STATE) || '{}') || {}; } catch (e) { return {}; } }
    function save(s) { try { localStorage.setItem(STATE, JSON.stringify(s)); } catch (e) {} }
    function liveStreak(s) { return s.last && dayNum() - s.lastDay <= 1 ? (s.count || 0) : 0; }
    function streakText() {
        var s = load(), n = liveStreak(s);
        if (n > 0) return '🔥 ' + n + ' gün';
        return s.best > 0 ? '🏆 Rekor ' + s.best : '';
    }

    var current = null, modal = null, els = {}, lastFocus = null;

    function refreshCard() {
        var st = load(), t = streakText();
        if (streakEl) { streakEl.hidden = !t; streakEl.textContent = t; }
        if (!catEl || !current) return;
        var base = current.cat ? current.cat + ' · ' : '';
        if (st.answeredDay === today() && current.ans > -1) catEl.textContent = base + (st.ok ? 'Doğru bildin ✓' : 'Cevaplandı');
        else catEl.textContent = base + 'Cevaplamak için dokun';
    }

    /* ── mesaj kutusu ── */
    function build() {
        if (modal) return;
        modal = document.createElement('div');
        modal.id = 'mgSoruModal'; modal.className = 'mg-sq-modal'; modal.hidden = true;
        modal.setAttribute('role', 'dialog'); modal.setAttribute('aria-modal', 'true'); modal.setAttribute('aria-labelledby', 'mgSqQ');
        modal.innerHTML =
            '<div class="mg-sq-backdrop"></div>' +
            '<div class="mg-sq-sheet">' +
              '<div class="mg-sq-head"><span class="mg-sq-badge"><i class="fas fa-circle-question" aria-hidden="true"></i> GÜNÜN SORUSU</span>' +
              '<span class="mg-sq-streak" hidden></span><button type="button" class="mg-sq-close" aria-label="Kapat"><i class="fas fa-xmark" aria-hidden="true"></i></button></div>' +
              '<div class="mg-sq-cat"></div>' +
              '<h3 class="mg-sq-q" id="mgSqQ"></h3>' +
              '<div class="mg-sq-opts"></div>' +
              '<div class="mg-sq-res" aria-live="polite"></div>' +
              '<a class="mg-sq-site" href="' + BASE + '" target="_blank" rel="noopener">MuGöl Bilgin\'de daha fazla soru <i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i></a>' +
            '</div>';
        document.body.appendChild(modal);
        els = {
            cat: modal.querySelector('.mg-sq-cat'), q: modal.querySelector('.mg-sq-q'), opts: modal.querySelector('.mg-sq-opts'),
            res: modal.querySelector('.mg-sq-res'), streak: modal.querySelector('.mg-sq-streak')
        };
        modal.querySelector('.mg-sq-backdrop').addEventListener('click', close);
        modal.querySelector('.mg-sq-close').addEventListener('click', close);
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) close(); });
    }
    function paintStreak() {
        var t = streakText();
        els.streak.hidden = !t; els.streak.textContent = t;
    }
    function lockOptions(chosen) {
        var q = current, known = q.ans > -1, ok = known && chosen === q.ans;
        els.opts.querySelectorAll('.mg-sq-opt').forEach(function (b, i) {
            b.disabled = true;
            if (known && i === q.ans) b.classList.add('is-correct');
            else if (i === chosen) b.classList.add(known ? 'is-wrong' : 'is-picked');
        });
        return { known: known, ok: ok };
    }
    function resultMessage(r, chosen, fresh) {
        var q = current, n = liveStreak(load());
        els.res.className = 'mg-sq-res show ' + (r.known ? (r.ok ? 'ok' : 'bad') : 'neutral');
        if (!r.known) { els.res.textContent = 'Seçimin kaydedildi. Doğru cevabı MuGöl Bilgin\'de görebilirsin.'; return; }
        if (r.ok) els.res.textContent = '🎉 Doğru bildin!' + (n > 1 ? ' ' + n + ' günlük serin devam ediyor.' : ' Serin başladı, yarın da gel!');
        else els.res.textContent = 'Olmadı. Doğru cevap: ' + LETTERS[q.ans] + ') ' + q.opts[q.ans] + '. Yarın yeni soruyla serini yeniden başlat.';
    }
    function answer(chosen) {
        var r = lockOptions(chosen), s = load();
        if (r.known && s.answeredDay !== today()) {
            if (r.ok) {
                s.count = (s.last && dayNum() - s.lastDay === 1) ? (s.count || 0) + 1 : 1;
                s.lastDay = dayNum(); s.last = today(); s.best = Math.max(s.best || 0, s.count);
            } else { s.count = 0; }
            s.answeredDay = today(); s.chosen = chosen; s.ok = r.ok;
            save(s);
        }
        paintStreak(); refreshCard(); resultMessage(r, chosen, true);
    }
    function open() {
        if (!current) return;
        build();
        lastFocus = document.activeElement;
        els.cat.textContent = current.cat || 'MuGöl Bilgin';
        els.q.textContent = current.text;
        els.opts.innerHTML = ''; els.res.className = 'mg-sq-res'; els.res.textContent = '';
        (current.opts || []).forEach(function (t, i) {
            var b = document.createElement('button');
            b.type = 'button'; b.className = 'mg-sq-opt';
            var l = document.createElement('b'); l.textContent = LETTERS[i];
            var s = document.createElement('span'); s.textContent = t;
            b.appendChild(l); b.appendChild(s);
            b.addEventListener('click', function () { answer(i); });
            els.opts.appendChild(b);
        });
        if (!current.opts || current.opts.length < 2) {
            els.res.className = 'mg-sq-res show neutral';
            els.res.textContent = 'Bu soru için şıklar yüklenemedi. Cevaplamak için MuGöl Bilgin\'e göz at.';
        }
        paintStreak();
        var st = load();
        if (st.answeredDay === today() && typeof st.chosen === 'number' && st.chosen < (current.opts || []).length) {
            var r = lockOptions(st.chosen); resultMessage(r, st.chosen, false);
        }
        modal.hidden = false;
        document.documentElement.classList.add('mg-sq-lock');
        requestAnimationFrame(function () { modal.classList.add('open'); });
        var cb = modal.querySelector('.mg-sq-close'); if (cb) cb.focus({ preventScroll: true });
    }
    function close() {
        if (!modal || modal.hidden) return;
        modal.classList.remove('open');
        document.documentElement.classList.remove('mg-sq-lock');
        setTimeout(function () { modal.hidden = true; }, 220);
        if (lastFocus && lastFocus.focus) { try { lastFocus.focus({ preventScroll: true }); } catch (e) {} }
    }
    card.addEventListener('click', open);
    card.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });

    function show(q) {
        if (!q || !q.text) return false;
        current = q; textEl.textContent = q.text; refreshCard(); return true;
    }
    function fetchJson(url) { return fetch(url, { cache: 'no-cache' }).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; }); }
    function loadAll() {
        return fetchJson(API).then(function (files) {
            var urls = [];
            if (Array.isArray(files)) {
                files.filter(function (f) { return f.type === 'file' && /\.json$/i.test(f.name); })
                     .sort(function (a, b) { return a.name < b.name ? -1 : 1; }).slice(0, 15)
                     .forEach(function (f) { urls.push({ url: f.download_url, cat: f.name.replace(/\.json$/i, '').replace(/[-_]+/g, ' ') }); });
            }
            if (!urls.length) ['sorular/sorular.json', 'sorular/index.json', 'sorular/data.json', 'sorular.json'].forEach(function (p) { urls.push({ url: BASE + p, cat: '' }); });
            return Promise.all(urls.map(function (u) { return fetchJson(u.url).then(function (d) { var o = []; collect(d, o, 0, u.cat); return o; }); }));
        }).then(function (parts) { var all = [].concat.apply([], parts || []); return all.length ? all : null; });
    }

    var cached = null;
    try { cached = JSON.parse(localStorage.getItem(CACHE) || 'null'); } catch (e) {}
    if (cached && cached.day === today() && show(cached.q)) return;
    show(fallback[dayNum() % fallback.length]);
    try {
        loadAll().then(function (list) {
            if (!list) return;
            var q = list[(dayNum() + 13) % list.length];
            if (show(q)) { try { localStorage.setItem(CACHE, JSON.stringify({ day: today(), q: q })); } catch (e) {} }
        }).catch(function () {});
    } catch (e) {}
})();


/* ═════════════ GÜNÜN SÖZÜ / HADİSİ KAYDIRICI (kaydırmalı + otomatik) ═════════════ */
(function () {
    var track = document.getElementById('mgQuoteTrack');
    var dotsWrap = document.getElementById('mgQuoteDots');
    if (!track || !dotsWrap) return;
    var cards = Array.prototype.slice.call(track.children);
    var dots = Array.prototype.slice.call(dotsWrap.children);
    var activeIdx = 0, autoTimer = null, interacting = false, deb = null;
    function setActive(i) { activeIdx = i; dots.forEach(function (d, k) { d.classList.toggle('active', k === i); }); }
    function goTo(i) {
        if (!cards[i]) return;
        track.scrollTo({ left: cards[i].offsetLeft - track.offsetLeft, behavior: 'smooth' });
        setActive(i);
    }
    function startAuto() {
        stopAuto();
        autoTimer = setInterval(function () { if (!interacting && !document.hidden) goTo((activeIdx + 1) % cards.length); }, 6000);
    }
    function stopAuto() { if (autoTimer) clearInterval(autoTimer); autoTimer = null; }
    track.addEventListener('scroll', function () {
        interacting = true;
        clearTimeout(deb);
        deb = setTimeout(function () {
            var best = 0, bd = Infinity;
            cards.forEach(function (c, i) {
                var d = Math.abs(c.offsetLeft - track.offsetLeft - track.scrollLeft);
                if (d < bd) { bd = d; best = i; }
            });
            setActive(best);
            interacting = false;
        }, 150);
    }, { passive: true });
    dots.forEach(function (d, i) { d.addEventListener('click', function () { goTo(i); }); });
    document.addEventListener('visibilitychange', function () { if (document.hidden) stopAuto(); else startAuto(); });
    /* dikey kaydırma önceliği */
    var sx = 0, sy = 0, decided = false;
    track.addEventListener('touchstart', function (e) {
        if (!e.touches || !e.touches[0]) return;
        sx = e.touches[0].clientX; sy = e.touches[0].clientY; decided = false; track.style.touchAction = 'pan-y';
    }, { passive: true });
    track.addEventListener('touchmove', function (e) {
        if (!e.touches || !e.touches[0] || decided) return;
        var dx = e.touches[0].clientX - sx, dy = e.touches[0].clientY - sy;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
            decided = true;
            if (Math.abs(dx) > Math.abs(dy) * 1.2) track.style.touchAction = 'pan-x';
        }
    }, { passive: true });
    startAuto();
})();


/* =========================================================
   ÖNEMLİ GÜNLERDE AÇILIŞ KUTLAMA / TEBRİK EKRANI
   - Splash bittikten sonra, o güne ait tebrik RESMİ (mesaj/<kimlik>.png) tam ekran açılır (günde bir kez, her gün için ayrı).
   - Resim klasörde yoksa o gün için hiçbir şey gösterilmez.
   - Önizleme: adresin sonuna ?kutlama=ogretmenler gibi bir kimlik ekleyin (kimlikler OCC listesinde).
   - Dini günler (Diyanet) her yıl aşağıdaki DINI listesine eklenir. Listede olmayan yıllarda
     bayramlar Hicri takvimden tahmini hesaplanır (Diyanet ile ±1 gün fark olabilir).
   ========================================================= */
(function () {
    'use strict';

    // Her kutlama kimliği için resim: mesaj/<kimlik>.png (veya .jpg / .jpeg / .webp)
    // solemn: true → anma günü, konfeti yok
    var IMG_DIR = 'mesaj/', EXT = ['.png', '.jpg', '.jpeg', '.webp'];
    var OCC = {
        'yilbasi': {},
        'kadinlar': {},
        'canakkale': { solemn: true },
        '23nisan': {},
        '1mayis': {},
        '19mayis': {},
        'anneler': {},
        'babalar': {},
        '15temmuz': { solemn: true },
        '30agustos': {},
        '29ekim': {},
        '10kasim': { solemn: true },
        'ogretmenler': {},
        'ramazan': {},
        'arefe-r': {},
        'bayram-r': {},
        'arefe-k': {},
        'bayram-k': {},
        'mirac': {},
        'berat': {}
    };

    var FIXED = { '1-1': 'yilbasi', '3-8': 'kadinlar', '3-18': 'canakkale', '4-23': '23nisan', '5-1': '1mayis', '5-19': '19mayis',
                  '7-15': '15temmuz', '8-30': '30agustos', '10-29': '29ekim', '11-10': '10kasim', '11-24': 'ogretmenler' };

    // [yıl, ay, gün, kimlik] — Diyanet dini günler takvimi (2027 doğrulandı). Her yıl yenisini ekleyin.
    var DINI = [
        [2027, 1, 4, 'mirac'], [2027, 1, 22, 'berat'], [2027, 2, 8, 'ramazan'],
        [2027, 3, 8, 'arefe-r'], [2027, 3, 9, 'bayram-r'], [2027, 3, 10, 'bayram-r'], [2027, 3, 11, 'bayram-r'],
        [2027, 5, 15, 'arefe-k'], [2027, 5, 16, 'bayram-k'], [2027, 5, 17, 'bayram-k'], [2027, 5, 18, 'bayram-k'], [2027, 5, 19, 'bayram-k']
    ];

    function nthSunday(y, m, n) { var off = (7 - new Date(y, m - 1, 1).getDay()) % 7; return 1 + off + (n - 1) * 7; }

    function hijri(d) {
        try {
            var o = {};
            new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', { day: 'numeric', month: 'numeric' })
                .formatToParts(d).forEach(function (p) { o[p.type] = +p.value; });
            return [o.month, o.day];
        } catch (e) { return null; }
    }

    // Verilen gün için kutlanacak kimlikler (öncelik sırasıyla)
    function daysOf(d) {
        var y = d.getFullYear(), m = d.getMonth() + 1, g = d.getDate(), out = [];
        var known = false;
        DINI.forEach(function (r) {
            if (r[0] === y) known = true;
            if (r[0] === y && r[1] === m && r[2] === g) out.push(r[3]);
        });
        if (!known) {
            var h = hijri(d);
            if (h) {
                if (h[0] === 9 && h[1] === 1) out.push('ramazan');
                else if (h[0] === 10 && h[1] <= 3) out.push('bayram-r');
                else if (h[0] === 12 && h[1] >= 10 && h[1] <= 13) out.push('bayram-k');
            }
        }
        var f = FIXED[m + '-' + g];
        if (f) out.push(f);
        if (m === 5 && g === nthSunday(y, 5, 2)) out.push('anneler');
        if (m === 6 && g === nthSunday(y, 6, 3)) out.push('babalar');
        return out;
    }
    window.mgKutlamaGun = daysOf; // test / hata ayıklama için

    function ymd(d) { return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
    function seen(key) { try { return localStorage.getItem(key) === '1'; } catch (e) { return false; } }
    function mark(key) { try { localStorage.setItem(key, '1'); } catch (e) {} }

    // ── Konfeti ──
    function confetti(cv) {
        if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) { cv.remove(); return; }
        var ctx = cv.getContext('2d'), W = cv.width = innerWidth, H = cv.height = innerHeight;
        var cols = ['#fde047', '#fff', '#f472b6', '#38bdf8', '#a3e635', '#fb923c'], P = [], t0 = Date.now();
        for (var i = 0; i < 90; i++) P.push({ x: Math.random() * W, y: -Math.random() * H * .6, s: 5 + Math.random() * 7, v: 1.6 + Math.random() * 2.6,
            w: Math.random() * 2 - 1, r: Math.random() * 6, rv: (Math.random() - .5) * .3, c: cols[i % cols.length] });
        (function frame() {
            var age = Date.now() - t0;
            if (age > 6500 || !cv.isConnected) { cv.remove(); return; }
            ctx.clearRect(0, 0, W, H);
            P.forEach(function (p) {
                p.y += p.v; p.x += p.w + Math.sin(p.y / 30) * .6; p.r += p.rv;
                if (p.y > H + 20 && age < 4500) { p.y = -20; p.x = Math.random() * W; }
                ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c;
                ctx.globalAlpha = age > 5200 ? Math.max(0, 1 - (age - 5200) / 1300) : 1;
                ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); ctx.restore();
            });
            requestAnimationFrame(frame);
        })();
    }

    // Resmi sırayla .png/.jpg/.jpeg/.webp uzantılarıyla dener; bulamazsa cb(null)
    function loadImg(id, cb) {
        var i = 0;
        (function tryNext() {
            if (i >= EXT.length) { cb(null); return; }
            var im = new Image(), src = IMG_DIR + id + EXT[i++];
            im.onload = function () { cb(im); };
            im.onerror = tryNext;
            im.src = src;
        })();
    }

    function show(id, key, done) {
        var o = OCC[id]; if (!o) { done(); return; }
        var label = NAMES[id] || id;
        loadImg(id, function (im) {
            if (!im) {                       // resim klasörde yoksa sessizce atla
                if (window.mgToast && key === 'mg-kutlama:preview') window.mgToast(IMG_DIR + id + '.png bulunamadı', 'info');
                done(); return;
            }
            mark(key);
            var solemn = !!o.solemn;
            var el = document.createElement('div');
            el.className = 'mg-kut'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true');
            el.setAttribute('aria-label', label);
            if (solemn) el.setAttribute('data-mode', 'solemn');
            el.innerHTML =
                (solemn ? '' : '<canvas class="mg-kut-fx" aria-hidden="true"></canvas>') +
                '<div class="mg-kut-card">' +
                    '<img class="mg-kut-img" alt="">' +
                    '<div class="mg-kut-actions">' +
                        '<button type="button" class="mg-kut-btn mg-kut-share"><i class="fas fa-share-nodes" aria-hidden="true"></i> Paylaş</button>' +
                        '<button type="button" class="mg-kut-btn mg-kut-ok">' + (solemn ? 'Kapat' : 'Teşekkürler') + '</button>' +
                    '</div>' +
                '</div>';
            var img = el.querySelector('.mg-kut-img'); img.src = im.src; img.alt = label;
            document.body.appendChild(el);
            requestAnimationFrame(function () { el.classList.add('mg-kut-in'); });
            try { if (!solemn && navigator.vibrate) navigator.vibrate(25); } catch (e) {}
            var cv = el.querySelector('.mg-kut-fx'); if (cv) confetti(cv);

            function close() {
                document.removeEventListener('keydown', onKey);
                el.classList.remove('mg-kut-in');
                setTimeout(function () { el.remove(); done(); }, 320);
            }
            function onKey(e) { if (e.key === 'Escape') close(); }
            document.addEventListener('keydown', onKey);
            el.querySelector('.mg-kut-ok').addEventListener('click', close);
            el.addEventListener('click', function (e) { if (e.target === el) close(); });
            el.querySelector('.mg-kut-share').addEventListener('click', function () {
                function fallback() {
                    var text = label + '\n— MuGöl PORTAL';
                    if (navigator.share) { navigator.share({ title: label, text: text, url: location.origin + location.pathname }).catch(function () {}); }
                    else if (navigator.clipboard) {
                        navigator.clipboard.writeText(text).then(function () { if (window.mgToast) window.mgToast('Tebrik metni kopyalandı', 'success'); }).catch(function () {});
                    }
                }
                // Önce resmin kendisini paylaşmayı dene
                fetch(im.src).then(function (r) { return r.blob(); }).then(function (b) {
                    var f = new File([b], id + (b.type === 'image/jpeg' ? '.jpg' : b.type === 'image/webp' ? '.webp' : '.png'), { type: b.type });
                    if (navigator.canShare && navigator.canShare({ files: [f] })) return navigator.share({ files: [f], title: label });
                    fallback();
                }).catch(function (e) { if (!e || e.name !== 'AbortError') fallback(); });
            });
            var ok = el.querySelector('.mg-kut-ok'); if (ok.focus) ok.focus({ preventScroll: true });
        });
    }

    function run() {
        var p = new URLSearchParams(location.search).get('kutlama');
        var queue;
        if (p && OCC[p]) queue = [[p, null]];          // önizleme: her seferinde göster
        else {
            var now = new Date(), day = ymd(now);
            queue = daysOf(now).map(function (id) { return [id, 'mg-kutlama:' + day + ':' + id]; })
                               .filter(function (q) { return !seen(q[1]); });
        }
        (function next() { var q = queue.shift(); if (q) show(q[0], q[1] || 'mg-kutlama:preview', next); })();
    }

    // ── Ayarlar > "Kutlama Ekranını Test Et" ──
    var NAMES = {
        yilbasi: 'Yılbaşı', kadinlar: '8 Mart Kadınlar Günü', canakkale: '18 Mart Çanakkale (anma)', '23nisan': '23 Nisan',
        '1mayis': '1 Mayıs', '19mayis': '19 Mayıs', anneler: 'Anneler Günü', babalar: 'Babalar Günü', '15temmuz': '15 Temmuz (anma)',
        '30agustos': '30 Ağustos Zafer Bayramı', '29ekim': '29 Ekim Cumhuriyet Bayramı', '10kasim': '10 Kasım (anma)', ogretmenler: 'Öğretmenler Günü',
        ramazan: 'Ramazan Başlangıcı', 'arefe-r': 'Ramazan Bayramı Arefesi', 'bayram-r': 'Ramazan Bayramı', 'arefe-k': 'Kurban Bayramı Arefesi',
        'bayram-k': 'Kurban Bayramı', mirac: 'Miraç Kandili', berat: 'Berat Kandili'
    };
    window.mgKutlamaTest = function (id) {
        if (!OCC[id]) return;
        show(id, 'mg-kutlama:preview', function () {});
        showHero([id]);   // ana sayfada saat kutusunun yerine de göster
    };
    function setupTest() {
        var sel = document.getElementById('mgKutSelect'), btn = document.getElementById('mgKutTestBtn');
        if (!sel || !btn) return;
        Object.keys(OCC).forEach(function (id) {
            var op = document.createElement('option'); op.value = id; op.textContent = NAMES[id] || id; sel.appendChild(op);
        });
        btn.addEventListener('click', function () { window.mgKutlamaTest(sel.value); });
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setupTest); else setupTest();

    // ── Ana sayfada: önemli günde, üstteki saat kutusunun yerine o günün resmi (tam, kırpmadan) ──
    function showHero(forceIds) {
        var clock = document.getElementById('mgClockWidget');
        if (!clock) return;
        var p = new URLSearchParams(location.search).get('kutlama');
        var ids = forceIds || ((p && OCC[p]) ? [p] : daysOf(new Date())), i = 0;
        (function next() {
            if (i < ids.length) {
                var id = ids[i++];
                loadImg(id, function (im) { if (im) place(id, im.src); else next(); });
                return;
            }
            place(null);
        })();
        function place(id, src) {
            var old = document.getElementById('mgOccHero'); if (old) old.remove();
            clock.classList.remove('mg-occ-hidden'); clock.style.removeProperty('display');
            if (!id) return;
            var label = NAMES[id] || id;
            var h = document.createElement('div');
            h.id = 'mgOccHero'; h.className = 'mg-occ-hero'; h.setAttribute('role', 'button'); h.tabIndex = 0;
            h.setAttribute('aria-label', label + ' — büyütmek için dokun');
            /* Stiller satır içi: style.css önbellekte eski kalsa bile çalışsın */
            h.style.cssText = 'display:block;margin:0 0 1rem;padding:4px;border-radius:32px;cursor:pointer;background:linear-gradient(135deg,#4318ff 0%,#00d2ff 50%,#8b5cf6 100%);box-shadow:none;-webkit-tap-highlight-color:transparent;';
            var img = document.createElement('img'); img.src = src; img.alt = label; img.decoding = 'async';
            img.style.cssText = 'display:block;width:100%;height:auto;border-radius:20px;';
            /* İç pasparto: gradyan çerçeve ile resim arasında ince beyaz/kart rengi şerit */
            var mat = document.createElement('div');
            mat.style.cssText = 'padding:6px;border-radius:28px;background:var(--bg-card,#fff);';
            mat.appendChild(img);
            h.appendChild(mat);
            function open() { show(id, 'mg-kutlama:preview', function () {}); }
            h.addEventListener('click', open);
            h.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
            clock.insertAdjacentElement('afterend', h);
            clock.classList.add('mg-occ-hidden'); clock.style.setProperty('display', 'none', 'important');
        }
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { showHero(); }); else showHero();

    function start() {
        var splash = document.getElementById('splash-screen');
        function go() { setTimeout(run, 500); }
        if (!splash || splash.classList.contains('hidden')) { go(); return; }
        var mo = new MutationObserver(function () {
            if (splash.classList.contains('hidden')) { mo.disconnect(); go(); }
        });
        mo.observe(splash, { attributes: true, attributeFilter: ['class'] });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();


/* Destek Ol: reklamı sekme ilk açıldığında yükle (gizli sayfada genişlik 0 hatası olmasın) */
(function () {
    var done = false;
    function pushAd() {
        if (done) return;
        var ins = document.querySelector('#page-destek ins.adsbygoogle');
        if (!ins) return;
        done = true;
        setTimeout(function () {
            try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
        }, 150);
    }
    document.addEventListener('click', function (e) {
        if (e.target.closest && e.target.closest('[data-target="page-destek"]')) pushAd();
    });
    document.addEventListener('keydown', function (e) {
        if ((e.key === 'Enter' || e.key === ' ') && e.target.closest && e.target.closest('[data-target="page-destek"]')) pushAd();
    });
})();


/* Destek Ol: Google IMA SDK ile video reklam */
(function () {
    var TAG = 'https://pubads.g.doubleclick.net/gampad/ads?iu=/23397545762/destekol_video&description_url=https%3A%2F%2Fmugol-portal.github.io%2F&tfcd=0&npa=0&sz=640x480&gdfp_req=1&unviewed_position_start=1&output=vast&env=vp&impl=s&correlator=';
    var btn, msg, wrap, content, adBox, loader, adsLoader, adsManager, adDisplay, sdkLoading = false;

    function say(t) { if (msg) msg.textContent = t || ''; }
    function reset() {
        if (adsManager) { try { adsManager.destroy(); } catch (e) {} adsManager = null; }
        if (btn) { btn.style.display = ''; btn.disabled = false; }
    }
    function fail(t) { reset(); say(t || 'Şu an gösterilecek reklam yok, biraz sonra tekrar dene.'); }

    function loadSdk(cb) {
        if (window.google && google.ima) return cb();
        if (sdkLoading) return;
        sdkLoading = true;
        var sc = document.createElement('script');
        sc.src = 'https://imasdk.googleapis.com/js/sdkloader/ima3.js';
        sc.onload = function () { sdkLoading = false; cb(); };
        sc.onerror = function () { sdkLoading = false; fail('Reklam yüklenemedi. Reklam engelleyiciyi kapatıp tekrar dene.'); };
        document.head.appendChild(sc);
    }

    function start() {
        say('Reklam yükleniyor…');
        btn.disabled = true;
        loadSdk(function () {
            try {
                content.load();
                adDisplay = new google.ima.AdDisplayContainer(adBox, content);
                adDisplay.initialize();
                adsLoader = new google.ima.AdsLoader(adDisplay);
                adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, onLoaded, false);
                adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, function () { fail(); }, false);
                var req = new google.ima.AdsRequest();
                req.adTagUrl = TAG + Date.now();
                req.linearAdSlotWidth = wrap.clientWidth;
                req.linearAdSlotHeight = wrap.clientHeight;
                adsLoader.requestAds(req);
            } catch (e) { fail(); }
        });
    }

    function onLoaded(ev) {
        try {
            adsManager = ev.getAdsManager(content);
            adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, function () { fail(); });
            adsManager.addEventListener(google.ima.AdEvent.Type.STARTED, function () { btn.style.display = 'none'; say(''); });
            adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, function () { reset(); say('Teşekkürler, destek olduğun için sağ ol! 💙'); });
            adsManager.addEventListener(google.ima.AdEvent.Type.SKIPPED, function () { reset(); say('Reklam atlandı. İstersen tekrar izleyebilirsin.'); });
            adsManager.init(wrap.clientWidth, wrap.clientHeight, google.ima.ViewMode.NORMAL);
            adsManager.start();
        } catch (e) { fail(); }
    }

    function init() {
        btn = document.getElementById('mgDvBtn');
        if (!btn || btn.dataset.ready) return;
        btn.dataset.ready = '1';
        msg = document.getElementById('mgDvMsg');
        wrap = document.getElementById('mgDvWrap');
        content = document.getElementById('mgDvContent');
        adBox = document.getElementById('mgDvAd');
        btn.addEventListener('click', start);
        window.addEventListener('resize', function () {
            if (adsManager && wrap) { try { adsManager.resize(wrap.clientWidth, wrap.clientHeight, google.ima.ViewMode.NORMAL); } catch (e) {} }
        });
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

// =========================================================
// İLK GİRİŞTE "DESTEK OL" ÖNERİSİ (tek seferlik)
// =========================================================
(function () {
    var KEY = 'mg-destek-prompt-v1';
    try { if (localStorage.getItem(KEY)) return; } catch (e) { return; }

    function close(el) {
        el.classList.remove('mg-dp-in');
        setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 250);
    }
    function show() {
        if (document.getElementById('mgDestekPrompt')) return;
        try { localStorage.setItem(KEY, '1'); } catch (e) {}
        var el = document.createElement('div');
        el.id = 'mgDestekPrompt';
        el.setAttribute('role', 'dialog');
        el.setAttribute('aria-modal', 'true');
        el.setAttribute('aria-label', 'Destek Ol');
        el.innerHTML =
            '<div class="mg-dp-card">' +
            '<div class="mg-dp-ico"><i class="fas fa-heart" aria-hidden="true"></i></div>' +
            '<h3>MuGöl PORTAL’a hoş geldin! 💙</h3>' +
            '<p>Portal ücretsiz ve herkese açık. Beğendiysen <b>Destek Ol</b> sekmesine göz atarak bize katkıda bulunabilirsin.</p>' +
            '<button type="button" class="mg-dp-go">Destek Ol sekmesine git</button>' +
            '<button type="button" class="mg-dp-later">Şimdi değil</button>' +
            '</div>';
        document.body.appendChild(el);
        requestAnimationFrame(function () { el.classList.add('mg-dp-in'); });
        el.querySelector('.mg-dp-go').addEventListener('click', function () {
            var mi = document.querySelector('.nav-item[data-target="page-destek"]');
            if (mi) mi.click();
            close(el);
        });
        el.querySelector('.mg-dp-later').addEventListener('click', function () { close(el); });
        el.addEventListener('click', function (e) { if (e.target === el) close(el); });
    }

    function start() {
        var splash = document.getElementById('splash-screen');
        function go() { setTimeout(show, 1500); }
        if (!splash || splash.classList.contains('hidden')) { go(); return; }
        var mo = new MutationObserver(function () {
            if (splash.classList.contains('hidden')) { mo.disconnect(); go(); }
        });
        mo.observe(splash, { attributes: true, attributeFilter: ['class'] });
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();


/* =========================================================
   SCROLL FIX — ana içerikteki gizli (istenmeyen) iç kaydırıcıları kapat
   Yüksekliği sınırlanmamış (max-height yok) ve dikeyde "auto/scroll" olan
   öğeler kaydırıcı olmasın; böylece tek kaydırıcı .main-content kalır.
   ========================================================= */
(function () {
    'use strict';
    var KEEP = '.mgb-body, .mg-shortcut-panel, #mgDrop, textarea, select, pre, code, table, [data-allow-scroll]';
    function fix() {
        var mc = document.querySelector('.main-content');
        if (!mc) return;
        var nodes = mc.querySelectorAll('*');
        for (var i = 0; i < nodes.length; i++) {
            var el = nodes[i];
            if (el.matches(KEEP) || el.closest(KEEP)) continue;
            var cs = getComputedStyle(el);
            var oy = cs.overflowY, ox = cs.overflowX;
            if (oy !== 'auto' && oy !== 'scroll') continue;
            if (cs.maxHeight !== 'none') continue;           // bilinçli sınırlı liste
            if (ox === 'auto' || ox === 'scroll') {           // yatay şerit: dikey kapalı
                el.style.setProperty('overflow-y', 'hidden', 'important');
            } else {
                el.style.setProperty('overflow-y', 'visible', 'important');
                if (ox === 'hidden') el.style.setProperty('overflow-x', 'clip', 'important');
            }
        }
    }
    var t;
    function later() { clearTimeout(t); t = setTimeout(fix, 250); }
    window.addEventListener('load', later);
    document.addEventListener('click', later, true);
    var mc = document.querySelector('.main-content');
    if (mc && window.MutationObserver) {
        new MutationObserver(later).observe(mc, { subtree: true, attributes: true, attributeFilter: ['class'] });
    }
    later();
})();


// =========================================================
// FAVORİLER + UYGULAMA DETAY SAYFASI
// ★ ile favori, karta uzun basınca (veya sağ tık) detay sayfası
// =========================================================
(function () {
    'use strict';

    var FKEY = 'mg-favs-v1', HKEY = 'mg-fav-hint-v1';
    var SEL = '.app-card[href], .tumuu-tile[href]';
    var CATS = { gunluk: 'Günlük', egitim: 'Eğitim', araclar: 'Araçlar', eglence: 'Eğlence' };
    var holdUntil = 0, openedAt = 0, sheetOpen = false, curUrl = '';

    function load() { try { return JSON.parse(localStorage.getItem(FKEY)) || []; } catch (e) { return []; } }
    function save(a) { try { localStorage.setItem(FKEY, JSON.stringify(a)); } catch (e) {} }
    function toast(m, ms) { if (typeof window._mgToast === 'function') window._mgToast(m, ms || 2200); }
    function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
    function absUrl(u) { try { return new URL(u, location.href).href; } catch (e) { return u; } }
    function fallbackImg(name) { return 'https://ui-avatars.com/api/?name=' + encodeURIComponent((name || 'M').replace(/^MuGöl\s*/i, '') || 'M') + '&background=4318ff&color=fff&rounded=true&bold=true'; }

    /* ── Uygulama bilgi indeksi (açıklama / kategori tüm kartlardan toplanır) ── */
    function buildIndex() {
        var map = {};
        document.querySelectorAll(SEL).forEach(function (el) {
            var u = el.getAttribute('href');
            var o = map[u] || (map[u] = {});
            var d = el.querySelector('.app-desc'), tag = el.querySelector('.app-tag'), dc = el.getAttribute('data-cat');
            if (d && d.textContent.trim() && !o.desc) o.desc = d.textContent.trim();
            if (tag && tag.textContent.trim() && !o.cat) o.cat = tag.textContent.trim();
            if (dc && CATS[dc] && !o.cat) o.cat = CATS[dc];
        });
        return map;
    }

    function cardInfo(el) {
        var u = el.getAttribute('href');
        var n = el.querySelector('.app-info h3, .tumuu-label');
        var im = el.querySelector('.app-icon-img, .tumuu-icon');
        var x = buildIndex()[u] || {};
        return { url: u, name: n ? n.textContent.trim() : '', img: im ? im.getAttribute('src') || im.src : '', desc: x.desc || '', cat: x.cat || '' };
    }
    function favInfo(url) {
        var f = load().filter(function (a) { return a.url === url; })[0];
        if (!f) return null;
        var x = buildIndex()[url] || {};
        return { url: f.url, name: f.name, img: f.img, desc: x.desc || '', cat: x.cat || '' };
    }
    function nodeInfo(node) {
        var fi = node.closest('.mg-fav-item');
        if (fi) return favInfo(fi.getAttribute('data-url'));
        var c = node.closest(SEL);
        return c ? cardInfo(c) : null;
    }

    function isFav(url) { return load().some(function (a) { return a.url === url; }); }
    function toggleFav(info) {
        if (!info || !info.url) return;
        var list = load();
        if (isFav(info.url)) {
            list = list.filter(function (a) { return a.url !== info.url; });
            save(list); toast('Favorilerden çıkarıldı');
        } else {
            list.unshift({ url: info.url, name: info.name, img: info.img });
            save(list); toast('⭐ Favorilere eklendi');
        }
        refresh();
    }

    /* ── Kartlara ★ düğmesi ── */
    function decorate() {
        document.querySelectorAll(SEL).forEach(function (el) {
            if (el.querySelector(':scope > .mg-fav-btn')) return;
            var b = document.createElement('span');
            b.className = 'mg-fav-btn';
            b.setAttribute('role', 'button');
            b.setAttribute('tabindex', '0');
            b.setAttribute('aria-label', 'Favorilere ekle');
            b.innerHTML = '<i class="far fa-star" aria-hidden="true"></i>';
            el.appendChild(b);
        });
    }
    function refreshStars() {
        document.querySelectorAll(SEL).forEach(function (el) {
            var b = el.querySelector(':scope > .mg-fav-btn'); if (!b) return;
            var on = isFav(el.getAttribute('href'));
            b.classList.toggle('on', on);
            b.setAttribute('aria-pressed', on ? 'true' : 'false');
            b.setAttribute('aria-label', on ? 'Favorilerden çıkar' : 'Favorilere ekle');
            var i = b.querySelector('i'); if (i) i.className = (on ? 'fas' : 'far') + ' fa-star';
        });
    }

    /* ── Ana Sayfa "Favorilerim" şeridi ── */
    function ensureStrip() {
        var s = document.getElementById('mgFavs');
        if (s) return s;
        s = document.createElement('section');
        s.id = 'mgFavs'; s.className = 'mg-favs'; s.hidden = true;
        s.setAttribute('aria-label', 'Favorilerim');
        s.innerHTML = '<div class="mg-section-label"><span class="mg-section-label-text">Favorilerim</span><span class="mg-favs-count"></span></div><div class="mg-favs-row" role="list"></div>';
        var rec = document.querySelector('section#mgRecent');
        var page = document.getElementById('page-anasayfa');
        if (rec && rec.parentNode) rec.parentNode.insertBefore(s, rec);
        else if (page) page.appendChild(s);
        return s;
    }
    function renderStrip() {
        var s = ensureStrip(), list = load();
        s.hidden = list.length === 0;
        var cnt = s.querySelector('.mg-favs-count'); if (cnt) cnt.textContent = list.length ? list.length + ' uygulama' : '';
        var row = s.querySelector('.mg-favs-row'); if (!row) return;
        row.innerHTML = list.map(function (a) {
            var fb = fallbackImg(a.name);
            return '<button type="button" class="mg-fav-item" role="listitem" data-url="' + esc(a.url) + '" aria-label="' + esc(a.name) + ' uygulamasını aç">' +
                '<span class="mg-fav-ico"><img src="' + esc(a.img || fb) + '" alt="" loading="lazy" onerror="this.onerror=null;this.src=\'' + fb + '\'"></span>' +
                '<span class="mg-fav-name">' + esc((a.name || '').replace(/^MuGöl\s*/i, '')) + '</span></button>';
        }).join('');
    }

    /* ── Uygulamayı aç (mevcut akış: reklam / son kullanılanlar / çevrimdışı kontrolü) ── */
    function openApp(url, name, img) {
        holdUntil = 0;
        var cards = document.querySelectorAll(SEL), card = null;
        for (var i = 0; i < cards.length; i++) { if (cards[i].getAttribute('href') === url) { card = cards[i]; break; } }
        if (card) { card.click(); return; }
        if (typeof window._mgOpenUrl === 'function') window._mgOpenUrl(url, name, img);
        else window.open(url, '_blank', 'noopener,noreferrer');
    }

    /* ── Detay sayfası (alt sheet) ── */
    function ensureSheet() {
        var ov = document.getElementById('mgDsOv');
        if (ov) return ov;
        ov = document.createElement('div'); ov.id = 'mgDsOv'; ov.className = 'mg-ds-ov'; ov.hidden = true;
        var sh = document.createElement('div'); sh.id = 'mgDs'; sh.className = 'mg-ds'; sh.hidden = true;
        sh.setAttribute('role', 'dialog'); sh.setAttribute('aria-modal', 'true'); sh.setAttribute('aria-labelledby', 'mgDsName');
        sh.innerHTML =
            '<div class="mg-ds-grab" aria-hidden="true"></div>' +
            '<button type="button" class="mg-ds-x" aria-label="Kapat"><i class="fas fa-xmark"></i></button>' +
            '<div class="mg-ds-head"><span class="mg-ds-ico"><img id="mgDsImg" alt=""></span>' +
            '<div class="mg-ds-titles"><h3 id="mgDsName"></h3><span class="mg-ds-cat" id="mgDsCat"></span></div></div>' +
            '<p class="mg-ds-desc" id="mgDsDesc"></p>' +
            '<div class="mg-ds-actions">' +
            '<button type="button" class="mg-ds-btn mg-ds-open"><i class="fas fa-arrow-up-right-from-square"></i><span>Aç</span></button>' +
            '<button type="button" class="mg-ds-btn mg-ds-fav"><i class="far fa-star"></i><span>Favori</span></button></div>' +
            '<div class="mg-ds-links">' +
            '<button type="button" class="mg-ds-link mg-ds-share"><i class="fas fa-share-nodes"></i> Paylaş</button>' +
            '<button type="button" class="mg-ds-link mg-ds-copy"><i class="fas fa-link"></i> Bağlantıyı kopyala</button></div>';
        document.body.appendChild(ov); document.body.appendChild(sh);

        ov.addEventListener('click', function () { if (Date.now() - openedAt > 450) closeSheet(); });
        sh.querySelector('.mg-ds-x').addEventListener('click', closeSheet);
        sh.querySelector('.mg-ds-open').addEventListener('click', function () {
            var n = document.getElementById('mgDsName').textContent, im = document.getElementById('mgDsImg').getAttribute('src'), u = curUrl;
            closeSheet(); setTimeout(function () { openApp(u, n, im); }, 120);
        });
        sh.querySelector('.mg-ds-fav').addEventListener('click', function () {
            toggleFav({ url: curUrl, name: document.getElementById('mgDsName').textContent, img: document.getElementById('mgDsImg').getAttribute('src') });
        });
        sh.querySelector('.mg-ds-share').addEventListener('click', function () {
            var n = document.getElementById('mgDsName').textContent, u = absUrl(curUrl);
            if (navigator.share) { navigator.share({ title: n, text: n + ' · MuGöl PORTAL', url: u }).catch(function () {}); }
            else copy(u);
        });
        sh.querySelector('.mg-ds-copy').addEventListener('click', function () { copy(absUrl(curUrl)); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && sheetOpen) closeSheet(); });
        return ov;
    }
    function copy(text) {
        function ok() { toast('🔗 Bağlantı kopyalandı'); }
        function legacy() {
            var t = document.createElement('textarea'); t.value = text; t.style.cssText = 'position:fixed;opacity:0;left:-9999px;';
            document.body.appendChild(t); t.select(); try { document.execCommand('copy'); ok(); } catch (e) { toast('Kopyalanamadı'); }
            document.body.removeChild(t);
        }
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, legacy); else legacy();
    }
    function syncSheetFav() {
        var b = document.querySelector('#mgDs .mg-ds-fav'); if (!b) return;
        var on = isFav(curUrl);
        b.classList.toggle('on', on);
        b.querySelector('i').className = (on ? 'fas' : 'far') + ' fa-star';
        b.querySelector('span').textContent = on ? 'Favoride' : 'Favori';
    }
    function openSheet(info) {
        if (!info || sheetOpen) return;
        var ov = ensureSheet(), sh = document.getElementById('mgDs');
        curUrl = info.url;
        var img = document.getElementById('mgDsImg');
        img.onerror = function () { img.onerror = null; img.src = fallbackImg(info.name); };
        img.src = info.img || fallbackImg(info.name);
        document.getElementById('mgDsName').textContent = info.name;
        var cat = document.getElementById('mgDsCat');
        cat.textContent = info.cat || ''; cat.style.display = info.cat ? '' : 'none';
        document.getElementById('mgDsDesc').textContent = info.desc || 'Bu uygulama için henüz açıklama eklenmemiş.';
        syncSheetFav();
        ov.hidden = false; sh.hidden = false; sheetOpen = true; openedAt = Date.now();
        requestAnimationFrame(function () { requestAnimationFrame(function () { ov.classList.add('show'); sh.classList.add('show'); }); });
    }
    function closeSheet() {
        var ov = document.getElementById('mgDsOv'), sh = document.getElementById('mgDs');
        if (!ov || !sheetOpen) return;
        sheetOpen = false; holdUntil = Date.now() + 400;
        ov.classList.remove('show'); sh.classList.remove('show');
        setTimeout(function () { if (!sheetOpen) { ov.hidden = true; sh.hidden = true; } }, 260);
    }

    function refresh() { refreshStars(); renderStrip(); syncSheetFav(); }

    /* ── Olaylar ── */
    /* window yakalama aşaması: mevcut tüm tıklama dinleyicilerinden önce çalışır */
    window.addEventListener('click', function (e) {
        var t = e.target; if (!t || !t.closest) return;
        var star = t.closest('.mg-fav-btn');
        if (star) {
            e.preventDefault(); e.stopImmediatePropagation();
            var c = star.closest(SEL); if (c) toggleFav(cardInfo(c));
            return;
        }
        if (Date.now() < holdUntil && t.closest(SEL + ', .mg-fav-item')) { e.preventDefault(); e.stopImmediatePropagation(); return; }
        var fi = t.closest('.mg-fav-item');
        if (fi) { e.preventDefault(); e.stopImmediatePropagation(); var i = favInfo(fi.getAttribute('data-url')); if (i) openApp(i.url, i.name, i.img); }
    }, true);

    document.addEventListener('keydown', function (e) {
        if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('mg-fav-btn')) {
            e.preventDefault(); var c = e.target.closest(SEL); if (c) toggleFav(cardInfo(c));
        }
    });

    var timer = null, sx = 0, sy = 0;
    document.addEventListener('touchstart', function (e) {
        var t = e.target; if (!t.closest || t.closest('.mg-fav-btn')) return;
        var node = t.closest(SEL + ', .mg-fav-item'); if (!node) return;
        var p = e.touches[0]; sx = p.clientX; sy = p.clientY;
        clearTimeout(timer);
        timer = setTimeout(function () {
            var info = nodeInfo(node); if (!info) return;
            holdUntil = Date.now() + 900;
            if (navigator.vibrate) { try { navigator.vibrate(15); } catch (er) {} }
            openSheet(info);
        }, 480);
    }, { passive: true });
    document.addEventListener('touchmove', function (e) {
        var p = e.touches[0];
        if (Math.abs(p.clientX - sx) > 10 || Math.abs(p.clientY - sy) > 10) clearTimeout(timer);
    }, { passive: true });
    ['touchend', 'touchcancel'].forEach(function (ev) { document.addEventListener(ev, function () { clearTimeout(timer); }, { passive: true }); });

    /* Uzun basış / sağ tık menüsü yerine detay sayfası */
    document.addEventListener('contextmenu', function (e) {
        var t = e.target; if (!t.closest) return;
        var node = t.closest(SEL + ', .mg-fav-item'); if (!node) return;
        e.preventDefault();
        if (!sheetOpen) { var info = nodeInfo(node); if (info) { holdUntil = Date.now() + 900; openSheet(info); } }
    });

    /* ── Başlat ── */
    function init() {
        decorate(); ensureStrip(); refresh();
        var hinted = false; try { hinted = !!localStorage.getItem(HKEY); } catch (e) {}
        if (!hinted) {
            setTimeout(function () {
                toast('💡 ★ ile favori ekle · ayrıntı için karta uzun bas', 4200);
                try { localStorage.setItem(HKEY, '1'); } catch (e) {}
            }, 3500);
        }
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
    window.addEventListener('load', function () { decorate(); refresh(); });
    window.mgFavorites = { list: load, toggle: function (url) { var i = buildIndex()[url]; toggleFav({ url: url, name: '', img: '' }); } };
})();
