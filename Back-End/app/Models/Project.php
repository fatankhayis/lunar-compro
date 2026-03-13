<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $table = 'projects';
    protected $primaryKey = 'project_id';
    protected $fillable = [
        'title',
        'description',
        'project_image',
        'order_by',
        'link',
    ];
}
