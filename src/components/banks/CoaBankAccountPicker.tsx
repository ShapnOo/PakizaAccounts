import React, { useState, useEffect } from 'react';
import { listCoaBankAccounts } from '../../services/coaBankAccountsService';
import { CoaBankAccount } from '../../mock/coaBankAccounts';
import { BankAccountRef } from '../../types/bank';
import { Landmark, Search, Check, X, ShieldAlert } from 'lucide-react';

interface CoaBankAccountPickerProps {
  isOpen: boolean;
  onClose: () => void;
  alreadyLinkedIds: string[];
  onSelectAccount: (ref: BankAccountRef) => void;
}

export const CoaBankAccountPicker: React.FC<CoaBankAccountPickerProps> = ({
  isOpen,
  onClose,
  alreadyLinkedIds,
  onSelectAccount,
}) => {
  const [accounts, setAccounts] = useState<CoaBankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const fetchCoaBanks = async () => {
      setLoading(true);
      try {
        const data = await listCoaBankAccounts();
        setAccounts(data);
      } catch (e) {
        // fallback
      } finally {
        setLoading(false);
      }
    };
    fetchCoaBanks();
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = accounts.filter(
    (a) =>
      a.accountName.toLowerCase().includes(search.toLowerCase()) ||
      a.accountsNumber.includes(search) ||
      a.bankName.toLowerCase().includes(search.toLowerCase())
  );

  const handlePick = (acc: CoaBankAccount) => {
    if (alreadyLinkedIds.includes(acc.id)) return;

    const ref: BankAccountRef = {
      id: `ref-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      coaAccountId: acc.id,
      accountsType: acc.accountsType,
      accountsNumber: acc.accountsNumber,
      accountsName: acc.accountName,
    };

    onSelectAccount(ref);
    onClose();
  };

  const getTypeChipColor = (type: string) => {
    switch (type.toUpperCase()) {
      case 'CD':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300';
      case 'SB':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300';
      case 'CC':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300';
      case 'OD':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-card w-full max-w-lg rounded-2xl border border-border shadow-2xl p-5 space-y-4 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-border/60 shrink-0">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Landmark className="size-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">
                Select Chart of Accounts (COA) Bank Account
              </h4>
              <p className="text-[11px] text-muted-foreground">
                Only COA accounts configured with Bank Details Type appear here
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Search */}
        <div className="relative shrink-0">
          <Search className="size-4 text-muted-foreground absolute left-3 top-2.5" />
          <input
            type="text"
            autoFocus
            placeholder="Search by account name, number, or bank..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs"
          />
        </div>

        {/* Account List */}
        <div className="flex-1 overflow-y-auto sidebar-scroll space-y-2 pr-1 min-h-[200px]">
          {loading ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              Loading COA bank accounts...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground">No accounts found</p>
              <p>Create bank accounts in Chart of Accounts with Details Type = "Bank".</p>
            </div>
          ) : (
            filtered.map((acc) => {
              const isAlreadyLinked = alreadyLinkedIds.includes(acc.id);

              return (
                <div
                  key={acc.id}
                  onClick={() => !isAlreadyLinked && handlePick(acc)}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                    isAlreadyLinked
                      ? 'bg-muted/40 border-border/40 opacity-60 cursor-not-allowed'
                      : 'bg-card border-border/80 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-xs cursor-pointer'
                  }`}
                >
                  <div className="space-y-1 min-w-0 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-foreground truncate">
                        {acc.accountName}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getTypeChipColor(
                          acc.accountsType
                        )}`}
                      >
                        {acc.accountsType}
                      </span>
                    </div>

                    <div className="text-[11px] font-mono text-muted-foreground">
                      A/C No: <strong className="text-foreground">{acc.accountsNumber}</strong>
                    </div>

                    {acc.parentPath && acc.parentPath.length > 0 && (
                      <div className="text-[10px] text-muted-foreground/80 truncate">
                        {acc.parentPath.join(' › ')}
                      </div>
                    )}
                  </div>

                  <div className="shrink-0">
                    {isAlreadyLinked ? (
                      <span className="text-[10.5px] font-semibold text-muted-foreground flex items-center gap-1">
                        <Check className="size-3" />
                        <span>Linked</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="px-2.5 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 rounded-lg hover:bg-indigo-100 transition-colors"
                      >
                        Select
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-2 border-t border-border/60 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg border border-border text-xs font-bold text-muted-foreground hover:bg-muted cursor-pointer transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
