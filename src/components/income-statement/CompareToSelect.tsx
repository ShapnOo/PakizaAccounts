import React from 'react';
import { CompareMode, COMPARE_MODES } from '../../types/incomeStatement';
import { Layers } from 'lucide-react';

interface CompareToSelectProps {
  value: CompareMode;
  onChange: (val: CompareMode) => void;
}

export const CompareToSelect: React.FC<CompareToSelectProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label
        className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 whitespace-nowrap"
        data-raw-label="Prevous Period"
      >
        <Layers className="size-3.5 text-indigo-600 shrink-0" />
        <span>Compare To</span>
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as CompareMode)}
        data-raw-label="Prevous Period"
        className="w-full text-xs font-medium text-slate-800 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 h-9 transition-all outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
      >
        {COMPARE_MODES.map((mode) => (
          <option key={mode} value={mode}>
            {mode}
          </option>
        ))}
      </select>
    </div>
  );
};

