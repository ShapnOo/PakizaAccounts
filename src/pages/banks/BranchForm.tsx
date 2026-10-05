import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import { BankAccountRef, Branch } from '../../types/bank';
import { branchSchema, BranchFormValues } from '../../lib/validation/bank';
import { getBranch, createBranch, updateBranch, deleteBranch } from '../../services/branchService';
import { useBankStore } from '../../stores/bankStore';

import { BranchFormHeader } from '../../components/banks/BranchFormHeader';
import { BankPicker } from '../../components/banks/BankPicker';
import { BankAliasDisplay } from '../../components/banks/BankAliasDisplay';
import { SwiftBicInput } from '../../components/banks/SwiftBicInput';
import { AccountsInfoSection } from '../../components/banks/AccountsInfoSection';
import { FormFooter } from '../../components/banks/FormFooter';
import { NbHint, NbHintRail } from '../../components/banks/NbHintRail';
import { DeleteConfirmDialog } from '../../components/banks/DeleteConfirmDialog';
import { TableSkeleton } from '../../components/banks/TableSkeleton';

export const BranchForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { banks, loadBanks } = useBankStore();

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BranchFormValues>({
    defaultValues: {
      bankId: '',
      bankName: '',
      bankAlias: '',
      branchName: '',
      address: '',
      routingNo: '',
      swiftCode: '',
      accounts: [],
    },
  });

  const watchedBankId = watch('bankId');
  const watchedBankAlias = watch('bankAlias');
  const watchedBranchName = watch('branchName');
  const watchedAccounts = watch('accounts') || [];

  // Initial load
  useEffect(() => {
    loadBanks();
  }, [loadBanks]);

  // Load branch for edit mode
  useEffect(() => {
    if (!id) return;

    let isMounted = true;
    const fetchBranch = async () => {
      setLoading(true);
      try {
        const data = await getBranch(id);
        if (!isMounted) return;
        if (!data) {
          toast.error('Branch not found');
          navigate('/banks');
          return;
        }

        setCurrentBranch(data);
        setValue('bankId', data.bankId);
        setValue('bankName', data.bankName);
        setValue('bankAlias', data.bankAlias);
        setValue('branchName', data.branchName);
        setValue('address', data.address || '');
        setValue('routingNo', data.routingNo || '');
        setValue('swiftCode', data.swiftCode || '');
        setValue('accounts', data.accounts || []);
      } catch (err) {
        toast.error('Failed to load branch details');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBranch();

    return () => {
      isMounted = false;
    };
  }, [id, setValue, navigate]);

  // When bank changes, ensure bankName and bankAlias are updated in form state
  const handleBankChange = (selectedBankId: string) => {
    setValue('bankId', selectedBankId, { shouldValidate: true });
    const bank = banks.find((b) => b.id === selectedBankId);
    if (bank) {
      setValue('bankName', bank.name, { shouldValidate: true });
      setValue('bankAlias', bank.alias, { shouldValidate: true });
    } else {
      setValue('bankName', '');
      setValue('bankAlias', '');
    }
  };

  // Add / Remove accounts in Accounts Info
  const handleAddAccount = (ref: BankAccountRef) => {
    const current = watchedAccounts;
    if (current.some((a) => a.coaAccountId === ref.coaAccountId)) {
      toast.warning('This account is already linked to this branch');
      return;
    }
    setValue('accounts', [...current, ref], { shouldValidate: true });
    toast.success(`Linked ${ref.accountsName}`);
  };

  const handleRemoveAccount = (refId: string) => {
    setValue(
      'accounts',
      watchedAccounts.filter((a) => a.id !== refId),
      { shouldValidate: true }
    );
    toast.info('Account unlinked from branch');
  };

  // Submit Handler
  const onSubmit = async (values: BranchFormValues) => {
    // Validate with zod
    const result = branchSchema.safeParse(values);
    if (!result.success) {
      const firstError = result.error.issues[0]?.message || 'Please check form fields';
      toast.error(firstError);
      return;
    }

    setSaving(true);
    try {
      if (isEdit && id) {
        await updateBranch(id, values);
        toast.success(`Branch "${values.branchName}" updated successfully`);
      } else {
        await createBranch(values);
        toast.success(`Branch "${values.branchName}" created successfully`);
      }
      navigate('/banks');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save branch');
    } finally {
      setSaving(false);
    }
  };

  // Delete Handler
  const handleDeleteBranch = async () => {
    if (!id) return;
    setDeleting(true);
    try {
      await deleteBranch(id);
      toast.success('Branch deleted successfully');
      navigate('/banks');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete branch');
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/3 animate-pulse" />
        <TableSkeleton rows={6} />
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 pb-20">
      <div className="w-full flex items-start gap-8">
        {/* Main Form Card */}
        <div className="flex-1 min-w-0 bg-card border border-border rounded-2xl shadow-xs p-6 space-y-6">
          <BranchFormHeader
            isEdit={isEdit}
            bankAlias={watchedBankAlias}
            branchName={watchedBranchName}
          />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Identity Block */}
            <div className="space-y-4">
              {/* Row 1: Bank Name */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground">
                    Bank Name <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-muted-foreground hidden sm:inline">
                    Managed via Bank modal
                  </span>
                </div>

                <Controller
                  control={control}
                  name="bankId"
                  render={({ field }) => (
                    <BankPicker
                      value={field.value}
                      onChange={handleBankChange}
                      error={errors.bankId?.message}
                    />
                  )}
                />

                <NbHint
                  number={1}
                  text="Bank name should come from Bank modal"
                  className="mt-1 xl:hidden"
                />
              </div>

              {/* Row 2: Bank Alias (Read-Only) */}
              <div className="space-y-1.5">
                <BankAliasDisplay alias={watchedBankAlias} />
              </div>

              {/* Row 3: Branch Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Branch Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Shatmoshjid Road, Principal Branch"
                  {...register('branchName')}
                  className={`w-full h-9 px-3 rounded-lg border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs transition-all ${
                    errors.branchName ? 'border-rose-400 focus:ring-rose-500' : 'border-border'
                  }`}
                />
                {errors.branchName && (
                  <p className="text-[11px] text-rose-500 font-medium">
                    {errors.branchName.message}
                  </p>
                )}
              </div>

              {/* Row 4: Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Address <span className="text-[11px] text-muted-foreground font-normal">(optional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Dhanmondi, Dhaka"
                  {...register('address')}
                  className="w-full p-2.5 rounded-lg border border-border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs resize-none"
                />
                {errors.address && (
                  <p className="text-[11px] text-rose-500 font-medium">{errors.address.message}</p>
                )}
              </div>

              {/* Row 5 & 6: Routing No. and SWIFT/BIC Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Routing No. <span className="text-[11px] text-muted-foreground font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 090272023"
                    {...register('routingNo')}
                    className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs font-mono font-medium text-foreground outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs"
                  />
                  {errors.routingNo && (
                    <p className="text-[11px] text-rose-500 font-medium">{errors.routingNo.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Controller
                    control={control}
                    name="swiftCode"
                    render={({ field }) => (
                      <SwiftBicInput
                        value={field.value || ''}
                        onChange={field.onChange}
                        error={errors.swiftCode?.message}
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Accounts Info Sub-Section */}
            <div className="space-y-2">
              <AccountsInfoSection
                accounts={watchedAccounts}
                onAddAccount={handleAddAccount}
                onRemoveAccount={handleRemoveAccount}
              />

              <NbHint
                number={2}
                text="Accounts Info. Should come from Chart of Accounts"
                className="mt-2 xl:hidden"
              />
            </div>

            {/* Footer */}
            <FormFooter
              isEdit={isEdit}
              isSaving={saving}
              onDelete={() => setDeleteDialogOpen(true)}
            />
          </form>

          {/* Edit mode meta strip */}
          {isEdit && currentBranch && (
            <div className="pt-3 border-t border-border/50 text-[11px] text-muted-foreground flex flex-wrap items-center justify-between gap-2">
              <span>
                Created: {new Date(currentBranch.createdAt).toLocaleDateString()} at{' '}
                {new Date(currentBranch.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span>
                Last updated: {new Date(currentBranch.updatedAt).toLocaleDateString()} at{' '}
                {new Date(currentBranch.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          )}
        </div>

        {/* Right Rail N.B. Hints for large screens */}
        <NbHintRail />
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteBranch}
        isDeleting={deleting}
        title="Delete Branch"
        message={`Are you sure you want to delete "${watchedBranchName || 'this branch'}"? Linked vouchers or cheques referring to this branch may be affected.`}
      />
    </div>
  );
};
