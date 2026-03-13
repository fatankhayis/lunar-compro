<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $table = 'categories';
    protected $primaryKey = 'category_id';
    protected $fillable = [
        'name',
    ];

    public function partners()
    {
        return $this->hasMany(Partner::class);
    }
}
