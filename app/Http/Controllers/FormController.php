<?php

namespace App\Http\Controllers;

use App\Models\Form;
use App\Models\FormFieldOption;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FormController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        return Inertia::render('forms/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //todo: validated the request
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
            'fields' => 'required|array|min:1',
            'fields.*.label' => 'required|string',
            'fields.*.type' => 'required|in:text,number,file,select,radio,date,textarea,email,url',
            'fields.*.options' => 'nullable|array',
            'fields.*.options.*.key' => 'required_with:fields.*.options|string',
            'fields.*.options.*.value' => 'required_with:fields.*.options|string',
        ]);

        $form = Form::create([
            'user_id' => Auth::id(),
            'title' => $validated['title'],
            'description' => $validated['description'],
        ]);



        foreach ($validated['fields'] as $field) {
            $fieldData = Arr::except($field, ['options']);
            $fieldModel = $form->fields()->create($fieldData);

            if ($field['options']) {
                foreach ($field['options'] as $option) {
                    FormFieldOption::create([
                        'key' => $option['key'],
                        'value' => $option['value'],
                        'form_field_id' => $fieldModel->id
                    ]);
                }
            }
        }

        return redirect()->back()->with('success', 'Formulario creado correctamente');
    }

    /**
     * Display the specified resource.
     */
    public function show(Form $form)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
