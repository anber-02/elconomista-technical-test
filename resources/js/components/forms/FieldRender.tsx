import { Field } from '@/types/Form';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

type InputProps = {
    field: Field;
    value: any;
    onChange: (value: any) => void;
};

export function FieldRenderer({ field, value, onChange }: InputProps) {
    const renderField = renderMap[field.type];
    return (
        <div className="grid w-full max-w-sm items-center gap-3">
            <Label className="mb-1 block text-sm font-medium capitalize">{field.label}</Label>
            {renderField ? (
                renderField({ field, value, onChange })
            ) : (
                <Input type="text" name={field.label} value={value} onChange={(e) => onChange(e.target.value)} className={commonClass} required />
            )}
        </div>
    );
}

const commonClass = 'w-full rounded border px-2 py-1';
const renderMap: Record<string, ({ field, value, onChange }: InputProps) => React.JSX.Element> = {
    text: ({ value, onChange, field }) => (
        <Input required type="text" name={field.label} value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={commonClass} />
    ),
    email: ({ value, onChange, field }) => (
        <Input required type="email" name={field.label} value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={commonClass} />
    ),
    number: ({ value, onChange, field }) => (
        <Input required type="number" name={field.label} value={value ?? 0} onChange={(e) => onChange(e.target.value)} className={commonClass} />
    ),
    url: ({ value, onChange, field }) => (
        <Input required type="url" name={field.label} value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={commonClass} />
    ),
    textarea: ({ value, onChange, field }) => (
        <textarea name={field.label} value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={`${commonClass} h-24`} />
    ),
    file: ({ onChange, field }) => (
        <Input required name={field.label} type="file" className={commonClass} onChange={(e) => onChange(e.target.files?.[0])} />
    ),
    date: ({ value, onChange, field }) => (
        <Input required name={field.label} type="date" value={value} onChange={(e) => onChange(e.target.value)} className={commonClass} />
    ),
    time: ({ value, onChange, field }) => (
        <Input required name={field.label} type="time" value={value} onChange={(e) => onChange(e.target.value)} className={commonClass} />
    ),
    select: ({ field, value, onChange }) => (
        <Select name={field.label} value={value} onValueChange={(e) => onChange(e)}>
            <SelectTrigger>
                <SelectValue placeholder="options" />
            </SelectTrigger>
            <SelectContent>
                {field.options?.map((option, index) => (
                    <SelectItem key={index} value={option.key}>
                        {option.value}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    ),
    radio: ({ value, onChange, field }) => (
        <div className="flex w-full flex-wrap justify-evenly gap-2">
            {field.options?.map((option, index) => (
                <div key={index} className="flex flex-col items-center">
                    <label htmlFor={option.key} className="text-sm capitalize">
                        {option.value}
                    </label>
                    <Input
                        required
                        id={option.key}
                        name={field.label}
                        type="radio"
                        value={option.value}
                        className={`${commonClass} w-6 text-sm`}
                        checked={value === option.key}
                        onChange={() => onChange(option.key)}
                    />
                </div>
            ))}
        </div>
    ),
};
