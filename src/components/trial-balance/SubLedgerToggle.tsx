import React from 'react';
import { Tag } from 'lucide-react';

interface SubLedgerToggleProps {
  checked: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export const SubLedgerToggle: React.FC<SubLedgerToggleProps> = ({
  checked,
  onToggle,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onToggle}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition cursor-pointer select-none font-sans shadow-2xs ${
        checked
          ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold'
          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      title="Toggle Sub-Ledger party/vehicle tag column"
    >
      <Tag className={`size-3.5 ${checked ? 'text-indigo-600' : 'text-slate-400'}`} />
      <span>Sub-Ledger</span>
      <span
        className={`w-2 h-2 rounded-full ${
          checked ? 'bg-indigo-600' : 'bg-slate-300'
        }`}
      />
    </button>
  );
};
