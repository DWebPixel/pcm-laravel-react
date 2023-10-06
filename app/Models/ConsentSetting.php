<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConsentSetting extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function patient() {
        return $this->belongsTo(User::class, 'patient_id');
    }

    public function getPurposeFilteredAttribute() {
        return $this->filterPurpose($this->purpose);
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
