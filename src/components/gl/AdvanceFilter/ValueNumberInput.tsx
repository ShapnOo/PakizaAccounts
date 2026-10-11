import React from 'react';
import { FilterOperator } from '../../../types/advanceFilter';

interface ValueNumberInputProps {
  operator: FilterOperator;
  value: any;
  onChange: (value: any) => void;
  disabled?: boolean;
}

export const ValueNumberInput: React.FC<ValueNumberInputProps> = ({
  operator,
  value,
  onChange,
  disabled,
}) => {
  if (operator === 'between') {
    const minVal = Array.isArray(value) && value[0] !== null && value[0] !== undefined ? value[0] : '';
    const maxVal = Array.isArray(value) && value[1] !== null && value[1] !== undefined ? value[1] : '';

    return (
      <div className="flex items-center gap-1.5 w-full">
        <input
          type="number"
          placeholder="Min"
          disabled={disabled}
          value={minVal}
          onChange={(e) => {
            const v0 = e.target.value === '' ? null : Number(e.target.value);
            const v1 = maxVal === '' ? null : Number(maxVal);
            onChange([v0, v1]);
          }}
          className="w-1/2 h-8 px-2.5 text-xs rounded-md border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white placeholder:text-slate-400"
        />
        <span className="text-xs text-slate-400 font-medium">to</span>
        <input
          type="number"
          placeholder="Max"
          disabled={disabled}
          value={maxVal}
          onChange={(e) => {
            const v0 = minVal === '' ? null : Number(minVal);
            const v1 = e.target.value === '' ? null : Number(e.target.value);
            onChange([v0, v1]);
          }}
          className="w-1/2 h-8 px-2.5 text-xs rounded-md border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white placeholder:text-slate-400"
        />
      </div>
    );
  }

  return (
    <input
      type="number"
      placeholder="Enter amount..."
      disabled={disabled}
      value={value !== null && value !== undefined && !Array.isArray(value) ? value : ''}
      onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
      className="w-full h-8 px-2.5 text-xs rounded-md border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white placeholder:text-slate-400"
    />
  );
};
