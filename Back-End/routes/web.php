<?php

use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

Route::prefix('__dashboard')->group(function () {
	Route::get('/', [DashboardController::class, '__invoke']);
	Route::get('/table', [DashboardController::class, 'table']);
});

// React SPA (built into public/build)
Route::get('/{any?}', function () {
	$indexPath = public_path('build/index.html');

	abort_unless(file_exists($indexPath), 404, 'SPA build not found. Run from Back-End/: npm run build:spa');

	return response()->file($indexPath);
})->where('any', '^(?!api(?:/|$)|__dashboard(?:/|$)|build(?:/|$)|storage(?:/|$)).*');