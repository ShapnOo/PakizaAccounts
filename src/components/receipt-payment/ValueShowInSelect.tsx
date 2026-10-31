import React from 'react';
import { ValueShowIn, VALUE_SHOW_IN_OPTIONS } from '../../types/receiptPayment';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';

interface ValueShowInSelectProps {
  value: ValueShowIn;
  onChange: (val: ValueShowIn) => void;
  disabled?: boolean;
}

const VALUE_SHOW_IN_LABELS: Record<ValueShowIn, string> = {
  'N/A': 'Actual (N/A)',
  'Thousand(/1000)': 'In Thousand (k)',
  'Lakh(/100000)': 'In Lakh (L)',
  'Million(/1000000)': 'In Million (M)',
  'Crore(/10000000)': 'In Crore (Cr)',
};

export const ValueShowInSelect: React.FC<ValueShowInSelectProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
        <SlidersHorizontal className="size-2.5 text-indigo-500" />
        Value Show In
      </label>
      <div className="relative">
        <select
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value as ValueShowIn)}
          className="w-full h-7.5 pl-2.5 pr-7 rounded-md border border-slate-200 bg-white text-[11px] font-medium text-slate-700 shadow-2xs hover:border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition cursor-pointer appearance-none disabled:opacity-50"
        >
          {VALUE_SHOW_IN_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {VALUE_SHOW_IN_LABELS[opt] || opt}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
          <ChevronDown className="size-3" />
        </div>
      </div>
    </div>
  );
};

