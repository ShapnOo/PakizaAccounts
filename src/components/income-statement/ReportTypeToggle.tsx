import React from 'react';
import { ReportType, REPORT_TYPES } from '../../types/incomeStatement';
import { FileText } from 'lucide-react';

interface ReportTypeToggleProps {
  value: ReportType;
  onChange: (val: ReportType) => void;
}

export const ReportTypeToggle: React.FC<ReportTypeToggleProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 whitespace-nowrap">
        <FileText className="size-3.5 text-indigo-600 shrink-0" />
        <span>Report Type</span>
      </label>
      <div className="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-200 h-9 items-center">
        {REPORT_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onChange(type)}
            className={`flex-1 h-full px-2 text-xs font-bold rounded-md transition-all cursor-pointer whitespace-nowrap ${
              value === type
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
};

