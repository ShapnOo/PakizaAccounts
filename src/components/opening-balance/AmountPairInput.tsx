import React from 'react';
import { formatNumber } from '../../lib/format';

interface AmountPairInputProps {
  currency: string;
  exchangeRate: number;
  debit?: number;
  credit?: number;
  debitBDT?: number;
  creditBDT?: number;
  onUpdateDebit: (val?: number) => void;
  onUpdateCredit: (val?: number) => void;
  onUpdateDebitBDT: (val?: number) => void;
  onUpdateCreditBDT: (val?: number) => void;
  error?: boolean;
}

export const AmountPairInput: React.FC<AmountPairInputProps> = ({
  currency,
  exchangeRate,
  debit,
  credit,
  debitBDT,
  creditBDT,
  onUpdateDebit,
  onUpdateCredit,
  onUpdateDebitBDT,
  onUpdateCreditBDT,
  error,
}) => {
  const isBDT = currency === 'BDT' || !currency;

  return (
    <>
      {/* ── 10. Debit (Original Currency) ── */}
      <td className="py-1 px-1.5 w-24">
        {isBDT ? (
          <div className="h-8 px-2 flex items-center justify-end font-mono text-xs text-muted-foreground/40 bg-muted/20 rounded border border-transparent select-none">
            —
          </div>
        ) : (
          <input
            type="number"
            min={0}
            step="any"
            placeholder="0.00"
            value={debit !== undefined ? debit : ''}
            onChange={(e) => {
              const val = e.target.value === '' ? undefined : parseFloat(e.target.value);
              onUpdateDebit(val);
            }}
            className={`w-full h-8 px-2 text-right font-mono text-xs tabular-nums rounded-md border outline-none transition-all ${
              error
                ? 'border-rose-400 bg-rose-50/20'
                : 'border-border/80 bg-background focus:ring-1 focus:ring-indigo-500'
            }`}
          />
        )}
      </td>

      {/* ── 11. Credit (Original Currency) ── */}
      <td className="py-1 px-1.5 w-24">
        {isBDT ? (
          <div className="h-8 px-2 flex items-center justify-end font-mono text-xs text-muted-foreground/40 bg-muted/20 rounded border border-transparent select-none">
            —
          </div>
        ) : (
          <input
            type="number"
            min={0}
            step="any"
            placeholder="0.00"
            value={credit !== undefined ? credit : ''}
            onChange={(e) => {
              const val = e.target.value === '' ? undefined : parseFloat(e.target.value);
              onUpdateCredit(val);
            }}
            className={`w-full h-8 px-2 text-right font-mono text-xs tabular-nums rounded-md border outline-none transition-all ${
              error
                ? 'border-rose-400 bg-rose-50/20'
                : 'border-border/80 bg-background focus:ring-1 focus:ring-indigo-500'
            }`}
          />
        )}
      </td>

      {/* ── 12. Debit (BDT) ── */}
      <td className="py-1 px-1.5 w-28 bg-emerald-500/[0.02]">
        <input
          type="number"
          min={0}
          step="any"
          placeholder="0.00"
          readOnly={!isBDT}
          value={debitBDT !== undefined ? debitBDT : ''}
          onChange={(e) => {
            if (!isBDT) return;
            const val = e.target.value === '' ? undefined : parseFloat(e.target.value);
            onUpdateDebitBDT(val);
          }}
          className={`w-full h-8 px-2 text-right font-mono text-xs tabular-nums font-semibold rounded-md border outline-none transition-all ${
            !isBDT
              ? 'bg-muted/30 text-foreground/80 border-border/40 cursor-default select-all'
              : error
              ? 'border-rose-400 bg-rose-50/20 text-foreground'
              : 'border-border/80 bg-background text-foreground focus:ring-1 focus:ring-emerald-500'
          }`}
        />
      </td>

      {/* ── 13. Credit (BDT) ── */}
      <td className="py-1 px-1.5 w-28 bg-rose-500/[0.02]">
        <input
          type="number"
          min={0}
          step="any"
          placeholder="0.00"
          readOnly={!isBDT}
          value={creditBDT !== undefined ? creditBDT : ''}
          onChange={(e) => {
            if (!isBDT) return;
            const val = e.target.value === '' ? undefined : parseFloat(e.target.value);
            onUpdateCreditBDT(val);
          }}
          className={`w-full h-8 px-2 text-right font-mono text-xs tabular-nums font-semibold rounded-md border outline-none transition-all ${
            !isBDT
              ? 'bg-muted/30 text-foreground/80 border-border/40 cursor-default select-all'
              : error
              ? 'border-rose-400 bg-rose-50/20 text-foreground'
              : 'border-border/80 bg-background text-foreground focus:ring-1 focus:ring-rose-500'
          }`}
        />
      </td>
    </>
  );
};
