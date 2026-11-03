import React from 'react';
import { Link } from 'react-router-dom';
import type { VoucherType } from '../../types/voucherTemplate';
import { ChevronRight, RotateCcw, Save, ArrowLeft, Printer } from 'lucide-react';

interface CustomizerHeaderProps {
  voucherType: VoucherType;
  isDirty: boolean;
  onReset: () => void;
  onSave: () => void;
  onPrint?: () => void;
  saving?: boolean;
}

export const CustomizerHeader: React.FC<CustomizerHeaderProps> = ({
  voucherType,
  isDirty,
  onReset,
  onSave,
  onPrint,
  saving = false,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 font-sans">
      <div className="flex items-center gap-2 text-[13px] text-slate-500 font-medium">
        <Link
          to="/voucher-setup"
          className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Voucher Setup</span>
        </Link>
        <ChevronRight className="size-3 text-slate-400" />
        <span className="font-semibold text-slate-900">{voucherType} Voucher</span>
      </div>

      <div className="flex items-center gap-2.5">
        {onPrint && (
          <button
            type="button"
            onClick={onPrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[13px] font-medium shadow-2xs transition-all cursor-pointer"
          >
            <Printer className="size-3.5 text-slate-500" />
            <span>Print A4</span>
          </button>
        )}

        <button
          type="button"
          onClick={onReset}
          disabled={saving}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[13px] font-medium shadow-2xs transition-all cursor-pointer disabled:opacity-50"
        >
          <RotateCcw className="size-3.5 text-slate-400" />
          <span>Reset to Default</span>
        </button>

        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="relative inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50"
        >
          {isDirty && (
            <span className="absolute -top-1 -right-1 size-2.5 rounded-full bg-amber-400 ring-2 ring-white animate-pulse" />
          )}
          <Save className="size-3.5" />
          <span>{saving ? 'Saving...' : 'Save'}</span>
        </button>
      </div>
    </div>
  );
};


