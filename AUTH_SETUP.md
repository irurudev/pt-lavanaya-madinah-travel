# Authentication Setup - MySmartWarehouse

## Konfigurasi Authentication

Aplikasi menggunakan **Laravel Sanctum** untuk API authentication dengan token-based system.

### Login Credentials

**Demo Admin Account:**
- Email: `admin@example.com`
- Password: `password`

**Demo Operator Account:**
- Email: `operator@example.com`
- Password: `password`

**Demo Viewer Account:**
- Email: `viewer@example.com`
- Password: `password`

### Cara Menggunakan

1. **Login**
   - Akses: `/login`
   - Input email dan password
   - Token akan disimpan otomatis di localStorage
   - Redirect ke dashboard setelah berhasil login

2. **Logout**
   - API endpoint: `POST /api/logout`
   - Token akan dihapus dari database dan localStorage

3. **Check User Info**
   - API endpoint: `GET /api/me`
   - Mengembalikan informasi user yang sedang login

### Protected Routes

Semua routes warehouse memerlukan authentication:

**Web Routes (Inertia):**
- `/warehouse/dashboard`
- `/warehouse/categories`
- `/warehouse/products`
- `/warehouse/transactions`

**API Routes:**
- `GET /api/categories`
- `POST /api/categories`
- `GET /api/products`
- `POST /api/products`
- `GET /api/transactions`
- `POST /api/transactions/inbound`
- `POST /api/transactions/outbound`
- Dan semua endpoint warehouse lainnya

### Axios Configuration

File `resources/js/lib/axios.ts` sudah dikonfigurasi untuk:
- ✅ Menambahkan token Bearer ke setiap request
- ✅ Handle 401 Unauthorized dengan auto-redirect ke login
- ✅ Auto-load token dari localStorage saat aplikasi start

### Token Management

Token disimpan di:
- **Database**: `personal_access_tokens` table
- **Browser**: localStorage dengan key `auth_token`

### Security Features

1. **Token Expiration**: Token tidak expire secara default (bisa dikonfigurasi di `config/sanctum.php`)
2. **Token Revocation**: Token dihapus saat logout
3. **Authorization**: Setiap endpoint dilindungi dengan middleware `auth:sanctum`
4. **Policy**: Setiap action (create, update, delete) memerlukan authorization melalui Policy

### Troubleshooting

**Error: "Route [login] not defined"**
- ✅ Solved: Route login sudah ditambahkan di `routes/web.php`

**Error: "Auth guard [sanctum] is not defined"**
- ✅ Solved: Guard sanctum sudah ditambahkan di `config/auth.php`

**Error: "Unauthenticated"**
- Pastikan token valid dan sudah tersimpan di localStorage
- Coba logout dan login ulang

### Technical Stack

- **Backend**: Laravel 12 + Sanctum v4.3.0
- **Frontend**: React + TypeScript + Axios
- **Auth Flow**: SPA (Single Page Application) dengan Token Authentication
