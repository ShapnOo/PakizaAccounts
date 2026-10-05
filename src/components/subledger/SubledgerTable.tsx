import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  Layers,
} from 'lucide-react';
import { SubledgerType, SubledgerEntry, SUBLEDGER_CONFIG } from '../../types/subledger';
import { useSubledgerStore } from '../../stores/subledgerStore';
import { SubledgerRow } from './SubledgerRow';
import { TableSkeleton } from './TableSkeleton';
import { EmptyState } from './EmptyState';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { MOCK_COMPANIES } from '../../mock/companies';

interface SubledgerTableProps {
  type: SubledgerType;
}

export const SubledgerTable: React.FC<SubledgerTableProps> = ({ type }) => {
  const navigate = useNavigate();
  const config = SUBLEDGER_CONFIG[type];

  // Store bindings
  const entries = useSubledgerStore((state) => state.entries);
  const loading = useSubledgerStore((state) => state.loading);
  const toggleActive = useSubledgerStore((state) => state.toggleActive);
  const remove = useSubledgerStore((state) => state.remove);
  const density = useSubledgerStore((state) => state.density);
  const setDensity = useSubledgerStore((state) => state.setDensity);

  // Local filtering & pagination state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [selectedCompany, setSelectedCompany] = useState<string>('All');
  const [pageSize, setPageSize] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Delete modal state
  const [deletingEntry, setDeletingEntry] = useState<SubledgerEntry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter entries for current subledger type
  const typeEntries = useMemo(() => {
    return entries.filter((e) => e.type === type);
  }, [entries, type]);

  // Apply search and dropdown filters
  const filteredEntries = useMemo(() => {
    return typeEntries.filter((item) => {
      // 1. Status Filter
      if (statusFilter !== 'All' && item.activeStatus !== statusFilter) {
        return false;
      }

      // 2. Company Filter
      if (
        selectedCompany !== 'All' &&
        !item.effectiveCompanyIds.includes(selectedCompany)
      ) {
        return false;
      }

      // 3. Search Filter (Name or Company IDs)
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesCompany = item.effectiveCompanyIds.some((cId) => {
          const comp = MOCK_COMPANIES.find((c) => c.id === cId);
          return (
            cId.toLowerCase().includes(query) ||
            (comp && comp.name.toLowerCase().includes(query))
          );
        });
        if (!matchesName && !matchesCompany) {
          return false;
        }
      }

      return true;
    });
  }, [typeEntries, statusFilter, selectedCompany, search]);

  // Pagination calculation
  const totalItems = filteredEntries.length;
  const effectivePageSize = pageSize === 0 ? totalItems || 1 : pageSize;
  const totalPages = Math.ceil(totalItems / effectivePageSize) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedEntries = useMemo(() => {
    if (pageSize === 0) return filteredEntries; // "All"
    const start = (safeCurrentPage - 1) * pageSize;
    return filteredEntries.slice(start, start + pageSize);
  }, [filteredEntries, safeCurrentPage, pageSize]);

  const handleEdit = (entry: SubledgerEntry) => {
    navigate(`/subledger/${entry.id}/edit`);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingEntry) return;
    setIsDeleting(true);
    try {
      await remove(deletingEntry.id);
      setDeletingEntry(null);
    } catch (err) {
      // Handled in store with toast
    } finally {
      setIsDeleting(false);
    }
  };

  const isFiltered =
    search.trim() !== '' || statusFilter !== 'All' || selectedCompany !== 'All';

  const clearAllFilters = () => {
    setSearch('');
    setStatusFilter('All');
    setSelectedCompany('All');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      {/* ── Section Header Row (Label + [New] button) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700">
            <Layers className="size-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">
                {config.label}
              </h2>
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {typeEntries.length} {typeEntries.length === 1 ? 'record' : 'records'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              {config.description}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate(`/subledger/new?type=${type}`)}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 rounded-lg shadow-sm transition-all cursor-pointer shrink-0"
        >
          <Plus className="size-4" />
          <span>New {config.singular}</span>
        </button>
      </div>

      {/* ── Toolbar (Search, Filter, Density) ── */}
      <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={`Search ${config.label.toLowerCase()} by name or company...`}
              className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg placeholder:text-slate-400 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Filter Dropdowns & Density Toggle */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium text-slate-500 hidden sm:inline">
                Status:
              </span>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as any);
                  setCurrentPage(1);
                }}
                className="h-8 px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active Only</option>
                <option value="Inactive">Inactive Only</option>
              </select>
            </div>

            {/* Company Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium text-slate-500 hidden sm:inline">
                Company:
              </span>
              <select
                value={selectedCompany}
                onChange={(e) => {
                  setSelectedCompany(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-8 px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer max-w-[150px] truncate"
              >
                <option value="All">All Companies</option>
                {MOCK_COMPANIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.id} — {c.name.replace(/Pakiza\s*/i, '')}
                  </option>
                ))}
              </select>
            </div>

            <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

            {/* Density Toggle */}
            <div className="flex items-center rounded-lg border border-slate-200 p-0.5 bg-slate-50">
              <button
                type="button"
                onClick={() => setDensity('comfortable')}
                className={[
                  'px-2 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer',
                  density === 'comfortable'
                    ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-800',
                ].join(' ')}
              >
                Comfortable
              </button>
              <button
                type="button"
                onClick={() => setDensity('compact')}
                className={[
                  'px-2 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer',
                  density === 'compact'
                    ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-800',
                ].join(' ')}
              >
                Compact
              </button>
            </div>

            {/* Reset Filters */}
            {isFiltered && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                title="Clear all filters"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Table Container ── */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {loading ? (
          <TableSkeleton rows={4} compact={density === 'compact'} />
        ) : paginatedEntries.length === 0 ? (
          <EmptyState
            type={type}
            isFiltered={isFiltered}
            onClearFilters={clearAllFilters}
            onAddNew={() => navigate(`/subledger/new?type=${type}`)}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/75 text-[11px] font-bold text-slate-600 uppercase tracking-wider select-none">
                  {/* Per-tab exact column name */}
                  <th className="px-4 py-2.5">
                    {config.nameColumnLabel}
                  </th>
                  <th className="px-4 py-2.5 w-36 whitespace-nowrap">
                    Active Status
                  </th>
                  <th className="px-4 py-2.5 hidden lg:table-cell">
                    Effective Company
                  </th>
                  <th className="px-4 py-2.5 w-16 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedEntries.map((entry) => (
                  <SubledgerRow
                    key={entry.id}
                    entry={entry}
                    density={density}
                    onEdit={handleEdit}
                    onToggleActive={toggleActive}
                    onDelete={(item) => setDeletingEntry(item)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Pagination Footer ── */}
        {!loading && filteredEntries.length > 0 && (
          <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-3">
              <span>
                Showing{' '}
                <strong className="text-slate-800 font-semibold">
                  {pageSize === 0
                    ? `1–${totalItems}`
                    : `${(safeCurrentPage - 1) * pageSize + 1}–${Math.min(
                        safeCurrentPage * pageSize,
                        totalItems
                      )}`}
                </strong>{' '}
                of <strong className="text-slate-800 font-semibold">{totalItems}</strong> entries
              </span>

              {/* Rows Per Page Picker */}
              <div className="flex items-center gap-1.5 pl-3 border-l border-slate-200">
                <span className="text-[11px] text-slate-500">Rows:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-0.5 rounded border border-slate-200 bg-white text-xs text-slate-700 cursor-pointer focus:outline-none"
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={0}>All</option>
                </select>
              </div>
            </div>

            {/* Pagination Controls */}
            {pageSize !== 0 && totalPages > 1 && (
              <div className="flex items-center gap-1.5 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={safeCurrentPage === 1}
                  className="p-1 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  title="Previous page"
                >
                  <ChevronLeft className="size-4" />
                </button>

                <span className="px-2.5 py-1 text-xs font-semibold text-slate-700">
                  Page {safeCurrentPage} of {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safeCurrentPage === totalPages}
                  className="p-1 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  title="Next page"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        entry={deletingEntry}
        isOpen={!!deletingEntry}
        onClose={() => setDeletingEntry(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
};
