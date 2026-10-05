import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Save,
  Building2,
  FileText,
  Truck,
  AlertCircle,
  Clock,
  Layers,
} from 'lucide-react';
import {
  SubledgerType,
  SubledgerEntry,
  SUBLEDGER_CONFIG,
} from '../../types/subledger';
import { useSubledgerStore } from '../../stores/subledgerStore';
import { CompanyMultiSelect } from './CompanyMultiSelect';
import {
  subledgerSchema,
  validateSubledgerUniqueness,
} from '../../lib/validation/subledger';

interface SubledgerModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: SubledgerType;
  entryToEdit?: SubledgerEntry | null;
  onSuccess?: (entry: SubledgerEntry) => void;
}

const TYPE_ICONS: Record<SubledgerType, React.ElementType> = {
  'cost-center': Building2,
  'reference-center': FileText,
  vehicle: Truck,
};

export const SubledgerModal: React.FC<SubledgerModalProps> = ({
  isOpen,
  onClose,
  type,
  entryToEdit,
  onSuccess,
}) => {
  const isEditMode = !!entryToEdit;
  const config = SUBLEDGER_CONFIG[type] || SUBLEDGER_CONFIG['cost-center'];
  const Icon = TYPE_ICONS[type] || Building2;

  const [name, setName] = useState('');
  const [effectiveCompanyIds, setEffectiveCompanyIds] = useState<string[]>(['PSL']);
  const [activeStatus, setActiveStatus] = useState<'Active' | 'Inactive'>('Active');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);

  // Store actions
  const add = useSubledgerStore((state) => state.add);
  const update = useSubledgerStore((state) => state.update);
  const entries = useSubledgerStore((state) => state.entries);

  // Reset or populate fields whenever modal opens or entryToEdit changes
  useEffect(() => {
    if (isOpen) {
      if (entryToEdit) {
        setName(entryToEdit.name);
        setEffectiveCompanyIds(entryToEdit.effectiveCompanyIds || ['PSL']);
        setActiveStatus(entryToEdit.activeStatus);
      } else {
        setName('');
        setEffectiveCompanyIds(['PSL']);
        setActiveStatus('Active');
      }
      setErrors({});
      setIsSubmitting(false);

      // Auto-focus after open animation
      const timer = setTimeout(() => {
        if (nameInputRef.current) {
          nameInputRef.current.focus();
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen, entryToEdit]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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
      entryToEdit?.id
    );

    if (uniquenessError) {
      setErrors({ name: uniquenessError });
      return;
    }

    // 3. Save via store
    setIsSubmitting(true);
    try {
      let savedEntry: SubledgerEntry;
      if (isEditMode && entryToEdit) {
        savedEntry = await update(entryToEdit.id, {
          name: name.trim(),
          effectiveCompanyIds,
          activeStatus,
        });
      } else {
        savedEntry = await add({
          type,
          name: name.trim(),
          effectiveCompanyIds,
          activeStatus,
        });
      }

      onSuccess?.(savedEntry);
      onClose();
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in-0 duration-150">
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shadow-2xs">
              <Icon className="size-4.5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                {isEditMode ? `Edit ${config.singular}` : `Create ${config.singular}`}
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60 hidden sm:inline-flex items-center gap-1">
                  <Layers className="size-2.5" />
                  {config.label}
                </span>
              </h2>
              <p className="text-[11px] text-slate-500">
                {isEditMode
                  ? `Update ${config.singular.toLowerCase()} details and company scope`
                  : `Add new ${config.singular.toLowerCase()} for tracking across vouchers`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            title="Close dialog"
          >
            <X className="size-4.5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-5">
            {/* Field 1: Name (Label dynamic) */}
            <div className="space-y-1.5">
              <label
                htmlFor="modal-subledger-name"
                className="block text-xs font-bold text-slate-700"
              >
                {config.nameColumnLabel} <span className="text-rose-500">*</span>
              </label>
              <input
                ref={nameInputRef}
                id="modal-subledger-name"
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
                  Unique name for voucher and ledger dimensions (2–120 characters).
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
                    'flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer select-none',
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
                    'flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer select-none',
                    activeStatus === 'Inactive'
                      ? 'bg-slate-200 text-slate-800 border border-slate-300 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800',
                  ].join(' ')}
                >
                  <span className="size-2 rounded-full bg-slate-400" />
                  <span>Inactive</span>
                </button>
              </div>
            </div>

            {/* Edit Mode Metadata Strip */}
            {isEditMode && entryToEdit && (
              <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-400">
                <Clock className="size-3 text-slate-400" />
                <span>
                  Created {new Date(entryToEdit.createdAt).toLocaleDateString()} · Last updated{' '}
                  {new Date(entryToEdit.updatedAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-3.5 bg-slate-50/80 border-t border-slate-200 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="inline-block size-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="size-3.5" />
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
