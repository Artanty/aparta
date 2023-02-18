<?php

namespace App\models;

use Illuminate\Database\Eloquent\Model;

class ExchangeRate extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ["date", "currancyFrom", "currancyTo", "currancyFromValue", "_dateCurFromCurTo", "source", "created_at", "updated_at"];
}
