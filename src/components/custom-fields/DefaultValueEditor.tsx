import React from 'react';
import { CustomFieldDataType } from '../../types/customField';

interface DefaultValueEditorProps {
  dataType: CustomFieldDataType;
  value: any;
  options?: string[];
  onChange: (val: any) => void;
  disabled?: boolean;
}

export const DefaultValueEditor: React.FC<DefaultValueEditorProps> = ({
  dataType,
  value,
  options = [],
  onChange,
  disabled = false,
}) => {
  const inputStyles =
    'w-full h-8.5 px-3 rounded-lg border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-1 focus:ring-indigo-500 transition-all shadow-2xs';

  switch (dataType) {
    case 'Text':
      return (
        <input
          type="text"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="Default text value..."
          className={inputStyles}
        />
      );

    case 'LongText':
      return (
        <textarea
          rows={2}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="Default long text..."
          className="w-full p-2.5 rounded-lg border border-border bg-card text-xs text-foreground outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs resize-y"
        />
      );

    case 'Number':
    case 'Currency':
      return (
        <input
          type="number"
          step={dataType === 'Currency' ? '0.01' : '1'}
          value={value ?? ''}
          onChange={(e) =>
            onChange(e.target.value === '' ? '' : Number(e.target.value))
          }
          disabled={disabled}
          placeholder={dataType === 'Currency' ? '0.00' : '0'}
          className={`${inputStyles} font-mono`}
        />
      );

    case 'Date':
      return (
        <input
          type="date"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={inputStyles}
        />
      );

    case 'DateTime':
      return (
        <input
          type="datetime-local"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={inputStyles}
        />
      );

    case 'Dropdown':
      return (
        <select
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`${inputStyles} cursor-pointer`}
        >
          <option value="">No default selection</option>
          {options.map((opt, i) => (
            <option key={i} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );

    case 'YesNo':
      const isYes = value === true || value === 'Yes' || value === 'true';
      return (
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={disabled}
            onClick={() => onChange(isYes ? false : true)}
            className={`h-8 px-3 rounded-lg text-xs font-bold border transition-all flex items-center gap-2 cursor-pointer shadow-2xs ${
              isYes
                ? 'bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-800'
                : 'bg-muted/40 border-border text-muted-foreground'
            }`}
          >
            <div
              className={`size-2 rounded-full ${
                isYes ? 'bg-indigo-600' : 'bg-slate-400'
              }`}
            />
            <span>Default: {isYes ? 'Yes' : 'No'}</span>
          </button>
        </div>
      );

    case 'MultiSelect':
      return (
        <input
          type="text"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="Comma-separated default options..."
          className={inputStyles}
        />
      );

    default:
      return (
        <input
          type="text"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={inputStyles}
        />
      );
  }
};
