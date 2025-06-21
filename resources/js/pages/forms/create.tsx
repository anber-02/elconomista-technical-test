import { useModalContext } from '@/components/Modal/context/useModalContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Field, FieldType, FormCreate } from '@/types/Form';
import { useForm } from '@inertiajs/react';
import { LoaderCircle, PlusCircle, Trash2Icon } from 'lucide-react';
import { FormEvent } from 'react';

function renderFieldTypes() {
    const mappedTypes = [
        { label: 'Texto', value: 'text' },
        { label: 'Número', value: 'number' },
        { label: 'Archivo', value: 'file' },
        { label: 'Selección', value: 'select' },
        { label: 'Radio', value: 'radio' },
        { label: 'Textarea', value: 'textarea' },
        { label: 'Fecha', value: 'date' },
        { label: 'Hora', value: 'time' },
        { label: 'Email', value: 'email' },
        { label: 'URL', value: 'url' },
    ];
    return mappedTypes.map((type) => (
        <SelectItem key={type.value} value={type.value}>
            {type.label}
        </SelectItem>
    ));
}

const generateOptions = (text: string) => {
    return { key: text.toLowerCase().replace(/\s+/g, '-'), value: text };
};

export default function CreateForm() {
    const { setState } = useModalContext();
    const { data, setData, post, processing, errors, reset } = useForm<FormCreate>({
        title: '',
        description: '',
        fields: [{ label: '', type: 'text', options: [] }],
    });

    const addField = () => {
        const newFields = [...data.fields, { label: '', type: 'text' as FieldType, options: [] }];
        setData('fields', newFields);
    };

    const removeField = (index: number) => {
        const newFields = data.fields.filter((_, i) => i !== index);
        setData('fields', newFields);
    };

    const addFieldOption = (index: number) => {
        const updatedFields = [...data.fields];
        const field = updatedFields[index];

        if (field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') {
            field.options = field.options ? [...field.options, generateOptions('')] : [generateOptions('')];
            setData('fields', updatedFields);
        }
    };

    const removeFieldOption = (fieldIndex: number, optionIndex: number) => {
        const updatedFields = [...data.fields];
        const field = updatedFields[fieldIndex];
        if (field.options) {
            field.options = field.options.filter((_, i) => i !== optionIndex);
            setData('fields', updatedFields);
        }
    };

    const updateFieldOption = (fieldIndex: number, optionIndex: number, key: string, value: string) => {
        const updatedFields = [...data.fields];
        const field = updatedFields[fieldIndex];
        if (field.options && field.options[optionIndex]) {
            field.options[optionIndex] = { key, value };
            setData('fields', updatedFields);
        }
    };

    const handleFieldChange = (index: number, key: keyof Field, value: string) => {
        const updatedFields = [...data.fields];

        if (key === 'type') {
            updatedFields[index][key] = value as FieldType;
            // Si cambiamos a un tipo que no requiere opciones, limpiamos las opciones
            if (!fieldRequiresOptions(value as FieldType)) {
                updatedFields[index].options = [];
            } else if (!updatedFields[index].options) {
                // Si cambiamos a un tipo que requiere opciones, inicializamos el array
                updatedFields[index].options = [];
            }
        } else {
            updatedFields[index][key] = value as any;
        }

        setData('fields', updatedFields);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('forms'), {
            onFinish: () => reset('title', 'fields'),
            onSuccess: () => {
                setState(false);
                console.log('Formulario creado exitosamente');
            },
        });
    };

    return (
        <div className="mx-auto px-4">
            <h1 className="mb-6 text-2xl font-bold">Crear Formulario</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="mb-1 block text-sm font-medium">Título del formulario</label>
                    <Input
                        type="text"
                        className="w-full rounded border px-3 py-2"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium">Descripción del formulario</label>
                    <Input
                        type="text"
                        className="w-full rounded border px-3 py-2"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        required
                    />
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Campos</h2>
                    <div className="max-h-[300px] space-y-2 overflow-y-auto">
                        {data.fields.map((field, index) => (
                            <div
                                key={index}
                                className="flex flex-wrap items-center gap-4 rounded p-2 md:border-none md:p-0 dark:border-sidebar-border"
                            >
                                <div className="flex flex-1 gap-4">
                                    <Input
                                        type="text"
                                        className="flex-1 rounded border px-3 py-2"
                                        placeholder="Etiqueta"
                                        value={field.label}
                                        onChange={(e) => handleFieldChange(index, 'label', e.target.value)}
                                        required
                                    />
                                    <Select
                                        value={field.type}
                                        onValueChange={(value) => handleFieldChange(index, 'type', value as Field['type'])}
                                        required
                                    >
                                        <SelectTrigger className="w-40">
                                            <SelectValue placeholder="Tipo de campo" />
                                        </SelectTrigger>
                                        <SelectContent>{renderFieldTypes()}</SelectContent>
                                    </Select>
                                    <Button
                                        variant={'secondary'}
                                        size={'icon'}
                                        type="button"
                                        className="size-8 cursor-pointer text-red-500 hover:underline"
                                        onClick={() => removeField(index)}
                                    >
                                        <Trash2Icon />
                                    </Button>
                                </div>

                                {fieldRequiresOptions(field.type) && (
                                    <div className="w-full">
                                        {renderFieldOptions({
                                            index: index,
                                            options: field.options,
                                            addFieldOption: addFieldOption,
                                            removeFieldOption: removeFieldOption,
                                            updateFieldOption: updateFieldOption,
                                        })}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <Button variant={'outline'} size={'sm'} type="button" className="cursor-pointer text-blue-500" onClick={addField}>
                        <PlusCircle />
                        Agregar campo
                    </Button>
                </div>

                <Button type="submit" size={'sm'} className="mt-4 w-full cursor-pointer" tabIndex={4} disabled={processing}>
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    Crear formulario
                </Button>
            </form>
        </div>
    );
}
// Verificamos si el tipo de campo requiere opciones
const fieldRequiresOptions = (type: FieldType) => type === 'select' || type === 'radio' || type === 'checkbox';

interface FieldOptionsProps {
    options?: Field['options'];
    index: number;
    addFieldOption: (index: number) => void;
    removeFieldOption: (fieldIndex: number, optionIndex: number) => void;
    updateFieldOption: (fieldIndex: number, optionIndex: number, key: string, value: string) => void;
}

function renderFieldOptions({ options = [], addFieldOption, removeFieldOption, updateFieldOption, index }: FieldOptionsProps) {
    return (
        <div className="w-full pl-4">
            <label>Opciones</label>
            {options.map((option, i) => (
                <div key={i} className="mb-2 flex items-center gap-2">
                    <Input
                        type="text"
                        className="flex-1 rounded border px-3 py-2"
                        placeholder="Opción"
                        value={option.value || ''}
                        onChange={(e) => {
                            const { key, value } = generateOptions(e.target.value);
                            updateFieldOption(index, i, key, value);
                        }}
                    />

                    <Button
                        variant={'secondary'}
                        size={'icon'}
                        type="button"
                        className="size-8 cursor-pointer text-red-500 hover:underline"
                        onClick={() => {
                            removeFieldOption(index, i);
                        }}
                    >
                        <Trash2Icon />
                    </Button>
                </div>
            ))}
            <Button
                variant={'outline'}
                size={'sm'}
                type="button"
                className="cursor-pointer text-blue-500"
                onClick={() => {
                    addFieldOption(index);
                }}
            >
                <PlusCircle />
                Agregar opción
            </Button>
        </div>
    );
}
