import React from 'react';
import { BookOpen, Search, X } from 'lucide-react';

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
    <div className="flex flex-col gap-1 w-full">
      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
        <BookOpen className="size-2.5 text-indigo-500" />
        Accounts Head
      </label>
      <div className="relative">
        <Search className="size-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Filter by head..."
          className="w-full h-7.5 pl-7 pr-7 rounded-md border border-slate-200 bg-white text-[11px] font-medium text-slate-700 placeholder:text-slate-400 shadow-2xs hover:border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition disabled:opacity-50"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute inset-y-0 right-0 flex items-center px-2 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="size-3" />
          </button>
        )}
      </div>
    </div>
  );
};

