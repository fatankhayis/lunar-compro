# Deploy ke cPanel (Laravel + React SPA)

Repo ini mendukung 2 mode build/deploy:

1) **Default (lebih gampang upload):** Front-End dibuild ke `Front-End/dist`.
2) **Single-server (opsional):** Front-End dibuild ke `Back-End/public/build` dan di-serve oleh Laravel (lihat `Back-End/routes/web.php`).

> Catatan: Output single-server sekarang ada di `Back-End/public/build` (berisi `manifest.json` + `assets/`).

---

## 0) Prasyarat di cPanel

- PHP **>= 8.2** (sesuaikan dengan kebutuhan Laravel 11)
- Extensi PHP umum Laravel: `pdo_mysql`, `mbstring`, `openssl`, `fileinfo`, `tokenizer`, `ctype`, `json` (biasanya sudah ada)
- MySQL Database + User
- (Disarankan) **SSH/Terminal** aktif di cPanel

---

## 1) Build Front-End (dijalankan di laptop/PC)

### Mode default (build tetap di Front-End)

```bash
cd Front-End
npm install
npm run build
```

Hasil build akan muncul di `Front-End/dist`.

### Mode single-server (opsional: build masuk ke Back-End)

Dari root repo:

```bash
cd Back-End
npm install
npm run build:spa
```

Hasil build akan muncul di `Back-End/public/build`.

Folder itu berisi:
- `index.html`
- `manifest.json`
- `assets/`

---

## 2) Siapkan file production (di laptop/PC)

### a) Siapkan `.env` untuk production

Di `Back-End/`, buat `.env` (bisa dari `.env.example`) dan set minimal:

- `APP_NAME`, `APP_ENV=production`, `APP_DEBUG=false`
- `APP_URL=https://domain-kamu.com`
- `DB_HOST`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`
- `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` (jika mau seed admin)

Generate key + JWT secret (sekali saja):

```bash
cd Back-End
php artisan key:generate
php artisan jwt:secret
```

> Kalau tidak bisa jalankan artisan di server, cara paling mudah adalah **generate di lokal** seperti di atas, lalu upload file `.env` itu ke server.

### b) Dependencies PHP

**Pilihan 1 (paling rapi):** nanti jalankan `composer install --no-dev` di server via SSH/Terminal.

**Pilihan 2 (tanpa SSH):** upload folder `vendor/` dari lokal (ukuran besar, tapi sering jadi satu-satunya opsi).

---

## 3) Upload ke cPanel

Cara umum (File Manager):

1. Zip folder `Back-End/` (pastikan **tidak** ikut `node_modules/`).
2. Upload zip ke home directory (mis. `~/lunar`) lalu Extract.

Struktur contoh di server:

- `~/lunar/Back-End`  (isi project Laravel)
- `~/public_html`     (document root domain utama)

---

## 4) Atur Document Root (2 skenario)

### Skenario A (paling mudah): pakai Subdomain / Addon Domain

- Buat domain/subdomain di cPanel
- Set **Document Root** ke:

`.../lunar/Back-End/public`

Selesai bagian routing (Laravel `.htaccess` sudah ada).

### Skenario B: domain utama harus tetap `public_html`

Kalau cPanel tidak mengizinkan ubah document root domain utama:

1. Pindahkan folder `Back-End/` ke luar `public_html` (contoh: `~/lunar/Back-End`).
2. Copy **isi** `Back-End/public/` ke `public_html/`.
3. Edit `public_html/index.php` agar path-nya menunjuk ke folder Laravel yang asli (di luar `public_html`).

Ini pola standar shared-hosting Laravel.

---

## 5) Setup di server (kalau ada SSH/Terminal)

Masuk ke folder Laravel:

```bash
cd ~/lunar/Back-End
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan storage:link
php artisan config:cache
php artisan route:cache
```

Permissions (kalau diperlukan oleh host): pastikan folder ini writable:
- `storage/`
- `bootstrap/cache/`

---

## 6) Database tanpa SSH (alternatif)

Kalau tidak ada SSH dan tidak bisa menjalankan `php artisan migrate`:

- Jalankan `php artisan migrate` di lokal
- Export database dari lokal (phpMyAdmin) ke SQL
- Import SQL itu ke database di cPanel
- Sesuaikan `DB_*` di `.env` server

---

## 7) Checklist cepat setelah upload

- Buka `https://domain.com/` → harus tampil SPA
- Buka `https://domain.com/api/...` → harus respon JSON
- Upload gambar/asset (kalau ada) → cek `storage` bisa diakses (`/storage/...`)

---

## Catatan penting untuk repo ini

- Front-End build single-server memakai `base: /build/`, jadi asset SPA dilayani dari path `/build/`.
- Laravel sudah mengarahkan semua route non-`/api` ke `public/build/index.html`.
