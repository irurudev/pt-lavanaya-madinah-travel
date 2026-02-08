<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    /**
     * Menampilkan halaman login - tidak perlu kirim CSRF manual
     */
    public function showLogin(Request $request): Response
    {
        return Inertia::render('auth/login');
    }

    /**
     * Proses login dan generate session
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Tolak login jika user nonaktif
        $user = User::where('email', $credentials['email'])->first();
        if ($user && !$user->is_active) {
            return back()->withErrors([
                'email' => 'Akun tidak aktif. Silakan hubungi admin.',
            ])->onlyInput('email');
        }

        // Attempt login dengan credentials dan remember me
        if (Auth::attempt($credentials, remember: true)) {
            // Regenerate session untuk mencegah session fixation attack
            $request->session()->regenerate();

            // CRITICAL: Explicitly save session sebelum redirect
            // Ini memastikan session data ter-commit ke database
            $request->session()->save();

            // Get authenticated user
            /** @var User $user */
            $user = Auth::user();
            
            // Log untuk debugging
            Log::info('Login successful', [
                'user_id' => $user->id,
                'email' => $user->email,
                'session_id' => $request->session()->getId(),
                'auth_check' => Auth::check(),
            ]);

            // Redirect ke dashboard dengan intended fallback
            return redirect()->intended(route('warehouse.dashboard'));
        }

        // Login gagal - return back dengan error
        Log::warning('Login failed', [
            'email' => $request->input('email'),
        ]);
        
        return back()->withErrors([
            'email' => 'The provided credentials are incorrect.',
        ])->onlyInput('email');
    }

    /**
     * Proses logout dan hapus session
     */
    public function logout(Request $request)
    {
        // Logout dari session (untuk Inertia.js)
        Auth::logout();

        // Hapus session
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // Hapus token jika ada (untuk API clients)
        if ($request->user()) {
            $request->user()->currentAccessToken()->delete();
        }

        if ($request->expectsJson() || $request->wantsJson()) {
            return response()->json([
                'message' => 'Logout berhasil',
            ]);
        }

        return redirect()->route('login');
    }

    /**
     * Mendapatkan informasi user yang sedang login
     */
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $request->user(),
        ]);
    }
}
