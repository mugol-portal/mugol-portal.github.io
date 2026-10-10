/* ═══════════════════════════════════════════════════════════
   MuGöl PORTAL — Service Worker (çevrimdışı açılış)
   - Mevcut kodlara dokunmaz, yalnızca önbellek katmanı ekler.
   - Bu dosya index-mobil.html (veya index.html) ile AYNI klasörde durmalı.
   - Önbellekte olmayan / bilinmeyen istekler (AdSense, harici
     uygulama linkleri vb.) olduğu gibi ağa gider.
═══════════════════════════════════════════════════════════ */
'use strict';

var CACHE_PREFIX = 'mugol-mobil-';
var CACHE_NAME   = CACHE_PREFIX + 'v1';   /* Değişiklik yayınlarken sürümü artır: v2, v3 … */
var NAV_TIMEOUT  = 4000;                  /* Ağ bu sürede yanıt vermezse önbellekten aç */

/* Konumlar sw.js'e göre çözülür */
var SHELL = [
    './',
    'index.html',
    'index-mobil.html',
    'style.css',
    'script.js',
    'notifications.js',
    'logo.png',
    '../manifest.json',
    '../icon-192.png',
    '../icon-512.png',
    '../favicon.ico',
    '../kurucu.png'
];

var IMAGES = [
    'ai', 'deprem-logo', 'dijitalpano', 'edebiyat', 'education', 'ekonomi',
    'english', 'games', 'haber', 'hava', 'hesap', 'hikayeler', 'imsak', 'iq',
    'karne', 'kart-atolyesi', 'matematik', 'notdefteri', 'os', 'ozgecmis',
    'pdf', 'qr', 'renk', 'saglik', 'sayac', 'shopping', 'sokak', 'takvim',
    'turkce', 'word', 'zumriban'
].map(function (n) { return '../images/' + n + '.png'; });

/* Açılış videosu / müziği — hata verirse kurulum bozulmaz */
var MEDIA = ['mugol_acilis.mp4', 'mugol_acilis.mp3'];

/* Font Awesome (sayfadaki hem <link> hem inline @font-face adresleri) */
var FA_CSS = [
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];
var FA_FONTS = [
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-solid-900.woff2',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-regular-400.woff2',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-brands-400.woff2',
    'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/webfonts/fa-solid-900.woff2',
    'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/webfonts/fa-regular-400.woff2',
    'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/webfonts/fa-brands-400.woff2'
];
var GOOGLE_FONTS_CSS = 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap';

/* Bu sunucuların istekleri de önbelleğe alınır (stale-while-revalidate) */
var CACHEABLE_HOSTS = [
    'cdnjs.cloudflare.com',
    'cdn.jsdelivr.net',
    'use.fontawesome.com',
    'fonts.googleapis.com',
    'fonts.gstatic.com'
];

var MEDIA_RE  = /\.(mp4|webm|mp3|ogg|m4a|wav)$/i;
var STATIC_RE = /\.(html|css|js|json)$/i;

function abs(p) { return new URL(p, self.location.href).href; }
function stripSearch(u) { var x = new URL(u); x.search = ''; x.hash = ''; return x.href; }

/* Tek bir adresi önbelleğe al — başarısız olursa sessizce geç */
function safeAdd(cache, url, opts) {
    return fetch(url, opts || {}).then(function (res) {
        if (res && res.ok) return cache.put(url, res);
    }).catch(function () { /* yoksay */ });
}

/* ───────────── INSTALL ───────────── */
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            var jobs = [];

            SHELL.concat(IMAGES, MEDIA).forEach(function (p) {
                jobs.push(safeAdd(cache, abs(p), { cache: 'reload' }));
            });

            /* CDN dosyaları: CORS modunda (sayfadaki crossorigin istekleriyle uyumlu) */
            FA_CSS.concat(FA_FONTS).forEach(function (u) {
                jobs.push(safeAdd(cache, u, { mode: 'cors', credentials: 'omit' }));
            });

            /* Google Fonts: önce CSS, sonra içindeki font dosyaları */
            jobs.push(
                fetch(GOOGLE_FONTS_CSS, { mode: 'cors', credentials: 'omit' })
                    .then(function (res) {
                        if (!res.ok) return;
                        var copy = res.clone();
                        return cache.put(GOOGLE_FONTS_CSS, copy).then(function () {
                            return res.text();
                        }).then(function (css) {
                            var urls = css.match(/https:\/\/fonts\.gstatic\.com\/[^)'"\s]+/g) || [];
                            return Promise.all(urls.map(function (u) {
                                return safeAdd(cache, u, { mode: 'cors', credentials: 'omit' });
                            }));
                        });
                    })
                    .catch(function () { /* yoksay */ })
            );

            return Promise.all(jobs);
        }).then(function () { return self.skipWaiting(); })
    );
});

/* ───────────── ACTIVATE ───────────── */
self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (keys) {
            return Promise.all(keys.map(function (k) {
                if (k.indexOf(CACHE_PREFIX) === 0 && k !== CACHE_NAME) return caches.delete(k);
            }));
        }).then(function () { return self.clients.claim(); })
    );
});

/* Sayfa kendi adresini önbelleğe eklemek isterse */
self.addEventListener('message', function (event) {
    var d = event.data || {};
    if (d.type === 'CACHE_URL' && d.url) {
        event.waitUntil(
            caches.open(CACHE_NAME).then(function (cache) {
                return safeAdd(cache, stripSearch(d.url), { cache: 'reload' });
            })
        );
    }
});

