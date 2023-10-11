<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next , $role): Response
    {
        if (!$request->user()) {
            abort(403); // or redirect to another page
        }

        if ($role == 'NotPatient' ? !$request->user()->hasNotRole('Patient') : !$request->user()->hasRole($role)) {
            abort(403); // or redirect to another page
        }

        return $next($request);
    }
}
