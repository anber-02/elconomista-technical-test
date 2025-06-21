<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FormSubmissionField extends Model
{
    protected $fillable = [
        'form_submission_id',
        'form_field_id',
        'value',
    ];
    //
    public function submission()
    {
        return $this->belongsTo(FormSubmission::class, 'form_submission_id');
    }
    public function field()
    {
        return $this->belongsTo(FormField::class, 'form_field_id');
    }

    public function option()
    {
        return $this->belongsTo(FormFieldOption::class, 'value', 'key')
            ->whereColumn('form_field_id', 'form_field_options.form_field_id');
    }
}
