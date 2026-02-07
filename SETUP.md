# MySmartWarehouse - Setup Instructions

## 📝 Prerequisites

- PHP 8.2+
- Composer
- Node.js 18+ & npm
- MySQL 8.0+

## 🚀 Installation Steps

### 1. Install Dependencies

```bash
# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install
```

### 2. Environment Setup

```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 3. Database Configuration

Update your `.env` file with database credentials:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=warehouse_db
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### 4. Run Migrations & Seeders

```bash
# Run migrations to create tables
php artisan migrate

# Seed database with sample data
php artisan db:seed
```

### 5. Start Development Servers

```bash
# Terminal 1: Laravel development server
php artisan serve

# Terminal 2: Vite development server
npm run dev
```

## 👤 Default User Credentials

After seeding, you can login with:

- **Admin**: admin@example.com / password
- **Operator**: operator@example.com / password
- **Viewer**: viewer@example.com / password

## 📂 Project Structure

### Backend (Laravel)

```
app/
├── Actions/               # Single-purpose business logic
├── DTOs/                  # Data Transfer Objects
├── Enums/                 # PHP Enums (TransactionType)
├── Http/
│   ├── Controllers/Api/   # API Controllers (ramping)
│   ├── Requests/          # Form Request validation
│   └── Resources/         # JSON Resources
├── Models/                # Eloquent Models
├── Policies/              # Authorization policies
├── Repositories/          # Database queries
└── Services/              # Business logic coordination
```

### Frontend (React)

```
resources/js/
├── api/                   # API service functions
├── components/            # Reusable components
├── hooks/                 # Custom React hooks
├── layouts/               # Layout components
├── pages/warehouse/       # Page components
└── types/                 # TypeScript definitions
```

## 🔥 Key Features

### Backend Features

1. **Service-Repository-Action Pattern** - Clean separation of concerns
2. **Atomic Transactions** - DB::transaction() ensures data consistency
3. **Concurrency Control** - lockForUpdate() prevents race conditions
4. **Anti-Minus Stock Validation** - Business rule enforcement at Action layer
5. **Soft Deletes** - Data preservation for audit trails
6. **Policy-Based Authorization** - Granular access control

### Frontend Features

1. **Custom Hooks** - useCategories, useProducts, useTransactions
2. **Type-Safe** - Full TypeScript support
3. **Reusable Components** - Forms, Tables, Cards
4. **Real-time Validation** - Client-side + Server-side validation
5. **Responsive Design** - DaisyUI + Tailwind CSS

## 🌐 Available Routes

### Web Routes (Inertia)

- `/` - Dashboard
- `/warehouse/dashboard` - Warehouse Dashboard
- `/warehouse/categories` - Manage Categories
- `/warehouse/products` - Manage Products
- `/warehouse/transactions` - Transaction History

### API Routes

- `GET /api/categories` - List all categories
- `POST /api/categories` - Create category
- `GET /api/categories/{id}` - Get category
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category

- `GET /api/products` - List all products
- `GET /api/products/low-stock` - Get low stock products
- `POST /api/products` - Create product
- `GET /api/products/{id}` - Get product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

- `GET /api/transactions` - List all transactions
- `POST /api/transactions/inbound` - Create inbound transaction
- `POST /api/transactions/outbound` - Create outbound transaction (with stock validation)
- `GET /api/transactions/{id}` - Get transaction
- `DELETE /api/transactions/{id}` - Delete transaction

## 🧪 Testing

```bash
# Run PHP tests
php artisan test

# Or with Pest
./vendor/bin/pest
```

## 📊 Database Schema

### Tables

1. **categories** - Product categories
2. **products** - Product master data (with stock tracking)
3. **transactions** - Transaction log (inbound/outbound)
4. **stock_snapshots** - Periodic stock snapshots
5. **users** - User authentication

### Key Relationships

- Product → Category (belongsTo)
- Transaction → Product (belongsTo)
- Transaction → User (belongsTo)
- Product → Transactions (hasMany)
- Product → StockSnapshots (hasMany)

## 🔐 Business Logic Highlights

### Inbound Transaction Flow

1. User submits form → Validation (StoreInboundTransactionRequest)
2. Controller calls CreateInboundTransactionAction
3. Action starts DB::transaction
4. Create transaction record
5. Increment product stock
6. Commit transaction
7. Return success response

### Outbound Transaction Flow

1. User submits form → Validation (StoreOutboundTransactionRequest)
2. Controller calls CreateOutboundTransactionAction
3. Action starts DB::transaction
4. Lock product record (lockForUpdate)
5. **Validate stock availability** (throws exception if insufficient)
6. Create transaction record
7. Decrement product stock
8. Commit transaction
9. Return success response

### Stock Anti-Minus Logic

```php
// Inside CreateOutboundTransactionAction
$lockedProduct = Product::lockForUpdate()->find($product->id);

if ($lockedProduct->stock < $quantity) {
    throw new Exception("Stok tidak cukup");
}
```

## 🛠 Common Commands

```bash
# Clear all caches
php artisan optimize:clear

# Fresh migration with seed
php artisan migrate:fresh --seed

# Format code with Laravel Pint
./vendor/bin/pint

# Build for production
npm run build
```

## 📝 Coding Standards

### Backend (PHP)

- All class names, methods, variables: **English**
- All comments explaining logic: **Indonesian**
- Use Type Hinting everywhere
- Use `use` statements (no FQCN in code)
- Follow PSR-12 coding standard

### Frontend (TypeScript/React)

- Component names: **PascalCase**
- Functions/variables: **camelCase**
- All UI text: **English**
- All comments: **Indonesian**
- Use TypeScript strictly (no `any`)

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Change Laravel port
php artisan serve --port=8001

# Change Vite port (in vite.config.ts)
server: { port: 3001 }
```

### Permission Issues

```bash
# Fix storage permissions
chmod -R 775 storage bootstrap/cache
```

### Migration Issues

```bash
# Reset database completely
php artisan migrate:fresh --seed
```

## 📚 Additional Resources

- [Laravel Documentation](https://laravel.com/docs)
- [Inertia.js Guide](https://inertiajs.com/)
- [DaisyUI Components](https://daisyui.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Built with ❤️ using Laravel, Inertia.js, React, and DaisyUI**
