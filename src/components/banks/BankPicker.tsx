import React from 'react';
import { Bank } from '../../types/bank';
import { Landmark, Plus } from 'lucide-react';

interface BankPickerProps {
  banks: Bank[];
  selectedBankId: string;
  onChange: (bankId: string) => void;
  onOpenAddModal: () => void;
  error?: string;
}

export const BankPicker: React.FC<BankPickerProps> = ({
  banks,
  selectedBankId,
  onChange,
  onOpenAddModal,
  error,
}) => {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[12px] font-bold text-foreground flex items-center gap-1.5">
          <Landmark className="size-3.5 text-indigo-600" />
          <span>Bank Name</span>
          <span className="text-rose-500">*</span>
        </label>

        {/* Action: Add+ button */}
        <button
          type="button"
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 rounded-md border border-indigo-200 dark:border-indigo-800 transition-colors cursor-pointer"
          title="Add a new bank to Bank Master"
        >
          <Plus className="size-3" />
          <span>Add+</span>
        </button>
      </div>

      <select
        value={selectedBankId}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full h-9 px-3 rounded-lg border bg-background text-xs font-semibold text-foreground outline-none transition-all cursor-pointer shadow-2xs ${
          error
            ? 'border-rose-400 focus:ring-1 focus:ring-rose-500'
            : 'border-border focus:ring-1 focus:ring-indigo-500'
        }`}
      >
        <option value="">-- Select Bank Entity --</option>
        {banks.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name} ({b.alias})
          </option>
        ))}
      </select>

      {error && (
        <p className="text-[11px] text-rose-500 font-medium">{error}</p>
      )}
    </div>
  );
};
