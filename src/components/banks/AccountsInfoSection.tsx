import React, { useState } from 'react';
import { BankAccountRef } from '../../types/bank';
import { AccountsInfoTable } from './AccountsInfoTable';
import { CoaBankAccountPicker } from './CoaBankAccountPicker';
import { Plus, Landmark } from 'lucide-react';

interface AccountsInfoSectionProps {
  accounts: BankAccountRef[];
  onAddAccount: (acc: BankAccountRef) => void;
  onRemoveAccount: (id: string) => void;
}

export const AccountsInfoSection: React.FC<AccountsInfoSectionProps> = ({
  accounts,
  onAddAccount,
  onRemoveAccount,
}) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const alreadyLinkedIds = accounts.map((a) => a.coaAccountId);

  return (
    <div className="space-y-3 pt-2 border-t border-border/80">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-foreground">Accounts Info.</label>
          <span className="text-[11px] font-medium text-muted-foreground">
            ({accounts.length} linked)
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsPickerOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50/60 dark:bg-indigo-950/40 hover:bg-indigo-100 hover:border-indigo-300 dark:hover:bg-indigo-950 transition-colors shadow-2xs cursor-pointer"
        >
          <Plus className="size-3.5" />
          <span>Add New++</span>
        </button>
      </div>

      {/* Table or Empty State */}
      {accounts.length === 0 ? (
        <div className="border border-dashed border-border rounded-xl p-8 text-center flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-900/20">
          <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-muted-foreground mb-2">
            <Landmark className="size-5" />
          </div>
          <p className="text-xs font-semibold text-foreground">No accounts linked yet</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 max-w-sm mb-3">
            Link Chart of Accounts with bank details to this branch to enable vouchers and cheque management.
          </p>
          <button
            type="button"
            onClick={() => setIsPickerOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-border text-xs font-semibold text-foreground bg-card hover:bg-muted/80 shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="size-3.5 text-indigo-600" />
            <span>Add New++</span>
          </button>
        </div>
      ) : (
        <AccountsInfoTable accounts={accounts} onRemoveAccount={onRemoveAccount} />
      )}

      {/* COA Bank Account Picker Modal */}
      <CoaBankAccountPicker
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        alreadyLinkedIds={alreadyLinkedIds}
        onSelectAccount={onAddAccount}
      />
    </div>
  );
};
