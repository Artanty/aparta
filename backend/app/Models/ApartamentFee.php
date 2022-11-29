<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApartamentFee extends Model
{
    use HasFactory;

    /**
     * Get the apartament of apartament fee
     */
    public function apartament()
    {
        return $this->hasOne('App\Models\Apartament', 'id', 'apartament_id');
    }

    /**
     * Get the organization of apartament fee
     */
    public function organization()
    {
        return $this->hasOne('App\Models\Organization', 'id', 'organization_id');
    }
}
