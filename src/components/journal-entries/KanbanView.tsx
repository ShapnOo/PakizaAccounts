import React from 'react';
import { Link } from 'react-router-dom';
import {
  Paperclip,
  Calendar,
  Layers,
  BookOpen,
} from 'lucide-react';
import {
  VoucherEntry,
  VoucherType,
  VOUCHER_TYPES,
  VOUCHER_TYPE_CONFIG,
} from '../../types/journalEntry';
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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start overflow-x-auto pb-4">
      {VOUCHER_TYPES.map((type) => {
        const cfg = VOUCHER_TYPE_CONFIG[type];
        const colEntries = entries.filter((e) => e.voucherType === type);
        const colTotal = colEntries
          .filter((e) => !e.voided)
          .reduce((sum, e) => sum + e.amount, 0);

        return (
          <div
            key={type}
            className="flex flex-col rounded-2xl border border-border/80 bg-muted/20 shadow-2xs overflow-hidden min-w-[280px]"
          >
            {/* Column Header */}
            <div className="p-3.5 bg-card border-b border-border flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={`size-2.5 rounded-full ${cfg.color.bg}`} />
                <h3 className="text-xs font-bold text-foreground">{cfg.label}</h3>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-muted text-muted-foreground border border-border/80">
                  {colEntries.length}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-mono font-bold text-foreground">
                  ৳ {colTotal >= 1000000 ? `${(colTotal / 1000000).toFixed(2)}M` : colTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Cards List */}
            <div className="p-2.5 space-y-2.5 max-h-[72vh] overflow-y-auto sidebar-scroll">
              {colEntries.length === 0 ? (
                <div className="py-8 px-4 text-center rounded-xl border border-dashed border-border/70 text-xs text-muted-foreground">
                  No {cfg.label}s in current view
                </div>
              ) : (
                colEntries.map((entry) => {
                  const isVoided = entry.voided;

                  return (
                    <div
                      key={entry.id}
                      className={`p-3.5 rounded-xl border bg-card transition-all shadow-2xs hover:shadow-xs space-y-2.5 ${
                        isVoided
                          ? 'border-border/60 opacity-60 bg-muted/30'
                          : 'border-border hover:border-border/80'
                      }`}
                    >
                      {/* Top Row: Voucher No & Actions */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
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

                          {isVoided && (
                            <span className="text-[9px] font-black px-1 rounded bg-rose-500/15 text-rose-600 border border-rose-500/30">
                              VOID
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
                            ৳{' '}
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
