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
    <div className="flex flex-col gap-1 min-w-[190px] relative" ref={containerRef}>
      <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1">
        <Layers className="size-3 text-indigo-500" />
        Accounts Details Type
      </label>

      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 shadow-2xs hover:bg-slate-50 flex items-center justify-between gap-1 transition cursor-pointer disabled:opacity-50"
      >
        <span className="truncate">{displayText}</span>
        <ChevronDown className="size-3.5 text-slate-400 shrink-0" />
      </button>

      {open && (
        <div className="absolute top-full mt-1 left-0 z-40 w-64 bg-white rounded-lg border border-slate-200 shadow-lg py-1">
          <div className="px-2 py-1 text-[11px] font-semibold text-slate-500 border-b border-slate-100 flex justify-between">
            <span>Filter by Account Detail</span>
            {selected.length > 0 && (
              <button
                type="button"
                onClick={() => onChange([])}
                className="text-indigo-600 hover:underline cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
          <div className="max-h-48 overflow-y-auto p-1">
            {ACCOUNTS_DETAILS_TYPES.map((type) => {
              const isChecked = selected.includes(type);
              return (
                <div
                  key={type}
                  onClick={() => toggleItem(type)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-slate-50 cursor-pointer text-xs text-slate-700"
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
                  <span>{type}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

