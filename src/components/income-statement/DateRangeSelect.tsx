import React from 'react';
import { Calendar } from 'lucide-react';

interface DateRangeSelectProps {
  value: string;
  onChange: (val: string) => void;
}

export const DateRangeSelect: React.FC<DateRangeSelectProps> = ({ value, onChange }) => {
  const options = ['This Period', 'Last Period', 'This Year', 'Custom Range'];

  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 whitespace-nowrap">
        <Calendar className="size-3.5 text-indigo-600 shrink-0" />
        <span>Date Range</span>
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-xs font-medium text-slate-800 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 h-9 transition-all outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
};

