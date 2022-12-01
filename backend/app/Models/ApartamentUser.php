<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;

class ApartamentUser extends Model
{


    /**
     * Get the user details of the apartament user
     */
    public function userDetails()
    {

        return $this->hasOne('App\Models\User', 'id', 'user_id');

    }
}
