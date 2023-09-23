<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreExternalRequest extends FormRequest
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
            'externalUserId' => 'string|numeric|nullable',
            'organization' => 'string|nullable',
            'name' => 'string|nullable',
            'body' => 'string|nullable',
            'organizationService' => 'string|nullable',
            'sum' => 'numeric|string|nullable',
            'hash' => 'string|nullable',
            'externalDate' => 'string|nullable'
        ];
    }
}
