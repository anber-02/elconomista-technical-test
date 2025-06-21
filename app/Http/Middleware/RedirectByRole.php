<?php

namespace App\Http\Middleware;

use Closure;
use Filament\Facades\Filament;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class RedirectByRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user()) {
            // Si no hay usuario autenticado, continuar con la solicitud
            return $next($request);
        }

        $user = $request->user();
        $isAdmin = $user->hasRole('admin');
        $isFilamentRoute = $request->routeIs('filament.*');

        if ($isAdmin && !$isFilamentRoute) {
            return Inertia::location(Filament::getUrl());
        }

        if (!$isAdmin && $isFilamentRoute) {
            return Inertia::location('dashboard');
        }

        return $next($request);
    }
}
