import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Download,
  Filter,
  MoreVertical,
  Printer,
  FileText,
  RotateCcw,
  Eye,
  CreditCard,
  ChevronDown,
  Calendar,
} from 'lucide-react';
import { ChequePrepare, PrepareLine, SourceType, ChequeFor } from '../../types/chequePrepare';
import { SourceTypeChip } from './SourceTypeChip';
import { VoidConfirmDialog } from './VoidConfirmDialog';

interface FlatRegisterRow {
  preparedId: string;
  sourceType: SourceType;
  accountsBankName: string;
  bankName: string;
  bookName: string;
  chequeFor: ChequeFor;
  name: string;
  chequeType: string;
  chequeNo: string;
  chequeDate: string;
  payTo: string;
  amount: number;
  voucherNo?: string;
  voucherDate?: string;
  rawRecord: ChequePrepare;
}

interface RegisterTableProps {
  records: ChequePrepare[];
  onVoid: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export const RegisterTable: React.FC<RegisterTableProps> = ({
  records,
  onVoid,
  isLoading = false,
}) => {
  const navigate = useNavigate();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [chequeForFilter, setChequeForFilter] = useState<string>('all');
  const [pageSize, setPageSize] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Void modal state
  const [voidTarget, setVoidTarget] = useState<ChequePrepare | null>(null);
  const [isVoiding, setIsVoiding] = useState(false);

  // Active kebab row
  const [activeMenuIdx, setActiveMenuIdx] = useState<number | null>(null);

  // Flatten multi-line records into single table rows
  const flatRows = useMemo<FlatRegisterRow[]>(() => {
    const list: FlatRegisterRow[] = [];
    records.forEach((rec) => {
      if (rec.lines && rec.lines.length > 0) {
        rec.lines.forEach((line) => {
          list.push({
            preparedId: rec.id,
            sourceType: rec.sourceType,
            accountsBankName: rec.accountsBankId || 'DBBL-00123',
            bankName: rec.bankName,
            bookName: rec.bookName,
            chequeFor: line.chequeFor || rec.chequeFor || 'Supplier',
            name: line.name || rec.name || line.payTo || '—',
            chequeType: line.chequeType,
            chequeNo: line.chequeNo,
            chequeDate: line.chequeDate,
            payTo: line.payTo,
            amount: line.amount,
            voucherNo: rec.voucherNo || (rec.voucherType ? `VCH-2026-${rec.id.slice(-4).toUpperCase()}` : '—'),
            voucherDate: rec.voucherDate || rec.createdAt.split('T')[0],
            rawRecord: rec,
          });
        });
      }
    });
    return list;
  }, [records]);

  // Filtered rows
  const filteredRows = useMemo(() => {
    return flatRows.filter((r) => {
      const matchSearch =
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.chequeNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.payTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.voucherNo && r.voucherNo.toLowerCase().includes(searchTerm.toLowerCase())) ||
        r.bankName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchSource = sourceFilter === 'all' || r.sourceType === sourceFilter;
      const matchFor = chequeForFilter === 'all' || r.chequeFor === chequeForFilter;

      return matchSearch && matchSource && matchFor;
    });
  }, [flatRows, searchTerm, sourceFilter, chequeForFilter]);

