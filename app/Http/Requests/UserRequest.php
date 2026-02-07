<?php

namespace App\Http\Requests;

use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Enum;

class UserRequest extends FormRequest
{
    /**
     * Tentukan apakah user authorized untuk request ini.
     */
    public function authorize(): bool
    {
        return Auth::check() && Auth::user()?->role === UserRole::Admin;
    }

    /**
     * Dapatkan validasi rules untuk request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        $userId = $this->route('user')?->id;
        
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email,' . $userId],
            'password' => [
                $userId ? 'nullable' : 'required',
                'min:8',
            ],
            'role' => ['required', new Enum(UserRole::class), 'not_in:admin'],
            'is_active' => ['boolean'],
        ];
    }

    /**
     * Pesan validasi custom.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama user wajib diisi.',
            'name.max' => 'Nama user maksimal 255 karakter.',
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Email harus format email yang valid.',
            'email.unique' => 'Email sudah digunakan.',
            'password.required' => 'Password wajib diisi saat membuat user baru.',
            'password.min' => 'Password minimal 8 karakter.',
            'role.required' => 'Role/posisi wajib dipilih.',
            'role.not_in' => 'Role admin tidak dapat diassign oleh user biasa.',
        ];
    }
}
