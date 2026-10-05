import React, { useState } from 'react';
import { Branch } from '../../types/bank';
import { useNavigate } from 'react-router-dom';
import { Edit2, Copy, Trash2, MoreVertical, Landmark } from 'lucide-react';

interface BranchTableProps {
  branches: Branch[];
  onDuplicate: (branch: Branch) => void;
  onDelete: (branch: Branch) => void;
}

export const BranchTable: React.FC<BranchTableProps> = ({
  branches,
  onDuplicate,
  onDelete,
}) => {
  const navigate = useNavigate();
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-2xs">
      <table className="w-full text-left text-xs border-collapse">
        <thead className="bg-slate-50/80 dark:bg-slate-900/60 border-b border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          <tr>
            <th className="py-3 px-4">Bank</th>
            <th className="py-3 px-4">Branch</th>
            <th className="py-3 px-4">Address</th>
            <th className="py-3 px-4">Routing No.</th>
            <th className="py-3 px-4">SWIFT / BIC</th>
            <th className="py-3 px-4 text-center">Accounts</th>
            <th className="py-3 px-4 text-right w-16">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {branches.map((b) => (
            <tr
              key={b.id}
              className="hover:bg-slate-50/70 dark:hover:bg-slate-900/40 transition-colors group cursor-pointer"
              onClick={() => navigate(`/branches/${b.id}/edit`)}
            >
              {/* Bank Name + Alias Chip */}
              <td className="py-3 px-4 align-top">
                <div className="flex flex-col items-start gap-1">
                  <span className="font-semibold text-foreground group-hover:text-indigo-600 transition-colors">
                    {b.bankName}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {b.bankAlias}
                  </span>
                </div>
              </td>

              {/* Branch Name */}
              <td className="py-3 px-4 align-top font-semibold text-foreground">
                <div className="flex items-center gap-1.5">
                  <Landmark className="size-3.5 text-indigo-500 shrink-0" />
                  <span>{b.branchName}</span>
                </div>
              </td>

              {/* Address */}
              <td className="py-3 px-4 align-top text-muted-foreground max-w-xs truncate">
                {b.address || <span className="text-muted-foreground/50 italic">—</span>}
              </td>

              {/* Routing No */}
              <td className="py-3 px-4 align-top font-mono text-muted-foreground">
                {b.routingNo || <span className="text-muted-foreground/50 italic">—</span>}
              </td>

              {/* SWIFT / BIC */}
              <td className="py-3 px-4 align-top font-mono text-muted-foreground">
                {b.swiftCode ? (
                  <span className="px-1.5 py-0.5 rounded text-[10.5px] bg-slate-100 dark:bg-slate-800 text-foreground font-semibold">
                    {b.swiftCode}
                  </span>
                ) : (
                  <span className="text-muted-foreground/50 italic">—</span>
                )}
              </td>

              {/* Accounts Count Chip */}
              <td className="py-3 px-4 align-top text-center">
                <span
                  className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10.5px] font-bold ${
                    (b.accounts?.length || 0) > 0
                      ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                      : 'bg-slate-100 dark:bg-slate-800 text-muted-foreground'
                  }`}
                >
                  {b.accounts?.length || 0}
                </span>
              </td>

              {/* Actions */}
              <td
                className="py-3 px-4 align-top text-right relative"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => navigate(`/branches/${b.id}/edit`)}
                    title="Edit Branch"
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
                              navigate(`/branches/${b.id}/edit`);
                            }}
                            className="w-full px-3 py-1.5 text-left text-xs hover:bg-muted flex items-center gap-2 text-foreground cursor-pointer"
                          >
                            <Edit2 className="size-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onDuplicate(b);
                            }}
                            className="w-full px-3 py-1.5 text-left text-xs hover:bg-muted flex items-center gap-2 text-foreground cursor-pointer"
                          >
                            <Copy className="size-3" />
                            <span>Duplicate</span>
                          </button>
                          <div className="h-px bg-border/60 my-1" />
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onDelete(b);
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
          ))}
        </tbody>
      </table>
    </div>
  );
};
