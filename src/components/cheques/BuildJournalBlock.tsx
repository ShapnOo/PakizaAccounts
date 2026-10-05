import React from 'react';
import { BookOpen, RefreshCw, Sparkles, FileText, Info } from 'lucide-react';
import { SourceType, VOUCHER_TYPES } from '../../types/chequePrepare';

interface BuildJournalBlockProps {
  sourceType: SourceType;
  voucherDate: string;
  voucherType: string;
  narration: string;
  isAutoNarrationOverridden?: boolean;
  onVoucherDateChange: (val: string) => void;
  onVoucherTypeChange: (val: string) => void;
  onNarrationChange: (val: string) => void;
  onResetAutoNarration?: () => void;
}

export const BuildJournalBlock: React.FC<BuildJournalBlockProps> = ({
  sourceType,
  voucherDate,
  voucherType,
  narration,
  isAutoNarrationOverridden = false,
  onVoucherDateChange,
  onVoucherTypeChange,
  onNarrationChange,
  onResetAutoNarration,
}) => {
  const isDirect = sourceType === 'direct';

  return (
    <div className="bg-card rounded-xl border border-border p-5 space-y-4 shadow-2xs">
      <div className="flex items-center justify-between pb-2.5 border-b border-border/80">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <BookOpen className="size-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Build Journal & Voucher Posting
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Define voucher entry metadata and general ledger narration
            </p>
          </div>
        </div>

        {isDirect && (
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground bg-muted/40 px-2.5 py-1 rounded-lg border border-border/60">
            <Sparkles className="size-3.5 text-primary animate-pulse" />
            <span>Realtime Auto-Narration</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left Column (2 cols width on desktop): Inputs & Narration */}
        <div className="md:col-span-2 space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Voucher Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Voucher Date</label>
              <input
                type="date"
                value={voucherDate}
                onChange={(e) => onVoucherDateChange(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-primary shadow-2xs"
              />
            </div>

            {/* Voucher Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Voucher Type</label>
              <select
                value={voucherType}
                onChange={(e) => onVoucherTypeChange(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs font-semibold text-foreground outline-none focus:ring-1 focus:ring-primary shadow-2xs cursor-pointer"
              >
                {VOUCHER_TYPES.map((vt) => (
                  <option key={vt} value={vt}>
                    {vt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Narration */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <FileText className="size-3.5 text-muted-foreground" />
                <span>Voucher Narration</span>
              </label>

              {isDirect && isAutoNarrationOverridden && onResetAutoNarration && (
                <button
                  type="button"
                  onClick={onResetAutoNarration}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer"
                >
                  <RefreshCw className="size-3" />
                  <span>Reset to auto</span>
                </button>
              )}
            </div>

            <textarea
              rows={3}
              value={narration}
              onChange={(e) => onNarrationChange(e.target.value)}
              placeholder={
                isDirect
                  ? 'Auto-generated narration will appear here...'
                  : 'Enter narration for voucher posting...'
              }
              className="w-full p-2.5 rounded-lg border border-border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-primary shadow-2xs resize-none"
            />
          </div>
        </div>

        {/* Right Column: N.B. Hints Card */}
        <div className="p-3.5 rounded-lg border border-border/80 bg-muted/20 flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
              <Info className="size-3.5 text-primary" />
              <span>N.B. Operational Rules</span>
            </div>
            <ul className="text-[11px] text-muted-foreground space-y-1.5 list-disc pl-4 leading-relaxed">
              {isDirect ? (
                <>
                  <li>
                    <strong className="text-foreground">Column visibility:</strong> You can hide
                    or show optional columns in the prepare table.
                  </li>
                  <li>
                    <strong className="text-foreground">Live Narration:</strong> Narration will be
                    auto from above line information in realtime.
                  </li>
                  <li>
                    <strong className="text-foreground">Journal Link:</strong> Clicking "Save &
                    Journal" automatically produces the double-entry voucher.
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <strong className="text-foreground">Settlement Lock:</strong> The cheque amount
                    strictly mirrors the calculated bill or requisition pay amount.
                  </li>
                  <li>
                    <strong className="text-foreground">Signatory Mapping:</strong> Authorizer
                    signatory is automatically bound to the cheque print canvas.
                  </li>
                </>
              )}
            </ul>
          </div>

          <div className="text-[10px] text-muted-foreground/80 pt-2 border-t border-border/60">
            Pakiza Financial Engine v2.4 • Module CP-FA
          </div>
        </div>
      </div>
    </div>
  );
};
