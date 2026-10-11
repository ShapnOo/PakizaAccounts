import React, { useState, useMemo } from 'react';
import {
  FileText,
  Download,
  Printer,
  BookmarkPlus,
  RefreshCw,
  FolderTree,
  Table as TableIcon,
  ListFilter,
  Columns3,
  Calendar,
  ChevronRight,
  ChevronDown,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  Building2,
} from 'lucide-react';
import { AdvanceFilter } from '../../components/gl/AdvanceFilter';
import { useAdvanceFilterStore } from '../../stores/advanceFilterStore';
import { MOCK_GL_LINES, GLTransactionLine } from '../../mock/generalLedger';
import { MOCK_SUBSIDIARIES } from '../../mock/subsidiaries';
import { SearchableSelect } from '../../components/shared/SearchableSelect';
import { toast } from 'sonner';

type ViewMode = 'tree' | 'details' | 'list' | 'kanban';

export const GeneralLedgerPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('details');
  const [dateRangePreset, setDateRangePreset] = useState<string>('this-month');
  const [subLedgerFilter, setSubLedgerFilter] = useState<string>('');
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'Current Liabilities': true,
    'Current Assets': true,
  });

  // Advance filter state and compiled predicate
  const getPredicate = useAdvanceFilterStore((s) => s.getPredicate);
  const filterState = useAdvanceFilterStore((s) => s.state);
  const resetAdvanceFilter = useAdvanceFilterStore((s) => s.reset);

  const predicate = useMemo(() => {
    return getPredicate();
  }, [getPredicate, filterState]);

  // Filter lines using advance filter predicate + basic subledger filter
  const filteredLines = useMemo(() => {
    return MOCK_GL_LINES.filter((line) => {
      // Basic Sub-ledger filter
      if (subLedgerFilter && line.subsidiary !== subLedgerFilter) {
        return false;
      }
      // Advance Filter predicate
      return predicate(line);
    });
  }, [predicate, subLedgerFilter]);

  // Compute opening, debit, credit, closing balances
  const initialOpeningBalance = 25000; // Standard AP Partex opening balance
  const linesWithBalance = useMemo(() => {
    let currentBal = initialOpeningBalance;
    return filteredLines.map((line) => {
      // In Accounts Payable (Liability): Credit increases, Debit decreases
      const isLiabilityOrEquity =
        line.accountsHead.toLowerCase().includes('payable') ||
        line.accountsHead.toLowerCase().includes('liability');

      if (isLiabilityOrEquity) {
        currentBal = currentBal + (line.credit || 0) - (line.debit || 0);
      } else {
        currentBal = currentBal + (line.debit || 0) - (line.credit || 0);
      }
      return {
        ...line,
        balance: currentBal,
      };
    });
  }, [filteredLines]);

  const totalDebit = useMemo(
    () => filteredLines.reduce((acc, curr) => acc + (curr.debit || 0), 0),
    [filteredLines]
  );

  const totalCredit = useMemo(
    () => filteredLines.reduce((acc, curr) => acc + (curr.credit || 0), 0),
    [filteredLines]
  );

  const finalClosing = linesWithBalance.length > 0
    ? linesWithBalance[linesWithBalance.length - 1].balance || 0
    : initialOpeningBalance;

  // Sub-ledger options for the basic filter
  const subsidiaryOptions = useMemo(() => {
    return [
      { value: '', label: 'All Sub-Ledgers' },
      ...MOCK_SUBSIDIARIES.map((sub) => ({
        value: sub.name,
        label: sub.name,
        subLabel: sub.partyType,
      })),
    ];
  }, []);

  const toggleNode = (nodeName: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeName]: !prev[nodeName],
    }));
  };

  const handleExport = (type: 'excel' | 'pdf') => {
    toast.success(`Exporting General Ledger to ${type.toUpperCase()}...`);
  };

  const handleSaveCustomReport = () => {
    toast.success('Current General Ledger layout saved to Custom Reports');
  };

  return (
    <div className="p-4 md:p-6 space-y-4 max-w-[1600px] mx-auto min-h-screen bg-slate-50/50">
      {/* ── TOP TITLE & TOOLBAR BAR ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              General Ledger
            </h1>
            <span className="px-2 py-0.5 text-xs font-semibold rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
              FY 2025-2026
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time financial transactions, double-entry vouchers, and balance tracking
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View mode switcher */}
          <div className="inline-flex p-1 bg-slate-100 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('tree')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                viewMode === 'tree'
                  ? 'bg-white text-indigo-700 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FolderTree className="w-3.5 h-3.5" />
              <span>Tree View</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('details')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                viewMode === 'details'
                  ? 'bg-white text-indigo-700 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>GL Details</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-indigo-700 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('kanban')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                viewMode === 'kanban'
                  ? 'bg-white text-indigo-700 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Columns3 className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
          </div>

          <div className="h-6 w-px bg-slate-200 hidden sm:block" />

          {/* Save Custom Report */}
          <button
            type="button"
            onClick={handleSaveCustomReport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors shadow-xs"
          >
            <BookmarkPlus className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Save as Custom Report</span>
          </button>

          {/* Export Dropdown / Buttons */}
          <button
            type="button"
            onClick={() => handleExport('excel')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Excel</span>
          </button>
          <button
            type="button"
            onClick={() => handleExport('pdf')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* ── BASIC FILTER BAR ── */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Date Range Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Date:
            </span>
            <select
              value={dateRangePreset}
              onChange={(e) => setDateRangePreset(e.target.value)}
              className="h-8 px-2.5 text-xs font-medium rounded-md border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="today">Today</option>
              <option value="this-week">This Week</option>
              <option value="this-month">This Month</option>
              <option value="this-quarter">This Quarter</option>
              <option value="this-fiscal">This Fiscal Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          <div className="h-4 w-px bg-slate-200" />

          {/* Sub-Ledger Basic Filter */}
          <div className="flex items-center gap-2 min-w-[240px]">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              Sub-Ledger:
            </span>
            <div className="w-48">
              <SearchableSelect
                value={subLedgerFilter}
                onChange={setSubLedgerFilter}
                options={subsidiaryOptions}
                placeholder="All Sub-Ledgers"
                searchPlaceholder="Search subledger..."
                allowClear
                buttonClassName="h-8 text-xs font-normal border-slate-200"
                popoverWidth="min-w-[260px]"
              />
            </div>
          </div>
        </div>

        {/* Clear / Reset All Filters */}
        {(subLedgerFilter || dateRangePreset !== 'this-month' || filterState.conditions.length > 0) && (
          <button
            type="button"
            onClick={() => {
              setSubLedgerFilter('');
              setDateRangePreset('this-month');
              resetAdvanceFilter();
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/70 border border-rose-200/60 rounded-md transition-all cursor-pointer shadow-2xs"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>

      {/* ── ADVANCE FILTER (SHARED COMPONENT) ── */}
      <AdvanceFilter />

      {/* ── SUMMARY STATS BANNER ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Opening Balance
            </div>
            <div className="text-base font-bold text-slate-800 mt-0.5">
              ৳ {initialOpeningBalance.toLocaleString()}
            </div>
          </div>
          <div className="p-2 rounded-lg bg-slate-50 text-slate-600">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600">
              Total Debit
            </div>
            <div className="text-base font-bold text-emerald-700 mt-0.5">
              ৳ {totalDebit.toLocaleString()}
            </div>
          </div>
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-600">
              Total Credit
            </div>
            <div className="text-base font-bold text-amber-700 mt-0.5">
              ৳ {totalCredit.toLocaleString()}
            </div>
          </div>
          <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
            <ArrowDownLeft className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600">
              Closing Balance
            </div>
            <div className="text-base font-bold text-indigo-700 mt-0.5">
              ৳ {finalClosing.toLocaleString()}
            </div>
          </div>
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* ── DATA VIEW SECTION ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* VIEW 1: GL DETAILS VIEW */}
        {viewMode === 'details' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Voucher No</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Accounts Head</th>
                  <th className="py-2.5 px-3">Sub-Ledger</th>
                  <th className="py-2.5 px-3">Reference</th>
                  <th className="py-2.5 px-3">Narration</th>
                  <th className="py-2.5 px-3 text-right">Debit</th>
                  <th className="py-2.5 px-3 text-right">Credit</th>
                  <th className="py-2.5 px-3 text-right font-bold text-slate-700">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {/* Initial Opening Balance Line */}
                <tr className="bg-indigo-50/40 font-medium text-slate-600">
                  <td className="py-2 px-3 text-slate-400">—</td>
                  <td className="py-2 px-3 text-slate-400">—</td>
                  <td className="py-2 px-3 text-slate-400">—</td>
                  <td className="py-2 px-3 font-semibold text-indigo-900" colSpan={2}>
                    Opening Balance Forwarded
                  </td>
                  <td className="py-2 px-3 text-slate-400">—</td>
                  <td className="py-2 px-3 text-slate-500 italic">Pre-existing ledger balance</td>
                  <td className="py-2 px-3 text-right">—</td>
                  <td className="py-2 px-3 text-right">—</td>
                  <td className="py-2 px-3 text-right font-bold text-indigo-900">
                    ৳ {initialOpeningBalance.toLocaleString()}
                  </td>
                </tr>

                {linesWithBalance.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2 px-3 text-slate-600 whitespace-nowrap">{row.date}</td>
                    <td className="py-2 px-3 font-semibold text-indigo-600 whitespace-nowrap">
                      {row.voucherNo}
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap">
                      <span
                        className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                          row.voucherType === 'Payment'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : row.voucherType === 'Receive'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : row.voucherType === 'Journal'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {row.voucherType}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-medium text-slate-800 whitespace-nowrap">
                      {row.accountsHead}
                    </td>
                    <td className="py-2 px-3 text-slate-600 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-slate-400" />
                        {row.subsidiary}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-slate-500 whitespace-nowrap">{row.reference}</td>
                    <td className="py-2 px-3 text-slate-600 max-w-xs truncate" title={row.narration}>
                      {row.narration}
                    </td>
                    <td className="py-2 px-3 text-right font-medium text-emerald-600 whitespace-nowrap">
                      {row.debit > 0 ? `৳ ${row.debit.toLocaleString()}` : '—'}
                    </td>
                    <td className="py-2 px-3 text-right font-medium text-amber-600 whitespace-nowrap">
                      {row.credit > 0 ? `৳ ${row.credit.toLocaleString()}` : '—'}
                    </td>
                    <td className="py-2 px-3 text-right font-bold text-slate-900 whitespace-nowrap">
                      ৳ {row.balance?.toLocaleString()}
                    </td>
                  </tr>
                ))}

                {linesWithBalance.length === 0 && (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-slate-400 italic">
                      No ledger lines match the current advance filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50/90 border-t-2 border-slate-300 font-bold text-slate-800">
                  <td colSpan={7} className="py-2.5 px-3 uppercase tracking-wider text-right">
                    Total / Ending Closing:
                  </td>
                  <td className="py-2.5 px-3 text-right text-emerald-700 font-bold">
                    ৳ {totalDebit.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right text-amber-700 font-bold">
                    ৳ {totalCredit.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right text-indigo-700 font-extrabold text-sm">
                    ৳ {finalClosing.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {/* VIEW 2: TREE VIEW */}
        {viewMode === 'tree' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                  <th className="py-2.5 px-3">Accounts Head</th>
                  <th className="py-2.5 px-3">Sub-Ledger</th>
                  <th className="py-2.5 px-3 text-right">Opening</th>
                  <th className="py-2.5 px-3 text-right">Debit</th>
                  <th className="py-2.5 px-3 text-right">Credit</th>
                  <th className="py-2.5 px-3 text-right font-bold text-slate-700">Closing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {/* Liabilities Root */}
                <tr
                  onClick={() => toggleNode('Current Liabilities')}
                  className="bg-slate-50/60 hover:bg-slate-100 cursor-pointer select-none font-bold text-slate-900"
                >
                  <td className="py-2.5 px-3 flex items-center gap-1.5">
                    {expandedNodes['Current Liabilities'] ? (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    )}
                    <span>Current Liabilities</span>
                    <span className="text-[10px] text-slate-400 font-normal">#020100000000</span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 font-normal">Consolidated</td>
                  <td className="py-2.5 px-3 text-right">৳ 420,000</td>
                  <td className="py-2.5 px-3 text-right text-emerald-600">৳ 335,000</td>
                  <td className="py-2.5 px-3 text-right text-amber-600">৳ 545,000</td>
                  <td className="py-2.5 px-3 text-right font-bold text-indigo-900">৳ 630,000</td>
                </tr>

                {expandedNodes['Current Liabilities'] && (
                  <>
                    <tr className="hover:bg-slate-50 pl-6 bg-white">
                      <td className="py-2 px-3 pl-8 text-slate-700 font-semibold flex items-center gap-2">
                        <span className="w-2 h-px bg-slate-300" />
                        Accounts Payable
                        <span className="text-[10px] text-slate-400 font-normal">#020101000000</span>
                      </td>
                      <td className="py-2 px-3 text-slate-600">Partex Tissue Ltd.</td>
                      <td className="py-2 px-3 text-right">৳ 25,000</td>
                      <td className="py-2 px-3 text-right text-emerald-600">
                        ৳ {totalDebit.toLocaleString()}
                      </td>
                      <td className="py-2 px-3 text-right text-amber-600">
                        ৳ {totalCredit.toLocaleString()}
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-indigo-700">
                        ৳ {finalClosing.toLocaleString()}
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50 pl-6 bg-white">
                      <td className="py-2 px-3 pl-8 text-slate-700 font-semibold flex items-center gap-2">
                        <span className="w-2 h-px bg-slate-300" />
                        Accounts Payable
                        <span className="text-[10px] text-slate-400 font-normal">#020101000000</span>
                      </td>
                      <td className="py-2 px-3 text-slate-600">Square Pharmaceuticals Ltd.</td>
                      <td className="py-2 px-3 text-right">৳ 150,000</td>
                      <td className="py-2 px-3 text-right text-emerald-600">৳ 200,000</td>
                      <td className="py-2 px-3 text-right text-amber-600">৳ 340,000</td>
                      <td className="py-2 px-3 text-right font-bold text-slate-800">৳ 290,000</td>
                    </tr>
                  </>
                )}

                {/* Assets Root */}
                <tr
                  onClick={() => toggleNode('Current Assets')}
                  className="bg-slate-50/60 hover:bg-slate-100 cursor-pointer select-none font-bold text-slate-900"
                >
                  <td className="py-2.5 px-3 flex items-center gap-1.5">
                    {expandedNodes['Current Assets'] ? (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    )}
                    <span>Current Assets</span>
                    <span className="text-[10px] text-slate-400 font-normal">#010100000000</span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 font-normal">Consolidated</td>
                  <td className="py-2.5 px-3 text-right">৳ 880,000</td>
                  <td className="py-2.5 px-3 text-right text-emerald-600">৳ 200,000</td>
                  <td className="py-2.5 px-3 text-right text-amber-600">৳ 210,000</td>
                  <td className="py-2.5 px-3 text-right font-bold text-indigo-900">৳ 870,000</td>
                </tr>

                {expandedNodes['Current Assets'] && (
                  <>
                    <tr className="hover:bg-slate-50 pl-6 bg-white">
                      <td className="py-2 px-3 pl-8 text-slate-700 font-semibold flex items-center gap-2">
                        <span className="w-2 h-px bg-slate-300" />
                        Accounts Receivable
                        <span className="text-[10px] text-slate-400 font-normal">#010103000000</span>
                      </td>
                      <td className="py-2 px-3 text-slate-600">Apex Footwear Ltd.</td>
                      <td className="py-2 px-3 text-right">৳ 320,000</td>
                      <td className="py-2 px-3 text-right text-emerald-600">৳ 150,000</td>
                      <td className="py-2 px-3 text-right text-amber-600">৳ 210,000</td>
                      <td className="py-2 px-3 text-right font-bold text-slate-800">৳ 260,000</td>
                    </tr>
                    <tr className="hover:bg-slate-50 pl-6 bg-white">
                      <td className="py-2 px-3 pl-8 text-slate-700 font-semibold flex items-center gap-2">
                        <span className="w-2 h-px bg-slate-300" />
                        Cash in Hand
                        <span className="text-[10px] text-slate-400 font-normal">#010101010000</span>
                      </td>
                      <td className="py-2 px-3 text-slate-600">General Utilities Corporation</td>
                      <td className="py-2 px-3 text-right">৳ 120,000</td>
                      <td className="py-2 px-3 text-right text-emerald-600">৳ 50,000</td>
                      <td className="py-2 px-3 text-right text-amber-600">৳ 0</td>
                      <td className="py-2 px-3 text-right font-bold text-slate-800">৳ 170,000</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* VIEW 3: LIST VIEW */}
        {viewMode === 'list' && (
          <div className="p-4 space-y-3">
            <div className="text-xs text-slate-500 font-medium">
              Flat ledger view with compact density ({filteredLines.length} items):
            </div>
            <div className="space-y-2">
              {filteredLines.map((line) => (
                <div
                  key={line.id}
                  className="p-3 border border-slate-200 rounded-lg hover:border-indigo-300 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-2"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-indigo-600">{line.voucherNo}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 font-semibold">
                        {line.voucherType}
                      </span>
                      <span className="text-slate-400 text-xs">·</span>
                      <span className="text-slate-600 font-medium">{line.date}</span>
                    </div>
                    <div className="text-xs text-slate-800 font-medium">
                      {line.accountsHead} — <span className="text-slate-600">{line.subsidiary}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">{line.narration}</div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-semibold">
                    {line.debit > 0 && (
                      <span className="text-emerald-600">
                        Dr: ৳ {line.debit.toLocaleString()}
                      </span>
                    )}
                    {line.credit > 0 && (
                      <span className="text-amber-600">
                        Cr: ৳ {line.credit.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 4: KANBAN VIEW */}
        {viewMode === 'kanban' && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            {(['Journal', 'Payment', 'Receive', 'Contra'] as const).map((type) => {
              const colLines = filteredLines.filter((l) => l.voucherType === type);
              return (
                <div key={type} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="font-bold text-xs uppercase tracking-wider text-slate-700">
                      {type}
                    </span>
                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-white text-slate-600 rounded border border-slate-200">
                      {colLines.length}
                    </span>
                  </div>
                  <div className="space-y-2 max-h-[500px] overflow-y-auto">
                    {colLines.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-xs text-indigo-600">
                            {item.voucherNo}
                          </span>
                          <span className="text-[10px] text-slate-400">{item.date}</span>
                        </div>
                        <div className="text-xs font-medium text-slate-800">
                          {item.accountsHead}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {item.subsidiary}
                        </div>
                        <div className="flex justify-between items-center text-xs font-bold pt-1 border-t border-slate-100">
                          <span className="text-slate-400 text-[10px]">Amount:</span>
                          <span className={item.debit > 0 ? 'text-emerald-600' : 'text-amber-600'}>
                            ৳ {(item.debit || item.credit).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                    {colLines.length === 0 && (
                      <div className="py-6 text-center text-xs text-slate-400 italic">
                        No vouchers
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
