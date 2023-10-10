<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\ConsentController;
use App\Http\Controllers\ConsentSettingsController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\ImagesController;
use App\Http\Controllers\OrganizationsController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\PatientsController;
use App\Http\Controllers\ReportsController;
use App\Http\Controllers\UsersController;
use App\Models\HealthRecord;
use App\Models\HealthRecordFiles;
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
    Route::post('logout', 'destroy')->name('logout');
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

    Route::prefix('user')->name('doctor.')->group(function() {
        Route::get('request-consent', [DoctorController::class, 'requestConsent'])->name('request-consent');
        Route::post('store-consent', [DoctorController::class, 'storeConsent'])->name('store-consent');
        Route::get('connected-patients', [DoctorController::class, 'connectedPatients'])->name('connected-patients');
        Route::get('connected-patients/{patient}/{consent}/create-record', [DoctorController::class, 'createHealthRecord'])->name('create-health-record');
        Route::post('connected-patients/{patient}/{consent}/store-record', [DoctorController::class, 'storeHealthRecord'])->name('store-health-record');
        Route::get('connected-patients/{patient}/{consent}/view-records', [DoctorController::class, 'viewHealthRecords'])->name('view-health-records');
        Route::get('logs', [DoctorController::class, 'viewLogs'])->name('view-logs');
    });

    Route::prefix('patient')->name('patient.')->group(function() {
        Route::get('consent-requests', [PatientController::class, 'consentRequests'])->name('index-consents');
        Route::post('consent-requests/{consent}/update-status/{status}', [PatientController::class, 'updateConsent'])->name('update-consent');
        Route::get('health-records', [PatientController::class, 'healthRecords'])->name('index-health-records');
        Route::get('connected-entities', [PatientController::class, 'connectedEntities'])->name('connected-entities');
        Route::get('consent-settings/index', [ConsentSettingsController::class, 'index'])->name('consent-settings.index');
        Route::get('consent-settings/create', [ConsentSettingsController::class, 'create'])->name('consent-settings.create');
        Route::get('consent-settings/{setting}/edit', [ConsentSettingsController::class, 'edit'])->name('consent-settings.edit');
        Route::post('consent-settings/store', [ConsentSettingsController::class, 'store'])->name('consent-settings.store');
        Route::post('consent-settings/{setting}/update', [ConsentSettingsController::class, 'update'])->name('consent-settings.update');
        Route::get('logs', [PatientController::class, 'viewLogs'])->name('view-logs');
    });
});

// Images
Route::get('/img/{path}', [ImagesController::class, 'show'])
    ->where('path', '.*')
    ->name('image');

Route::get("/validate_health_record_file", function() {
    
    $record = HealthRecordFiles::find(request()->id);
    if(!$record) return "Record not found!";

    $path  = asset($record->file_url);
    echo $path;
    echo "<br/>";
    $currentHash = hash_file('sha256', $path);
    $storedHash = $record->hash;

    echo "Current Hash: " . $currentHash; 
    echo "<br/>";
    echo "Stored Hash: " . $storedHash;
    echo "<br/>";
    echo "<br/>";
    return $currentHash == $storedHash ? "Hash Matched!" : "Hash Didn't Match!";
});
