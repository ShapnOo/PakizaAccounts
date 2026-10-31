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
  Building2,
  Coins,
  SlidersHorizontal,
} from 'lucide-react';
import { AdvanceFilter } from '../../components/gl/AdvanceFilter';
import { useAdvanceFilterStore } from '../../stores/advanceFilterStore';
import {
  MOCK_GL_LINES,
  GLTransactionLine,
  MOCK_GL_TREE_DATA,
  GLAccountSummary,
} from '../../mock/generalLedger';
import {
  REPORT_CURRENCIES,
  ValueShowInMode,
  VALUE_SHOW_IN_LABELS,
  formatCurrencyAmount,
  getCurrencySymbol,
} from '../../lib/currencyConversion';
import { toast } from 'sonner';

type ViewMode = 'tree' | 'details' | 'list' | 'kanban';

export const GeneralLedgerPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('details');
  const [dateRangePreset, setDateRangePreset] = useState<string>('this-month');
  const [currency, setCurrency] = useState<string>('BDT');
  const [valueShowIn, setValueShowIn] = useState<ValueShowInMode>('actual');
  const [showSubLedger, setShowSubLedger] = useState<boolean>(true);
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

  // Filter lines using advance filter predicate
  const filteredLines = useMemo(() => {
    return MOCK_GL_LINES.filter((line) => {
      return predicate(line);
    });
  }, [predicate]);

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

  // Tree View data: when showSubLedger is false, aggregate children by accountsHead
  const treeData = useMemo(() => {
    if (showSubLedger) {
      return MOCK_GL_TREE_DATA;
    }

    // When sub-ledger is unchecked: group children by accountsHead so e.g. Accounts Payable appears only once
    return MOCK_GL_TREE_DATA.map((group) => {
      if (!group.children) return group;

      const headMap = new Map<string, GLAccountSummary>();

      group.children.forEach((child) => {
        const existing = headMap.get(child.accountsHead);
        if (!existing) {
          headMap.set(child.accountsHead, {
            ...child,
            subsidiary: '',
          });
        } else {
          existing.openingBalance += child.openingBalance;
          existing.totalDebit += child.totalDebit;
          existing.totalCredit += child.totalCredit;
          existing.closingBalance += child.closingBalance;
        }
      });

      return {
        ...group,
        children: Array.from(headMap.values()),
      };
    });
  }, [showSubLedger]);

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
              className="h-8 px-2.5 text-xs font-medium rounded-md border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
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

          {/* Currency Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-indigo-600" />
              Currency:
            </span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="h-8 px-2.5 text-xs font-semibold rounded-md border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-2xs hover:border-slate-300"
            >
              {REPORT_CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c} ({getCurrencySymbol(c)})
                </option>
              ))}
            </select>
          </div>

          <div className="h-4 w-px bg-slate-200" />

          {/* Value show In Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
              Value show In:
            </span>
            <select
              value={valueShowIn}
              onChange={(e) => setValueShowIn(e.target.value as ValueShowInMode)}
              className="h-8 px-2.5 text-xs font-semibold rounded-md border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-2xs hover:border-slate-300"
            >
              {VALUE_SHOW_IN_LABELS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="h-4 w-px bg-slate-200" />

          {/* Sub-Ledger Checkbox Filter */}
          <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 cursor-pointer transition select-none shadow-2xs">
            <input
              type="checkbox"
              checked={showSubLedger}
              onChange={(e) => setShowSubLedger(e.target.checked)}
              className="size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
            />
            <span className="flex items-center gap-1.5 font-semibold text-slate-700">
              <Building2 className="w-3.5 h-3.5 text-indigo-600" />
              Sub-Ledger
            </span>
          </label>
        </div>

        {/* Clear / Reset All Filters */}
        {(!showSubLedger ||
          dateRangePreset !== 'this-month' ||
          currency !== 'BDT' ||
          valueShowIn !== 'actual' ||
          filterState.conditions.length > 0) && (
          <button
            type="button"
            onClick={() => {
              setShowSubLedger(true);
              setDateRangePreset('this-month');
              setCurrency('BDT');
              setValueShowIn('actual');
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
                  {showSubLedger && <th className="py-2.5 px-3">Sub-Ledger</th>}
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
                  <td
                    className="py-2 px-3 font-semibold text-indigo-900"
                    colSpan={showSubLedger ? 2 : 1}
                  >
                    Opening Balance Forwarded
                  </td>
                  <td className="py-2 px-3 text-slate-400">—</td>
                  <td className="py-2 px-3 text-slate-500 italic">Pre-existing ledger balance</td>
                  <td className="py-2 px-3 text-right">—</td>
                  <td className="py-2 px-3 text-right">—</td>
                  <td
                    className="py-2 px-3 text-right font-bold text-indigo-900"
                    title={`Raw: ${formatCurrencyAmount(initialOpeningBalance, currency, false, 'actual')}`}
                  >
                    {formatCurrencyAmount(initialOpeningBalance, currency, false, valueShowIn)}
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
                    {showSubLedger && (
                      <td className="py-2 px-3 text-slate-600 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          {row.subsidiary}
                        </span>
                      </td>
                    )}
                    <td className="py-2 px-3 text-slate-500 whitespace-nowrap">{row.reference}</td>
                    <td className="py-2 px-3 text-slate-600 max-w-xs truncate" title={row.narration}>
                      {row.narration}
                    </td>
                    <td
                      className="py-2 px-3 text-right font-medium text-emerald-600 whitespace-nowrap"
                      title={row.debit > 0 ? `Raw: ${formatCurrencyAmount(row.debit, currency, false, 'actual')}` : undefined}
                    >
                      {formatCurrencyAmount(row.debit, currency, true, valueShowIn)}
                    </td>
                    <td
                      className="py-2 px-3 text-right font-medium text-amber-600 whitespace-nowrap"
                      title={row.credit > 0 ? `Raw: ${formatCurrencyAmount(row.credit, currency, false, 'actual')}` : undefined}
                    >
                      {formatCurrencyAmount(row.credit, currency, true, valueShowIn)}
                    </td>
                    <td
                      className="py-2 px-3 text-right font-bold text-slate-900 whitespace-nowrap"
                      title={`Raw: ${formatCurrencyAmount(row.balance || 0, currency, false, 'actual')}`}
                    >
                      {formatCurrencyAmount(row.balance || 0, currency, false, valueShowIn)}
                    </td>
                  </tr>
                ))}

                {linesWithBalance.length === 0 && (
                  <tr>
                    <td
                      colSpan={showSubLedger ? 10 : 9}
                      className="py-12 text-center text-slate-400 italic"
                    >
                      No ledger lines match the current advance filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50/90 border-t-2 border-slate-300 font-bold text-slate-800">
                  <td
                    colSpan={showSubLedger ? 7 : 6}
                    className="py-2.5 px-3 uppercase tracking-wider text-right"
                  >
                    Total / Ending Closing:
                  </td>
                  <td
                    className="py-2.5 px-3 text-right text-emerald-700 font-bold"
                    title={`Raw: ${formatCurrencyAmount(totalDebit, currency, false, 'actual')}`}
                  >
                    {formatCurrencyAmount(totalDebit, currency, false, valueShowIn)}
                  </td>
                  <td
                    className="py-2.5 px-3 text-right text-amber-700 font-bold"
                    title={`Raw: ${formatCurrencyAmount(totalCredit, currency, false, 'actual')}`}
                  >
                    {formatCurrencyAmount(totalCredit, currency, false, valueShowIn)}
                  </td>
                  <td
                    className="py-2.5 px-3 text-right text-indigo-700 font-extrabold text-sm"
                    title={`Raw: ${formatCurrencyAmount(finalClosing, currency, false, 'actual')}`}
                  >
                    {formatCurrencyAmount(finalClosing, currency, false, valueShowIn)}
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
                  {showSubLedger && <th className="py-2.5 px-3">Sub-Ledger</th>}
                  <th className="py-2.5 px-3 text-right">Opening</th>
                  <th className="py-2.5 px-3 text-right">Debit</th>
                  <th className="py-2.5 px-3 text-right">Credit</th>
                  <th className="py-2.5 px-3 text-right font-bold text-slate-700">Closing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {treeData.map((group) => {
                  const isExpanded = expandedNodes[group.accountsHead] ?? true;
                  return (
                    <React.Fragment key={group.accountCode || group.accountsHead}>
                      {/* Root / Group row */}
                      <tr
                        onClick={() => toggleNode(group.accountsHead)}
                        className="bg-slate-50/60 hover:bg-slate-100 cursor-pointer select-none font-bold text-slate-900 transition-colors"
                      >
                        <td className="py-2.5 px-3 flex items-center gap-1.5">
                          {isExpanded ? (
                            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                          )}
                          <span>{group.accountsHead}</span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            #{group.accountCode}
                          </span>
                        </td>
                        {showSubLedger && (
                          <td className="py-2.5 px-3 text-slate-500 font-normal">
                            {group.subsidiary}
                          </td>
                        )}
                        <td className="py-2.5 px-3 text-right">
                          {formatCurrencyAmount(group.openingBalance, currency, false)}
                        </td>
                        <td className="py-2.5 px-3 text-right text-emerald-600">
                          {formatCurrencyAmount(group.totalDebit, currency, false)}
                        </td>
                        <td className="py-2.5 px-3 text-right text-amber-600">
                          {formatCurrencyAmount(group.totalCredit, currency, false)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-indigo-900">
                          {formatCurrencyAmount(group.closingBalance, currency, false)}
                        </td>
                      </tr>

                      {/* Children rows */}
                      {isExpanded &&
                        group.children?.map((child, idx) => (
                          <tr
                            key={`${child.accountsHead}-${child.subsidiary || idx}`}
                            className="hover:bg-slate-50 bg-white transition-colors"
                          >
                            <td className="py-2 px-3 pl-8 text-slate-700 font-semibold flex items-center gap-2">
                              <span className="w-2 h-px bg-slate-300" />
                              {child.accountsHead}
                              <span className="text-[10px] text-slate-400 font-normal">
                                #{child.accountCode}
                              </span>
                            </td>
                            {showSubLedger && (
                              <td className="py-2 px-3 text-slate-600">{child.subsidiary}</td>
                            )}
                            <td className="py-2 px-3 text-right">
                              {formatCurrencyAmount(child.openingBalance, currency, false)}
                            </td>
                            <td className="py-2 px-3 text-right text-emerald-600">
                              {formatCurrencyAmount(child.totalDebit, currency, false)}
                            </td>
                            <td className="py-2 px-3 text-right text-amber-600">
                              {formatCurrencyAmount(child.totalCredit, currency, false)}
                            </td>
                            <td className="py-2 px-3 text-right font-bold text-slate-800">
                              {formatCurrencyAmount(child.closingBalance, currency, false)}
                            </td>
                          </tr>
                        ))}
                    </React.Fragment>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50/90 border-t-2 border-slate-300 font-bold text-slate-800">
                  <td
                    colSpan={showSubLedger ? 2 : 1}
                    className="py-2.5 px-3 uppercase tracking-wider text-right"
                  >
                    Consolidated Total:
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    {formatCurrencyAmount(
                      treeData.reduce((acc, g) => acc + g.openingBalance, 0),
                      currency,
                      false
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right text-emerald-700">
                    {formatCurrencyAmount(
                      treeData.reduce((acc, g) => acc + g.totalDebit, 0),
                      currency,
                      false
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right text-amber-700">
                    {formatCurrencyAmount(
                      treeData.reduce((acc, g) => acc + g.totalCredit, 0),
                      currency,
                      false
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right text-indigo-700 font-extrabold text-sm">
                    {formatCurrencyAmount(
                      treeData.reduce((acc, g) => acc + g.closingBalance, 0),
                      currency,
                      false
                    )}
                  </td>
                </tr>
              </tfoot>
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
                      {line.accountsHead}{' '}
                      {showSubLedger && line.subsidiary && (
                        <>
                          — <span className="text-slate-600">{line.subsidiary}</span>
                        </>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500">{line.narration}</div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-semibold">
                    {line.debit > 0 && (
                      <span className="text-emerald-600">
                        Dr: {formatCurrencyAmount(line.debit, currency, false)}
                      </span>
                    )}
                    {line.credit > 0 && (
                      <span className="text-amber-600">
                        Cr: {formatCurrencyAmount(line.credit, currency, false)}
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
                <div
                  key={type}
                  className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2"
                >
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
                        {showSubLedger && item.subsidiary && (
                          <div className="text-[11px] text-slate-500 truncate">
                            {item.subsidiary}
                          </div>
                        )}
                        <div className="flex justify-between items-center text-xs font-bold pt-1 border-t border-slate-100">
                          <span className="text-slate-400 text-[10px]">Amount:</span>
                          <span
                            className={
                              item.debit > 0 ? 'text-emerald-600' : 'text-amber-600'
                            }
                          >
                            {formatCurrencyAmount(item.debit || item.credit, currency, false)}
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
