<?php

use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

Route::prefix('__dashboard')->group(function () {
	Route::get('/', [DashboardController::class, '__invoke']);
	Route::get('/table', [DashboardController::class, 'table']);
});

// React SPA (built into public/app)
Route::get('/{any?}', function () {
	$indexPath = public_path('app/index.html');

	abort_unless(file_exists($indexPath), 404, 'SPA build not found. Run: npm --prefix ../Front-End run build');

	return response()->file($indexPath);
})->where('any', '^(?!api(?:/|$)|__dashboard(?:/|$)).*');