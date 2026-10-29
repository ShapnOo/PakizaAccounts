import React from 'react';
import { DateRange, DATE_RANGES } from '../../types/retainedEarnings';
import { Calendar } from 'lucide-react';

interface DateRangeSelectProps {
  value: DateRange;
  customFrom?: string;
  customTo?: string;
  onChange: (val: DateRange) => void;
  onCustomChange: (from: string, to: string) => void;
  disabled?: boolean;
}

export const DateRangeSelect: React.FC<DateRangeSelectProps> = ({
  value,
  customFrom = '',
  customTo = '',
  onChange,
  onCustomChange,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
      <div className="flex flex-col gap-1 min-w-[170px]">
        <label className="text-xs font-medium text-slate-600 flex items-center gap-1.5 font-sans">
          <Calendar className="size-3.5 text-indigo-500" />
          <span>Date Range</span>
        </label>
        <div className="relative">
          <select
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value as DateRange)}
            className="w-full h-8.5 pl-3 pr-8 rounded-lg border border-slate-200 bg-white text-xs font-sans text-slate-800 shadow-2xs focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition cursor-pointer appearance-none disabled:opacity-50"
          >
            {DATE_RANGES.map((r) => (
              <option key={r} value={r}>
                {r}
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

      {value === 'Custom' && (
        <div className="flex items-center gap-1.5 pt-4 sm:pt-4.5 font-sans">
          <div className="flex flex-col">
            <input
              type="date"
              value={customFrom}
              onChange={(e) => onCustomChange(e.target.value, customTo)}
              className="h-8.5 px-2.5 rounded-lg border border-slate-200 bg-white text-xs font-sans text-slate-800 shadow-2xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <span className="text-xs text-slate-400 font-sans">to</span>
          <div className="flex flex-col">
            <input
              type="date"
              value={customTo}
              onChange={(e) => onCustomChange(customFrom, e.target.value)}
              className="h-8.5 px-2.5 rounded-lg border border-slate-200 bg-white text-xs font-sans text-slate-800 shadow-2xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>
      )}
    </div>
  );
};

