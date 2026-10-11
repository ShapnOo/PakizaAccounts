import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { FiscalYear } from '../../types/financialPeriod';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    startDate: string;
    endDate: string;
    lockStatus: 'Unlocked' | 'Locked';
    status: 'Active' | 'Inactive';
  }) => void;
  editPeriod?: FiscalYear | null;
}

export const FinancialPeriodModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  editPeriod,
}) => {
  const [name, setName] = useState(editPeriod?.name || editPeriod?.code || '');
  const [startDate, setStartDate] = useState(editPeriod?.startDate || '');
  const [endDate, setEndDate] = useState(editPeriod?.endDate || '');
  const [lockStatus, setLockStatus] = useState<'Unlocked' | 'Locked'>(
    editPeriod?.isClosed ? 'Locked' : 'Unlocked'
  );
  const [status, setStatus] = useState<'Active' | 'Inactive'>(
    editPeriod?.isActive === false ? 'Inactive' : 'Active'
  );

  React.useEffect(() => {
    if (editPeriod) {
      setName(editPeriod.name || editPeriod.code || '');
      setStartDate(editPeriod.startDate || '');
      setEndDate(editPeriod.endDate || '');
      setLockStatus(editPeriod.isClosed ? 'Locked' : 'Unlocked');
      setStatus(editPeriod.isActive === false ? 'Inactive' : 'Active');
    } else {
      setName('2026-2027');
      setStartDate('2026-07-01');
      setEndDate('2027-06-30');
      setLockStatus('Unlocked');
      setStatus('Active');
    }
  }, [editPeriod, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({
      name,
      startDate,
      endDate,
      lockStatus,
      status,
    });
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4">
      <div className="bg-card text-card-foreground w-full max-w-md rounded-2xl border border-border shadow-2xl overflow-hidden animate-in fade-in-50 zoom-in-95">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-slate-900 text-white dark:bg-slate-800 flex items-center justify-center shadow-xs">
              <Sparkles className="size-4.5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">
                {editPeriod ? 'Edit Financial Period' : 'Create Financial Period'}
              </h2>
              <p className="text-[11px] text-muted-foreground">
                Define the window and lock rules
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80 flex items-center gap-1">
              Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. 2026-2027"
              className="w-full h-9 px-3 rounded-xl bg-card border border-border/80 text-xs text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-2xs"
            />
          </div>

          {/* Start Date & End Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80 flex items-center gap-1">
                Start Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full h-9 px-3 rounded-xl bg-card border border-border/80 text-xs text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-2xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80 flex items-center gap-1">
                End Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full h-9 px-3 rounded-xl bg-card border border-border/80 text-xs text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-2xs"
              />
            </div>
          </div>

          {/* Lock Status & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80 flex items-center gap-1">
                Lock Status <span className="text-rose-500">*</span>
              </label>
              <select
                value={lockStatus}
                onChange={(e) => setLockStatus(e.target.value as any)}
                className="w-full h-9 px-3 rounded-xl bg-card border border-border/80 text-xs text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-2xs cursor-pointer"
              >
                <option value="Unlocked">Unlocked</option>
                <option value="Locked">Locked</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80 flex items-center gap-1">
                Status <span className="text-rose-500">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full h-9 px-3 rounded-xl bg-card border border-border/80 text-xs text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-2xs cursor-pointer"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              {editPeriod ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
