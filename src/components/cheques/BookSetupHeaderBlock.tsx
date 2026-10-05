import React, { useEffect, useState } from 'react';
import { listCoaBankAccounts } from '../../services/coaBankAccountsService';
import { CoaBankAccount } from '../../mock/coaBankAccounts';
import { Landmark, ShieldCheck, Check } from 'lucide-react';

interface BookSetupHeaderBlockProps {
  accountsBankId: string;
  bankName: string;
  glName: string;
  enforceBySerial: boolean;
  onAccountChange: (acc: CoaBankAccount | null) => void;
  onEnforceChange: (val: boolean) => void;
  errors?: Record<string, string | undefined>;
}

export const BookSetupHeaderBlock: React.FC<BookSetupHeaderBlockProps> = ({
  accountsBankId,
  bankName,
  glName,
  enforceBySerial,
  onAccountChange,
  onEnforceChange,
  errors = {},
}) => {
  const [bankAccounts, setBankAccounts] = useState<CoaBankAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchAccounts = async () => {
      try {
        const data = await listCoaBankAccounts();
        if (isMounted) setBankAccounts(data);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchAccounts();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelect = (accId: string) => {
    const acc = bankAccounts.find((b) => b.id === accId) || null;
    onAccountChange(acc);
  };

  return (
    <div className="bg-slate-50/60 dark:bg-slate-900/30 rounded-xl border border-border p-4.5 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-border/70">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Landmark className="size-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Bank Account Binding
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Select COA bank account to link cheque leaf series
            </p>
          </div>
        </div>

        {/* Enforce by SL Toggle */}
        <label className="flex items-center gap-2.5 cursor-pointer select-none bg-background px-3 py-1.5 rounded-lg border border-border hover:border-indigo-300 dark:hover:border-indigo-800 transition-colors shadow-2xs">
          <div className="text-right">
            <span className="text-xs font-bold text-foreground block">
              Enforce by SL?
            </span>
            <span className="text-[10px] text-muted-foreground block">
              Strict sequential consumption
            </span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={enforceBySerial}
            onClick={() => onEnforceChange(!enforceBySerial)}
            className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
              enforceBySerial ? 'bg-indigo-600 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
            }`}
          >
            <div className="size-4 rounded-full bg-white shadow-xs" />
          </button>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Field 1: Accounts (Bank) */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground flex items-center justify-between">
            <span>
              Accounts (Bank) <span className="text-rose-500">*</span>
            </span>
            <span className="text-[10.5px] text-muted-foreground italic font-normal">
              COA Bank Account
            </span>
          </label>
          <select
            value={accountsBankId}
            onChange={(e) => handleSelect(e.target.value)}
            disabled={loading}
            className={`w-full h-9 px-3 rounded-lg border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs cursor-pointer ${
              errors.accountsBankId ? 'border-rose-400 focus:ring-rose-500' : 'border-border'
            }`}
          >
            <option value="">-- Select Bank Account --</option>
            {bankAccounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.accountName} ({acc.bankName})
              </option>
            ))}
          </select>
          {errors.accountsBankId && (
            <p className="text-[11px] text-rose-500 font-medium">{errors.accountsBankId}</p>
          )}
        </div>

        {/* Field 2: Bank Name (Read-Only) */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Bank Name <span className="text-[10.5px] text-muted-foreground italic font-normal">(Auto-populated)</span>
          </label>
          <input
            type="text"
            readOnly
            value={bankName || '—'}
            className="w-full h-9 px-3 rounded-lg border border-border/80 bg-muted/40 text-xs font-semibold text-foreground outline-none cursor-not-allowed"
          />
        </div>

        {/* Field 3: GL Name (Read-Only) */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            GL Name <span className="text-[10.5px] text-muted-foreground italic font-normal">(COA Head)</span>
          </label>
          <input
            type="text"
            readOnly
            value={glName || '—'}
            className="w-full h-9 px-3 rounded-lg border border-border/80 bg-muted/40 text-xs font-semibold text-foreground outline-none cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );
};
