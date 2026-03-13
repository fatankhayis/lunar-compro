<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    protected $table = 'testimonials';
    protected $primaryKey = 'testimonial_id';
    protected $fillable = [
        'name',
        'role',
        'testimonial',    
        'video_url',
    ];
}
