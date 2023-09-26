<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class UserMeta extends Model
{
   /*
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'meta_key',
        'value',
    ];

    protected $table = "user_meta";

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
