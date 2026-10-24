import React, { useState, useMemo } from 'react';
import {
  X,
  Printer,
  Search,
  Filter,
  Calendar,
  Check,
  CheckSquare,
  Square,
  FileText,
  RotateCcw,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { VoucherEntry, VoucherType, ApprovalStatus, VOUCHER_TYPE_CONFIG } from '../../types/journalEntry';
import { toast } from 'sonner';

interface BulkPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: VoucherEntry[];
}

const TYPE_OPTIONS: { label: string; value: string }[] = [
  { label: 'All Voucher Types', value: 'All' },
  { label: 'Journal Voucher (JV)', value: 'Journal' },
  { label: 'Payment Voucher (PV)', value: 'Payment' },
  { label: 'Receive Voucher (RV)', value: 'Receive' },
  { label: 'Contra Voucher (CV)', value: 'Contra' },
];

const STATUS_OPTIONS: { label: string; value: string }[] = [
  { label: 'All Statuses', value: 'All' },
  { label: 'Approved', value: 'Approved' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Rejected', value: 'Rejected' },
  { label: 'Draft', value: 'Draft' },
];

const DATE_PRESET_OPTIONS: { label: string; value: string }[] = [
  { label: 'All Dates', value: 'all' },
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'this-week' },
  { label: 'This Month', value: 'this-month' },
  { label: 'Custom Range', value: 'custom' },
];

