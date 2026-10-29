import React from 'react';
import { TrendingUp } from 'lucide-react';

interface ShowInPercentToggleProps {
  value: boolean;
  onChange: (val: boolean) => void;
}

export const ShowInPercentToggle: React.FC<ShowInPercentToggleProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="flex flex-col gap-1 min-w-[110px]">
      <label className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
        <TrendingUp className="size-3.5 text-indigo-600" />
        <span>Show In %</span>
      </label>
      <div className="inline-flex rounded-md bg-slate-100 p-0.5 border border-slate-200">
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`flex-1 px-3 py-1 text-xs font-bold rounded transition-all ${
            !value
              ? 'bg-white text-indigo-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          No
        </button>
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`flex-1 px-3 py-1 text-xs font-bold rounded transition-all ${
            value
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Yes
        </button>
      </div>
    </div>
  );
};

