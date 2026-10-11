import React, { useState, useRef, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { CurrencySetup, ExchangeRate } from '../../types/currency';
import { formatWithCommaStyle } from '../../lib/format/currency';
import { toast } from 'sonner';
import {
  X,
  Upload,
  Download,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  RefreshCw,
  FileText,
  HelpCircle,
  Loader2,
} from 'lucide-react';

interface BulkRateUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  setups: CurrencySetup[];
  rates: ExchangeRate[];
  onBulkUpdate: (
    updates: { currencyId: string; rate: number; effectiveDate: string }[]
  ) => Promise<any>;
}

interface ParsedRateRow {
  index: number;
  currencyCode: string;
  setup?: CurrencySetup;
  currentRate?: number;
  newRate: number;
  effectiveDate: string;
  remarks?: string;
  status: 'valid_immediate' | 'valid_scheduled' | 'error' | 'skipped_base';
  errorMessage?: string;
}

export const BulkRateUploadModal: React.FC<BulkRateUploadModalProps> = ({
  isOpen,
  onClose,
  setups,
  rates,
  onBulkUpdate,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const today = new Date().toISOString().split('T')[0];

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<ParsedRateRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'valid' | 'error'>('all');
  const [isDragging, setIsDragging] = useState(false);

  // Quick lookup map for rates
  const ratesMap = useMemo(() => {
    const map = new Map<string, ExchangeRate>();
    rates.forEach((r) => map.set(r.currencyId, r));
    return map;
  }, [rates]);

  // Setups map by Code
  const setupsByCode = useMemo(() => {
    const map = new Map<string, CurrencySetup>();
    setups.forEach((s) => map.set(s.code.toUpperCase(), s));
    return map;
  }, [setups]);

  if (!isOpen) return null;

  // ── Template Generators ──
  const handleDownloadTemplate = (format: 'xlsx' | 'csv') => {
    try {
      const templateData = setups.map((s) => {
        const currentRateObj = ratesMap.get(s.id);
        const isBase = Boolean(currentRateObj?.isBase);
        return {
          'Currency Code': s.code,
          'Currency Name': s.name,
          'Country': s.country,
          'Current Rate': isBase ? 1.0 : (currentRateObj?.rate || 1.0),
          'New Exchange Rate': isBase ? 1.0 : (currentRateObj?.rate || 1.0),
          'Effective Date (YYYY-MM-DD)': today,
          'Remarks': isBase ? 'Base Currency (Locked to 1.00)' : '',
        };
      });

      const ws = XLSX.utils.json_to_sheet(templateData);

      // Auto-fit column widths
      ws['!cols'] = [
        { wch: 15 },
        { wch: 22 },
        { wch: 20 },
        { wch: 15 },
        { wch: 18 },
        { wch: 26 },
        { wch: 30 },
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'ExchangeRates');

      if (format === 'xlsx') {
        XLSX.writeFile(wb, `Exchange_Rates_Template_${today}.xlsx`);
      } else {
        XLSX.writeFile(wb, `Exchange_Rates_Template_${today}.csv`, { bookType: 'csv' });
      }

      toast.success(`Template downloaded as .${format}`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate template');
    }
  };

  // ── File Parsing ──
  const parseFile = async (file: File) => {
    setIsProcessing(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array', cellDates: true });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json: any[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });

      if (json.length === 0) {
        toast.error('The uploaded sheet is empty');
        setIsProcessing(false);
        return;
      }

      const rows: ParsedRateRow[] = [];

      json.forEach((row, idx) => {
        // Find currency code
        const rawCode = (
          row['Currency Code'] ||
          row['currency code'] ||
          row['CurrencyCode'] ||
          row['Code'] ||
          row['code'] ||
          ''
        )
          .toString()
          .trim()
          .toUpperCase();

        if (!rawCode) return; // skip completely blank lines

        // Find rate
        const rawRateVal =
          row['New Exchange Rate'] !== undefined && row['New Exchange Rate'] !== ''
            ? row['New Exchange Rate']
            : row['Exchange Rate'] !== undefined && row['Exchange Rate'] !== ''
            ? row['Exchange Rate']
            : row['Rate'] !== undefined && row['Rate'] !== ''
            ? row['Rate']
            : row['New Rate'];

        const numRate = parseFloat(rawRateVal);

        // Find effective date
        let rawDate = (
          row['Effective Date (YYYY-MM-DD)'] ||
          row['Effective Date'] ||
          row['effective date'] ||
          row['EffectiveDate'] ||
          row['Date'] ||
          row['date'] ||
          ''
        );

        let dateStr = today;
        if (rawDate instanceof Date) {
          dateStr = rawDate.toISOString().split('T')[0];
        } else if (typeof rawDate === 'string' && rawDate.trim()) {
          // Normalize if YYYY-MM-DD or DD/MM/YYYY
          const cleaned = rawDate.trim();
          if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) {
            dateStr = cleaned;
          } else {
            const parsedD = new Date(cleaned);
            if (!isNaN(parsedD.getTime())) {
              dateStr = parsedD.toISOString().split('T')[0];
            } else {
              dateStr = cleaned;
            }
          }
        }

        const remarks = (row['Remarks'] || row['remarks'] || row['Notes'] || '').toString().trim();

        // Validate
        const setup = setupsByCode.get(rawCode);
        const currentRateObj = setup ? ratesMap.get(setup.id) : undefined;
        const isBase = Boolean(currentRateObj?.isBase);

        let status: ParsedRateRow['status'] = 'valid_immediate';
        let errorMessage: string | undefined;

        if (!setup) {
          status = 'error';
          errorMessage = `Currency code "${rawCode}" is not configured in the system.`;
        } else if (isBase) {
          status = 'skipped_base';
          errorMessage = 'Base currency rate is locked to 1.0000 and cannot be changed.';
        } else if (isNaN(numRate) || numRate <= 0) {
          status = 'error';
          errorMessage = 'Exchange rate must be a valid positive number greater than 0.';
        } else if (dateStr < today) {
          status = 'error';
          errorMessage = `Backdating is not allowed. Date (${dateStr}) cannot be earlier than today (${today}).`;
        } else if (dateStr > today) {
          status = 'valid_scheduled';
        } else {
          status = 'valid_immediate';
        }

        rows.push({
          index: idx + 1,
          currencyCode: rawCode,
          setup,
          currentRate: currentRateObj?.rate,
          newRate: isNaN(numRate) ? 0 : numRate,
          effectiveDate: dateStr,
          remarks,
          status,
          errorMessage,
        });
      });

      setParsedRows(rows);
      setSelectedFile(file);
      toast.info(`Parsed ${rows.length} rows from ${file.name}`);
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to parse file: ' + (err.message || 'Invalid format'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) parseFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) parseFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Metrics
  const validRows = parsedRows.filter(
    (r) => r.status === 'valid_immediate' || r.status === 'valid_scheduled'
  );
  const immediateCount = parsedRows.filter((r) => r.status === 'valid_immediate').length;
  const scheduledCount = parsedRows.filter((r) => r.status === 'valid_scheduled').length;
  const errorCount = parsedRows.filter((r) => r.status === 'error').length;
  const skippedCount = parsedRows.filter((r) => r.status === 'skipped_base').length;

  // Filtered rows for preview table
  const displayedRows = parsedRows.filter((r) => {
    if (statusFilter === 'valid') {
      return r.status === 'valid_immediate' || r.status === 'valid_scheduled';
    }
    if (statusFilter === 'error') {
      return r.status === 'error' || r.status === 'skipped_base';
    }
    return true;
  });

  // ── Apply Bulk Updates ──
  const handleApplyUpdates = async () => {
    if (validRows.length === 0) {
      toast.error('No valid rates to apply');
      return;
    }

    setIsSaving(true);
    try {
      const updates = validRows.map((r) => ({
        currencyId: r.setup!.id,
        rate: r.newRate,
        effectiveDate: r.effectiveDate,
      }));

      await onBulkUpdate(updates);

      toast.success(
        `Successfully updated ${validRows.length} currencies (${scheduledCount} scheduled for future dates)`
      );
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to apply bulk updates');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setParsedRows([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-xs animate-in fade-in-50">
      <div className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header Strip */}
        <div className="px-5 py-4 border-b border-border/80 flex items-center justify-between bg-muted/30 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 grid place-items-center shadow-2xs">
              <Upload className="size-4.5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-foreground">
                Bulk Upload & Update Exchange Rates
              </h2>
              <p className="text-[11px] text-muted-foreground">
                Update multiple currency exchange rates at once with Excel (.xlsx) or CSV (.csv)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground grid place-items-center transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 sidebar-scroll">
          {/* Step 1 & 2: Template & Upload Dropzone Banner */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
            {/* Template Card (Left 4.5 cols) */}
            <div className="md:col-span-5 p-4 rounded-xl border border-indigo-200/60 dark:border-indigo-900/40 bg-indigo-50/50 dark:bg-indigo-950/20 flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                  Step 1 • Download Template
                </span>
                <h3 className="text-xs font-bold text-foreground">
                  Official Rate Update Spreadsheet
                </h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Pre-populated with all your configured foreign currencies. Fill in your updated
                  rates and effective dates.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleDownloadTemplate('xlsx')}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
                >
                  <FileSpreadsheet className="size-3.5" />
                  <span>Excel (.xlsx)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadTemplate('csv')}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-lg border border-border bg-card hover:bg-muted text-foreground text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
                >
                  <FileText className="size-3.5 text-muted-foreground" />
                  <span>CSV (.csv)</span>
                </button>
              </div>
            </div>

            {/* Upload Zone (Right 7.5 cols) */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`md:col-span-7 p-4 rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center space-y-2 cursor-pointer ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]'
                  : 'border-border/80 hover:border-indigo-400/80 bg-muted/20 hover:bg-muted/30'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileInputChange}
                className="hidden"
              />

              <div className="size-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 grid place-items-center">
                {isProcessing ? (
                  <Loader2 className="size-4.5 animate-spin" />
                ) : (
                  <Upload className="size-4.5" />
                )}
              </div>

              <div>
                <p className="text-xs font-bold text-foreground">
                  {selectedFile ? selectedFile.name : 'Click to select or drag & drop file here'}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Supports Microsoft Excel (.xlsx, .xls) and CSV (.csv)
                </p>
              </div>

              {selectedFile && (
                <div className="inline-flex items-center gap-1.5 text-[10.5px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-full">
                  <span>{(selectedFile.size / 1024).toFixed(1)} KB</span>
                  <span>•</span>
                  <span>Click to change file</span>
                </div>
              )}
            </div>
          </div>

          {/* Step 3: Analysis & Preview Table */}
          {parsedRows.length > 0 && (
            <div className="space-y-3 pt-2">
              {/* Summary Stats Row */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 bg-muted/30 p-2.5 rounded-xl border border-border/70">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-foreground px-1">Validation Summary:</span>

                  <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-card border border-border text-foreground">
                    Total: {parsedRows.length}
                  </span>

                  {immediateCount > 0 && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 className="size-3" />
                      Immediate: {immediateCount}
                    </span>
                  )}

                  {scheduledCount > 0 && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400">
                      <Clock className="size-3" />
                      Scheduled: {scheduledCount}
                    </span>
                  )}

                  {errorCount > 0 && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-rose-500/15 border border-rose-500/30 text-rose-700 dark:text-rose-400">
                      <AlertTriangle className="size-3" />
                      Errors: {errorCount}
                    </span>
                  )}

                  {skippedCount > 0 && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                      Base Skipped: {skippedCount}
                    </span>
                  )}
                </div>

                {/* Filter Selector */}
                <div className="flex items-center gap-1 bg-card border border-border rounded-lg p-0.5">
                  <button
                    type="button"
                    onClick={() => setStatusFilter('all')}
                    className={`px-2 py-0.5 text-[10.5px] font-bold rounded cursor-pointer transition-colors ${
                      statusFilter === 'all'
                        ? 'bg-muted text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    All ({parsedRows.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter('valid')}
                    className={`px-2 py-0.5 text-[10.5px] font-bold rounded cursor-pointer transition-colors ${
                      statusFilter === 'valid'
                        ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Valid ({validRows.length})
                  </button>
                  {errorCount > 0 && (
                    <button
                      type="button"
                      onClick={() => setStatusFilter('error')}
                      className={`px-2 py-0.5 text-[10.5px] font-bold rounded cursor-pointer transition-colors ${
                        statusFilter === 'error'
                          ? 'bg-rose-500/15 text-rose-700 dark:text-rose-400'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Errors ({errorCount})
                    </button>
                  )}
                </div>
              </div>

              {/* Table Preview */}
              <div className="border border-border/80 rounded-xl overflow-hidden shadow-2xs max-h-72 overflow-y-auto sidebar-scroll bg-card">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-muted/50 border-b border-border/80 text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground sticky top-0 z-10 backdrop-blur-xs">
                    <tr>
                      <th className="py-2 px-3">#</th>
                      <th className="py-2 px-3">Currency</th>
                      <th className="py-2 px-3 text-right">Current Rate</th>
                      <th className="py-2 px-3 text-right">New Rate</th>
                      <th className="py-2 px-3">Effective Date</th>
                      <th className="py-2 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-mono text-xs">
                    {displayedRows.map((row) => {
                      const diff =
                        row.currentRate && row.newRate
                          ? ((row.newRate - row.currentRate) / row.currentRate) * 100
                          : 0;

                      return (
                        <tr
                          key={row.index}
                          className={`hover:bg-muted/20 transition-colors ${
                            row.status === 'error'
                              ? 'bg-rose-500/[0.04]'
                              : row.status === 'valid_scheduled'
                              ? 'bg-amber-500/[0.03]'
                              : row.status === 'valid_immediate'
                              ? 'bg-emerald-500/[0.03]'
                              : ''
                          }`}
                        >
                          <td className="py-2 px-3 text-muted-foreground/60 text-[11px]">
                            {row.index}
                          </td>

                          <td className="py-2 px-3 font-bold text-foreground font-sans">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold">{row.currencyCode}</span>
                              {row.setup && (
                                <span className="text-[11px] text-muted-foreground font-normal truncate max-w-[120px]">
                                  ({row.setup.symbol}) — {row.setup.country}
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="py-2 px-3 text-right font-mono text-muted-foreground">
                            {row.currentRate ? row.currentRate.toFixed(4) : '—'}
                          </td>

                          <td className="py-2 px-3 text-right font-bold font-mono text-foreground">
                            <div className="flex items-center justify-end gap-1.5">
                              <span>{row.newRate > 0 ? row.newRate.toFixed(4) : '—'}</span>
                              {row.currentRate && diff !== 0 && (
                                <span
                                  className={`text-[9.5px] font-sans ${
                                    diff > 0 ? 'text-emerald-600' : 'text-rose-600'
                                  }`}
                                >
                                  ({diff > 0 ? '+' : ''}
                                  {diff.toFixed(1)}%)
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="py-2 px-3 font-mono text-[11px] text-foreground">
                            {row.effectiveDate}
                          </td>

                          <td className="py-2 px-3 font-sans">
                            {row.status === 'valid_immediate' && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                                <CheckCircle2 className="size-3" />
                                <span>Immediate Today</span>
                              </span>
                            )}

                            {row.status === 'valid_scheduled' && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full">
                                <Clock className="size-3" />
                                <span>Future Scheduled</span>
                              </span>
                            )}

                            {row.status === 'skipped_base' && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                <span>Base (Locked)</span>
                              </span>
                            )}

                            {row.status === 'error' && (
                              <div
                                title={row.errorMessage}
                                className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 dark:text-rose-400 bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 rounded-full"
                              >
                                <AlertTriangle className="size-3 shrink-0" />
                                <span className="truncate max-w-[200px]">{row.errorMessage}</span>
                              </div>
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

          {/* Explanatory Rule Footer */}
          <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-[11px] text-muted-foreground flex items-start gap-2 leading-relaxed">
            <HelpCircle className="size-4 shrink-0 text-indigo-500 mt-0.5" />
            <div>
              <span className="font-bold text-foreground">Accounting & Date Rules: </span>
              Rates with <strong>Effective Date = Today</strong> will activate immediately. Rates
              with <strong>Future Dates</strong> (e.g. 10 days ahead) are scheduled and recorded in
              history; current active rates remain intact until that date arrives. Backdating
              before today is strictly rejected.
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="px-5 py-3.5 border-t border-border/80 flex items-center justify-between bg-muted/20 shrink-0">
          <div>
            {parsedRows.length > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-semibold text-muted-foreground hover:text-foreground underline cursor-pointer"
              >
                Clear file & re-upload
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground rounded-lg border border-border hover:bg-muted transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleApplyUpdates}
              disabled={validRows.length === 0 || isSaving}
              className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-lg text-white text-xs font-bold shadow-sm transition-all whitespace-nowrap ${
                validRows.length > 0 && !isSaving
                  ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20 cursor-pointer active:scale-95'
                  : 'bg-muted text-muted-foreground/60 border border-border cursor-not-allowed shadow-none'
              }`}
            >
              {isSaving ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Applying {validRows.length} updates…</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-3.5 stroke-[2.5]" />
                  <span>Apply {validRows.length} Valid Updates</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
