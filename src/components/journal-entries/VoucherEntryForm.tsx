import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Plus,
  Trash2,
  BookmarkPlus,
  Save,
  Loader2,
  Info,
  Check,
  AlertCircle,
  ArrowLeft,
  ChevronDown,
  Building,
  CreditCard,
  UserCheck,
  Truck,
  Layers,
} from 'lucide-react';
import {
  VoucherType,
  VoucherEntry,
  VoucherLine,
  VOUCHER_TYPE_CONFIG,
  VOUCHER_NAMES,
  ApprovalStatus,
  FormPreset,
  Attachment,
} from '../../types/journalEntry';
import { useJournalEntryStore } from '../../stores/journalEntryStore';
import { useCurrencyStore } from '../../stores/currencyStore';
import { useSubledgerStore } from '../../stores/subledgerStore';
import { listPresets, savePreset } from '../../services/presetService';
import { MOCK_ACCOUNTS } from '../../mock/accounts';
import { MOCK_SUBLEDGER } from '../../mock/subledger';
import { MOCK_EMPLOYEES } from '../../mock/employees';
import { MOCK_SUPPLIERS } from '../../mock/suppliers';
import { MOCK_CUSTOMERS } from '../../mock/customers';
import { MOCK_COA_BANK_ACCOUNTS } from '../../mock/coaBankAccounts';
import { MOCK_CURRENCY_SETUPS } from '../../mock/currencySetup';
import { SaveAsPresetDialog } from './SaveAsPresetDialog';
import { LineColumnToggle, useLineColumnVisibility } from './LineColumnToggle';
import { AttachmentUploadSection } from './AttachmentUploadSection';

export interface VoucherEntryFormProps {
  voucherType: VoucherType;
  initialVoucherName?: string;
  initialData?: VoucherEntry | null;
  isModal?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
}

