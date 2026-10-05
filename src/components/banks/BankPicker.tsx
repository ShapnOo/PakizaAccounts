import React, { useState } from 'react';
import { Bank } from '../../types/bank';
import { useBankStore } from '../../stores/bankStore';
import { BankModal } from './BankModal';
import { Landmark, Plus } from 'lucide-react';

interface BankPickerProps {
  value?: string;
  selectedBankId?: string;
  banks?: Bank[];
  onChange: (bankId: string) => void;
  error?: string;
}

export const BankPicker: React.FC<BankPickerProps> = ({
  value,
  selectedBankId,
  banks: propBanks,
  onChange,
  error,
}) => {
  const store = useBankStore();
  const banks = propBanks || store.banks;
  const currentBankId = value !== undefined ? value : selectedBankId || '';

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBankCreated = (newBank: Bank) => {
    onChange(newBank.id);
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <Landmark className="size-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Select Bank</span>
          <span className="text-rose-500">*</span>
        </label>

        {/* Action: Add+ button */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 rounded-md border border-indigo-200 dark:border-indigo-800 transition-colors cursor-pointer shadow-2xs"
          title="Add a new bank to Bank Master"
        >
          <Plus className="size-3" />
          <span>Add+</span>
        </button>
      </div>

      <select
        value={currentBankId}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full h-9 px-3 rounded-lg border bg-background text-xs font-medium text-foreground outline-none transition-all cursor-pointer shadow-2xs ${
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

      {error && <p className="text-[11px] text-rose-500 font-medium">{error}</p>}

      {/* Modal triggered by Add+ */}
      <BankModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleBankCreated}
      />
    </div>
  );
};
