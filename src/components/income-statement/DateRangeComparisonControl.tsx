import React from 'react';
import { CalendarRange, Calendar } from 'lucide-react';
import { DualDateRangePicker } from '../common/DualDateRangePicker';

interface DateRangeComparisonControlProps {
  noOfDateRanges?: number;
  customDateRanges?: string[];
  onNoOfDateRangesChange: (n: number) => void;
  onDateRangeChange: (index: number, val: string) => void;
  disabled?: boolean;
}

const PRESET_DATE_RANGES = [
  '01/01/2026 - 31/01/2026',
  '01/02/2026 - 28/02/2026',
  '01/03/2026 - 31/03/2026',
  '01/04/2026 - 30/04/2026',
  '01/05/2026 - 31/05/2026',
  '01/06/2026 - 30/06/2026',
];

export const DateRangeComparisonControl: React.FC<DateRangeComparisonControlProps> = ({
  noOfDateRanges = 2,
  customDateRanges = [],
  onNoOfDateRangesChange,
  onDateRangeChange,
  disabled = false,
}) => {
  const count = Math.max(1, Math.min(noOfDateRanges || 2, 5));
  const safeRanges = Array.isArray(customDateRanges) ? customDateRanges : [];

  return (
    <div className="w-full space-y-3 font-sans">
      <div className="flex flex-wrap items-center gap-4">
        {/* Number of Date Ranges selector */}
        <div className="flex flex-col gap-1 w-52 shrink-0">
          <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 whitespace-nowrap">
            <CalendarRange className="size-3.5 text-indigo-600 shrink-0" />
            <span>No of Date Ranges</span>
          </label>
          <select
            value={count}
            onChange={(e) => onNoOfDateRangesChange(parseInt(e.target.value, 10))}
            disabled={disabled}
            className="w-full text-xs font-medium text-slate-800 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 h-9 transition-all outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
          >
            <option value={1}>1 Range</option>
            <option value={2}>2 Ranges (Comparison)</option>
            <option value={3}>3 Ranges</option>
            <option value={4}>4 Ranges</option>
            <option value={5}>5 Ranges (Max)</option>
          </select>
        </div>

        <div className="flex items-center text-xs text-slate-500 italic pt-5">
          Select up to 5 comparative date ranges to display as side-by-side columns
        </div>
      </div>

      {/* Dynamic Date Range inputs with Dual Calendar Pickers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
        {Array.from({ length: count }, (_, idx) => {
          const currentVal =
            safeRanges[idx] || PRESET_DATE_RANGES[idx] || `Range ${idx + 1}`;

          // Right-align popover for the rightmost columns so it never overflows screen edge
          const align = idx >= 2 ? 'right' : 'left';

          return (
            <div
              key={idx}
              className="flex flex-col gap-1.5 w-full bg-slate-50/70 p-2.5 rounded-lg border border-slate-200 relative"
            >
              <label className="text-xs font-semibold text-slate-700 flex items-center justify-between gap-1">
                <span className="flex items-center gap-1.5">
                  <Calendar className="size-3 text-indigo-600" />
                  <span>Date Range {idx + 1}</span>
                </span>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-200/70 text-slate-600">
                  {idx === 0 ? 'Base' : `#${idx + 1}`}
                </span>
              </label>

              <DualDateRangePicker
                value={currentVal}
                onChange={(val) => onDateRangeChange(idx, val)}
                disabled={disabled}
                align={align}
                placeholder="MM/DD/YYYY - MM/DD/YYYY"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
