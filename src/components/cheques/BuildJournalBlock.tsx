import React from 'react';
import { BookOpen, Calendar, FileText } from 'lucide-react';

interface BuildJournalBlockProps {
  voucherDate: string;
  voucherType: string;
  narration: string;
  onVoucherDateChange: (val: string) => void;
  onVoucherTypeChange: (val: string) => void;
  onNarrationChange: (val: string) => void;
}

export const BuildJournalBlock: React.FC<BuildJournalBlockProps> = ({
  voucherDate,
  voucherType,
  narration,
  onVoucherDateChange,
  onVoucherTypeChange,
  onNarrationChange,
}) => {
  return (
    <div className="bg-slate-50/60 dark:bg-slate-900/30 rounded-xl border border-border p-5 space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-border/80">
        <div className="size-7 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
          <BookOpen className="size-4" />
        </div>
        <div>
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
            Build Journal / Accounting Voucher (Optional)
          </h3>
          <p className="text-[11px] text-muted-foreground">
            Automatically compile and balance a financial voucher upon cheque preparation
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Voucher Date */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Voucher Date</label>
          <input
            type="date"
            value={voucherDate}
            onChange={(e) => onVoucherDateChange(e.target.value)}
            className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs"
          />
        </div>

        {/* Voucher Type */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Voucher Type</label>
          <select
            value={voucherType}
            onChange={(e) => onVoucherTypeChange(e.target.value)}
            className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs font-semibold text-foreground outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs cursor-pointer"
          >
            <option value="Payment Voucher">Payment Voucher (PV)</option>
            <option value="Journal Voucher">Journal Voucher (JV)</option>
            <option value="Contra Voucher">Contra Voucher (CV)</option>
          </select>
        </div>

        {/* Narration */}
        <div className="sm:col-span-2 space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-foreground">
              Narration / Remarks
            </label>
            <span className="text-[10px] text-muted-foreground">
              {narration.length}/300 chars
            </span>
          </div>
          <textarea
            rows={2}
            maxLength={300}
            placeholder="e.g. Being payment made by cheque for office supplies..."
            value={narration}
            onChange={(e) => onNarrationChange(e.target.value)}
            className="w-full p-2.5 rounded-lg border border-border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs resize-none"
          />
        </div>
      </div>
    </div>
  );
};
