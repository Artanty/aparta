<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreApartamentRequest extends FormRequest
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
            'address' => 'required|string',
            'name' => 'required|string',
            'country' => 'string|nullable',
            'place' => 'string|nullable',
            'location' => 'string|nullable',
            'description' => 'string|nullable',
            'rentType' => 'numeric|nullable',
            'area' => 'float|nullable',
            'rooms' => 'numeric|nullable',
            'garage' => 'numeric|nullable'
        ];
    }
}
