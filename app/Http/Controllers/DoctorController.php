<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DoctorController extends Controller
{
    public function requestConsent()
    {
        return Inertia::render('Doctor/RequestConsent', [ 'user' => auth()->user()]);
    }

    public function connectedPatients()
    {
        return Inertia::render('Doctor/ConnectedPatients', [ 'user' => auth()->user()]);
    }
}
