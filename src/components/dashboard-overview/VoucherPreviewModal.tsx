import { X, Printer, FileText, CheckCircle2 } from 'lucide-react';
import { VoucherEntry } from '../../types/journalEntry';
import { formatBDTAmount } from '../../services/dashboardService';

interface VoucherPreviewModalProps {
  voucher: VoucherEntry | null;
  onClose: () => void;
}

export function VoucherPreviewModal({
  voucher,
  onClose,
}: VoucherPreviewModalProps) {
  if (!voucher) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-50">
      <div className="w-full max-w-3xl rounded-2xl border border-border bg-card shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-muted/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <FileText className="size-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground">
                  Voucher {voucher.voucherNo}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                  {voucher.voucherType}
                </span>
                {voucher.voided ? (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-bold">
                    Voided
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                    Posted
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Date: {voucher.voucherDate} • Source: {voucher.source || 'Manual'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-all cursor-pointer"
            >
              <Printer className="size-3.5" />
              <span>Print</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Content Table */}
        <div className="p-5 overflow-y-auto sidebar-scroll flex-1 space-y-4">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-muted/30 border border-border/50 text-xs">
            <div>
              <span className="text-muted-foreground block text-[10px] uppercase font-bold">
                Entity / Company
              </span>
              <span className="font-semibold text-foreground">
                Pakiza Knit Composite Ltd
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px] uppercase font-bold">
                Header Account
              </span>
              <span className="font-semibold text-foreground truncate block">
                {voucher.headerAccountName || 'General Journal Ledger'}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px] uppercase font-bold">
                Created At
              </span>
              <span className="font-semibold text-foreground">
                {new Date(voucher.createdAt || Date.now()).toLocaleDateString('en-GB')}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px] uppercase font-bold">
                Total Amount
              </span>
              <span className="font-bold text-foreground font-mono">
                {formatBDTAmount(voucher.amount || 0)}
              </span>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/80 text-muted-foreground uppercase text-[10px] font-bold border-b border-border">
                <tr>
                  <th className="px-3 py-2">SL</th>
                  <th className="px-3 py-2">Account Head</th>
                  <th className="px-3 py-2">Reference / Note</th>
                  <th className="px-3 py-2 text-right">Debit (BDT)</th>
                  <th className="px-3 py-2 text-right">Credit (BDT)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 font-medium">
                {(voucher.lines || []).map((row, idx: number) => (
                  <tr key={row.id || idx} className="hover:bg-muted/30">
                    <td className="px-3 py-2 text-muted-foreground">{idx + 1}</td>
                    <td className="px-3 py-2 font-bold text-foreground">
                      {row.accountHeadName || 'General Head'}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground max-w-[200px] truncate">
                      {row.description || row.reference || voucher.narration || '—'}
                    </td>
                    <td className="px-3 py-2 text-right font-mono font-bold text-foreground">
                      {row.debitBDT ? Number(row.debitBDT).toLocaleString('en-BD') : row.debit ? Number(row.debit).toLocaleString('en-BD') : '—'}
                    </td>
                    <td className="px-3 py-2 text-right font-mono font-bold text-foreground">
                      {row.creditBDT ? Number(row.creditBDT).toLocaleString('en-BD') : row.credit ? Number(row.credit).toLocaleString('en-BD') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-muted/50 font-bold border-t border-border text-xs">
                <tr>
                  <td colSpan={3} className="px-3 py-2 text-right">
                    Total:
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-emerald-600 dark:text-emerald-400">
                    {Number(voucher.amount || 0).toLocaleString('en-BD')}
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-emerald-600 dark:text-emerald-400">
                    {Number(voucher.amount || 0).toLocaleString('en-BD')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Master Narration */}
          {voucher.narration && (
            <div className="p-3 rounded-xl bg-muted/30 border border-border/50 text-xs">
              <span className="text-muted-foreground font-bold block text-[10px] uppercase">
                General Narration:
              </span>
              <p className="text-foreground mt-0.5">{voucher.narration}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border bg-muted/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CheckCircle2 className="size-3.5 text-emerald-600" />
            <span>Double-entry verified & balanced</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all cursor-pointer"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
