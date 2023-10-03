<?php

namespace App\Http\Controllers;

use App\Models\Consent;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Request as FacadesRequest;
use Inertia\Inertia;

class DoctorController extends Controller
{
    public function requestConsent()
    {
        return Inertia::render('Doctor/RequestConsent', [ 'user' => auth()->user()]);
    }

    public function storeConsent(Request $request): RedirectResponse
    {
        $requestor_id = auth()->id();

        $requestor = User::find($requestor_id);

        FacadesRequest::validate([
            'patient_address' => ['required', 'max:120', 'exists:users,bc_address'],
            'access_type' => ['required', 'max:20'],
            'purpose' => ['required'],
        
        ], [
            'patient_address.required' => "Patient's Blockchain address is required",
            'patient_address.exists' => "We cannot found patient with this address",
        ]);

        $patient = User::where('bc_address', $request->patient_address)->first();
       
        Consent::create([
            'requestor_id' => $requestor_id,
            'requestor_address' => $requestor->bc_address, 
            'requestee_id' => $patient->id,
            'requestee_address' => $patient->bc_address, 
            'organization_id' => $requestor->organizations()->first()->id,
            'role' => $requestor->role,
            'access_type' => $request->access_type,
            'purpose' => json_encode($request->purpose),
            'expiry_date' => Carbon::now()->addMonth()
        ]);

       
        return Redirect::back()->with('success', 'Consent request sent.');
    }

    public function connectedPatients()
    {
        $connectedPatients = auth()->user()->consents()->Granted()
        ->paginate(10)
        ->withQueryString()
        ->through(fn ($consent) => [
            'id' => $consent->id,
            'patient_name' => $consent->patient->name,
            'bc_address' => $consent->patient->bc_address,
            'address' => $consent->patient->address,
            'access_type' => $consent->access_type,
            'granted_access_type' => $consent->granted_access_type,
            'purpose' => $consent->requestedPurpose,
            'granted_purpose' => $consent->grantedPurposeFiltered,
            'requested_at' => $consent->created_at->format('Y-m-d H:i:s'),
        ]);

        return Inertia::render('Doctor/ConnectedPatients', [ 'connectedPatients' => $connectedPatients]);
    }
}
