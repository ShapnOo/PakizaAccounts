import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Paperclip,
  ArrowUpDown,
  BookOpen,
  Calendar,
  Layers,
  Columns,
  Check,
  ChevronDown,
} from 'lucide-react';
import {
  VoucherEntry,
  VOUCHER_TYPE_CONFIG,
  ApprovalStatus,
} from '../../types/journalEntry';
import { useCurrencyStore } from '../../stores/currencyStore';
import { RowActionsMenu } from './RowActionsMenu';

interface ListViewProps {
  entries: VoucherEntry[];
  onOpenAttachment: (entry: VoucherEntry) => void;
  onToggleVoid: (id: string) => void;
}

type SortField =
  | 'voucherNo'
  | 'voucherName'
  | 'voucherType'
  | 'approvalStatus'
  | 'voucherDate'
  | 'amount'
  | 'source';

export const ListView: React.FC<ListViewProps> = ({
  entries,
  onOpenAttachment,
  onToggleVoid,
}) => {
  const navigate = useNavigate();
  const { rates, setups } = useCurrencyStore();
  const baseRate = rates.find((r) => r.isBase);
  const baseSetup = setups.find((s) => s.id === baseRate?.currencyId);
  const baseSymbol = baseSetup?.symbol || '৳';
  const baseCode = baseSetup?.code || 'BDT';

  const [sortField, setSortField] = useState<SortField>('voucherDate');
  const [sortAsc, setSortAsc] = useState(false);

  // Column hide & show feature (#34)
  const [columnsOpen, setColumnsOpen] = useState(false);
  const columnsRef = useRef<HTMLDivElement>(null);
  const [visibleColumns, setVisibleColumns] = useState({
    voucherNo: true,
    voucherName: true,
    voucherType: true,
    approvalStatus: true,
    source: true,
    voucherDate: true,
    narration: true,
    amount: true,
  });

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (columnsRef.current && !columnsRef.current.contains(e.target as Node)) {
        setColumnsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const toggleColumn = (colKey: keyof typeof visibleColumns) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [colKey]: !prev[colKey],
    }));
  };

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
    } else if (sortField === 'voucherName') {
      cmp = (a.voucherName || a.voucherType).localeCompare(b.voucherName || b.voucherType);
    } else if (sortField === 'voucherType') {
      cmp = a.voucherType.localeCompare(b.voucherType);
    } else if (sortField === 'approvalStatus') {
      cmp = (a.approvalStatus || 'Approved').localeCompare(b.approvalStatus || 'Approved');
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
    <div className="space-y-3">
      {/* Column hide & show toolbar bar */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground font-medium">
          Showing <span className="font-bold text-foreground">{sortedEntries.length}</span> entry record(s)
        </div>

        <div className="relative" ref={columnsRef}>
          <button
            type="button"
            onClick={() => setColumnsOpen((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-bold text-muted-foreground hover:text-foreground transition-all cursor-pointer shadow-2xs"
          >
            <Columns className="size-3.5 text-primary" />
            <span>Hide / Show Columns</span>
            <ChevronDown className={`size-3 transition-transform duration-200 ${columnsOpen ? 'rotate-180' : ''}`} />
          </button>

          {columnsOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-popover text-popover-foreground shadow-2xl z-50 p-2 space-y-1 animate-in fade-in-50 zoom-in-95 duration-150">
              <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border/60 mb-1">
                Toggle Table Columns
              </div>
              {([
                ['voucherNo', 'Voucher No'],
                ['voucherName', 'Voucher Name'],
                ['voucherType', 'Voucher Type'],
                ['approvalStatus', 'Approval Status'],
                ['source', 'Source'],
                ['voucherDate', 'Voucher Date'],
                ['narration', 'Narration'],
                ['amount', `Amount (${baseCode})`],
              ] as const).map(([colKey, label]) => {
                const isChecked = visibleColumns[colKey];
                return (
                  <label
                    key={colKey}
                    onClick={() => toggleColumn(colKey)}
                    className="flex items-center justify-between p-1.5 rounded-lg hover:bg-muted/80 text-xs font-medium text-foreground cursor-pointer transition-colors"
                  >
                    <span>{label}</span>
                    <span
                      className={`size-4 rounded border flex items-center justify-center transition-all ${
                        isChecked
                          ? 'bg-primary border-primary text-primary-foreground'
                          : 'border-border bg-background'
                      }`}
                    >
                      {isChecked && <Check className="size-3 stroke-[3]" />}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-border/90 bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto sidebar-scroll">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-muted/40 border-b border-border text-[11px] font-bold uppercase tracking-wider text-muted-foreground select-none">
              <tr>
                {visibleColumns.voucherNo && (
                  <th
                    onClick={() => handleSort('voucherNo')}
                    className="py-3 px-4 cursor-pointer hover:text-foreground transition-colors min-w-[140px] whitespace-nowrap"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Voucher No</span>
                      <ArrowUpDown className="size-3" />
                    </div>
                  </th>
                )}

                {visibleColumns.voucherName && (
                  <th
                    onClick={() => handleSort('voucherName')}
                    className="py-3 px-4 cursor-pointer hover:text-foreground transition-colors min-w-[180px] whitespace-nowrap"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Voucher Name</span>
                      <ArrowUpDown className="size-3" />
                    </div>
                  </th>
                )}

                {visibleColumns.voucherType && (
                  <th
                    onClick={() => handleSort('voucherType')}
                    className="py-3 px-4 cursor-pointer hover:text-foreground transition-colors min-w-[130px] whitespace-nowrap"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Type</span>
                      <ArrowUpDown className="size-3" />
                    </div>
                  </th>
                )}

                {visibleColumns.approvalStatus && (
                  <th
                    onClick={() => handleSort('approvalStatus')}
                    className="py-3 px-4 cursor-pointer hover:text-foreground transition-colors min-w-[130px] whitespace-nowrap"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Approval Status</span>
                      <ArrowUpDown className="size-3" />
                    </div>
                  </th>
                )}

                {visibleColumns.source && (
                  <th
                    onClick={() => handleSort('source')}
                    className="py-3 px-4 cursor-pointer hover:text-foreground transition-colors min-w-[150px] whitespace-nowrap"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Source</span>
                      <ArrowUpDown className="size-3" />
                    </div>
                  </th>
                )}

                {visibleColumns.voucherDate && (
                  <th
                    onClick={() => handleSort('voucherDate')}
                    className="py-3 px-4 cursor-pointer hover:text-foreground transition-colors min-w-[120px] whitespace-nowrap"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Date</span>
                      <ArrowUpDown className="size-3" />
                    </div>
                  </th>
                )}

                {visibleColumns.narration && (
                  <th className="py-3 px-4 min-w-[260px]">Narration</th>
                )}

                {visibleColumns.amount && (
                  <th
                    onClick={() => handleSort('amount')}
                    className="py-3 px-4 text-right cursor-pointer hover:text-foreground transition-colors min-w-[140px] whitespace-nowrap"
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Amount ({baseSymbol} {baseCode})</span>
                      <ArrowUpDown className="size-3" />
                    </div>
                  </th>
                )}

                <th className="py-3 px-3 w-12 text-center"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border/60">
              {sortedEntries.map((entry) => {
                const cfg = VOUCHER_TYPE_CONFIG[entry.voucherType];
                const isVoided = entry.voided;
                const status: ApprovalStatus = entry.approvalStatus || 'Approved';

                return (
                  <tr
                    key={entry.id}
                    className={`group hover:bg-muted/30 transition-colors ${
                      isVoided ? 'opacity-65 bg-muted/15' : ''
                    }`}
                  >
                    {/* Voucher No */}
                    {visibleColumns.voucherNo && (
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
                    )}

                    {/* Voucher Name (#30) */}
                    {visibleColumns.voucherName && (
                      <td className="py-3 px-4 whitespace-nowrap font-medium text-foreground">
                        {entry.voucherName || cfg.label}
                      </td>
                    )}

                    {/* Voucher Type Badge */}
                    {visibleColumns.voucherType && (
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold border whitespace-nowrap select-none ${cfg.color.badge}`}
                        >
                          {cfg.shortCode}
                        </span>
                      </td>
                    )}

                    {/* Approval Status Badge (#35) */}
                    {visibleColumns.approvalStatus && (
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${
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
                      </td>
                    )}

                    {/* Source */}
                    {visibleColumns.source && (
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="text-xs text-muted-foreground font-medium inline-flex items-center gap-1.5 whitespace-nowrap">
                          <Layers className="size-3 text-muted-foreground/60 shrink-0" />
                          <span>{entry.source}</span>
                        </span>
                      </td>
                    )}

                    {/* Voucher Date */}
                    {visibleColumns.voucherDate && (
                      <td className="py-3 px-4">
                        <span className="text-xs font-medium text-foreground whitespace-nowrap">
                          {new Date(entry.voucherDate).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </td>
                    )}

                    {/* Narration */}
                    {visibleColumns.narration && (
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
                    )}

                    {/* Amount (Dynamic Base Currency) (#38) */}
                    {visibleColumns.amount && (
                      <td className="py-3 px-4 text-right font-mono font-bold text-xs text-foreground whitespace-nowrap">
                        <span className={isVoided ? 'line-through text-muted-foreground' : ''}>
                          {baseSymbol}{' '}
                          {entry.amount.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </td>
                    )}

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
            Total Value ({baseCode}):{' '}
            <span className="text-primary font-black">
              {baseSymbol}{' '}
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
    </div>
  );
};
