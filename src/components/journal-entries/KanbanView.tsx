import React from 'react';
import { Link } from 'react-router-dom';
import {
  Paperclip,
  Calendar,
  Layers,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
} from 'lucide-react';
import {
  VoucherEntry,
  VoucherType,
  VOUCHER_NAMES,
  VOUCHER_TYPE_CONFIG,
} from '../../types/journalEntry';
import { useCurrencyStore } from '../../stores/currencyStore';
import { RowActionsMenu } from './RowActionsMenu';

interface KanbanViewProps {
  entries: VoucherEntry[];
  onOpenAttachment: (entry: VoucherEntry) => void;
  onToggleVoid: (id: string) => void;
}

export const KanbanView: React.FC<KanbanViewProps> = ({
  entries,
  onOpenAttachment,
  onToggleVoid,
}) => {
  const { rates, setups } = useCurrencyStore();
  const baseRate = rates.find((r) => r.isBase);
  const baseSetup = setups.find((s) => s.id === baseRate?.currencyId);
  const baseSymbol = baseSetup?.symbol || '৳';

  // Group entries by Voucher Name (#30)
  const groups = React.useMemo(() => {
    const map = new Map<string, VoucherEntry[]>();

    // 1. Initialize known voucher names
    VOUCHER_NAMES.forEach((vn) => {
      map.set(vn.name, []);
    });

    // 2. Populate entries into their voucher name group
    entries.forEach((e) => {
      const vName = e.voucherName || VOUCHER_TYPE_CONFIG[e.voucherType]?.label || e.voucherType;
      if (!map.has(vName)) {
        map.set(vName, []);
      }
      map.get(vName)!.push(e);
    });

    // 3. Return columns (only keep groups that have entries or are top standard voucher names)
    return Array.from(map.entries())
      .filter(([name, colEntries]) => colEntries.length > 0 || VOUCHER_NAMES.some((vn) => vn.name === name).valueOf())
      .map(([name, colEntries]) => {
        const matchedOption = VOUCHER_NAMES.find((v) => v.name === name);
        const type: VoucherType = matchedOption?.type || (colEntries[0]?.voucherType || 'Journal');
        const cfg = VOUCHER_TYPE_CONFIG[type];
        return {
          voucherName: name,
          voucherType: type,
          shortCode: matchedOption?.shortCode || cfg.shortCode,
          color: cfg.color,
          colEntries,
        };
      });
  }, [entries]);

  return (
    <div className="flex flex-row overflow-x-auto gap-4 pb-4 w-full min-w-full sidebar-scroll items-start min-h-[500px]">
      {groups.map((group) => {
        const colTotal = group.colEntries
          .filter((e) => !e.voided)
          .reduce((sum, e) => sum + e.amount, 0);

        return (
          <div
            key={group.voucherName}
            className="w-[320px] shrink-0 flex flex-col rounded-2xl border border-border/80 bg-muted/20 shadow-2xs overflow-hidden"
          >
            {/* Column Header */}
            <div className="p-3 bg-card border-b border-border flex items-center justify-between gap-2 select-none">
              <div className="flex items-center gap-2 min-w-0">
                <span className={`size-2.5 rounded-full shrink-0 ${group.color.bg}`} />
                <h3
                  className="text-xs font-bold text-foreground truncate"
                  title={group.voucherName}
                >
                  {group.voucherName}
                </h3>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-muted text-muted-foreground border border-border/80 shrink-0">
                  {group.colEntries.length}
                </span>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[11px] font-mono font-bold text-foreground">
                  {baseSymbol}{' '}
                  {colTotal >= 1000000
                    ? `${(colTotal / 1000000).toFixed(2)}M`
                    : colTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Cards List */}
            <div className="p-2.5 space-y-2.5 max-h-[72vh] overflow-y-auto sidebar-scroll">
              {group.colEntries.length === 0 ? (
                <div className="py-8 px-4 text-center rounded-xl border border-dashed border-border/70 text-xs text-muted-foreground">
                  No vouchers in {group.voucherName}
                </div>
              ) : (
                group.colEntries.map((entry) => {
                  const isVoided = entry.voided;
                  const status = entry.approvalStatus || 'Approved';

                  return (
                    <div
                      key={entry.id}
                      className={`p-3.5 rounded-xl border bg-card transition-all shadow-2xs hover:shadow-xs space-y-2.5 ${
                        isVoided
                          ? 'border-border/60 opacity-60 bg-muted/30'
                          : 'border-border hover:border-border/80'
                      }`}
                    >
                      {/* Top Row: Voucher No, Status & Actions */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Link
                            to={isVoided ? '#' : `/journal-entries/${entry.id}/edit`}
                            className={`font-mono text-xs font-bold hover:underline transition-colors ${
                              isVoided
                                ? 'line-through text-muted-foreground cursor-not-allowed'
                                : 'text-primary'
                            }`}
                          >
                            {entry.voucherNo}
                          </Link>

                          {isVoided ? (
                            <span className="text-[9px] font-black px-1 rounded bg-rose-500/15 text-rose-600 border border-rose-500/30">
                              VOID
                            </span>
                          ) : (
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.2 rounded border uppercase tracking-wider ${
                                status === 'Approved'
                                  ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                                  : status === 'Pending'
                                  ? 'bg-amber-500/10 text-amber-600 border-amber-500/30'
                                  : status === 'Rejected'
                                  ? 'bg-rose-500/10 text-rose-600 border-rose-500/30'
                                  : 'bg-slate-500/10 text-slate-600 border-slate-500/30'
                              }`}
                            >
                              {status}
                            </span>
                          )}
                        </div>

                        <RowActionsMenu
                          entry={entry}
                          onOpenAttachment={onOpenAttachment}
                          onToggleVoid={onToggleVoid}
                        />
                      </div>

                      {/* Narration */}
                      <p
                        className={`text-xs text-foreground/90 line-clamp-2 leading-relaxed ${
                          isVoided ? 'line-through italic text-muted-foreground' : ''
                        }`}
                        title={entry.narration}
                      >
                        {entry.narration || <span className="text-muted-foreground italic">No narration</span>}
                      </p>

                      {/* Middle Metadata: Source & Lines count */}
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                        <span className="flex items-center gap-1">
                          <Layers className="size-3 text-muted-foreground/60" />
                          <span>{entry.source}</span>
                        </span>

                        <span>{entry.lines.length} line(s)</span>
                      </div>

                      {/* Bottom Row: Date & Amount */}
                      <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/50">
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="size-3 text-muted-foreground/60" />
                            <span>
                              {new Date(entry.voucherDate).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                              })}
                            </span>
                          </span>

                          {entry.attachments && entry.attachments.length > 0 && (
                            <span
                              onClick={() => onOpenAttachment(entry)}
                              className="flex items-center gap-0.5 text-primary font-bold cursor-pointer"
                            >
                              <Paperclip className="size-3" />
                              <span>{entry.attachments.length}</span>
                            </span>
                          )}
                        </div>

                        <div className="text-xs font-mono font-bold text-foreground">
                          <span className={isVoided ? 'line-through text-muted-foreground' : ''}>
                            {baseSymbol}{' '}
                            {entry.amount.toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
