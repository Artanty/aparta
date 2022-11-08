<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateApartamentFeeRequest extends FormRequest
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
            'apartament_id' => 'required|numeric',
            'name' => 'required|string',
            'description' => 'string|nullable',
            'sum' => 'numeric|nullable',
            'currancy' => 'numeric|nullable',
            'month' => 'required|numeric',
            'year' => 'required|numeric',
            'paid' => 'required|boolean'
            // 'creator_id' => 'required|numeric'
        ];
    }
}
