<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreStockSnapshotRequest extends FormRequest
{
    /**
     * Check apakah user diizinkan membuat snapshot
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Aturan validasi untuk membuat snapshot
     * period format: YYYY-MM (contoh: 2026-02)
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'period' => ['nullable', 'date_format:Y-m'],
        ];
    }

    /**
     * Pesan error khusus
     */
    public function messages(): array
    {
        return [
            'period.date_format' => 'Format periode harus YYYY-MM (contoh: 2026-02).',
        ];
    }
}
