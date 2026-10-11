import React from 'react';
import { ChequeBook, ChequeEntry } from '../../types/cheque';
import { Lock, CheckCircle2 } from 'lucide-react';

import { SearchableSelect } from '../shared/SearchableSelect';

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
        <SearchableSelect
          value=""
          onChange={() => {}}
          disabled
          options={[]}
          placeholder="-- Select a Cheque Book first --"
          searchPlaceholder="Search cheque leaf..."
          buttonClassName="h-9 rounded-lg text-xs font-mono bg-muted/40 text-muted-foreground"
        />
      </div>
    );
  }

  // Filter: non-inactive AND unused
  const validCheques = book.cheques.filter((c) => !c.isInactive && !c.used);

  // If enforce by serial is active, find lowest SL
  const lowestAvailableSl = validCheques.length > 0
    ? Math.min(...validCheques.map((c) => c.sl))
    : null;

  const options = book.cheques
    .filter((c) => !c.isInactive)
    .map((c) => {
      const isUsed = c.used;
      const isLockedBySerial =
        book.enforceBySerial && lowestAvailableSl !== null && c.sl !== lowestAvailableSl;
      const isDisabled = isUsed || isLockedBySerial;
      const statusText = isUsed
        ? '(USED)'
        : isLockedBySerial
        ? '(Locked: Sequential order)'
        : c.sl === lowestAvailableSl && book.enforceBySerial
        ? '★ Next Sequential Cheque'
        : undefined;

      return {
        value: c.chequeNo,
        label: `SL ${c.sl}: ${c.chequeNo}`,
        sublabel: statusText,
        disabled: isDisabled,
      };
    });

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

      <SearchableSelect
        value={value}
        onChange={(val) => {
          const selected = book.cheques.find((c) => c.chequeNo === val);
          onChange(val, selected);
        }}
        options={options}
        placeholder="-- Select Available Cheque Leaf --"
        searchPlaceholder="Search by Cheque No or SL..."
        buttonClassName={`h-9 rounded-lg text-xs font-mono font-bold tracking-wider ${
          error ? 'border-rose-400 focus:ring-rose-500' : ''
        }`}
      />
      {error && <p className="text-[11px] text-rose-500 font-medium">{error}</p>}
    </div>
  );
};
