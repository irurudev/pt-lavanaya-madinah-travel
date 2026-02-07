<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Tangani incoming request
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        if (Auth::user()?->role !== UserRole::Admin) {
            abort(403, 'Unauthorized. Hanya admin yang bisa mengakses halaman ini.');
        }

        return $next($request);
    }
}
