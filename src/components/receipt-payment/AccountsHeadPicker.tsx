import React from 'react';
import { BookOpen, X } from 'lucide-react';

interface AccountsHeadPickerProps {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

export const AccountsHeadPicker: React.FC<AccountsHeadPickerProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col gap-1 min-w-[160px]">
      <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1">
        <BookOpen className="size-3 text-indigo-500" />
        Accounts Head
      </label>
      <div className="relative">
        <input
          type="text"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Filter by head..."
          className="w-full h-8 pl-2.5 pr-7 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 placeholder-slate-400 shadow-2xs focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition disabled:opacity-50"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute inset-y-0 right-0 flex items-center px-2 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

