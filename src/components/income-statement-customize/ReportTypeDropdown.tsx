import React from 'react';
import { ChevronDown, Layers } from 'lucide-react';
import type { ReportType } from '../../types/isCustomization';
import { REPORT_TYPES } from '../../types/isCustomization';

interface ReportTypeDropdownProps {
  value: ReportType;
  onChange: (type: ReportType) => void;
  disabled?: boolean;
}

export const ReportTypeDropdown: React.FC<ReportTypeDropdownProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="flex-1 min-w-[220px]">
      <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
        <Layers className="size-3 text-indigo-600" />
        <span>Report Type</span>
      </label>
      <div className="relative">
        <select
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value as ReportType)}
          className="w-full h-9 pl-3 pr-8 rounded-lg bg-white border border-slate-200 text-[13px] font-semibold text-slate-800 shadow-2xs hover:border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {REPORT_TYPES.map((type) => (
            <option key={type} value={type}>
              {type} Income Statement
            </option>
          ))}
        </select>
        <ChevronDown className="size-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
};

