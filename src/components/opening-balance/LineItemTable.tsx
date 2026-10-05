import React, { useState, useMemo } from 'react';
import { OpeningBalanceLine } from '../../types/openingBalance';
import { LineItemRow } from './LineItemRow';
import { TotalsFooter } from './TotalsFooter';
import { TableSkeleton } from './TableSkeleton';
import { EmptyState } from './EmptyState';
import { Search, X, Filter, Plus, FileSpreadsheet } from 'lucide-react';
import { useOpeningMasterLookups } from '../../hooks/useOpeningMasterLookups';
import { useCustomFields } from '../../hooks/useCustomFields';

interface LineItemTableProps {
  lines: OpeningBalanceLine[];
  loading: boolean;
  onAddLine: () => void;
  onEditLine: (line: OpeningBalanceLine) => void;
  onDuplicateLine: (id: string) => void;
  onDeleteLine: (line: OpeningBalanceLine) => void;
  totalDebitBDT: number;
  totalCreditBDT: number;
  difference: number;
  balanced: boolean;
  shake?: boolean;
}

export const LineItemTable: React.FC<LineItemTableProps> = ({
  lines,
  loading,
  onAddLine,
  onEditLine,
  onDuplicateLine,
  onDeleteLine,
  totalDebitBDT,
  totalCreditBDT,
  difference,
  balanced,
  shake,
}) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'debit' | 'credit'>('all');

  const { getAccount, getCostCenter, getSubsidiary, getEmployee, getVehicle } =
    useOpeningMasterLookups();

  const { fields: customFields } = useCustomFields('opening-balance');

  const filteredLines = useMemo(() => {
    return lines.filter((line) => {
      // 1. Balance Direction Filter
      const hasDebit = (line.debitBDT && line.debitBDT > 0) || (line.debit && line.debit > 0);
      const hasCredit = (line.creditBDT && line.creditBDT > 0) || (line.credit && line.credit > 0);

      if (typeFilter === 'debit' && !hasDebit) return false;
      if (typeFilter === 'credit' && !hasCredit) return false;

      // 2. Search Query Filter
      if (search.trim()) {
        const q = search.toLowerCase();
        const account = getAccount(line.accountHeadId);
        const costCenter = getCostCenter(line.costCenterId);
        const subsidiary = getSubsidiary(line.subsidiaryId);
        const employee = getEmployee(line.employeeId);
        const vehicle = getVehicle(line.vehicleId);

        const matchesAccount =
          account?.name.toLowerCase().includes(q) ||
          account?.code?.toLowerCase().includes(q) ||
          line.accountHeadId.toLowerCase().includes(q);

        const matchesCostCenter = costCenter?.name.toLowerCase().includes(q);
        const matchesSubsidiary = subsidiary?.name.toLowerCase().includes(q);
        const matchesEmployee = employee?.name.toLowerCase().includes(q);
        const matchesVehicle = vehicle?.name.toLowerCase().includes(q);
        const matchesRef = line.reference?.toLowerCase().includes(q);
        const matchesDesc = line.description?.toLowerCase().includes(q);

        if (
          !matchesAccount &&
          !matchesCostCenter &&
          !matchesSubsidiary &&
          !matchesEmployee &&
          !matchesVehicle &&
          !matchesRef &&
          !matchesDesc
        ) {
          return false;
        }
      }

      return true;
    });
  }, [lines, search, typeFilter, getAccount, getCostCenter, getSubsidiary, getEmployee, getVehicle]);

  const isFiltered = search.trim() !== '' || typeFilter !== 'all';

  return (
    <div className="space-y-3">
      {/* ── Search & Filter Toolbar ── */}
      <div className="bg-card border border-border/80 rounded-xl p-3 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by account head, code, reference, subsidiary..."
              className="w-full pl-9 pr-8 py-1.5 text-xs bg-muted/40 border border-border rounded-lg placeholder:text-muted-foreground/60 text-foreground focus:bg-background focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1.5">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="h-8 px-2.5 rounded-lg border border-border bg-card text-xs font-semibold text-foreground outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="all">All Lines</option>
              <option value="debit">Debit Lines Only</option>
              <option value="credit">Credit Lines Only</option>
            </select>
          </div>
        </div>

        {/* Right count indicator & Quick Add button */}
        <div className="flex items-center gap-3">
          <div className="text-xs text-muted-foreground flex items-center gap-1.5">
            <span>
              Showing <strong className="text-foreground">{filteredLines.length}</strong> of{' '}
              <strong className="text-foreground">{lines.length}</strong> entries
            </span>
          </div>

          <button
            type="button"
            onClick={onAddLine}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800 text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors cursor-pointer shadow-2xs"
          >
            <Plus className="size-3.5" />
            <span>Add Entry</span>
          </button>
        </div>
      </div>

      {/* ── Main Data Table Container ── */}
      <div className="border border-border/80 rounded-xl overflow-hidden shadow-2xs bg-card">
        <div className="overflow-x-auto sidebar-scroll">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-muted/50 border-b border-border text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap select-none">
              <tr>
                <th className="py-2.5 px-3 w-10 text-center">#</th>
                <th className="py-2.5 px-3 min-w-[200px]">Accounts Head</th>
                <th className="py-2.5 px-2.5 min-w-[130px]">Cost Center</th>
                <th className="py-2.5 px-2.5 min-w-[150px]">Subsidiary</th>
                <th className="py-2.5 px-2.5 min-w-[120px]">Employee</th>
                <th className="py-2.5 px-2.5 min-w-[130px]">Vehicles</th>
                <th className="py-2.5 px-2.5 min-w-[110px]">Reference</th>

                {/* Dynamic Custom Fields */}
                {customFields.map((cf) => (
                  <th
                    key={cf.id}
                    className="py-2.5 px-2.5 min-w-[130px] bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-300 border-x border-indigo-100/50 dark:border-indigo-900/30"
                  >
                    <div className="flex items-center gap-1">
                      <span>{cf.label}</span>
                      {cf.mandatory && <span className="text-rose-500 font-bold">*</span>}
                    </div>
                  </th>
                ))}

                <th className="py-2.5 px-2.5 min-w-[120px]">Currency / Rate</th>
                <th className="py-2.5 px-3 text-right w-32 bg-emerald-500/5 text-emerald-800 dark:text-emerald-300">
                  Debit (BDT)
                </th>
                <th className="py-2.5 px-3 text-right w-32 bg-rose-500/5 text-rose-800 dark:text-rose-300">
                  Credit (BDT)
                </th>
                <th className="py-2.5 px-3 text-right w-24">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={11 + customFields.length} className="p-0">
                    <TableSkeleton />
                  </td>
                </tr>
              ) : lines.length === 0 ? (
                <tr>
                  <td colSpan={11 + customFields.length}>
                    <EmptyState onAddLine={onAddLine} />
                  </td>
                </tr>
              ) : filteredLines.length === 0 ? (
                <tr>
                  <td colSpan={11 + customFields.length} className="py-12 text-center text-xs text-muted-foreground space-y-2">
                    <p className="font-semibold text-foreground">No entries match your search criteria</p>
                    <p className="text-[11px]">Try clearing your search keyword or balance direction filter.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearch('');
                        setTypeFilter('all');
                      }}
                      className="mt-2 text-indigo-600 font-bold hover:underline cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredLines.map((line, idx) => (
                  <LineItemRow
                    key={line.id}
                    line={line}
                    index={idx}
                    customFields={customFields}
                    onEdit={onEditLine}
                    onDuplicate={onDuplicateLine}
                    onDelete={onDeleteLine}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Totals Summary Footer ── */}
        {!loading && lines.length > 0 && (
          <TotalsFooter
            totalDebitBDT={totalDebitBDT}
            totalCreditBDT={totalCreditBDT}
            difference={difference}
            balanced={balanced}
            shake={shake}
          />
        )}
      </div>
    </div>
  );
};
