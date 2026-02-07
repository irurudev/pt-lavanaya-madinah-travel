# Fullstack Development Standards (Laravel & React)

Instruksi ini bersifat absolut. AI harus mengikuti struktur folder, arsitektur, konvensi penulisan kode, dan aturan bahasa di bawah ini tanpa kecuali.

---

## 1. Language & Documentation Rules (CRITICAL)
- **Code Language:** Semua penamaan file, folder, variabel, function, class, database schema, dan UI text (seperti "Create Modal", "Submit") WAJIB menggunakan **Bahasa Inggris**.
- **Comments & Explanations:** Semua komentar di dalam kode (inline comments, docblocks) yang bersifat menjelaskan logika atau alur kerja WAJIB menggunakan **Bahasa Indonesia**.
- **Commit Messages:** Gunakan Bahasa Inggris (Conventional Commits).

---

## 2. Backend Architecture (Laravel - Service Repository Action Pattern)
Setiap fitur baru harus mengikuti alur: **Migration -> Model -> Seeder -> Enum -> Request -> DTO -> Repository -> Service -> Action -> Policy -> Controller -> Resource.**

### Folder Structure & Responsibility:
- `app/Enums`: Semua konstanta (PHP Enums).
- `app/Models`: Definisi model & relasi Eloquent.
- `app/Http/Requests`: Validasi input (Validation rules).
- `app/DTOs`: (Spatie DTO) Kontrak data antar layer.
- `app/Repositories`: Hanya query database (Eloquent/Query Builder).
- `app/Services`: Logika bisnis utama (koordinasi antar repository).
- `app/Actions`: Logika tugas tunggal (Single Responsibility Principle).
- `app/Policies`: Logika otorisasi akses.
- `app/Http/Controllers/Api`: Entry point API (Ramping, tanpa logika bisnis).
- `app/Http/Resources`: Transformasi output JSON.

---

## 3. Frontend Architecture (React Modular Structure)
Gunakan struktur folder modular di dalam `src`:
- `src/components`, `src/features`, `src/pages`, `src/layouts`, `src/routes`, `src/services`, `src/api`, `src/hooks`, `src/context`, `src/types`, `src/utils`.

---

## 4. Aturan Import & Namespacing
- **Strict Use Statements:** DILARANG menuliskan path lengkap class (FQCN) di dalam logika kode. Selalu letakkan path class pada bagian `use` di atas file.
- **Facades:** Gunakan `use Illuminate\Support\Facades\[Name];` daripada memanggil `\[Name]::`.

---

## 5. Coding Standards & Conventions
- **Naming:** - BE: PascalCase (Class), camelCase (Variable/Method).
    - FE: PascalCase (Components/Layouts), camelCase (Hooks/Utils/API).
- **Type Safety:** Wajib menggunakan TypeScript (FE) dan Type Hinting (BE). Hindari `any`.
- **Database:** Gunakan `snake_case` untuk tabel & kolom. Selalu gunakan `foreignId()->constrained()->onDelete('cascade')`.

---

## 6. Instruksi Khusus untuk AI (Step-by-Step Fitur Baru)
1. Analisis kebutuhan, buat **Migration**, **Enum**, dan **Seeder** (Inggris).
2. Tambahkan komentar penjelasan di atas logika yang kompleks (Indonesia).
3. Buat **DTO**, **Repository**, **Service/Action** (Inggris).
4. Buat **API Controller** dan **Resource** (Inggris).
5. Sinkronkan ke Frontend (Types, API, Hooks, Pages) dengan penamaan Inggris dan komentar Indonesia.

## 7. Database Schema Processing Rules
Jika User memberikan desain skema tabel (dalam format tabel Markdown atau daftar):

- **Analisis Relasi:** Identifikasi hubungan One-to-Many atau Many-to-Many secara otomatis berdasarkan `ForeignID`.
- **Implementasi Migration:**
    - Gunakan `foreignId()->constrained()->onDelete('cascade')` untuk semua ForeignID.
    - Gunakan `$table->softDeletes()` jika tabel bersifat master data (seperti `products` atau `categories`).
- **Implementasi Model:** - Isi properti `$fillable` sesuai kolom yang diberikan (kecuali ID dan Timestamps).
    - Buat fungsi relasi (misal: `belongsTo`, `hasMany`) dengan type-hinting yang jelas.
- **Implementasi Enums:** Jika ada kolom bertipe `Enum`, buatkan file PHP Enum di `app/Enums` dan gunakan di Migration serta Casting Model.
- **Data Consistency:** Gunakan tipe data `decimal(15,2)` misal untuk harga/money dan `integer` untuk stok di Laravel.
