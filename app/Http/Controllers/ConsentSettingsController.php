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
        $roles = ['Nurse', 'Doctor', 'Sales Agent', 'Medical Representative'];

        //get all the roles for which we already have settings
        $presentRoles = auth()->user()->consentSettings()->get()->pluck('role')->toArray();
    
        return Inertia::render('Patient/Consents/Create', [
            'roles' => array_values(array_diff($roles, $presentRoles))
        ]);
    }

    public function edit(ConsentSetting $setting, Request $request)
    {
        $setting->purpose = json_decode($setting->purpose, true);
        return Inertia::render('Patient/Consents/Edit', [
            'consent' => $setting
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

        return to_route('patient.consent-settings.index')->with('success', 'Setting Created Successfully!');
    }

    public function update(ConsentSetting $setting, Request $request)
    {
        FacadesRequest::validate([
            'role' => ['required'],
            'access_type' => ['required'],
            'purpose' => ['required']
        ]);
        
        $setting->update([
            'role' => $request->role,
            'access_type' => $request->access_type,
            'purpose' =>  json_encode($request->purpose),
        ]); 

        return to_route('patient.consent-settings.index')->with('success', 'Setting Updated Successfully!');
    }
}
