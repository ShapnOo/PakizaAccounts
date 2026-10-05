import React from 'react';
import { CustomField } from '../../types/customField';
import { Check, Calendar, ChevronDown } from 'lucide-react';

interface CustomFieldCellProps {
  field: CustomField;
  value: any;
  onChange: (val: any) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export const CustomFieldCell: React.FC<CustomFieldCellProps> = ({
  field,
  value,
  onChange,
  disabled = false,
  className = '',
  placeholder,
}) => {
  const baseInputStyles =
    'w-full h-8 px-2.5 rounded-lg border border-border/80 bg-background text-xs text-foreground outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 disabled:bg-muted/40 shadow-2xs';

  switch (field.dataType) {
    case 'Text':
      return (
        <input
          type="text"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder || (field.mandatory ? 'Required *' : 'Optional')}
          className={`${baseInputStyles} ${className}`}
        />
      );

    case 'LongText':
      return (
        <textarea
          rows={1}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder || (field.mandatory ? 'Required *' : 'Optional')}
          className={`w-full py-1.5 px-2.5 rounded-lg border border-border/80 bg-background text-xs text-foreground outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 resize-y min-h-[32px] shadow-2xs ${className}`}
        />
      );

    case 'Number':
      return (
        <input
          type="number"
          value={value ?? ''}
          onChange={(e) =>
            onChange(e.target.value === '' ? '' : Number(e.target.value))
          }
          disabled={disabled}
          placeholder={placeholder || (field.mandatory ? '0 *' : '0')}
          className={`${baseInputStyles} text-right font-mono ${className}`}
        />
      );

    case 'Currency':
      return (
        <div className="relative">
          <input
            type="number"
            step="0.01"
            value={value ?? ''}
            onChange={(e) =>
              onChange(e.target.value === '' ? '' : Number(e.target.value))
            }
            disabled={disabled}
            placeholder={placeholder || (field.mandatory ? '0.00 *' : '0.00')}
            className={`${baseInputStyles} text-right font-mono pr-2 ${className}`}
          />
        </div>
      );

    case 'Date':
      return (
        <div className="relative flex items-center">
          <input
            type="date"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={`${baseInputStyles} ${className}`}
          />
        </div>
      );

    case 'DateTime':
      return (
        <input
          type="datetime-local"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`${baseInputStyles} ${className}`}
        />
      );

    case 'Dropdown':
      return (
        <div className="relative">
          <select
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={`${baseInputStyles} appearance-none pr-7 cursor-pointer ${className}`}
          >
            <option value="">
              {placeholder || (field.mandatory ? 'Select *' : 'Select option')}
            </option>
            {field.options?.map((opt, i) => (
              <option key={i} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <ChevronDown className="size-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
        </div>
      );

    case 'YesNo':
      const isYes = value === true || value === 'Yes' || value === 'true';
      return (
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={disabled}
            onClick={() => onChange(isYes ? false : true)}
            className={`h-7 px-2.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer shadow-2xs ${
              isYes
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-800 dark:text-indigo-300'
                : 'bg-muted/40 border-border/80 text-muted-foreground hover:bg-muted'
            }`}
          >
            <div
              className={`size-2 rounded-full ${
                isYes ? 'bg-indigo-600' : 'bg-slate-300'
              }`}
            />
            <span>{isYes ? 'Yes' : 'No'}</span>
          </button>
        </div>
      );

    case 'MultiSelect':
      const currentList: string[] = Array.isArray(value)
        ? value
        : typeof value === 'string' && value
        ? value.split(',').map((s) => s.trim())
        : [];

      return (
        <div className="flex flex-wrap items-center gap-1">
          {field.options?.map((opt, i) => {
            const selected = currentList.includes(opt);
            return (
              <button
                key={i}
                type="button"
                disabled={disabled}
                onClick={() => {
                  const updated = selected
                    ? currentList.filter((x) => x !== opt)
                    : [...currentList, opt];
                  onChange(updated);
                }}
                className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border transition-all cursor-pointer ${
                  selected
                    ? 'bg-indigo-100 text-indigo-700 border-indigo-300 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-700'
                    : 'bg-muted/30 text-muted-foreground border-border/70 hover:bg-muted/70'
                }`}
              >
                {selected && <Check className="size-2.5 inline mr-1" />}
                {opt}
              </button>
            );
          })}
        </div>
      );

    default:
      return (
        <input
          type="text"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`${baseInputStyles} ${className}`}
        />
      );
  }
};
