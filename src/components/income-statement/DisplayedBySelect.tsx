import React from 'react';
import { DisplayedBy, DISPLAYED_BY_OPTIONS } from '../../types/incomeStatement';
import { CalendarRange } from 'lucide-react';

interface DisplayedBySelectProps {
  value: DisplayedBy;
  onChange: (d: DisplayedBy) => void;
  disabled?: boolean;
}

export const DisplayedBySelect: React.FC<DisplayedBySelectProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 whitespace-nowrap">
        <CalendarRange className="size-3.5 text-indigo-600 shrink-0" />
        <span>Displayed By</span>
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as DisplayedBy)}
        disabled={disabled}
        className="w-full text-xs font-medium text-slate-800 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 h-9 transition-all outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer disabled:opacity-50"
      >
        {DISPLAYED_BY_OPTIONS.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
};

