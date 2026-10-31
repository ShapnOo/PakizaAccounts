import React, { useState, useRef, useEffect } from 'react';
import { Columns3, Check, RotateCcw } from 'lucide-react';

export interface ColumnItem {
  key: string;
  label: string;
  visible: boolean;
}

interface ColumnTogglePopoverProps {
  columns: ColumnItem[];
  onToggle: (key: string) => void;
  onReset?: () => void;
  disabled?: boolean;
}

export const ColumnTogglePopover: React.FC<ColumnTogglePopoverProps> = ({
  columns,
  onToggle,
  onReset,
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

  const activeCount = columns.filter((c) => c.visible).length;
  const totalCount = columns.length;

  return (
    <div className="relative inline-block font-sans" ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition cursor-pointer select-none disabled:opacity-50"
        title="Show / Hide Columns"
      >
        <Columns3 className="w-3.5 h-3.5 text-indigo-600" />
        <span>Columns</span>
        <span className="ml-0.5 px-1.5 py-0.5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">
          {activeCount}/{totalCount}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-56 rounded-xl border border-slate-200 bg-white shadow-xl py-2 z-50 font-sans animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1 text-[11px] font-semibold text-slate-500 border-b border-slate-100 mb-1 flex items-center justify-between">
            <span>Show / Hide Columns</span>
            {onReset && (
              <button
                type="button"
                onClick={onReset}
                className="text-[10px] text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-0.5 cursor-pointer"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                Reset
              </button>
            )}
          </div>
          <div className="space-y-0.5 px-1 max-h-72 overflow-y-auto">
            {columns.map((col) => {
              const isChecked = col.visible;
              const isLastOne = isChecked && activeCount <= 1;

              return (
                <div
                  key={col.key}
                  onClick={() => !isLastOne && onToggle(col.key)}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs cursor-pointer select-none transition ${
                    isLastOne
                      ? 'opacity-60 cursor-not-allowed bg-slate-50 text-slate-400'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="font-medium">{col.label}</span>
                  <div
                    className={`size-3.5 rounded border flex items-center justify-center transition-colors ${
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

