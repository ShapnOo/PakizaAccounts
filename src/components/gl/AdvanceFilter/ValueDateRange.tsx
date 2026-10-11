import React from 'react';
import { FilterOperator } from '../../../types/advanceFilter';

interface ValueDateRangeProps {
  operator: FilterOperator;
  value: any;
  onChange: (value: any) => void;
  disabled?: boolean;
}

export const ValueDateRange: React.FC<ValueDateRangeProps> = ({
  operator,
  value,
  onChange,
  disabled,
}) => {
  if (operator === 'between') {
    const fromDate = Array.isArray(value) && value[0] ? value[0] : '';
    const toDate = Array.isArray(value) && value[1] ? value[1] : '';

    return (
      <div className="flex items-center gap-1.5 w-full">
        <input
          type="date"
          disabled={disabled}
          value={fromDate}
          onChange={(e) => onChange([e.target.value || null, toDate || null])}
          className="w-1/2 h-8 px-2 text-xs rounded-md border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
        />
        <span className="text-xs text-slate-400 font-medium">to</span>
        <input
          type="date"
          disabled={disabled}
          value={toDate}
          onChange={(e) => onChange([fromDate || null, e.target.value || null])}
          className="w-1/2 h-8 px-2 text-xs rounded-md border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
        />
      </div>
    );
  }

  return (
    <input
      type="date"
      disabled={disabled}
      value={value && !Array.isArray(value) ? String(value) : ''}
      onChange={(e) => onChange(e.target.value || null)}
      className="w-full h-8 px-2.5 text-xs rounded-md border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
    />
  );
};
