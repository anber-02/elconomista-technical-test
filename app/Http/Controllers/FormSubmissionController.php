<?php

namespace App\Http\Controllers;

use App\Models\Form;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FormSubmissionController extends Controller
{
    //
    public function submit(Request $request, Form $form)
    {
        // creamos una instancia vacía del formulario
        $submission = $form->submissions()->create([
            'user_id' => Auth::id(),
        ]);
        // 1. obtenemos los campos del formulario que registro el usuario
        // 2. iteramos sobre los campos del formulario
        // 3. verificamos si el campo es de tipo archivo
        // 4. si es de tipo archivo, almacenamos el archivo y guardamos la ruta
        // 5. si no es de tipo archivo, guardamos el valor directamente
        foreach ($form->fields as $field) {
            $fieldName = "field_{$field->id}";
            if ($field->type === 'file') {
                if ($request->hasFile($fieldName)) {
                    // busca el archivo con el nombre "field_{$field->id}" en la request
                    $path = $request->file($fieldName)->store('uploads');
                    $submission->fields()->create([
                        'form_field_id' => $field->id,
                        'value' => $path,
                    ]);
                }
            } else {
                $value = $request->input($fieldName);
                $submission->fields()->create([
                    'form_field_id' => $field->id,
                    'value' => $value,
                ]);
            }
        }

        return redirect()->back()->with('success', 'Form created successfully');
    }

    public function submissions(Form $form)
    {
        $form->load('submissions.fields.field');

        return inertia('forms/submissions', [
            'form' => $form,
        ]);
    }
}
