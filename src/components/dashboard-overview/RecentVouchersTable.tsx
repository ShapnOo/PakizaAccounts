import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  Eye,
  Printer,
  Receipt,
} from 'lucide-react';
import { listEntries } from '../../services/journalEntryService';
import { VoucherEntry } from '../../types/journalEntry';
import { formatBDTAmount } from '../../services/dashboardService';
import { VoucherPreviewModal } from './VoucherPreviewModal';

const TYPE_STYLES: Record<string, string> = {
  Journal: 'bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-600/20',
  Payment: 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20',
  Receive: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20',
  Contra: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20',
};

export function RecentVouchersTable() {
  const [entries, setEntries] = useState<VoucherEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedVoucher, setSelectedVoucher] = useState<VoucherEntry | null>(null);

  useEffect(() => {
    let isMounted = true;
    listEntries().then((res) => {
      if (isMounted) {
        setEntries(res || []);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = entries.filter((e) => {
    const linesText = (e.lines || [])
      .map((l) => `${l.accountHeadName || ''} ${l.description || ''}`)
      .join(' ');
    const matchesSearch =
      e.voucherNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.narration?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.source?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      linesText.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      typeFilter === 'all' || e.voucherType?.toLowerCase() === typeFilter.toLowerCase();
    return matchesSearch && matchesType;
  });

  const recentList = filtered.slice(0, 8);

  return (
    <div className="rounded-xl border border-border/70 bg-card p-4 sm:p-5 shadow-2xs space-y-3.5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/50">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-foreground">
              Recent Transactions & Vouchers
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px] font-semibold">
              {entries.length} in Ledger
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Live stream of double-entry vouchers across all accounting journals
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="size-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search voucher or head..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 pr-3 text-xs rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary w-44"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-8 px-2.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground focus:outline-none cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="Journal">Journal</option>
            <option value="Payment">Payment</option>
            <option value="Receive">Receive</option>
            <option value="Contra">Contra</option>
          </select>

          <Link
            to="/journal-entries"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-xs font-medium text-foreground transition-all cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-border/60">
        <table className="w-full text-xs text-left">
          <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-semibold border-b border-border/60">
            <tr>
              <th className="px-3.5 py-2.5">Voucher No</th>
              <th className="px-3.5 py-2.5">Date</th>
              <th className="px-3.5 py-2.5">Type</th>
              <th className="px-3.5 py-2.5">Primary Accounts</th>
              <th className="px-3.5 py-2.5 text-right">Amount (BDT)</th>
              <th className="px-3.5 py-2.5 text-center">Status</th>
              <th className="px-3.5 py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 font-normal">
            {recentList.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground text-xs">
                  No vouchers found matching filter criteria.
                </td>
              </tr>
            ) : (
              recentList.map((row) => {
                const debitLine = row.lines?.find((l) => (l.debit || 0) > 0);
                const creditLine = row.lines?.find((l) => (l.credit || 0) > 0);

                return (
                  <tr
                    key={row.id}
                    className="hover:bg-muted/30 transition-colors group cursor-pointer"
                    onClick={() => setSelectedVoucher(row)}
                  >
                    <td className="px-3.5 py-2.5 font-semibold font-mono text-indigo-600 flex items-center gap-1.5 whitespace-nowrap">
                      <Receipt className="size-3.5 text-muted-foreground group-hover:text-indigo-600 shrink-0" />
                      <span>{row.voucherNo}</span>
                    </td>

                    <td className="px-3.5 py-2.5 text-muted-foreground font-mono whitespace-nowrap">
                      {row.voucherDate}
                    </td>

                    <td className="px-3.5 py-2.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold whitespace-nowrap select-none ${
                          TYPE_STYLES[row.voucherType] || 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {row.voucherType}
                      </span>
                    </td>

                    <td className="px-3.5 py-2.5 max-w-[240px]">
                      <p className="font-medium text-foreground truncate">
                        {debitLine?.accountHeadName || row.headerAccountName || 'Multiple Debit Heads'}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        Cr: {creditLine?.accountHeadName || row.headerAccountName || 'Multiple Credit Heads'}
                      </p>
                    </td>

                    <td className="px-3.5 py-2.5 text-right font-mono font-semibold text-foreground tabular-nums whitespace-nowrap">
                      {formatBDTAmount(row.amount || 0)}
                    </td>

                    <td className="px-3.5 py-2.5 text-center whitespace-nowrap">
                      {row.voided ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20 text-[10px] font-semibold whitespace-nowrap select-none">
                          <span className="size-1.5 rounded-full bg-rose-500" />
                          Voided
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20 text-[10px] font-semibold whitespace-nowrap select-none">
                          <span className="size-1.5 rounded-full bg-emerald-500" />
                          Posted
                        </span>
                      )}
                    </td>

                    <td
                      className="px-3.5 py-2.5 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setSelectedVoucher(row)}
                          className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                          title="Quick View"
                        >
                          <Eye className="size-3.5" />
                        </button>

                        <Link
                          to={`/journal-entries/${row.id}/print`}
                          className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                          title="Print Voucher"
                        >
                          <Printer className="size-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal preview */}
      <VoucherPreviewModal
        voucher={selectedVoucher}
        onClose={() => setSelectedVoucher(null)}
      />
    </div>
  );
}
