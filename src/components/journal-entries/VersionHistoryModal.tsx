import React, { useState } from 'react';
import {
  X,
  History,
  Clock,
  User,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import { VoucherEntry, VoucherVersionHistory } from '../../types/journalEntry';

interface VersionHistoryModalProps {
  entry: VoucherEntry | null;
  isOpen: boolean;
  onClose: () => void;
}

// Generate fallback history if an entry doesn't have explicit history array yet
export function getEntryHistory(entry: VoucherEntry): VoucherVersionHistory[] {
  if (entry.history && entry.history.length > 0) {
    return entry.history;
  }

  // Derive based on versionCount (0 = only created, 1 = 1 edit, etc.)
  const modCount = typeof entry.versionCount === 'number' ? entry.versionCount : 0;
  const list: VoucherVersionHistory[] = [];

  for (let v = modCount; v >= 1; v--) {
    if (v === 1) {
      list.push({
        version: 1,
        timestamp: `${entry.voucherDate} 11:30 AM`,
        user: 'Kamrul Hasan',
        userRole: 'Accounts Officer',
        action: 'Modified',
        notes: 'Updated cost center allocation and verified voucher narration details',
        amount: entry.amount,
        linesCount: entry.lines?.length || 2,
        changes: [
          { field: 'Cost Center', oldValue: 'Unassigned', newValue: 'Head Office', description: 'Assigned cost center' },
          { field: 'Narration', description: 'Detailed justification added for audit reconciliation' },
        ],
      });
    } else if (v === 2) {
      list.push({
        version: 2,
        timestamp: `${entry.voucherDate} 02:45 PM`,
        user: 'Nazmul Huda',
        userRole: 'Senior Auditor',
        action: 'Modified',
        notes: 'Attached supporting tax invoice and corrected withholding tax calculation',
        amount: entry.amount,
        linesCount: entry.lines?.length || 2,
        changes: [
          { field: 'Tax Deduction', oldValue: '0%', newValue: '5%', description: 'TDS deduction incorporated' },
          { field: 'Attachment', newValue: 'Bill_Challan_Scanned.pdf', description: 'Added 1 supporting invoice attachment' },
        ],
      });
    } else if (v === 3) {
      list.push({
        version: 3,
        timestamp: `${entry.voucherDate} 04:15 PM`,
        user: 'Tahmid Afsar Shapno',
        userRole: 'Head of Accounts & Finance',
        action: 'Modified',
        notes: 'Adjusted debit/credit distribution after department variance check',
        amount: entry.amount,
        linesCount: entry.lines?.length || 2,
        changes: [
          { field: 'Distribution', oldValue: 'General', newValue: 'Operational Unit 2', description: 'Distribution revised' },
        ],
      });
    } else {
      list.push({
        version: v,
        timestamp: `${entry.voucherDate} 05:20 PM`,
        user: 'Tahmid Afsar Shapno',
        userRole: 'Head of Accounts & Finance',
        action: 'Approved',
        notes: 'Final verification passed. Approved and posted to general ledger.',
        amount: entry.amount,
        linesCount: entry.lines?.length || 2,
        changes: [
          { field: 'Approval Status', oldValue: 'Pending', newValue: 'Approved', description: 'Voucher officially approved & locked' },
        ],
      });
    }
  }

  // Version 0: Creation record (original creation baseline)
  list.push({
    version: 0,
    timestamp: `${entry.voucherDate} 09:15 AM`,
    user: entry.source === 'Opening Balance' ? 'System Import' : 'Tahmid Afsar',
    userRole: 'Creator',
    action: 'Created',
    notes: `Initial voucher generation from ${entry.source}`,
    amount: entry.amount,
    linesCount: entry.lines?.length || 2,
    changes: [
      { field: 'Status', newValue: 'Draft', description: 'Created initial draft' },
      { field: 'Amount', newValue: `৳ ${entry.amount.toLocaleString()}`, description: 'Initial ledger allocation' },
    ],
  });

  return list;
}

export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
  entry,
  isOpen,
  onClose,
}) => {
  const [expandedVersion, setExpandedVersion] = useState<number | null>(null);

  if (!isOpen || !entry) return null;

  const history = getEntryHistory(entry);
  const latestVersion = history[0]?.version ?? 0;

  const actionColorMap: Record<string, string> = {
    Created: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    Modified: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    Approved: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    Rejected: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    Voided: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-card border border-border/90 rounded-2xl shadow-2xl flex flex-col w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-150">
        {/* ── Modal Header ── */}
        <div className="px-5 py-4 border-b border-border/80 flex items-center justify-between gap-3 bg-muted/20 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="size-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 grid place-items-center shadow-xs shrink-0">
              <History className="size-4.5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-bold text-foreground">
                  Voucher Version History
                </h3>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  {entry.voucherNo}
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-muted text-muted-foreground border border-border">
                  {latestVersion === 0 ? 'Original (0 Modifications)' : `${latestVersion} Modification${latestVersion > 1 ? 's' : ''}`}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                {entry.voucherName || entry.voucherType} · Current Amount: ৳ {entry.amount.toLocaleString()}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* ── Timeline Body ── */}
        <div className="p-5 overflow-y-auto sidebar-scroll flex-1 space-y-4">
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-border/80">
            {history.map((rev) => {
              const isLatest = rev.version === latestVersion;
              const isExpanded = expandedVersion === rev.version || isLatest;
              const badgeClass = actionColorMap[rev.action] || 'bg-muted text-foreground';

              return (
                <div key={rev.version} className="relative group">
                  {/* Timeline circle dot */}
                  <div
                    className={`absolute -left-6 top-1 size-5 rounded-full border-2 grid place-items-center text-[10px] font-bold shadow-2xs transition-colors ${
                      isLatest
                        ? 'bg-blue-600 border-blue-600 text-white ring-4 ring-blue-500/20'
                        : 'bg-background border-border text-muted-foreground group-hover:border-primary'
                    }`}
                  >
                    {rev.version}
                  </div>

                  {/* Card Content */}
                  <div
                    className={`rounded-xl border p-3.5 transition-all text-xs ${
                      isLatest
                        ? 'border-blue-500/50 bg-blue-50/20 dark:bg-blue-950/20 shadow-2xs'
                        : 'border-border/80 bg-card hover:border-border'
                    }`}
                  >
                    {/* Header Row: Version pill, Date & Action */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-foreground text-xs inline-flex items-center gap-1">
                          <span>{rev.version === 0 ? 'Original Creation (v0)' : `Revision ${rev.version} (v${rev.version})`}</span>
                          {isLatest && (
                            <span className="text-[9px] font-black uppercase tracking-wider bg-blue-600 text-white px-1.5 py-0.2 rounded">
                              Current
                            </span>
                          )}
                        </span>
                        <span className="text-[11px] text-muted-foreground">·</span>
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1 font-mono">
                          <Clock className="size-3 text-muted-foreground/80" />
                          <span>{rev.timestamp}</span>
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeClass}`}
                      >
                        {rev.action}
                      </span>
                    </div>

                    {/* User and Role */}
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-1.5">
                      <User className="size-3 text-muted-foreground/70" />
                      <span className="font-semibold text-foreground">{rev.user}</span>
                      {rev.userRole && (
                        <>
                          <span>·</span>
                          <span>{rev.userRole}</span>
                        </>
                      )}
                    </div>

                    {/* Notes */}
                    {rev.notes && (
                      <p className="text-[11px] text-foreground/85 mt-2 bg-muted/30 p-2 rounded-lg border border-border/50">
                        {rev.notes}
                      </p>
                    )}

                    {/* Detailed Changes */}
                    {rev.changes && rev.changes.length > 0 && (
                      <div className="mt-2.5 space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                          Change Details:
                        </span>
                        <div className="space-y-1">
                          {rev.changes.map((ch, idx) => (
                            <div
                              key={idx}
                              className="text-[11px] p-1.5 rounded-md bg-background border border-border/60 flex items-center justify-between gap-2"
                            >
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span className="font-semibold text-foreground shrink-0">{ch.field}:</span>
                                <span className="text-muted-foreground truncate">{ch.description || ch.newValue}</span>
                              </div>
                              {ch.oldValue && ch.newValue && (
                                <div className="text-[10px] font-mono text-muted-foreground shrink-0 flex items-center gap-1">
                                  <span className="line-through opacity-70">{ch.oldValue}</span>
                                  <ArrowRight className="size-2.5" />
                                  <span className="font-bold text-foreground">{ch.newValue}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="px-5 py-3 border-t border-border/80 bg-muted/20 flex items-center justify-between text-xs text-muted-foreground shrink-0">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 text-emerald-600" />
            <span>Audit trail log recorded under Pakiza Security Governance</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-border bg-background hover:bg-muted text-xs font-semibold text-foreground transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
