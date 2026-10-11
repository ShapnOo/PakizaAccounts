import React, { useState } from 'react';
import { X, Calendar, Plus, Check, AlertCircle } from 'lucide-react';
import { COMPANY_LIST } from '../../hooks/useConfigState';
import { toast } from 'sonner';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (payload: {
    startYear: number;
    name?: string;
    startDate: string;
    endDate: string;
    retainedEarningsAccount?: string;
    effectiveCompanies?: string[];
  }) => boolean;
}

export const NewFiscalYearModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const currentYear = new Date().getFullYear();
  const [startYear, setStartYear] = useState<number>(2028);
  const [name, setName] = useState<string>('Fiscal Year 2028-2029');
  const [startDate, setStartDate] = useState<string>('2028-07-01');
  const [endDate, setEndDate] = useState<string>('2029-06-30');
  const [retainedAccount, setRetainedAccount] = useState<string>('3101-001');
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([...COMPANY_LIST]);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const fyCode = `${startYear}-${startYear + 1}`;

  const handleYearChange = (year: number) => {
    setStartYear(year);
    setName(`Fiscal Year ${year}-${year + 1}`);
    setStartDate(`${year}-07-01`);
    setEndDate(`${year + 1}-06-30`);
  };

  const handleToggleCompany = (company: string) => {
    if (selectedCompanies.includes(company)) {
      if (selectedCompanies.length === 1) {
        toast.error('At least one company must be selected');
        return;
      }
      setSelectedCompanies(selectedCompanies.filter((c) => c !== company));
    } else {
      setSelectedCompanies([...selectedCompanies, company]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startYear || startYear < 2000 || startYear > 2100) {
      toast.error('Please enter a valid start year');
      return;
    }

    const success = onCreate({
      startYear,
      name,
      startDate,
      endDate,
      retainedEarningsAccount: retainedAccount,
      effectiveCompanies: selectedCompanies,
    });

    if (success) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl rounded-xl border border-border bg-card p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Calendar className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-foreground">Create New Fiscal Year</h2>
              <p className="text-xs text-muted-foreground">
                Set up a new accounting year and auto-generate 12 monthly financial periods.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                Start Year (FY Begins July)
              </label>
              <select
                value={startYear}
                onChange={(e) => handleYearChange(Number(e.target.value))}
                className="w-full text-xs font-bold bg-muted/30 border border-border rounded-lg px-3 py-2 text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
              >
                {[2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030].map((y) => (
                  <option key={y} value={y}>
                    {y} (FY {y}-{y + 1})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                Fiscal Year Code
              </label>
              <input
                type="text"
                readOnly
                value={fyCode}
                className="w-full text-xs font-mono font-bold bg-muted/60 border border-border rounded-lg px-3 py-2 text-foreground cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1">
              Fiscal Year Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs font-semibold bg-muted/30 border border-border rounded-lg px-3 py-2 text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                Start Date (July 01)
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full text-xs font-mono bg-muted/30 border border-border rounded-lg px-3 py-2 text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                End Date (June 30)
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full text-xs font-mono bg-muted/30 border border-border rounded-lg px-3 py-2 text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1">
              Default Retained Earnings Account
            </label>
            <input
              type="text"
              value={retainedAccount}
              onChange={(e) => setRetainedAccount(e.target.value)}
              placeholder="3101-001 - Retained Earnings / Surplus"
              className="w-full text-xs font-semibold bg-muted/30 border border-border rounded-lg px-3 py-2 text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Governed Companies
            </label>
            <div className="space-y-1.5">
              {COMPANY_LIST.map((company) => {
                const checked = selectedCompanies.includes(company);
                return (
                  <label
                    key={company}
                    className="flex items-center gap-2 text-xs text-foreground cursor-pointer p-2 rounded-lg bg-muted/20 border border-border/60 hover:bg-muted/40 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleToggleCompany(company)}
                      className="size-3.5 rounded text-primary focus:ring-primary accent-primary"
                    />
                    <span className="font-medium">{company}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-indigo-50/70 border border-indigo-200/80 text-[11px] text-indigo-900 dark:bg-indigo-950/40 dark:border-indigo-800 dark:text-indigo-200 flex items-start gap-2">
            <AlertCircle className="size-4 shrink-0 text-indigo-600 mt-0.5" />
            <div>
              Creating this Fiscal Year will automatically instantiate <strong>12 monthly periods</strong> (P-01 July through P-12 June) categorized into Q1, Q2, Q3, and Q4 with module-level posting controls.
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-bold text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="size-3.5" />
              <span>Generate Fiscal Year</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
