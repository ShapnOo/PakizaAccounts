import React from 'react';
import { ChequeBook, ChequeEntry, ChequeType, SourceType } from '../../types/cheque';
import { ChequeNoPicker } from './ChequeNoPicker';
import { INITIAL_ACCOUNTS } from '../../mock/accounts';
import { CreditCard, Calendar, User, BookOpen } from 'lucide-react';

interface PrepareChequeBlockProps {
  sourceType: SourceType;
  book: ChequeBook | null;
  chequeType: ChequeType;
  chequeNo: string;
  chequeDate: string;
  payTo: string;
  glAccountId: string;
  amount: number;
  onChequeTypeChange: (val: ChequeType) => void;
  onChequeNoChange: (no: string, leaf?: ChequeEntry) => void;
  onChequeDateChange: (val: string) => void;
  onPayToChange: (val: string) => void;
  onGlAccountChange: (val: string) => void;
  onAmountChange: (val: number) => void;
  errors?: Record<string, string | undefined>;
}

export const PrepareChequeBlock: React.FC<PrepareChequeBlockProps> = ({
  sourceType,
  book,
  chequeType,
  chequeNo,
  chequeDate,
  payTo,
  glAccountId,
  amount,
  onChequeTypeChange,
  onChequeNoChange,
  onChequeDateChange,
  onPayToChange,
  onGlAccountChange,
  onAmountChange,
  errors = {},
}) => {
  const isLockedAmount = sourceType === 'bill' || sourceType === 'iou';

  // Flat list of leaf accounts from COA
  const selectableGlAccounts = INITIAL_ACCOUNTS.filter(
    (a) => a.type === 'ledger' || !a.children || a.children.length === 0
  );

  return (
    <div className="bg-card rounded-xl border border-border p-5 space-y-4 shadow-2xs">
      <div className="flex items-center gap-2 pb-2 border-b border-border/80">
        <div className="size-7 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
          <CreditCard className="size-4" />
        </div>
        <div>
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
            Prepare Cheque Details
          </h3>
          <p className="text-[11px] text-muted-foreground">
            Configure cheque leaf number, recipient, clearing type, and debit GL head
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Cheque Type */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Cheque Type <span className="text-rose-500">*</span>
          </label>
          <select
            value={chequeType}
            onChange={(e) => onChequeTypeChange(e.target.value as ChequeType)}
            className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs font-semibold text-foreground outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs cursor-pointer"
          >
            <option value="AC Payee">A/C Payee</option>
            <option value="Crossed">Crossed</option>
            <option value="Open">Open</option>
            <option value="Bearer">Bearer</option>
          </select>
        </div>

        {/* Cheque No Picker */}
        <div className="space-y-1.5">
          <ChequeNoPicker
            book={book}
            value={chequeNo}
            onChange={onChequeNoChange}
            error={errors.chequeNo}
          />
        </div>

        {/* Cheque Date */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Cheque Date <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            value={chequeDate}
            onChange={(e) => onChequeDateChange(e.target.value)}
            className={`w-full h-9 px-3 rounded-lg border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs ${
              errors.chequeDate ? 'border-rose-400 focus:ring-rose-500' : 'border-border'
            }`}
          />
          {errors.chequeDate && (
            <p className="text-[11px] text-rose-500 font-medium">{errors.chequeDate}</p>
          )}
        </div>

        {/* Pay To */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Pay To (Bearer / Payee) <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Mr. Xyz, BD Com Ltd."
            value={payTo}
            onChange={(e) => onPayToChange(e.target.value)}
            className={`w-full h-9 px-3 rounded-lg border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs ${
              errors.payTo ? 'border-rose-400 focus:ring-rose-500' : 'border-border'
            }`}
          />
          {errors.payTo && (
            <p className="text-[11px] text-rose-500 font-medium">{errors.payTo}</p>
          )}
        </div>

        {/* GL Account */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            GL Account (Debit Head) <span className="text-rose-500">*</span>
          </label>
          <select
            value={glAccountId}
            onChange={(e) => onGlAccountChange(e.target.value)}
            className={`w-full h-9 px-3 rounded-lg border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs cursor-pointer ${
              errors.glAccountId ? 'border-rose-400 focus:ring-rose-500' : 'border-border'
            }`}
          >
            <option value="">-- Select Debit GL Head --</option>
            {selectableGlAccounts.map((gl) => (
              <option key={gl.id} value={gl.id}>
                {gl.code} — {gl.name}
              </option>
            ))}
          </select>
          {errors.glAccountId && (
            <p className="text-[11px] text-rose-500 font-medium">{errors.glAccountId}</p>
          )}
        </div>

        {/* Amount */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-foreground">
              Amount (৳) <span className="text-rose-500">*</span>
            </label>
            {isLockedAmount && (
              <span className="text-[10px] text-amber-600 font-semibold">
                Locked to Pay Amount
              </span>
            )}
          </div>
          <input
            type="number"
            min={1}
            readOnly={isLockedAmount}
            value={amount || ''}
            onChange={(e) => onAmountChange(parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            className={`w-full h-9 px-3 rounded-lg border text-xs font-mono font-bold text-right outline-none shadow-2xs ${
              isLockedAmount
                ? 'bg-muted/50 border-border text-foreground cursor-not-allowed'
                : 'bg-background border-border text-foreground focus:ring-1 focus:ring-indigo-500'
            } ${errors.amount ? 'border-rose-400 focus:ring-rose-500' : ''}`}
          />
          {errors.amount && (
            <p className="text-[11px] text-rose-500 font-medium">{errors.amount}</p>
          )}
        </div>
      </div>
    </div>
  );
};
