# MySmartWarehouse
Advanced inventory and warehouse management system built with Laravel and React.

Status: Production ready
Version: 1.0.0
Last updated: February 2026

---

## Features
- Role-based access control (Admin, Operator, Viewer)
- Category and product management
- Automatic SKU generation (immutable)
- Stock tracking with low-stock indicators
- Inbound and outbound transaction records
- Stock snapshots for periodic inventory checks
- Reporting for transactions and stock
- Soft deletes for master data (categories, products)

---

## Tech Stack
- Backend: Laravel 12
- Frontend: React 18 + TypeScript
- SSR: Inertia.js
- UI: Chakra UI
- Build: Vite
- Database: MySQL 8

---

## Requirements
- PHP 8.2+
- Composer
- Node.js 18+ and npm
- MySQL 8.0+

---

## Quick Start
```bash
# Install dependencies
composer install
npm install

# Setup environment
cp .env.example .env
php artisan key:generate

# Setup database
php artisan migrate:fresh --seed

# Run servers (two terminals)
php artisan serve
npm run dev
```

Application URL: http://localhost:8000

---

## Environment Setup
Example .env values:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ptlavanaya
DB_USERNAME=root
DB_PASSWORD=yourpassword

APP_NAME="MySmartWarehouse"
APP_URL=http://localhost:8000
APP_ENV=local
APP_DEBUG=true
```

---

## NPM Scripts
```bash
npm run dev        # Start Vite dev server
npm run build      # Build assets for production
npm run build:ssr  # Build SSR assets
npm run types      # Type check (tsc --noEmit)
npm run lint       # ESLint with auto-fix
npm run format     # Prettier format resources/
```

---

## RBAC Overview
- Admin: Full access
- Operator: Manage products and transactions
- Viewer: Read-only access

Authorization is enforced via Laravel Policies and role checks.

---

## Data Integrity and Soft Deletes
- Categories and products use soft deletes
- Product relations load soft deleted parents for history integrity
- Creating a category with a deleted name restores the old record

---

## Project Structure (Frontend)
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

## Troubleshooting
- Run `php artisan migrate:fresh --seed` if schema and seed data are out of sync
- Run `npm run types` if the UI is not compiling
- Check `.env` database settings if migrations fail
