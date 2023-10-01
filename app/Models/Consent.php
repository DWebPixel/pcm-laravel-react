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
}
