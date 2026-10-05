import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePreparedChequeStore } from '../../stores/preparedChequeStore';
import { PreparedCheque, SourceType, ChequeFor } from '../../types/cheque';
import { ChequeTabs } from '../../components/cheques/ChequeTabs';
import { RegisterTable } from '../../components/cheques/RegisterTable';
import { EmptyState } from '../../components/cheques/EmptyState';
import { DeleteConfirmDialog } from '../../components/cheques/DeleteConfirmDialog';
import { ListChecks, Download, Search, Filter, Plus } from 'lucide-react';
import { toast } from 'sonner';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { prepared, loading, loadPrepared, voidCheque } = usePreparedChequeStore();

  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [chequeForFilter, setChequeForFilter] = useState<string>('all');

  const [voidTarget, setVoidTarget] = useState<PreparedCheque | null>(null);
  const [isVoiding, setIsVoiding] = useState(false);

  useEffect(() => {
    loadPrepared();
  }, [loadPrepared]);

  // Filter logic
  const filtered = useMemo(() => {
    return prepared.filter((c) => {
      const q = search.toLowerCase();
      const matchesSearch =
        c.chequeNo.toLowerCase().includes(q) ||
        c.partyName.toLowerCase().includes(q) ||
        c.payTo.toLowerCase().includes(q) ||
        c.bankName.toLowerCase().includes(q) ||
        (c.billNo && c.billNo.toLowerCase().includes(q));

      const matchesSource = sourceFilter === 'all' || c.sourceType === sourceFilter;
      const matchesFor = chequeForFilter === 'all' || c.chequeFor === chequeForFilter;

      return matchesSearch && matchesSource && matchesFor;
    });
  }, [prepared, search, sourceFilter, chequeForFilter]);

  // Export CSV Handler
  const handleExportCsv = () => {
    if (filtered.length === 0) {
      toast.warning('No records to export');
      return;
    }

    const headers = [
      'Source Type',
      'Accounts',
      'Bank',
      'Book Name',
      'Cheque For',
      'Party Name',
      'Cheque Type',
      'Cheque No',
      'Cheque Date',
      'Pay To',
      'Amount',
      'Voucher No',
      'Voucher Date',
    ];

    const rows = filtered.map((c) => [
      c.sourceType,
      c.accountsBankId,
      c.bankName,
      c.bookName,
      c.chequeFor,
      c.partyName,
      c.chequeType,
      c.chequeNo,
      c.chequeDate,
      c.payTo,
      c.amount,
      c.id ? `VCH-${c.id.slice(-6).toUpperCase()}` : '',
      c.voucherDate || c.chequeDate,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map((val) => `"${val}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cheque_register_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Cheque register exported to CSV');
  };

  // Void Handler
  const handleConfirmVoid = async () => {
    if (!voidTarget) return;
    setIsVoiding(true);
    try {
      await voidCheque(voidTarget.id);
      toast.success(`Cheque ${voidTarget.chequeNo} voided and freed for reuse.`);
      setVoidTarget(null);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to void cheque');
    } finally {
      setIsVoiding(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-5 pb-20 space-y-5">
      {/* Module Navigation Tabs */}
      <ChequeTabs />

      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900 shadow-2xs">
            <ListChecks className="size-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              Cheque Book Register
            </h1>
            <p className="text-xs text-muted-foreground">
              Master audit register of all prepared, printed, and disbursed cheques
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:bg-muted shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="size-3.5 text-indigo-600" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/cheques/prepare/direct')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer"
          >
            <Plus className="size-4" />
            <span>Prepare Cheque</span>
          </button>
        </div>
      </div>

      {/* Toolbar: Search & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative min-w-[220px] sm:min-w-[280px]">
            <Search className="size-3.5 text-muted-foreground absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search cheque no, recipient, party..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8.5 pl-8.5 pr-3 rounded-lg border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs"
            />
          </div>

          {/* Source Type Filter */}
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="h-8.5 px-2.5 rounded-lg border border-border bg-card text-xs text-foreground outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs cursor-pointer"
          >
            <option value="all">All Source Types</option>
            <option value="direct">Direct Payment</option>
            <option value="bill">Bill Payment</option>
            <option value="iou">IOU Payment</option>
          </select>

          {/* Cheque For Filter */}
          <select
            value={chequeForFilter}
            onChange={(e) => setChequeForFilter(e.target.value)}
            className="h-8.5 px-2.5 rounded-lg border border-border bg-card text-xs text-foreground outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs cursor-pointer"
          >
            <option value="all">All Beneficiaries</option>
            <option value="Supplier">Supplier</option>
            <option value="Employee">Employee</option>
            <option value="Customer">Customer</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <span className="text-xs font-semibold text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? 'Record' : 'Records'}
        </span>
      </div>

      {/* Table / Empty State */}
      {loading ? (
        <div className="p-8 text-center text-xs text-muted-foreground">
          Loading cheque register...
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No Cheques Prepared Yet"
          description={
            search || sourceFilter !== 'all' || chequeForFilter !== 'all'
              ? 'No prepared cheque records match your search or filter criteria.'
              : 'You have not prepared any cheques yet. Prepare your first cheque to start tracking.'
          }
          actionText={
            search || sourceFilter !== 'all' || chequeForFilter !== 'all'
              ? undefined
              : 'Prepare your first cheque'
          }
          onAction={() => navigate('/cheques/prepare/direct')}
        />
      ) : (
        <RegisterTable
          cheques={filtered}
          onVoidCheque={(cheque) => setVoidTarget(cheque)}
        />
      )}

      {/* Void Cheque Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={Boolean(voidTarget)}
        onClose={() => setVoidTarget(null)}
        onConfirm={handleConfirmVoid}
        isDeleting={isVoiding}
        title="Void Prepared Cheque"
        message={`Are you sure you want to void cheque ${voidTarget?.chequeNo} for ৳${(
          voidTarget?.amount || 0
        ).toLocaleString()}? Voiding will remove this register entry and unlock cheque leaf ${
          voidTarget?.chequeNo
        } in book "${voidTarget?.bookName}" so it can be re-used.`}
        confirmLabel="Void Cheque"
      />
    </div>
  );
};
