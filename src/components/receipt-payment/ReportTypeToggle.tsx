import React from 'react';
import { ReportType, REPORT_TYPES } from '../../types/receiptPayment';
import { FileText, Layers } from 'lucide-react';

interface ReportTypeToggleProps {
  value: ReportType;
  onChange: (val: ReportType) => void;
  disabled?: boolean;
}

export const ReportTypeToggle: React.FC<ReportTypeToggleProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1">
        <FileText className="size-3 text-indigo-500" />
        Report Type
      </label>
      <div className="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-200">
        {REPORT_TYPES.map((type) => {
          const isActive = value === type;
          return (
            <button
              key={type}
              type="button"
              disabled={disabled}
              onClick={() => onChange(type)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {type === 'Comprehensive' ? (
                <FileText className="size-3.5" />
              ) : (
                <Layers className="size-3.5" />
              )}
              <span>{type}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
