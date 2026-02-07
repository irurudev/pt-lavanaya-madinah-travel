<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Login page
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('login.store');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Debug route - check auth status
Route::get('/debug/auth', function () {
    $user = Auth::user();
    $sessionData = session()->all();
    
    return response()->json([
        'authenticated' => Auth::check(),
        'user' => $user,
        'session_id' => session()->getId(),
        'has_token' => session()->has('_token'),
        'session_data_keys' => array_keys($sessionData),
        'guard' => config('auth.defaults.guard'),
    ]);
})->middleware('web');

Route::get('/', function () {
    return Inertia::render('warehouse/dashboard');
})->name('home');

// Warehouse Management Routes - gunakan session auth
Route::prefix('warehouse')->middleware(['web', 'auth'])->name('warehouse.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('warehouse/dashboard');
    })->name('dashboard');

    Route::get('/categories', function () {
        return Inertia::render('warehouse/categories');
    })->name('categories');

    Route::get('/products', function () {
        return Inertia::render('warehouse/products');
    })->name('products');

    Route::get('/transactions', function () {
        return Inertia::render('warehouse/transactions');
    })->name('transactions');

    // User Management - hanya admin
    Route::get('/users', function () {
        return Inertia::render('warehouse/users');
    })->middleware('admin')->name('users');

    // Reports routes
    Route::prefix('reports')->name('reports.')->group(function () {
        Route::get('/stock', function () {
            return Inertia::render('warehouse/reports/stock');
        })->name('stock');

        Route::get('/transactions', function () {
            return Inertia::render('warehouse/reports/transactions');
        })->name('transactions');

        Route::get('/snapshots', function () {
            return Inertia::render('warehouse/reports/snapshots');
        })->name('snapshots');
    });
});
