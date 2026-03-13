<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Partner extends Model
{
    protected $table = 'partners';
    protected $primaryKey = 'partner_id';
    protected $fillable = [
        'name',
        'partner_image',
        'category_id'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id', 'category_id');
    }
}
