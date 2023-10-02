<?php

namespace App\Http\Controllers;

use App\Models\Consent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PatientController extends Controller
{
    public function consentRequests()
    {
        $consentRequests = auth()->user()->consents()->Waiting()
                ->paginate(10)
                ->withQueryString()
                ->through(fn ($consent) => [
                    'id' => $consent->id,
                    'requestor_name' => $consent->requestor->name,
                    'organization' => $consent->organization->name,
                    'role' => $consent->role,
                    'access_type' => $consent->access_type,
                    'purpose' => $consent->requestedPurpose,
                    'requested_at' => $consent->created_at->format('Y-m-d H:i:s'),
                ]);
        return Inertia::render('Patient/ConsentRequests', [ 'requests' => $consentRequests]);
    }

    public function updateConsent(Consent $consent, $status, Request $request): RedirectResponse
    {   
        $consent->update(['status' => $status]);
        return to_route('patient.index-consents')->with('success', 'Status updated.');
    }

    public function healthRecords()
    {
        return Inertia::render('Patient/HealthRecords', [ 'user' => auth()->user()]);
    }

    public function connectedDoctors()
    {
        return Inertia::render('Patient/ConnectedDoctors', [ 'user' => auth()->user()]);
    }

    public function consentSettings()
    {
        return Inertia::render('Patient/ConsentSettings', [ 'user' => auth()->user()]);
    }
}
