export type Form = {
    id: number;
    title: string;
    description?: string;
    fields: Field[];
    created_at: string;
};

type FormCreate = Omit<Form, 'id' | 'created_at'>;

export type Field = {
    id?: number;
    label: string;
    type: FiledType;
    options?: Options[];
};

export type Options = {
    id?: number;
    key: string;
    value: string;
};

export type FieldType = 'text' | 'number' | 'file' | 'select' | 'checkbox' | 'radio' | 'textarea' | 'date' | 'time' | 'email' | 'url';
