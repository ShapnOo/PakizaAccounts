import { Link } from 'react-router-dom';
import {
  X,
  Pencil,
  Copy,
  BookOpen,
  Layers,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { JournalPreset } from '../../types/presetJournal';
import { VoucherTypeChip } from './VoucherTypeChip';
import { formatRelativeTime } from './UsageCounter';

interface PreviewPanelProps {
  preset: JournalPreset | null;
  onClose: () => void;
  onDuplicate: (id: string) => void;
}

export function PreviewPanel({
  preset,
  onClose,
  onDuplicate,
}: PreviewPanelProps) {
  if (!preset) return null;

  const totalDebit = preset.lines.reduce((s, l) => s + (l.debitBDT ?? l.debit ?? 0), 0);
  const totalCredit = preset.lines.reduce((s, l) => s + (l.creditBDT ?? l.credit ?? 0), 0);

  return (
    <div className="rounded-2xl border border-border bg-card shadow-lg p-4 space-y-4 flex flex-col h-full sticky top-4 animate-in fade-in-50 slide-in-from-right-4 duration-200">
      {/* Header */}
      <div className="flex items-start justify-between pb-3 border-b border-border/60">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <VoucherTypeChip type={preset.voucherType} size="sm" />
            <span className="text-[10px] font-mono text-muted-foreground">
              {preset.lines.length} lines
            </span>
          </div>
          <h3 className="text-base font-bold text-foreground">
            {preset.profileName}
          </h3>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Usage Stats Strip */}
      <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-muted/40 text-xs">
        <div>
          <span className="text-[10px] uppercase font-bold text-muted-foreground block">
            Usage Count
          </span>
          <span className="font-mono font-bold text-foreground flex items-center gap-1 mt-0.5">
            <TrendingUp className="size-3 text-emerald-600" />
            <span>{preset.usageCount} times loaded</span>
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-muted-foreground block">
            Last Used
          </span>
          <span className="font-mono font-medium text-foreground flex items-center gap-1 mt-0.5">
            <Clock className="size-3 text-muted-foreground" />
            <span>{formatRelativeTime(preset.lastUsedAt)}</span>
          </span>
        </div>
      </div>

      {/* Line Items Table Preview */}
      <div className="space-y-1.5 flex-1 min-h-0">
        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">
          Template Lines Preview
        </label>
        <div className="rounded-xl border border-border overflow-hidden max-h-64 overflow-y-auto sidebar-scroll">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/70 text-muted-foreground uppercase text-[10px] font-bold border-b border-border">
              <tr>
                <th className="px-2.5 py-1.5">Account Head</th>
                <th className="px-2.5 py-1.5 text-right">Debit</th>
                <th className="px-2.5 py-1.5 text-right">Credit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {preset.lines.map((line, idx) => (
                <tr key={line.id || idx} className="hover:bg-muted/30">
                  <td className="px-2.5 py-2">
                    <p className="font-semibold text-foreground truncate max-w-[140px]">
                      {line.accountHeadName || line.accountHeadId}
                    </p>
                    {line.description && (
                      <p className="text-[10px] text-muted-foreground truncate max-w-[140px]">
                        {line.description}
                      </p>
                    )}
                  </td>
                  <td className="px-2.5 py-2 text-right font-mono text-foreground font-medium">
                    {line.debitBDT ? Number(line.debitBDT).toLocaleString('en-BD') : '—'}
                  </td>
                  <td className="px-2.5 py-2 text-right font-mono text-foreground font-medium">
                    {line.creditBDT ? Number(line.creditBDT).toLocaleString('en-BD') : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-muted/40 font-mono text-[11px] font-bold border-t border-border">
              <tr>
                <td className="px-2.5 py-1.5 text-right text-muted-foreground">
                  Total:
                </td>
                <td className="px-2.5 py-1.5 text-right text-emerald-600 dark:text-emerald-400">
                  {totalDebit.toLocaleString('en-BD')}
                </td>
                <td className="px-2.5 py-1.5 text-right text-emerald-600 dark:text-emerald-400">
                  {totalCredit.toLocaleString('en-BD')}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Narration */}
      {preset.narration && (
        <div className="p-2.5 rounded-xl bg-muted/30 border border-border/50 text-xs space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block">
            Default Narration:
          </span>
          <p className="text-foreground text-[11px]">{preset.narration}</p>
        </div>
      )}

      {/* Actions */}
      <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onDuplicate(preset.id)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-all cursor-pointer"
        >
          <Copy className="size-3.5" />
          <span>Duplicate</span>
        </button>

        <div className="flex items-center gap-2">
          <Link
            to={`/preset-journal/${preset.id}/edit`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100/60 transition-all cursor-pointer"
          >
            <Pencil className="size-3.5" />
            <span>Edit</span>
          </Link>

          <Link
            to={`/journal-entries/new?type=${preset.voucherType}&presetId=${preset.id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all shadow-xs cursor-pointer"
          >
            <BookOpen className="size-3.5" />
            <span>Use in Entry</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
