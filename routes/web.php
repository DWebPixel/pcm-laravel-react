<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\ConsentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\ImagesController;
use App\Http\Controllers\OrganizationsController;
use App\Http\Controllers\PatientsController;
use App\Http\Controllers\ReportsController;
use App\Http\Controllers\UsersController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Auth
Route::controller(AuthenticatedSessionController::class)->group(function () {
    Route::middleware('guest')->group(function () {
        Route::get('login', 'create')->name('login');
        Route::post('login', 'store')->name('login.store');
    });
    Route::delete('logout', 'destroy')->name('logout');
});

Route::middleware('auth')->group(function () {
    // Dashboard
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // Users
    Route::resource('users', UsersController::class)->except(['show']);
    Route::put('users/{user}/restore', [UsersController::class, 'restore'])->name('users.restore');
    Route::post('users/{user}/update-meta', [UsersController::class, 'updateMeta'])->name('users.update_meta');

    // Organizations
    Route::resource('organizations', OrganizationsController::class)->except(['show']);
    Route::put('organizations/{organization}/restore', [OrganizationsController::class, 'restore'])->name('organizations.restore');
    Route::get('organizations/{organization}/create-user', [OrganizationsController::class, 'createUser'])->name('organizations.create_user');
    Route::post('organizations/{organization}/store-user', [OrganizationsController::class, 'storeUser'])->name('organizations.store_user');

    // Patients
    Route::resource('patients', PatientsController::class)->except(['show']);
    Route::put('patients/{patient}/restore', [PatientsController::class, 'restore'])->name('patients.restore');

    // Reports
    Route::get('reports', [ReportsController::class, 'index'])->name('reports');

    Route::prefix('doctor')->name('doctor.')->group(function() {
        Route::get('request-consent', [DoctorController::class, 'requestConsent'])->name('request-consent');
        Route::post('store-consent', [ConsentController::class, 'store'])->name('store-consent');
        Route::get('connected-patients', [DoctorController::class, 'connectedPatients'])->name('connected-patients');
    });
});

// Images
Route::get('/img/{path}', [ImagesController::class, 'show'])
    ->where('path', '.*')
    ->name('image');
