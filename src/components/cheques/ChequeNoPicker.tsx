import React from 'react';
import { ChequeBook, ChequeEntry } from '../../types/cheque';
import { Lock, CheckCircle2 } from 'lucide-react';

interface ChequeNoPickerProps {
  book: ChequeBook | null;
  value: string;
  onChange: (chequeNo: string, leaf?: ChequeEntry) => void;
  error?: string;
}

export const ChequeNoPicker: React.FC<ChequeNoPickerProps> = ({
  book,
  value,
  onChange,
  error,
}) => {
  if (!book) {
    return (
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground">
          Cheque No. <span className="text-rose-500">*</span>
        </label>
        <select
          disabled
          className="w-full h-9 px-3 rounded-lg border border-border bg-muted/40 text-xs font-mono text-muted-foreground outline-none cursor-not-allowed"
        >
          <option>-- Select a Cheque Book first --</option>
        </select>
      </div>
    );
  }

  // Filter: non-inactive AND unused
  const validCheques = book.cheques.filter((c) => !c.isInactive && !c.used);

  // If enforce by serial is active, find lowest SL
  const lowestAvailableSl = validCheques.length > 0
    ? Math.min(...validCheques.map((c) => c.sl))
    : null;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <span>Cheque No.</span>
          <span className="text-rose-500">*</span>
          {book.enforceBySerial && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 px-1.5 py-0.2 rounded">
              <Lock className="size-2.5" />
              <span>Serial Locked</span>
            </span>
          )}
        </label>
        <span className="text-[10px] text-muted-foreground font-mono">
          {validCheques.length} available
        </span>
      </div>

      <select
        value={value}
        onChange={(e) => {
          const selected = book.cheques.find((c) => c.chequeNo === e.target.value);
          onChange(e.target.value, selected);
        }}
        className={`w-full h-9 px-3 rounded-lg border bg-background text-xs font-mono font-bold tracking-wider text-foreground outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs cursor-pointer ${
          error ? 'border-rose-400 focus:ring-rose-500' : 'border-border'
        }`}
      >
        <option value="">-- Select Available Cheque Leaf --</option>
        {book.cheques
          .filter((c) => !c.isInactive) // Inactive cheques not showed in prepare page (N.B. #10)
          .map((c) => {
            const isUsed = c.used;
            const isLockedBySerial =
              book.enforceBySerial && lowestAvailableSl !== null && c.sl !== lowestAvailableSl;
            const isDisabled = isUsed || isLockedBySerial;

            return (
              <option
                key={c.id || c.chequeNo}
                value={c.chequeNo}
                disabled={isDisabled}
              >
                SL {c.sl}: {c.chequeNo}{' '}
                {isUsed
                  ? '(USED)'
                  : isLockedBySerial
                  ? '(Locked: Consume serial order)'
                  : c.sl === lowestAvailableSl && book.enforceBySerial
                  ? '★ Next Sequential Cheque'
                  : ''}
              </option>
            );
          })}
      </select>
      {error && <p className="text-[11px] text-rose-500 font-medium">{error}</p>}
    </div>
  );
};
