import React from 'react';
import { RotateCcw, Printer } from 'lucide-react';

interface SetupListHeaderProps {
  onResetAll: () => void;
  loading?: boolean;
}

export const SetupListHeader: React.FC<SetupListHeaderProps> = ({
  onResetAll,
  loading = false,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 font-sans">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-2xs">
          <Printer className="size-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Voucher Setup
          </h1>
          <p className="text-[13px] text-slate-500">
            Choose print template per voucher type (Standard, Minimal, Clean Grid, Framed Ledger)
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onResetAll}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[13px] font-medium shadow-2xs transition-all cursor-pointer disabled:opacity-50"
        >
          <RotateCcw className="size-3.5 text-slate-400" />
          <span>Reset All to Defaults</span>
        </button>
      </div>
    </div>
  );
};

