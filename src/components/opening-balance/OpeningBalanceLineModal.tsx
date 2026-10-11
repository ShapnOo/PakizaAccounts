import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Plus,
  Save,
  Scale,
  DollarSign,
  FileText,
  AlertCircle,
  Building2,
  Users,
  Truck,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { OpeningBalanceLine, CURRENCIES, DEFAULT_CURRENCY } from '../../types/openingBalance';
import { AccountHeadPicker } from './AccountHeadPicker';
import { CostCenterPicker } from './CostCenterPicker';
import { SubsidiaryPicker } from './SubsidiaryPicker';
import { EmployeePicker } from './EmployeePicker';
import { VehiclePicker } from './VehiclePicker';
import { ReferenceCenterPicker } from './ReferenceCenterPicker';
import { formatNumber } from '../../lib/format';
import { round2 } from '../../lib/math/openingBalance';
import { useCustomFields } from '../../hooks/useCustomFields';
import { CustomFieldCell } from '../shared/CustomFieldCell';
import { useOpeningMasterLookups } from '../../hooks/useOpeningMasterLookups';

interface OpeningBalanceLineModalProps {
  isOpen: boolean;
  onClose: () => void;
  line?: OpeningBalanceLine | null;
  onSave: (line: OpeningBalanceLine) => void;
}

