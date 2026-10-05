import React, { useState } from 'react';
import { PreparedCheque } from '../../types/cheque';
import { SourceTypeChip } from './SourceTypeChip';
import { useNavigate } from 'react-router-dom';
import { Printer, Eye, Ban, MoreVertical, FileText } from 'lucide-react';

interface RegisterTableProps {
  cheques: PreparedCheque[];
  onVoidCheque: (cheque: PreparedCheque) => void;
}

export const RegisterTable: React.FC<RegisterTableProps> = ({
  cheques,
  onVoidCheque,
}) => {
  const navigate = useNavigate();
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-2xs">
      <table className="w-full text-left text-xs border-collapse">
        <thead className="bg-slate-50/80 dark:bg-slate-900/60 border-b border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          <tr>
            <th className="py-3 px-3">Source Type</th>
            <th className="py-3 px-3" data-raw-label="Accoutns">Accounts</th>
            <th className="py-3 px-3">Bank</th>
            <th className="py-3 px-3">Book Name</th>
            <th className="py-3 px-3">Cheque For</th>
            <th className="py-3 px-3">Party Name</th>
            <th className="py-3 px-3 text-center">Type</th>
            <th className="py-3 px-3">Cheque No.</th>
            <th className="py-3 px-3">Cheque Date</th>
            <th className="py-3 px-3">Pay To</th>
            <th className="py-3 px-3 text-right">Amount (৳)</th>
            <th className="py-3 px-3">Voucher No.</th>
            <th className="py-3 px-3">Voucher Date</th>
            <th className="py-3 px-3 text-right w-14">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {cheques.map((c) => (
            <tr
              key={c.id}
              className="hover:bg-slate-50/70 dark:hover:bg-slate-900/40 transition-colors group"
            >
              {/* Source Type */}
              <td className="py-2.5 px-3 whitespace-nowrap">
                <SourceTypeChip type={c.sourceType} />
              </td>

              {/* Accounts */}
              <td className="py-2.5 px-3 font-mono font-medium text-foreground whitespace-nowrap">
                {c.accountsBankId}
              </td>

              {/* Bank */}
              <td className="py-2.5 px-3 font-semibold text-foreground whitespace-nowrap">
                {c.bankName}
              </td>

              {/* Book Name */}
              <td className="py-2.5 px-3 text-muted-foreground whitespace-nowrap">
                {c.bookName}
              </td>

              {/* Cheque For */}
              <td className="py-2.5 px-3 whitespace-nowrap">
                <span className="px-1.5 py-0.5 rounded text-[10.5px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                  {c.chequeFor}
                </span>
              </td>

              {/* Party Name */}
              <td className="py-2.5 px-3 font-medium text-foreground whitespace-nowrap max-w-[140px] truncate">
                {c.partyName}
              </td>

              {/* Cheque Type */}
              <td className="py-2.5 px-3 text-center whitespace-nowrap">
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border border-border bg-background">
                  {c.chequeType}
                </span>
              </td>

              {/* Cheque No */}
              <td className="py-2.5 px-3 font-mono font-bold text-foreground whitespace-nowrap">
                {c.chequeNo}
              </td>

              {/* Cheque Date */}
              <td className="py-2.5 px-3 font-mono text-muted-foreground whitespace-nowrap">
                {c.chequeDate}
              </td>

              {/* Pay To */}
              <td className="py-2.5 px-3 font-medium text-foreground whitespace-nowrap max-w-[140px] truncate">
                {c.payTo}
              </td>

              {/* Amount */}
              <td className="py-2.5 px-3 font-mono font-bold text-right text-foreground whitespace-nowrap">
                ৳{(c.amount || 0).toLocaleString()}
              </td>

              {/* Voucher No */}
              <td className="py-2.5 px-3 font-mono text-xs text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                {c.id ? `VCH-${c.id.slice(-6).toUpperCase()}` : '—'}
              </td>

              {/* Voucher Date */}
              <td className="py-2.5 px-3 font-mono text-muted-foreground whitespace-nowrap">
                {c.voucherDate || c.chequeDate || '—'}
              </td>

              {/* Actions */}
              <td className="py-2.5 px-3 text-right whitespace-nowrap relative">
                <div className="flex items-center justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => navigate(`/cheques/${c.id}/print`)}
                    title="Print Cheque Layout"
                    className="p-1 text-muted-foreground hover:text-indigo-600 rounded transition-colors cursor-pointer"
                  >
                    <Printer className="size-3.5" />
                  </button>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveMenuId(activeMenuId === c.id ? null : c.id)
                      }
                      title="More actions"
                      className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      <MoreVertical className="size-3.5" />
                    </button>

                    {activeMenuId === c.id && (
                      <>
                        <div
                          className="fixed inset-0 z-20"
                          onClick={() => setActiveMenuId(null)}
                        />
                        <div className="absolute right-0 mt-1 w-36 bg-card rounded-lg border border-border shadow-lg py-1 z-30 animate-in fade-in-50 zoom-in-95">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              navigate(`/cheques/${c.id}/print`);
                            }}
                            className="w-full px-3 py-1.5 text-left text-xs hover:bg-muted flex items-center gap-2 text-foreground cursor-pointer"
                          >
                            <Printer className="size-3" />
                            <span>Cheque Print</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              window.print();
                            }}
                            className="w-full px-3 py-1.5 text-left text-xs hover:bg-muted flex items-center gap-2 text-foreground cursor-pointer"
                          >
                            <FileText className="size-3" />
                            <span>Voucher Print</span>
                          </button>

                          <div className="h-px bg-border/60 my-1" />

                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onVoidCheque(c);
                            }}
                            className="w-full px-3 py-1.5 text-left text-xs hover:bg-rose-50 dark:hover:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center gap-2 cursor-pointer"
                          >
                            <Ban className="size-3" />
                            <span>Void Cheque</span>
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
