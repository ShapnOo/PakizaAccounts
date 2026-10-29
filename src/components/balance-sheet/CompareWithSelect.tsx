import React, { useState } from 'react';
import { CompareWith, COMPARE_WITH_OPTIONS } from '../../types/balanceSheet';
import { Layers, Calendar } from 'lucide-react';

interface CompareWithSelectProps {
  value: CompareWith;
  onChange: (val: CompareWith) => void;
  customStartDate?: string;
  customEndDate?: string;
  onCustomDateChange?: (start: string, end: string) => void;
}

export const CompareWithSelect: React.FC<CompareWithSelectProps> = ({
  value,
  onChange,
  customStartDate,
  customEndDate,
  onCustomDateChange,
}) => {
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [tempStart, setTempStart] = useState(customStartDate || '2025-01-01');
  const [tempEnd, setTempEnd] = useState(customEndDate || '2025-12-31');

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as CompareWith;
    onChange(val);
    if (val === 'Custom Period') {
      setShowCustomModal(true);
    }
  };

  const applyCustomPeriod = () => {
    if (onCustomDateChange) {
      onCustomDateChange(tempStart, tempEnd);
    }
    setShowCustomModal(false);
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex items-center justify-between">
        <label
          className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 whitespace-nowrap"
          data-raw-label="Prevous Years"
        >
          <Layers className="size-3.5 text-indigo-600 shrink-0" />
          <span>Compare With</span>
        </label>
        {value === 'Budget' && (
          <span className="text-[10px] text-amber-700 bg-amber-50 px-1 rounded font-medium">
            Budget
          </span>
        )}
      </div>

      <select
        value={value}
        onChange={handleSelect}
        data-raw-label="Prevous Years"
        className="w-full text-xs font-medium text-slate-800 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 h-9 transition-all outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
      >
        {COMPARE_WITH_OPTIONS.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      {/* Custom Period Modal / Popover */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-sm p-5 space-y-4">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
              <Calendar className="size-4 text-indigo-600" />
              <span>Select Custom Comparative Period</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-500 font-medium">From Date</label>
                <input
                  type="date"
                  value={tempStart}
                  onChange={(e) => setTempStart(e.target.value)}
                  className="w-full text-xs font-medium border border-slate-200 rounded-md p-2 mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 font-medium">To Date</label>
                <input
                  type="date"
                  value={tempEnd}
                  onChange={(e) => setTempEnd(e.target.value)}
                  className="w-full text-xs font-medium border border-slate-200 rounded-md p-2 mt-1"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={applyCustomPeriod}
                className="px-3 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-bold shadow-xs"
              >
                Apply Period
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
