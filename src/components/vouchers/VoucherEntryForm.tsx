import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { VoucherType, VoucherLine, VoucherEntry } from '../../types/voucher';
import {
  VOUCHER_TYPE_CONFIGS,
  DEFAULT_DATE,
  COST_CENTERS,
} from '../../constants/voucherTypeConfig';
import { calculateVoucherTotals } from '../../lib/voucherMath';
import { VoucherTypeChip } from './VoucherTypeChip';
import { LineItemTable } from './LineItemTable';
import { VoucherFooterTotals } from './VoucherFooterTotals';
import { AccountHeadPicker } from './AccountHeadPicker';
import { SearchableSelect } from '../shared/SearchableSelect';
import { CustomFieldCell } from '../shared/CustomFieldCell';
import {
  Calendar,
  Save,
  ArrowLeft,
  Receipt,
  Building2,
  FileText,
  Wallet,
  Landmark,
  CheckCircle2,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { useCustomFields } from '../../hooks/useCustomFields';
import { useVouchers } from '../../context/VoucherContext';
import { interpolateNarration, extractNarrationContext } from '../../utils/narrationInterpolator';

interface VoucherEntryFormProps {
  type: VoucherType;
  onSave?: (entry: VoucherEntry) => void;
}

export const VoucherEntryForm: React.FC<VoucherEntryFormProps> = ({ type, onSave }) => {
  const navigate = useNavigate();
  const config = VOUCHER_TYPE_CONFIGS[type];

  const [date, setDate] = useState<string>(DEFAULT_DATE);
  const [headerAccountId, setHeaderAccountId] = useState<string>('');
  const [headerAccountName, setHeaderAccountName] = useState<string>('');
  const [headerCostCenterId, setHeaderCostCenterId] = useState<string>('');
  const [narration, setNarration] = useState<string>('');

  // Dynamic multiple narration setup from Voucher Definition
  const { vouchers } = useVouchers();
  const [selectedNarrationId, setSelectedNarrationId] = useState<string>('');

  const activeVoucherDef = useMemo(() => {
    return vouchers.find((v) => v.voucherType === type) || vouchers[0];
  }, [vouchers, type]);

  const availableNarrations = useMemo(() => {
    if (!activeVoucherDef) return [];
    if (activeVoucherDef.narrations && activeVoucherDef.narrations.length > 0) {
      return activeVoucherDef.narrations;
    }
    if (activeVoucherDef.narrationTemplate) {
      return [
        {
          id: `def-${activeVoucherDef.id}`,
          title: 'Standard Default Narration',
          template: activeVoucherDef.narrationTemplate,
          isDefault: true,
        },
      ];
    }
    return [];
  }, [activeVoucherDef]);

  const applyNarrationTemplate = (templateText: string, optionTitle?: string) => {
    const totalAmt = lines.reduce((acc, l) => acc + (Number(l.debit) || Number(l.credit) || 0), 0);
    const context = extractNarrationContext(date, lines, headerAccountName, totalAmt);
    const filled = interpolateNarration(templateText, context);
    setNarration(filled);
    if (optionTitle) {
      toast.success(`Narration populated from "${optionTitle}"`);
    }
  };

  const handleSelectNarration = (narrationId: string) => {
    setSelectedNarrationId(narrationId);
    if (!narrationId) return;
    const chosen = availableNarrations.find((n) => n.id === narrationId);
    if (chosen) {
      applyNarrationTemplate(chosen.template, chosen.title);
    }
  };

  useEffect(() => {
    if (!narration && activeVoucherDef?.autoNarrationEnabled !== false && availableNarrations.length > 0) {
      const defaultOption = availableNarrations.find((n) => n.isDefault) || availableNarrations[0];
      if (defaultOption) {
        setSelectedNarrationId(defaultOption.id);
        applyNarrationTemplate(defaultOption.template);
      }
    }
  }, [activeVoucherDef?.id]);

  // Initial seed lines
  const [lines, setLines] = useState<VoucherLine[]>(() => {
    const isTwoLineType = type === 'Journal Voucher' || type === 'Contra Voucher';
    const makeSeedLine = (id: string): VoucherLine => ({
      id,
      accountHeadId: '',
      accountHeadName: '',
      costCenterId: '',
      subsidiaryId: '',
      employeeId: '',
      vehicleId: '',
      reference: '',
      description: '',
      currency: 'BDT',
      exchangeRate: 1,
      debit: config.showDebit ? 0 : undefined,
      credit: config.showCredit ? 0 : undefined,
      debitBDT: config.showDebit ? 0 : undefined,
      creditBDT: config.showCredit ? 0 : undefined,
    });
    return isTwoLineType
      ? [makeSeedLine('vl-seed-1'), makeSeedLine('vl-seed-2')]
      : [makeSeedLine('vl-seed-1')];
  });

  // Calculate live totals and reconciliation
  const totals = useMemo(() => {
    return calculateVoucherTotals(lines, type);
  }, [lines, type]);

  // Check save validity
  const isSaveValid = useMemo(() => {
    // Must have at least 1 line with an account selected
    const hasValidLine = lines.some((l) => l.accountHeadId.trim() !== '');
    if (!hasValidLine) return false;

    // Receive/Payment requires header account
    if (config.hasHeaderAccount && !headerAccountId) {
      return false;
    }

    // Double-entry requires balanced (difference == 0 and total > 0)
    if (config.isDoubleEntry) {
      return totals.isBalanced;
    }

    // Single-sided requires at least one non-zero amount
    if (type === 'Payment Voucher') {
      return totals.totalDebitBDT > 0;
    }
    if (type === 'Receive Voucher') {
      return totals.totalCreditBDT > 0;
    }

    return true;
  }, [lines, config, headerAccountId, totals, type]);

  // Custom fields: Master level (header) and Details level (line-items)
  const { fields: masterCustomFields } = useCustomFields('voucher-master');
  const { fields: detailCustomFields } = useCustomFields('voucher-details');
  const [masterCustomFieldValues, setMasterCustomFieldValues] = useState<Record<string, any>>({});

  // Seed default values for master custom fields
  useEffect(() => {
    if (masterCustomFields.length > 0) {
      setMasterCustomFieldValues((prev) => {
        let changed = false;
        const next = { ...prev };
        masterCustomFields.forEach((cf) => {
          if (next[cf.id] === undefined && cf.defaultValue !== undefined && cf.defaultValue !== null && cf.defaultValue !== '') {
            next[cf.id] = cf.defaultValue;
            changed = true;
          }
        });
        return changed ? next : prev;
      });
    }
  }, [masterCustomFields]);

  const handleSaveVoucher = () => {
    if (!isSaveValid) {
      if (config.isDoubleEntry && !totals.isBalanced) {
        toast.error('Cannot post voucher: Debit and Credit are not balanced (Difference must = 0.00)');
      } else if (config.hasHeaderAccount && !headerAccountId) {
        toast.error(`Please select a ${config.headerAccountLabel}`);
      } else {
        toast.error('Please complete all required fields and amounts before saving.');
      }
      return;
    }

    // 1. Check mandatory master custom fields
    const mandatoryMasterFields = masterCustomFields.filter((cf) => cf.mandatory && cf.activeStatus === 'Active');
    for (const mf of mandatoryMasterFields) {
      const val = masterCustomFieldValues[mf.id];
      if (val === undefined || val === null || String(val).trim() === '') {
        toast.error(`Master Custom Field "${mf.label}" is required before saving.`);
        return;
      }
    }

    // 2. Check mandatory detail custom fields on line-items
    const mandatoryDetailFields = detailCustomFields.filter((cf) => cf.mandatory && cf.activeStatus === 'Active');
    for (const df of mandatoryDetailFields) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.accountHeadId) {
          const val = line.customFields?.[df.id];
          if (val === undefined || val === null || String(val).trim() === '') {
            toast.error(`Line #${i + 1}: Custom field "${df.label}" is required before saving.`);
            return;
          }
        }
      }
    }

    const newVoucher: VoucherEntry = {
      id: `ve-${Date.now()}`,
      voucherNumber: `${config.shortName}-${Date.now().toString().slice(-6)}`,
      voucherType: type,
      date,
      headerAccountId: config.hasHeaderAccount ? headerAccountId : undefined,
      headerAccountName: config.hasHeaderAccount ? headerAccountName : undefined,
      headerCostCenterId: config.hasHeaderAccount ? headerCostCenterId : undefined,
      lines,
      narration,
      totals: {
        debit: totals.totalDebit,
        credit: totals.totalCredit,
        debitBDT: totals.totalDebitBDT,
        creditBDT: totals.totalCreditBDT,
      },
      difference: totals.difference,
      customFields: masterCustomFieldValues,
      createdAt: new Date().toISOString(),
    };

    if (onSave) {
      onSave(newVoucher);
    }
    toast.success(`${type} #${newVoucher.voucherNumber} posted successfully!`);
    navigate('/vouchers');
  };

  return (
    <div className="space-y-4">
      {/* ── Top Header Strip ── */}
      <div className="bg-card border border-border/80 rounded-xl p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-3">
          {/* Breadcrumb Title */}
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-primary/10 text-primary grid place-items-center">
              <Receipt className="size-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-foreground">
                  {config.breadcrumbTitle}
                </h1>
                <VoucherTypeChip type={type} size="sm" />
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Financial transaction entry form with automated multi-currency reconciliation.
              </p>
            </div>
          </div>

          {/* Date Picker */}
          <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-lg border border-border/70 shadow-2xs shrink-0">
            <Calendar className="size-3.5 text-primary" />
            <span className="text-xs font-bold text-foreground">Date:</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent font-mono text-xs font-bold text-foreground outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* ── Type-Specific Special Header Fields (Receive / Payment) ── */}
        {config.hasHeaderAccount && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-muted/20 border border-border/60">
            {/* Header Account Picker (Cash & Bank restricted) */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground/85 flex items-center justify-between">
                <span>
                  {config.headerAccountLabel} <span className="text-rose-500">*</span>
                </span>
                <span className="text-[10px] text-muted-foreground font-normal">
                  Cash & Bank only
                </span>
              </label>
              <AccountHeadPicker
                value={headerAccountId}
                onChange={(id, name) => {
                  setHeaderAccountId(id);
                  setHeaderAccountName(name);
                }}
                onlyCashAndBank={true}
                placeholder={`Select ${config.headerAccountLabel}...`}
              />
            </div>

            {/* Cost Center Picker */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground/85">Header Cost Center</label>
              <SearchableSelect
                value={headerCostCenterId}
                onChange={setHeaderCostCenterId}
                options={COST_CENTERS.map((cc) => ({ value: cc.id, label: cc.name }))}
                placeholder="Select Cost Center..."
                searchPlaceholder="Filter cost center..."
                buttonClassName="h-8.5 rounded-lg border-border/80 text-xs font-semibold"
              />
            </div>
          </div>
        )}

        {/* ── Voucher Master Custom Fields ── */}
        {masterCustomFields.length > 0 && (
          <div className="p-3 rounded-xl bg-muted/20 border border-border/60 space-y-2">
            <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
              <span className="text-[11px] font-bold text-foreground/85 uppercase tracking-wider flex items-center gap-1.5">
                <span>Voucher Master Custom Fields</span>
                <span className="text-[10px] font-normal text-muted-foreground lowercase">
                  ({masterCustomFields.length} {masterCustomFields.length === 1 ? 'field' : 'fields'})
                </span>
              </span>
              <span className="text-[10.5px] font-medium text-muted-foreground">
                Applies to voucher master header
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-0.5">
              {masterCustomFields.map((cf) => (
                <div key={cf.id} className="space-y-1">
                  <label className="text-xs font-bold text-foreground/85 flex items-center justify-between">
                    <span>
                      {cf.label} {cf.mandatory && <span className="text-rose-500">*</span>}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {cf.dataType}
                    </span>
                  </label>
                  <CustomFieldCell
                    field={cf}
                    value={masterCustomFieldValues[cf.id] ?? ''}
                    onChange={(val) =>
                      setMasterCustomFieldValues((prev) => ({
                        ...prev,
                        [cf.id]: val,
                      }))
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Line-Item Table ── */}
      <LineItemTable voucherType={type} lines={lines} onChange={setLines} />

      {/* ── Summary & Reconciliation Footer ── */}
      <VoucherFooterTotals voucherType={type} totals={totals} />

      {/* ── Narration Textarea with Multiple Standard Templates Dropdown ── */}
      <div className="bg-card border border-border/80 rounded-xl p-3.5 shadow-2xs space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs font-bold text-foreground/85 flex items-center gap-1.5">
            <FileText className="size-3.5 text-primary" />
            <span>Narration / Notes</span>
          </label>

          {availableNarrations.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-lg px-2.5 py-1">
                <Sparkles className="size-3 text-primary shrink-0" />
                <span className="text-[11px] font-bold text-primary whitespace-nowrap">
                  Standard Narration:
                </span>
                <select
                  value={selectedNarrationId}
                  onChange={(e) => handleSelectNarration(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-foreground outline-none cursor-pointer max-w-[240px] truncate"
                >
                  <option value="" className="bg-card text-foreground">
                    -- Choose Template ({availableNarrations.length} Options) --
                  </option>
                  {availableNarrations.map((n) => (
                    <option
                      key={n.id}
                      value={n.id}
                      className="bg-card text-foreground font-medium"
                    >
                      {n.title} {n.isDefault ? '★ (Default)' : ''}
                    </option>
                  ))}
                </select>

                {selectedNarrationId && (
                  <button
                    type="button"
                    onClick={() => {
                      const chosen = availableNarrations.find((n) => n.id === selectedNarrationId);
                      if (chosen) applyNarrationTemplate(chosen.template, chosen.title);
                    }}
                    className="p-0.5 rounded text-primary hover:bg-primary/20 transition cursor-pointer"
                    title="Refresh tokens with current line item data"
                  >
                    <RefreshCw className="size-3" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <textarea
          rows={2}
          value={narration}
          onChange={(e) => setNarration(e.target.value)}
          placeholder="Enter formal accounting narration or voucher notes here..."
          className="w-full p-2.5 rounded-lg bg-muted/15 border border-border/80 text-xs text-foreground outline-none focus:ring-1 focus:ring-primary shadow-2xs resize-none"
        />

        {selectedNarrationId && (
          <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
            <span>
              Active Template:{' '}
              <strong className="text-foreground">
                {availableNarrations.find((n) => n.id === selectedNarrationId)?.title}
              </strong>
            </span>
            <span className="text-[10.5px] italic text-primary/80">
              Auto-filled • Fully editable
            </span>
          </div>
        )}
      </div>

      {/* ── Sticky Bottom Action Bar ── */}
      <div className="sticky bottom-0 z-20 bg-card/95 backdrop-blur-md border border-border/80 rounded-xl p-3 shadow-lg flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate('/vouchers')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border hover:bg-muted text-xs font-bold text-muted-foreground hover:text-foreground transition-all cursor-pointer"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to List</span>
        </button>

        <button
          type="button"
          onClick={handleSaveVoucher}
          disabled={!isSaveValid}
          className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
            isSaveValid
              ? 'bg-primary text-primary-foreground hover:bg-primary/95 shadow-primary/20'
              : 'bg-muted text-muted-foreground/50 border border-border/40 cursor-not-allowed shadow-none'
          }`}
        >
          <Save className="size-3.5 stroke-[2.5]" />
          <span>Post & Save {type}</span>
        </button>
      </div>
    </div>
  );
};
