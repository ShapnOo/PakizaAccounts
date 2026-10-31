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
    <div className="flex flex-col gap-1 w-full">
      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
        <FileText className="size-2.5 text-indigo-500" />
        Report Type
      </label>
      <div className="h-7.5 w-full inline-flex rounded-md bg-slate-100 p-0.5 border border-slate-200 shadow-2xs items-center">
        {REPORT_TYPES.map((type) => {
          const isActive = value === type;
          return (
            <button
              key={type}
              type="button"
              disabled={disabled}
              onClick={() => onChange(type)}
              className={`flex-1 h-full flex items-center justify-center gap-1.5 px-2 rounded-[5px] text-[11px] font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-white text-indigo-600 font-semibold shadow-2xs border border-slate-200/50'
                  : 'text-slate-600 hover:text-slate-900'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {type === 'Comprehensive' ? (
                <FileText className="size-3" />
              ) : (
                <Layers className="size-3" />
              )}
              <span>{type}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