/* ───────────── FETCH ───────────── */
self.addEventListener('fetch', function (event) {
    var req = event.request;
    if (req.method !== 'GET') return;

    var url;
    try { url = new URL(req.url); } catch (e) { return; }
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

    var sameOrigin = url.origin === self.location.origin;
    var knownCdn   = CACHEABLE_HOSTS.indexOf(url.hostname) !== -1;
    if (!sameOrigin && !knownCdn) return;          /* reklam, harici uygulamalar vb. → dokunma */

    /* Video / ses: önbellekten, Range destekli */
    if (sameOrigin && MEDIA_RE.test(url.pathname)) {
        event.respondWith(mediaResponse(req));
        return;
    }

    /* Sayfa gezintisi */
    if (req.mode === 'navigate') {
        event.respondWith(navigationResponse(event));
        return;
    }

    /* Yerel html/css/js/json → önce ağ (güncel kalsın), olmazsa önbellek */
    if (sameOrigin && STATIC_RE.test(url.pathname)) {
        event.respondWith(networkFirst(event, NAV_TIMEOUT));
        return;
    }

    /* Resimler, fontlar, CDN dosyaları → önbellekten hızlı, arkadan yenile */
    event.respondWith(staleWhileRevalidate(event));
});

/* Önbelleğe yazılacak anahtar: ?_v=... gibi parametreler önbelleği şişirmesin */
function keyFor(req) {
    var u = new URL(req.url);
    if (u.origin === self.location.origin) u.search = '';
    u.hash = '';
    return u.href;
}

function cacheable(res) {
    return res && (res.ok || res.type === 'opaque');
}

function networkFirst(event, timeoutMs) {
    var req = event.request;
    return caches.open(CACHE_NAME).then(function (cache) {
        var network = fetch(req).then(function (res) {
            if (cacheable(res)) event.waitUntil(cache.put(keyFor(req), res.clone()));
            return res;
        });
        var timer;
        var timeout = new Promise(function (_, reject) {
            timer = setTimeout(function () { reject(new Error('timeout')); }, timeoutMs);
        });
        return Promise.race([network, timeout]).then(function (res) {
            clearTimeout(timer);
            return res;
        }, function (err) {
            clearTimeout(timer);
            return cache.match(keyFor(req), { ignoreSearch: true }).then(function (cached) {
                if (cached) { network.catch(function () {}); return cached; }
                return network;     /* önbellek yoksa gerçek ağı bekle */
            });
        });
    });
}

function navigationResponse(event) {
    var req = event.request;
    return networkFirst(event, NAV_TIMEOUT).catch(function () {
        return caches.open(CACHE_NAME).then(function (cache) {
            /* Bu sayfa yoksa klasör kökünü / bilinen ana sayfayı dene */
            var fallbacks = [abs('./'), abs('index.html'), abs('index-mobil.html')];
            return fallbacks.reduce(function (p, fb) {
                return p.then(function (hit) {
                    return hit || cache.match(fb, { ignoreSearch: true });
                });
            }, Promise.resolve(null));
        }).then(function (hit) {
            return hit || new Response(
                '<!DOCTYPE html><html lang="tr"><meta charset="utf-8">' +
                '<meta name="viewport" content="width=device-width,initial-scale=1">' +
                '<title>Çevrimdışı</title>' +
                '<body style="font-family:sans-serif;text-align:center;padding:3rem 1.5rem;">' +
                '<h2>Çevrimdışısınız</h2>' +
                '<p>MuGöl PORTAL henüz bu cihaza kaydedilmemiş. Bir kez internetle açın, sonra çevrimdışı da girebilirsiniz.</p>' +
                '</body></html>',
                { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
            );
        });
    });
}

function staleWhileRevalidate(event) {
    var req = event.request;
    return caches.open(CACHE_NAME).then(function (cache) {
        return cache.match(req, { ignoreVary: true }).then(function (cached) {
            var network = fetch(req).then(function (res) {
                if (cacheable(res)) event.waitUntil(cache.put(keyFor(req), res.clone()));
                return res;
            });
            if (cached) { network.catch(function () {}); return cached; }
            return network;
        });
    });
}

/* Video/ses: Range isteklerine 206 ile yanıt (Safari/iOS için şart) */
function mediaResponse(req) {
    var key = keyFor(req);
    return caches.open(CACHE_NAME).then(function (cache) {
        return cache.match(key).then(function (cached) {
            if (!cached) return fetch(req);          /* önbellekte yok → ağdan */

            var range = req.headers.get('range');
            if (!range) return cached;

            return cached.clone().arrayBuffer().then(function (buf) {
                var m = /bytes=(\d*)-(\d*)/.exec(range);
                var size = buf.byteLength;
                var start = m && m[1] !== '' ? parseInt(m[1], 10) : 0;
                var end   = m && m[2] !== '' ? parseInt(m[2], 10) : size - 1;
                if (m && m[1] === '' && m[2] !== '') {      /* bytes=-N */
                    start = Math.max(0, size - parseInt(m[2], 10));
                    end = size - 1;
                }
                end = Math.min(end, size - 1);
                if (isNaN(start) || start > end) {
                    return new Response(null, { status: 416, headers: { 'Content-Range': 'bytes */' + size } });
                }
                return new Response(buf.slice(start, end + 1), {
                    status: 206,
                    statusText: 'Partial Content',
                    headers: {
                        'Content-Type': cached.headers.get('Content-Type') || 'video/mp4',
                        'Content-Range': 'bytes ' + start + '-' + end + '/' + size,
                        'Content-Length': String(end - start + 1),
                        'Accept-Ranges': 'bytes'
                    }
                });
            });
        });
    });
}
