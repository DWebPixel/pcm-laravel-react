<?php

namespace App\Http\Controllers;

use App\Models\ConsentSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Request as FacadesRequest;
use Inertia\Inertia;

class ConsentSettingsController extends Controller
{
    public function index()
    {
        return Inertia::render('Patient/Consents/Index', [
            'consentsSettings' => ConsentSetting::where('patient_id', auth()->id())
                ->get()
                ->transform(fn ($setting) => [
                    'id' => $setting->id,
                    'role' => $setting->role,
                    'access_type' => $setting->access_type,
                    'purpose' => $setting->purposeFiltered,
                ]),
        ]);
    }

    public function create()
    {
        return Inertia::render('Patient/Consents/Create', [

        ]);
    }

    public function edit()
    {
        return Inertia::render('Patient/Consents/Edit', [

        ]);
    }

    public function store(Request $request)
    {
        FacadesRequest::validate([
            'role' => ['required'],
            'access_type' => ['required'],
            'purpose' => ['required']
        ]);
        
        auth()->user()->consentSettings()->create([
            'role' => $request->role,
            'access_type' => $request->access_type,
            'purpose' =>  json_encode($request->purpose),
        ]); 

        return to_route('patient.consent-settings.index')->with('message', 'Setting Created Successfully!');
    }
}
