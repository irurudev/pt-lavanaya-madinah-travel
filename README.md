# 📦 MySmartWarehouse
**Advanced Inventory & Warehouse Management System**

MySmartWarehouse adalah sistem manajemen gudang berbasis web yang dirancang untuk presisi tinggi dalam tracking stok barang secara real-time. Menggabungkan teknologi modern Laravel, React, dan MySQL untuk memastikan integritas data dan performa optimal dengan role-based access control yang komprehensif.

> **Status**: ✅ Production Ready | **Version**: 1.0.0 | **Last Updated**: February 2026

---

## 🎯 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Instalasi Lengkap](#️-instalasi-lengkap)
- [Menjalankan Proyek](#-menjalankan-proyek)
- [Sistem RBAC](#-sistem-rbac)
- [Struktur Database](#-struktur-database)
- [Business Logic](#-business-logic)
- [Seeding Data](#-seeding-data)
- [API Usage](#-api-usage)
- [Troubleshooting](#-troubleshooting)

---

## 🚀 Fitur Utama

### Core Features
- ✅ **Role-Based Access Control (RBAC)** - 3 level role (Admin, Operator, Viewer) dengan permissions granular
- ✅ **Authentication & Authorization** - Login aman dengan session management dan policy-based authorization
- ✅ **Master Data Management** - CRUD Kategori & Produk dengan validasi ketat
- ✅ **Real-time Stock Tracking** - Update stok instan dengan anti-minus logic di level server
- ✅ **Transaction Management** - Track setiap pergerakan barang dengan referensi PO/SJ
- ✅ **Advanced Reporting** - Laporan mutasi (Masuk/Keluar) dan snapshot stok berkala

### Advanced Features
- 🔒 **Admin Protection** - Admin tidak bisa membuat/menghapus admin lain, hanya deactivate (soft delete)
- 🏷️ **Auto SKU Generation** - SKU unik otomatis format `SKU-YYYYMMDD-XXXX` (immutable - tidak bisa diubah)
- 📊 **Stock Snapshots** - Dokumentasi saldo stok per periode untuk audit trail dan laporan berkala
- 💾 **Soft Delete** - Penghapusan data dengan preservation history (no hard delete)
- 🔄 **Cascading Relations** - Foreign key constraints dengan `onDelete('cascade')` untuk data consistency
- 🎨 **Sticky Sidebar** - Navigation tetap fixed dengan responsive collapse di mobile
- 🌍 **Indonesian UI** - Interface penuh dalam Bahasa Indonesia dengan help text informatif

---

## 🛠️ Tech Stack

| Komponen | Technology | Version |
|----------|-----------|---------|
| **Backend Framework** | Laravel | 12.50.0 |
| **Frontend Library** | React | 18+ |
| **Typing** | TypeScript | 5+ (Strict Mode) |
| **Server-side Rendering** | Inertia.js | v2+ |
| **Database** | MySQL | 8.0+ |
| **CSS Framework** | Chakra UI + Tailwind CSS | Latest |
| **Module Bundler** | Vite | 7.3.1+ |
| **Package Manager** | Composer & NPM | Latest |

---

## ⚡ Quick Start

```bash
# 1. Clone repository (jika belum)
git clone <repo-url>
cd pt-lavanaya-madinah-travel

# 2. Install dependencies
composer install
npm install

# 3. Setup environment
cp .env.example .env
php artisan key:generate

# 4. Setup database
php artisan migrate:fresh --seed

# 5. Run development servers (di 2 terminal berbeda)
# Terminal 1:
php artisan serve

# Terminal 2:
npm run dev

# 6. Access aplikasi di browser
# http://localhost:8000
# Login menggunakan credentials dari seeding (lihat section Seeding Data)
```

---

## 🖥️ Instalasi Lengkap

### Prerequisites
Pastikan sistem Anda memiliki:
- **PHP** 8.2 atau lebih baru
- **Composer** (dependency manager PHP)
- **Node.js** 18+ dan NPM
- **MySQL** 8.0+ atau MariaDB
- **Git** (untuk version control)

### Step 1: Clone Repository

```bash
git clone <your-repo-url>
cd pt-lavanaya-madinah-travel
```

### Step 2: Install Backend Dependencies

```bash
composer install
```

Ini akan menginstal semua package Laravel dan dependencies lainnya sesuai `composer.json`.

### Step 3: Install Frontend Dependencies

```bash
npm install
```

Ini akan menginstal React, TypeScript, Chakra UI, Vite, dan dependencies lainnya.

### Step 4: Setup Environment Configuration

```bash
cp .env.example .env
```

Edit file `.env` dan sesuaikan konfigurasi database:

```env
# Database Configuration
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=lavanaya_warehouse
DB_USERNAME=root
DB_PASSWORD=yourpassword

# Application Configuration
APP_NAME="MySmartWarehouse"
APP_URL=http://localhost:8000
APP_ENV=local
APP_DEBUG=true

# Sanctum (API Authentication)
SANCTUM_STATEFUL_DOMAINS=localhost,127.0.0.1

# Session Configuration
SESSION_DRIVER=cookie
SESSION_DOMAIN=localhost
```

### Step 5: Generate Application Key

```bash
php artisan key:generate
```

Ini menghasilkan `APP_KEY` yang digunakan untuk encryption di Laravel.

### Step 6: Run Database Migrations & Seeding

**Recommended untuk development (fresh installation):**
```bash
php artisan migrate:fresh --seed
```

Ini akan:
- Drop semua existing tables
- Run semua migrations (membuat table baru)
- Run semua seeders (populate data dummy)

**Atau jika update existing database:**
```bash
php artisan migrate
php artisan db:seed
```

### Step 7: Build Frontend Assets (Production)

Untuk production, compile dan optimize React:
```bash
npm run build
```

Output akan tersimpan di `public/build/`.

---

## ▶️ Menjalankan Proyek

### Development Mode (Recommended)

**Terminal 1 - Start Laravel Backend Server:**
```bash
php artisan serve
```

Server akan berjalan di `http://localhost:8000`. Laravel akan auto-reload ketika ada perubahan file PHP.

**Terminal 2 - Start Vite Dev Server (di folder project root):**
```bash
npm run dev
```

Vite server berjalan di `http://localhost:5173` dengan Hot Module Replacement (HMR) enabled. React component changes akan instantly reflect tanpa page reload.

**Akses Aplikasi:**
- Frontend: http://localhost:8000
- Backend API: http://localhost:8000/api/
- Vite dev: http://localhost:5173 (tidak diakses langsung, proxy melalui Laravel)

### Production Mode

**1. Build Assets:**
```bash
npm run build
```

**2. Optimize Laravel:**
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

**3. Start Server:**
```bash
php artisan serve --host=0.0.0.0 --port=8000
```

Atau gunakan production web server (Nginx/Apache dengan Supervisor untuk background jobs).

### Linting & Code Quality

```bash
# Check ESLint errors
npm run lint

# Fix formatting dengan PHP Stan & Pint
./vendor/bin/pint
./vendor/bin/phpstan analyse

# Run tests (jika ada)
php artisan test
npm run test
```

---

## 🔐 Sistem RBAC (Role-Based Access Control)

MySmartWarehouse mengimplementasikan **3-tier role system** dengan granular permissions di setiap module.

### 1. Roles Overview

Sistem memiliki 3 roles utama dengan responsibilities yang jelas:

| Role | Full Name | Primary Responsibility | Level Access |
|------|-----------|------------------------|---------------|
| **Admin** | Administrator | Full system control & configuration | Super User |
| **Operator** | Warehouse Operator | Transaction & inventory movement | User |
| **Viewer** | Read-only Viewer | View reports & master data | Guest |

### 2. Permission Matrix Lengkap

#### Module: Dashboard
| Feature | Admin | Operator | Viewer |
|---------|:-----:|:--------:|:------:|
| View Dashboard | ✅ | ✅ | ✅ |
| View Summary Stats | ✅ | ✅ | ✅ |

#### Module: Categories (Master Data)
| Action | Admin | Operator | Viewer |
|--------|:-----:|:--------:|:------:|
| View All Categories | ✅ | ❌ | ✅ |
| Create Category | ✅ | ❌ | ❌ |
| Edit Category | ✅ | ❌ | ❌ |
| Soft Delete | ✅ | ❌ | ❌ |
| Restore Deleted | ✅ | ❌ | ❌ |

#### Module: Products (Master Data)
| Action | Admin | Operator | Viewer |
|--------|:-----:|:--------:|:------:|
| View All Products | ✅ | ✅ | ✅ |
| Create Product | ✅ | ❌ | ❌ |
| Edit Product (except SKU) | ✅ | ❌ | ❌ |
| Edit SKU | ❌ | ❌ | ❌ |
| Soft Delete | ✅ | ❌ | ❌ |

**Note:** SKU adalah immutable - tidak bisa diubah setelah produk dibuat (server-side constraint).

#### Module: Transactions (Core Functionality)
| Action | Admin | Operator | Viewer |
|--------|:-----:|:--------:|:------:|
| View All Transactions | ✅ | ✅ | ❌ |
| Create Inbound (Masuk) | ✅ | ✅ | ❌ |
| Create Outbound (Keluar) | ✅ | ✅ | ❌ |
| Edit Own Transaction | ✅ | ✅ | ❌ |
| Edit Others Transaction | ✅ | ❌ | ❌ |
| Soft Delete | ✅ | ❌ | ❌ |

**Validations:**
- Quantity minimum: 1
- Outbound maximum: tidak boleh melebihi available stock
- Only Admin can delete others' transactions

#### Module: Reports
| Action | Admin | Operator | Viewer |
|--------|:-----:|:--------:|:------:|
| Transaction Reports | ✅ | ❌ | ✅ |
| Stock Snapshots | ✅ | ❌ | ✅ |
| Export to PDF/Excel | ✅ | ❌ | ✅ |
| Filter by Date Range | ✅ | ❌ | ✅ |

#### Module: User Management
| Action | Admin | Operator | Viewer |
|--------|:-----:|:--------:|:------:|
| View All Users | ✅ | ❌ | ❌ |
| Create New User | ✅ | ❌ | ❌ |
| Edit User Info | ✅ | ❌ | ❌ |
| Change User Role | ✅ | ❌ | ❌ |
| Deactivate User | ✅ | ❌ | ❌ |
| Restore User | ✅ | ❌ | ❌ |
| Hard Delete | ❌ | ❌ | ❌ |

### 3. Admin Protection Rules (Security)

Admin tidak dapat:
- ✋ **Hard delete** user manapun (soft delete only)
- ✋ **Membuat user baru dengan role Admin** (only seeder/migration)
- ✋ **Menghapus user Admin lain** (hanya bisa deactivate)
- ✋ **Menonaktifkan dirinya sendiri** (prevent account lock)

### 4. Implementation Details

#### Backend (Laravel Policies)

Sistem menggunakan [Laravel Authorization Policies](https://laravel.com/docs/authorization) di `app/Policies/`:

```php
// app/Policies/UserPolicy.php
public function create(User $user): bool
{
    return $user->role === UserRole::ADMIN;
}

public function delete(User $user, User $target): bool
{
    // Admin tidak bisa delete user admin lain
    if ($target->role === UserRole::ADMIN) {
        return false;
    }
    return $user->role === UserRole::ADMIN;
}
```

#### Frontend (React Hooks & Guards)

React menggunakan custom hook `useAuth()` untuk conditional rendering:

```typescript
// components/CategoryForm.tsx
const { auth } = useAuth();
const isAdmin = auth?.user?.role === 'admin';

return (
  <>
    {isAdmin && (
      <Button onClick={handleCreate}>Create Category</Button>
    )}
  </>
);
```

### 5. Test Accounts (From Seeding)

Gunakan credentials berikut untuk testing:

| Email | Password | Role | Status |
|-------|----------|------|--------|
| `admin@warehouse.test` | `password` | Admin | ✅ Active |
| `operator@warehouse.test` | `password` | Operator | ✅ Active |
| `viewer@warehouse.test` | `password` | Viewer | ✅ Active |

**Login Flow:**
1. Buka http://localhost:8000
2. Klik "Login"
3. Masukkan email dan password dari tabel di atas
4. System akan auto-redirect ke dashboard sesuai role

---

## 📊 Struktur Database

### Entity Relationship Diagram

```
users (1) ──────→ (many) transactions
  │
  └─→ deactivate dengan role casting

categories (1) ──────→ (many) products
  │
  └─→ soft delete

products (1) ──────→ (many) transactions
  │
  └─→ soft delete, auto SKU generation

transactions (many) ──→ (1) stock_snapshots (indirect via product)
  │
  └─→ soft delete, reference tracking

stock_snapshots (1) ──→ (1) products
  └─→ periodic snapshot audit
```

### Tabel Details

#### 1. `users` - Authentication & Authorization
| Kolom | Tipe Data | Constraint | Deskripsi |
|-------|-----------|-----------|-----------|
| `id` | BIGINT | PK, Auto-increment | User identifier |
| `name` | VARCHAR(255) | NOT NULL | Nama lengkap user |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | Email login |
| `email_verified_at` | TIMESTAMP | NULLABLE | Email verification |
| `password` | VARCHAR(255) | NOT NULL | Hash password (bcrypt) |
| `role` | VARCHAR(50) | NOT NULL, Cast to Enum | admin, operator, viewer |
| `status` | VARCHAR(50) | NOT NULL, DEFAULT 'active' | active, inactive |
| `created_at` | TIMESTAMP | - | Created timestamp |
| `updated_at` | TIMESTAMP | - | Last update timestamp |
| `deleted_at` | TIMESTAMP | NULLABLE | Soft delete timestamp |

**Foreign Keys:** None (user adalah root)  
**Indexes:** email (UNIQUE), role, status, deleted_at

#### 2. `categories` - Master Kategori Barang
| Kolom | Tipe Data | Constraint | Deskripsi |
|-------|-----------|-----------|-----------|
| `id` | BIGINT | PK, Auto-increment | Category identifier |
| `name` | VARCHAR(255) | NOT NULL, UNIQUE | Nama kategori (e.g., Elektronik, Pakaian) |
| `description` | TEXT | NULLABLE | Deskripsi detail kategori |
| `created_at` | TIMESTAMP | - | Created timestamp |
| `updated_at` | TIMESTAMP | - | Last update timestamp |
| `deleted_at` | TIMESTAMP | NULLABLE | Soft delete timestamp |

**Foreign Keys:** None  
**Indexes:** name (UNIQUE), deleted_at  
**Soft Delete:** ✅ Enabled

#### 3. `products` - Master Produk/Barang
| Kolom | Tipe Data | Constraint | Deskripsi |
|-------|-----------|-----------|-----------|
| `id` | BIGINT | PK, Auto-increment | Product identifier |
| `category_id` | BIGINT | FK, NOT NULL | Reference ke categories (cascade delete) |
| `sku` | VARCHAR(50) | NOT NULL, UNIQUE | Auto-generated SKU (immutable): `SKU-YYYYMMDD-XXXX` |
| `name` | VARCHAR(255) | NOT NULL | Nama produk |
| `description` | TEXT | NULLABLE | Deskripsi detail produk |
| `stock` | INT | NOT NULL, DEFAULT 0 | Current stock quantity (real-time) |
| `min_stock` | INT | NOT NULL, DEFAULT 0 | Minimum stock threshold (alert) |
| `buy_price` | DECIMAL(15,2) | NOT NULL | Harga pembelian per unit |
| `sell_price` | DECIMAL(15,2) | NOT NULL | Harga penjualan per unit |
| `created_at` | TIMESTAMP | - | Created timestamp |
| `updated_at` | TIMESTAMP | - | Last update timestamp |
| `deleted_at` | TIMESTAMP | NULLABLE | Soft delete timestamp |

**Foreign Keys:** `category_id` → categories(id) [ON DELETE CASCADE]  
**Indexes:** category_id, sku (UNIQUE), name, deleted_at  
**Soft Delete:** ✅ Enabled  
**Validations:** 
- SKU auto-generated dan immutable
- stock >= 0 (anti-minus)
- buy_price & sell_price must be positive

#### 4. `transactions` - Log Mutasi Barang
| Kolom | Tipe Data | Constraint | Deskripsi |
|-------|-----------|-----------|-----------|
| `id` | BIGINT | PK, Auto-increment | Transaction identifier |
| `product_id` | BIGINT | FK, NOT NULL | Reference ke products (cascade delete) |
| `user_id` | BIGINT | FK, NOT NULL | Reference ke users (cascade delete) |
| `type` | VARCHAR(20) | NOT NULL, Enum | 'in' (Inbound) atau 'out' (Outbound) |
| `quantity` | INT | NOT NULL | Jumlah unit bergerak (>= 1) |
| `reference_no` | VARCHAR(100) | NULLABLE | No. PO / No. Surat Jalan / Ref ID |
| `notes` | TEXT | NULLABLE | Catatan tambahan transaksi |
| `price_at_transaction` | DECIMAL(15,2) | NOT NULL | Unit price saat transaksi (audit trail) |
| `created_at` | TIMESTAMP | - | Transaction timestamp |
| `updated_at` | TIMESTAMP | - | Last update timestamp |
| `deleted_at` | TIMESTAMP | NULLABLE | Soft delete timestamp |

**Foreign Keys:**
- `product_id` → products(id) [ON DELETE CASCADE]
- `user_id` → users(id) [ON DELETE CASCADE]

**Indexes:** product_id, user_id, type, created_at, deleted_at  
**Soft Delete:** ✅ Enabled  
**Validations:**
- quantity >= 1
- Outbound quantity <= available stock
- price_at_transaction > 0

#### 5. `stock_snapshots` - Periodic Stock Report
| Kolom | Tipe Data | Constraint | Deskripsi |
|-------|-----------|-----------|-----------|
| `id` | BIGINT | PK, Auto-increment | Snapshot identifier |
| `product_id` | BIGINT | FK, NOT NULL | Reference ke products (cascade delete) |
| `period` | VARCHAR(20) | NOT NULL | Period identifier (e.g., "2026-02") |
| `opening_stock` | INT | NOT NULL | Stock awal periode |
| `closing_stock` | INT | NOT NULL | Stock akhir periode |
| `created_at` | TIMESTAMP | - | Created timestamp |
| `updated_at` | TIMESTAMP | - | Last update timestamp |
| `deleted_at` | TIMESTAMP | NULLABLE | Soft delete timestamp |

**Foreign Keys:** `product_id` → products(id) [ON DELETE CASCADE]  
**Indexes:** product_id, period, deleted_at  
**Soft Delete:** ✅ Enabled  
**Unique Constraint:** (product_id, period) - satu snapshot per product per periode

---

## 💡 Business Logic & Data Integrity

### 1. Stock Anti-Minus Logic

System menjamin stok tidak akan pernah negatif dengan **3-layer validation**:

#### Layer 1: Frontend Validation
```typescript
// Dalam TransactionForm - prevent form submission jika quantity > available stock
{transactionType === 'out' && (
  <FormControl isRequired>
    <FormLabel>Quantity</FormLabel>
    <Input
      type="number"
      max={product?.stock}
      min="1"
      // ... other props
    />
  </FormControl>
)}
```

#### Layer 2: Controller Validation
```php
// app/Http/Requests/CreateOutboundTransactionRequest.php
'quantity' => [
    'required',
    'integer',
    'min:1',
    'max:' . ($product->stock ?? 0), // Max tidak boleh > available stock
]
```

#### Layer 3: Database Transaction (Atomic)
```php
// app/Services/TransactionService.php
DB::transaction(function () {
    // 1. Lock row untuk prevent race condition
    $product = Product::lockForUpdate()->find($productId);
    
    // 2. Check stok sekali lagi
    if ($product->stock < $quantity) {
        throw new InsufficientStockException();
    }
    
    // 3. Update stok
    $product->decrement('stock', $quantity);
    
    // 4. Create transaction log
    Transaction::create([...]);
});
```

### 2. Concurrency Control dengan Locking

Mencegah race condition ketika 2 user simultaneous outbound dari stok yang sama:

```php
// lockForUpdate() = SELECT ... FOR UPDATE di MySQL
$product = Product::lockForUpdate()->find($id);
$product->stock; // Guaranteed akurat
```

### 3. Atomic Transactions

Jika ada error di tengah proses, semua changes di-rollback otomatis:

```php
DB::transaction(function () {
    // Jika salah satu query fail, semua di-rollback
    $product->update(['stock' => $newStock]);
    Transaction::create($transactionData);
    StockSnapshot::create($snapshotData);
}, attempts: 2); // Retry 2x jika deadlock
```

### 4. SKU Generation & Immutability

SKU otomatis di-generate saat create product:

```php
// app/Models/Product.php
protected static function booting(): void
{
    static::creating(function (Product $product) {
        // Auto-generate unique SKU
        $product->sku = 'SKU-' . date('Ymd') . '-' . str_pad(
            random_int(0, 9999),
            4,
            '0',
            STR_PAD_LEFT
        );
    });

    // SKU tidak bisa diubah setelah create
    static::updating(function (Product $product) {
        if ($product->isDirty('sku')) {
            throw new Exception('SKU is immutable');
        }
    });
}
```

### 5. Soft Delete & Audit Trail

Master data tidak pernah di-hard delete, hanya soft delete:

```php
// Migration
$table->softDeletes(); // Adds deleted_at column

// Query
Product::all()            // Hanya include active records
Product::withTrashed()    // Include deleted records
Product::onlyTrashed()    // Hanya deleted records
Product::restore()        // Restore dari deleted_at
```

---

## 🌱 Seeding Data

Sistem sudah menyediakan seeders yang populate data realistically untuk development & testing.

### Cara Run Seeding

**Automatic (Fresh Install):**
```bash
php artisan migrate:fresh --seed
```

**Manual (Update Existing):**
```bash
php artisan db:seed
php artisan db:seed --class=UserSeeder
php artisan db:seed --class=ProductSeeder
```

### Seeding Overview

#### 1. UserSeeder
Membuat 3 test users dengan role berbeda:

```php
Users Created:
- admin@warehouse.test / password → Admin
- operator@warehouse.test / password → Operator
- viewer@warehouse.test / password → Viewer
```

**Authentication Test:**
```bash
# Login dengan seeded credentials
Email: admin@warehouse.test
Password: password
```

#### 2. CategorySeeder
Membuat 5 kategori master:
- Electronics (Elektronik)
- Clothing (Pakaian)
- Food & Beverages (Makanan & Minuman)
- Furniture (Perabotan)
- Books (Buku)

#### 3. ProductSeeder
Membuat 20+ products dengan:
- Relasi ke kategori
- Auto-generated unique SKU
- Realistic stock levels (5-100 units)
- Varied pricing (buy & sell price)

**Example Product:**
```
SKU: SKU-20260207-1234
Name: Laptop Dell XPS 13
Category: Electronics
Stock: 15 units
Buy Price: 8,000,000
Sell Price: 9,500,000
```

#### 4. TransactionSeeder
Membuat 20 realistic transactions:
- Jan 2026: 5 transactions
- Feb 2026: 15 transactions (recent)
- Mix of Inbound (masuk) & Outbound (keluar)
- Realistic reference numbers (PO-xxx, SJ-xxx)
- Operators dan dates bervariasi

**Real Transaction Flow:**
```
1. Admin creates product dengan stock 0
2. Seeder creates inbound transaction → stock menjadi +50
3. Seeder creates outbound transaction → stock berkurang -10
4. Final stock = 40
```

#### 5. StockSnapshotSeeder
Membuat snapshot untuk audit trail:
- Monthly snapshots (Dec 2025, Jan 2026, Feb 2026)
- Opening & closing stock untuk setiap product
- Basis untuk stock reconciliation

### Test Data Available After Seeding

```json
{
  "users": 3,
  "categories": 5,
  "products": 20,
  "transactions": 20,
  "snapshots": 60
}
```

### Custom Seeding (Development)

Untuk add custom data tanpa fresh migration:

```php
// database/seeders/CustomSeeder.php
php artisan make:seeder CustomSeeder

// Edit file, kemudian:
php artisan db:seed --class=CustomSeeder
```

---

## 🔌 API Usage

### Base URL
```
http://localhost:8000/api
```

### Authentication
Semua endpoint protected dengan Laravel Sanctum. Gunakan session cookie atau bearer token.

### Common Endpoints

#### Categories
```
GET    /api/categories                 # List all categories
POST   /api/categories                 # Create new category
GET    /api/categories/{id}            # Get specific category
PUT    /api/categories/{id}            # Update category
DELETE /api/categories/{id}            # Soft delete category
```

#### Products
```
GET    /api/products                   # List all products
POST   /api/products                   # Create new product
GET    /api/products/{id}              # Get specific product
PUT    /api/products/{id}              # Update product
DELETE /api/products/{id}              # Soft delete product
```

#### Transactions
```
GET    /api/transactions                        # List all transactions
POST   /api/transactions/inbound                # Create inbound transaction
POST   /api/transactions/outbound               # Create outbound transaction
GET    /api/transactions/{id}                   # Get specific transaction
PUT    /api/transactions/{id}                   # Update transaction
DELETE /api/transactions/{id}                   # Soft delete transaction
```

#### Users
```
GET    /api/users                      # List all users (Admin only)
POST   /api/users                      # Create new user
GET    /api/users/{id}                 # Get specific user
PUT    /api/users/{id}                 # Update user
DELETE /api/users/{id}                 # Deactivate user (soft delete)
```

#### Reports
```
GET    /api/reports/transactions       # Transaction report with filters
GET    /api/reports/stocks             # Stock snapshot report
GET    /api/reports/export?type=pdf    # Export to PDF
```

---

## 🐛 Troubleshooting

### Common Issues & Solutions

#### 1. Database Connection Error
```
SQLSTATE[HY000] [2002] Connection refused
```

**Solutions:**
```bash
# Pastikan MySQL running
sudo service mysql status
sudo service mysql start

# Check .env database config
cat .env | grep DB_

# Test connection
php artisan tinker
DB::connection()->getPdo()
```

#### 2. Key Not Registered
```
RuntimeException: No application encryption key has been generated
```

**Solution:**
```bash
php artisan key:generate
```

#### 3. CORS Error (Frontend to Backend)
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solution:**
Check `.env`:
```env
APP_URL=http://localhost:8000
SESSION_DOMAIN=localhost
```

#### 4. Migration Conflicts
```
Migration file already exists
```

**Solution:**
```bash
# Rollback & fresh start
php artisan migrate:reset
php artisan migrate:fresh --seed
```

#### 5. Node Modules Issues
```
npm ERR! code ERESOLVE
```

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

#### 6. Vite Port Already in Use
```
EADDRINUSE: address already in use 0.0.0.0:5173
```

**Solution:**
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or use different port
npm run dev -- --port 5174
```

#### 7. TypeScript Errors in IDE
```
Cannot find module '@/types/warehouse'
```

**Solution:**
```bash
# Restart IDE & TypeScript server
npm run build
npm run dev
```

#### 8. 403 Unauthorized on API
```
User is not authorized to perform this action
```

**Check:**
1. Pastikan sudah login dengan correct role
2. Check permission matrix di section Sistem RBAC
3. Verify user role di database:
   ```bash
   php artisan tinker
   User::find(1)->role
   ```

#### 9. File Permission Issues
```
Permission denied: /storage
```

**Solution:**
```bash
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

#### 10. Composer Memory Issues
```
PHP Fatal error: Allowed memory size exhausted
```

**Solution:**
```bash
php -d memory_limit=-1 @composer install
```

### Debug Mode

Enable detailed error messages:

```env
# .env
APP_DEBUG=true
LOG_CHANNEL=stack
LOG_LEVEL=debug
```

Check logs:
```bash
tail -f storage/logs/laravel.log
```

### Reset Everything (Nuclear Option)

```bash
# Careful! This deletes all data
php artisan migrate:reset
php artisan migrate:fresh --seed

# Clear cache
php artisan cache:clear
php artisan config:clear
php artisan view:clear
```

---

## 📝 Development Notes

### Code Quality Standards

Project mengikuti:
- **Backend:** Laravel Best Practices, Service-Repository-Action Pattern
- **Frontend:** React Hooks, TypeScript Strict Mode, Functional Components
- **Database:** Proper foreign keys, soft deletes, cascading
- **Language:** English untuk code, Bahasa Indonesia untuk comments

### Checking Code Quality

```bash
# Lint frontend code
npm run lint

# Check backend code style
./vendor/bin/pint

# Type checking dengan phpstan
./vendor/bin/phpstan analyse

# Run tests (jika ada)
php artisan test
```

---

## 📬 Support & Contact

Jika ada issues atau questions:
1. Check Troubleshooting section di atas
2. Review codebase & comments
3. Lihat git commit messages untuk context
4. Contact development team

---

## 📄 License

MIT License - feel free to use & modify untuk keperluan apapun.

---

**Happy Coding! 🚀**
