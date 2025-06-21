// components/FormModal.tsx
import { FieldRenderer } from '@/components/forms/FieldRender';
import { Button } from '@/components/ui/button';
import { Field, Form } from '@/types/Form';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import './style.css';

interface Props {
    form: Form | null;
    onClose?: () => void;
}

export default function ShowForm({ form, onClose }: Props) {
    // Inicializar datos del formulario vacíos
    const initialData =
        form?.fields.reduce(
            (acc, field) => {
                acc[`field_${field.id}`] = '';
                return acc;
            },
            {} as Record<string, any>,
        ) || {};

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm(initialData);

    const handleChange = (field: Field, value: any) => {
        setData(`field_${field.id}`, value);
        if (errors[`field_${field.id}`]) {
            clearErrors(`field_${field.id}`);
        }
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!form) return;
        console.log(data);
        post(route('forms.submit', form.id), {
            forceFormData: true,
            onSuccess: () => {
                reset();
                onClose?.();
            },
            onError: (errors) => {
                console.error('Error al enviar formulario:', errors);
            },
        });
    };

    if (!form) {
        return (
            <div className="flex items-center justify-center p-8">
                <p className="text-gray-500">No se ha seleccionado ningún formulario</p>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-2xl rounded-xl p-6 shadow-lg">
            <div className="w-full">
                <div className="mb-8">
                    <h2 className="mb-2 text-3xl font-bold text-gray-900 capitalize dark:text-white">{form.title}</h2>
                    {form.description && <p className="form-description first-letter:capitalize">{form.description}</p>}
                </div>

                <form onSubmit={handleSubmit} className="w-full">
                    <div className="container-grid border-y border-gray-200 py-6 text-center">
                        {form.fields.map((field, index) => (
                            <div key={field.id} className="w-full">
                                <div className="relative w-full">
                                    <FieldRenderer
                                        field={field}
                                        value={data[`field_${field.id}`] || ''}
                                        onChange={(value) => handleChange(field, value)}
                                    />
                                </div>

                                {errors[`field_${field.id}`] && (
                                    <div className="mt-2 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm">
                                        <span className="font-medium text-red-600">{errors[`field_${field.id}`]}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-center gap-4 pt-6">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="flex min-w-[160px] cursor-pointer items-center justify-center gap-2 bg-blue-600 px-8 py-3 font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg disabled:bg-gray-400 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                        >
                            {processing ? (
                                <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                                    Enviando...
                                </>
                            ) : (
                                'Enviar Formulario'
                            )}
                        </Button>

                        {onClose && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={processing}
                                className="rounded-lg border border-gray-300 bg-transparent px-6 py-3 font-medium text-gray-600 transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 hover:text-gray-800 disabled:opacity-50"
                            >
                                Cancelar
                            </Button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
