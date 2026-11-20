# MuGöl PORTAL

Tek sayfalık, mobil / tablet / masaüstü uyumlu portal. Yayın: GitHub Pages.

```
index.html          Ana sayfa (tek giriş noktası)
style.css, mg-redesign.css, mg-modes.css   Stiller
script.js, notifications.js, auth.js, mg-modes.js   Kodlar
sw.js               Service worker (çevrimdışı açılış) — kökte kalmalı
manifest.json       PWA / Android (TWA) ayarları
favicon.ico, logo.png, icon-*.png   Logo ve PWA/Android simgeleri
ads.txt             AdSense
google821fc7ddacdf53aa.html   Search Console doğrulaması
.nojekyll
.well-known/        Android uygulaması (assetlinks.json)

images/             Uygulama görselleri
media/              Açılış videosu ve sesi
```

- Bildirim eklemek: `js/notifications.js`
- Değişiklik yayınlayınca `sw.js` içindeki `CACHE_NAME` sürümünü artırın (v7 → v8 …).
