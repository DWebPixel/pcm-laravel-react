<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Log extends Model
{
    use HasFactory;

    protected $cast = [
        'created_at' => 'datetime'
    ];

    public function getCreatedAtAttribute($created_at)
    {
        return Carbon::parse($created_at)->format('Y-m-d H:i:s');
    }

    public function getDataAttribute($data)
    {
        return json_decode($data, true);
    }
}
