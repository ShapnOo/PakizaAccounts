import React from 'react';
import { Calendar } from 'lucide-react';
import { DualDateRangePicker } from '../common/DualDateRangePicker';

interface DateRangeSelectProps {
  value: string;
  onChange: (val: string) => void;
  customDateRange?: string;
  onCustomDateRangeChange?: (val: string) => void;
  disabled?: boolean;
}

export const DateRangeSelect: React.FC<DateRangeSelectProps> = ({
  value,
  onChange,
  customDateRange = '01/01/2026 - 31/01/2026',
  onCustomDateRangeChange,
  disabled = false,
}) => {
  const options = ['This Period', 'Last Period', 'This Year', 'Custom Range'];

  return (
    <div className="flex flex-col gap-1 w-full relative">
      <label className="text-xs font-semibold text-slate-600 flex items-center justify-between gap-1.5 whitespace-nowrap">
        <span className="flex items-center gap-1.5">
          <Calendar className="size-3.5 text-indigo-600 shrink-0" />
          <span>Date Range</span>
        </span>
        {value === 'Custom Range' && (
          <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200/60">
            Custom
          </span>
        )}
      </label>

      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-xs font-medium text-slate-800 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 h-9 transition-all outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      {/* When Custom Range is selected, render the dual calendar date picker right underneath ("niche") */}
      {value === 'Custom Range' && (
        <div className="mt-1 animate-in fade-in-50 duration-150 relative z-30">
          <DualDateRangePicker
            value={customDateRange}
            onChange={(val) => onCustomDateRangeChange?.(val)}
            disabled={disabled}
            placeholder="MM/DD/YYYY - MM/DD/YYYY"
            align="left"
          />
        </div>
      )}
    </div>
  );
};
