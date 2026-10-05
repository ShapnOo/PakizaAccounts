import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Building2,
  FileText,
  Truck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
} from 'lucide-react';
import {
  SubledgerType,
  SubledgerEntry,
  SUBLEDGER_CONFIG,
  SUBLEDGER_TABS,
} from '../../types/subledger';
import { useSubledgerStore } from '../../stores/subledgerStore';
import { getSubledgerById } from '../../services/subledgerService';
import { CompanyMultiSelect } from '../../components/subledger/CompanyMultiSelect';
import {
  subledgerSchema,
  validateSubledgerUniqueness,
} from '../../lib/validation/subledger';
import { toast } from 'sonner';

const TYPE_ICONS: Record<SubledgerType, React.ElementType> = {
  'cost-center': Building2,
  'reference-center': FileText,
  vehicle: Truck,
};

export const SubledgerFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();

  // Determine subledger type from query param (?type=...) or fallback
  const queryType = searchParams.get('type') as SubledgerType | null;
  const initialType: SubledgerType =
    queryType && SUBLEDGER_TABS.includes(queryType) ? queryType : 'cost-center';

  const [type, setType] = useState<SubledgerType>(initialType);
  const [name, setName] = useState('');
  const [effectiveCompanyIds, setEffectiveCompanyIds] = useState<string[]>(['PSL']);
  const [activeStatus, setActiveStatus] = useState<'Active' | 'Inactive'>('Active');
  const [meta, setMeta] = useState<{ createdAt: string; updatedAt: string } | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(!!id);

  const nameInputRef = useRef<HTMLInputElement>(null);

  // Store actions
  const add = useSubledgerStore((state) => state.add);
  const update = useSubledgerStore((state) => state.update);
  const entries = useSubledgerStore((state) => state.entries);
  const load = useSubledgerStore((state) => state.load);

  const isEditMode = !!id;
  const config = SUBLEDGER_CONFIG[type] || SUBLEDGER_CONFIG['cost-center'];
  const Icon = TYPE_ICONS[type] || Building2;

  // Ensure entries are loaded for uniqueness checks
  useEffect(() => {
    load();
  }, [load]);

  // Load entry if in edit mode
  useEffect(() => {
    if (id) {
      setIsLoading(true);
      getSubledgerById(id)
        .then((entry) => {
          if (entry) {
            setType(entry.type);
            setName(entry.name);
            setEffectiveCompanyIds(entry.effectiveCompanyIds || ['PSL']);
            setActiveStatus(entry.activeStatus);
            setMeta({ createdAt: entry.createdAt, updatedAt: entry.updatedAt });
          } else {
            toast.error('Subledger record not found');
            navigate('/subledger', { replace: true });
          }
        })
        .catch((err) => {
          console.error(err);
          toast.error('Failed to load subledger record');
          navigate('/subledger', { replace: true });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      if (queryType && SUBLEDGER_TABS.includes(queryType)) {
        setType(queryType);
      }
    }
  }, [id, queryType, navigate]);

  // Auto-focus Name input on mount
  useEffect(() => {
    if (!isLoading && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isLoading]);

  const handleCancel = () => {
    navigate(`/subledger?tab=${type}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // 1. Zod schema validation
    const result = subledgerSchema.safeParse({
      type,
      name,
      effectiveCompanyIds,
      activeStatus,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    // 2. Uniqueness validation: unique per (type, company)
    const uniquenessError = validateSubledgerUniqueness(
      name,
      type,
      effectiveCompanyIds,
      entries,
      id
    );

    if (uniquenessError) {
      setErrors({ name: uniquenessError });
      return;
    }

    // 3. Save via store
    setIsSubmitting(true);
    try {
      if (isEditMode && id) {
        await update(id, {
          name: name.trim(),
          effectiveCompanyIds,
          activeStatus,
        });
      } else {
        await add({
          type,
          name: name.trim(),
          effectiveCompanyIds,
          activeStatus,
        });
      }

      // Navigate back to the originating tab
      navigate(`/subledger?tab=${type}`);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center space-y-3">
        <div className="size-9 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Loading subledger details...</p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-5 space-y-6">
      {/* ── Top Navigation Bar ── */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            to={`/subledger?tab=${type}`}
            className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors shadow-2xs"
            title="Back to subledger list"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">
                Subledger Management
              </span>
              <span className="text-slate-300">/</span>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200/60">
                {config.label}
              </span>
            </div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight mt-0.5">
              {isEditMode ? `Edit ${config.singular}` : `Create ${config.singular}`}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 hidden sm:inline">
            Press Save to apply changes
          </span>
        </div>
      </div>

      {/* ── Main Form Card (Centered, Clean Single-Column) ── */}
      <div className="max-w-2xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
        >
          {/* Card Header */}
          <div className="px-6 py-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shadow-2xs">
                <Icon className="size-4.5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  {config.singular} Information
                </h2>
                <p className="text-xs text-slate-500">
                  Specify name, company assignments, and active tracking status
                </p>
              </div>
            </div>

            {/* Read-only Type Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
              <Layers className="size-3 text-slate-500" />
              <span>{config.label}</span>
            </div>
          </div>

          {/* Form Body: Exactly 3 fields as per specification */}
          <div className="p-6 sm:p-7 space-y-6">
            {/* Field 1: Name (Label dynamic: "Cost Center Name", "Reference Center", "Vehicles") */}
            <div className="space-y-1.5">
              <label
                htmlFor="subledger-name"
                className="block text-xs font-bold text-slate-700"
              >
                {config.nameColumnLabel} <span className="text-rose-500">*</span>
              </label>
              <input
                ref={nameInputRef}
                id="subledger-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) {
                    setErrors((prev) => ({ ...prev, name: '' }));
                  }
                }}
                placeholder={
                  type === 'cost-center'
                    ? 'e.g. Head Office, Spinning Division, Factory Unit-1'
                    : type === 'reference-center'
                    ? 'e.g. REF-2026-EXP-A, Project Core'
                    : 'e.g. Truck-01 (Dhaka Metro-GA-11-2041)'
                }
                className={[
                  'w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all duration-200',
                  errors.name
                    ? 'border-rose-400 bg-rose-50/20 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500'
                    : 'border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20',
                ].join(' ')}
              />
              {errors.name ? (
                <p className="flex items-center gap-1 text-xs text-rose-600 font-medium mt-1">
                  <AlertCircle className="size-3 shrink-0" />
                  <span>{errors.name}</span>
                </p>
              ) : (
                <p className="text-[11px] text-slate-400">
                  Unique identifier name used when classifying vouchers and ledger transactions (2–120 characters).
                </p>
              )}
            </div>

            {/* Field 2: Effective Company (multi-select combobox) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Effective Company <span className="text-rose-500">*</span>
              </label>
              <CompanyMultiSelect
                value={effectiveCompanyIds}
                onChange={(newIds) => {
                  setEffectiveCompanyIds(newIds);
                  if (errors.effectiveCompanyIds) {
                    setErrors((prev) => ({ ...prev, effectiveCompanyIds: '' }));
                  }
                }}
                error={errors.effectiveCompanyIds}
              />
              <p className="text-[11px] text-slate-400">
                Select one or more operating companies where this {config.singular.toLowerCase()} is valid.
              </p>
            </div>

            {/* Field 3: Active Status (Segmented control: Active | Inactive) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Active Status
              </label>
              <div className="inline-flex items-center p-1 rounded-xl border border-slate-200 bg-slate-50 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setActiveStatus('Active')}
                  className={[
                    'flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer select-none',
                    activeStatus === 'Active'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800',
                  ].join(' ')}
                >
                  <span className="size-2 rounded-full bg-emerald-600" />
                  <span>Active</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStatus('Inactive')}
                  className={[
                    'flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer select-none',
                    activeStatus === 'Inactive'
                      ? 'bg-slate-200 text-slate-800 border border-slate-300 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800',
                  ].join(' ')}
                >
                  <span className="size-2 rounded-full bg-slate-400" />
                  <span>Inactive</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Inactive records are hidden from active entry drop-downs while maintaining audit integrity.
              </p>
            </div>
          </div>

          {/* Edit Mode Metadata Strip */}
          {isEditMode && meta && (
            <div className="px-6 py-2.5 bg-slate-50/50 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-400">
              <Clock className="size-3 text-slate-400" />
              <span>
                Created {new Date(meta.createdAt).toLocaleDateString()} · Last updated{' '}
                {new Date(meta.updatedAt).toLocaleDateString()}
              </span>
            </div>
          )}

          {/* Card Footer: Cancel & Save Buttons */}
          <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-200 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer text-center"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="inline-block size-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              <span>
                {isSubmitting
                  ? 'Saving...'
                  : isEditMode
                  ? `Update ${config.singular}`
                  : `Save ${config.singular}`}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubledgerFormPage;
