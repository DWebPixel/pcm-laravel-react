<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HealthRecordFiles extends Model
{
    use HasFactory;

    protected $appends = [ 'file_url' ];

    public function getFileUrlAttribute() {
        return asset($this->path);
    }
}
