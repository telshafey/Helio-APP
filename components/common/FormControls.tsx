import React from 'react';
import { PlusIcon, TrashIcon } from './Icons';

export const InputField: React.FC<{ 
    name: string; 
    label: string; 
    value: string | number; 
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
    required?: boolean; 
    placeholder?: string; 
    type?: string; 
}> = ({ name, label, value, onChange, required, placeholder, type = 'text' }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        <input type={type} id={name} name={name} value={value} onChange={onChange} required={required} placeholder={placeholder} className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500" />
    </div>
);

export const TextareaField: React.FC<{ 
    name: string; 
    label: string; 
    value: string; 
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; 
    required?: boolean; 
    rows?: number; 
    placeholder?: string; 
}> = ({ name, label, value, onChange, required, rows = 3, placeholder }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        <textarea id={name} name={name} value={value} onChange={onChange} required={required} rows={rows} placeholder={placeholder} className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500"></textarea>
    </div>
);

export const MultiInputField: React.FC<{
    label: string;
    values: string[];
    onChange: (values: string[]) => void;
    placeholder: string;
}> = ({ label, values, onChange, placeholder }) => {
    const handleValueChange = (index: number, value: string) => {
        const newValues = [...values];
        newValues[index] = value;
        onChange(newValues);
    };
    const addValue = () => onChange([...values, '']);
    const removeValue = (index: number) => onChange(values.filter((_, i) => i !== index));

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
            <div className="space-y-2">
                {values.map((value, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => handleValueChange(index, e.target.value)}
                            placeholder={placeholder}
                            className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500"
                        />
                        {values.length > 1 && (
                            <button type="button" onClick={() => removeValue(index)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full">
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                ))}
                <button type="button" onClick={addValue} className="flex items-center gap-1 text-sm text-cyan-600 font-semibold hover:underline">
                    <PlusIcon className="w-4 h-4" />
                    إضافة رقم آخر
                </button>
            </div>
        </div>
    );
};
