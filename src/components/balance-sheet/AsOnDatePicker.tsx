import React from 'react';
import { Calendar } from 'lucide-react';

interface AsOnDatePickerProps {
  value: string;
  onChange: (date: string) => void;
  disabled?: boolean;
}

export const AsOnDatePicker: React.FC<AsOnDatePickerProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 whitespace-nowrap">
        <Calendar className="size-3.5 text-indigo-600 shrink-0" />
        <span>As on</span>
      </label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full text-xs font-medium text-slate-800 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 h-9 transition-all outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer disabled:opacity-50"
      />
    </div>
  );
};
