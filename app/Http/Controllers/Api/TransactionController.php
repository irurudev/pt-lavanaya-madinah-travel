<?php

namespace App\Http\Controllers\Api;

use App\Actions\CreateInboundTransactionAction;
use App\Actions\CreateOutboundTransactionAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreInboundTransactionRequest;
use App\Http\Requests\StoreOutboundTransactionRequest;
use App\Http\Resources\TransactionResource;
use App\Models\Product;
use App\Models\Transaction;
use App\Repositories\TransactionRepository;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function __construct(
        protected TransactionRepository $transactionRepository,
        protected CreateInboundTransactionAction $inboundAction,
        protected CreateOutboundTransactionAction $outboundAction,
    ) {}

    /**
     * Menampilkan daftar semua transaksi
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = (int) $request->query('per_page', 10);
        $perPage = $perPage > 0 ? $perPage : 10;

        $transactions = $this->transactionRepository->paginate($perPage);

        return response()->json([
            'data' => TransactionResource::collection($transactions->items()),
            'pagination' => [
                'current_page' => $transactions->currentPage(),
                'last_page' => $transactions->lastPage(),
                'per_page' => $transactions->perPage(),
                'total' => $transactions->total(),
            ],
        ]);
    }

    /**
     * Menampilkan detail transaksi spesifik
     */
    public function show(Transaction $transaction): JsonResponse
    {
        $this->authorize('view', $transaction);

        return response()->json([
            'data' => new TransactionResource($transaction->load(['product.category', 'user'])),
        ]);
    }

    /**
     * Membuat transaksi masuk (barang masuk ke gudang)
     * Reference number dan harga di-generate otomatis dari sistem
     */
    public function storeInbound(StoreInboundTransactionRequest $request): JsonResponse
    {
        try {
            $product = Product::findOrFail($request->product_id);
            $this->authorize('create', Transaction::class);

            $transaction = $this->inboundAction->execute(
                product: $product,
                userId: Auth::id(),
                quantity: $request->quantity,
                notes: $request->notes,
            );

            return response()->json([
                'message' => 'Transaksi masuk berhasil dibuat. Stok produk telah diperbarui.',
                'data' => new TransactionResource($transaction->load(['product.category', 'user'])),
            ], Response::HTTP_CREATED);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Gagal membuat transaksi masuk',
                'error' => $e->getMessage(),
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * Membuat transaksi keluar (barang keluar dari gudang)
     * Dengan validasi ketat: stok tidak boleh minus
     * Reference number dan harga di-generate otomatis dari sistem
     */
    public function storeOutbound(StoreOutboundTransactionRequest $request): JsonResponse
    {
        try {
            $product = Product::findOrFail($request->product_id);
            $this->authorize('create', Transaction::class);

            $transaction = $this->outboundAction->execute(
                product: $product,
                userId: Auth::id(),
                quantity: $request->quantity,
                notes: $request->notes,
            );

            return response()->json([
                'message' => 'Transaksi keluar berhasil dibuat. Stok produk telah diperbarui.',
                'data' => new TransactionResource($transaction->load(['product.category', 'user'])),
            ], Response::HTTP_CREATED);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Gagal membuat transaksi keluar',
                'error' => $e->getMessage(),
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * Menghapus transaksi (hanya admin)
     */
    public function destroy(Transaction $transaction): JsonResponse
    {
        $this->authorize('delete', $transaction);

        $this->transactionRepository->delete($transaction);

        return response()->json([
            'message' => 'Transaksi berhasil dihapus',
        ]);
    }
}
