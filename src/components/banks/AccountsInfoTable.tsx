import React from 'react';
import { BankAccountRef } from '../../types/bank';
import { Trash2 } from 'lucide-react';

interface AccountsInfoTableProps {
  accounts: BankAccountRef[];
  onRemoveAccount: (id: string) => void;
}

export const AccountsInfoTable: React.FC<AccountsInfoTableProps> = ({
  accounts,
  onRemoveAccount,
}) => {
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
        return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          <tr>
            <th className="py-2.5 px-3.5 w-32">Accounts Type</th>
            <th className="py-2.5 px-3.5 text-right w-44">Accounts Number</th>
            <th className="py-2.5 px-3.5">Accounts Name</th>
            <th className="py-2.5 px-3 w-14 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {accounts.map((acc, index) => (
            <tr
              key={acc.id || acc.coaAccountId || index}
              className={`h-10 hover:bg-slate-50/70 dark:hover:bg-slate-900/40 transition-colors ${
                index % 2 === 1 ? 'bg-slate-50/30 dark:bg-slate-900/20' : 'bg-background'
              }`}
            >
              <td className="py-2 px-3.5 whitespace-nowrap">
                <span
                  className={`inline-flex items-center text-[10.5px] font-bold px-2 py-0.5 rounded-full border ${getTypeChipColor(
                    acc.accountsType
                  )}`}
                >
                  {acc.accountsType}
                </span>
              </td>
              <td className="py-2 px-3.5 text-right font-mono font-medium text-foreground tracking-wide whitespace-nowrap">
                {acc.accountsNumber}
              </td>
              <td className="py-2 px-3.5 font-medium text-foreground truncate max-w-xs">
                {acc.accountsName}
              </td>
              <td className="py-2 px-3 text-center whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => onRemoveAccount(acc.id)}
                  title="Remove account from branch"
                  className="p-1 text-muted-foreground hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded transition-colors cursor-pointer"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
