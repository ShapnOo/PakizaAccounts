import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { OpeningBalanceLine } from '../../types/openingBalance';
import { round2, calculateOpeningBalanceTotals } from '../../lib/math/openingBalance';
import { formatCurrency } from '../../lib/format';
import {
  Upload,
  X,
  FileSpreadsheet,
  Download,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { toast } from 'sonner';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReplaceLines: (lines: OpeningBalanceLine[]) => void;
  onAppendLines: (lines: OpeningBalanceLine[]) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onReplaceLines,
  onAppendLines,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<OpeningBalanceLine[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // 1. Download Client-Side Excel Template (with Account Heads, Custom Fields, and separate Instructions sheet)
  const handleDownloadTemplate = () => {
    const templateData = [
      {
        'Account Head': 'Advance to Supplier',
        'Cost Center': 'Main Plant Cost Center',
        Subsidiary: 'Bismillah Motors',
        Employee: 'Emp - John Doe',
        Vehicle: 'V-102 Delivery Truck',
        Reference: 'REF-2026-001',
        Description: 'Advance to vendor for raw materials packaging',
        Currency: 'BDT',
        'Exchange Rate': 1,
        Debit: 150000,
        Credit: 0,
        'Debit (BDT)': 150000,
        'Credit (BDT)': 0,
        'Project Code': 'PRJ-2026-A',
        'Audit Note': 'Verified by Internal Audit',
      },
      {
        'Account Head': 'Petty Cash in Hand',
        'Cost Center': 'Head Office Admin',
        Subsidiary: '',
        Employee: 'Emp - Jane Smith',
        Vehicle: '',
        Reference: 'PC-2026-INIT',
        Description: 'Initial petty cash floating balance',
        Currency: 'BDT',
        'Exchange Rate': 1,
        Debit: 50000,
        Credit: 0,
        'Debit (BDT)': 50000,
        'Credit (BDT)': 0,
        'Project Code': 'PRJ-HO',
        'Audit Note': 'Cash Count Sheet Approved',
      },
      {
        'Account Head': 'Trade Creditors - Local Vendors',
        'Cost Center': 'Factory Operating Unit',
        Subsidiary: 'Bismillah Motors',
        Employee: '',
        Vehicle: '',
        Reference: 'AP-2026-BAL',
        Description: 'Opening accounts payable for supplier invoices',
        Currency: 'BDT',
        'Exchange Rate': 1,
        Debit: 0,
        Credit: 200000,
        'Debit (BDT)': 0,
        'Credit (BDT)': 200000,
        'Project Code': 'PRJ-FACTORY',
        'Audit Note': 'Vendor Balance Confirmation Attached',
      },
    ];

    const instructionData = [
      {
        'Step #': 1,
        'Field Name': 'Account Head',
        'Requirement': 'Mandatory',
        'Description': 'Specify the exact Account Head name (e.g. "Advance to Supplier", "Petty Cash in Hand", "Cash at Bank DBBL", "Trade Creditors - Local Vendors"). Only General Ledger (GL) leaf accounts are allowed.',
      },
      {
        'Step #': 2,
        'Field Name': 'Debit / Credit',
        'Requirement': 'Mandatory',
        'Description': 'Provide either Debit or Credit amount. For foreign currencies (USD, EUR, GBP, INR), specify Currency and Exchange Rate.',
      },
      {
        'Step #': 3,
        'Field Name': 'Subsidiary (Vendor / Customer)',
        'Requirement': 'Required for A/P & A/R',
        'Description': 'Vendor name is mandatory when Account Head is Accounts Payable. Customer name is mandatory when Account Head is Accounts Receivable.',
      },
      {
        'Step #': 4,
        'Field Name': 'Custom Fields',
        'Requirement': 'Optional / Mandatory as configured',
        'Description': 'Add custom column headers matching active custom field labels (e.g., "Project Code", "Audit Note").',
      },
      {
        'Step #': 5,
        'Field Name': 'Data Validation',
        'Requirement': 'Important',
        'Description': 'Total Debit (BDT) must equal Total Credit (BDT) across all opening balance lines before final submission.',
      },
    ];

    const wsData = XLSX.utils.json_to_sheet(templateData);
    const wsInstructions = XLSX.utils.json_to_sheet(instructionData);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsData, 'Opening_Balance_Data');
    XLSX.utils.book_append_sheet(wb, wsInstructions, 'Excel Upload Instructions');

    XLSX.writeFile(wb, 'Opening_Balance_Sample_Template.xlsx');
    toast.success('Downloaded Opening Balance template with Account Heads and Excel Instructions sheet');
  };

  // 2. Parse uploaded file using SheetJS
  const processFile = async (selectedFile: File) => {
    setFile(selectedFile);
    setIsProcessing(true);

    try {
      const buffer = await selectedFile.arrayBuffer();
      const wb = XLSX.read(buffer, { type: 'array' });
      const firstSheetName = wb.SheetNames[0];
      const ws = wb.Sheets[firstSheetName];
      const rawRows: any[] = XLSX.utils.sheet_to_json(ws);

      if (!rawRows || rawRows.length === 0) {
        toast.error('The selected file contains no data rows');
        setIsProcessing(false);
        return;
      }

      // Map rows to canonical OpeningBalanceLine
      const mapped: OpeningBalanceLine[] = rawRows.map((r, i) => {
        const currency = (r['Currency'] || r['currency'] || 'BDT').toString().trim().toUpperCase();
        const exchangeRate = parseFloat(r['Exchange Rate'] || r['rate'] || r['exchangeRate'] || '1') || 1;
        const debit = parseFloat(r['Debit'] || r['debit'] || '0') || undefined;
        const credit = parseFloat(r['Credit'] || r['credit'] || '0') || undefined;

        let debitBDT = parseFloat(r['Debit (BDT)'] || r['debitBDT'] || '0') || undefined;
        let creditBDT = parseFloat(r['Credit (BDT)'] || r['creditBDT'] || '0') || undefined;

        if (currency !== 'BDT') {
          if (debit && debit > 0) debitBDT = round2(debit * exchangeRate);
          if (credit && credit > 0) creditBDT = round2(credit * exchangeRate);
        } else {
          if (!debitBDT && debit) debitBDT = debit;
          if (!creditBDT && credit) creditBDT = credit;
        }

        return {
          id: `imported-${Date.now()}-${i}`,
          accountHeadId: (
            r['Account Head Code'] ||
            r['Account Head'] ||
            r['accountHeadId'] ||
            r['account'] ||
            ''
          ).toString().trim(),
          costCenterId: (r['Cost Center'] || r['costCenterId'] || '').toString().trim() || undefined,
          subsidiaryId: (r['Subsidiary'] || r['subsidiaryId'] || '').toString().trim() || undefined,
          employeeId: (r['Employee'] || r['employeeId'] || '').toString().trim() || undefined,
          vehicleId: (r['Vehicle'] || r['vehicleId'] || '').toString().trim() || undefined,
          reference: (r['Reference'] || r['reference'] || '').toString().trim() || undefined,
          description: (r['Description'] || r['description'] || '').toString().trim() || undefined,
          currency,
          exchangeRate,
          debit,
          credit,
          debitBDT,
          creditBDT,
        };
      });

      setParsedRows(mapped);
      toast.success(`Successfully parsed ${mapped.length} rows`);
    } catch (err) {
      console.error('Failed to parse file', err);
      toast.error('Failed to parse file. Please verify valid .xlsx or .csv format.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const totals = calculateOpeningBalanceTotals(parsedRows);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in-50 duration-150">
      <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-border/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 grid place-items-center">
              <Upload className="size-4.5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">Upload Opening Balance</h2>
              <p className="text-xs text-muted-foreground">
                Upload a .xlsx, .xls, or .csv file. Parsing is executed 100% in your browser.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto sidebar-scroll flex-1">
          {/* Template Download Prompt */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/70 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileSpreadsheet className="size-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>Need the standard template with canonical column headers?</span>
            </div>
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-xs font-bold text-foreground transition-all cursor-pointer shrink-0"
            >
              <Download className="size-3.5 text-indigo-600" />
              <span>Download Template</span>
            </button>
          </div>

          {/* Drag & Drop File Zone */}
          {parsedRows.length === 0 ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                dragActive
                  ? 'border-indigo-500 bg-indigo-50/20'
                  : 'border-border/80 hover:border-indigo-400 bg-muted/10 hover:bg-muted/20'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <Upload className="size-8 mx-auto text-indigo-600/70 mb-2" />
              <p className="text-xs font-bold text-foreground">
                {isProcessing ? 'Processing file...' : 'Click to browse or drag & drop spreadsheet'}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Supports Microsoft Excel (.xlsx, .xls) and CSV (.csv)
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* File Info & Reconciliation Preview */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 dark:bg-muted/20 border border-border/70 text-xs">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="size-4 text-emerald-600" />
                  <span className="font-bold text-foreground">{file?.name}</span>
                  <span className="text-muted-foreground font-mono">({parsedRows.length} lines)</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground text-[11px]">
                    Debit: <strong className="text-foreground">৳ {formatCurrency(totals.totalDebitBDT)}</strong>
                  </span>
                  <span className="text-muted-foreground text-[11px]">
                    Credit: <strong className="text-foreground">৳ {formatCurrency(totals.totalCreditBDT)}</strong>
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold ${
                      totals.balanced
                        ? 'bg-emerald-500/10 text-emerald-700'
                        : 'bg-rose-500/10 text-rose-700'
                    }`}
                  >
                    {totals.balanced ? 'Balanced ✓' : `Diff: ${formatCurrency(totals.difference)} BDT`}
                  </span>
                </div>
              </div>

              {/* Preview Table */}
              <div className="border border-border/80 rounded-xl overflow-hidden max-h-56 overflow-y-auto sidebar-scroll text-xs">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-muted/40 text-[10px] uppercase font-bold text-muted-foreground tracking-wider border-b border-border/60 sticky top-0">
                    <tr>
                      <th className="p-2">#</th>
                      <th className="p-2">Account Head</th>
                      <th className="p-2">Currency</th>
                      <th className="p-2 text-right">Debit (BDT)</th>
                      <th className="p-2 text-right">Credit (BDT)</th>
                      <th className="p-2 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {parsedRows.map((r, idx) => {
                      const isValid =
                        Boolean(r.accountHeadId) &&
                        ((r.debitBDT && r.debitBDT > 0) || (r.creditBDT && r.creditBDT > 0));
                      return (
                        <tr key={r.id} className="hover:bg-muted/20">
                          <td className="p-2 text-muted-foreground font-mono">{idx + 1}</td>
                          <td className="p-2 font-medium truncate max-w-[200px]">
                            {r.accountHeadId || (
                              <span className="text-rose-500 italic">Missing account</span>
                            )}
                          </td>
                          <td className="p-2 font-mono">{r.currency}</td>
                          <td className="p-2 text-right font-mono tabular-nums">
                            {r.debitBDT ? formatCurrency(r.debitBDT) : '—'}
                          </td>
                          <td className="p-2 text-right font-mono tabular-nums">
                            {r.creditBDT ? formatCurrency(r.creditBDT) : '—'}
                          </td>
                          <td className="p-2 text-center">
                            {isValid ? (
                              <span className="size-2 rounded-full bg-emerald-500 inline-block" title="Valid" />
                            ) : (
                              <span className="size-2 rounded-full bg-rose-500 inline-block" title="Invalid line" />
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-border/80 bg-muted/10 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground rounded-lg border border-border hover:bg-muted transition-colors cursor-pointer"
          >
            Cancel
          </button>

          {parsedRows.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onReplaceLines(parsedRows);
                  onClose();
                }}
                className="px-4 py-2 rounded-lg border border-border bg-card hover:bg-muted text-xs font-bold text-foreground transition-all cursor-pointer shadow-2xs"
              >
                Replace Current Lines
              </button>

              <button
                type="button"
                onClick={() => {
                  onAppendLines(parsedRows);
                  onClose();
                }}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all cursor-pointer shadow-sm shadow-indigo-600/20"
              >
                Append ({parsedRows.length}) Lines
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
