import React from 'react';
import { ValueShowIn, VALUE_SHOW_IN_OPTIONS } from '../../types/balanceSheet';
import { SlidersHorizontal } from 'lucide-react';

interface ValueShowInSelectProps {
  value: ValueShowIn;
  onChange: (val: ValueShowIn) => void;
}

export const ValueShowInSelect: React.FC<ValueShowInSelectProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="flex flex-col gap-1 min-w-[120px]">
      <label className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
        <SlidersHorizontal className="size-3.5 text-indigo-600" />
        <span>Value show In</span>
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as ValueShowIn)}
        className="w-full text-xs font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-md px-2.5 py-1.5 transition-all outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
      >
        {VALUE_SHOW_IN_OPTIONS.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
};

