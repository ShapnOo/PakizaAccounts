import React from 'react';
import {
  Building2,
  Lock,
  CalendarDays,
  FileText,
  GitMerge,
  Landmark,
  Wallet,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Check,
  SlidersHorizontal,
} from 'lucide-react';
import { useConfigState, COMPANY_LIST } from '../hooks/useConfigState';
import { useVouchers } from '../context/VoucherContext';
import { SectionCard } from '../components/config/SectionCard';
import { ConfigRow } from '../components/config/ConfigRow';
import { ToggleYesNo } from '../components/config/ToggleYesNo';
import { Dropdown } from '../components/config/Dropdown';
import { MultiSelect } from '../components/config/MultiSelect';
import { DateFmtInput } from '../components/config/DateFmtInput';
import { MonthGrid } from '../components/config/MonthGrid';
import { AccountPicker } from '../components/config/AccountPicker';

const EFFECTIVE_PART_OPTIONS = ['Balance sheet', 'Income Statement'];

const VOUCHER_TYPE_OPTIONS = ['Voucher Type', 'User', 'All'];

const ID_RENEWAL_OPTIONS = [
  'Fiscal Yearly',
  'Calendar Yearly',
  'Monthly',
  'Continuous',
];

const ACCOUNTS_PATH_OPTIONS = [
  'Hide',
  'Before accounts',
  'After accounts',
] as const;

