# Presentasi Hub (Next.js)

Portal modern berbasis **Next.js (App Router)** dan **Tailwind CSS** untuk menampilkan file presentasi `.html` dalam tampilan kartu (card) modern dengan pratinjau langsung (*live preview*), mode layar penuh, cetak/PDF, serta siap deploy ke **Vercel**.

## Fitur Utama
- **Auto-Discovery File HTML**: Semua file `.html` di folder root maupun `public/presentations/` otomatis disinkronkan saat `npm run dev` / `npm run build` dan langsung muncul sebagai kartu.
- **Tampilan Kartu Modern**: Desain glassmorphism & bento, pratinjau HTML langsung (*live scaled preview*), badge format & jumlah slide, pencarian (`/`), filter format, mode Grid/List, serta tema Gelap/Terang.
- **Interactive Viewer (`/presentasi/[slug]`)**: Mode layar penuh (*fullscreen*), pindah presentasi cepat lewat dropdown, tombol **Cetak / Simpan PDF**, salin tautan, dan mode fokus (*hide toolbar*).
- **Siap Deploy Vercel**: Semua halaman presentasi di-generate secara statis (`generateStaticParams`) dan file HTML disajikan langsung dari CDN `public/presentations/`.

## Menjalankan Secara Lokal

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## Menambah Presentasi HTML Baru

Cukup taruh file `.html` baru di:
- Folder root proyek (`*.html`), **atau**
- Folder `public/presentations/`

Saat dijalankan lokal (`npm run dev`) atau di-build di Vercel (`npm run build`), skrip `scripts/sync-presentations.mjs` otomatis menyalin file baru dan menampilkan kartunya di halaman utama.

## Deploy ke Vercel

1. Push proyek ini ke repository GitHub / GitLab / Bitbucket.
2. Buka [vercel.com/new](https://vercel.com/new) dan import repository tersebut.
3. Biarkan pengaturan default Next.js (`Build Command: npm run build`, `Output Directory: .next`).
4. Klik **Deploy**.
