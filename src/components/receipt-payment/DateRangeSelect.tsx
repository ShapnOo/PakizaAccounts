import React from 'react';
import { DateRangePreset, DATE_RANGES } from '../../types/receiptPayment';
import { Calendar, ChevronDown } from 'lucide-react';

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
    <div className="flex flex-col gap-1 w-full">
      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
        <span className="flex items-center gap-1">
          <Calendar className="size-2.5 text-indigo-500" />
          Date Range
        </span>
        <span className="text-[10px] font-medium text-slate-400 normal-case tracking-normal">
          {startDate} to {endDate}
        </span>
      </label>

      {preset === 'Custom Range' ? (
        <div className="flex items-center gap-1 w-full">
          <div className="relative shrink-0 w-[84px]">
            <select
              value={preset}
              disabled={disabled}
              onChange={(e) => onPresetChange(e.target.value as DateRangePreset)}
              className="w-full h-7.5 pl-2 pr-5 rounded-md border border-slate-200 bg-white text-[10px] font-medium text-slate-700 shadow-2xs hover:border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition cursor-pointer appearance-none disabled:opacity-50"
            >
              {DATE_RANGES.map((r) => (
                <option key={r} value={r}>
                  {r === 'Custom Range' ? 'Custom' : r}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-slate-400">
              <ChevronDown className="size-2.5" />
            </div>
          </div>

          <input
            type="date"
            value={startDate}
            disabled={disabled}
            onChange={(e) => onDateChange(e.target.value, endDate)}
            className="flex-1 min-w-0 h-7.5 px-1.5 rounded-md border border-slate-200 text-[10px] text-slate-700 bg-white shadow-2xs focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
          />
          <span className="text-slate-400 text-[10px] shrink-0">-</span>
          <input
            type="date"
            value={endDate}
            disabled={disabled}
            onChange={(e) => onDateChange(startDate, e.target.value)}
            className="flex-1 min-w-0 h-7.5 px-1.5 rounded-md border border-slate-200 text-[10px] text-slate-700 bg-white shadow-2xs focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
          />
        </div>
      ) : (
        <div className="relative w-full">
          <select
            value={preset}
            disabled={disabled}
            onChange={(e) => onPresetChange(e.target.value as DateRangePreset)}
            className="w-full h-7.5 pl-2.5 pr-7 rounded-md border border-slate-200 bg-white text-[11px] font-medium text-slate-700 shadow-2xs hover:border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition cursor-pointer appearance-none disabled:opacity-50"
          >
            {DATE_RANGES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
            <ChevronDown className="size-3" />
          </div>
        </div>
      )}
    </div>
  );
};

