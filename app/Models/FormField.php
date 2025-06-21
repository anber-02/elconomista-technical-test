<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FormField extends Model
{
    //
    protected $fillable = [
        'form_id',
        'label',
        'type',
        // 'required',
        // 'options', // For select fields, this can be a JSON string
    ];
    public function form()
    {
        return $this->belongsTo(Form::class);
    }
    public function submissionFields()
    {
        return $this->hasMany(FormSubmissionField::class, 'form_field_id');
    }

    public function options()
    {
        return $this->hasMany(FormFieldOption::class, 'form_field_id');
    }
}
