<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FormSubmission extends Model
{
    //
    protected $fillable = [
        'form_id',
        'user_id',
        'data',
    ];
    public function form()
    {
        return $this->belongsTo(Form::class);
    }
    public function fields()
    {
        $fields = $this->hasMany(FormSubmissionField::class);
        return $fields;
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function hasFiles(): bool
    {
        return $this->fields()
            ->whereNotNull('value')
            ->whereHas('field', function ($query) {
                $query->where('type', 'file');
            })->exists();
    }
}
