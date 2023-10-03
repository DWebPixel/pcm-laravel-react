<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Consent extends Model
{
    use HasFactory;

    protected $guard = [];

    protected $casts = [
        'granted_on' => 'datetime',
        'denied_on' => 'datetime',
        'revoked_on' => 'datetime',
        'expiry_date' => 'datetime',
    ];

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
