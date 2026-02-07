<?php

namespace App\Http\Controllers\Api;

use App\DTOs\StockSnapshotDTO;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStockSnapshotRequest;
use App\Http\Resources\StockSnapshotResource;
use App\Services\StockSnapshotService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SnapshotController extends Controller
{
    public function __construct(
        protected StockSnapshotService $snapshotService,
    ) {}

    /**
     * Get semua stock snapshots dengan pagination
     * GET /snapshots
     */
    public function index(Request $request): JsonResponse
    {
        // Check permission untuk view snapshots
        $role = Auth::user()?->role;
        if (!in_array($role, [UserRole::Admin, UserRole::Operator, UserRole::Viewer], true)) {
            abort(403, 'Unauthorized to view snapshots');
        }

        $perPage = (int) $request->query('per_page', 10);
        $perPage = $perPage > 0 ? $perPage : 10;

        $snapshots = $this->snapshotService->getAllSnapshots($perPage);

        return response()->json([
            'success' => true,
            'data' => StockSnapshotResource::collection($snapshots->items()),
            'pagination' => [
                'current_page' => $snapshots->currentPage(),
                'last_page' => $snapshots->lastPage(),
                'per_page' => $snapshots->perPage(),
                'total' => $snapshots->total(),
            ],
        ]);
    }

    /**
     * Get list periode snapshots yang tersedia
     * GET /snapshots/periods
     */
    public function periods(): JsonResponse
    {
        $periods = $this->snapshotService->getExistingPeriods();

        return response()->json([
            'success' => true,
            'periods' => $periods,
        ]);
    }

    /**
     * Get snapshots untuk periode tertentu
     * GET /snapshots/period/{period}
     */
    public function byPeriod(Request $request, string $period): JsonResponse
    {
        // Check permission untuk view snapshots
        $role = Auth::user()?->role;
        if (!in_array($role, [UserRole::Admin, UserRole::Operator, UserRole::Viewer], true)) {
            abort(403, 'Unauthorized to view snapshots');
        }

        $perPage = (int) $request->query('per_page', 10);
        $perPage = $perPage > 0 ? $perPage : 10;

        $snapshots = $this->snapshotService->getSnapshotsByPeriodPaginated($period, $perPage);
        $summary = $this->snapshotService->getSnapshotSummary($period);

        return response()->json([
            'success' => true,
            'data' => StockSnapshotResource::collection($snapshots->items()),
            'pagination' => [
                'current_page' => $snapshots->currentPage(),
                'last_page' => $snapshots->lastPage(),
                'per_page' => $snapshots->perPage(),
                'total' => $snapshots->total(),
            ],
            'summary' => $summary,
        ]);
    }

    /**
     * Buat snapshot untuk periode tertentu
     * POST /snapshots
     */
    public function store(StoreStockSnapshotRequest $request): JsonResponse
    {
        // Check permission - hanya admin/operator bisa membuat snapshot
        $role = Auth::user()?->role;
        if ($role !== UserRole::Admin && $role !== UserRole::Operator) {
            abort(403, 'Unauthorized to create snapshots');
        }

        try {
            $dto = StockSnapshotDTO::from($request->validated());
            $snapshots = $this->snapshotService->createSnapshot($dto);
            $period = $dto->period ?? now()->format('Y-m');

            return response()->json([
                'success' => true,
                'message' => "Snapshot untuk periode {$period} berhasil dibuat",
                'data' => StockSnapshotResource::collection($snapshots),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Buat snapshot untuk bulan sebelumnya (period-end audit)
     * POST /snapshots/previous-month
     */
    public function createPreviousMonth(): JsonResponse
    {
        // Check permission - hanya admin/operator bisa membuat snapshot
        $role = Auth::user()?->role;
        if ($role !== UserRole::Admin && $role !== UserRole::Operator) {
            abort(403, 'Unauthorized to create snapshots');
        }

        try {
            $snapshots = $this->snapshotService->createPreviousMonthSnapshot();
            $period = now()->subMonth()->format('Y-m');

            return response()->json([
                'success' => true,
                'message' => "Snapshot periode {$period} (bulan lalu) berhasil dibuat",
                'data' => StockSnapshotResource::collection($snapshots),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }
}
