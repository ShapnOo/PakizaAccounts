import React from 'react';
import { DateRangePreset, DATE_RANGES } from '../../types/receiptPayment';
import { Calendar } from 'lucide-react';

interface DateRangeSelectProps {
  preset: DateRangePreset;
  startDate: string;
  endDate: string;
  onPresetChange: (val: DateRangePreset) => void;
  onDateChange: (start: string, end: string) => void;
  disabled?: boolean;
}

export const DateRangeSelect: React.FC<DateRangeSelectProps> = ({
  preset,
  startDate,
  endDate,
  onPresetChange,
  onDateChange,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col gap-1 min-w-[210px]">
      <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1">
        <Calendar className="size-3 text-indigo-500" />
        Date Range
      </label>
      <div className="flex items-center gap-1.5">
        <div className="relative flex-1">
          <select
            value={preset}
            disabled={disabled}
            onChange={(e) => onPresetChange(e.target.value as DateRangePreset)}
            className="w-full h-8 pl-2.5 pr-7 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 shadow-2xs focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition cursor-pointer appearance-none disabled:opacity-50"
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

        {preset === 'Custom Range' ? (
          <div className="flex items-center gap-1 text-xs">
            <input
              type="date"
              value={startDate}
              onChange={(e) => onDateChange(e.target.value, endDate)}
              className="h-8 px-2 rounded-lg border border-slate-200 text-xs text-slate-800 bg-white"
            />
            <span className="text-slate-400">-</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => onDateChange(startDate, e.target.value)}
              className="h-8 px-2 rounded-lg border border-slate-200 text-xs text-slate-800 bg-white"
            />
          </div>
        ) : (
          <div className="h-8 px-2 bg-slate-100 border border-slate-200 rounded-lg flex items-center text-[11px] font-medium text-slate-600 whitespace-nowrap">
            {startDate.slice(5)} to {endDate.slice(5)}
          </div>
        )}
      </div>
    </div>
  );
};

