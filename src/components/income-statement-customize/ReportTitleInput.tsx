import React from 'react';
import { Type } from 'lucide-react';

interface ReportTitleInputProps {
  title: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

export const ReportTitleInput: React.FC<ReportTitleInputProps> = ({
  title,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="flex-2 min-w-[280px]">
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Type className="size-3 text-indigo-600" />
          <span>Report Title</span>
        </label>
        <span className="text-[11px] text-slate-400 font-normal">
          {title.length}/120
        </span>
      </div>
      <input
        type="text"
        value={title}
        disabled={disabled}
        maxLength={120}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter statement title..."
        className="w-full h-9 px-3 rounded-lg bg-white border border-slate-200 text-[13px] font-medium text-slate-800 placeholder-slate-400 shadow-2xs hover:border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition disabled:opacity-50"
      />
    </div>
  );
};
