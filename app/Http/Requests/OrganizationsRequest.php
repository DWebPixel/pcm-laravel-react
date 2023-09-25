<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OrganizationsRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'max:100'],
            'phone' => ['nullable', 'max:50'],
            'address' => ['nullable', 'max:150'],
            'type' => ['required','max:50'],
        ];
    }
}
