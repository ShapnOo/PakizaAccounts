import React from 'react';
import { Calendar, Upload, Scale, Plus, Download } from 'lucide-react';

interface OpeningHeaderProps {
  openingDate: string;
  activeFiscalYear: string;
  onDateChange: (date: string) => void;
  onOpenUpload: () => void;
  onExportData?: () => void;
  onOpenAddModal: () => void;
}

export const OpeningHeader: React.FC<OpeningHeaderProps> = ({
  openingDate,
  onDateChange,
  onOpenUpload,
  onExportData,
  onOpenAddModal,
}) => {
  return (
    <div className="bg-card border border-border/80 rounded-xl p-4 sm:p-5 shadow-2xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Module Title */}
        <div className="flex items-start sm:items-center gap-3">
          <div className="size-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 grid place-items-center shrink-0 shadow-2xs">
            <Scale className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-foreground">
                Opening Balance
              </h1>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Set initial GL account balances and auxiliary dimensions for the start of the financial period.
            </p>
          </div>
        </div>

        {/* Right: DatePicker, Export, Upload Action & Prominent Add Button */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Opening Date Selector */}
          <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-lg border border-border/80 shadow-2xs">
            <Calendar className="size-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-bold text-foreground whitespace-nowrap">
              Opening Date:
            </span>
            <input
              type="date"
              value={openingDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="bg-transparent text-xs font-semibold text-foreground outline-none cursor-pointer"
            />
          </div>

          {/* Data Export Button */}
          {onExportData && (
            <button
              type="button"
              onClick={onExportData}
              className="inline-flex items-center gap-1.5 h-8.5 px-3.5 rounded-lg border border-border bg-card hover:bg-muted text-xs font-bold text-foreground shadow-2xs transition-all cursor-pointer whitespace-nowrap active:scale-95"
              title="Export Opening Balances to CSV/Excel"
            >
              <Download className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Export</span>
            </button>
          )}

          {/* Upload Excel Button */}
          <button
            type="button"
            onClick={onOpenUpload}
            className="inline-flex items-center gap-1.5 h-8.5 px-3.5 rounded-lg border border-border bg-card hover:bg-muted text-xs font-bold text-foreground shadow-2xs transition-all cursor-pointer whitespace-nowrap active:scale-95"
            title="Import Excel file"
          >
            <Upload className="size-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Upload</span>
          </button>

          {/* Prominent "+ Add Opening Balance" Button */}
          <button
            type="button"
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 h-8.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm shadow-indigo-600/25 transition-all cursor-pointer whitespace-nowrap active:scale-95"
          >
            <Plus className="size-4 stroke-[2.5]" />
            <span>Add Opening Balance</span>
          </button>
        </div>
      </div>
    </div>
  );
};
