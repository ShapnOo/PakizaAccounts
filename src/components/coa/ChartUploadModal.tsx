import React, { useState } from 'react';
import {
  Upload,
  Download,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  X,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { Account } from '../../types/coa';
import { COMPANY } from '../../constants/accountsTypeTree';

interface ChartUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (accounts: Account[]) => void;
}

interface ParsedRow {
  rowNum: number;
  level1: string;
  level2: string;
  level3: string;
  level4: string;
  level5: string;
  level6: string;
  accountsType: string;
  status: 'valid' | 'warning' | 'error';
  errorMsg?: string;
}

export const ChartUploadModal: React.FC<ChartUploadModalProps> = ({
  isOpen,
  onClose,
  onImport,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [previewRows, setPreviewRows] = useState<ParsedRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setFileName(file.name);
    setIsProcessing(true);

    // Mock client-side parser & validation
    setTimeout(() => {
      const mockParsed: ParsedRow[] = [
        {
          rowNum: 2,
          level1: 'Assets',
          level2: 'Current Assets',
          level3: 'Cash & Cash Equivalent',
          level4: 'Cash at Bank',
          level5: 'Cash at Bank BDT',
          level6: 'Cash at Bank City Bank',
          accountsType: 'Cash & Cash Equivalent',
          status: 'valid',
        },
        {
          rowNum: 3,
          level1: 'Assets',
          level2: 'Current Assets',
          level3: 'Cash & Cash Equivalent',
          level4: 'Cash at Bank',
          level5: 'Cash at Bank BDT',
          level6: 'Cash at Bank BRAC',
          accountsType: 'Cash & Cash Equivalent',
          status: 'valid',
        },
        {
          rowNum: 4,
          level1: 'Liabilities',
          level2: 'Current Liabilities',
          level3: 'Trade and Other Payables',
          level4: 'Foreign Suppliers',
          level5: '',
          level6: '',
          accountsType: 'Trade and Other Payables',
          status: 'valid',
        },
        {
          rowNum: 5,
          level1: 'Income',
          level2: 'Operating Income',
          level3: '',
          level4: '',
          level5: '',
          level6: '',
          accountsType: '',
          status: 'error',
          errorMsg: 'Missing required Accounts Type taxonomy match',
        },
      ];
      setPreviewRows(mockParsed);
      setIsProcessing(false);
    }, 600);
  };

  const handleDownloadTemplate = () => {
    const csvContent =
      'Level-1,Level-2,Level-3,Level-4,Level-5,Level-6,Accounts Type,Description\n' +
      'Assets,Current Assets,Cash & Cash Equivalent,Cash in Hand,Petty Cash in Hand,,Cash & Cash Equivalent,Petty cash reserve\n' +
      'Assets,Current Assets,Cash & Cash Equivalent,Cash at Bank,Cash at Bank BDT,Cash at Bank DBBL,Cash & Cash Equivalent,Corporate account\n' +
      'Liabilities,Current Liabilities,Trade and Other Payables,Trade Creditors - Local Vendors,,,Trade and Other Payables,Local suppliers';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Pakiza_COA_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportSubmit = () => {
    const validRows = previewRows.filter((r) => r.status === 'valid');
    if (validRows.length === 0) return;

    const newAccounts: Account[] = validRows.map((r, i) => {
      const pathParts = [r.level1, r.level2, r.level3, r.level4, r.level5, r.level6].filter(
        Boolean
      );
      const level = pathParts.length as any;
      const leafName = pathParts[pathParts.length - 1];

      return {
        id: `upload-${Date.now()}-${i}`,
        name: leafName,
        code: `010103040${i + 5}00`,
        accountsType: r.accountsType || 'Cash & Cash Equivalent',
        nature: 'Assets',
        parentId: null,
        level,
        path: pathParts,
        activeStatus: 'Active',
        companyName: COMPANY,
        isParent: false,
        defaultCurrency: 'BDT',
      };
    });

    onImport(newAccounts);
    onClose();
  };

  const validCount = previewRows.filter((r) => r.status === 'valid').length;
  const errorCount = previewRows.filter((r) => r.status === 'error').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-border/60 bg-muted/20 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-primary/10 text-primary grid place-items-center">
              <Upload className="size-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-foreground">Chart Upload (Batch Import)</h2>
              <p className="text-[11px] text-muted-foreground">
                Upload your Excel or CSV hierarchy chart conforming to the 6-level taxonomy.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 sidebar-scroll">
          {/* Action Row: Template Download */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/80 bg-muted/20">
            <div className="flex items-center gap-2.5">
              <FileSpreadsheet className="size-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-foreground">Need the standardized template?</p>
                <p className="text-[10.5px] text-muted-foreground">
                  Includes pre-configured Level-1 to Level-6 headers with Base Digit structure.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-border bg-card hover:bg-muted text-xs font-bold text-foreground transition-all cursor-pointer shadow-2xs"
            >
              <Download className="size-3.5" />
              <span>Download Template</span>
            </button>
          </div>

          {/* Drag & Drop Upload Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              dragActive
                ? 'border-primary bg-primary/5 scale-[0.99]'
                : 'border-border/80 hover:border-primary/50 bg-muted/10'
            }`}
          >
            <input
              type="file"
              id="coa-file-input"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileInput}
              className="hidden"
            />
            <label
              htmlFor="coa-file-input"
              className="flex flex-col items-center justify-center cursor-pointer space-y-2"
            >
              <div className="size-12 rounded-full bg-primary/10 text-primary grid place-items-center">
                <Upload className="size-5" />
              </div>
              <p className="text-xs font-bold text-foreground">
                Click to browse or drag and drop your spreadsheet here
              </p>
              <p className="text-[11px] text-muted-foreground">
                Supports Microsoft Excel (.xlsx, .xls) and CSV (UTF-8)
              </p>
              {fileName && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold border border-emerald-500/20 mt-2">
                  <FileText className="size-3.5" />
                  <span>{fileName}</span>
                </div>
              )}
            </label>
          </div>

          {/* Validation & Preview Table */}
          {previewRows.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-foreground">Preview & Validation Results</span>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    <CheckCircle2 className="size-3" />
                    {validCount} Ready
                  </span>
                  {errorCount > 0 && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-rose-600 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                      <AlertTriangle className="size-3" />
                      {errorCount} Errors
                    </span>
                  )}
                </div>
              </div>

              <div className="border border-border/70 rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 border-b border-border/60 text-[10.5px] font-bold text-muted-foreground uppercase">
                    <tr>
                      <th className="py-2 px-3">Row</th>
                      <th className="py-2 px-3">Full Account Hierarchy Path</th>
                      <th className="py-2 px-3">Accounts Type</th>
                      <th className="py-2 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-mono text-[11px]">
                    {previewRows.map((row) => (
                      <tr
                        key={row.rowNum}
                        className={row.status === 'error' ? 'bg-rose-500/5' : 'hover:bg-muted/20'}
                      >
                        <td className="py-2 px-3 text-muted-foreground">#{row.rowNum}</td>
                        <td className="py-2 px-3 font-sans text-foreground">
                          {[row.level1, row.level2, row.level3, row.level4, row.level5, row.level6]
                            .filter(Boolean)
                            .join(' > ')}
                        </td>
                        <td className="py-2 px-3 font-sans text-muted-foreground">
                          {row.accountsType || '—'}
                        </td>
                        <td className="py-2 px-3 font-sans">
                          {row.status === 'valid' ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[10.5px]">
                              <CheckCircle2 className="size-3" /> Valid
                            </span>
                          ) : (
                            <span
                              className="inline-flex items-center gap-1 text-rose-600 font-bold text-[10.5px]"
                              title={row.errorMsg}
                            >
                              <AlertCircle className="size-3" /> Error
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-border/60 bg-muted/15 flex items-center justify-end gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-border hover:bg-muted text-xs font-semibold text-muted-foreground transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={validCount === 0 || isProcessing}
            onClick={handleImportSubmit}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer ${
              validCount > 0
                ? 'bg-primary text-primary-foreground hover:bg-primary/95 shadow-primary/20'
                : 'bg-muted text-muted-foreground/50 cursor-not-allowed'
            }`}
          >
            <Upload className="size-3.5" />
            <span>Import {validCount > 0 ? `(${validCount}) Accounts` : ''}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
