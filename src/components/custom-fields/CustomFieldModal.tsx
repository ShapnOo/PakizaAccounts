import React, { useState, useEffect } from 'react';
import {
  CustomField,
  CustomFieldContext,
  CustomFieldDataType,
  CONTEXT_CONFIG,
  DATA_TYPES,
} from '../../types/customField';
import { DataTypeChip } from './DataTypeChip';
import { OptionsEditor } from './OptionsEditor';
import { DefaultValueEditor } from './DefaultValueEditor';
import { validateLabelUniqueness } from '../../lib/validation/customField';
import { X, Save, Sparkles, Check, Info } from 'lucide-react';
import { toast } from 'sonner';

interface CustomFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: Omit<CustomField, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => Promise<any>;
  onUpdate?: (id: string, patch: Partial<CustomField>) => Promise<any>;
  fieldToEdit: CustomField | null;
  initialContext: CustomFieldContext;
  existingFields: CustomField[];
}

export const CustomFieldModal: React.FC<CustomFieldModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onUpdate,
  fieldToEdit,
  initialContext,
  existingFields,
}) => {
  const isEdit = !!fieldToEdit;

  const [context, setContext] = useState<CustomFieldContext>(initialContext);
  const [label, setLabel] = useState('');
  const [dataType, setDataType] = useState<CustomFieldDataType>('Text');
  const [mandatory, setMandatory] = useState<boolean>(false);
  const [activeStatus, setActiveStatus] = useState<'Active' | 'Inactive'>('Active');
  const [options, setOptions] = useState<string[]>(['Option 1', 'Option 2']);
  const [defaultValue, setDefaultValue] = useState<any>('');
  const [hasDefault, setHasDefault] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ label?: string; options?: string }>({});

  useEffect(() => {
    if (fieldToEdit) {
      setContext(fieldToEdit.context);
      setLabel(fieldToEdit.label);
      setDataType(fieldToEdit.dataType);
      setMandatory(fieldToEdit.mandatory);
      setActiveStatus(fieldToEdit.activeStatus);
      setOptions(fieldToEdit.options && fieldToEdit.options.length > 0 ? fieldToEdit.options : ['Option 1', 'Option 2']);
      setDefaultValue(fieldToEdit.defaultValue ?? '');
      setHasDefault(fieldToEdit.defaultValue !== undefined && fieldToEdit.defaultValue !== null && fieldToEdit.defaultValue !== '');
    } else {
      setContext(initialContext);
      setLabel('');
      setDataType('Text');
      setMandatory(false);
      setActiveStatus('Active');
      setOptions(['Option 1', 'Option 2']);
      setDefaultValue('');
      setHasDefault(false);
    }
    setErrors({});
  }, [fieldToEdit, initialContext, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { label?: string; options?: string } = {};

    const trimmedLabel = label.trim();
    if (!trimmedLabel) {
      newErrors.label = 'Field label is required';
    } else if (trimmedLabel.length < 2) {
      newErrors.label = 'Label must be at least 2 characters';
    } else if (trimmedLabel.length > 40) {
      newErrors.label = 'Label must not exceed 40 characters';
    } else {
      const uniquenessError = validateLabelUniqueness(
        trimmedLabel,
        context,
        existingFields,
        fieldToEdit?.id
      );
      if (uniquenessError) {
        newErrors.label = uniquenessError;
      }
    }

    if ((dataType === 'Dropdown' || dataType === 'MultiSelect') && options.length === 0) {
      newErrors.options = 'At least one option is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const payload: Omit<CustomField, 'id' | 'createdAt' | 'updatedAt' | 'order'> = {
        context,
        label: trimmedLabel,
        dataType,
        mandatory,
        activeStatus,
        options: dataType === 'Dropdown' || dataType === 'MultiSelect' ? options : undefined,
        defaultValue: hasDefault ? defaultValue : null,
      };

      if (isEdit && fieldToEdit && onUpdate) {
        await onUpdate(fieldToEdit.id, payload);
      } else {
        await onSave(payload);
      }
      onClose();
    } catch (err: any) {
      // Toast already triggered by store
    } finally {
      setLoading(false);
    }
  };

  const contextLabel = CONTEXT_CONFIG[context]?.label || context;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-border/80 flex items-center justify-between bg-muted/20">
          <div>
            <h2 className="text-base font-bold text-foreground">
              {isEdit ? `Edit Custom Field — ${fieldToEdit.label}` : `New Custom Field — ${contextLabel}`}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Configure line-item column definition and data behavior.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 sidebar-scroll">
          {/* 1. Context Selector */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-foreground">
              Module Scope / Context
            </label>
            {isEdit ? (
              <div className="h-8.5 px-3 rounded-lg border border-border bg-muted/40 text-xs font-semibold text-muted-foreground flex items-center">
                {contextLabel}
              </div>
            ) : (
              <select
                value={context}
                onChange={(e) => setContext(e.target.value as CustomFieldContext)}
                className="w-full h-8.5 px-3 rounded-lg border border-border bg-card text-xs font-semibold text-foreground outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-2xs"
              >
                {Object.entries(CONTEXT_CONFIG).map(([k, cfg]) => (
                  <option key={k} value={k}>
                    {cfg.label}
                  </option>
                ))}
              </select>
            )}
            <p className="text-[11px] text-muted-foreground italic">
              Determines which voucher or entry screen will display this column.
            </p>
          </div>

          {/* 2. Label Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-foreground flex items-center justify-between">
              <span>
                Label Name <span className="text-rose-500">*</span>
              </span>
              <span className="text-[11px] font-normal text-muted-foreground">
                {label.length}/40
              </span>
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => {
                setLabel(e.target.value);
                if (errors.label) setErrors((prev) => ({ ...prev, label: undefined }));
              }}
              placeholder="e.g. Invoice, PO Reference, Batch No."
              maxLength={40}
              className={`w-full h-8.5 px-3 rounded-lg border bg-card text-xs font-semibold text-foreground outline-none transition-all focus:ring-1 focus:ring-indigo-500 shadow-2xs ${
                errors.label ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-border'
              }`}
            />
            {errors.label && (
              <p className="text-[11px] text-rose-500 font-semibold">{errors.label}</p>
            )}

            {/* Live Preview Chip */}
            <div className="pt-1 flex items-center gap-2">
              <span className="text-[11px] text-muted-foreground font-medium">
                Table Header Preview:
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-muted/60 border border-border/80 text-[11px] font-bold text-foreground uppercase tracking-wider">
                {label.trim() ? label.trim() : 'Column Header'}
                {mandatory && <span className="text-rose-500">*</span>}
              </span>
            </div>
          </div>

          {/* 3. Data Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">
              Data Type <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {DATA_TYPES.map((dt) => {
                const isSelected = dataType === dt;
                return (
                  <button
                    key={dt}
                    type="button"
                    onClick={() => setDataType(dt)}
                    className={`p-2 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 ring-1 ring-indigo-500'
                        : 'border-border bg-card hover:bg-muted/40'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <DataTypeChip dataType={dt} size="sm" />
                      {isSelected && <Check className="size-3 text-indigo-600 dark:text-indigo-400" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Options Editor if Dropdown or MultiSelect */}
          {(dataType === 'Dropdown' || dataType === 'MultiSelect') && (
            <OptionsEditor
              options={options}
              onChange={setOptions}
            />
          )}

          {/* 4. Mandatory & 5. Active Status toggles side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Mandatory */}
            <div className="p-3 rounded-xl border border-border bg-card space-y-1.5 shadow-2xs">
              <label className="text-xs font-bold text-foreground block">
                Mandatory (Required)
              </label>
              <div className="flex rounded-lg border border-border p-0.5 bg-muted/30">
                <button
                  type="button"
                  onClick={() => setMandatory(true)}
                  className={`flex-1 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    mandatory
                      ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 shadow-2xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setMandatory(false)}
                  className={`flex-1 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    !mandatory
                      ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 shadow-2xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  No
                </button>
              </div>
              <p className="text-[10.5px] text-muted-foreground italic">
                {mandatory
                  ? 'Users must fill this before posting transaction.'
                  : 'Optional for voucher entries.'}
              </p>
            </div>

            {/* Active Status */}
            <div className="p-3 rounded-xl border border-border bg-card space-y-1.5 shadow-2xs">
              <label className="text-xs font-bold text-foreground block">
                Active Status
              </label>
              <div className="flex rounded-lg border border-border p-0.5 bg-muted/30">
                <button
                  type="button"
                  onClick={() => setActiveStatus('Active')}
                  className={`flex-1 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    activeStatus === 'Active'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 shadow-2xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Active
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStatus('Inactive')}
                  className={`flex-1 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    activeStatus === 'Inactive'
                      ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 shadow-2xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Inactive
                </button>
              </div>
              <p className="text-[10.5px] text-muted-foreground italic">
                {activeStatus === 'Active'
                  ? 'Shown as dynamic column in entry form.'
                  : 'Hidden from entry forms without data loss.'}
              </p>
            </div>
          </div>

          {/* 6. Default Value Section */}
          <div className="p-3 rounded-xl border border-border bg-muted/15 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-indigo-500" />
                <span>Default Value for New Lines</span>
              </label>
              <button
                type="button"
                onClick={() => setHasDefault(!hasDefault)}
                className={`text-xs font-semibold px-2 py-0.5 rounded cursor-pointer transition-colors ${
                  hasDefault
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {hasDefault ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            {hasDefault && (
              <div className="pt-1">
                <DefaultValueEditor
                  dataType={dataType}
                  value={defaultValue}
                  options={options}
                  onChange={setDefaultValue}
                />
              </div>
            )}
          </div>

          {/* Edit mode meta strip */}
          {isEdit && fieldToEdit && (
            <div className="text-[11px] text-muted-foreground/80 px-1 pt-1">
              Created: {new Date(fieldToEdit.createdAt).toLocaleDateString()} · Last updated:{' '}
              {new Date(fieldToEdit.updatedAt).toLocaleDateString()}
            </div>
          )}

          {/* Modal Footer Buttons */}
          <div className="pt-3 border-t border-border/80 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Save className="size-3.5" />
              <span>{loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Field'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
