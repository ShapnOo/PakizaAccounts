import React from 'react';
import { ValueShowIn, VALUE_SHOW_IN_OPTIONS } from '../../types/receiptPayment';
import { SlidersHorizontal } from 'lucide-react';

interface ValueShowInSelectProps {
  value: ValueShowIn;
  onChange: (val: ValueShowIn) => void;
  disabled?: boolean;
}

export const ValueShowInSelect: React.FC<ValueShowInSelectProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col gap-1 min-w-[140px]">
      <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1">
        <SlidersHorizontal className="size-3 text-indigo-500" />
        Value show In
      </label>
      <div className="relative">
        <select
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value as ValueShowIn)}
          className="w-full h-8 pl-2.5 pr-7 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 shadow-2xs focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition cursor-pointer appearance-none disabled:opacity-50"
        >
          {VALUE_SHOW_IN_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
          <svg className="size-3.5 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

