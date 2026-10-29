import React, { useState, useRef, useEffect } from 'react';
import { Download, FileSpreadsheet, FileText, Printer, ChevronDown } from 'lucide-react';

interface ExportMenuProps {
  onExport: (format: 'xlsx' | 'csv' | 'pdf') => void;
  loading?: boolean;
}

export const ExportMenu: React.FC<ExportMenuProps> = ({ onExport, loading = false }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        disabled={loading}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-indigo-600 text-white text-xs font-bold shadow-sm hover:bg-indigo-700 active:bg-indigo-800 transition-all cursor-pointer disabled:opacity-50"
      >
        <Download className="size-3.5" />
        <span className="hidden sm:inline">Export</span>
        <ChevronDown className="size-3 ml-0.5 text-indigo-200" />
      </button>

      {open && (
        <div className="absolute right-0 mt-1.5 w-48 rounded-lg bg-white border border-slate-200 shadow-lg py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onExport('xlsx');
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors text-left"
          >
            <FileSpreadsheet className="size-4 text-emerald-600" />
            <div>
              <div className="font-semibold">Export as Excel</div>
              <div className="text-[10px] text-slate-400">SheetJS formatted .xlsx</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onExport('csv');
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors text-left border-t border-slate-100"
          >
            <FileText className="size-4 text-sky-600" />
            <div>
              <div className="font-semibold">Export as CSV</div>
              <div className="text-[10px] text-slate-400">Comma-separated values</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onExport('pdf');
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors text-left border-t border-slate-100"
          >
            <Printer className="size-4 text-rose-600" />
            <div>
              <div className="font-semibold">Print / Export as PDF</div>
              <div className="text-[10px] text-slate-400">Printable landscape layout</div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

