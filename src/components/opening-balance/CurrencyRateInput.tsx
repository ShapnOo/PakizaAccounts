import React from 'react';
import { CURRENCIES } from '../../types/openingBalance';

interface CurrencyRateInputProps {
  currency: string;
  exchangeRate: number;
  onCurrencyChange: (c: string) => void;
  onRateChange: (r: number) => void;
}

export const CurrencyRateInput: React.FC<CurrencyRateInputProps> = ({
  currency,
  exchangeRate,
  onCurrencyChange,
  onRateChange,
}) => {
  const isBDT = currency === 'BDT' || !currency;

  return (
    <div className="flex items-center gap-1.5">
      {/* Currency Select */}
      <select
        value={currency || 'BDT'}
        onChange={(e) => onCurrencyChange(e.target.value)}
        className="h-8 px-1.5 rounded-md border border-border/80 bg-background text-xs font-mono font-bold text-foreground outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer w-18 shrink-0"
      >
        {CURRENCIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {/* Exchange Rate Input */}
      <input
        type="number"
        min={0.0001}
        step={0.01}
        disabled={isBDT}
        value={isBDT ? 1 : exchangeRate || 1}
        onChange={(e) => onRateChange(parseFloat(e.target.value) || 1)}
        className={`h-8 px-2 rounded-md border text-xs font-mono text-right w-18 outline-none ${
          isBDT
            ? 'bg-muted/40 text-muted-foreground/70 border-border/40 cursor-not-allowed'
            : 'bg-background text-foreground border-border/80 focus:ring-1 focus:ring-indigo-500 font-semibold'
        }`}
      />
    </div>
  );
};