export const MasterConfigPage: React.FC = () => {
  const {
    config,
    updateSection,
    updateGlobalEffectiveCompany,
    isSectionDirty,
    isGlobalDirty,
    saveSection,
    saveAll,
    resetAll,
  } = useConfigState();

  const { vouchers } = useVouchers();
  const voucherTypeOptions = vouchers.length > 0 
    ? vouchers.map((v) => v.name) 
    : ['Bank Payment Voucher', 'Bank Receipt Voucher', 'Contra Voucher', 'Journal Voucher'];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-5 md:py-6 space-y-4 pb-20">
      {/* ── Breadcrumb & Page Header ── */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-muted-foreground/70 uppercase tracking-wider">
          <span>Home</span>
          <ChevronRight className="size-3 text-muted-foreground/40" />
          <span>Accounts Configuration</span>
          <ChevronRight className="size-3 text-muted-foreground/40" />
          <span className="text-primary font-black">Master Configuration (F&A)</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-3">
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
              <SlidersHorizontal className="size-5.5 text-primary" />
              <span>Master Configuration (F&A)</span>
            </h1>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">
              General ledger policies, period locking, cost centers, and automated voucher rules.
            </p>
          </div>

          {/* Quick Scope Badge */}
          <div className="flex items-center gap-2 bg-card px-3 py-1.5 rounded-lg border border-border/70 shadow-2xs shrink-0">
            <Building2 className="size-3.5 text-primary" />
            <span className="text-[11px] font-bold text-muted-foreground">Scope:</span>
            <MultiSelect
              value={config.globalEffectiveCompany}
              onChange={updateGlobalEffectiveCompany}
              options={COMPANY_LIST}
              className="w-56"
            />
          </div>
        </div>
      </div>

      {/* ── 3.1 COST CENTER ── */}
      <SectionCard
        sectionNo="3.1"
        title="Cost Center"
        icon={Building2}
        onApply={() => saveSection('costCenter', 'Cost Center')}
        isDirty={isSectionDirty('costCenter')}
      >
        <ConfigRow
          label="Cost Center"
          hint="This part will visible when it's mandatory"
        >
          <ToggleYesNo
            label="Mandatory"
            value={config.costCenter.mandatory}
            onChange={(val) => updateSection('costCenter', { mandatory: val })}
          />
        </ConfigRow>

        {/* CONDITIONAL (Mandatory === true) */}
        <div
          className={`transition-all duration-300 overflow-hidden ${
            config.costCenter.mandatory ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="pl-4 md:pl-6 my-1 border-l-2 border-primary/50 bg-muted/20 rounded-r-lg space-y-0.5 py-1">
            <ConfigRow label="Effective Part">
              <MultiSelect
                value={config.costCenter.effectivePart}
                onChange={(val) => updateSection('costCenter', { effectivePart: val })}
                options={EFFECTIVE_PART_OPTIONS}
              />
            </ConfigRow>

            <ConfigRow label="Effective Company">
              <MultiSelect
                value={config.costCenter.partEffectiveCompany}
                onChange={(val) => updateSection('costCenter', { partEffectiveCompany: val })}
                options={COMPANY_LIST}
              />
            </ConfigRow>
          </div>
        </div>
      </SectionCard>

      {/* ── 3.2 VOUCHER CONTROLLING ── */}
      <SectionCard
        sectionNo="3.2"
        title="Voucher Controlling"
        icon={Lock}
        onApply={() => saveSection('voucherControlling', 'Voucher Controlling')}
        isDirty={isSectionDirty('voucherControlling')}
      >
        <ConfigRow label="Voucher Controll">
          <ToggleYesNo
            value={config.voucherControlling.enabled}
            onChange={(val) => updateSection('voucherControlling', { enabled: val })}
          />
        </ConfigRow>

        {/* CONDITIONAL (Enabled === true) */}
        <div
          className={`transition-all duration-300 overflow-hidden ${
            config.voucherControlling.enabled ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="pl-4 md:pl-6 my-1 border-l-2 border-primary/50 bg-muted/20 rounded-r-lg space-y-0.5 py-1">
            <ConfigRow label="Max Due Days">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="365"
                  value={config.voucherControlling.maxDueDays}
                  onChange={(e) =>
                    updateSection('voucherControlling', {
                      maxDueDays: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  className="w-24 h-8.5 px-3 rounded-lg bg-card border border-border/80 text-xs font-mono font-bold text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-2xs"
                />
                <span className="text-xs text-muted-foreground font-semibold">Days threshold</span>
              </div>
            </ConfigRow>

            <ConfigRow label="Effective Part">
              <div className="flex items-center gap-1.5 w-full max-w-[280px]">
                <Dropdown
                  value={config.voucherControlling.effectivePart.voucherType}
                  onChange={(val) =>
                    updateSection('voucherControlling', {
                      effectivePart: {
                        ...config.voucherControlling.effectivePart,
                        voucherType: val,
                      },
                    })
                  }
                  options={VOUCHER_TYPE_OPTIONS}
                  className="flex-1 min-w-0 max-w-none"
                />
                <span className="text-xs text-muted-foreground/60 font-bold px-0.5">/</span>
                <Dropdown
                  value={config.voucherControlling.effectivePart.user}
                  onChange={(val) =>
                    updateSection('voucherControlling', {
                      effectivePart: {
                        ...config.voucherControlling.effectivePart,
                        user: val,
                      },
                    })
                  }
                  options={['All', 'Specific Role', 'Maker Only']}
                  className="flex-1 min-w-0 max-w-none"
                />
              </div>
            </ConfigRow>

            <ConfigRow label="Effective Company">
              <MultiSelect
                value={config.voucherControlling.effectiveCompany}
                onChange={(val) => updateSection('voucherControlling', { effectiveCompany: val })}
                options={COMPANY_LIST}
              />
            </ConfigRow>
          </div>
        </div>
      </SectionCard>

      {/* ── 3.3 MONTH LOCK ── */}
      <SectionCard
        sectionNo="3.3"
        title="Month Lock"
        icon={CalendarDays}
        onApply={() => saveSection('monthLock', 'Month Lock')}
        isDirty={isSectionDirty('monthLock')}
      >
        <div className="py-1">
          <MonthGrid
            fiscalYear={config.monthLock.fiscalYear}
            months={config.monthLock.months}
            onChange={(months) => updateSection('monthLock', { months })}
          />
        </div>

        <ConfigRow label="Effective Company">
          <MultiSelect
            value={config.monthLock.effectiveCompany}
            onChange={(val) => updateSection('monthLock', { effectiveCompany: val })}
            options={COMPANY_LIST}
          />
        </ConfigRow>
      </SectionCard>

      {/* ── 3.4 VOUCHER & ACCOUNTS CODE (merged) ── */}
      <SectionCard
        sectionNo="3.4"
        title="Voucher & Accounts Code"
        icon={FileText}
        onApply={() => {
          saveSection('voucher', 'Voucher Settings');
          saveSection('accountsCode', 'Accounts Code');
        }}
        isDirty={isSectionDirty('voucher') || isSectionDirty('accountsCode')}
      >
        <ConfigRow label="Voucher Date Format" hint="Standard system date pattern">
          <DateFmtInput value={config.voucher.dateFormat} />
        </ConfigRow>

        <ConfigRow label="ID Renewal" hint="When voucher sequence resets">
          <Dropdown
            value={String(config.voucher.idRenewal)}
            onChange={(val) => updateSection('voucher', { idRenewal: val })}
            options={ID_RENEWAL_OPTIONS}
          />
        </ConfigRow>

        <ConfigRow
          label="Subsidiary & Accounts Merge View"
          hint="Consolidates subledger codes into primary chart tree"
        >
          <ToggleYesNo
            value={config.accountsCode.mergeView}
            onChange={(val) => updateSection('accountsCode', { mergeView: val })}
          />
        </ConfigRow>

        <ConfigRow label="Accounts Path Visible" hint="Where the account path is shown">
          <Dropdown
            value={String(config.accountsCode.pathVisible)}
            onChange={(val) => updateSection('accountsCode', { pathVisible: val })}
            options={[...ACCOUNTS_PATH_OPTIONS]}
          />
        </ConfigRow>

        <ConfigRow label="Effective Company">
          <MultiSelect
            value={config.accountsCode.effectiveCompany}
            onChange={(val) => updateSection('accountsCode', { effectiveCompany: val })}
            options={COMPANY_LIST}
          />
        </ConfigRow>
      </SectionCard>

      {/* ── 3.5 ACCOUNTS IDENTIFICATIONS ── */}
      <SectionCard
        sectionNo="3.5"
        title="Accounts Identifications"
        icon={Landmark}
        onApply={() => saveSection('accountsIdentifications', 'Accounts Identifications')}
        isDirty={isSectionDirty('accountsIdentifications')}
      >
        <div className="py-2 grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div className="p-3 rounded-lg border border-border/70 bg-card shadow-2xs space-y-1">
            <AccountPicker
              label="Accounts Payable"
              badge="Current Liability"
              required
              value={config.accountsIdentifications.accountsPayable}
              onChange={(val) =>
                updateSection('accountsIdentifications', { accountsPayable: val })
              }
              placeholder="Select Accounts Payable Head..."
            />
          </div>

          <div className="p-3 rounded-lg border border-border/70 bg-card shadow-2xs space-y-1">
            <AccountPicker
              label="Accounts Receivable"
              badge="Current Asset"
              required
              value={config.accountsIdentifications.accountsReceivable}
              onChange={(val) =>
                updateSection('accountsIdentifications', { accountsReceivable: val })
              }
              placeholder="Select Accounts Receivable Head..."
            />
          </div>

          <div className="p-3 rounded-lg border border-border/70 bg-card shadow-2xs space-y-1">
            <AccountPicker
              label="Advance Payment"
              badge="Asset Prepayment"
              required
              value={config.accountsIdentifications.advancePayment}
              onChange={(val) =>
                updateSection('accountsIdentifications', { advancePayment: val })
              }
              placeholder="Select Advance Payment Head..."
            />
          </div>

          <div className="p-3 rounded-lg border border-border/70 bg-card shadow-2xs space-y-1">
            <AccountPicker
              label="Advance Receive"
              badge="Customer Liability"
              required
              value={config.accountsIdentifications.advanceReceive}
              onChange={(val) =>
                updateSection('accountsIdentifications', { advanceReceive: val })
              }
              placeholder="Select Advance Receive Head..."
            />
          </div>
        </div>
      </SectionCard>

      {/* ── 3.6 BANK & CHEQUE ── */}
      <SectionCard
        sectionNo="3.6"
        title="Bank & Cheque"
        icon={Wallet}
        onApply={() => saveSection('bankCheque', 'Bank & Cheque')}
        isDirty={isSectionDirty('bankCheque')}
      >
        <ConfigRow label="Default Voucher Type">
          <Dropdown
            value={config.bankCheque.defaultVoucherType}
            onChange={(val) => updateSection('bankCheque', { defaultVoucherType: val })}
            options={voucherTypeOptions}
          />
        </ConfigRow>

        <ConfigRow label="Default Account" required>
          <div className="w-full max-w-[340px]">
            <AccountPicker
              value={config.bankCheque.defaultAccount}
              onChange={(val) => updateSection('bankCheque', { defaultAccount: val })}
              placeholder="Select Default Bank Account..."
            />
          </div>
        </ConfigRow>
      </SectionCard>

      {/* ── 4. STICKY GLOBAL BOTTOM BAR ── */}
      <div className="sticky bottom-0 z-30 bg-card/95 backdrop-blur-md border-t border-border/80 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] py-2.5 px-4 sm:px-6 lg:px-8 mt-6">
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Left: Global Scope */}
          <div className="flex items-center gap-2">
            <Building2 className="size-4 text-primary shrink-0" />
            <span className="text-xs font-bold text-foreground whitespace-nowrap">
              Effective Company:
            </span>
            <MultiSelect
              value={config.globalEffectiveCompany}
              onChange={updateGlobalEffectiveCompany}
              options={COMPANY_LIST}
              className="w-56"
            />
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={resetAll}
              disabled={!isGlobalDirty}
              className={`inline-flex items-center gap-1.5 h-8.5 px-4 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                isGlobalDirty
                  ? 'text-muted-foreground hover:text-foreground hover:bg-muted/70 active:scale-95'
                  : 'text-muted-foreground/40 cursor-not-allowed'
              }`}
            >
              <RotateCcw className="size-3.5 shrink-0" />
              <span className="whitespace-nowrap">Reset</span>
            </button>

            <button
              type="button"
              onClick={saveAll}
              disabled={!isGlobalDirty}
              className={`inline-flex items-center gap-2 h-8.5 px-5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 transition-all shadow-sm cursor-pointer ${
                isGlobalDirty
                  ? 'bg-primary text-primary-foreground hover:bg-primary/95 shadow-primary/20 active:scale-95'
                  : 'bg-muted/60 text-muted-foreground/50 border border-border/40 cursor-not-allowed shadow-none'
              }`}
            >
              <Check className="size-3.5 stroke-[2.5] shrink-0" />
              <span className="whitespace-nowrap">Apply All Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterConfigPage;
