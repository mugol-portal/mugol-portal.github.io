# MuGöl PORTAL

Tek sayfalık, mobil / tablet / masaüstü uyumlu portal. Yayın: GitHub Pages.

## Düzenlenecek 3 dosya

| Dosya | İçinde ne var |
|---|---|
| `index.html` | Sayfa yapısı, uygulama kartları, kategoriler |
| `script.js` | Tüm kodlar. Bildirim listesi ve görünüm modları da burada (aranabilir başlıklarla ayrılmış) |
| `style.css` | Tüm stiller (sıra korunmuştur, en alttaki bölümler en son uygulanır) |

- **Bildirim eklemek:** `script.js` içinde `BİLDİRİMLER` başlığını arayın, `window.MG_NOTIFICATIONS` listesine ekleyin.
- **Giriş sorusu (Mobil mi, Tarayıcı mı?):** `script.js` içinde `askView` fonksiyonu. Yalnızca tarayıcıdan ilk girişte çıkar, seçim `mugol-layout-mode` anahtarında saklanır. Android uygulamasından ve ana ekrandan açılışta sorulmaz, mobil görünüm açılır.
- **Değişiklik yayınlayınca:** `sw.js` içindeki `CACHE_NAME` sürümünü artırın (v8 → v9 …).

## Diğer dosyalar (genelde dokunulmaz)

```
sw.js              Service worker (çevrimdışı açılış) — kökte kalmalı
manifest.json      PWA / Android (TWA) ayarları
favicon.ico, logo.png, icon-*.png   Logo ve simgeler
ads.txt            AdSense
google821fc7ddacdf53aa.html   Search Console doğrulaması
.nojekyll
.well-known/       Android uygulaması (assetlinks.json)
images/            Uygulama görselleri
media/             Açılış videosu ve sesi
```
