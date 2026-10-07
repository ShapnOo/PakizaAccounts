import React, { useState, useRef, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  FolderTree,
  Plus,
  Upload,
  TableProperties,
  ListTree,
  Building2,
  ChevronRight,
  Download,
  FileSpreadsheet,
  FileText,
  ChevronDown,
} from 'lucide-react';
import { COMPANY } from '../../constants/accountsTypeTree';
import { Account } from '../../types/coa';
import { exportCoaToExcel, exportCoaToPdf } from '../../services/coaExportService';
import { useDropdownPosition } from '../../hooks/useDropdownPosition';

interface CoaHeaderProps {
  onOpenUpload: () => void;
  onOpenCreate?: () => void;
  totalAccounts?: number;
  accounts?: Account[];
}

export const CoaHeader: React.FC<CoaHeaderProps> = ({
  onOpenUpload,
  onOpenCreate,
  totalAccounts = 0,
  accounts = [],
}) => {
  const [searchParams] = useSearchParams();
  const currentView = searchParams.get('view') === 'tree' ? 'tree' : 'list';
  const [isExportOpen, setIsExportOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);
  const { openUpward: exportOpenUpward } = useDropdownPosition({
    triggerRef: exportRef,
    isOpen: isExportOpen,
    minMenuHeight: 180,
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setIsExportOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-3.5 pb-2">
      {/* ── Breadcrumbs ── */}
      <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-muted-foreground/70 uppercase tracking-wider">
        <span>Home</span>
        <ChevronRight className="size-3 text-muted-foreground/40" />
        <span>Accounts Configuration</span>
        <ChevronRight className="size-3 text-muted-foreground/40" />
        <span className="text-primary font-black">Chart of Accounts</span>
      </div>

      {/* ── Title & Global Actions ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-3.5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-primary/10 text-primary grid place-items-center shadow-2xs">
              <FolderTree className="size-4.5" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
                <span>Chart of Accounts</span>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {totalAccounts} Accounts
                </span>
              </h1>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">
                Multi-tier financial chart taxonomy, account codes, and general ledger structures.
              </p>
            </div>
          </div>
        </div>

        {/* Right Toolbar */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Scope */}
          <div className="hidden lg:flex items-center gap-1.5 bg-card px-2.5 py-1.5 rounded-lg border border-border/70 shadow-2xs text-xs font-semibold text-muted-foreground">
            <Building2 className="size-3.5 text-primary" />
            <span className="text-foreground font-bold">{COMPANY}</span>
          </div>

          {/* Export Dropdown (Excel & PDF) */}
          <div className="relative" ref={exportRef}>
            <button
              type="button"
              onClick={() => setIsExportOpen(!isExportOpen)}
              className="inline-flex items-center gap-1.5 h-8.5 px-3 rounded-lg border border-border/80 bg-card hover:bg-muted/70 text-foreground text-xs font-bold shadow-2xs transition-all cursor-pointer whitespace-nowrap active:scale-95"
              title="Export Chart of Accounts"
            >
              <Download className="size-3.5 text-muted-foreground" />
              <span>Export</span>
              <ChevronDown
                className={`size-3 text-muted-foreground transition-transform duration-200 ${
                  isExportOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isExportOpen && (
              <div
                className={`absolute right-0 z-50 w-52 bg-popover border border-border rounded-xl shadow-xl p-1.5 space-y-1 text-xs ${
                  exportOpenUpward
                    ? 'bottom-full mb-1.5 origin-bottom animate-in fade-in-50 zoom-in-95 duration-100'
                    : 'top-full mt-1.5 origin-top animate-in fade-in-50 zoom-in-95 duration-100'
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    setIsExportOpen(false);
                    exportCoaToExcel(accounts);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-400 text-foreground font-semibold transition-colors cursor-pointer text-left group"
                >
                  <div className="size-7 rounded-md bg-emerald-500/10 text-emerald-600 grid place-items-center shrink-0 group-hover:bg-emerald-500/20">
                    <FileSpreadsheet className="size-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs">Export to Excel</div>
                    <div className="text-[10px] text-muted-foreground font-normal">
                      Microsoft Excel (.xlsx)
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsExportOpen(false);
                    exportCoaToPdf(accounts);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-rose-500/10 hover:text-rose-700 dark:hover:text-rose-400 text-foreground font-semibold transition-colors cursor-pointer text-left group"
                >
                  <div className="size-7 rounded-md bg-rose-500/10 text-rose-600 grid place-items-center shrink-0 group-hover:bg-rose-500/20">
                    <FileText className="size-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs">Export to PDF</div>
                    <div className="text-[10px] text-muted-foreground font-normal">
                      Print / Save as PDF
                    </div>
                  </div>
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onOpenUpload}
            className="inline-flex items-center gap-1.5 h-8.5 px-3 rounded-lg border border-border/80 bg-card hover:bg-muted/70 text-foreground text-xs font-bold shadow-2xs transition-all cursor-pointer whitespace-nowrap active:scale-95"
          >
            <Upload className="size-3.5 text-muted-foreground" />
            <span>Chart Upload</span>
          </button>

          {onOpenCreate ? (
            <button
              type="button"
              onClick={onOpenCreate}
              className="inline-flex items-center gap-1.5 h-8.5 px-3.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold shadow-sm shadow-primary/20 transition-all cursor-pointer whitespace-nowrap active:scale-95"
            >
              <Plus className="size-4 stroke-[2.5]" />
              <span>Create New</span>
            </button>
          ) : (
            <Link
              to="/chart-of-accounts/new"
              className="inline-flex items-center gap-1.5 h-8.5 px-3.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold shadow-sm shadow-primary/20 transition-all cursor-pointer whitespace-nowrap active:scale-95"
            >
              <Plus className="size-4 stroke-[2.5]" />
              <span>Create New</span>
            </Link>
          )}
        </div>
      </div>

      {/* ── Tab Strip ── */}
      <div className="flex items-center justify-between border-b border-border/60">
        <div className="flex items-center gap-1 -mb-px">
          <Link
            to="/chart-of-accounts"
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              currentView === 'list'
                ? 'border-primary text-primary bg-primary/5 rounded-t-lg'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            <TableProperties className="size-3.5" />
            <span>List View</span>
          </Link>

          <Link
            to="/chart-of-accounts?view=tree"
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              currentView === 'tree'
                ? 'border-primary text-primary bg-primary/5 rounded-t-lg'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            <ListTree className="size-3.5" />
            <span>Tree View</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
