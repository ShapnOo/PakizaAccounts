import React from 'react';
import { FilterOperator, FILTER_FIELDS, VALUELESS_OPERATORS } from '../../../types/advanceFilter';
import { ValueReferencePicker } from './ValueReferencePicker';
import { ValueNumberInput } from './ValueNumberInput';
import { ValueDateRange } from './ValueDateRange';
import { ValueEnumPicker } from './ValueEnumPicker';

interface ValueControlProps {
  fieldKey: string;
  operator: FilterOperator;
  value: any;
  onChange: (value: any) => void;
  disabled?: boolean;
}

export const ValueControl: React.FC<ValueControlProps> = ({
  fieldKey,
  operator,
  value,
  onChange,
  disabled,
}) => {
  const isValueless = VALUELESS_OPERATORS.includes(operator);

  if (isValueless) {
    return (
      <div className="h-8 flex items-center px-3 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-400 italic">
        — No value required —
      </div>
    );
  }

  const field = FILTER_FIELDS.find((f) => f.key === fieldKey);
  const fieldType = field?.type || 'text';

  switch (fieldType) {
    case 'reference':
      return (
        <ValueReferencePicker
          optionsSource={field?.optionsSource}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      );

    case 'number':
      return (
        <ValueNumberInput
          operator={operator}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      );

    case 'date':
      return (
        <ValueDateRange
          operator={operator}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      );

    case 'enum':
      return (
        <ValueEnumPicker
          enumOptions={field?.enumOptions}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      );

    case 'text':
    default:
      return (
        <input
          type="text"
          placeholder="Enter search text..."
          disabled={disabled}
          value={value !== null && value !== undefined ? String(value) : ''}
          onChange={(e) => onChange(e.target.value === '' ? null : e.target.value)}
          className="w-full h-8 px-2.5 text-xs rounded-md border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white placeholder:text-slate-400"
        />
      );
  }
};
