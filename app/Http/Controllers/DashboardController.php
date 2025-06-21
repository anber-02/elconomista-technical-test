<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    //
    public function index()
    {
        $user = Auth::user();
        $data = $user->forms()->with('fields.options')->orderBy('created_at', 'desc')->paginate(9);
        return Inertia::render('dashboard', [
            'forms' => $data,
        ]);
    }
}
