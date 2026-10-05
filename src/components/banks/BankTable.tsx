import React, { useState } from 'react';
import { Bank } from '../../types/bank';
import { Building2, Trash2, MoreVertical, Edit2 } from 'lucide-react';

interface BankTableProps {
  banks: Bank[];
  branchCounts: Record<string, number>;
  onEditBank: (bank: Bank) => void;
  onDeleteBank: (bank: Bank) => void;
}

export const BankTable: React.FC<BankTableProps> = ({
  banks,
  branchCounts,
  onEditBank,
  onDeleteBank,
}) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-2xs">
      <table className="w-full text-left text-xs border-collapse">
        <thead className="bg-slate-50/80 dark:bg-slate-900/60 border-b border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          <tr>
            <th className="py-3 px-4">Bank Name</th>
            <th className="py-3 px-4">Alias</th>
            <th className="py-3 px-4 text-center">Branches</th>
            <th className="py-3 px-4 text-right w-16">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {banks.map((b) => {
            const numBranches = branchCounts[b.id] || 0;

            return (
              <tr
                key={b.id}
                className="hover:bg-slate-50/70 dark:hover:bg-slate-900/40 transition-colors group"
              >
                {/* Bank Name */}
                <td className="py-3 px-4 align-middle">
                  <div className="flex items-center gap-2">
                    <div className="size-7 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                      <Building2 className="size-3.5" />
                    </div>
                    <span className="font-semibold text-foreground text-xs">{b.name}</span>
                  </div>
                </td>

                {/* Alias */}
                <td className="py-3 px-4 align-middle">
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                    {b.alias}
                  </span>
                </td>

                {/* # Branches */}
                <td className="py-3 px-4 align-middle text-center">
                  <span
                    className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10.5px] font-bold ${
                      numBranches > 0
                        ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-slate-100 dark:bg-slate-800 text-muted-foreground'
                    }`}
                  >
                    {numBranches} {numBranches === 1 ? 'branch' : 'branches'}
                  </span>
                </td>

                {/* Actions */}
                <td className="py-3 px-4 align-middle text-right relative">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onEditBank(b)}
                      title="Edit Bank"
                      className="p-1 rounded text-muted-foreground hover:text-indigo-600 hover:bg-muted transition-colors cursor-pointer"
                    >
                      <Edit2 className="size-3.5" />
                    </button>

                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveMenuId(activeMenuId === b.id ? null : b.id)
                        }
                        title="More actions"
                        className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                      >
                        <MoreVertical className="size-3.5" />
                      </button>

                      {activeMenuId === b.id && (
                        <>
                          <div
                            className="fixed inset-0 z-20"
                            onClick={() => setActiveMenuId(null)}
                          />
                          <div className="absolute right-0 mt-1 w-32 bg-card rounded-lg border border-border shadow-lg py-1 z-30 animate-in fade-in-50 zoom-in-95">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuId(null);
                                onEditBank(b);
                              }}
                              className="w-full px-3 py-1.5 text-left text-xs hover:bg-muted flex items-center gap-2 text-foreground cursor-pointer"
                            >
                              <Edit2 className="size-3" />
                              <span>Edit</span>
                            </button>
                            <div className="h-px bg-border/60 my-1" />
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuId(null);
                                onDeleteBank(b);
                              }}
                              className="w-full px-3 py-1.5 text-left text-xs hover:bg-rose-50 dark:hover:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center gap-2 cursor-pointer"
                            >
                              <Trash2 className="size-3" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
