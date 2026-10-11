import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Save,
  Trash2,
  Loader2,
  Repeat,
  Check,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import {
  VoucherType,
  Cadence,
  RecurringLine,
  RecurringProfile,
} from '../../types/recurringJournal';
import {
  useRecurringJournalStore,
} from '../../stores/recurringJournalStore';
import { getProfile } from '../../services/recurringJournalService';
import { ScheduleHeaderBlock } from '../../components/recurring-journal/ScheduleHeaderBlock';
import { RecurringLineTable } from '../../components/recurring-journal/RecurringLineTable';
import { DeleteConfirmDialog } from '../../components/recurring-journal/DeleteConfirmDialog';

export const RecurringJournalFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addProfile, editProfile, removeProfile } = useRecurringJournalStore();

  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form Fields State
  const [profileName, setProfileName] = useState('');
  const [voucherType, setVoucherType] = useState<VoucherType>('Journal');
  const [repeatEvery, setRepeatEvery] = useState<Cadence>('Month');
  const [startsOn, setStartsOn] = useState(new Date().toISOString().slice(0, 10));
  const [endsOn, setEndsOn] = useState('');
  const [neverExpired, setNeverExpired] = useState(false);
  const [narration, setNarration] = useState('');
  const [lines, setLines] = useState<RecurringLine[]>([
    {
      id: 'l-1',
      accountHeadId: '',
      accountHeadName: '',
      currency: 'BDT',
      exchangeRate: 1,
      debit: 0,
      credit: 0,
      debitBDT: 0,
      creditBDT: 0,
    },
    {
      id: 'l-2',
      accountHeadId: '',
      accountHeadName: '',
      currency: 'BDT',
      exchangeRate: 1,
      debit: 0,
      credit: 0,
      debitBDT: 0,
      creditBDT: 0,
    },
  ]);

  // Load existing profile if in edit mode
  useEffect(() => {
    if (id) {
      setLoading(true);
      getProfile(id).then((profile) => {
        if (!profile) {
          toast.error('Recurring profile not found');
          navigate('/recurring-journal');
          return;
        }
        setProfileName(profile.profileName);
        setVoucherType(profile.voucherType);
        setRepeatEvery(profile.repeatEvery);
        setStartsOn(profile.startsOn);
        setEndsOn(profile.endsOn || '');
        setNeverExpired(profile.neverExpired);
        setNarration(profile.narration || '');
        setLines(profile.lines);
        setLoading(false);
      });
    }
  }, [id, navigate]);

  // Line Handlers
  const handleAddLine = () => {
    const nextLine: RecurringLine = {
      id: `line-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`,
      accountHeadId: '',
      accountHeadName: '',
      currency: 'BDT',
      exchangeRate: 1,
      debit: 0,
      credit: 0,
      debitBDT: 0,
      creditBDT: 0,
    };
    setLines([...lines, nextLine]);
  };

  const handleRemoveLine = (lineId: string) => {
    const minLines = voucherType === 'Journal' || voucherType === 'Contra' ? 2 : 1;
    if (lines.length <= minLines) {
      toast.error(`Minimum ${minLines} lines required for ${voucherType} profile.`);
      return;
    }
    setLines(lines.filter((l) => l.id !== lineId));
  };

  const handleUpdateLine = (lineId: string, patch: Partial<RecurringLine>) => {
    setLines((prev) =>
      prev.map((l) => (l.id === lineId ? { ...l, ...patch } : l))
    );
  };

  // Totals calculations
  const totalDebitBDT = lines.reduce((s, l) => s + (l.debitBDT || 0), 0);
  const totalCreditBDT = lines.reduce((s, l) => s + (l.creditBDT || 0), 0);
  const difference = totalDebitBDT - totalCreditBDT;
  const isBalanced =
    Math.abs(difference) <= 0.01 && (totalDebitBDT > 0 || totalCreditBDT > 0);

  // Submit Handler
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!profileName.trim()) newErrors.profileName = 'Profile name is required';
    if (!startsOn) newErrors.startsOn = 'Start date is required';
    if (!neverExpired && !endsOn) newErrors.endsOn = 'End date is required when Never Expired is off';
    if (!neverExpired && endsOn && endsOn <= startsOn) {
      newErrors.endsOn = 'End date must be strictly after Start date';
    }

    if (lines.length === 0) newErrors.lines = 'At least one line is required';

    lines.forEach((l, idx) => {
      if (!l.accountHeadId) {
        newErrors[`line_${idx}_account`] = `Row #${idx + 1}: Account Head is required`;
      }
    });

    if (voucherType === 'Journal' || voucherType === 'Contra') {
      if (lines.length < 2) newErrors.lines = 'At least 2 lines required';
      if (Math.abs(difference) > 0.01) {
        newErrors.balance = `Debit must equal Credit. Difference: ৳ ${difference.toFixed(2)}`;
      }
      if (totalDebitBDT <= 0) newErrors.lines = 'Total amount must be greater than zero';
    } else if (voucherType === 'Payment') {
      if (totalDebitBDT <= 0) newErrors.lines = 'At least one Debit amount is required';
    } else if (voucherType === 'Receive') {
      if (totalCreditBDT <= 0) newErrors.lines = 'At least one Credit amount is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please resolve validation errors before saving.');
      return;
    }

    setSaving(true);
    try {
      const computedAmount = voucherType === 'Receive' ? totalCreditBDT : totalDebitBDT;

      const payload = {
        profileName: profileName.trim(),
        voucherType,
        repeatEvery,
        startsOn,
        endsOn: neverExpired ? undefined : endsOn,
        neverExpired,
        lines,
        narration: narration.trim(),
        amount: computedAmount,
        active: true,
      };

      if (isEdit && id) {
        await editProfile(id, payload);
        toast.success(`Recurring profile "${profileName}" updated successfully.`);
      } else {
        await addProfile(payload);
        toast.success(`New recurring profile "${profileName}" created successfully.`);
      }

      navigate('/recurring-journal');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save recurring profile');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (!id) return;
    setDeleting(true);
    try {
      await removeProfile(id);
      toast.success(`Profile "${profileName}" deleted.`);
      navigate('/recurring-journal');
    } catch (e: any) {
      toast.error(e.message || 'Failed to delete profile');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-xs font-semibold text-muted-foreground">
          Loading recurring profile template...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-5 space-y-4">
      {/* 1. Header Card */}
      <div className="p-5 sm:p-6 rounded-2xl border border-border/80 bg-card shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/recurring-journal')}
            className="p-2 rounded-xl border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <ArrowLeft className="size-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight text-foreground">
                {isEdit ? `Edit — ${profileName}` : 'New Recurring Profile'}
              </h1>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md border bg-primary/10 text-primary border-primary/20">
                {repeatEvery}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Automated voucher template that executes on a schedule
            </p>
          </div>
        </div>
      </div>

      {/* 2. Main Form */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Section 1: Schedule Header Block */}
        <ScheduleHeaderBlock
          voucherType={voucherType}
          onVoucherTypeChange={setVoucherType}
          profileName={profileName}
          onProfileNameChange={setProfileName}
          repeatEvery={repeatEvery}
          onRepeatEveryChange={setRepeatEvery}
          startsOn={startsOn}
          onStartsOnChange={setStartsOn}
          endsOn={endsOn}
          onEndsOnChange={setEndsOn}
          neverExpired={neverExpired}
          onNeverExpiredChange={setNeverExpired}
          errors={errors}
        />

        {/* Section 2: Line Items Table */}
        <RecurringLineTable
          voucherType={voucherType}
          lines={lines}
          onAddLine={handleAddLine}
          onRemoveLine={handleRemoveLine}
          onUpdateLine={handleUpdateLine}
          errors={errors}
        />

        {/* Section 3: Narration */}
        <div className="p-5 sm:p-6 rounded-2xl border border-border/80 bg-card shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-foreground">
              Narration / Description
            </label>
            <span className="text-[11px] text-muted-foreground">
              {narration.length}/500 chars
            </span>
          </div>
          <textarea
            rows={3}
            maxLength={500}
            value={narration}
            onChange={(e) => setNarration(e.target.value)}
            placeholder="e.g. Monthly salary payable accrual entry across factory and office divisions..."
            className="w-full p-3 rounded-xl border border-border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-primary shadow-2xs resize-none"
          />
          <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
            <span>
              This narration will be used for every voucher generated by this profile.
            </span>
            <span className="italic text-[10.5px]">Applied to every occurrence</span>
          </div>
        </div>

        {/* Section 4: Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {/* Left: Cancel or Delete */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/recurring-journal')}
              className="px-4 py-2.5 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              Cancel
            </button>

            {isEdit && (
              <button
                type="button"
                onClick={() => setDeleteOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30 text-rose-600 hover:bg-rose-100 text-xs font-bold transition-all cursor-pointer"
              >
                <Trash2 className="size-3.5" />
                <span>Delete Profile</span>
              </button>
            )}
          </div>

          {/* Right: Save Profile */}
          <button
            type="submit"
            disabled={saving || ((voucherType === 'Journal' || voucherType === 'Contra') && !isBalanced)}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-sm shadow-primary/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95"
          >
            {saving ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Saving Profile...</span>
              </>
            ) : (
              <>
                <Save className="size-4 stroke-[2.5]" />
                <span>{isEdit ? 'Update Profile' : 'Save Recurring Profile'}</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteProfile}
        profileName={profileName}
        loading={deleting}
      />
    </div>
  );
};
