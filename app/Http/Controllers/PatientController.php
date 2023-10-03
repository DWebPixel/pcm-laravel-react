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
        $update_array = [
            'status' => $status,
        ];

        if( $status == 'granted') {
            $update_array['granted_on'] = now();
            $update_array['granted_purpose'] = $consent->purpose;
            $update_array['granted_access_type'] = $consent->access_type;
        } else if( $status == 'denied') {
            $update_array['denied_on'] = now();
        } else if( $status == 'revoked') {
            $update_array['revoked_on'] = now();
        }
        $consent->update($update_array);

        if($status == 'revoked') {
            return to_route('patient.connected-entities')->with('success', 'Access revoked!');
        }
        return to_route('patient.index-consents')->with('success', 'Status updated.');
    }

    public function healthRecords()
    {
        return Inertia::render('Patient/HealthRecords', [ 'user' => auth()->user()]);
    }

    public function connectedEntities()
    {
        $connectedEntities = auth()->user()->consents()->Granted()
        ->paginate(10)
        ->withQueryString()
        ->through(fn ($consent) => [
            'id' => $consent->id,
            'requestor_name' => $consent->requestor->name,
            'organization' => $consent->organization->name,
            'role' => $consent->role,
            'access_type' => $consent->access_type,
            'granted_access_type' => $consent->granted_access_type,
            'purpose' => $consent->requestedPurpose,
            'granted_purpose' => $consent->grantedPurposeFiltered,
            'requested_at' => $consent->created_at->format('Y-m-d H:i:s'),
        ]);
        return Inertia::render('Patient/ConnectedEntities', [ 'connectedEntities' => $connectedEntities]);
    }

    public function consentSettings()
    {
        return Inertia::render('Patient/ConsentSettings', [ 'user' => auth()->user()]);
    }
}