export const BulkPrintModal: React.FC<BulkPrintModalProps> = ({
  isOpen,
  onClose,
  entries,
}) => {
  // Filter States
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [datePreset, setDatePreset] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Selected Vouchers State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Filtered entries calculation
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      // 1. Search Query
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchNo = entry.voucherNo.toLowerCase().includes(q);
        const matchNarration = (entry.narration || '').toLowerCase().includes(q);
        const matchName = (entry.voucherName || '').toLowerCase().includes(q);
        const matchAccount = (entry.headerAccountName || '').toLowerCase().includes(q);
        const matchLines = entry.lines.some((l) =>
          (l.accountHeadName || '').toLowerCase().includes(q) ||
          (l.description || '').toLowerCase().includes(q)
        );
        if (!matchNo && !matchNarration && !matchName && !matchAccount && !matchLines) {
          return false;
        }
      }

      // 2. Voucher Type
      if (typeFilter !== 'All' && entry.voucherType !== typeFilter) {
        return false;
      }

      // 3. Approval Status
      if (statusFilter !== 'All') {
        const currentStatus = entry.approvalStatus || 'Approved';
        if (currentStatus !== statusFilter) {
          return false;
        }
      }

      // 4. Date Range
      if (datePreset === 'today') {
        const todayStr = new Date().toISOString().slice(0, 10);
        if (entry.voucherDate !== todayStr) return false;
      } else if (datePreset === 'this-month') {
        const currentMonth = new Date().toISOString().slice(0, 7);
        if (!entry.voucherDate.startsWith(currentMonth)) return false;
      } else if (datePreset === 'custom') {
        if (fromDate && entry.voucherDate < fromDate) return false;
        if (toDate && entry.voucherDate > toDate) return false;
      }

      return true;
    });
  }, [entries, search, typeFilter, statusFilter, datePreset, fromDate, toDate]);

  // Bulk Selection Helpers
  const isAllVisibleSelected =
    filteredEntries.length > 0 &&
    filteredEntries.every((e) => selectedIds.has(e.id));

  const toggleSelectAllVisible = () => {
    if (isAllVisibleSelected) {
      // Deselect visible
      const next = new Set(selectedIds);
      filteredEntries.forEach((e) => next.delete(e.id));
      setSelectedIds(next);
    } else {
      // Select all visible
      const next = new Set(selectedIds);
      filteredEntries.forEach((e) => next.add(e.id));
      setSelectedIds(next);
    }
  };

  const toggleRow = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const handleResetFilters = () => {
    setSearch('');
    setTypeFilter('All');
    setStatusFilter('All');
    setDatePreset('all');
    setFromDate('');
    setToDate('');
  };

  const selectedEntries = useMemo(() => {
    return entries.filter((e) => selectedIds.has(e.id));
  }, [entries, selectedIds]);

  const totalSelectedAmount = useMemo(() => {
    return selectedEntries.reduce((sum, e) => sum + e.amount, 0);
  }, [selectedEntries]);

  // Execute Print
  const handlePrint = () => {
    if (selectedEntries.length === 0) {
      toast.warning('Please select at least one voucher to print.');
      return;
    }

    const vouchersHtml = selectedEntries
      .map((voucher, idx) => {
        const cfg = VOUCHER_TYPE_CONFIG[voucher.voucherType];
        const totalDebitBDT = voucher.lines.reduce((s, l) => s + (l.debitBDT ?? 0), 0);
        const totalCreditBDT = voucher.lines.reduce((s, l) => s + (l.creditBDT ?? 0), 0);
        const isLast = idx === selectedEntries.length - 1;

        const linesRows = voucher.lines
          .map((l, i) => `
            <tr>
              <td style="text-align: center; border: 1px solid #cbd5e1; padding: 6px 8px; font-family: monospace;">${i + 1}</td>
              <td style="border: 1px solid #cbd5e1; padding: 6px 8px;">
                <div style="font-weight: 700; color: #0f172a;">${l.accountHeadName || l.accountHeadId}</div>
                ${l.description ? `<div style="font-size: 10px; color: #64748b; margin-top: 2px;">${l.description}</div>` : ''}
              </td>
              <td style="border: 1px solid #cbd5e1; padding: 6px 8px; color: #334155;">${l.costCenterId || l.reference || '-'}</td>
              <td style="text-align: center; border: 1px solid #cbd5e1; padding: 6px 8px; font-family: monospace;">${l.currency}</td>
              <td style="text-align: right; border: 1px solid #cbd5e1; padding: 6px 8px; font-family: monospace; font-weight: 700;">
                ${l.debitBDT ? l.debitBDT.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '-'}
              </td>
              <td style="text-align: right; border: 1px solid #cbd5e1; padding: 6px 8px; font-family: monospace; font-weight: 700;">
                ${l.creditBDT ? l.creditBDT.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '-'}
              </td>
            </tr>
          `)
          .join('');

        return `
          <div class="voucher-page" style="${!isLast ? 'page-break-after: always; break-after: page;' : ''} margin-bottom: 24px; padding: 24px 30px; background: #fff; font-family: system-ui, -apple-system, sans-serif;">
            <!-- Header -->
            <div style="text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 14px;">
              <h1 style="margin: 0; font-size: 20px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase; color: #0f172a;">
                Pakiza Spinning Mills Ltd.
              </h1>
              <p style="margin: 3px 0 0; font-size: 11px; color: #475569;">
                Pakiza Corporate Tower, 56-57 Motijheel C/A, Dhaka-1000, Bangladesh
              </p>
              <div style="margin-top: 8px;">
                <span style="display: inline-block; padding: 3px 14px; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; background: #f1f5f9; color: #0f172a; border: 1px solid #cbd5e1; border-radius: 4px;">
                  ${voucher.voucherName || cfg.label}
                </span>
              </div>
            </div>

            <!-- Meta Grid -->
            <table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 16px;">
              <tr>
                <td style="width: 50%; vertical-align: top; line-height: 1.6;">
                  <div><strong style="color: #64748b;">Voucher No:</strong> <span style="font-family: monospace; font-weight: 700; color: #0f172a;">${voucher.voucherNo}</span></div>
                  <div><strong style="color: #64748b;">Voucher Type:</strong> <span style="font-weight: 600;">${voucher.voucherType}</span></div>
                  <div><strong style="color: #64748b;">Source:</strong> <span>${voucher.source}</span></div>
                </td>
                <td style="width: 50%; vertical-align: top; text-align: right; line-height: 1.6;">
                  <div><strong style="color: #64748b;">Date:</strong> <span style="font-weight: 700;">${voucher.voucherDate}</span></div>
                  <div><strong style="color: #64748b;">Status:</strong> <span style="font-weight: 800; color: ${voucher.voided ? '#e11d48' : '#059669'};">${voucher.voided ? 'VOIDED' : voucher.approvalStatus || 'APPROVED'}</span></div>
                  ${voucher.headerAccountName ? `<div><strong style="color: #64748b;">Account:</strong> <span>${voucher.headerAccountName}</span></div>` : ''}
                </td>
              </tr>
            </table>

            <!-- Table -->
            <table style="width: 100%; border-collapse: collapse; font-size: 11px; border: 1px solid #cbd5e1; margin-bottom: 14px;">
              <thead>
                <tr style="background: #f8fafc; font-weight: 800; text-transform: uppercase; font-size: 10px; color: #475569;">
                  <th style="border: 1px solid #cbd5e1; padding: 6px 8px; width: 36px; text-align: center;">SL</th>
                  <th style="border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left;">Account Head & Description</th>
                  <th style="border: 1px solid #cbd5e1; padding: 6px 8px; width: 110px; text-align: left;">Cost Center</th>
                  <th style="border: 1px solid #cbd5e1; padding: 6px 8px; width: 60px; text-align: center;">Currency</th>
                  <th style="border: 1px solid #cbd5e1; padding: 6px 8px; width: 100px; text-align: right;">Debit (৳ BDT)</th>
                  <th style="border: 1px solid #cbd5e1; padding: 6px 8px; width: 100px; text-align: right;">Credit (৳ BDT)</th>
                </tr>
              </thead>
              <tbody>
                ${linesRows}
              </tbody>
              <tfoot>
                <tr style="background: #f8fafc; font-weight: 800; font-size: 11px;">
                  <td colspan="4" style="border: 1px solid #cbd5e1; padding: 6px 8px; text-align: right; text-transform: uppercase;">Total:</td>
                  <td style="border: 1px solid #cbd5e1; padding: 6px 8px; text-align: right; font-family: monospace; font-size: 12px; font-weight: 900;">
                    ৳ ${totalDebitBDT.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td style="border: 1px solid #cbd5e1; padding: 6px 8px; text-align: right; font-family: monospace; font-size: 12px; font-weight: 900;">
                    ৳ ${totalCreditBDT.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tfoot>
            </table>

            <!-- Narration -->
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 12px; font-size: 11px; margin-bottom: 30px;">
              <span style="font-weight: 800; font-size: 9.5px; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">Narration:</span>
              <p style="margin: 2px 0 0; font-style: italic; color: #1e293b; line-height: 1.4;">${voucher.narration || 'No narration provided.'}</p>
            </div>

            <!-- Signatures -->
            <table style="width: 100%; border-collapse: collapse; margin-top: 40px; font-size: 10.5px; text-align: center;">
              <tr>
                <td style="width: 25%; padding: 0 8px;">
                  <div style="border-top: 1px solid #94a3b8; padding-top: 4px; font-weight: 700; color: #334155;">Prepared By</div>
                </td>
                <td style="width: 25%; padding: 0 8px;">
                  <div style="border-top: 1px solid #94a3b8; padding-top: 4px; font-weight: 700; color: #334155;">Checked By</div>
                </td>
                <td style="width: 25%; padding: 0 8px;">
                  <div style="border-top: 1px solid #94a3b8; padding-top: 4px; font-weight: 700; color: #334155;">Accounts Manager</div>
                </td>
                <td style="width: 25%; padding: 0 8px;">
                  <div style="border-top: 1px solid #94a3b8; padding-top: 4px; font-weight: 700; color: #334155;">Authorized Signatory</div>
                </td>
              </tr>
            </table>
          </div>
        `;
      })
      .join('');

    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Bulk Vouchers Print (${selectedEntries.length} Records)</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 10mm;
            }
            body {
              margin: 0;
              padding: 0;
              background: #fff;
              color: #0f172a;
              font-family: system-ui, -apple-system, sans-serif;
            }
            @media print {
              .voucher-page {
                box-shadow: none !important;
                border: none !important;
                padding: 0 !important;
                margin-bottom: 0 !important;
              }
            }
          </style>
        </head>
        <body>
          ${vouchersHtml}
          <script>
            window.onload = function() {
              window.focus();
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    // Create an invisible iframe to execute native print seamlessly
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    printFrame.id = 'bulk-voucher-print-frame';

    document.body.appendChild(printFrame);

    const frameDoc = printFrame.contentWindow?.document;
    if (frameDoc) {
      frameDoc.open();
      frameDoc.write(fullHtml);
      frameDoc.close();

      toast.info(`Preparing print queue for ${selectedEntries.length} vouchers...`);

      setTimeout(() => {
        const existing = document.getElementById('bulk-voucher-print-frame');
        if (existing) {
          document.body.removeChild(existing);
        }
      }, 60000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-card border border-border/90 rounded-2xl shadow-2xl flex flex-col w-full max-w-5xl max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-150">
        {/* ── Modal Header ── */}
        <div className="px-5 py-3.5 border-b border-border/80 flex items-center justify-between gap-3 bg-muted/20 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="size-9 rounded-xl bg-primary/10 text-primary grid place-items-center shadow-xs shrink-0">
              <Printer className="size-4.5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-bold text-foreground">
                  Bulk Print Vouchers
                </h3>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {filteredEntries.length} Matching
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                Filter and select multiple vouchers to generate batch printable reports with automatic page breaks.
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

        {/* ── Filters Section ── */}
        <div className="p-4 bg-muted/10 border-b border-border/70 shrink-0 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="size-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search voucher, narration..."
                className="w-full h-8.5 pl-8 pr-7 rounded-lg border border-border bg-card text-xs font-medium text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary shadow-2xs"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="size-3" />
                </button>
              )}
            </div>

            {/* Voucher Type Dropdown */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-8.5 px-3 rounded-lg border border-border bg-card text-xs font-semibold text-foreground outline-none focus:ring-1 focus:ring-primary shadow-2xs cursor-pointer"
            >
              {TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* Approval Status Dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8.5 px-3 rounded-lg border border-border bg-card text-xs font-semibold text-foreground outline-none focus:ring-1 focus:ring-primary shadow-2xs cursor-pointer"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* Date Preset Dropdown */}
            <select
              value={datePreset}
              onChange={(e) => setDatePreset(e.target.value)}
              className="h-8.5 px-3 rounded-lg border border-border bg-card text-xs font-semibold text-foreground outline-none focus:ring-1 focus:ring-primary shadow-2xs cursor-pointer"
            >
              {DATE_PRESET_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  Date: {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Date Pickers & Reset Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
            {datePreset === 'custom' ? (
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-muted-foreground">From:</span>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="h-7.5 px-2 rounded-md border border-border bg-card text-xs font-mono font-medium text-foreground outline-none focus:ring-1 focus:ring-primary"
                />
                <span className="text-[11px] font-bold text-muted-foreground">To:</span>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="h-7.5 px-2 rounded-md border border-border bg-card text-xs font-mono font-medium text-foreground outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            ) : (
              <div className="text-[11px] text-muted-foreground font-medium">
                Tip: Click any row or use the checkbox to include vouchers in the print bundle.
              </div>
            )}

            <div className="flex items-center gap-2 ml-auto">
              {(search || typeFilter !== 'All' || statusFilter !== 'All' || datePreset !== 'all') && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-muted-foreground hover:text-foreground cursor-pointer px-2 py-1 rounded hover:bg-muted"
                >
                  <RotateCcw className="size-3" />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Selection Control Bar ── */}
        <div className="px-5 py-2.5 bg-muted/30 border-b border-border/80 flex items-center justify-between gap-3 text-xs shrink-0 select-none">
          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-2 font-bold text-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={isAllVisibleSelected}
                onChange={toggleSelectAllVisible}
                className="size-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
              />
              <span>Select All Visible ({filteredEntries.length})</span>
            </label>

            {selectedIds.size > 0 && (
              <button
                type="button"
                onClick={() => setSelectedIds(new Set())}
                className="text-[11px] font-semibold text-rose-600 hover:underline cursor-pointer"
              >
                Clear Selection
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="font-semibold text-foreground">
              <strong className="text-primary font-black">{selectedIds.size}</strong> selected
            </span>
            <span className="text-muted-foreground">·</span>
            <span className="font-mono font-bold text-foreground">
              Total: <span className="text-primary font-black">৳ {totalSelectedAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </span>
          </div>
        </div>

        {/* ── Scrollable Journal List ── */}
        <div className="overflow-y-auto sidebar-scroll flex-1 p-0">
          {filteredEntries.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <FileText className="size-9 text-muted-foreground/40 mx-auto" />
              <p className="text-sm font-bold text-foreground">No vouchers match the filters</p>
              <p className="text-xs text-muted-foreground">Try clearing search terms or resetting filters.</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-muted/40 border-b border-border text-[11px] font-bold uppercase tracking-wider text-muted-foreground sticky top-0 z-10 backdrop-blur-xs select-none">
                <tr>
                  <th className="py-2.5 px-4 w-10 text-center"></th>
                  <th className="py-2.5 px-3 min-w-[130px]">Voucher No</th>
                  <th className="py-2.5 px-3 min-w-[100px]">Date</th>
                  <th className="py-2.5 px-3 min-w-[70px]">Type</th>
                  <th className="py-2.5 px-3 min-w-[90px]">Status</th>
                  <th className="py-2.5 px-4">Narration / Account</th>
                  <th className="py-2.5 px-4 text-right min-w-[130px]">Amount (৳)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredEntries.map((entry) => {
                  const isChecked = selectedIds.has(entry.id);
                  const cfg = VOUCHER_TYPE_CONFIG[entry.voucherType];
                  const status = entry.approvalStatus || 'Approved';

                  return (
                    <tr
                      key={entry.id}
                      onClick={() => toggleRow(entry.id)}
                      className={`group transition-colors cursor-pointer select-none ${
                        isChecked
                          ? 'bg-primary/5 hover:bg-primary/10'
                          : 'hover:bg-muted/40'
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleRow(entry.id)}
                          className="size-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                        />
                      </td>

                      {/* Voucher No */}
                      <td className="py-3 px-3 font-mono font-bold whitespace-nowrap text-foreground">
                        {entry.voucherNo}
                      </td>

                      {/* Date */}
                      <td className="py-3 px-3 whitespace-nowrap text-muted-foreground font-mono">
                        {entry.voucherDate}
                      </td>

                      {/* Type Badge */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${cfg.color.badge}`}>
                          {cfg.shortCode}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${
                          status === 'Approved'
                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                            : status === 'Pending'
                            ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                            : 'bg-slate-100 text-slate-700 border-slate-300'
                        }`}>
                          {status}
                        </span>
                      </td>

                      {/* Narration */}
                      <td className="py-3 px-4 max-w-xs truncate text-muted-foreground">
                        <div className="font-medium text-foreground truncate">
                          {entry.headerAccountName || entry.voucherName || cfg.label}
                        </div>
                        <div className="text-[11px] truncate opacity-80" title={entry.narration}>
                          {entry.narration || 'No narration'}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-3 px-4 text-right font-mono font-bold whitespace-nowrap text-foreground">
                        ৳ {entry.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* ── Modal Footer ── */}
        <div className="px-5 py-3 border-t border-border/80 bg-muted/20 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <span>Selected for print:</span>
            <strong className="text-foreground font-bold">{selectedIds.size}</strong> voucher(s)
            {selectedIds.size > 0 && (
              <span className="font-mono font-bold text-primary">
                (৳ {totalSelectedAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })})
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border bg-background hover:bg-muted text-xs font-semibold text-foreground transition-all cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              id="confirm-bulk-print-btn"
              onClick={handlePrint}
              disabled={selectedIds.size === 0}
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95 ${
                selectedIds.size > 0
                  ? 'bg-primary text-primary-foreground hover:bg-primary/95 shadow-primary/20 ring-1 ring-primary/30'
                  : 'bg-muted/60 text-muted-foreground/50 border border-border/40 cursor-not-allowed shadow-none'
              }`}
            >
              <Printer className="size-4" />
              <span>Print Selected ({selectedIds.size})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
