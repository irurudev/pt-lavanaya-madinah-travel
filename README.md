# MySmartWarehouse 📦
**Advanced Inventory & Warehouse Management System**

MySmartWarehouse adalah sistem manajemen gudang berbasis web yang dirancang untuk presisi tinggi. Menggunakan Laravel, Inertia.js, dan MySQL untuk memastikan performa real-time dan integritas data yang tak terbantahkan.

---

## 🚀 Fitur Utama

* **Auth System**: Login aman untuk admin dan operator gudang.
* **Master Data**: CRUD Produk dan Kategori Barang yang sistematis.
* **Logika Stok Anti-Minus**: Validasi server-side ketat pada setiap pengeluaran barang.
* **Reporting System**: Laporan mutasi barang (Masuk/Keluar) dan saldo stok akhir per periode.
* **Transaction Tracking**: Setiap pergerakan barang mencatat referensi (No. PO/SJ) dan operator penanggung jawab.

---

## 🛠️ Tech Stack

* **Backend**: Laravel 12
* **Frontend**: Inertia.js (React)
* **Styling**: Chakra UI (Tailwind CSS)
* **Database**: MySQL

---

## 📊 Struktur Database (Advanced Schema)

Berikut adalah struktur database lengkap yang menjamin kerapihan data sesuai kriteria profesional:

### 1. Tabel `users` (Otentikasi)
| Kolom | Tipe Data | Deskripsi |
| :--- | :--- | :--- |
| `id` | BigInt (PK) | Primary Key. |
| `name` | String | Nama operator. |
| `email` | String | Username/Email login. |
| `password` | String | Hash password. |

### 2. Tabel `categories` (Master Kategori)
Memisahkan kategori agar produk lebih terorganisir.
| Kolom | Tipe Data | Deskripsi |
| :--- | :--- | :--- |
| `id` | BigInt (PK) | Primary Key. |
| `name` | String | Nama kategori (e.g. Elektronik, Food). |

### 3. Tabel `products` (Master Produk)
Menyimpan informasi fundamental barang.
| Kolom | Tipe Data | Deskripsi |
| :--- | :--- | :--- |
| `id` | BigInt (PK) | Primary Key. |
| `category_id` | ForeignID | Relasi ke tabel categories. |
| `sku` | String (Unique) | Kode unik barang (e.g. SKU-1001). |
| `name` | String | Nama barang. |
| `stock` | Integer | Saldo stok saat ini (Real-time). |
| `min_stock` | Integer | Batas minimal untuk alert stok tipis. |
| `unit_price` | Decimal | Harga master barang. |

### 4. Tabel `transactions` (Log Mutasi)
Mencatat sejarah barang masuk dan keluar secara mendetail.
| Kolom | Tipe Data | Deskripsi |
| :--- | :--- | :--- |
| `id` | BigInt (PK) | Primary Key. |
| `product_id` | ForeignID | Relasi ke tabel products. |
| `user_id` | ForeignID | Operator yang melakukan input. |
| `type` | Enum | 'in' (Masuk) atau 'out' (Keluar). |
| `quantity` | Integer | Jumlah barang. |
| `reference_no` | String | No. Surat Jalan / No. PO. |
| `price_at_transaction` | Decimal | Harga barang saat transaksi terjadi. |
| `created_at` | Timestamp | Waktu transaksi. |

### 5. Tabel `stock_snapshots` (Laporan Berkala) - *Optional Pro*
Digunakan untuk merekam saldo stok akhir setiap bulan/tahun untuk audit.
| Kolom | Tipe Data | Deskripsi |
| :--- | :--- | :--- |
| `id` | BigInt (PK) | Primary Key. |
| `product_id` | ForeignID | Relasi ke produk. |
| `month/year` | String | Periode laporan. |
| `closing_stock` | Integer | Saldo penutup periode. |

---

## 💡 Business Logic: Data Integrity

1.  **Atomicity**: Menggunakan `DB::transaction` agar jika penambahan log transaksi gagal, update stok di tabel `products` akan otomatis dibatalkan (Rollback).
2.  **Concurrency Control**: Menggunakan `lockForUpdate()` saat mengecek stok untuk mencegah dua user mengeluarkan barang yang sama di detik yang sama jika stok sisa 1.
3.  **Strict Validation**: Logic `if ($product->stock < $request->quantity)` dipasang di level Controller untuk menjamin stok tidak akan pernah menyentuh angka negatif.

---

## 🔐 Roles & Authorization
Sistem menyediakan 3 role dasar:
- **Admin**: akses penuh (produk, transaksi, laporan, pengaturan)
- **Operator**: dapat melakukan transaksi (barang masuk/keluar)
- **Viewer**: akses hanya melihat laporan dan produk

---

## 🔁 Seed & Run (pengembang)
- Jalankan migrasi: `php artisan migrate`
- Jalankan seeder: `php artisan db:seed` (atau `php artisan migrate:fresh --seed`)
- Credential contoh (seeded):
  - **Admin**: `admin@example.com` / `password`
  - **Operator**: `operator@example.com` / `password`
  - **Viewer**: `viewer@example.com` / `password`