export const VoucherEntryForm: React.FC<VoucherEntryFormProps> = ({
  voucherType,
  initialVoucherName,
  initialData,
  isModal = false,
  onClose,
  onSuccess,
}) => {
  const navigate = useNavigate();
  const { addEntry, editEntry } = useJournalEntryStore();

  const { rates, setups } = useCurrencyStore();
  const baseRate = rates.find((r) => r.isBase);
  const baseSetup = setups.find((s) => s.id === baseRate?.currencyId);
  const baseSymbol = baseSetup?.symbol || '৳';
  const baseCode = baseSetup?.code || 'BDT';

  const isEdit = Boolean(initialData);

  // Voucher Name & Type states (#32)
  const [selectedVoucherName, setSelectedVoucherName] = useState<string>(
    initialData?.voucherName || initialVoucherName || VOUCHER_TYPE_CONFIG[voucherType].label
  );
  const [activeType, setActiveType] = useState<VoucherType>(
    initialData?.voucherType || voucherType
  );
  const [approvalStatus, setApprovalStatus] = useState<ApprovalStatus>(
    initialData?.approvalStatus || 'Approved'
  );

  const cfg = VOUCHER_TYPE_CONFIG[activeType];

  const handleVoucherNameChange = (name: string) => {
    setSelectedVoucherName(name);
    const matched = VOUCHER_NAMES.find((v) => v.name === name);
    if (matched) {
      setActiveType(matched.type);
      if (VOUCHER_TYPE_CONFIG[matched.type].hasHeaderAccount && !headerAccountId) {
        setHeaderAccountId(MOCK_COA_BANK_ACCOUNTS[0]?.id || '');
      }
    }
  };

  useEffect(() => {
    if (initialVoucherName) {
      setSelectedVoucherName(initialVoucherName);
      const matched = VOUCHER_NAMES.find((v) => v.name === initialVoucherName);
      if (matched) {
        setActiveType(matched.type);
      }
    } else if (voucherType) {
      setActiveType(voucherType);
      setSelectedVoucherName(VOUCHER_TYPE_CONFIG[voucherType].label);
    }
  }, [initialVoucherName, voucherType]);

  // Form states
  const [voucherDate, setVoucherDate] = useState(
    initialData?.voucherDate || new Date().toISOString().split('T')[0]
  );
  const [headerAccountId, setHeaderAccountId] = useState(
    initialData?.headerAccountId ||
      (cfg.hasHeaderAccount ? MOCK_COA_BANK_ACCOUNTS[0]?.id || '' : '')
  );
  const [headerCostCenterId, setHeaderCostCenterId] = useState(
    initialData?.headerCostCenterId || ''
  );
  const [narration, setNarration] = useState(initialData?.narration || '');
  const [lines, setLines] = useState<VoucherLine[]>(
    initialData?.lines || [
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
    ]
  );

  const [attachments, setAttachments] = useState<Attachment[]>(
    initialData?.attachments || []
  );

  // Column visibility for line items
  const { columns: visibleColumns, updateColumns: setVisibleColumns } = useLineColumnVisibility();

  // Presets
  const [presets, setPresets] = useState<FormPreset[]>([]);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('');
  const [savePresetOpen, setSavePresetOpen] = useState(false);

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Subledger lists from store & mock
  const { entries: subledgerEntries, load: loadSubledger } = useSubledgerStore();
  useEffect(() => {
    loadSubledger();
  }, [loadSubledger]);

  const allSubledger = subledgerEntries.length > 0 ? subledgerEntries : MOCK_SUBLEDGER;
  const costCenters = allSubledger.filter((s) => s.type === 'cost-center' && s.activeStatus !== 'Inactive');
  const vehicles = allSubledger.filter((s) => s.type === 'vehicle' && s.activeStatus !== 'Inactive');
  const referenceCenters = allSubledger.filter((s) => s.type === 'reference-center' && s.activeStatus !== 'Inactive');

  // Load presets for this type
  useEffect(() => {
    listPresets(voucherType).then(setPresets);
  }, [voucherType]);

  // Handle Preset selection
  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    if (!presetId) return;
    const matched = presets.find((p) => p.id === presetId);
    if (matched && matched.lines) {
      const newLines: VoucherLine[] = matched.lines.map((l, idx) => ({
        id: `line-preset-${Date.now()}-${idx}`,
        accountHeadId: l.accountHeadId || '',
        accountHeadName: l.accountHeadName || '',
        costCenterId: l.costCenterId || '',
        subsidiaryId: l.subsidiaryId || '',
        employeeId: l.employeeId || '',
        vehicleId: l.vehicleId || '',
        reference: l.reference || '',
        description: l.description || '',
        currency: l.currency || 'BDT',
        exchangeRate: l.exchangeRate || 1,
        debit: l.debit || 0,
        credit: l.credit || 0,
        debitBDT: (l.debit || 0) * (l.exchangeRate || 1),
        creditBDT: (l.credit || 0) * (l.exchangeRate || 1),
      }));
      setLines(newLines);
      toast.info(`Loaded preset: "${matched.name}"`);
    }
  };

  // Add Line
  const handleAddLine = () => {
    const nextLine: VoucherLine = {
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

  // Remove Line
  const handleRemoveLine = (id: string) => {
    const minLines = voucherType === 'Journal' || voucherType === 'Contra' ? 2 : 1;
    if (lines.length <= minLines) {
      toast.error(`Minimum ${minLines} line(s) required for ${voucherType} voucher.`);
      return;
    }
    setLines(lines.filter((l) => l.id !== id));
  };

  // Update Line
  const handleUpdateLine = (id: string, patch: Partial<VoucherLine>) => {
    setLines((prev) =>
      prev.map((line) => {
        if (line.id !== id) return line;

        const updated = { ...line, ...patch };

        // Auto lookup Account Name if ID changed
        if (patch.accountHeadId !== undefined) {
          const acc = MOCK_ACCOUNTS.find((a) => a.id === patch.accountHeadId);
          updated.accountHeadName = acc?.name || '';
        }

        // Recalculate BDT amounts
        const rate = updated.exchangeRate || 1;
        if (updated.debit !== undefined) {
          updated.debitBDT = (updated.debit || 0) * rate;
        }
        if (updated.credit !== undefined) {
          updated.creditBDT = (updated.credit || 0) * rate;
        }

        return updated;
      })
    );
  };

  // Totals calculations
  const totalDebitBDT = lines.reduce((s, l) => s + (l.debitBDT || 0), 0);
  const totalCreditBDT = lines.reduce((s, l) => s + (l.creditBDT || 0), 0);
  const difference = totalDebitBDT - totalCreditBDT;
  const isBalanced = Math.abs(difference) <= 0.01 && (totalDebitBDT > 0 || totalCreditBDT > 0);

  // Eligible accounts for line items
  const lineAccounts =
    voucherType === 'Contra'
      ? MOCK_ACCOUNTS.filter(
          (a) =>
            a.name.toLowerCase().includes('bank') ||
            a.name.toLowerCase().includes('cash')
        )
      : MOCK_ACCOUNTS;

  // Handle Save
  const handleSaveVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!voucherDate) newErrors.voucherDate = 'Voucher date is required';

    if (cfg.hasHeaderAccount && !headerAccountId) {
      newErrors.headerAccountId = 'Header Account is required';
    }

    if (lines.length === 0) {
      newErrors.lines = 'At least one line item is required';
    }

    // Check line heads
    lines.forEach((l, idx) => {
      if (!l.accountHeadId) {
        newErrors[`line_${idx}_account`] = `Row #${idx + 1}: Account Head is required`;
      }
    });

    if (voucherType === 'Journal' || voucherType === 'Contra') {
      if (lines.length < 2) {
        newErrors.lines = 'At least 2 line items are required';
      }
      if (Math.abs(difference) > 0.01) {
        newErrors.balance = `Voucher is unbalanced. Difference: ৳ ${difference.toFixed(2)}`;
      }
      if (totalDebitBDT <= 0) {
        newErrors.lines = 'Total voucher amount must be greater than zero';
      }
    } else if (voucherType === 'Payment') {
      if (totalDebitBDT <= 0) {
        newErrors.lines = 'At least one Debit amount is required';
      }
    } else if (voucherType === 'Receive') {
      if (totalCreditBDT <= 0) {
        newErrors.lines = 'At least one Credit amount is required';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please resolve form errors before saving.');
      return;
    }

    setSaving(true);
    try {
      const headerAcc = MOCK_COA_BANK_ACCOUNTS.find((b) => b.id === headerAccountId);
      const computedAmount =
        activeType === 'Receive' ? totalCreditBDT : totalDebitBDT;

      const payload = {
        voucherNo:
          initialData?.voucherNo ||
          `${cfg.shortCode}-${new Date(voucherDate).getFullYear()}-${String(
            Math.floor(Math.random() * 9000) + 1000
          )}`,
        voucherName: selectedVoucherName,
        voucherType: activeType,
        approvalStatus,
        source: initialData?.source || 'Manual',
        voucherDate,
        narration,
        amount: computedAmount,
        headerAccountId: cfg.hasHeaderAccount ? headerAccountId : undefined,
        headerAccountName: cfg.hasHeaderAccount ? headerAcc?.accountName || headerAccountId : undefined,
        headerCostCenterId: cfg.hasHeaderAccount ? headerCostCenterId : undefined,
        lines,
        attachments: attachments,
        voided: initialData?.voided || false,
      };

      if (isEdit && initialData) {
        await editEntry(initialData.id, payload);
        toast.success(`Voucher ${payload.voucherNo} updated successfully.`);
      } else {
        await addEntry(payload);
        toast.success(`New ${selectedVoucherName} (${payload.voucherNo}) saved successfully.`);
      }

      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/journal-entries');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to save voucher');
    } finally {
      setSaving(false);
    }
  };

  // Save as Preset Handler
  const handleSaveCurrentAsPreset = async (presetName: string) => {
    const linesToSave = lines.map((l) => ({
      accountHeadId: l.accountHeadId,
      accountHeadName: l.accountHeadName,
      costCenterId: l.costCenterId,
      subsidiaryId: l.subsidiaryId,
      employeeId: l.employeeId,
      vehicleId: l.vehicleId,
      reference: l.reference,
      description: l.description,
      currency: l.currency,
      exchangeRate: l.exchangeRate,
      debit: 0,
      credit: 0,
    }));

    await savePreset({
      voucherType: activeType,
      name: presetName,
      lineCount: linesToSave.length,
      lines: linesToSave,
    });

    const refreshed = await listPresets(activeType);
    setPresets(refreshed);
    toast.success(`Preset "${presetName}" saved!`);
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Header Card */}
      <div className="p-5 sm:p-6 rounded-2xl border border-border/80 bg-card shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (onClose) onClose();
                else navigate('/journal-entries');
              }}
              className="p-2 rounded-xl border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <ArrowLeft className="size-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-foreground">
                  {isEdit ? `Edit ${initialData?.voucherNo}` : `New ${selectedVoucherName}`}
                </h1>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${cfg.color.badge}`}
                >
                  {cfg.shortCode}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {activeType === 'Journal'
                  ? 'Double-entry balanced transaction ledger posting'
                  : activeType === 'Receive'
                  ? 'Single-sided cash or bank collection credit entry'
                  : activeType === 'Payment'
                  ? 'Single-sided cash or bank disbursement debit entry'
                  : 'Fund movement between cash desks and bank accounts'}
              </p>
            </div>
          </div>

          {/* Form Preset Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-muted-foreground whitespace-nowrap hidden md:inline">
              Form Preset:
            </span>
            <div className="relative">
              <select
                value={selectedPresetId}
                onChange={(e) => handleSelectPreset(e.target.value)}
                className="h-9 pl-3 pr-8 rounded-xl border border-border bg-background text-xs font-bold text-foreground outline-none focus:ring-1 focus:ring-primary shadow-2xs cursor-pointer appearance-none"
              >
                <option value="">Choose Form Preset...</option>
                {presets.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.lineCount} lines)
                  </option>
                ))}
              </select>
              <ChevronDown className="size-3.5 text-muted-foreground absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSaveVoucher} className="space-y-6">
        {/* Header Block (Voucher Name, Date, Approval Status, Header Account) */}
        <div className="p-5 sm:p-6 rounded-2xl border border-border/80 bg-card shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Voucher Name Selector (#32) */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-foreground flex items-center justify-between">
                <span>
                  Voucher Name <span className="text-rose-500">*</span>
                </span>
                <span className="text-[10px] text-muted-foreground font-normal">
                  Configured Definition
                </span>
              </label>
              <select
                value={selectedVoucherName}
                onChange={(e) => handleVoucherNameChange(e.target.value)}
                className="w-full h-9 px-3 rounded-xl border border-border bg-background text-xs font-bold text-foreground outline-none focus:ring-1 focus:ring-primary shadow-2xs cursor-pointer"
              >
                {VOUCHER_NAMES.map((vn) => (
                  <option key={vn.name} value={vn.name}>
                    {vn.name} ({vn.shortCode} - {vn.type})
                  </option>
                ))}
              </select>
            </div>

            {/* Voucher Date */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-foreground">
                Voucher Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={voucherDate}
                onChange={(e) => setVoucherDate(e.target.value)}
                className={`w-full h-9 px-3 rounded-xl border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-primary shadow-2xs ${
                  errors.voucherDate ? 'border-rose-400' : 'border-border'
                }`}
              />
              {errors.voucherDate && (
                <p className="text-[11px] text-rose-500 font-bold">{errors.voucherDate}</p>
              )}
            </div>

            {/* Payment Accounts (Cash / Bank) */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-foreground flex items-center justify-between">
                <span>
                  Payment Accounts (Cash / Bank) <span className="text-rose-500">*</span>
                </span>
                <span className="text-[10px] text-muted-foreground font-normal">
                  Cash / Bank Only
                </span>
              </label>
              <select
                value={headerAccountId}
                onChange={(e) => setHeaderAccountId(e.target.value)}
                className={`w-full h-9 px-3 rounded-xl border bg-background text-xs font-semibold text-foreground outline-none focus:ring-1 focus:ring-primary shadow-2xs cursor-pointer ${
                  errors.headerAccountId ? 'border-rose-400' : 'border-border'
                }`}
              >
                <option value="">Select Cash or Bank Account...</option>
                {MOCK_COA_BANK_ACCOUNTS.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.bankName} - {b.accountName} ({b.accountsNumber})
                  </option>
                ))}
              </select>
              {errors.headerAccountId && (
                <p className="text-[11px] text-rose-500 font-bold">{errors.headerAccountId}</p>
              )}
            </div>

            {/* Cost Center */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-foreground flex items-center justify-between">
                <span>Cost Center</span>
                <span className="text-[10px] text-muted-foreground font-normal">
                  Cost center only for payment and receive voucher
                </span>
              </label>
              <select
                value={headerCostCenterId}
                onChange={(e) => setHeaderCostCenterId(e.target.value)}
                className="w-full h-9 px-3 rounded-xl border border-border bg-background text-xs font-semibold text-foreground outline-none focus:ring-1 focus:ring-primary shadow-2xs cursor-pointer"
              >
                <option value="">Select Cost Center...</option>
                {costCenters.map((cc) => (
                  <option key={cc.id} value={cc.id}>
                    {cc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Line Items Table Card */}
        <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs space-y-0">
          <div className="p-4 border-b border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-foreground">
                Voucher Line Items ({lines.length})
              </h3>
              <span className="text-xs text-muted-foreground">
                {activeType === 'Payment'
                  ? 'Debit lines against header account'
                  : activeType === 'Receive'
                  ? 'Credit lines against header account'
                  : 'Double-entry debit & credit lines'}
              </span>
            </div>

            {/* Column Hide & Show Button */}
            <div className="flex items-center gap-2">
              <LineColumnToggle
                columns={visibleColumns}
                onChange={setVisibleColumns}
              />
            </div>
          </div>

          <div className="overflow-x-auto sidebar-scroll">
            <table className="w-full text-left text-xs border-collapse min-w-[1200px]">
              <thead className="bg-muted/40 border-b border-border text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="py-2.5 px-3 min-w-[220px]">Accounts Head *</th>
                  {visibleColumns.costCenter && (
                    <th className="py-2.5 px-3 min-w-[140px]">Cost Center</th>
                  )}
                  {visibleColumns.subsidiary && (
                    <th className="py-2.5 px-3 min-w-[160px]">Subsidiary (Customer/Vendor)</th>
                  )}
                  {visibleColumns.employee && (
                    <th className="py-2.5 px-3 min-w-[140px]">Employee</th>
                  )}
                  {visibleColumns.vehicle && (
                    <th className="py-2.5 px-3 min-w-[130px]">Vehicles</th>
                  )}
                  {visibleColumns.reference && (
                    <th className="py-2.5 px-3 min-w-[140px]">Reference</th>
                  )}
                  {visibleColumns.description && (
                    <th className="py-2.5 px-3 min-w-[150px]">Description</th>
                  )}
                  {visibleColumns.currency && (
                    <>
                      <th className="py-2.5 px-3 w-20 text-center">Curr.</th>
                      <th className="py-2.5 px-3 w-20 text-center">Rate</th>
                    </>
                  )}

                  {/* Per-type Dr/Cr columns with Base Currency (#38) */}
                  {cfg.showDebit && (
                    <th className="py-2.5 px-3 w-28 text-right bg-indigo-500/5">Debit</th>
                  )}
                  {cfg.showCredit && (
                    <th className="py-2.5 px-3 w-28 text-right bg-emerald-500/5">Credit</th>
                  )}
                  {cfg.showDebit && (
                    <th className="py-2.5 px-3 w-28 text-right bg-indigo-500/10">Debit ({baseCode})</th>
                  )}
                  {cfg.showCredit && (
                    <th className="py-2.5 px-3 w-28 text-right bg-emerald-500/10">Credit ({baseCode})</th>
                  )}

                  <th className="py-2.5 px-2 w-10 text-center"></th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border/60">
                {lines.map((line, idx) => (
                  <tr key={line.id} className="hover:bg-muted/20 transition-colors">
                    {/* Accounts Head */}
                    <td className="py-2 px-2.5">
                      <select
                        value={line.accountHeadId}
                        onChange={(e) => handleUpdateLine(line.id, { accountHeadId: e.target.value })}
                        className={`w-full h-8 px-2 rounded-lg border bg-background text-xs font-semibold text-foreground outline-none focus:ring-1 focus:ring-primary ${
                          errors[`line_${idx}_account`] ? 'border-rose-400' : 'border-border'
                        }`}
                      >
                        <option value="">Select Account Head...</option>
                        {lineAccounts.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.code ? `${a.code} - ` : ''}
                            {a.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Cost Center */}
                    {visibleColumns.costCenter && (
                      <td className="py-2 px-2">
                        <select
                          value={line.costCenterId || ''}
                          onChange={(e) => handleUpdateLine(line.id, { costCenterId: e.target.value })}
                          className="w-full h-8 px-2 rounded-lg border border-border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-primary"
                        >
                          <option value="">None</option>
                          {costCenters.map((cc) => (
                            <option key={cc.id} value={cc.id}>
                              {cc.name}
                            </option>
                          ))}
                        </select>
                      </td>
                    )}

                    {/* Subsidiary (Customer / Vendor) */}
                    {visibleColumns.subsidiary && (
                      <td className="py-2 px-2">
                        <select
                          value={line.subsidiaryId || ''}
                          onChange={(e) => handleUpdateLine(line.id, { subsidiaryId: e.target.value })}
                          className="w-full h-8 px-2 rounded-lg border border-border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-primary"
                        >
                          <option value="">None</option>
                          <optgroup label="Suppliers / Vendors">
                            {MOCK_SUPPLIERS.map((s) => (
                              <option key={s.id} value={s.id}>
                                [Vendor] {s.name}
                              </option>
                            ))}
                          </optgroup>
                          <optgroup label="Customers / Buyers">
                            {MOCK_CUSTOMERS.map((c) => (
                              <option key={c.id} value={c.id}>
                                [Customer] {c.customerName}
                              </option>
                            ))}
                          </optgroup>
                        </select>
                      </td>
                    )}

                    {/* Employee */}
                    {visibleColumns.employee && (
                      <td className="py-2 px-2">
                        <select
                          value={line.employeeId || ''}
                          onChange={(e) => handleUpdateLine(line.id, { employeeId: e.target.value })}
                          className="w-full h-8 px-2 rounded-lg border border-border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-primary"
                        >
                          <option value="">None</option>
                          {MOCK_EMPLOYEES.map((emp) => (
                            <option key={emp.id} value={emp.id}>
                              {emp.name} ({emp.designation})
                            </option>
                          ))}
                        </select>
                      </td>
                    )}

                    {/* Vehicles */}
                    {visibleColumns.vehicle && (
                      <td className="py-2 px-2">
                        <select
                          value={line.vehicleId || ''}
                          onChange={(e) => handleUpdateLine(line.id, { vehicleId: e.target.value })}
                          className="w-full h-8 px-2 rounded-lg border border-border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-primary"
                        >
                          <option value="">None</option>
                          {vehicles.map((v) => (
                            <option key={v.id} value={v.id}>
                              {v.name}
                            </option>
                          ))}
                        </select>
                      </td>
                    )}

                    {/* Reference (List from setup) */}
                    {visibleColumns.reference && (
                      <td className="py-2 px-2">
                        <select
                          value={line.reference || ''}
                          onChange={(e) => handleUpdateLine(line.id, { reference: e.target.value })}
                          className="w-full h-8 px-2 rounded-lg border border-border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-primary"
                        >
                          <option value="">None</option>
                          {referenceCenters.map((rc) => (
                            <option key={rc.id} value={rc.name}>
                              {rc.name}
                            </option>
                          ))}
                          {line.reference &&
                            !referenceCenters.some((rc) => rc.name === line.reference) && (
                              <option value={line.reference}>{line.reference}</option>
                            )}
                        </select>
                      </td>
                    )}

                    {/* Description */}
                    {visibleColumns.description && (
                      <td className="py-2 px-2">
                        <input
                          type="text"
                          placeholder="Line note..."
                          value={line.description || ''}
                          onChange={(e) => handleUpdateLine(line.id, { description: e.target.value })}
                          className="w-full h-8 px-2 rounded-lg border border-border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-primary"
                        />
                      </td>
                    )}

                    {/* Currency & Rate */}
                    {visibleColumns.currency && (
                      <>
                        <td className="py-2 px-1 text-center">
                          <select
                            value={line.currency}
                            onChange={(e) => handleUpdateLine(line.id, { currency: e.target.value })}
                            className="h-8 px-1.5 rounded-lg border border-border bg-background text-xs font-bold text-foreground outline-none focus:ring-1 focus:ring-primary"
                          >
                            {MOCK_CURRENCY_SETUPS.map((c) => (
                              <option key={c.code} value={c.code}>
                                {c.code}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="py-2 px-1 text-center">
                          <input
                            type="number"
                            step="any"
                            min={0.0001}
                            value={line.exchangeRate || 1}
                            onChange={(e) =>
                              handleUpdateLine(line.id, {
                                exchangeRate: parseFloat(e.target.value) || 1,
                              })
                            }
                            className="w-16 h-8 px-1 text-center rounded-lg border border-border bg-background text-xs font-mono font-bold text-foreground outline-none focus:ring-1 focus:ring-primary"
                          />
                        </td>
                      </>
                    )}

                    {/* Debit Input */}
                    {cfg.showDebit && (
                      <td className="py-2 px-2 bg-indigo-500/5">
                        <input
                          type="number"
                          step="any"
                          min={0}
                          value={line.debit || ''}
                          onChange={(e) =>
                            handleUpdateLine(line.id, {
                              debit: parseFloat(e.target.value) || 0,
                            })
                          }
                          placeholder="0.00"
                          className="w-full h-8 px-2 text-right rounded-lg border border-border bg-background text-xs font-mono font-bold text-foreground outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </td>
                    )}

                    {/* Credit Input */}
                    {cfg.showCredit && (
                      <td className="py-2 px-2 bg-emerald-500/5">
                        <input
                          type="number"
                          step="any"
                          min={0}
                          value={line.credit || ''}
                          onChange={(e) =>
                            handleUpdateLine(line.id, {
                              credit: parseFloat(e.target.value) || 0,
                            })
                          }
                          placeholder="0.00"
                          className="w-full h-8 px-2 text-right rounded-lg border border-border bg-background text-xs font-mono font-bold text-foreground outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </td>
                    )}

                    {/* Debit BDT (Read-only) */}
                    {cfg.showDebit && (
                      <td className="py-2 px-2 text-right font-mono font-bold text-xs text-foreground bg-indigo-500/10">
                        {baseSymbol} {(line.debitBDT || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                    )}

                    {/* Credit BDT (Read-only) */}
                    {cfg.showCredit && (
                      <td className="py-2 px-2 text-right font-mono font-bold text-xs text-foreground bg-emerald-500/10">
                        {baseSymbol} {(line.creditBDT || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                    )}

                    {/* Remove Action */}
                    <td className="py-2 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveLine(line.id)}
                        className="p-1 rounded-md text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Remove Line"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

              {/* Table Footer Totals & Difference */}
              <tfoot className="bg-muted/30 border-t-2 border-border/80 font-bold text-xs">
                {(() => {
                  const activeNonAmountCols =
                    1 + // Accounts Head
                    (visibleColumns.costCenter ? 1 : 0) +
                    (visibleColumns.subsidiary ? 1 : 0) +
                    (visibleColumns.employee ? 1 : 0) +
                    (visibleColumns.vehicle ? 1 : 0) +
                    (visibleColumns.reference ? 1 : 0) +
                    (visibleColumns.description ? 1 : 0) +
                    (visibleColumns.currency ? 2 : 0);

                  const totalAmountCols =
                    (cfg.showDebit ? 2 : 0) + (cfg.showCredit ? 2 : 0) + 1;

                  return (
                    <>
                      <tr>
                        <td
                          colSpan={activeNonAmountCols}
                          className="py-3 px-4 text-right uppercase tracking-wider text-muted-foreground"
                        >
                          Total:
                        </td>

                        {cfg.showDebit && (
                          <td className="py-3 px-2 text-right font-mono font-black text-foreground bg-indigo-500/5">
                            {baseSymbol}{' '}
                            {totalDebitBDT.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </td>
                        )}

                        {cfg.showCredit && (
                          <td className="py-3 px-2 text-right font-mono font-black text-foreground bg-emerald-500/5">
                            {baseSymbol}{' '}
                            {totalCreditBDT.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </td>
                        )}

                        {cfg.showDebit && (
                          <td className="py-3 px-2 text-right font-mono font-black text-indigo-700 dark:text-indigo-300 bg-indigo-500/15">
                            {baseSymbol}{' '}
                            {totalDebitBDT.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </td>
                        )}

                        {cfg.showCredit && (
                          <td className="py-3 px-2 text-right font-mono font-black text-emerald-700 dark:text-emerald-300 bg-emerald-500/15">
                            {baseSymbol}{' '}
                            {totalCreditBDT.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </td>
                        )}

                        <td></td>
                      </tr>

                      {/* Double-Entry Difference Row */}
                      {cfg.showDifference && (
                        <tr className="bg-muted/50 border-t border-border/60">
                          <td
                            colSpan={activeNonAmountCols}
                            className="py-2.5 px-4 text-right text-xs font-bold text-muted-foreground"
                          >
                            Difference (Dr − Cr):
                          </td>
                          <td colSpan={totalAmountCols} className="py-2.5 px-4 text-right">
                            {isBalanced ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-500/15 text-emerald-600 border border-emerald-500/30">
                                <Check className="size-3.5 stroke-[3]" />
                                <span>Balanced ✓</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-500/15 text-rose-600 border border-rose-500/30">
                                <AlertCircle className="size-3.5" />
                                <span>
                                  Difference: {baseSymbol}{' '}
                                  {difference > 0 ? `+${difference.toFixed(2)}` : difference.toFixed(2)}
                                </span>
                              </span>
                            )}
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })()}
              </tfoot>
            </table>
          </div>

          {/* Add Line ++ Button */}
          <div className="p-3 bg-muted/20 border-t border-border">
            <button
              type="button"
              onClick={handleAddLine}
              className="w-full py-2.5 rounded-xl border-2 border-dashed border-border hover:border-primary/60 hover:bg-muted/40 text-xs font-bold text-muted-foreground hover:text-primary transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none"
            >
              <Plus className="size-4 stroke-[2.5]" />
              <span>Add Line ++</span>
            </button>
          </div>
        </div>

        {/* Narration & Attachment Field */}
        <div className="p-5 sm:p-6 rounded-2xl border border-border/80 bg-card shadow-xs space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground">
                Voucher Narration / Remarks
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
              placeholder="Enter comprehensive narrative description for this financial transaction entry..."
              className="w-full p-3 rounded-xl border border-border bg-background text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-primary shadow-2xs resize-none"
            />
          </div>

          {/* Attachment Section directly inside card */}
          <AttachmentUploadSection
            attachments={attachments}
            onChange={setAttachments}
          />
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {/* Left Action: Save as Preset */}
          <button
            type="button"
            onClick={() => setSavePresetOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-bold text-foreground transition-all cursor-pointer shadow-2xs active:scale-95"
          >
            <BookmarkPlus className="size-4 text-primary" />
            <span>Save as Preset</span>
          </button>

          {/* Right Actions: Cancel + Save */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => {
                if (onClose) onClose();
                else navigate('/journal-entries');
              }}
              className="px-4 py-2.5 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving || (cfg.showDifference && !isBalanced)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-sm shadow-primary/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95"
            >
              {saving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Saving Voucher...</span>
                </>
              ) : (
                <>
                  <Save className="size-4 stroke-[2.5]" />
                  <span>{isEdit ? 'Update Voucher' : `Save ${cfg.label}`}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Save as Preset Modal */}
      <SaveAsPresetDialog
        isOpen={savePresetOpen}
        onClose={() => setSavePresetOpen(false)}
        voucherType={voucherType}
        lineCount={lines.length}
        onSavePreset={handleSaveCurrentAsPreset}
      />
    </div>
  );
};