export const OpeningBalanceLineModal: React.FC<OpeningBalanceLineModalProps> = ({
  isOpen,
  onClose,
  line,
  onSave,
}) => {
  const isEditMode = !!line;
  const formRef = useRef<HTMLFormElement>(null);

  const [accountHeadId, setAccountHeadId] = useState('');
  const [balanceType, setBalanceType] = useState<'debit' | 'credit'>('debit');
  const [debitAmount, setDebitAmount] = useState<string>('');
  const [creditAmount, setCreditAmount] = useState<string>('');
  const [currency, setCurrency] = useState<string>(DEFAULT_CURRENCY);
  const [exchangeRate, setExchangeRate] = useState<string>('1');
  const [costCenterId, setCostCenterId] = useState('');
  const [subsidiaryId, setSubsidiaryId] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [reference, setReference] = useState('');
  const [description, setDescription] = useState('');
  const [customFieldsValues, setCustomFieldsValues] = useState<Record<string, any>>({});

  const { fields: customFields } = useCustomFields('opening-balance');
  const { getAccount } = useOpeningMasterLookups();

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      if (line) {
        setAccountHeadId(line.accountHeadId || '');
        const isCredit = (line.creditBDT && line.creditBDT > 0) || (line.credit && line.credit > 0);
        setBalanceType(isCredit ? 'credit' : 'debit');

        if (isCredit) {
          const amt = line.credit !== undefined ? line.credit : (line.creditBDT || 0);
          setCreditAmount(amt > 0 ? amt.toString() : '');
          setDebitAmount('');
        } else {
          const amt = line.debit !== undefined ? line.debit : (line.debitBDT || 0);
          setDebitAmount(amt > 0 ? amt.toString() : '');
          setCreditAmount('');
        }

        setCurrency(line.currency || DEFAULT_CURRENCY);
        setExchangeRate((line.exchangeRate || 1).toString());
        setCostCenterId(line.costCenterId || '');
        setSubsidiaryId(line.subsidiaryId || '');
        setEmployeeId(line.employeeId || '');
        setVehicleId(line.vehicleId || '');
        setReference(line.reference || '');
        setDescription(line.description || '');
        setCustomFieldsValues(line.customFields || {});
      } else {
        // Reset form for new entry
        setAccountHeadId('');
        setBalanceType('debit');
        setDebitAmount('');
        setCreditAmount('');
        setCurrency(DEFAULT_CURRENCY);
        setExchangeRate('1');
        setCostCenterId('');
        setSubsidiaryId('');
        setEmployeeId('');
        setVehicleId('');
        setReference('');
        setDescription('');

        const initialCustom: Record<string, any> = {};
        customFields.forEach((cf) => {
          if (cf.defaultValue !== undefined && cf.defaultValue !== null) {
            initialCustom[cf.id] = cf.defaultValue;
          }
        });
        setCustomFieldsValues(initialCustom);
      }
      setErrors({});
    }
  }, [isOpen, line, customFields]);

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

  const selectedAccountInfo = getAccount(accountHeadId);
  const isAP = selectedAccountInfo
    ? (selectedAccountInfo.detailsType === 'Accounts Payable' || selectedAccountInfo.name.toLowerCase().includes('payable') || selectedAccountInfo.name.toLowerCase().includes('creditor'))
    : false;
  const isAR = selectedAccountInfo
    ? (selectedAccountInfo.detailsType === 'Accounts Receivable' || selectedAccountInfo.name.toLowerCase().includes('receivable') || selectedAccountInfo.name.toLowerCase().includes('debtor'))
    : false;

  if (!isOpen) return null;

  const numDebit = parseFloat(debitAmount) || 0;
  const numCredit = parseFloat(creditAmount) || 0;
  const numAmount = balanceType === 'credit' ? numCredit : numDebit;
  const numRate = parseFloat(exchangeRate) || 1;
  const convertedBDT = round2(numAmount * (currency === 'BDT' ? 1 : numRate));

  const handleDebitChange = (val: string) => {
    setDebitAmount(val);
    if (val) {
      setCreditAmount('');
      setBalanceType('debit');
    }
    if (errors.amount) {
      setErrors((prev) => ({ ...prev, amount: '' }));
    }
  };

  const handleCreditChange = (val: string) => {
    setCreditAmount(val);
    if (val) {
      setDebitAmount('');
      setBalanceType('credit');
    }
    if (errors.amount) {
      setErrors((prev) => ({ ...prev, amount: '' }));
    }
  };


  const handleCurrencyChange = (newCurr: string) => {
    setCurrency(newCurr);
    if (newCurr === 'BDT') {
      setExchangeRate('1');
    } else if (newCurr === 'USD' && exchangeRate === '1') {
      setExchangeRate('121.50');
    } else if (newCurr === 'EUR' && exchangeRate === '1') {
      setExchangeRate('132.80');
    } else if (newCurr === 'GBP' && exchangeRate === '1') {
      setExchangeRate('154.20');
    } else if (newCurr === 'INR' && exchangeRate === '1') {
      setExchangeRate('1.45');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!accountHeadId.trim()) {
      newErrors.accountHeadId = 'Account head is required';
    }

    if (isAP && !subsidiaryId) {
      newErrors.subsidiaryId = 'Vendor selection is required for Accounts Payable';
    }

    if (isAR && !subsidiaryId) {
      newErrors.subsidiaryId = 'Customer selection is required for Accounts Receivable';
    }

    const hasDebit = !isNaN(numDebit) && numDebit > 0;
    const hasCredit = !isNaN(numCredit) && numCredit > 0;

    if (!hasDebit && !hasCredit) {
      newErrors.amount = 'Please enter an amount in either Debit or Credit';
    }

    if (currency !== 'BDT' && (isNaN(numRate) || numRate <= 0)) {
      newErrors.exchangeRate = 'Exchange rate must be greater than 0';
    }

    // Check mandatory custom fields
    const mandatoryCustom = customFields.filter((cf) => cf.mandatory && cf.activeStatus === 'Active');
    for (const mcf of mandatoryCustom) {
      const val = customFieldsValues[mcf.id];
      if (val === undefined || val === null || String(val).trim() === '') {
        newErrors[`custom_${mcf.id}`] = `${mcf.label} is required`;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const isCredit = numCredit > 0;
    const effectiveAmount = isCredit ? numCredit : numDebit;
    const effectiveBDT = round2(effectiveAmount * (currency === 'BDT' ? 1 : numRate));
    const isForeign = currency !== 'BDT';

    const savedLine: OpeningBalanceLine = {
      id: line?.id || crypto.randomUUID(),
      accountHeadId,
      costCenterId: costCenterId || undefined,
      subsidiaryId: subsidiaryId || undefined,
      employeeId: employeeId || undefined,
      vehicleId: vehicleId || undefined,
      reference: reference.trim() || undefined,
      description: description.trim() || undefined,
      customFields: customFieldsValues,
      currency,
      exchangeRate: isForeign ? numRate : 1,
      debit: isCredit ? undefined : (isForeign ? effectiveAmount : undefined),
      credit: isCredit ? (isForeign ? effectiveAmount : undefined) : undefined,
      debitBDT: isCredit ? 0 : effectiveBDT,
      creditBDT: isCredit ? effectiveBDT : 0,
    };

    onSave(savedLine);
    if (isEditMode) {
      onClose();
    } else {
      // Refresh modal form fields instead of closing
      setAccountHeadId('');
      setDebitAmount('');
      setCreditAmount('');
      setBalanceType('debit');
      setCurrency(DEFAULT_CURRENCY);
      setExchangeRate('1');
      setCostCenterId('');
      setSubsidiaryId('');
      setEmployeeId('');
      setVehicleId('');
      setReference('');
      setDescription('');

      const initialCustom: Record<string, any> = {};
      customFields.forEach((cf) => {
        if (cf.defaultValue !== undefined && cf.defaultValue !== null) {
          initialCustom[cf.id] = cf.defaultValue;
        }
      });
      setCustomFieldsValues(initialCustom);
      setErrors({});

      formRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in-0 duration-150">
      <div
        className="w-full max-w-4xl bg-white dark:bg-card rounded-2xl shadow-2xl border border-slate-200 dark:border-border overflow-hidden transform animate-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50/80 dark:bg-muted/40 border-b border-slate-200 dark:border-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-2xs">
              <Scale className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-foreground flex items-center gap-2">
                {isEditMode ? 'Edit Opening Balance Entry' : 'Add Opening Balance Entry'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-muted-foreground">
                Set starting trial balance amount and auxiliary dimension assignments
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 dark:hover:bg-muted transition-colors cursor-pointer"
            title="Close dialog"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Modal Body Form (Scrollable) */}
        <form ref={formRef} onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* 1. Account Head Picker */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-foreground">
              Accounts Head <span className="text-rose-500">*</span>
            </label>
            <AccountHeadPicker
              value={accountHeadId}
              onChange={(id) => {
                setAccountHeadId(id);
                if (errors.accountHeadId) {
                  setErrors((prev) => ({ ...prev, accountHeadId: '' }));
                }
              }}
              error={!!errors.accountHeadId}
            />
            {errors.accountHeadId && (
              <p className="flex items-center gap-1 text-xs text-rose-600 font-medium mt-1">
                <AlertCircle className="size-3.5" />
                <span>{errors.accountHeadId}</span>
              </p>
            )}
          </div>

          {/* 2. Balance Type & Amounts Section */}
          <div className="p-4 bg-slate-50/70 dark:bg-muted/30 rounded-xl border border-slate-200 dark:border-border space-y-4">
            {/* Amount & Currency Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Debit Amount Input */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-emerald-600 inline-block" />
                    Debit ({currency})
                  </span>
                  {balanceType === 'debit' && numDebit > 0 && (
                    <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-emerald-100/80 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300">
                      Active
                    </span>
                  )}
                </label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={debitAmount}
                  onChange={(e) => handleDebitChange(e.target.value)}
                  placeholder="0.00"
                  className={[
                    'w-full h-9 px-3 rounded-lg border text-sm font-semibold outline-none bg-white dark:bg-card transition-all',
                    errors.amount && !debitAmount && !creditAmount
                      ? 'border-rose-400 bg-rose-50/30 text-rose-900 focus:ring-2 focus:ring-rose-500/20'
                      : debitAmount
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-900 dark:text-emerald-200 font-bold bg-emerald-50/20'
                      : 'border-slate-300 dark:border-border text-slate-900 dark:text-foreground focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20',
                  ].join(' ')}
                />
              </div>

              {/* Credit Amount Input */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-rose-700 dark:text-rose-400 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-rose-600 inline-block" />
                    Credit ({currency})
                  </span>
                  {balanceType === 'credit' && numCredit > 0 && (
                    <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-rose-100/80 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300">
                      Active
                    </span>
                  )}
                </label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={creditAmount}
                  onChange={(e) => handleCreditChange(e.target.value)}
                  placeholder="0.00"
                  className={[
                    'w-full h-9 px-3 rounded-lg border text-sm font-semibold outline-none bg-white dark:bg-card transition-all',
                    errors.amount && !debitAmount && !creditAmount
                      ? 'border-rose-400 bg-rose-50/30 text-rose-900 focus:ring-2 focus:ring-rose-500/20'
                      : creditAmount
                      ? 'border-rose-500 ring-2 ring-rose-500/20 text-rose-900 dark:text-rose-200 font-bold bg-rose-50/20'
                      : 'border-slate-300 dark:border-border text-slate-900 dark:text-foreground focus:border-rose-600 focus:ring-2 focus:ring-rose-500/20',
                  ].join(' ')}
                />
              </div>

              {/* Currency Selector */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-600 dark:text-muted-foreground">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => handleCurrencyChange(e.target.value)}
                  className="w-full h-9 px-2.5 rounded-lg border border-slate-300 dark:border-border bg-white dark:bg-card text-xs font-bold text-slate-700 dark:text-foreground outline-none focus:border-indigo-600 cursor-pointer"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Exchange Rate */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-600 dark:text-muted-foreground">
                  Exchange Rate (BDT)
                </label>
                <input
                  type="number"
                  step="any"
                  min="0.0001"
                  disabled={currency === 'BDT'}
                  value={exchangeRate}
                  onChange={(e) => {
                    setExchangeRate(e.target.value);
                    if (errors.exchangeRate) {
                      setErrors((prev) => ({ ...prev, exchangeRate: '' }));
                    }
                  }}
                  placeholder="1.00"
                  className={[
                    'w-full h-9 px-3 rounded-lg border text-xs font-semibold outline-none transition-all',
                    currency === 'BDT'
                      ? 'bg-slate-100 dark:bg-muted text-slate-400 border-slate-200 dark:border-border cursor-not-allowed'
                      : 'bg-white dark:bg-card border-slate-300 dark:border-border text-slate-900 dark:text-foreground focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20',
                    errors.exchangeRate ? 'border-rose-400' : '',
                  ].join(' ')}
                />
              </div>

              {errors.amount && (
                <p className="sm:col-span-2 lg:col-span-4 text-[11px] text-rose-600 font-medium flex items-center gap-1 mt-0.5">
                  <AlertCircle className="size-3.5" />
                  <span>{errors.amount}</span>
                </p>
              )}
            </div>

            {/* Real-time BDT Equivalent Banner */}
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 text-xs">
              <span className="font-semibold text-indigo-900 dark:text-indigo-300">
                Converted Equivalent in BDT:
              </span>
              <div className="flex items-center gap-1.5 font-bold font-mono">
                {currency !== 'BDT' && (
                  <span className="text-slate-500 text-[11px]">
                    {formatNumber(numAmount)} {currency} × {numRate} =
                  </span>
                )}
                <span
                  className={
                    balanceType === 'debit'
                      ? 'text-emerald-700 dark:text-emerald-400 text-sm font-black'
                      : 'text-rose-700 dark:text-rose-400 text-sm font-black'
                  }
                >
                  ৳ {formatNumber(convertedBDT)}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  ({balanceType})
                </span>
              </div>
            </div>
          </div>

          {/* 3. Auxiliary Dimension Tracking Pickers (2x2 Grid) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-border">
              <Layers className="size-3.5 text-indigo-600" />
              <span className="text-xs font-bold text-slate-800 dark:text-foreground">
                Auxiliary Dimensions (Optional)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Cost Center */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-600 dark:text-muted-foreground flex items-center gap-1">
                  <Building2 className="size-3 text-slate-400" />
                  <span>Cost Center</span>
                </label>
                <CostCenterPicker value={costCenterId} onChange={setCostCenterId} />
              </div>

              {/* Subsidiary */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-600 dark:text-muted-foreground flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Users className="size-3 text-slate-400" />
                    <span>Subsidiary (Vendor / Customer)</span>
                  </span>
                  {(isAP || isAR) && <span className="text-[10px] text-rose-500 font-bold">* Required for {isAP ? 'A/P' : 'A/R'}</span>}
                </label>
                <SubsidiaryPicker value={subsidiaryId} onChange={(id) => {
                  setSubsidiaryId(id);
                  if (errors.subsidiaryId) setErrors((prev) => ({ ...prev, subsidiaryId: '' }));
                }} />
                {errors.subsidiaryId && (
                  <p className="text-[10.5px] text-rose-600 font-semibold mt-0.5">{errors.subsidiaryId}</p>
                )}
              </div>

              {/* Employee */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-600 dark:text-muted-foreground flex items-center gap-1">
                  <Users className="size-3 text-slate-400" />
                  <span>Employee</span>
                </label>
                <EmployeePicker value={employeeId} onChange={setEmployeeId} />
              </div>

              {/* Vehicle */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-600 dark:text-muted-foreground flex items-center gap-1">
                  <Truck className="size-3 text-slate-400" />
                  <span>Vehicle</span>
                </label>
                <VehiclePicker value={vehicleId} onChange={setVehicleId} />
              </div>

              {/* Reference Center */}
              <div className="space-y-1 sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 dark:text-muted-foreground flex items-center gap-1">
                  <FileText className="size-3 text-slate-400" />
                  <span>Reference Center</span>
                </label>
                <ReferenceCenterPicker value={reference} onChange={setReference} />
              </div>
            </div>
          </div>

          {/* Dynamic Custom Fields Section */}
          {customFields.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-border">
                <FileText className="size-3.5 text-indigo-600" />
                <span className="text-xs font-bold text-slate-800 dark:text-foreground">
                  Custom Fields ({customFields.length})
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {customFields.map((cf) => (
                  <div key={cf.id} className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-muted-foreground flex items-center justify-between">
                      <span>
                        {cf.label} {cf.mandatory && <span className="text-rose-500">*</span>}
                      </span>
                    </label>
                    <CustomFieldCell
                      field={cf}
                      value={customFieldsValues[cf.id] ?? cf.defaultValue}
                      onChange={(val) =>
                        setCustomFieldsValues((prev) => ({
                          ...prev,
                          [cf.id]: val,
                        }))
                      }
                    />
                    {errors[`custom_${cf.id}`] && (
                      <p className="text-[10.5px] text-rose-500 font-semibold">
                        {errors[`custom_${cf.id}`]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Description / Remarks */}
          <div className="space-y-1 pt-1">
            <label className="block text-[11px] font-bold text-slate-600 dark:text-muted-foreground">
              Line Description / Remarks
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Advance payment for packaging materials"
              className="w-full h-8.5 px-3 rounded-lg border border-slate-300 dark:border-border bg-white dark:bg-card text-xs text-slate-900 dark:text-foreground focus:border-indigo-600 focus:ring-1 focus:ring-indigo-500/20 outline-none"
            />
          </div>
        </form>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50/80 dark:bg-muted/40 border-t border-slate-200 dark:border-border flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-border bg-white dark:bg-card text-xs font-semibold text-slate-700 dark:text-muted-foreground hover:bg-slate-100 dark:hover:bg-muted transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 shadow-sm shadow-indigo-600/20 transition-all cursor-pointer"
          >
            {isEditMode ? (
              <>
                <Save className="size-3.5" />
                <span>Update Entry</span>
              </>
            ) : (
              <>
                <Plus className="size-3.5" />
                <span>Add Entry</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
