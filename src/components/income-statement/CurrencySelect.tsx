import React from 'react';
import { Currency, CURRENCIES } from '../../types/incomeStatement';
import { Coins } from 'lucide-react';

interface CurrencySelectProps {
  value: Currency;
  onChange: (c: Currency) => void;
}

export const CurrencySelect: React.FC<CurrencySelectProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 whitespace-nowrap">
        <Coins className="size-3.5 text-indigo-600 shrink-0" />
        <span>Currency</span>
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Currency)}
        className="w-full text-xs font-medium text-slate-800 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 h-9 transition-all outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
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

