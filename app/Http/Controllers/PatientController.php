<?php

namespace App\Http\Controllers;

use App\Models\Consent;
use App\Models\ConsentSetting;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Request as FacadesRequest;
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
            $update_array['only_once'] = $request->onlyOnce;

            if($request->has('expiry_date')) {
                $update_array['expiry_date'] = $request->expiry_date;
            }
            //$update_array['expiry_date'] = Carbon::now()->addMonth();
            //$update_array['expiry_date'] = Carbon::now()->addMinutes(20);
        } else if( $status == 'denied') {
            $update_array['denied_on'] = now();
        } else if( $status == 'revoked') {
            $update_array['revoked_on'] = now();
        }
        $consent->update($update_array);

        $patient = $consent->patient;
        $requestor = $consent->requestor;

        $message = "$patient->name $status consent to $requestor->name";
        addLog($patient->id, $requestor->id, $consent->organization_id, 'change_consent_status', $message, json_encode($consent));

        if($status == 'revoked') {
            return to_route('patient.connected-entities')->with(['success' => 'Access Revoked!', 'data' => $consent->refresh()]);
        }
        return to_route('patient.index-consents')->with(['success' => 'Status updated!', 'data' => $consent->refresh()]);
    }

    public function healthRecords()
    {
        $healthRecords = auth()->user()->healthRecords()->with('files')->paginate(10)->through(fn ($record) => [
            'id' => $record->id,
            'organization' => $record->creator->organizations()->first()->name,
            'created_by' => $record->creator->name,
            'role' => $record->creator->role,
            'diagnosis' => $record->diagnosis,
            'prescription' => $record->prescription,
            'date_of_record' => $record->date_of_record,
            'purpose' => $record->purposeFiltered,
            'files' => $record->files
        ]);

        return Inertia::render('Patient/HealthRecords', [ 'healthRecords' => $healthRecords]);
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

    public function viewLogs() {
        $logs = auth()->user()->logs()->latest()->get();
        return Inertia::render('Doctor/ViewLogs', [ 'logs' => $logs]);
    }
}
