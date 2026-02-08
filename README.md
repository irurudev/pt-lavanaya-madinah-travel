# MySmartWarehouse
Sistem manajemen gudang untuk kategori, produk, transaksi, dan pelaporan dengan kontrol akses berbasis peran.

Status: Production ready
Versi: 1.0.0
Terakhir diperbarui: February 2026

---

## Ringkasan
MySmartWarehouse adalah aplikasi gudang berbasis Laravel + React (Inertia) untuk operasional stok. Fitur utama mencakup master data (kategori/produk), transaksi masuk-keluar, snapshot stok, pelaporan, dan integritas data berbasis soft delete.

---

## Fitur Utama
- RBAC: Admin, Operator, Viewer
- Manajemen kategori dan produk
- SKU otomatis (immutable)
- Tracking stok dan indikator stok rendah
- Transaksi inbound dan outbound
- Snapshot stok berkala
- Laporan transaksi dan stok
- Soft delete untuk master data

---

## Tech Stack
- Backend: Laravel 12
- Frontend: React 18 + TypeScript
- SSR: Inertia.js
- UI: Chakra UI
- Build: Vite
- Database: MySQL 8

---

## Prasyarat
- PHP 8.2+
- Composer
- Node.js 18+ dan npm
- MySQL 8.0+

---

## Quick Start
```bash
composer install
npm install

cp .env.example .env
php artisan key:generate

php artisan migrate:fresh --seed

php artisan serve
npm run dev
```

Akses aplikasi: http://localhost:8000

---

## Konfigurasi Environment
Salin file env dan isi nilai minimal berikut agar aplikasi bisa jalan.

Wajib:
```env
APP_NAME="MySmartWarehouse"
APP_URL=http://localhost:8000
APP_ENV=local
APP_DEBUG=true
APP_TIMEZONE=Asia/Jakarta

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ptlavanaya
DB_USERNAME=root
DB_PASSWORD=yourpassword
```

Opsional (default di .env.example sudah aman untuk lokal):
```env
QUEUE_CONNECTION=database
CACHE_STORE=database
SESSION_DRIVER=database
MAIL_MAILER=log
```

---

## Struktur Project (Frontend)
```
resources/js/
  api/
  components/
  hooks/
  layouts/
  pages/
  routes/
  services/
  types/
  utils/
```

---

## Arsitektur Backend (Ringkas)
Layer utama mengikuti pola Service Repository Action:

- Request: validasi input
- DTO: kontrak data antar layer
- Repository: query database
- Service: business logic utama
- Action: tugas tunggal (opsional)
- Policy: authorization
- Controller: entry API
- Resource: transform JSON

---

## RBAC
- Admin: full access
- Operator: manajemen produk dan transaksi
- Viewer: read-only

Authorization dijalankan via Policies dan role checks.

---

## Integritas Data (Soft Delete)
- Kategori dan produk menggunakan soft delete
- Relasi produk memuat kategori yang sudah dihapus (withTrashed) agar label tetap muncul
- Jika membuat kategori dengan nama yang pernah dihapus, sistem melakukan restore data lama

---

## NPM Scripts
```bash
npm run dev        # Vite dev server
npm run build      # Build production assets
npm run build:ssr  # Build SSR assets
npm run types      # Type check (tsc --noEmit)
npm run lint       # ESLint --fix
npm run format     # Prettier resources/
```

---

## Seeding Data
```bash
php artisan db:seed
```
Untuk reset total:
```bash
php artisan migrate:fresh --seed
```

---

## Troubleshooting
- Jalankan `php artisan migrate:fresh --seed` jika struktur dan data tidak sinkron
- Jalankan `npm run types` jika ada error TypeScript
- Periksa koneksi DB di `.env` jika migration gagal

---

## Catatan Database Lokal
- Aplikasi memakai driver database untuk queue, cache, dan session secara default.
- Pastikan MySQL aktif dan user punya akses buat membuat tabel.
