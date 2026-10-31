import React, { useState, useRef, useEffect } from 'react';
import { AccountsDetailType, ACCOUNTS_DETAILS_TYPES } from '../../types/receiptPayment';
import { Layers, ChevronDown, Check } from 'lucide-react';

interface AccountsDetailsTypeMultiSelectProps {
  selected: AccountsDetailType[];
  onChange: (selected: AccountsDetailType[]) => void;
  disabled?: boolean;
}

export const AccountsDetailsTypeMultiSelect: React.FC<
  AccountsDetailsTypeMultiSelectProps
> = ({ selected, onChange, disabled = false }) => {
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

  const toggleItem = (item: AccountsDetailType) => {
    if (selected.includes(item)) {
      onChange(selected.filter((i) => i !== item));
    } else {
      onChange([...selected, item]);
    }
  };

  const displayText =
    selected.length === 0
      ? 'All Details Types'
      : selected.length === 1
      ? selected[0]
      : `${selected.length} Types Selected`;

  return (
    <div className="flex flex-col gap-1 w-full relative" ref={containerRef}>
      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
        <Layers className="size-2.5 text-indigo-500" />
        Accounts Details Type
      </label>

      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className="w-full h-7.5 px-2.5 rounded-md border border-slate-200 bg-white text-[11px] font-medium text-slate-700 shadow-2xs hover:border-slate-300 flex items-center justify-between gap-1.5 transition cursor-pointer disabled:opacity-50"
      >
        <span className="truncate">{displayText}</span>
        <div className="flex items-center gap-1 shrink-0">
          {selected.length > 0 && (
            <span className="px-1.5 py-0.2 bg-indigo-50 text-indigo-600 rounded text-[9px] font-bold border border-indigo-100">
              {selected.length}
            </span>
          )}
          <ChevronDown className="size-3 text-slate-400" />
        </div>
      </button>

      {open && (
        <div className="absolute top-full mt-1 left-0 z-50 w-64 bg-white rounded-lg border border-slate-200 shadow-xl py-1 text-[11px]">
          <div className="px-2.5 py-1.5 text-[10px] font-semibold text-slate-500 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <span className="uppercase tracking-wider">Account Detail Types</span>
            {selected.length > 0 && (
              <button
                type="button"
                onClick={() => onChange([])}
                className="text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
          <div className="max-h-48 overflow-y-auto p-1 space-y-0.5">
            {ACCOUNTS_DETAILS_TYPES.map((type) => {
              const isChecked = selected.includes(type);
              return (
                <div
                  key={type}
                  onClick={() => toggleItem(type)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-slate-50 cursor-pointer text-[11px] text-slate-700 transition-colors"
                >
                  <div
                    className={`size-3.5 rounded border flex items-center justify-center transition ${
                      isChecked
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isChecked && <Check className="size-2.5 stroke-[3]" />}
                  </div>
                  <span className="truncate">{type}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

