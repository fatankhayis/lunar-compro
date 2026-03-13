<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Crew extends Model
{
    protected $table = 'crew';
    protected $primaryKey = 'crew_id';
    protected $fillable = [
        'name',
        'role',
        'title',
        'crew_image',
        'order_by'
    ];
}
