import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Account, AccountFormData, HierarchyLevel } from '../../types/coa';
import { accountFormSchema, AccountFormValues } from '../../lib/coaValidation';
import {
  ACCOUNTS_TYPE_TREE,
  COMPANY,
  DEFAULT_CURRENCY,
  MANDATORY_DETAILS_TYPES,
  Nature,
} from '../../constants/accountsTypeTree';
import { generateNextAccountCode, formatAccountCode } from '../../lib/accountCode';
import { ParentAccountPicker } from './ParentAccountPicker';
import { DetailsTypeSelect } from './DetailsTypeSelect';
import { BankDetailsSection } from './BankDetailsSection';
import { AuxiliaryDimensions } from './AuxiliaryDimensions';
import { CompanyMultiSelectPicker } from './CompanyMultiSelectPicker';
import {
  Info,
  Check,
  X,
  FilePlus2,
  FolderTree,
  Building2,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  ShieldAlert,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChartCreateFormProps {
  initialAccount?: Account;
  defaultParentId?: string | null;
  allAccounts: Account[];
  extraDetailsTypes: string[];
  onAddDetailsType: (type: string) => void;
  onSubmit: (data: AccountFormData) => void;
  onCancel?: () => void;
  isEditMode?: boolean;
}

export const ChartCreateForm: React.FC<ChartCreateFormProps> = ({
  initialAccount,
  defaultParentId,
  allAccounts,
  extraDetailsTypes,
  onAddDetailsType,
  onSubmit,
  onCancel,
  isEditMode = false,
}) => {
  const navigate = useNavigate();

  const effectiveParentId = initialAccount?.parentId ?? defaultParentId ?? null;
  const parentAcc = effectiveParentId ? allAccounts.find((a) => a.id === effectiveParentId) : null;

  const defaultValues: AccountFormValues = {
    name: initialAccount?.name || '',
    accountsType: initialAccount?.accountsType || parentAcc?.accountsType || 'Cash & Cash Equivalent',
    parentId: effectiveParentId,
    manualCode: initialAccount?.manualCode || '',
    description: initialAccount?.description || '',
    activeStatus: initialAccount?.activeStatus || 'Active',
    companyName: initialAccount?.companyName || COMPANY,
    isParent: initialAccount?.isParent ?? false,
    defaultCurrency: 'BDT',
    isMandatory: initialAccount?.isMandatory ?? false,
    aux: initialAccount?.aux || {},
    detailsType: initialAccount?.detailsType || '',
    bankDetails: initialAccount?.bankDetails || {
      bankName: '',
      accountNumber: '',
      accountType: 'CD',
    },
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  });

  const isParent = watch('isParent');
  const parentId = watch('parentId');
  const accountsType = watch('accountsType');
  const detailsType = watch('detailsType');
  const watchedName = watch('name');
  const defaultCurrency = watch('defaultCurrency');

  // Selected taxonomy node
  const currentTaxonomyNode = useMemo(() => {
    return ACCOUNTS_TYPE_TREE.find((t) => t.type === accountsType);
  }, [accountsType]);

  const isDetailsMandatory = useMemo(() => {
    return MANDATORY_DETAILS_TYPES.includes(
      accountsType as (typeof MANDATORY_DETAILS_TYPES)[number]
    );
  }, [accountsType]);

  // Dynamic code preview calculation
  const codePreview = useMemo(() => {
    try {
      const parent = parentId ? allAccounts.find((a) => a.id === parentId) : null;
      const nature: Nature = currentTaxonomyNode ? currentTaxonomyNode.nature : 'Assets';
      const { code, level } = generateNextAccountCode(nature, parent, allAccounts);
      return { code, level };
    } catch (e) {
      return { code: '010000000000', level: 1 as HierarchyLevel };
    }
  }, [parentId, currentTaxonomyNode, allAccounts]);

  // When Make This Parent is activated (R6), clear non-parent details
  const handleToggleMakeParent = () => {
    const nextVal = !isParent;
    setValue('isParent', nextVal);
    if (nextVal) {
      setValue('manualCode', '');
      setValue('description', '');
      setValue('detailsType', '');
      setValue('aux', {});
    }
  };

  const onFormSubmit = (data: AccountFormValues) => {
    onSubmit({
      ...data,
      parentId: data.parentId || null,
      bankDetails:
        data.detailsType === 'Bank' && data.bankDetails?.bankName
          ? {
              bankName: data.bankDetails.bankName,
              accountNumber: data.bankDetails.accountNumber || '',
              accountType: data.bankDetails.accountType || 'CD',
            }
          : undefined,
    });
  };

  // Group taxonomy options by Nature > Category
  const groupedTaxonomy = useMemo(() => {
    const groups: Record<string, typeof ACCOUNTS_TYPE_TREE> = {};
    ACCOUNTS_TYPE_TREE.forEach((item) => {
      const key = `${item.nature}${item.category ? ` · ${item.category}` : ''}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });
    return groups;
  }, []);

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">


      {/* ── Form Body: Two-column Layout + Right Rail Hints ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* ══════════════════════════════════════════════════
            LEFT PANEL: "GL info." (5 cols)
           ══════════════════════════════════════════════════ */}
        <div className="lg:col-span-6 bg-card border border-border/70 rounded-xl shadow-2xs overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-4 py-3 border-b border-border/50 bg-muted/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderTree className="size-4 text-primary" />
              <h3 className="text-xs font-black uppercase tracking-wider text-foreground">
                GL info.
              </h3>
            </div>
            {isParent && (
              <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
                Parent Account Mode
              </span>
            )}
          </div>

          <div className="p-4 space-y-3.5 flex-1">
            {/* 1. Accounts Name (Required) */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground/85 flex items-center justify-between">
                <span>
                  Accounts Name <span className="text-rose-500">*</span>
                </span>
                <span className="text-[10.5px] text-muted-foreground font-normal">
                  Unique per company
                </span>
              </label>
              <input
                type="text"
                placeholder="e.g. DBBL-100001122 or Cash at Bank DBBL"
                {...register('name')}
                className={`w-full h-9 px-3 rounded-lg bg-card border text-xs font-semibold text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-2xs ${
                  errors.name ? 'border-rose-500 ring-2 ring-rose-500/10' : 'border-border/80'
                }`}
              />
              {errors.name && (
                <p className="text-[10.5px] font-medium text-rose-500">{errors.name.message}</p>
              )}
            </div>

            {/* 2. Accounts Type (Select from Taxonomy) */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground/85 flex items-center justify-between">
                <span>
                  Accounts Type <span className="text-rose-500">*</span>
                </span>
                <span className="text-[10.5px] text-muted-foreground font-normal">
                  Taxonomy Category
                </span>
              </label>
              <select
                {...register('accountsType')}
                className={`w-full h-9 px-3 rounded-lg bg-card border text-xs font-semibold text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-2xs cursor-pointer ${
                  errors.accountsType
                    ? 'border-rose-500 ring-2 ring-rose-500/10'
                    : 'border-border/80'
                }`}
              >
                {Object.entries(groupedTaxonomy).map(([groupName, items]) => (
                  <optgroup key={groupName} label={groupName}>
                    {items.map((it) => (
                      <option key={`${it.nature}-${it.type}`} value={it.type}>
                        {it.type} {it.detailsMandatory ? '(Details Req.)' : ''}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              {errors.accountsType && (
                <p className="text-[10.5px] font-medium text-rose-500">
                  {errors.accountsType.message}
                </p>
              )}
            </div>

            {/* 3. Parent Accounts (Tree Picker) */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground/85 flex items-center justify-between">
                <span>Parent Accounts</span>
                <span className="text-[10.5px] text-muted-foreground font-normal">
                  Max depth 5 allowed
                </span>
              </label>
              <Controller
                control={control}
                name="parentId"
                render={({ field }) => (
                  <ParentAccountPicker
                    accounts={allAccounts}
                    value={field.value}
                    onChange={field.onChange}
                    currentAccountId={initialAccount?.id}
                    error={errors.parentId?.message}
                  />
                )}
              />
            </div>

            {/* 4. Manual Code & 5. Description (Shown when not in Parent Account Mode) */}
            {!isParent && (
              <>
                {/* 4. Manual Code */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground/85 flex items-center justify-between">
                    <span>Manual Code</span>
                    <span className="text-[10.5px] text-muted-foreground font-normal">
                      Optional numeric code (e.g. 111000)
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="111000"
                    {...register('manualCode')}
                    className="w-full h-8.5 px-3 rounded-lg bg-card border border-border/80 text-xs font-mono text-foreground outline-none focus:ring-1 focus:ring-primary focus:border-primary shadow-2xs"
                  />
                  {errors.manualCode && (
                    <p className="text-[10.5px] font-medium text-rose-500">
                      {errors.manualCode.message}
                    </p>
                  )}
                </div>

                {/* 5. Description */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground/85">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Optional notes or account guidelines..."
                    {...register('description')}
                    className="w-full p-2.5 rounded-lg bg-card border border-border/80 text-xs text-foreground outline-none focus:ring-1 focus:ring-primary focus:border-primary shadow-2xs resize-none"
                  />
                </div>
              </>
            )}

            {/* 6. Make This Parent Account */}
            <div className="pt-2 border-t border-border/50">
              <button
                type="button"
                onClick={handleToggleMakeParent}
                className={`w-full py-2 px-3 rounded-xl border flex items-center justify-between text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                  isParent
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-700 dark:text-amber-400'
                    : 'bg-muted/40 border-border hover:bg-muted text-foreground'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FolderTree className="size-4 text-primary" />
                  <span>Make This Parent Account</span>
                </div>
                <div
                  className={`size-4 rounded-full border grid place-items-center ${
                    isParent ? 'bg-amber-500 border-amber-500 text-white' : 'border-border'
                  }`}
                >
                  {isParent && <Check className="size-3 stroke-[3]" />}
                </div>
              </button>

              {isParent && (
                <div className="mt-2.5 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-2 text-[11px] text-amber-700 dark:text-amber-400">
                  <Info className="size-4 shrink-0 mt-0.5" />
                  <p>
                    <strong>Parent Account Notice:</strong> Parent accounts do not hold leaf-level
                    GL info (Manual Code, Description, Details Type, or Bank Details).
                  </p>
                </div>
              )}
            </div>

            {/* 7. Company Name (Multi-select) */}
            <div className="space-y-1 pt-1">
              <label className="text-xs font-bold text-foreground/85 flex items-center justify-between">
                <span>
                  Company Name <span className="text-rose-500">*</span>
                </span>
                <span className="text-[10px] text-muted-foreground font-normal">
                  Multi-selection enabled
                </span>
              </label>
              <Controller
                control={control}
                name="companyName"
                render={({ field }) => (
                  <CompanyMultiSelectPicker
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.companyName?.message}
                  />
                )}
              />
            </div>

            {/* 8. Active Status */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground/85">Active status</label>
              <Controller
                control={control}
                name="activeStatus"
                render={({ field }) => (
                  <div className="inline-flex p-1 bg-muted/60 rounded-lg border border-border/60">
                    <button
                      type="button"
                      onClick={() => field.onChange('Active')}
                      className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                        field.value === 'Active'
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Active
                    </button>
                    <button
                      type="button"
                      onClick={() => field.onChange('Inactive')}
                      className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                        field.value === 'Inactive'
                          ? 'bg-rose-600 text-white shadow-2xs'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Inactive
                    </button>
                  </div>
                )}
              />
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════
            RIGHT PANEL: "Details" (6 cols)
           ══════════════════════════════════════════════════ */}
        <div className="lg:col-span-6 bg-card border border-border/70 rounded-xl shadow-2xs overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-4 py-3 border-b border-border/50 bg-muted/20 flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-foreground">
              Details
            </h3>
            <span className="text-[11px] text-muted-foreground font-medium">
              Currency: <strong className="text-foreground">{defaultCurrency || 'BDT'}</strong>
            </span>
          </div>

          <div className="p-4 space-y-4 flex-1">
            {isParent ? (
              <div className="py-12 text-center text-muted-foreground space-y-2">
                <FolderTree className="size-8 mx-auto text-muted-foreground/40" />
                <p className="text-xs font-bold text-foreground">Details Disabled for Parent</p>
                <p className="text-[11px] text-muted-foreground max-w-xs mx-auto">
                  Parent account nodes represent organizational branches and do not hold leaf
                  details or banking information.
                </p>
              </div>
            ) : (
              <>
                {/* Default Currency */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground/85 flex items-center justify-between">
                    <span>Default Currency</span>
                    <span className="text-[10px] text-muted-foreground font-normal">Optional</span>
                  </label>
                  <Controller
                    control={control}
                    name="defaultCurrency"
                    render={({ field }) => (
                      <select
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-full h-8.5 px-3 rounded-lg bg-card border border-border/80 text-xs font-mono font-bold text-foreground outline-none focus:ring-1 focus:ring-primary focus:border-primary shadow-2xs cursor-pointer"
                      >
                        <option value="">-- Select Currency (Optional) --</option>
                        <option value="BDT">BDT (Bangladeshi Taka)</option>
                        <option value="USD">USD (US Dollar)</option>
                        <option value="EUR">EUR (Euro)</option>
                        <option value="GBP">GBP (British Pound)</option>
                        <option value="INR">INR (Indian Rupee)</option>
                        <option value="CAD">CAD (Canadian Dollar)</option>
                        <option value="AUD">AUD (Australian Dollar)</option>
                        <option value="SAR">SAR (Saudi Riyal)</option>
                        <option value="AED">AED (UAE Dirham)</option>
                        <option value="SGD">SGD (Singapore Dollar)</option>
                        <option value="CNY">CNY (Chinese Yuan)</option>
                        <option value="JPY">JPY (Japanese Yen)</option>
                      </select>
                    )}
                  />
                </div>

                {/* 5 Fixed Auxiliary Dimensions */}
                <Controller
                  control={control}
                  name="aux"
                  render={({ field }) => (
                    <AuxiliaryDimensions
                      values={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />

                {/* Details Type (Select + Add+) */}
                <div className="space-y-1 pt-2 border-t border-border/50">
                  <label className="text-xs font-bold text-foreground/85 flex items-center justify-between">
                    <span>
                      Details Type {isDetailsMandatory && <span className="text-rose-500">*</span>}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-normal">
                      Drives sub-fields
                    </span>
                  </label>
                  <Controller
                    control={control}
                    name="detailsType"
                    render={({ field }) => (
                      <DetailsTypeSelect
                        value={field.value}
                        onChange={field.onChange}
                        availableOptions={currentTaxonomyNode?.detailsTypeOptions}
                        extraOptions={extraDetailsTypes}
                        onAddOption={onAddDetailsType}
                        isMandatory={isDetailsMandatory}
                        error={errors.detailsType?.message}
                      />
                    )}
                  />
                </div>

                {/* Conditional Sub-block: Bank Details (RULE R7) */}
                <Controller
                  control={control}
                  name="bankDetails"
                  render={({ field }) => (
                    <BankDetailsSection
                      detailsType={detailsType}
                      bankDetails={field.value}
                      onChange={field.onChange}
                      errors={{
                        bankName: (errors.bankDetails as any)?.bankName?.message,
                        accountNumber: (errors.bankDetails as any)?.accountNumber?.message,
                        accountType: (errors.bankDetails as any)?.accountType?.message,
                      }}
                    />
                  )}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Form Actions Bottom Bar ── */}
      <div className="bg-card border border-border/80 rounded-xl p-3 shadow-2xs flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => (onCancel ? onCancel() : navigate('/chart-of-accounts'))}
          className="px-4 py-2 rounded-lg border border-border hover:bg-muted text-xs font-bold text-muted-foreground hover:text-foreground transition-all cursor-pointer"
        >
          Cancel
        </button>

        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold shadow-sm shadow-primary/20 transition-all cursor-pointer whitespace-nowrap active:scale-95 disabled:opacity-50"
          >
            <Check className="size-4 stroke-[2.5]" />
            <span>{isEditMode ? 'Update Account' : 'Save Account'}</span>
          </button>
        </div>
      </div>
    </form>
  );
};
