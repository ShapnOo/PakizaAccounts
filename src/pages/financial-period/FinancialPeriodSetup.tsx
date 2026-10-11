import React, { useState } from 'react';
import {
  CalendarDays,
  Plus,
  Pencil,
  Trash2,
  Calendar,
  ChevronLeft,
  ChevronRight,
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<FiscalYear | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(fiscalYears.length / itemsPerPage));
  const currentItems = fiscalYears.slice(
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
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-5 pb-24 relative min-h-screen">
      {/* ── Page Header / Breadcrumb ── */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            CONFIGURATION
          </div>
          <h1 className="text-xl font-black text-foreground tracking-tight">
            Financial Period
          </h1>
        </div>
      </div>

      {/* ── Main Clean Table Card ── */}
      <div className="bg-card border border-border/80 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border/80 bg-muted/20 text-muted-foreground font-bold text-[11px]">
                <th className="py-3 px-6 w-16 text-center">SI</th>
                <th className="py-3 px-6">Name</th>
                <th className="py-3 px-6">Start</th>
                <th className="py-3 px-6">End</th>
                <th className="py-3 px-6 text-center">Lock</th>
                <th className="py-3 px-6 text-center">Status</th>
                <th className="py-3 px-6 text-center w-28">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    No financial periods found. Click the + button to create one.
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
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      {/* SI */}
                      <td className="py-3.5 px-6 text-center font-medium text-muted-foreground">
                        {si}
                      </td>

                      {/* Name */}
                      <td className="py-3.5 px-6 font-semibold text-foreground">
                        {fy.name || fy.code}
                      </td>

                      {/* Start Date */}
                      <td className="py-3.5 px-6 text-muted-foreground">
                        {formatDateDisplay(fy.startDate)}
                      </td>

                      {/* End Date */}
                      <td className="py-3.5 px-6 text-muted-foreground">
                        {formatDateDisplay(fy.endDate)}
                      </td>

                      {/* Lock Status Pill */}
                      <td className="py-3.5 px-6 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold tracking-tight text-white ${
                            isLocked ? 'bg-rose-500' : 'bg-emerald-500'
                          }`}
                        >
                          {isLocked ? 'Locked' : 'Unlocked'}
                        </span>
                      </td>

                      {/* Active Status Pill */}
                      <td className="py-3.5 px-6 text-center">
                        <span
                          className={`inline-block px-3.5 py-1 rounded-full text-[11px] font-bold tracking-tight text-white ${
                            isActive ? 'bg-emerald-500' : 'bg-slate-400'
                          }`}
                        >
                          {isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      {/* Action Icons */}
                      <td className="py-3.5 px-6 text-center">
                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(fy)}
                            title="Edit Period"
                            className="p-1 hover:text-foreground hover:bg-muted rounded transition-colors cursor-pointer"
                          >
                            <Pencil className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(fy.code)}
                            title="Delete Period"
                            className="p-1 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded transition-colors cursor-pointer"
                          >
                            <Trash2 className="size-3.5 text-rose-500" />
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
        <div className="px-6 py-3 border-t border-border/60 bg-muted/10 flex items-center justify-between text-xs text-muted-foreground">
          {/* Pagination Controls */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-2 py-1 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 font-medium"
            >
              <ChevronLeft className="size-3.5" />
              <span>Previous</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`size-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentPage === page
                    ? 'border border-border bg-background text-foreground shadow-2xs'
                    : 'hover:bg-muted text-muted-foreground'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-2 py-1 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 font-medium"
            >
              <span>Next</span>
              <ChevronRight className="size-3.5" />
            </button>
          </div>

          {/* Total Period Counter */}
          <div className="flex items-center gap-1.5 font-medium text-muted-foreground">
            <Calendar className="size-3.5 opacity-70" />
            <span>{fiscalYears.length} periods</span>
          </div>
        </div>
      </div>

      {/* ── Floating Action Button (+) ── */}
      <button
        type="button"
        onClick={handleOpenCreate}
        title="Create Financial Period"
        className="fixed bottom-8 right-8 size-13 rounded-full bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer z-40 group"
      >
        <Plus className="size-6 stroke-[2.5] group-hover:rotate-90 transition-transform duration-200" />
      </button>

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
