<?php

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\SnapshotController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

// Authentication routes (moved to web.php for proper session handling)
Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('me', [AuthController::class, 'me'])->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    // Users endpoints - admin only
    Route::apiResource('users', UserController::class);
    Route::put('users/{user}/toggle-status', [UserController::class, 'toggleStatus']);

    // Categories endpoints
    Route::apiResource('categories', CategoryController::class);

    // Products endpoints - low-stock harus sebelum apiResource
    Route::get('products/low-stock', [ProductController::class, 'lowStock']);
    Route::apiResource('products', ProductController::class);

    // Transactions endpoints
    Route::get('transactions', [TransactionController::class, 'index']);
    Route::get('transactions/{transaction}', [TransactionController::class, 'show']);
    Route::post('transactions/inbound', [TransactionController::class, 'storeInbound']);
    Route::post('transactions/outbound', [TransactionController::class, 'storeOutbound']);
    Route::delete('transactions/{transaction}', [TransactionController::class, 'destroy']);

    // Reports endpoints
    Route::get('reports/stock', [ReportController::class, 'stockReport']);
    Route::get('reports/stock/export', [ReportController::class, 'exportStock']);
    Route::get('reports/transactions', [ReportController::class, 'transactionReport']);
    Route::get('reports/transactions/export', [ReportController::class, 'exportTransactions']);
    Route::get('reports/inbound', [ReportController::class, 'inboundReport']);
    Route::get('reports/outbound', [ReportController::class, 'outboundReport']);

    // Snapshots endpoints (period-end audits)
    Route::get('snapshots', [SnapshotController::class, 'index']);
    Route::get('snapshots/periods', [SnapshotController::class, 'periods']);
    Route::get('snapshots/period/{period}', [SnapshotController::class, 'byPeriod']);
    Route::post('snapshots', [SnapshotController::class, 'store']);
    Route::post('snapshots/previous-month', [SnapshotController::class, 'createPreviousMonth']);
});
