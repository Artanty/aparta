<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;

class ApartamentFee extends Model
{


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

    /**
     * Get the template of apartament fee
     */
    public function template()
    {
        return $this->hasOne('App\Models\FeeTemplate', 'id', 'template_id');
    }
}
