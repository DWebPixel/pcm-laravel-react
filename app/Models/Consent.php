<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Consent extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'granted_on' => 'datetime',
        'denied_on' => 'datetime',
        'revoked_on' => 'datetime',
        'expiry_date' => 'datetime',
    ];

    protected $appends = [
        'requested_purpose'
    ];


    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::created(function (Consent $consent) {

            //Find consent settings for this patient
            $consentSettings = $consent->patient->consentSettings()->whereRole($consent->role)->first();

            if($consentSettings && $consentSettings->access_type == $consent->access_type){
                $cs_purpose = $consentSettings->purposeFiltered;
                $c_purpose = $consent->requested_purpose;

                //need to only approve if ALL of the requested purpose is part of automatic settings
                if( empty( array_diff($c_purpose, $cs_purpose) )) {
                    $update_array = []; 
                    $update_array['status'] = 'granted';
                    $update_array['granted_on'] = now();
                    $update_array['granted_purpose'] = $consent->purpose;
                    $update_array['granted_access_type'] = $consent->access_type;

                    $consent->update($update_array);

                    $patient = $consent->patient;
                    $requestor = $consent->requestor;
                    $data = [
                        'consent' => $consent,
                        'consentSettings' => $consentSettings,
                    ];
                    sleep(1);
                    $message = "$requestor->name was automatically granted permission based on $patient->name's consent settings";
                    addLog($patient->id, $requestor->id, $consent->organization_id, 'auto_consent_grant', $message, json_encode($data));

                }
            }
            
        });
    }


    public function patient()
    {
        return $this->belongsTo(User::class, 'requestee_id');
    }

    public function requestor()
    {
        return $this->belongsTo(User::class, 'requestor_id');
    }

    public function organization()
    {
        return $this->belongsTo(Organization::class, 'organization_id');
    }

    public function scopeWaiting($query)
    {
        $query->whereStatus('waiting');
    }

    public function scopeGranted($query)
    {
        $query->whereStatus('granted');
    }

    public function scopeDenied($query)
    {
        $query->whereStatus('denied');
    }

    public function scopeRevoked($query)
    {
        $query->whereStatus('revoked');
    }

    public function getRequestedPurposeAttribute() {
        return $this->filterPurpose($this->purpose);
    }

    public function getGrantedPurposeFilteredAttribute() {
        return $this->filterPurpose($this->granted_purpose);
    }

    public function filterPurpose($purpose) {
        // Convert the JSON string to an associative array
        $data = json_decode($purpose, true);

        // Filter out items with value as true
        $filteredData = array_filter($data, function ($value) {
            return $value === true;
        });

        // Convert the filtered data back to JSON
        $filteredJson = json_encode($filteredData);

        // Output the filtered JSON
        return array_keys($filteredData);
    }
}
