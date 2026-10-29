import React from 'react';
import { CURRENCIES } from '../../types/balanceSheet';
import { Coins } from 'lucide-react';

interface CurrencySelectProps {
  value: string;
  onChange: (c: string) => void;
}

export const CurrencySelect: React.FC<CurrencySelectProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="flex flex-col gap-1 min-w-[100px]">
      <label className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
        <Coins className="size-3.5 text-indigo-600" />
        <span>Currency</span>
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-xs font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-md px-2.5 py-1.5 transition-all outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
      >
        {CURRENCIES.map((cur) => (
          <option key={cur} value={cur}>
            {cur}
          </option>
        ))}
      </select>
    </div>
  );
};

