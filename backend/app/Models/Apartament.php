<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Apartament extends Model
{
    use HasFactory;
    protected $fillable = [
        'name', 'address', 'creator_id'
    ];

    /**
     * Get the fees of the apartament
     */
    public function fees()
    {
        return $this->hasMany('App\Models\ApartamentFee', 'apartament_id', 'id');
    }

    /**
     * Get the users with user details of the apartament
     */
    public function users()
    {
        return $this->hasMany('App\Models\ApartamentUser', 'apartament_id', 'id')->with('userDetails');
    }
}
