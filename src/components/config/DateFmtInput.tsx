import React from 'react';
import { Calendar } from 'lucide-react';

interface DateFmtInputProps {
  value: string;
}

export const DateFmtInput: React.FC<DateFmtInputProps> = ({ value }) => {
  return (
    <div className="relative inline-flex items-center w-full max-w-[280px]">
      <input
        type="text"
        readOnly
        value={value}
        className="w-full h-8.5 pl-3 pr-8 rounded-md bg-slate-100/90 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 outline-none select-all cursor-default shadow-2xs"
      />
      <Calendar className="size-3.5 absolute right-2.5 text-slate-400 pointer-events-none" />
    </div>
  );
};
