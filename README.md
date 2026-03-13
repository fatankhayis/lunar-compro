# Lunar-Compro (Company Profile)

[![Laravel](https://img.shields.io/badge/Laravel-11-red)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF)](https://vitejs.dev)

Monorepo untuk aplikasi company profile **Lunar**:

- **Back-End/**: Laravel REST API + JWT Auth + (opsional) Google Analytics (Spatie Laravel Analytics)
- **Front-End/**: React + Vite (SPA) untuk public site dan admin UI

> Target OS: Windows (Laragon cocok), tapi langkahnya juga berlaku di macOS/Linux.

---

## Daftar Isi

- [Prasyarat](#prasyarat)
- [Quick Start (Dev Mode: 2 server)](#quick-start-dev-mode-2-server)
- [Setup Back-End (Laravel)](#setup-back-end-laravel)
- [Setup Front-End (React)](#setup-front-end-react)
- [Mode Production-like (React dibuild ke Laravel)](#mode-production-like-react-dibuild-ke-laravel)
- [Analytics Dashboard (Dummy vs Google Analytics)](#analytics-dashboard-dummy-vs-google-analytics)
- [Troubleshooting](#troubleshooting)

---

## Prasyarat

- **PHP** `>= 8.2`
- **Composer**
- **Node.js** (disarankan `>= 18`)
- **MySQL/MariaDB** (Laragon / XAMPP / Docker)

---

## Quick Start (Dev Mode: 2 server)

Mode ini paling enak untuk development: Laravel API jalan sendiri, React Vite jalan sendiri.

1) **Jalankan Back-End (API)**

```bash
cd Back-End
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

2) **Jalankan Front-End (Vite dev server)**

Buat file `Front-End/.env.local`:

```env
VITE_BACKEND_URL=http://127.0.0.1:8000
```

Lalu jalankan:

```bash
cd Front-End
npm install
npm run dev
```

- FE biasanya berjalan di `http://localhost:5173`
- BE biasanya berjalan di `http://127.0.0.1:8000`

---

## Setup Back-End (Laravel)

Dari root project:

```bash
cd Back-End
composer install
```

### 1) Konfigurasi `.env`

Buat `.env` dari template:

```bash
copy .env.example .env
```

Minimal yang wajib di-set:

- `APP_URL` (contoh: `http://127.0.0.1:8000`)
- `DB_*` (database name/user/pass)

### 2) Generate key + migrate

```bash
php artisan key:generate
php artisan migrate
```

### 3) (Opsional) Seed admin + data awal

Seeder membuat user admin dari env var berikut:

```env
ADMIN_NAME=Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

Jalankan:

```bash
php artisan db:seed
```

### 4) JWT secret

Project pakai `php-open-source-saver/jwt-auth`. Kalau `JWT_SECRET` belum ada, generate:

```bash
php artisan jwt:secret
```

### 5) Storage link (jika pakai upload gambar)

```bash
php artisan storage:link
```

### 6) Jalankan server

```bash
php artisan serve
```

---

## Setup Front-End (React)

```bash
cd Front-End
npm install
```

### Konfigurasi base URL API

Front-end membaca base URL dari env var `VITE_BACKEND_URL` dan akan menghapus trailing slash otomatis.

- **Dev mode (FE terpisah dari BE):** set `Front-End/.env.local`:

```env
VITE_BACKEND_URL=http://127.0.0.1:8000
```

- **Production-like (FE dibuild ke Laravel):** *tidak perlu set* `VITE_BACKEND_URL` (defaultnya same-origin).

Jalankan dev server:

```bash
npm run dev
```

---

## Mode Production-like (React dibuild ke Laravel)

Mode ini cocok kalau mau simulasi deploy “satu server”: React dibuild ke `Back-End/public/app` dan Laravel serve SPA untuk non-`/api` routes.

1) Install dependency FE

```bash
cd Front-End
npm install
```

2) Build SPA ke folder Laravel

```bash
cd ..\Back-End
npm install
npm run build:spa
```

3) Jalankan Laravel

```bash
php artisan serve
```

Catatan:
- Pada mode ini, FE call API via same-origin: `/api/...`.

---

## Analytics Dashboard (Dummy vs Google Analytics)

Admin dashboard mengambil data dari endpoint:

- `GET /api/analytics?range=day|week|month`

Perilaku endpoint:

- **Kalau Google Analytics belum dikonfigurasi** dan environment `local`, backend mengembalikan **dummy analytics data** supaya dashboard tetap tampil.
- **Kalau sudah dikonfigurasi**, backend akan fetch data GA4 via **Spatie Laravel Analytics**.

### Cara konfigurasi Google Analytics (opsional)

Di `Back-End/.env`:

```env
ANALYTICS_PROPERTY_ID=YOUR_GA4_PROPERTY_ID
```

Lalu letakkan service account JSON di:

- `Back-End/storage/app/analytics/service-account-credentials.json`

> File credentials jangan di-commit. Folder `storage/app/analytics/*.json` sudah di-ignore oleh `.gitignore`.

---

## Troubleshooting

### FE tidak bisa hit API (axios error / network error)

- Pastikan BE jalan di `http://127.0.0.1:8000`
- Pastikan `Front-End/.env.local` berisi `VITE_BACKEND_URL=http://127.0.0.1:8000`
- Restart `npm run dev` setelah mengubah `.env.local`

### Dashboard analytics kosong

- Di local, harusnya tetap ada dummy data bila GA belum diset.
- Coba hit endpoint langsung: `GET http://127.0.0.1:8000/api/analytics?range=month`

### Migrasi gagal / DB tidak ketemu

- Buat database (contoh: `lunar_compro`) di MySQL
- Sesuaikan `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` di `Back-End/.env`

---

## Referensi

- Dokumentasi API lebih lengkap: `Back-End/README.md`
- React/Vite docs: https://vitejs.dev/ | https://react.dev
- Spatie Laravel Analytics: https://github.com/spatie/laravel-analytics
