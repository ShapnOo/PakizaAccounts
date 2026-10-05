import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Paperclip,
  ArrowUpDown,
  BookOpen,
  Calendar,
  Layers,
  FileText,
} from 'lucide-react';
import {
  VoucherEntry,
  VOUCHER_TYPE_CONFIG,
} from '../../types/journalEntry';
import { RowActionsMenu } from './RowActionsMenu';

interface ListViewProps {
  entries: VoucherEntry[];
  onOpenAttachment: (entry: VoucherEntry) => void;
  onToggleVoid: (id: string) => void;
}

type SortField = 'voucherNo' | 'voucherType' | 'voucherDate' | 'amount' | 'source';

export const ListView: React.FC<ListViewProps> = ({
  entries,
  onOpenAttachment,
  onToggleVoid,
}) => {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<SortField>('voucherDate');
  const [sortAsc, setSortAsc] = useState(false);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedEntries = [...entries].sort((a, b) => {
    let cmp = 0;
    if (sortField === 'voucherNo') {
      cmp = a.voucherNo.localeCompare(b.voucherNo);
    } else if (sortField === 'voucherType') {
      cmp = a.voucherType.localeCompare(b.voucherType);
    } else if (sortField === 'source') {
      cmp = a.source.localeCompare(b.source);
    } else if (sortField === 'voucherDate') {
      cmp = new Date(a.voucherDate).getTime() - new Date(b.voucherDate).getTime();
    } else if (sortField === 'amount') {
      cmp = a.amount - b.amount;
    }
    return sortAsc ? cmp : -cmp;
  });

  if (entries.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-card shadow-2xs space-y-3">
        <div className="size-12 rounded-full bg-muted/60 text-muted-foreground flex items-center justify-center mx-auto">
          <BookOpen className="size-6 stroke-[1.5]" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-foreground">No Vouchers Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            No journal entries match your selected date range and filter criteria.
          </p>
        </div>
        <div className="pt-2">
          <button
            type="button"
            onClick={() => navigate('/journal-entries/new?type=Journal')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-sm hover:bg-primary/90 transition-all cursor-pointer"
          >
            Create First Voucher
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/90 bg-card overflow-hidden shadow-xs">
      <div className="overflow-x-auto sidebar-scroll">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-muted/40 border-b border-border text-[11px] font-bold uppercase tracking-wider text-muted-foreground select-none">
            <tr>
              <th
                onClick={() => handleSort('voucherNo')}
                className="py-3 px-4 cursor-pointer hover:text-foreground transition-colors min-w-[140px] whitespace-nowrap"
              >
                <div className="flex items-center gap-1.5">
                  <span>Voucher No</span>
                  <ArrowUpDown className="size-3" />
                </div>
              </th>

              <th
                onClick={() => handleSort('voucherType')}
                className="py-3 px-4 cursor-pointer hover:text-foreground transition-colors min-w-[150px] whitespace-nowrap"
              >
                <div className="flex items-center gap-1.5">
                  <span>Voucher Type</span>
                  <ArrowUpDown className="size-3" />
                </div>
              </th>

              <th
                onClick={() => handleSort('source')}
                className="py-3 px-4 cursor-pointer hover:text-foreground transition-colors min-w-[160px] whitespace-nowrap"
              >
                <div className="flex items-center gap-1.5">
                  <span>Source</span>
                  <ArrowUpDown className="size-3" />
                </div>
              </th>

              <th
                onClick={() => handleSort('voucherDate')}
                className="py-3 px-4 cursor-pointer hover:text-foreground transition-colors min-w-[130px] whitespace-nowrap"
              >
                <div className="flex items-center gap-1.5">
                  <span>Voucher Date</span>
                  <ArrowUpDown className="size-3" />
                </div>
              </th>

              <th className="py-3 px-4 min-w-[280px]">Narration</th>

              <th
                onClick={() => handleSort('amount')}
                className="py-3 px-4 text-right cursor-pointer hover:text-foreground transition-colors min-w-[140px] whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Amount (৳)</span>
                  <ArrowUpDown className="size-3" />
                </div>
              </th>

              <th className="py-3 px-3 w-12 text-center"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border/60">
            {sortedEntries.map((entry) => {
              const cfg = VOUCHER_TYPE_CONFIG[entry.voucherType];
              const isVoided = entry.voided;

              return (
                <tr
                  key={entry.id}
                  className={`group hover:bg-muted/30 transition-colors ${
                    isVoided ? 'opacity-65 bg-muted/15' : ''
                  }`}
                >
                  {/* Voucher No */}
                  <td className="py-3 px-4 font-mono font-bold whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Link
                        to={isVoided ? '#' : `/journal-entries/${entry.id}/edit`}
                        className={`hover:underline transition-colors ${
                          isVoided
                            ? 'line-through text-muted-foreground cursor-not-allowed'
                            : 'text-primary'
                        }`}
                      >
                        {entry.voucherNo}
                      </Link>

                      {isVoided && (
                        <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-rose-500/15 text-rose-600 border border-rose-500/30 whitespace-nowrap">
                          VOID
                        </span>
                      )}

                      {entry.attachments && entry.attachments.length > 0 && (
                        <button
                          type="button"
                          onClick={() => onOpenAttachment(entry)}
                          title={`${entry.attachments.length} attachment(s)`}
                          className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                        >
                          <Paperclip className="size-3.5" />
                        </button>
                      )}
                    </div>
                  </td>

                  {/* Voucher Type */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold border whitespace-nowrap select-none ${cfg.color.badge}`}
                    >
                      {cfg.label}
                    </span>
                  </td>

                  {/* Source */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="text-xs text-muted-foreground font-medium inline-flex items-center gap-1.5 whitespace-nowrap">
                      <Layers className="size-3 text-muted-foreground/60 shrink-0" />
                      <span>{entry.source}</span>
                    </span>
                  </td>

                  {/* Voucher Date */}
                  <td className="py-3 px-4">
                    <span className="text-xs font-medium text-foreground whitespace-nowrap">
                      {new Date(entry.voucherDate).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </td>

                  {/* Narration */}
                  <td className="py-3 px-4 max-w-md">
                    <p
                      className={`text-xs leading-snug line-clamp-2 ${
                        isVoided
                          ? 'line-through text-muted-foreground italic'
                          : 'text-foreground/90 font-normal'
                      }`}
                      title={entry.narration}
                    >
                      {entry.narration || <span className="text-muted-foreground italic">No narration provided</span>}
                    </p>
                  </td>

                  {/* Amount (৳ BDT) */}
                  <td className="py-3 px-4 text-right font-mono font-bold text-xs text-foreground whitespace-nowrap">
                    <span className={isVoided ? 'line-through text-muted-foreground' : ''}>
                      ৳{' '}
                      {entry.amount.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </td>

                  {/* Actions Dropdown */}
                  <td className="py-3 px-3 text-center">
                    <RowActionsMenu
                      entry={entry}
                      onOpenAttachment={onOpenAttachment}
                      onToggleVoid={onToggleVoid}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table summary bar */}
      <div className="py-2.5 px-4 bg-muted/20 border-t border-border/80 flex flex-wrap items-center justify-between text-xs text-muted-foreground">
        <div>
          Showing <span className="font-bold text-foreground">{sortedEntries.length}</span> voucher(s)
        </div>
        <div className="font-mono font-bold text-foreground">
          Total Value:{' '}
          <span className="text-primary font-black">
            ৳{' '}
            {sortedEntries
              .filter((e) => !e.voided)
              .reduce((s, e) => s + e.amount, 0)
              .toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
          </span>
        </div>
      </div>
    </div>
  );
};
