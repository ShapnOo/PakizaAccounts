import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useVouchers } from '../../context/VoucherContext';
import { VoucherType, DefaultAccountRow } from '../../types/voucher';
import { VOUCHER_TYPES } from '../../constants/voucherTypeConfig';
import { DefaultAccountsTable } from '../../components/vouchers/DefaultAccountsTable';
import { VoucherTypeChip } from '../../components/vouchers/VoucherTypeChip';
import {
  FileText,
  ArrowLeft,
  Save,
  CheckCircle2,
  Building2,
  Info,
  SlidersHorizontal,
  Hash,
  Landmark,
} from 'lucide-react';
import { toast } from 'sonner';

export const VoucherSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getVoucherById, createVoucherDefinition, updateVoucherDefinition } = useVouchers();

  const isEdit = Boolean(id);
  const existingVoucher = id ? getVoucherById(id) : undefined;

  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [voucherType, setVoucherType] = useState<VoucherType>('Payment Voucher');
  const [prefix, setPrefix] = useState('');
  const [resetFrequency, setResetFrequency] = useState<'Month' | 'Fiscal Year' | 'Calendar Year'>('Month');
  const [accountCategory, setAccountCategory] = useState<'Bank & Cash Both' | 'Cash Only' | 'Bank Only'>('Bank & Cash Both');
  const [activeStatus, setActiveStatus] = useState<'Active' | 'Inactive'>('Active');
  const [defaultAccounts, setDefaultAccounts] = useState<DefaultAccountRow[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Seed or initialize form values
  useEffect(() => {
    if (existingVoucher) {
      setName(existingVoucher.name);
      setShortName(existingVoucher.shortName);
      setVoucherType(existingVoucher.voucherType);
      setPrefix(existingVoucher.prefix || `${existingVoucher.shortName}-`);
      setResetFrequency(existingVoucher.resetFrequency || 'Month');
      setAccountCategory(existingVoucher.accountCategory || 'Bank & Cash Both');
      setActiveStatus(existingVoucher.activeStatus);
      setDefaultAccounts(
        existingVoucher.defaultAccounts && existingVoucher.defaultAccounts.length > 0
          ? existingVoucher.defaultAccounts
          : []
      );
    } else {
      // Default initial state for new voucher
      setName('');
      setShortName('');
      setVoucherType('Payment Voucher');
      setPrefix('');
      setResetFrequency('Month');
      setAccountCategory('Bank & Cash Both');
      setActiveStatus('Active');
      // Sheet 2 seed rows: Petty Cash In Hand (PSL) & Cash In Hand H/O (PKCL)
      setDefaultAccounts([
        {
          id: 'da-seed-1',
          accountId: '1-01-01-01-01-01',
          accountName: 'Petty Cash In Hand',
          nature: 'CR',
          companyId: 'PSL',
          active: true,
        },
        {
          id: 'da-seed-2',
          accountId: '1-01-01-01-01-02',
          accountName: 'Cash In Hand H/O',
          nature: 'CR',
          companyId: 'PKCL',
          active: true,
        },
      ]);
    }
  }, [existingVoucher]);

  // Synchronize row natures when voucherType changes
  const handleTypeChange = (newType: VoucherType) => {
    setVoucherType(newType);
    const derivedNature: 'DR' | 'CR' | '' =
      newType === 'Receive Voucher' ? 'DR' : newType === 'Payment Voucher' ? 'CR' : '';

    setDefaultAccounts((prev) =>
      prev.map((row) => ({
        ...row,
        nature: derivedNature,
      }))
    );
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) {
      errs.name = 'Voucher Name is required';
    } else if (name.trim().length < 3) {
      errs.name = 'Name must be at least 3 characters';
    }

    if (!shortName.trim()) {
      errs.shortName = 'Short Name is required';
    } else if (shortName.trim().length > 6) {
      errs.shortName = 'Short Name cannot exceed 6 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    const payload = {
      name: name.trim(),
      shortName: shortName.trim().toUpperCase(),
      voucherType,
      prefix: prefix.trim(),
      resetFrequency,
      accountCategory,
      activeStatus,
      defaultAccounts,
    };

    if (isEdit && id) {
      updateVoucherDefinition(id, payload);
    } else {
      createVoucherDefinition(payload);
    }

    navigate('/vouchers');
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-5 space-y-4 pb-20">
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link
                to="/vouchers"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
              >
                <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
                <span>Back to Voucher List</span>
              </Link>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <div className="size-9 rounded-lg bg-indigo-50 border border-indigo-200/60 flex items-center justify-center text-indigo-600 shadow-sm">
                <FileText className="size-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                  <span>{isEdit ? 'Configure Voucher Setup' : 'Create New Voucher'}</span>
                </h1>
                <p className="text-xs text-muted-foreground">
                  Define voucher identity, operational type, and counter-side default accounts.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <VoucherTypeChip type={voucherType} />
          </div>
        </div>

        {/* Main Form Card */}
        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-card border border-border/80 rounded-xl shadow-sm overflow-hidden p-6 space-y-6">
            {/* Identity Block */}
            <div>
              <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-5">
                <div>
                  <h2 className="text-sm font-black uppercase tracking-wider text-foreground">
                    1. Voucher Identity
                  </h2>
                  <p className="text-[11px] text-muted-foreground">
                    Primary metadata used across transactions, ledgers, and voucher numbers.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Voucher Name */}
                <div className="space-y-1.5 sm:col-span-2 lg:col-span-3">
                  <label className="text-[12px] font-semibold text-foreground flex items-center justify-between">
                    <span>
                      Voucher Name <span className="text-rose-500">*</span>
                    </span>
                    <span className="text-[10px] text-muted-foreground font-normal">
                      Display Name (e.g. Cash Payment Voucher)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                    }}
                    placeholder="e.g. Cash Payment Voucher"
                    className={`w-full h-9 px-3 rounded-lg border bg-background text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                      errors.name ? 'border-rose-400 bg-rose-50/20' : 'border-border'
                    }`}
                  />
                  {errors.name && <p className="text-[11px] text-rose-500 font-medium">{errors.name}</p>}
                </div>

                {/* Short Name */}
                <div className="space-y-1.5">
                  <label className="text-[12px] font-semibold text-foreground flex items-center justify-between">
                    <span>
                      Short Name <span className="text-rose-500">*</span>
                    </span>
                    <span className="text-[10px] text-muted-foreground font-normal">Max 6 chars</span>
                  </label>
                  <input
                    type="text"
                    value={shortName}
                    maxLength={6}
                    onChange={(e) => {
                      const val = e.target.value.toUpperCase();
                      setShortName(val);
                      if (!prefix || prefix === `${shortName}-`) {
                        setPrefix(val ? `${val}-` : '');
                      }
                      if (errors.shortName) setErrors((prev) => ({ ...prev, shortName: '' }));
                    }}
                    placeholder="e.g. CPV"
                    className={`w-full h-9 px-3 rounded-lg border bg-background text-xs font-mono font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                      errors.shortName ? 'border-rose-400 bg-rose-50/20' : 'border-border'
                    }`}
                  />
                  {errors.shortName && (
                    <p className="text-[11px] text-rose-500 font-medium">{errors.shortName}</p>
                  )}
                </div>

                {/* Voucher Type */}
                <div className="space-y-1.5 sm:col-span-1 lg:col-span-2">
                  <label className="text-[12px] font-semibold text-foreground flex items-center justify-between">
                    <span>
                      Voucher Type <span className="text-rose-500">*</span>
                    </span>
                    <span className="text-[10px] text-indigo-600 font-medium">Drives rules</span>
                  </label>
                  <select
                    value={voucherType}
                    onChange={(e) => handleTypeChange(e.target.value as VoucherType)}
                    className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer"
                  >
                    {VOUCHER_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* ID Generation (Placed from left) */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[12px] font-semibold text-foreground flex items-center gap-1.5">
                    <Hash className="size-3.5 text-indigo-500" />
                    <span>ID Generation</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl border border-border/80 bg-muted/20">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-muted-foreground">Prefix</label>
                      <input
                        type="text"
                        value={prefix}
                        onChange={(e) => setPrefix(e.target.value)}
                        placeholder="e.g. CPV-"
                        className="w-full h-8.5 px-3 rounded-lg border border-border bg-background text-xs font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-2xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-muted-foreground">Reset Frequency</label>
                      <select
                        value={resetFrequency}
                        onChange={(e) => setResetFrequency(e.target.value as any)}
                        className="w-full h-8.5 px-3 rounded-lg border border-border bg-background text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-2xs cursor-pointer"
                      >
                        <option value="Month">Month</option>
                        <option value="Fiscal Year">Fiscal Year</option>
                        <option value="Calendar Year">Calendar Year</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Account Category */}
                <div className="space-y-1.5">
                  <label className="text-[12px] font-semibold text-foreground flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Landmark className="size-3.5 text-indigo-500" />
                      <span>Account Category</span>
                    </span>
                  </label>
                  <div className="p-3 rounded-xl border border-border/80 bg-muted/20">
                    <label className="text-[11px] font-bold text-muted-foreground block mb-1">
                      Allowed Category
                    </label>
                    <select
                      value={accountCategory}
                      onChange={(e) => setAccountCategory(e.target.value as any)}
                      className="w-full h-8.5 px-3 rounded-lg border border-border bg-background text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-2xs cursor-pointer"
                    >
                      <option value="Bank & Cash Both">Bank & Cash Both</option>
                      <option value="Cash Only">Cash Only</option>
                      <option value="Bank Only">Bank Only</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Default Accounts Block (Rule V2, V3, V4) */}
            <div className="pt-2">
              <DefaultAccountsTable
                voucherType={voucherType}
                rows={defaultAccounts}
                onChange={setDefaultAccounts}
                accountCategory={accountCategory}
              />
            </div>

            {/* Placement will be bottom part: Active Status */}
            <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <label className="text-[12px] font-semibold text-foreground block">
                  Active Status
                </label>
                <p className="text-[11px] text-muted-foreground">
                  Enable or disable this voucher definition across transactions and entry menus
                </p>
              </div>
              <div className="inline-flex p-1 bg-slate-100 dark:bg-muted/50 rounded-lg border border-slate-200/80 dark:border-border self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setActiveStatus('Active')}
                  className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    activeStatus === 'Active'
                      ? 'bg-white dark:bg-card text-emerald-700 dark:text-emerald-400 shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Active
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStatus('Inactive')}
                  className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    activeStatus === 'Inactive'
                      ? 'bg-white dark:bg-card text-slate-700 dark:text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Inactive
                </button>
              </div>
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="flex items-center justify-between gap-3 bg-white p-4 rounded-xl border border-border/80 shadow-sm">
            <button
              type="button"
              onClick={() => navigate('/vouchers')}
              className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground rounded-lg border border-border hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm shadow-indigo-600/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <Save className="size-3.5" />
              <span>{isEdit ? 'Save Changes' : 'Save Voucher Definition'}</span>
            </button>
          </div>
        </form>
      </div>
  );
};
