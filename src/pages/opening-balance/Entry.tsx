import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOpeningBalanceStore, selectTotals } from '../../stores/openingBalanceStore';
import { OpeningHeader } from '../../components/opening-balance/OpeningHeader';
import { LineItemTable } from '../../components/opening-balance/LineItemTable';
import { UploadModal } from '../../components/opening-balance/UploadModal';
import { Save, RotateCcw, ArrowLeft, FileText, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export const OpeningBalanceEntryPage: React.FC = () => {
  const navigate = useNavigate();

  const {
    openingDate,
    lines,
    note,
    loading,
    saving,
    dirty,
    activeFiscalYear,
    fieldErrors,
    load,
    setOpeningDate,
    addLine,
    duplicateLine,
    updateLine,
    removeLine,
    setNote,
    save,
    reset,
    replaceLines,
    appendLines,
  } = useOpeningBalanceStore();

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [shakeBadge, setShakeBadge] = useState(false);

  // Load opening balance on mount
  useEffect(() => {
    load();
  }, [load]);

  // Derived totals and reconciliation status
  const totals = useOpeningBalanceStore(selectTotals);

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

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-5 space-y-4 pb-24">
      {/* ── 5. Header Strip ── */}
      <OpeningHeader
        openingDate={openingDate}
        activeFiscalYear={activeFiscalYear}
        onDateChange={setOpeningDate}
        onOpenUpload={() => setIsUploadOpen(true)}
      />

      {/* ── Top Balance Validation Banner (if unbalanced or has global error) ── */}
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

      {/* ── 6 & 7. Line Item Table (+ Add Line above table + Totals Footer) ── */}
      <LineItemTable
        lines={lines}
        loading={loading}
        onAddLine={addLine}
        onUpdateLine={updateLine}
        onDuplicateLine={duplicateLine}
        onRemoveLine={removeLine}
        fieldErrors={fieldErrors}
        totalDebitBDT={totals.totalDebitBDT}
        totalCreditBDT={totals.totalCreditBDT}
        difference={totals.difference}
        balanced={totals.balanced}
        shake={shakeBadge}
      />

      {/* ── 10. Note Block (Called "Note", NOT "Narration") ── */}
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

      {/* ── Sticky Bottom Action Bar ── */}
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

      {/* ── 11. Client-Side Upload Modal ── */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onReplaceLines={replaceLines}
        onAppendLines={appendLines}
      />
    </div>
  );
};

export default OpeningBalanceEntryPage;
