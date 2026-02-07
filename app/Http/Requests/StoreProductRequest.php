<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'category_id' => ['required', 'exists:categories,id'],
            'sku' => ['prohibited'],
            'name' => ['required', 'string', 'max:255'],
            'min_stock' => ['required', 'integer', 'min:0'],
            'buy_price' => ['required', 'numeric', 'min:0'],
            'sell_price' => ['required', 'numeric', 'min:0'],
        ];
    }

    /**
     * Get custom error messages
     */
    public function messages(): array
    {
        return [
            'category_id.required' => 'Kategori wajib dipilih',
            'category_id.exists' => 'Kategori tidak ditemukan',
            'sku.prohibited' => 'SKU dihasilkan otomatis',
            'name.required' => 'Nama produk wajib diisi',
            'min_stock.required' => 'Stok minimal wajib diisi',
            'min_stock.integer' => 'Stok minimal harus berupa angka',
            'buy_price.required' => 'Harga beli wajib diisi',
            'buy_price.numeric' => 'Harga beli harus berupa angka',
            'sell_price.required' => 'Harga jual wajib diisi',
            'sell_price.numeric' => 'Harga jual harus berupa angka',
        ];
    }
}
