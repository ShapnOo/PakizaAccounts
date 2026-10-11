import React, { useState, useMemo } from 'react';
import {
  CalendarDays,
  Plus,
  Pencil,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Search,
  Filter,
} from 'lucide-react';
import { useFinancialPeriodStore } from '../../stores/financialPeriodStore';
import { FinancialPeriodModal } from '../../components/financial-period/FinancialPeriodModal';
import { FiscalYear } from '../../types/financialPeriod';

export const FinancialPeriodSetupPage: React.FC = () => {
  const {
    fiscalYears,
    createFiscalYear,
    updateFiscalYear,
    deleteFiscalYear,
  } = useFinancialPeriodStore();

  const [search, setSearch] = useState('');
  const [lockFilter, setLockFilter] = useState<'All' | 'Unlocked' | 'Locked'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<FiscalYear | null>(null);

  // Filtered periods
  const filteredYears = useMemo(() => {
    return fiscalYears.filter((fy) => {
      const isLocked = fy.isClosed;
      const isActive = fy.isActive !== false;

      if (lockFilter === 'Locked' && !isLocked) return false;
      if (lockFilter === 'Unlocked' && isLocked) return false;

      if (statusFilter === 'Active' && !isActive) return false;
      if (statusFilter === 'Inactive' && isActive) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const name = (fy.name || fy.code || '').toLowerCase();
        const start = (fy.startDate || '').toLowerCase();
        const end = (fy.endDate || '').toLowerCase();
        return name.includes(q) || start.includes(q) || end.includes(q);
      }
      return true;
    });
  }, [fiscalYears, search, lockFilter, statusFilter]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(filteredYears.length / itemsPerPage));
  const currentItems = filteredYears.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenCreate = () => {
    setEditingPeriod(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (fy: FiscalYear) => {
    setEditingPeriod(fy);
    setIsModalOpen(true);
  };

  const handleDelete = (code: string) => {
    if (window.confirm(`Are you sure you want to delete Financial Period "${code}"?`)) {
      deleteFiscalYear(code);
    }
  };

  const handleModalSubmit = (data: {
    name: string;
    startDate: string;
    endDate: string;
    lockStatus: 'Unlocked' | 'Locked';
    status: 'Active' | 'Inactive';
  }) => {
    if (editingPeriod) {
      updateFiscalYear(editingPeriod.code, {
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        isActive: data.status === 'Active',
        isClosed: data.lockStatus === 'Locked',
      });
    } else {
      createFiscalYear({
        code: data.name,
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        isActive: data.status === 'Active',
        isClosed: data.lockStatus === 'Locked',
      });
    }
    setIsModalOpen(false);
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'long',
        day: '2-digit',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-5 space-y-4">
      {/* ── Breadcrumb & Page Header ── */}
      <div className="space-y-3 pb-2">
        <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-muted-foreground/70 uppercase tracking-wider">
          <span>Home</span>
          <ChevronRight className="size-3 text-muted-foreground/40" />
          <span>Accounts Configuration</span>
          <ChevronRight className="size-3 text-muted-foreground/40" />
          <span className="text-primary font-black">Financial Period Setup</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-primary/10 text-primary grid place-items-center shadow-2xs">
              <CalendarDays className="size-4.5" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
                <span>Financial Period Setup</span>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {fiscalYears.length} Periods
                </span>
              </h1>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">
                Define accounting fiscal years, effective start and end dates, and transaction locking rules.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-1.5 h-8.5 px-3.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold shadow-sm shadow-primary/20 transition-all cursor-pointer whitespace-nowrap active:scale-95"
            >
              <Plus className="size-4 stroke-[2.5]" />
              <span>New Period</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Toolbar: Search & Filters ── */}
      <div className="bg-card border border-border/70 rounded-xl p-3 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search financial period name or date..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-8.5 pl-9 pr-3 rounded-lg bg-background border border-border/80 text-xs font-medium text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-2xs"
          />
        </div>

        {/* Right: Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Lock Filter */}
          <div className="flex items-center gap-1.5 bg-background border border-border/80 px-2.5 py-1 rounded-lg shadow-2xs">
            <Filter className="size-3 text-muted-foreground" />
            <select
              value={lockFilter}
              onChange={(e) => {
                setLockFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="text-xs font-semibold bg-transparent text-foreground outline-none cursor-pointer"
            >
              <option value="All">All Lock Statuses</option>
              <option value="Unlocked">Unlocked</option>
              <option value="Locked">Locked</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-background border border-border/80 px-2.5 py-1 rounded-lg shadow-2xs">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="text-xs font-semibold bg-transparent text-foreground outline-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Table Card ── */}
      <div className="border border-border/80 rounded-xl overflow-hidden shadow-2xs bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-muted/30 border-b border-border/70 text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="py-2.5 px-4 font-black w-14 text-center">SI</th>
                <th className="py-2.5 px-4 font-black">Name</th>
                <th className="py-2.5 px-4 font-black">Start</th>
                <th className="py-2.5 px-4 font-black">End</th>
                <th className="py-2.5 px-4 font-black text-center w-28">Lock</th>
                <th className="py-2.5 px-4 font-black text-center w-28">Status</th>
                <th className="py-2.5 px-4 font-black text-right w-24">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    <CalendarDays className="size-8 mx-auto text-muted-foreground/30 mb-2" />
                    <p className="text-sm font-semibold">No financial periods found</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      Click "New Period" to set up your accounting fiscal cycle.
                    </p>
                  </td>
                </tr>
              ) : (
                currentItems.map((fy, idx) => {
                  const si = (currentPage - 1) * itemsPerPage + idx + 1;
                  const isLocked = fy.isClosed;
                  const isActive = fy.isActive !== false;

                  return (
                    <tr
                      key={fy.id || fy.code}
                      className="hover:bg-muted/25 transition-colors group"
                    >
                      {/* SI */}
                      <td className="py-2.5 px-4 text-center font-mono text-[11px] font-semibold text-muted-foreground">
                        {si}
                      </td>

                      {/* Name */}
                      <td className="py-2.5 px-4 font-bold text-foreground">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{fy.name || fy.code}</span>
                          {fy.code && fy.name && fy.code !== fy.name && (
                            <span className="text-[10px] font-mono text-muted-foreground/70 bg-muted px-1.5 py-0.5 rounded">
                              {fy.code}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Start Date */}
                      <td className="py-2.5 px-4 text-foreground/80 font-medium">
                        {formatDateDisplay(fy.startDate)}
                      </td>

                      {/* End Date */}
                      <td className="py-2.5 px-4 text-foreground/80 font-medium">
                        {formatDateDisplay(fy.endDate)}
                      </td>

                      {/* Lock Status Badge */}
                      <td className="py-2.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border ${
                            isLocked
                              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25'
                              : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25'
                          }`}
                        >
                          <span
                            className={`size-1.5 rounded-full ${
                              isLocked ? 'bg-rose-500' : 'bg-emerald-500'
                            }`}
                          />
                          <span>{isLocked ? 'Locked' : 'Unlocked'}</span>
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="py-2.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border ${
                            isActive
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25'
                              : 'bg-muted text-muted-foreground border-border'
                          }`}
                        >
                          <span
                            className={`size-1.5 rounded-full ${
                              isActive ? 'bg-emerald-500' : 'bg-muted-foreground/40'
                            }`}
                          />
                          <span>{isActive ? 'Active' : 'Inactive'}</span>
                        </span>
                      </td>

                      {/* Action Icons */}
                      <td className="py-2.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(fy)}
                            title="Edit Period"
                            className="size-7 rounded-lg border border-border/60 hover:border-primary/40 hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all flex items-center justify-center cursor-pointer shadow-2xs"
                          >
                            <Pencil className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(fy.code)}
                            title="Delete Period"
                            className="size-7 rounded-lg border border-border/60 hover:border-rose-400/50 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-muted-foreground hover:text-rose-600 transition-all flex items-center justify-center cursor-pointer shadow-2xs"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Table Footer: Pagination & Count ── */}
        <div className="px-4 py-3 border-t border-border/60 bg-muted/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          {/* Record Count */}
          <div className="flex items-center gap-1.5 font-medium">
            <span>
              Showing{' '}
              <strong className="text-foreground">
                {filteredYears.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
              </strong>{' '}
              to{' '}
              <strong className="text-foreground">
                {Math.min(currentPage * itemsPerPage, filteredYears.length)}
              </strong>{' '}
              of <strong className="text-foreground">{filteredYears.length}</strong> periods
            </span>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-2.5 py-1 rounded-lg border border-border bg-card hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 font-semibold text-xs shadow-2xs"
              >
                <ChevronLeft className="size-3.5" />
                <span>Prev</span>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`size-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    currentPage === page
                      ? 'bg-primary text-primary-foreground shadow-2xs'
                      : 'border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-2.5 py-1 rounded-lg border border-border bg-card hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 font-semibold text-xs shadow-2xs"
              >
                <span>Next</span>
                <ChevronRight className="size-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Create / Edit Modal ── */}
      <FinancialPeriodModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        editPeriod={editingPeriod}
      />
    </div>
  );
};
