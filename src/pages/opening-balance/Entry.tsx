import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { useOpeningBalanceStore } from '../../stores/openingBalanceStore';
import { calculateOpeningBalanceTotals } from '../../lib/math/openingBalance';
import { OpeningHeader } from '../../components/opening-balance/OpeningHeader';
import { LineItemTable } from '../../components/opening-balance/LineItemTable';
import { UploadModal } from '../../components/opening-balance/UploadModal';
import { OpeningBalanceLineModal } from '../../components/opening-balance/OpeningBalanceLineModal';
import { DeleteLineDialog } from '../../components/opening-balance/DeleteLineDialog';
import { Save, RotateCcw, ArrowLeft, FileText, Loader2, AlertCircle } from 'lucide-react';
import { OpeningBalanceLine } from '../../types/openingBalance';
import { useOpeningMasterLookups } from '../../hooks/useOpeningMasterLookups';
import { toast } from 'sonner';

export const OpeningBalanceEntryPage: React.FC = () => {
  const navigate = useNavigate();

  const {
    openingDate,
    lines,
    note,
    loading,
    saving,
    activeFiscalYear,
    load,
    setOpeningDate,
    updateLine,
    duplicateLine,
    removeLine,
    appendLines,
    replaceLines,
    setNote,
    save,
    reset,
  } = useOpeningBalanceStore();

  const { getAccount, getCostCenter, getSubsidiary, getEmployee, getVehicle } = useOpeningMasterLookups();

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [shakeBadge, setShakeBadge] = useState(false);

  // Line modal states
  const [isLineModalOpen, setIsLineModalOpen] = useState(false);
  const [editingLine, setEditingLine] = useState<OpeningBalanceLine | null>(null);

  // Delete confirmation dialog state
  const [deletingLine, setDeletingLine] = useState<OpeningBalanceLine | null>(null);

  // Load opening balance on mount
  useEffect(() => {
    load();
  }, [load]);

  // Export Opening Balance Lines to Excel / CSV
  const handleExportData = () => {
    if (!lines || lines.length === 0) {
      toast.error('No opening balance lines available to export');
      return;
    }

    const exportRows = lines.map((l, index) => {
      const acc = getAccount(l.accountHeadId);
      const cc = getCostCenter(l.costCenterId);
      const sub = getSubsidiary(l.subsidiaryId);
      const emp = getEmployee(l.employeeId);
      const veh = getVehicle(l.vehicleId);

      return {
        'SL #': index + 1,
        'Account Head': acc ? acc.name : l.accountHeadId,
        'Account Code': acc ? acc.code : '',
        'Cost Center': cc ? cc.name : l.costCenterId || '',
        'Subsidiary (Vendor/Customer)': sub ? sub.name : l.subsidiaryId || '',
        Employee: emp ? emp.name : l.employeeId || '',
        Vehicle: veh ? veh.name : l.vehicleId || '',
        Reference: l.reference || '',
        Description: l.description || '',
        Currency: l.currency || 'BDT',
        'Exchange Rate': l.exchangeRate || 1,
        'Debit (Original)': l.debit || '',
        'Credit (Original)': l.credit || '',
        'Debit (BDT)': l.debitBDT || 0,
        'Credit (BDT)': l.creditBDT || 0,
      };
    });

    const ws = XLSX.utils.json_to_sheet(exportRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Opening_Balances');
    XLSX.writeFile(wb, `Opening_Balance_${openingDate || 'Export'}.xlsx`);
    toast.success(`Exported ${lines.length} opening balance entries to Excel`);
  };

  // Derived totals and reconciliation status (memoized on lines to ensure stable reference)
  const totals = useMemo(() => calculateOpeningBalanceTotals(lines), [lines]);

  const handleOpenAddModal = () => {
    setEditingLine(null);
    setIsLineModalOpen(true);
  };

  const handleEditLine = (line: OpeningBalanceLine) => {
    setEditingLine(line);
    setIsLineModalOpen(true);
  };

  const handleSaveLine = (savedLine: OpeningBalanceLine) => {
    const exists = lines.some((l) => l.id === savedLine.id);
    if (exists) {
      updateLine(savedLine.id, savedLine);
      toast.success('Opening balance entry updated');
    } else {
      appendLines([savedLine]);
      toast.success('Opening balance entry added');
    }
  };

  const handleDeleteClick = (line: OpeningBalanceLine) => {
    setDeletingLine(line);
  };

  const handleConfirmDelete = () => {
    if (deletingLine) {
      removeLine(deletingLine.id);
      toast.success('Line item removed');
      setDeletingLine(null);
    }
  };

  const handleSave = async () => {
    if (!totals.balanced) {
      setShakeBadge(true);
      setTimeout(() => setShakeBadge(false), 500);
      toast.error('Cannot save: Total Debit (BDT) must exactly equal Total Credit (BDT)');
      return;
    }

    const success = await save();
    if (!success) {
      setShakeBadge(true);
      setTimeout(() => setShakeBadge(false), 500);
    }
  };

  const handleResetConfirm = async () => {
    if (window.confirm('Reset all changes and restore last saved opening balances?')) {
      await reset();
    }
  };

  const deletingAccount = deletingLine ? getAccount(deletingLine.accountHeadId) : undefined;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-5 space-y-4 pb-24">
      {/* ── 1. Upper Header Strip ── */}
      <OpeningHeader
        openingDate={openingDate}
        activeFiscalYear={activeFiscalYear}
        onDateChange={setOpeningDate}
        onOpenUpload={() => setIsUploadOpen(true)}
        onExportData={handleExportData}
      />

      {/* ── 2. Top Balance Validation Banner (if unbalanced) ── */}
      {!loading && lines.length > 0 && !totals.balanced && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/25 text-xs font-semibold shadow-2xs animate-in fade-in-50">
          <AlertCircle className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>
            Trial balance is currently unbalanced. Difference:{' '}
            <strong className="font-mono">
              {totals.difference > 0 ? `+${totals.difference}` : totals.difference} BDT
            </strong>
            . Equalize Debit and Credit before saving.
          </span>
        </div>
      )}

      {/* ── 3. Line Item Table View with Edit / Delete / Duplicate Actions ── */}
      <LineItemTable
        lines={lines}
        loading={loading}
        onAddLine={handleOpenAddModal}
        onEditLine={handleEditLine}
        onDuplicateLine={duplicateLine}
        onDeleteLine={handleDeleteClick}
        totalDebitBDT={totals.totalDebitBDT}
        totalCreditBDT={totals.totalCreditBDT}
        difference={totals.difference}
        balanced={totals.balanced}
        shake={shakeBadge}
      />

      {/* ── 4. Note Block ── */}
      <div className="bg-card border border-border/80 rounded-xl p-4 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <FileText className="size-3.5 text-muted-foreground" />
            <span>Note</span>
          </label>
          <span className="text-[11px] font-mono text-muted-foreground">
            {(note || '').length} / 500
          </span>
        </div>
        <textarea
          rows={3}
          maxLength={500}
          value={note || ''}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Enter opening balance remarks, audit references, or migration notes here..."
          className="w-full p-2.5 rounded-lg bg-background border border-border/80 text-xs text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-1 focus:ring-indigo-500 resize-none shadow-2xs"
        />
      </div>

      {/* ── 5. Sticky Bottom Action Bar ── */}
      <div className="sticky bottom-0 z-20 bg-card/95 backdrop-blur-md border border-border/80 rounded-xl p-3 shadow-lg flex items-center justify-between gap-3">
        {/* Left: Reset */}
        <button
          type="button"
          onClick={handleResetConfirm}
          disabled={loading || saving}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-all cursor-pointer"
        >
          <RotateCcw className="size-3.5" />
          <span>Reset</span>
        </button>

        {/* Right: Cancel & Save */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-card hover:bg-muted text-xs font-bold text-muted-foreground hover:text-foreground transition-all cursor-pointer"
          >
            <ArrowLeft className="size-3.5" />
            <span>Cancel</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !totals.balanced || lines.length < 2}
            className={`inline-flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-bold shadow-sm transition-all whitespace-nowrap active:scale-95 ${
              totals.balanced && lines.length >= 2
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/25 cursor-pointer'
                : 'bg-muted text-muted-foreground/50 border border-border/50 cursor-not-allowed shadow-none'
            }`}
          >
            {saving ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Saving…</span>
              </>
            ) : (
              <>
                <Save className="size-3.5 stroke-[2.5]" />
                <span>Save Opening Balance</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── 6. Client-Side Upload Excel Modal ── */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onReplaceLines={replaceLines}
        onAppendLines={appendLines}
      />

      {/* ── 7. Opening Balance Line Create / Edit Modal Dialog ── */}
      <OpeningBalanceLineModal
        isOpen={isLineModalOpen}
        onClose={() => setIsLineModalOpen(false)}
        line={editingLine}
        onSave={handleSaveLine}
      />

      {/* ── 8. Delete Line Confirmation Modal ── */}
      <DeleteLineDialog
        isOpen={!!deletingLine}
        onClose={() => setDeletingLine(null)}
        onConfirm={handleConfirmDelete}
        line={deletingLine}
        accountName={deletingAccount?.name}
        accountCode={deletingAccount?.code}
      />
    </div>
  );
};

export default OpeningBalanceEntryPage;
