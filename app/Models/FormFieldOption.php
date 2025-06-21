<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FormFieldOption extends Model
{
    //
    protected $fillable = [
        'key',
        'value',
        'form_field_id',
    ];

    public function field()
    {
        return $this->belongsTo(FormField::class, 'form_field_id');
    }
}
