import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { ResetToDefaultButton } from './ResetToDefaultButton';
import type { ReportType } from '../../types/isCustomization';

interface CustomizeHeaderProps {
  reportType: ReportType;
  dirty: boolean;
  onReset: () => void;
}

export const CustomizeHeader: React.FC<CustomizeHeaderProps> = ({
  reportType,
  dirty,
  onReset,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-0.5">
          <SlidersHorizontal className="size-3.5" />
          <span>Accounts Configuration</span>
          <span className="text-slate-400">/</span>
          <span>Accounts Report Customization</span>
          <span className="text-slate-400">/</span>
          <span className="text-slate-700">Income Statement</span>
        </div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Customize Income Statement
          </h1>
          {dirty && (
            <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              Unsaved changes
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Edit rows, codes, and formulas for {reportType} Income Statement.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <ResetToDefaultButton onReset={onReset} />
      </div>
    </div>
  );
};
