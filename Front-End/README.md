# Lunar-Compro (Front-End)

Front-end SPA untuk **Lunar company profile**.

## Tech Stack

- React + Vite
- TailwindCSS
- React Router
- Axios
- Framer Motion

## Fitur

### Public site

- Halaman company profile (Home, About, Projects, Products, Partners/Clients, Team, Testimonials)
- Blog/News
  - Preview post terbaru (maks. 6) di Home & About
  - List semua post di `/blog` (pagination)
  - Detail post di `/blog/:slug`
- Form **Request a Quote** di footer (mengirim inquiry)
- Multi-language UI (EN/ID) dengan switcher flag kecil di footer

### Admin UI

- Login admin (JWT)
- CRUD: Projects, Products, Crew, Partners, Testimonials, Categories, Blog Posts
- Inquiries inbox (lihat & hapus)
- Analytics dashboard (dummy/local atau Google Analytics bila backend dikonfigurasi)

## Development (FE dev server)

1) Install dependencies

```bash
npm install
```

2) Set base URL API

Buat file `.env.local`:

```env
VITE_BACKEND_URL=http://127.0.0.1:8000
```

3) Run

```bash
npm run dev
```

FE biasanya berjalan di `http://localhost:5173`.

## Build

```bash
npm run build
```

Catatan:
- Untuk mode single-server, build React diarahkan ke `Back-End/public/app` via script di Back-End (`npm run build:spa`).