  // Paginated slice
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredRows.length / pageSize) || 1;

  // Export to CSV
  const handleExportCsv = () => {
    if (filteredRows.length === 0) return;
    const headers = [
      'Source Type',
      'Accounts',
      'Bank',
      'Book Name',
      'Cheque For',
      'Name',
      'Cheque Type',
      'Cheque No',
      'Cheque Date',
      'Pay To',
      'Amount (BDT)',
      'Voucher No',
      'Voucher Date',
    ];
    const rows = filteredRows.map((r) => [
      r.sourceType,
      r.accountsBankName,
      r.bankName,
      r.bookName,
      r.chequeFor,
      r.name,
      r.chequeType,
      r.chequeNo,
      r.chequeDate,
      `"${r.payTo.replace(/"/g, '""')}"`,
      r.amount,
      r.voucherNo,
      r.voucherDate,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cheque_register_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const executeVoid = async () => {
    if (!voidTarget) return;
    setIsVoiding(true);
    try {
      await onVoid(voidTarget.id);
      setVoidTarget(null);
    } finally {
      setIsVoiding(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border shadow-2xs">
        {/* Left: Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/70" />
          <input
            type="text"
            placeholder="Search party name, cheque no, voucher no, bank..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-1 focus:ring-primary shadow-2xs"
          />
        </div>

        {/* Right: Filters & Export */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Source Type Filter */}
          <select
            value={sourceFilter}
            onChange={(e) => {
              setSourceFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="h-9 px-3 rounded-lg border border-border bg-background text-xs font-semibold text-foreground outline-none focus:ring-1 focus:ring-primary shadow-2xs cursor-pointer"
          >
            <option value="all">All Sources</option>
            <option value="direct">Direct Payment</option>
            <option value="bill">Bill Payment</option>
            <option value="iou">IOU Payment</option>
          </select>

          {/* Cheque For Filter */}
          <select
            value={chequeForFilter}
            onChange={(e) => {
              setChequeForFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="h-9 px-3 rounded-lg border border-border bg-background text-xs font-semibold text-foreground outline-none focus:ring-1 focus:ring-primary shadow-2xs cursor-pointer"
          >
            <option value="all">All Beneficiaries</option>
            <option value="Supplier">Supplier</option>
            <option value="Employee">Employee</option>
            <option value="Customer">Customer</option>
            <option value="Other">Other</option>
          </select>

          {/* Export CSV */}
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={filteredRows.length === 0}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border/80 bg-card hover:bg-muted text-xs font-bold text-foreground shadow-2xs transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="size-3.5 text-muted-foreground" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-2xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-muted/60 dark:bg-muted/30 border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider sticky top-0 z-10">
              <th className="py-3 px-3">Source</th>
              <th className="py-3 px-3" data-raw-label="Accoutns">
                Accounts
              </th>
              <th className="py-3 px-3">Bank</th>
              <th className="py-3 px-3">Book Name</th>
              <th className="py-3 px-3">Cheque For</th>
              <th className="py-3 px-3">Name</th>
              <th className="py-3 px-3">Type</th>
              <th className="py-3 px-3">Cheque No</th>
              <th className="py-3 px-3">Date</th>
              <th className="py-3 px-3 min-w-[140px]">Pay To</th>
              <th className="py-3 px-3 text-right">Amount (৳)</th>
              <th className="py-3 px-3">Voucher No</th>
              <th className="py-3 px-3">Voucher Date</th>
              <th className="py-3 px-3 text-center w-12">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={14} className="py-12 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <CreditCard className="size-8 text-muted-foreground/40" />
                    <p className="text-sm font-bold text-foreground">No cheques prepared yet</p>
                    <p className="text-xs text-muted-foreground">
                      Prepare a cheque via Direct, Bill, or IOU payment to register rows here.
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate('/cheques/prepare/direct')}
                      className="mt-2 inline-flex items-center gap-1.5 h-8 px-4 rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow-sm hover:bg-primary/90 transition-all cursor-pointer"
                    >
                      Prepare a Cheque
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedRows.map((row, idx) => (
                <tr
                  key={`${row.preparedId}-${row.chequeNo}-${idx}`}
                  className="hover:bg-muted/30 transition-colors group"
                >
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <SourceTypeChip type={row.sourceType} />
                  </td>

                  <td className="py-2.5 px-3 font-mono font-medium text-foreground whitespace-nowrap">
                    {row.accountsBankName}
                  </td>

                  <td className="py-2.5 px-3 font-semibold text-foreground whitespace-nowrap">
                    {row.bankName}
                  </td>

                  <td className="py-2.5 px-3 text-muted-foreground whitespace-nowrap">
                    {row.bookName}
                  </td>

                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className="text-[11px] font-bold text-muted-foreground bg-muted/60 px-2 py-0.5 rounded">
                      {row.chequeFor}
                    </span>
                  </td>

                  <td className="py-2.5 px-3 font-bold text-foreground max-w-[160px] truncate">
                    {row.name}
                  </td>

                  <td className="py-2.5 px-3 text-muted-foreground text-[11px] whitespace-nowrap">
                    {row.chequeType}
                  </td>

                  <td className="py-2.5 px-3 font-mono font-extrabold text-foreground whitespace-nowrap">
                    {row.chequeNo}
                  </td>

                  <td className="py-2.5 px-3 font-mono text-muted-foreground whitespace-nowrap">
                    {row.chequeDate}
                  </td>

                  <td className="py-2.5 px-3 text-foreground font-medium max-w-[180px] truncate">
                    {row.payTo}
                  </td>

                  <td className="py-2.5 px-3 text-right font-mono font-black text-foreground whitespace-nowrap tabular-nums">
                    ৳ {row.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>

                  <td className="py-2.5 px-3 whitespace-nowrap">
                    {row.voucherNo && row.voucherNo !== '—' ? (
                      <button
                        type="button"
                        onClick={() => navigate('/accounts-report/journal')}
                        className="font-mono text-[11px] font-bold text-primary hover:underline cursor-pointer"
                      >
                        {row.voucherNo}
                      </button>
                    ) : (
                      <span className="text-muted-foreground/60">—</span>
                    )}
                  </td>

                  <td className="py-2.5 px-3 font-mono text-muted-foreground text-[11px] whitespace-nowrap">
                    {row.voucherDate || '—'}
                  </td>

                  {/* Actions Kebab */}
                  <td className="py-2.5 px-3 text-center relative">
                    <div className="inline-block text-left">
                      <button
                        type="button"
                        onClick={() => setActiveMenuIdx(activeMenuIdx === idx ? null : idx)}
                        className="size-7 rounded-md grid place-items-center text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors cursor-pointer"
                      >
                        <MoreVertical className="size-3.5" />
                      </button>

                      {activeMenuIdx === idx && (
                        <div
                          onMouseLeave={() => setActiveMenuIdx(null)}
                          className="absolute right-3 z-30 mt-1 w-36 rounded-lg bg-card border border-border shadow-lg py-1 animate-in fade-in-50 zoom-in-95 text-left"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuIdx(null);
                              navigate(`/cheques/${row.preparedId}/print`);
                            }}
                            className="w-full px-3 py-1.5 flex items-center gap-2 text-xs font-semibold text-foreground hover:bg-muted/60 cursor-pointer"
                          >
                            <Printer className="size-3.5 text-indigo-600" />
                            <span>Cheque Print</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuIdx(null);
                              navigate('/accounts-report/journal');
                            }}
                            className="w-full px-3 py-1.5 flex items-center gap-2 text-xs font-semibold text-foreground hover:bg-muted/60 cursor-pointer"
                          >
                            <FileText className="size-3.5 text-emerald-600" />
                            <span>Voucher Print</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuIdx(null);
                              setVoidTarget(row.rawRecord);
                            }}
                            className="w-full px-3 py-1.5 flex items-center gap-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                          >
                            <RotateCcw className="size-3.5 text-rose-600" />
                            <span>Void Cheque</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination & Summary Footer */}
      {filteredRows.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground px-1">
          <div>
            Showing <strong className="text-foreground">{paginatedRows.length}</strong> of{' '}
            <strong className="text-foreground">{filteredRows.length}</strong> prepared entries
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px]">Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="h-7 px-2 rounded-md border border-border bg-card text-xs text-foreground font-semibold outline-none cursor-pointer"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>

            <div className="flex items-center gap-1 pl-2">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="h-7 px-2.5 rounded-md border border-border bg-card hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-foreground"
              >
                Prev
              </button>
              <span className="px-2 font-mono font-bold text-foreground">
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="h-7 px-2.5 rounded-md border border-border bg-card hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-foreground"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Void Confirmation Dialog */}
      <VoidConfirmDialog
        cheque={voidTarget}
        onClose={() => setVoidTarget(null)}
        onConfirm={executeVoid}
        isVoiding={isVoiding}
      />
    </div>
  );
};
