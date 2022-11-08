<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreApartamentFeeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return auth()->guard('api')->user();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'apartament_id' => 'numeric',
            'name' => 'string',
            'description' => 'string|nullable',
            'sum' => 'numeric|nullable',
            'currancy' => 'numeric|nullable',
            'month' => 'numeric',
            'year' => 'numeric',
            'paid' => 'boolean'
        ];
    }
}
