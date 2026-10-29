import React, { useState, useRef, useEffect } from 'react';
import { Columns3, Check } from 'lucide-react';
import { TBVisibleColumns, COLUMN_LABELS } from '../../types/trialBalance';

interface ColumnTogglePopoverProps {
  columns: TBVisibleColumns;
  onToggle: (key: keyof TBVisibleColumns) => void;
  disabled?: boolean;
}

export const ColumnTogglePopover: React.FC<ColumnTogglePopoverProps> = ({
  columns,
  onToggle,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const colKeys = Object.keys(columns) as (keyof TBVisibleColumns)[];
  const activeCount = Object.values(columns).filter(Boolean).length;

  return (
    <div className="relative inline-block font-sans" ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium shadow-2xs transition cursor-pointer disabled:opacity-50"
        title="Toggle columns"
      >
        <Columns3 className="size-3.5 text-slate-500" />
        <span>Columns</span>
        <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">
          {activeCount}/6
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-52 rounded-xl border border-slate-200 bg-white shadow-xl py-2 z-50 font-sans">
          <div className="px-3 py-1 text-[11px] font-semibold text-slate-500 border-b border-slate-100 mb-1 flex justify-between">
            <span>Show / Hide Columns</span>
            <span className="text-[10px] text-indigo-600 font-medium">
              Min 2 visible
            </span>
          </div>
          <div className="space-y-0.5 px-1">
            {colKeys.map((k) => {
              const isChecked = columns[k];
              const isOnlyTwo = isChecked && activeCount <= 2;

              return (
                <div
                  key={k}
                  onClick={() => !isOnlyTwo && onToggle(k)}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs cursor-pointer select-none transition ${
                    isOnlyTwo
                      ? 'opacity-60 cursor-not-allowed bg-slate-50 text-slate-400'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="font-medium">{COLUMN_LABELS[k]}</span>
                  <div
                    className={`size-3.5 rounded border flex items-center justify-center ${
                      isChecked
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isChecked && <Check className="size-2.5 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

