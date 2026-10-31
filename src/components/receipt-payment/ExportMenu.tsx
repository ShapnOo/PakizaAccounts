import React, { useState, useRef, useEffect } from 'react';
import { Download, FileSpreadsheet, FileText, Printer, ChevronDown } from 'lucide-react';

interface ExportMenuProps {
  onExport: (format: 'xlsx' | 'csv' | 'pdf') => void;
  disabled?: boolean;
}

export const ExportMenu: React.FC<ExportMenuProps> = ({
  onExport,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
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
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 px-2.5 h-7 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-semibold shadow-2xs transition-all cursor-pointer disabled:opacity-50"
      >
        <Download className="size-3" />
        <span>Export</span>
        <ChevronDown className="size-3 text-indigo-200" />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-44 rounded-lg border border-slate-200 bg-white shadow-xl py-1 z-50 text-[11px]">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onExport('xlsx');
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <FileSpreadsheet className="size-3.5 text-emerald-600" />
            <span>Excel (.xlsx)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onExport('csv');
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <FileText className="size-3.5 text-blue-600" />
            <span>CSV (.csv)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onExport('pdf');
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <Printer className="size-3.5 text-purple-600" />
            <span>Print / PDF</span>
          </button>
        </div>
      )}
    </div>
  );
};

