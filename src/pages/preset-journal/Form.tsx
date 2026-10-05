import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Bookmark,
  ArrowLeft,
  Save,
  Trash2,
  Clock,
  TrendingUp,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { usePresetJournalStore } from '../../stores/presetJournalStore';
import { VoucherType, PresetLine } from '../../types/presetJournal';
import { presetFormSchema } from '../../lib/validation/presetJournal';
import { ProfileHeaderBlock } from '../../components/preset-journal/ProfileHeaderBlock';
import { LineItemTable } from '../../components/preset-journal/LineItemTable';
import { DeleteConfirmDialog } from '../../components/preset-journal/DeleteConfirmDialog';
import { formatRelativeTime } from '../../components/preset-journal/UsageCounter';

export function PresetJournalFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const { presets, load, add, update, remove } = usePresetJournalStore();

  const [voucherType, setVoucherType] = useState<VoucherType>('Journal');
  const [profileName, setProfileName] = useState('');
  const [lines, setLines] = useState<PresetLine[]>([
    {
      id: 'pl-1',
      accountHeadId: '',
      currency: 'BDT',
      exchangeRate: 1,
      debit: 0,
      credit: 0,
      debitBDT: 0,
      creditBDT: 0,
    },
    {
      id: 'pl-2',
      accountHeadId: '',
      currency: 'BDT',
      exchangeRate: 1,
      debit: 0,
      credit: 0,
      debitBDT: 0,
      creditBDT: 0,
    },
  ]);
  const [narration, setNarration] = useState('');
  const [usageCount, setUsageCount] = useState(0);
  const [lastUsedAt, setLastUsedAt] = useState<string | undefined>(undefined);
  const [createdAt, setCreatedAt] = useState<string | undefined>(undefined);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    load();
  }, [load]);

  // If editing, load preset into state
  useEffect(() => {
    if (isEdit && id) {
      const target = presets.find((p) => p.id === id);
      if (target) {
        setVoucherType(target.voucherType);
        setProfileName(target.profileName);
        setLines(
          target.lines && target.lines.length > 0
            ? target.lines
            : [
                {
                  id: 'pl-1',
                  accountHeadId: '',
                  currency: 'BDT',
                  exchangeRate: 1,
                },
              ]
        );
        setNarration(target.narration || '');
        setUsageCount(target.usageCount || 0);
        setLastUsedAt(target.lastUsedAt);
        setCreatedAt(target.createdAt);
      }
    }
  }, [isEdit, id, presets]);

  // When changing voucher type, ensure minimum lines
  const handleVoucherTypeChange = (newType: VoucherType) => {
    setVoucherType(newType);
    const minLines = newType === 'Journal' || newType === 'Contra' ? 2 : 1;
    if (lines.length < minLines) {
      const needed = minLines - lines.length;
      const extra: PresetLine[] = Array.from({ length: needed }).map((_, i) => ({
        id: `pl-${Date.now()}-${i}`,
        accountHeadId: '',
        currency: 'BDT',
        exchangeRate: 1,
        debit: 0,
        credit: 0,
        debitBDT: 0,
        creditBDT: 0,
      }));
      setLines((prev) => [...prev, ...extra]);
    }
  };

  const handleAddLine = () => {
    const nextLine: PresetLine = {
      id: `pl-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      accountHeadId: '',
      currency: 'BDT',
      exchangeRate: 1,
      debit: 0,
      credit: 0,
      debitBDT: 0,
      creditBDT: 0,
    };
    setLines((prev) => [...prev, nextLine]);
  };

  const handleRemoveLine = (lineId: string) => {
    const min = voucherType === 'Journal' || voucherType === 'Contra' ? 2 : 1;
    if (lines.length <= min) {
      toast.error(`Minimum ${min} lines required for ${voucherType} Voucher preset`);
      return;
    }
    setLines((prev) => prev.filter((l) => l.id !== lineId));
  };

  const handleUpdateLine = (lineId: string, patch: Partial<PresetLine>) => {
    setLines((prev) =>
      prev.map((l) => (l.id === lineId ? { ...l, ...patch } : l))
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // 1. Zod Validation
    const validationResult = presetFormSchema.safeParse({
      profileName: profileName.trim(),
      voucherType,
      lines,
      narration: narration.trim(),
    });

    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of validationResult.error.issues) {
        const pathKey = issue.path.join('.');
        fieldErrors[pathKey] = issue.message;
      }
      setErrors(fieldErrors);
      toast.error(
        validationResult.error.issues[0]?.message || 'Please fix the errors in the form'
      );
      return;
    }

    // 2. Uniqueness check for profileName within voucherType
    const duplicate = presets.find(
      (p) =>
        p.voucherType === voucherType &&
        p.profileName.toLowerCase() === profileName.trim().toLowerCase() &&
        (!isEdit || p.id !== id)
    );

    if (duplicate) {
      setErrors((prev) => ({
        ...prev,
        profileName: `A ${voucherType} preset with the name "${profileName}" already exists.`,
      }));
      toast.error(`Profile name must be unique for ${voucherType} Voucher.`);
      return;
    }

    // 3. Save / Update
    setIsSaving(true);
    try {
      if (isEdit && id) {
        await update(id, {
          profileName: profileName.trim(),
          voucherType,
          lines,
          narration: narration.trim(),
        });
        toast.success(`Preset '${profileName}' updated successfully`);
      } else {
        await add({
          profileName: profileName.trim(),
          voucherType,
          lines,
          narration: narration.trim(),
        });
        toast.success(`Preset '${profileName}' created successfully`);
      }
      navigate('/preset-journal');
    } catch (err) {
      toast.error('Failed to save preset template');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await remove(id);
      toast.success('Preset deleted');
      navigate('/preset-journal');
    } catch (e) {
      toast.error('Failed to delete preset');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/70">
        <div className="flex items-center gap-3">
          <Link
            to="/preset-journal"
            className="p-2 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-all shadow-2xs"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-foreground">
                {isEdit ? `Edit Preset — ${profileName || 'Untitled'}` : 'New Preset'}
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-mono font-bold">
                {voucherType} Voucher
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Reusable template library for fast double-entry ledger vouchers
            </p>
          </div>
        </div>

        {/* Edit mode meta */}
        {isEdit && (
          <div className="flex items-center gap-3 text-xs text-muted-foreground bg-muted/40 px-3 py-1.5 rounded-xl border border-border/50 self-start sm:self-center">
            <span className="flex items-center gap-1 font-mono">
              <TrendingUp className="size-3 text-emerald-600" />
              <span>Used {usageCount} times</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              <span>Last: {formatRelativeTime(lastUsedAt)}</span>
            </span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Section 1: Profile Header */}
        <ProfileHeaderBlock
          voucherType={voucherType}
          profileName={profileName}
          onChangeVoucherType={handleVoucherTypeChange}
          onChangeProfileName={setProfileName}
          errors={errors}
        />

        {/* Section 2: Line Item Table */}
        <LineItemTable
          voucherType={voucherType}
          lines={lines}
          onAddLine={handleAddLine}
          onRemoveLine={handleRemoveLine}
          onUpdateLine={handleUpdateLine}
          errors={errors}
        />

        {/* Section 3: Narration */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-foreground">
              3. Default Master Narration
            </label>
            <span className="text-[10px] text-muted-foreground font-mono">
              {narration.length}/500 chars
            </span>
          </div>

          <textarea
            rows={3}
            maxLength={500}
            placeholder="This narration will pre-fill into the journal voucher when loaded from preset..."
            value={narration}
            onChange={(e) => setNarration(e.target.value)}
            className="w-full p-3 rounded-xl border border-border bg-card text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-2xs resize-none"
          />

          <p className="text-[11px] text-muted-foreground italic">
            Helper: When a user selects this preset in Journal Entries, this narration will automatically pre-fill the voucher's description.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="p-4 rounded-2xl border border-border/80 bg-card shadow-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Link
              to="/preset-journal"
              className="px-4 py-2 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-all cursor-pointer"
            >
              Cancel
            </Link>

            {isEdit && (
              <button
                type="button"
                onClick={() => setDeleteDialogOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 text-rose-600 text-xs font-bold hover:bg-rose-100/60 transition-all cursor-pointer"
              >
                <Trash2 className="size-3.5" />
                <span>Delete Preset</span>
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-md hover:bg-primary/90 transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="size-4" />
            <span>{isSaving ? 'Saving Preset...' : isEdit ? 'Update Preset' : 'Save Preset'}</span>
          </button>
        </div>
      </form>

      {/* Delete confirmation dialog in edit mode */}
      <DeleteConfirmDialog
        preset={
          deleteDialogOpen
            ? {
                id: id || '',
                profileName,
                voucherType,
                lines,
                usageCount,
                createdAt: createdAt || '',
                updatedAt: '',
              }
            : null
        }
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

export default PresetJournalFormPage;
