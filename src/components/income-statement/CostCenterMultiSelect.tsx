import React, { useState, useRef, useEffect } from 'react';
import { COST_CENTERS } from '../../types/incomeStatement';
import { Target, ChevronDown, Check } from 'lucide-react';

interface CostCenterMultiSelectProps {
  selected: string[];
  onChange: (centers: string[]) => void;
}

export const CostCenterMultiSelect: React.FC<CostCenterMultiSelectProps> = ({
  selected,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleCostCenter = (center: string) => {
    if (selected.includes(center)) {
      if (selected.length === 1) return; // Keep at least 1
      onChange(selected.filter((c) => c !== center));
    } else {
      onChange([...selected, center]);
    }
  };

  return (
    <div className="flex flex-col gap-1 w-full relative" ref={containerRef}>
      <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 whitespace-nowrap">
        <Target className="size-3.5 text-indigo-600 shrink-0" />
        <span>Select Cost Center ({selected.length})</span>
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full text-xs font-medium text-slate-800 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-lg px-2.5 py-1.5 h-9 flex items-center justify-between transition-all cursor-pointer text-left"
      >
        <span className="truncate">
          {selected.length === COST_CENTERS.length
            ? 'All Cost Centers'
            : `${selected.length} Centers Selected`}
        </span>
        <ChevronDown className="size-3.5 text-slate-400 shrink-0 ml-1" />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white border border-slate-200 rounded-lg shadow-lg p-1.5 max-h-56 overflow-y-auto sidebar-scroll">
          {COST_CENTERS.map((center) => {
            const isChecked = selected.includes(center);
            return (
              <button
                key={center}
                type="button"
                onClick={() => toggleCostCenter(center)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-md cursor-pointer text-left transition-colors"
              >
                <span className="truncate pr-2">{center}</span>
                <span
                  className={`size-4 rounded border flex items-center justify-center shrink-0 ${
                    isChecked
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {isChecked && <Check className="size-3" />}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

