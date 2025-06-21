<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FormController;
use App\Http\Controllers\FormSubmissionController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

Route::get('/', function () {
    return Auth::check() ? redirect()->route('dashboard') : redirect()->route('login');
})->name('home');


// Ruta para los archivos
Route::get('/files/{path}', function ($path) {
    $filePath = '/' . $path;
    // dd($filePath);
    if (!Storage::exists($filePath)) {
        abort(404);
    }

    $mime = Storage::mimeType($filePath);
    $file = Storage::get($filePath);

    return Response::make($file, 200, [
        'Content-Type' => $mime,
    ]);
})->where('path', '.*')->name('ver-archivo')->middleware(['auth']);


Route::middleware(['auth', 'verified', 'redirect-by-role'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::post('/forms', [FormController::class, 'store'])->name('forms');
    Route::post('/forms/{form}/submit', [FormSubmissionController::class, 'submit'])->name('forms.submit');
    Route::get('/forms/{form}/submissions', [FormSubmissionController::class, 'submissions'])->name('forms.submissions');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
